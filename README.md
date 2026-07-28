# AffiliateKit

AffiliateKit is a powerful, open-source affiliate program management and tracking system specifically designed for the iGaming and Casino industry.

> **Status:** This software is currently under active development and is not yet ready for production use.

## Architecture

AffiliateKit uses a modern, type-safe monorepo architecture:

- **Core (Backend):** Built with [AdonisJS](https://adonisjs.com/) and PostgreSQL. Handles rapid tracking link redirects, affiliate data aggregation, and provides a fully type-safe REST API using [Tuyau](https://tuyau.dev/).
- **Dashboard (Frontend):** Built with [Vue.js 3](https://vuejs.org/) + [Vite](https://vitejs.dev/) + [Ant Design Vue](https://www.antdv.com/) + [Tailwind CSS](https://tailwindcss.com/). Provides a lightning-fast admin and affiliate portal.

## Prerequisites

- Node.js (>= 24.0.0)
- [pnpm](https://pnpm.io/) (Package Manager)
- PostgreSQL

## Getting Started

1. **Install Dependencies**
   From the root of the project, install all workspace packages:
   ```bash
   pnpm install
   ```

2. **Database Setup**
   Ensure your PostgreSQL server is running. Copy the environment file and configure your database credentials:
   ```bash
   cd apps/core
   cp .env.example .env
   # Update DB_HOST, DB_USER, DB_PASSWORD, etc. in .env
   ```

3. **Run the Development Server**
   From the root of the project, run the turbo dev script to boot both applications concurrently:
   ```bash
   pnpm run dev
   ```

## License

This project is open-source software licensed under the MIT License.
