# Farm-Secure Backend

This is the backend for the Farm-Secure application, a farming management and security platform.

## Technology Stack

- **Framework**: Node.js, Express.js, TypeScript
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Authentication**: JWT (JSON Web Tokens)
- **Caching**: Redis
- **Validation**: Zod
- **File Uploads**: Multer
- **Logging**: Winston

## Getting Started

### Prerequisites

- Node.js (v18 or later)
- npm, yarn, or pnpm
- PostgreSQL
- Redis
- Docker (optional, for database setup)

### Installation

1.  Navigate to the `backend` directory:
    ```sh
    cd backend
    ```
2.  Install dependencies:
    ```sh
    npm install
    ```
3.  Create a `.env` file by copying the example:
    ```sh
    cp .env.example .env
    ```
4.  Update the `.env` file with your database credentials, JWT secrets, and other configurations.

5.  Generate the Prisma client:
    ```sh
    npx prisma generate
    ```

6.  Run database migrations:
    ```sh
    npx prisma migrate dev --name init
    ```

### Running the Application

```sh
# Development mode with auto-reloading
npm run dev

# Production mode
npm run build
npm start
```