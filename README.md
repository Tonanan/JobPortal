# JobPortal - Online Job Recruitment Platform

![Java](https://img.shields.io/badge/Java-17-orange)
![Spring Boot](https://img.shields.io/badge/SpringBoot-4.1-green)
![React](https://img.shields.io/badge/React-19-blue)
![MySQL](https://img.shields.io/badge/MySQL-8-blue)
![Docker](https://img.shields.io/badge/Docker-Compose-2496ED)

## Overview

JobPortal is a full-stack recruitment platform designed to connect employers with job seekers through a secure and scalable RESTful API architecture.

The backend is developed with **Java 17**, **Spring Boot**, **Spring Security**, and **Spring Data JPA**, exposing REST APIs protected by **JWT authentication** and **Role-Based Authorization**. The frontend is built with **React** and communicates with the backend using Axios.

The project follows a layered architecture (Controller → Service → Repository) and demonstrates real-world backend development practices including authentication, authorization, DTO mapping, validation, pagination, global exception handling, Docker containerization, and relational database design.

This project was built as a personal portfolio project to strengthen backend engineering skills and simulate the workflow of a real recruitment platform.

## Features

### Authentication

- User registration
- User login
- JWT-based authentication
- BCrypt password encryption
- Stateless authentication
- Role-based authorization

---

### Candidate

- Browse available jobs
- Search jobs by title and location
- View detailed job information
- Apply for jobs
- View application history
- Cancel submitted applications

---

### Employer

- Create job postings
- Edit job postings
- View all posted jobs
- Review candidate applications
- Accept or reject applications
- Dashboard statistics

---

### Administrator

- Manage all job postings
- Access employer-level endpoints
- Full CRUD operations
## Tech Stack

### Backend

- Java 17
- Spring Boot
- Spring Security
- JWT Authentication
- Spring Data JPA (Hibernate)
- Maven

### Database

- MySQL

### Frontend

- React
- Vite
- Axios
- React Router

### DevOps

- Docker
- Docker Compose
- Git
- GitHub

### Development Tools

- Eclipse IDE
- Postman 

## Project Structure

```text
JobPortal
│
├── JobPortal-backend
│   ├── controller
│   ├── service
│   ├── repository
│   ├── entity
│   ├── dto
│   ├── config
│   ├── filter
│   └── exception
│
├── jobportal-ui
│   ├── pages
│   ├── components
│   └── services
│
└── docker-compose.yml
```

## Database Design

<img width="941" height="482" alt="image" src="https://github.com/user-attachments/assets/1054f005-6cac-455d-bc7d-82bb53d978c6" />



### Relationships

- A `User` can submit many `JobApplication` records.
- A `Job` can receive many `JobApplication` records.
- A `Job` is owned by an employer user.

## API Overview

### Authentication

| Method | Endpoint |
|---------|----------|
| POST | /auth/register |
| POST | /auth/login |

### Jobs

| Method | Endpoint |
|---------|----------|
| GET | /jobs |
| GET | /jobs/{id} |
| GET | /jobs/search |
| POST | /jobs |
| PUT | /jobs/{id} |
| DELETE | /jobs/{id} |

### Applications

| Method | Endpoint |
|---------|----------|
| POST | /jobs/{jobId}/apply |
| GET | /jobs/{jobId}/applications |
| PATCH | /jobs/{applicationId} |
| DELETE | /applications/{id} |

### Employer

| Method | Endpoint |
|---------|----------|
| GET | /employer/dashboard |
| GET | /employer/jobs |

## Architecture

The project follows a layered architecture:

- `Controller` handles HTTP requests and maps them to service methods.
- `Service` contains business logic and interacts with repositories.
- `Repository` performs database access for entities.
- `Database` stores persistent data for users, jobs, and applications.
<img width="4184" height="1632" alt="image" src="https://github.com/user-attachments/assets/4194fdb7-29f5-49a3-8e9b-1964f65ff1df" />


### JWT Security Flow

Client → JWT Token → JwtFilter → Spring Security → Controller

## Security Flow

1. Client submits login credentials to `/auth/login`.
<img width="1920" height="1020" alt="image" src="https://github.com/user-attachments/assets/835a576b-2b6a-49b3-99f0-8ab431639dd0" />

2. Server issues a JWT token.
<img width="1920" height="1020" alt="image" src="https://github.com/user-attachments/assets/1f0d3938-3bce-4d6b-b3a5-0044c787a06e" />

3. Client sends the token in the `Authorization` header.
4. `JwtFilter` validates the token.
5. Spring Security sets the authenticated user in `SecurityContext`.
6. Access is granted based on user role.

## Getting Started

### Clone repository

```bash
git clone https://github.com/your-name/jobportal.git
```

### Run with Docker

```bash
docker compose up --build
```

### Backend

```
http://localhost:8080
```

### Frontend

```
http://localhost:5173
```

The frontend is served by Vite and can be started locally using the React project in `jobportal-ui`.

## Environment Variables

Create a `.env` file or configure the following variables:

```text
DB_URL=
DB_USERNAME=
DB_PASSWORD=
JWT_SECRET=
```

Sensitive information should never be committed to source control.
## Screenshots

- Login Page
<img width="1920" height="1020" alt="image" src="https://github.com/user-attachments/assets/8887115d-02bd-4a58-8ea1-1115cfc748cf" />

- Job Listing
<img width="1920" height="1020" alt="image" src="https://github.com/user-attachments/assets/06c773b2-784d-4b2a-a7ed-a25a53d368a0" />

- Job Detail
<img width="1920" height="1020" alt="image" src="https://github.com/user-attachments/assets/7c88f1f3-5444-466b-8380-47dd3fb8c253" />

- Employer Dashboard

<img width="1920" height="1020" alt="image" src="https://github.com/user-attachments/assets/f4df907c-80af-40f5-95d2-a0e08d00dcee" />
![Uploading image.png…]()



## Future Improvements

- Resume upload
- Email notifications
- Swagger/OpenAPI documentation
- Unit and integration testing
- CI/CD pipeline
- Cloud deployment
- Admin analytics dashboard

## Author

**Toàn Thịnh**

Java Backend Developer

GitHub: https://github.com/Tonanan
