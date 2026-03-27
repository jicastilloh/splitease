import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateBalanceDto } from './dto/create-balance.dto';
import { UpdateBalanceDto } from './dto/update-balance.dto';
import { GroupMember } from 'src/group-member/entities/group-member.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { ExpenseSplit } from 'src/expense-split/entities/expense-split.entity';
import { Settlement } from 'src/settlement/entities/settlement.entity';
import { Repository } from 'typeorm';

type NetPosition = {userId: string; name: string; net: number};

@Injectable()
export class BalancesService {
  constructor(
    @InjectRepository(GroupMember) private readonly groupMemberRepository: Repository<GroupMember>,
    @InjectRepository(ExpenseSplit) private readonly expenseSplitRepository: Repository<ExpenseSplit>,
    @InjectRepository(Settlement) private readonly settlementRepository: Repository<Settlement>,
  ) {}

  async getGroupBalances(groupId: string){
    try {
      const members = await this.groupMemberRepository.find({where: {groupId}, relations:['user']});
      if (!members.length) 
        throw new NotFoundException('Grupo no encontrado o sin miembros');

      const netMap = new Map<string , NetPosition>();
      members.forEach((m) =>{
        if (!m.user) throw new NotFoundException(`Usuario no cargado para groupMember ${m.id}`);
        netMap.set(m.userId, {userId: m.userId, name: m.user.name, net: 0});
      });

      const splits = await this.expenseSplitRepository.find(
        {where: {expense: {group: {id: groupId}}}, relations: ['expense', 'fromUser', 'expense.paidBy']},
      );

      for (const split of splits){
        if (!split.expense || !split.expense.paidBy || !split.fromUser) {
          continue;
        }

        const payerId= split.expense.paidBy.id;
        const debtorId = split.fromUser.id;
        const amount = Number(split.amount);

        const payer = netMap.get(payerId);
        const debtor = netMap.get(debtorId);

        if (!payer || !debtor) continue;

        payer.net += amount;
        debtor.net -= amount;
      }

      const settlements = await this.settlementRepository.find({where: [
        {fromUser: {groupMembers: {groupId}}},
        {toUser : {groupMembers: {groupId}}}, 
      ], relations: ['fromUser', 'toUser'],
      });

      for (const st of settlements){
        if (!st.fromUser || !st.toUser) continue;

        const from = netMap.get(st.fromUser.id);
        const to = netMap.get(st.toUser.id);
        if (!from || !to) continue;

        from.net -= Number(st.amount);
        to.net += Number(st.amount);
      }

      const nets = Array.from(netMap.values());
      const debtors = nets.filter((n)=> n.net < 0);
      const creditors = nets.filter((n) => n.net > 0);

      const balances: {from: string; to: string; amount: number}[] = [];
      let i = 0,
        j = 0;
        
      while (i < debtors.length && j < creditors.length){
        const debtor = debtors[i];
        const creditor = creditors[j];
        const amount = Math.min(-debtor.net, creditor.net);

        balances.push({from: debtor.name, to: creditor.name, amount: Number(amount.toFixed(2))});
        debtor.net += amount;
        creditor.net -= amount;
        if(Math.abs(debtor.net) < 0.01) i++;
        if(Math.abs(creditor.net) < 0.01) j++;
      }

      return {
        balances,
        totalDebts: balances.length,
        currency: 'Lps',
        members: nets,
      };

    } catch (error) {
      console.error('Error en getGroupBalances', error);
      throw error;
    }
  }

  async getMyBalance(groupId: string, userId: string) {
    const groupData = await this.getGroupBalances(groupId);
    const member = groupData.members?.find((m: any) => m.userId === userId);

    if (!member) {
      throw new NotFoundException('Usuario no encontrado en el grupo');
    }

    const myNet = member.net;
    return {
      groupId,
      userId,
      myNet,
      iOwe: myNet < 0 ? -myNet : 0,
      owedToMe: myNet > 0 ? myNet : 0,
      currency: groupData.currency,
    };
  }

  create(createBalanceDto: CreateBalanceDto) {
    return 'This action adds a new balance';
  }

  findAll() {
    return `This action returns all balances`;
  }

  findOne(id: number) {
    return `This action returns a #${id} balance`;
  }

  update(id: number, updateBalanceDto: UpdateBalanceDto) {
    return `This action updates a #${id} balance`;
  }

  remove(id: number) {
    return `This action removes a #${id} balance`;
  }
}
