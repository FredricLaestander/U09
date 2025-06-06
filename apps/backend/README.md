# Backend

## Getting started

Create a copy of [`.env.example`](.env.example), and fill in you configurations

Install the dependencies:

```bash
bun install
```

Start the docker container:

```bash
docker compose up
```

Generate the prisma client:

```bash
bunx prisma generate
```

Synchronize the prisma schema with the database schema:

```bash
bunx prisma db push
```

Run the project (preferably from the [root](../../README.md)):

```bash
bun run dev
```

Optionally, run prisma studio to see and manage content in the database:

```bash
bunx prisma studio
```

## testing your endpoints

This project has source controlled [yaak](https://yaak.app/) files. To connect your yaak app choose "open existing workspace" and locate the `yaak` folder
