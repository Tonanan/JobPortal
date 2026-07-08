# JobPortal - Job Recruitment Platform

![Java](https://img.shields.io/badge/Java-17-blue)
![Spring Boot](https://img.shields.io/badge/Spring%20Boot-4.1-brightgreen)
![React](https://img.shields.io/badge/React-19-blue)
![Docker](https://img.shields.io/badge/Docker-Compose-blue)

## Overview

JobPortal is a recruitment platform that connects candidates with employers. It uses a Spring Boot REST API backend, a React frontend, and MySQL as the primary database. Authentication is handled with JWT and role-based access control.

## Features

### Authentication & Authorization

- Register and login flows
- JWT authentication for protected endpoints
- Role-based authorization
- Supported roles:
  - `ADMIN`
  - `EMPLOYER`
  - `CANDIDATE`

### Candidate Features

- View job listings
- Search jobs by title and location
- View job details
- Apply to a job
- Track application status

### Employer Features

- Create job postings
- Update job postings
- Delete job postings
- View candidates for a job
- Review and update application status

### Admin Features

- Admin can access employer-level management endpoints
- Admin can create, update, and delete jobs through protected routes
- Admin can view job applications through the same employer-level access controls

## Tech Stack

### Backend

- Java 17
- Spring Boot
- Spring Security
- JWT
- Spring Data JPA / Hibernate
- MySQL
- Maven

### Frontend

- React
- Vite
- Axios
- React Router

### Deployment

- Docker
- Docker Compose

## Project Structure

JobPortal
├── JobPortal-backend
├── jobportal-ui
├── docker-compose.yml
└── README.md

## Database Design

The main entities in this project are:

- `User`
- `Job`
- `JobApplication`

### Relationships

- A `User` can submit many `JobApplication` records.
- A `Job` can receive many `JobApplication` records.
- A `Job` is owned by an employer user.

## API Overview

### Authentication

- `POST /auth/register`
- `POST /auth/login`

### Jobs

- `GET /jobs`
- `GET /jobs/{id}`
- `GET /jobs/search?title={title}&location={location}`
- `POST /jobs`
- `PUT /jobs/{id}`
- `DELETE /jobs/{id}`

### Applications

- `POST /jobs/{jobId}/apply`
- `GET /jobs/{jobId}/applications`
- `PATCH /jobs/{applicationId}`
- `DELETE /applications/{id}`

### Employer / Admin

- `GET /employer/dashboard`
- `GET /employer/jobs`

## Architecture

The project follows a layered architecture:

- `Controller` handles HTTP requests and maps them to service methods.
- `Service` contains business logic and interacts with repositories.
- `Repository` performs database access for entities.
- `Database` stores persistent data for users, jobs, and applications.

### JWT Security Flow

Client → JWT Token → JwtFilter → Spring Security → Controller

## Security Flow

1. Client submits login credentials to `/auth/login`.
2. Server issues a JWT token.
3. Client sends the token in the `Authorization` header.
4. `JwtFilter` validates the token.
5. Spring Security sets the authenticated user in `SecurityContext`.
6. Access is granted based on user role.

## Running Project

Start backend and database containers with Docker Compose:

```bash
docker compose up --build
```

- Backend: `http://localhost:8080`
- Frontend: `http://localhost:5173`

The frontend is served by Vite and can be started locally using the React project in `jobportal-ui`.

## Environment Configuration

The project uses environment variables for sensitive configuration. Common variables include:

- `DB_URL`
- `DB_USERNAME`
- `DB_PASSWORD`
- `JWT_SECRET`

Do not commit real credentials to source control.

## Screenshots

- Login Page
- Job Listing
- Job Detail
- Employer Dashboard

## Future Improvements

- Upload CV support
- Email notifications for application updates
- Cloud deployment and CI/CD pipeline
- Additional test coverage
- Improved admin dashboard and reporting

## Author

Toàn Thịnh
