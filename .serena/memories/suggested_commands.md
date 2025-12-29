# Suggested Commands

The following commands can be run from the project root:

- `yarn`: Install all dependencies.
- `yarn dev`: Start both the frontend and the local Hardhat node/contracts in development mode.
- `yarn dev:web-app`: Start only the Next.js frontend.
- `yarn dev:contracts`: Start only the Hardhat environment.
- `yarn lint`: Run ESLint and Solhint across all packages.
- `yarn prettier`: Check code formatting.
- `yarn prettier:write`: Automatically fix code formatting issues.

## Package-Specific Commands

### apps/contracts

- `yarn workspace monorepo-ethers-contracts hardhat test`: Run smart contract tests.
- `yarn workspace monorepo-ethers-contracts hardhat compile`: Compile smart contracts.

### apps/web-app

- `yarn workspace monorepo-ethers-web-app dev`: Run frontend dev server.
