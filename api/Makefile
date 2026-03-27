	.PHONY: install dev build start test lint clean fmt

install:
    pnpm install

dev:
    pnpm run start:dev

start:
    pnpm run start

build:
    pnpm run build

lint:
    pnpm run lint

test:
    pnpm run test

test-watch:
    pnpm run test -- --watch

coverage:
    pnpm run test -- --coverage

format:
    pnpm run format

clean:
    rm -rf dist node_modules pnpm-lock.yaml
    pnpm install --frozen-lockfile

docker-up:
    docker-compose up -d --build

docker-down:
    docker-compose down
	
migrate:
    pnpm run typeorm migration:run

seed:
    pnpm run seed

env-validate:
    @echo "NODE_ENV=$(NODE_ENV)"
    @echo "PORT=$(PORT)"
    @echo "DB_HOST=$(DB_HOST)"
    @echo "DB_PORT=$(DB_PORT)"
    @echo "DB_USER=$(POSTGRES_USER)"
    @echo "DB_DB=$(POSTGRES_DB)"
    @echo "JWT_SECRET=$(JWT_SECRET)"