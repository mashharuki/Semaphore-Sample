# Code Style and Conventions

## General

- Use **TypeScript** for all new code.
- Follow **Prettier** formatting rules (Tab width: 2).
- Use **ESLint** for static analysis (and **Solhint** for Solidity).
- Comments and documentation should be in **Japanese** as a primary preference.
- All files must use **2-space indentation**.

## Smart Contracts

- Use **Hardhat** for development and testing.
- Contracts are located in `apps/contracts/contracts/`.
- Tests are located in `apps/contracts/test/`.
- Follow Solidity best practices.

## Frontend

- Use **Next.js App Router** (files in `apps/web-app/src/app/`).
- Use Functional Components and Hooks.
- Context providers are located in `apps/web-app/src/context/`.
- Utility functions are in `apps/web-app/src/utils/`.
- Components are in `apps/web-app/src/components/`.
- **Supabase** is used for Authentication and Database.
- Semaphore Identities are stored securely in Supabase `identities` table.
