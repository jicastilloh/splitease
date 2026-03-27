import { DataSource } from "typeorm";

export const seed = async (dataSource: DataSource) => {
  const userRepository = dataSource.getRepository("User");
  const groupRepository = dataSource.getRepository("Group");
  const groupMemberRepository = dataSource.getRepository("GroupMember");
  const expenseRepository = dataSource.getRepository("Expense");
  const expenseSplitRepository = dataSource.getRepository("ExpenseSplit");
  const settlementRepository = dataSource.getRepository("Settlement");

 
  await dataSource.query(`
  TRUNCATE TABLE 
    expense_split,
    expense,
    group_member,
    "group",
    "user"
  RESTART IDENTITY CASCADE;
`);

  const user1 = userRepository.create({ name: "Carlos Lopez", email: "carlos.lopez@example.com", password: "password123" });
  const user2 = userRepository.create({ name: "Juan Bennet", email: "juan.bennet@example.com", password: "password123" });
  const user3 = userRepository.create({ name: "Deborah Logan", email: "deborah.logan@example.com", password: "password123" });

  await userRepository.save([user1, user2, user3]);

  const group1 = groupRepository.create({
    name: "Viaje a la playa",
    description: "Gastos del viaje a la playa con amigos",
    currency: "USD",
    createdBy: user1,
  });

  const group2 = groupRepository.create({
    name: "Cena de cumpleaños",
    description: "Gastos de la cena de cumpleaños de Juan",
    currency: "USD",
    createdBy: user2,
  });

  await groupRepository.save([group1, group2]);

  await groupMemberRepository.save([
    groupMemberRepository.create({ user: user1, group: group1, role: "ADMIN" }),
    groupMemberRepository.create({ user: user2, group: group1, role: "MEMBER" }),
    groupMemberRepository.create({ user: user3, group: group1, role: "MEMBER" }),
    groupMemberRepository.create({ user: user1, group: group2, role: "ADMIN" }),
    groupMemberRepository.create({ user: user2, group: group2, role: "MEMBER" }),
  ]);

  const createExpense = async (
    description: string,
    amount: number,
    paidBy: any,
    group: any,
    splitType: "EQUITATIVA" | "EXACTA" | "PERCENTUAL",
  ) => {
    const expense = expenseRepository.create({ description, amount, paidBy, group, splitType });
    return await expenseRepository.save(expense);
  };

  const createSplit = async (expense: any, fromUser: any, amount: number, percentage: number, ispaid = false) => {
    const split = expenseSplitRepository.create({ expense, fromUser, amount, percentage, ispaid });
    return await expenseSplitRepository.save(split);
  };

  const e1 = await createExpense("Alojamiento playa", 600, user1, group1, "EQUITATIVA");
  const e2 = await createExpense("Combustible viaje", 120, user2, group1, "EXACTA");
  const e3 = await createExpense("Cena grupal", 180, user3, group1, "PERCENTUAL");
  const e4 = await createExpense("Entradas museo", 150, user1, group1, "EQUITATIVA");
  const e5 = await createExpense("Pizza cumpleaños", 90, user2, group2, "EXACTA");
  const e6 = await createExpense("Regalo sorpresa", 120, user1, group2, "PERCENTUAL");
  const e7 = await createExpense("Bebidas bar", 60, user2, group2, "EQUITATIVA");
  const e8 = await createExpense("Taxi aeropuerto", 40, user3, group1, "EXACTA");

  await Promise.all([
    createSplit(e1, user1, 200, 33.33, true),
    createSplit(e1, user2, 200, 33.33, false),
    createSplit(e1, user3, 200, 33.34, false),

    createSplit(e2, user1, 40, 33.33, false),
    createSplit(e2, user2, 40, 33.33, true),
    createSplit(e2, user3, 40, 33.34, false),

    createSplit(e3, user1, 90, 50, true),
    createSplit(e3, user2, 54, 30, false),
    createSplit(e3, user3, 36, 20, true),

    createSplit(e4, user1, 50, 33.33, true),
    createSplit(e4, user2, 50, 33.33, false),
    createSplit(e4, user3, 50, 33.34, false),

    createSplit(e5, user1, 45, 50, true),
    createSplit(e5, user2, 45, 50, false),

    createSplit(e6, user1, 60, 50, true),
    createSplit(e6, user2, 60, 50, false),

    createSplit(e7, user1, 30, 50, false),
    createSplit(e7, user2, 30, 50, true),

    createSplit(e8, user1, 15, 37.5, true),
    createSplit(e8, user2, 15, 37.5, false),
    createSplit(e8, user3, 10, 25, false),
  ]);

  console.log("Seed completado exitosamente");

  return {
    users: [user1, user2, user3],
    groups: [group1, group2],
    expenses: [e1, e2, e3, e4, e5, e6, e7, e8],
  };
};