# AI Commerce Bot - Medusa E-commerce Platform

A full-stack e-commerce platform built with Medusa v2 backend, Next.js storefront, and PostgreSQL database. This project provides a modern, headless commerce solution with AI-powered features.

## Table of Contents

- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Project Structure](#project-structure)
- [Installation & Setup](#installation--setup)
- [Running the Application](#running-the-application)
- [Environment Configuration](#environment-configuration)
- [Troubleshooting](#troubleshooting)
- [Development](#development)
- [Additional Resources](#additional-resources)

## Tech Stack

- **Backend**: Medusa v2.10.3 (Node.js/TypeScript)
- **Storefront**: Next.js 15.3.1 with Turbopack
- **Database**: PostgreSQL (via Docker)
- **UI Framework**: React 19 RC, Tailwind CSS
- **ORM**: MikroORM
- **Package Manager**: npm

## Prerequisites

Before setting up the project, ensure you have the following installed:

- **Node.js**: >= 20.0.0 ([Download](https://nodejs.org/))
- **Docker Desktop**: Latest version ([Download](https://www.docker.com/products/docker-desktop/))
- **npm**: Comes with Node.js
- **Git**: For cloning the repository

Verify installations:

```bash
node --version  # Should be >= 20
docker --version
docker compose version  # Note: 'docker compose' not 'docker-compose'
npm --version
```

## Project Structure

```
ai-commerce-bot/
├── my-store/                 # Medusa backend
│   ├── src/
│   │   ├── api/             # Custom API routes
│   │   ├── scripts/         # Database seed scripts
│   │   └── workflows/       # Business logic workflows
│   ├── .env                 # Backend environment variables
│   ├── medusa-config.ts     # Medusa configuration
│   └── package.json
│
├── my-store-storefront/      # Next.js storefront
│   ├── src/
│   │   ├── app/            # Next.js app directory
│   │   ├── lib/            # Utilities and data fetching
│   │   ├── modules/        # UI components
│   │   └── styles/         # Global styles
│   ├── .env                # Storefront environment variables
│   ├── tailwind.config.js  # Tailwind configuration
│   └── package.json
│
├── frontend/                 # AI Commerce Bot frontend (React + Vite + TypeScript)
├── docker-compose.yml        # PostgreSQL database configuration
├── run.sh                    # Quick start script
└── README.md                 # This file
```

## Installation & Setup

Follow these steps carefully to set up the project on a new device:

### 1. Clone the Repository

```bash
git clone <repository-url>
cd ai-commerce-bot
```

### 2. Install Backend Dependencies

```bash
cd my-store
npm install
cd ..
```

### 3. Install Storefront Dependencies

```bash
cd my-store-storefront
npm install
cd ..
```

### 4. Install Frontend Dependencies (AI Commerce Bot)

```bash
cd frontend
npm install
cd ..
```

### 5. Start PostgreSQL Database

```bash
# From the project root directory
docker compose up -d
```

Verify the database is running:

```bash
docker compose ps
```

You should see the `database` service running on port 5432.

### 6. Set Up Backend Environment

Create the backend `.env` file:

```bash
cd my-store
```

Create a file named `.env` with the following content:

```env
MEDUSA_ADMIN_ONBOARDING_TYPE=nextjs
STORE_CORS=http://localhost:8000,https://docs.medusajs.com
ADMIN_CORS=http://localhost:5173,http://localhost:9000,https://docs.medusajs.com
AUTH_CORS=http://localhost:5173,http://localhost:9000,http://localhost:8000,https://docs.medusajs.com
JWT_SECRET=supersecret
COOKIE_SECRET=supersecret
DATABASE_URL=postgres://admin:password@localhost/db
MEDUSA_ADMIN_ONBOARDING_NEXTJS_DIRECTORY=my-store-storefront
```

> **Note**: For production, replace `supersecret` with secure random strings.

### 7. Run Database Migrations

```bash
# From my-store directory
npx medusa db:migrate
```

This will create all required database tables. You should see output like:
```
✔ Migrated Migration20240307161216
✔ Migrated Migration20240210073813
...
Migrations completed
```

### 8. Seed the Database

```bash
# From my-store directory
npm run seed
```

This populates the database with:
- Default regions (Europe)
- Sample products
- Stock locations
- Fulfillment providers
- Publishable API key

### 9. Get the Publishable API Key

After seeding, retrieve the publishable API key:

```bash
# From project root
docker compose exec database psql -U admin -d db -c "SELECT token FROM public.api_key WHERE type = 'publishable';"
```

Copy the token (starts with `pk_`). You'll need this for the next step.

### 10. Set Up Storefront Environment

```bash
cd ../my-store-storefront
```

Create a file named `.env` with the following content:

```env
NEXT_PUBLIC_MEDUSA_BACKEND_URL=http://localhost:9000
MEDUSA_BACKEND_URL=http://localhost:9000
NEXT_PUBLIC_BASE_URL=http://localhost:8000
NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY=<paste-your-publishable-key-here>
NEXT_PUBLIC_DEFAULT_REGION=eu
```

Replace `<paste-your-publishable-key-here>` with the actual key from step 8.

### 11. Return to Project Root

```bash
cd ..
```

## Running the Application

### Quick Start (Recommended)

Use the included startup script that manages all services:

```bash
./run.sh
```

This will:
1. Clean up any processes on ports 3000, 8000, and 9000
2. Start the PostgreSQL database
3. Start the Medusa backend on port 9000
4. Start the Next.js storefront on port 8000

**Access the application:**
- **Storefront**: http://localhost:8000
- **Backend API**: http://localhost:9000
- **Admin Dashboard**: http://localhost:9000/app

To stop all services, press `Ctrl+C` in the terminal.

### Manual Start (Alternative)

If you prefer to run services separately:

#### Terminal 1 - Database
```bash
docker compose up
```

#### Terminal 2 - Backend
```bash
cd my-store
npm run dev
```

#### Terminal 3 - Storefront
```bash
cd my-store-storefront
npm run dev
```

#### Terminal 4 - AI Commerce Bot Frontend (Optional)
```bash
cd frontend
npm run dev
```

The frontend will be available at http://localhost:5173 (default Vite port)

## Environment Configuration

### Backend Environment Variables

Located in `my-store/.env`:

| Variable | Description | Default |
|----------|-------------|---------|
| `DATABASE_URL` | PostgreSQL connection string | `postgres://admin:password@localhost/db` |
| `JWT_SECRET` | Secret for JWT tokens | `supersecret` (change for production) |
| `COOKIE_SECRET` | Secret for session cookies | `supersecret` (change for production) |
| `STORE_CORS` | Allowed origins for store API | `http://localhost:8000` |
| `ADMIN_CORS` | Allowed origins for admin API | `http://localhost:9000` |

### Storefront Environment Variables

Located in `my-store-storefront/.env`:

| Variable | Description | Example |
|----------|-------------|---------|
| `MEDUSA_BACKEND_URL` | Backend URL (server-side) | `http://localhost:9000` |
| `NEXT_PUBLIC_MEDUSA_BACKEND_URL` | Backend URL (client-side) | `http://localhost:9000` |
| `NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY` | API key for storefront | `pk_...` (from database) |
| `NEXT_PUBLIC_DEFAULT_REGION` | Default region code | `eu` or `us` |
| `NEXT_PUBLIC_BASE_URL` | Storefront base URL | `http://localhost:8000` |

## Troubleshooting

### Common Issues and Solutions

#### 1. "docker-compose: command not found"

**Solution**: Modern Docker uses `docker compose` (space, not hyphen):

```bash
# Old syntax (deprecated)
docker-compose up

# New syntax (correct)
docker compose up
```

If `docker compose` doesn't work, update Docker Desktop to the latest version.

#### 2. "Module not found: Can't resolve '@lib/util/...'"

**Cause**: Missing library files in the storefront.

**Solution**: Ensure the `my-store-storefront/src/lib/` directory exists with all utility files. These should have been included when you cloned the repo. If missing, the lib directory should contain:
- `lib/util/` - Utility functions (money, env, product, etc.)
- `lib/data/` - API data fetching functions
- `lib/context/` - React contexts
- `lib/hooks/` - Custom React hooks

#### 3. Tailwind CSS Import Errors

**Error**: `Module not found: Can't resolve 'tailwindcss/base'`

**Solution**: The `globals.css` file should use `@tailwind` directives, not `@import`:

```css
/* Correct */
@tailwind base;
@tailwind components;
@tailwind utilities;

/* Incorrect (old syntax) */
@import "tailwindcss/base";
```

Also ensure these config files exist:
- `my-store-storefront/tailwind.config.js`
- `my-store-storefront/postcss.config.js`

#### 4. Database Connection Errors

**Error**: `relation "public.tax_provider" does not exist`

**Solution**: Run migrations:

```bash
cd my-store
npx medusa db:migrate
```

#### 5. "No regions found" Error

**Cause**: Database not seeded or middleware can't fetch regions.

**Solution**:
1. Ensure database is seeded: `npm run seed` (from my-store directory)
2. Check `MEDUSA_BACKEND_URL` is set correctly in storefront `.env`
3. Verify backend is running on port 9000

#### 6. Port Already in Use

**Error**: `EADDRINUSE: address already in use :::9000`

**Solution**: Kill processes using the ports:

```bash
# Kill process on port 9000
lsof -ti:9000 | xargs kill -9

# Kill process on port 8000
lsof -ti:8000 | xargs kill -9
```

Or use the run.sh script which automatically cleans up ports.

#### 7. Storefront Shows 404 Errors

**Cause**: Middleware can't connect to backend or publishable key is wrong.

**Solution**:
1. Verify backend is running: `curl http://localhost:9000/health`
2. Check publishable API key is correct in `.env`
3. Restart the storefront after changing `.env` variables

## Development

### Accessing the Admin Panel

1. Start the backend: `cd my-store && npm run dev`
2. Open http://localhost:9000/app
3. Create an admin user if prompted:

```bash
cd my-store
npx medusa user -e admin@example.com -p supersecret
```

### Adding Products

1. Access admin panel at http://localhost:9000/app
2. Navigate to "Products" section
3. Click "New Product"
4. Fill in product details and save

Products should appear in the storefront immediately.

### API Endpoints

**Store API** (public):
- Base URL: `http://localhost:9000/store`
- Get regions: `GET /store/regions`
- Get products: `GET /store/products`

**Admin API** (authenticated):
- Base URL: `http://localhost:9000/admin`
- Requires admin authentication token

### Database Management

**View all tables:**
```bash
docker compose exec database psql -U admin -d db -c "\dt"
```

**Query data:**
```bash
docker compose exec database psql -U admin -d db -c "SELECT * FROM product LIMIT 5;"
```

**Reset database** (warning: deletes all data):
```bash
docker compose down -v
docker compose up -d
cd my-store && npx medusa db:migrate && npm run seed
```

### Project Scripts

**Backend (my-store):**
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run seed` - Seed database with demo data

**Storefront (my-store-storefront):**
- `npm run dev` - Start development server with Turbopack
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Additional Resources

### Documentation

- [Medusa Documentation](https://docs.medusajs.com)
- [Medusa V2 Learning Path](https://docs.medusajs.com/v2/learn)
- [Next.js Documentation](https://nextjs.org/docs)
- [Medusa Admin Guide](https://docs.medusajs.com/user-guide)

### Useful Links

- [Medusa Discord Community](https://discord.gg/medusajs)
- [Medusa GitHub Repository](https://github.com/medusajs/medusa)
- [Next.js Starter Template](https://github.com/medusajs/nextjs-starter-medusa)

### Key Technologies

- **Medusa**: Open-source headless commerce engine
- **Next.js**: React framework with server-side rendering
- **MikroORM**: TypeScript ORM for Node.js
- **PostgreSQL**: Relational database
- **Tailwind CSS**: Utility-first CSS framework
- **Docker**: Containerization platform

## Support

If you encounter issues not covered in this README:

1. Check the [Troubleshooting](#troubleshooting) section
2. Review [Medusa Documentation](https://docs.medusajs.com)
3. Search [Medusa GitHub Issues](https://github.com/medusajs/medusa/issues)
4. Ask in [Medusa Discord](https://discord.gg/medusajs)

## License

[Add your license information here]

---

**Happy coding!** If you found this helpful, consider starring the repository.
