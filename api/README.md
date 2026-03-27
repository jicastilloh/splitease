<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

# SplitEase API

[![Node.js](https://img.shields.io/badge/node-%3E%3D18-green)](...)
[![NestJS](https://img.shields.io/badge/NestJS-%5E11.0-blue)](...)
[![License](https://img.shields.io/badge/license-MIT-blue)](...)

## Descripción

SplitEase es una API para gestionar grupos y gastos compartidos...
- autenticación JWT
- CRUD grupos/miembros/gastos/liquidaciones
- división de gastos (equitativa, exacta, porcentual)
- reportes de saldo

## Contenido

- [Diagrama ER](#diagrama-er)
- [Instalación](#instalación)
- ...

## Diagrama ER

![Diagrama ER](docs/er-diagram.png)

- `User`, `Group`, `GroupMember`, `Expense`, `ExpenseSplit`, `Settlement`
- FK: `expense_split.expense -> expense`, `group_member.user -> user`...

## Requisitos

- Node 18+
- pnpm
- Docker + Postgres (o local)

## Setup local

```
pnpm install
cp .env.example .env
# ajustar DB_HOST, DB_PORT, JWT_SECRET, etc
pnpm run start:dev
```

## Setup Docker (docker-compose)

```
docker compose up --build -d
```

## Variables de entorno

```
DB_HOST
DB_PORT
POSTGRES_USER
POSTGRES_PASSWORD
POSTGRES_DB
JWT_SECRET
PORT
```

## Swagger

URL (cuando la app está arriba)
```
http://localhost:4000/api
```

## Test 

```
pnpm run test
pnpm run test:e2e
pnpm run test:cov
```

