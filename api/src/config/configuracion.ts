export default () => ({
    port: parseInt(process.env.PORT ?? '3000', 10),
    database: {
      host: process.env.DB_HOST ?? 'localhost',
      port: parseInt(process.env.DB_PORT ?? '5432', 10),
      user: process.env.POSTGRES_USER ?? '',
      db: process.env.POSTGRES_DB ?? '',
      password: process.env.POSTGRES_PASSWORD ?? '',
    },
  });
  