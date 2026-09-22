# DeskFlow

DeskFlow is a web application for managing internal support tickets.

The application allows support teams to create, view, update, and delete tickets, assign tickets manually or automatically, and quickly find tickets using search, filtering, and pagination.

The project was developed as a technical challenge for Codificar Sistemas Tecnológicos.

## Live Demo

https://sistema-chamados-codificar-frontend.onrender.com

## Features

- Create, view, update, and delete support tickets
- Ticket priorities: Low, Medium, and High
- Ticket statuses: Open, In Progress, Resolved, and Closed
- Manual ticket assignment
- Automatic ticket assignment based on the current support workload
- Search tickets by title, priority, or responsible person
- Filter tickets by priority
- Paginated ticket list
- English and Portuguese interface
- Persisted language preference
- Responsive interface for desktop and mobile

## Tech Stack

### Frontend

- React
- TypeScript
- Vite
- Material UI (MUI)
- React Router
- i18next / react-i18next

### Backend

- Node.js
- Express
- TypeScript
- Prisma
- PostgreSQL

### Development

- Git / GitHub
- REST API
- ESLint

## Architecture

The project is organized into two separate applications:

- `frontend/` contains the React client application and communicates with the backend through a REST API.
- `backend/` contains the Express API, business logic, database access, and ticket management endpoints.

The backend follows a simple layered structure:

- **Routes** define the available API endpoints.
- **Controllers** handle requests, validation, and application logic.
- **Prisma** handles database access.
- **PostgreSQL** stores tickets and support people.

The frontend is organized around reusable React components and pages, with API communication separated from the UI components.

The application is deployed with the frontend and backend as separate services. The frontend is hosted as a Render Static Site, while the backend runs as a Render Web Service. PostgreSQL is hosted on Neon.

## Automatic Assignment

Tickets can be assigned either manually or automatically.

When automatic assignment is selected, the system checks the current workload of each support person and assigns the ticket to the person with the fewest currently open tickets.

For this project, a ticket is considered **currently open** when its status is either:

- `OPEN`
- `IN_PROGRESS`

Tickets with `RESOLVED` or `CLOSED` status are not included in the workload calculation.

This approach keeps the assignment logic simple and appropriate for a small support team while distributing active tickets across available support people.

## Project Structure

```text
sistema-chamados-codificar/

├── backend/
│   ├── prisma/
│   │   ├── migrations/
│   │   ├── schema.prisma
│   │   └── seed.ts
│   ├── src/
│   │   ├── controllers/
│   │   ├── lib/
│   │   ├── routes/
│   │   └── server.ts
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── i18n/
│   │   ├── types/
│   │   ├── api/
│   │   ├── App.tsx
│   │   └── main.tsx
│   └── package.json
│
└── README.md
```

## Setup

### Prerequisites

Make sure the following are installed:

- Node.js
- npm
- PostgreSQL

### 1. Clone the repository

```bash
git clone https://github.com/karimmenem/sistema-chamados-codificar.git
cd sistema-chamados-codificar
```

### 2. Backend setup

```bash
cd backend
npm install
```

Create a `.env` file inside the `backend/` directory:

```env
DATABASE_URL="postgresql://USER:PASSWORD@localhost:5432/DATABASE_NAME"
```

Run the database migrations:

```bash
npx prisma migrate dev
```

Seed the database with the initial support people:

```bash
npx prisma db seed
```

Start the backend:

```bash
npm run dev
```

The backend will run on `http://localhost:3000`.

### 3. Frontend setup

Open a new terminal:

```bash
cd frontend
npm install
npm run dev
```

The frontend will run on the URL provided by Vite, typically `http://localhost:5173`.

## Testing

### Frontend

Run the TypeScript type check:

```bash
cd frontend
npm run typecheck
```

Build the production frontend:

```bash
npm run build
```

### Backend

Run the TypeScript type check:

```bash
cd backend
npm run typecheck
```

Build the production backend:

```bash
npm run build
```

## Technical Decisions

- **React + TypeScript:** Provides a structured and type-safe frontend suitable for a small internal application.

- **Material UI:** Provides reusable components and responsive behavior while keeping the interface consistent.

- **Node.js + Express:** Keeps the backend lightweight and straightforward for the scope of the project.

- **Prisma + PostgreSQL:** Provides structured database access and type-safe interaction with the relational database.

- **REST API:** Keeps the frontend and backend separated, making the application easier to maintain and extend.

- **Client-side search, filtering, and pagination:** The current implementation keeps the interface simple and is appropriate for the expected scale of a small internal support system.

- **Automatic assignment:** Active workload is calculated using `OPEN` and `IN_PROGRESS` tickets so resolved and closed tickets do not affect future assignments.

- **Internationalization:** English and Portuguese are supported, with the selected language persisted in local storage.

## Notes

This project was developed as a technical challenge with a focus on clean structure, maintainability, responsive UI, validation, and the required ticket management functionality.