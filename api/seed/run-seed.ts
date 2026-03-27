import { AppDataSource } from '../src/data-source';
import { seed } from './seed';

async function main() {
  await AppDataSource.initialize();
  console.log('DB connected');
  await seed(AppDataSource);
  console.log('Seed completed');
  await AppDataSource.destroy();
}

main().catch((error) => {
  console.error('Seed failed', error);
  process.exit(1);
});