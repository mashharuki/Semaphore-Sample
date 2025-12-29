# Project Overview: Semaphore-Sample

This project is a monorepo template for building applications with the Semaphore Protocol. It demonstrates a basic use case of anonymous group membership and signal broadcasting (feedback).

## Tech Stack

- **Monorepo Manager**: Yarn 4 (Berry)
- **Programming Language**: TypeScript
- **Smart Contracts**: Solidity, Hardhat
- **Frontend**: Next.js (App Router), React, Vanilla CSS
- **Backend/Auth**: Supabase (Auth, PostgreSQL)
- **Protocol**: Semaphore Protocol
- **Client Library**: SemaphoreEthers

## Authentication Flow

- **Exclusive Web3 Wallet Login**: Only Ethereum wallet authentication is supported via Supabase.
- **Identity Recovery**: Semaphore Identities (private keys) are stored in the Supabase `identities` table and automatically recovered upon successful login.
- **Identity Protection**: The UI prevents identity regeneration if one already exists for the logged-in user.

## Multi-Package Structure

- `apps/contracts`: Smart contract development, testing, and deployment.
- `apps/web-app`: Next.js frontend application.
