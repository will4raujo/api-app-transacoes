# NestJS Project with PostgreSQL and Docker

### This project uses Node.js with the NestJS framework, PostgreSQL as the database, and Docker to simplify environment setup and execution.

### Prerequisites

Before starting, make sure you have the following software installed on your machine:

- Docker
- Node.js (LTS version recommended)
- Docker Compose

## Setup Instructions
1. **Clone the repository**

Make a copy of the remote repository on your computer:

```sh
git clone https://github.com/will4raujo/api-teste-fastpay.git
```
2. **Install dependencies**

Install Node.js dependencies using the command inside folder "api_teste_fastpay":

```sh
npm install
```
3. **Configure Docker**
Create and start Docker containers using the command:

```sh
docker-compose up -d
docker ps
```

Ensure the containers have started correctly:

4. **Check ports**

Verify that ports 5433 (PostgreSQL) and 3333 (NestJS) are free:

```sh
netstat -an | find "5433"
netstat -an | find "3333"
```
**Note:** If the port is different from 3333, make sure to change the api.ts file in the frontend to the desired port.

5. **Run the seed script**

Populate the database with predefined categories:

```sh
npm run seed
```

6. **Start the application**

Start the application in development mode:

```sh
npm run start:dev
```

7. **Environment Variables**

Ensure that the environment variables in the .env file are correctly configured, especially DATABASE_URL for the 
PostgreSQL database connection.
Example:

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5433/nest-teste-wa?schema=public"
JWT_SECRET="yaptsaf"
```

8. **Port Conflicts**

If there are port conflicts, adjust the ports in the docker-compose.yml file and the application settings accordingly.