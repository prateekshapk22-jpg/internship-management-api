# Internship Management REST API

A secure RESTful API developed using **Node.js, Express.js, and SQLite** to manage internship records. This project demonstrates backend development, CRUD operations, input validation, pagination, database integration, and API security.

## Project Overview

The Internship Management REST API allows users to create, retrieve, update, and delete internship records through HTTP requests. It uses SQLite for persistent data storage and implements security middleware to protect API endpoints.

## Technologies Used

- **Node.js** – JavaScript runtime environment
- **Express.js** – Backend web framework
- **SQLite** – Relational database
- **JavaScript** – Programming language
- **Zod** – Input validation
- **Helmet** – HTTP security headers
- **CORS** – Cross-Origin Resource Sharing
- **Express Rate Limit** – API request limiting

## Features

### Core Functionality
- Create new internship records
- Retrieve all internship records
- Retrieve a specific internship by ID
- Update existing internship details
- Delete internship records
- Validate input fields
- Support pagination using page and limit parameters
- Store data persistently using SQLite

### Security Features
- Helmet security headers
- CORS origin restrictions
- API rate limiting (100 requests per 15 minutes)
- JSON request body size restriction (10 KB)
- Zod-based input validation
- Centralized error handling
- Parameterized SQL queries

## Project Structure

```text
internship-management-api/
│
├── database/
│   └── db.js
│
├── routes/
│   └── internshipRoutes.js
│
├── index.js
├── package.json
├── package-lock.json
├── .gitignore
└── README.md
```

The SQLite database file is generated locally and excluded from Git tracking.

## Installation and Setup

### 1. Clone the repository

```bash
git clone https://github.com/prateekshapk22-jpg/internship-management-api.git
```

### 2. Navigate to the project directory

```bash
cd internship-management-api
```

### 3. Install dependencies

```bash
npm install
```

### 4. Start the server

```bash
npm start
```

For development with automatic restarts:

```bash
npm run dev
```

The server runs at:

```text
http://localhost:3000
```

## API Endpoints

| HTTP Method | Endpoint | Description |
|---|---|---|
| POST | `/api/internships` | Create a new internship |
| GET | `/api/internships` | Retrieve all internships |
| GET | `/api/internships/:id` | Retrieve an internship by ID |
| PUT | `/api/internships/:id` | Update an internship |
| DELETE | `/api/internships/:id` | Delete an internship |

## Pagination

The API supports pagination through query parameters.

**Example:**

```http
GET /api/internships?page=1&limit=2
```

- `page` specifies the page number.
- `limit` specifies the number of records per page.

## Sample Internship Record

```json
{
  "title": "Backend Developer Intern",
  "company": "Edvyro",
  "location": "Remote",
  "duration": "1 month",
  "stipend": "Unpaid",
  "description": "REST API development using Node.js, Express and SQLite",
  "eligibility": "Engineering students",
  "application_link": "https://example.com/apply"
}
```

## Security Testing

The following security features were tested:

| Security Test | Expected Result | Status |
|---|---|---|
| Helmet headers | Security headers present | Passed |
| Unauthorized CORS origin | HTTP 403 | Passed |
| Oversized JSON request | HTTP 413 | Passed |
| Rate limiting | HTTP 429 | Passed |
| Invalid input validation | HTTP 400 | Passed |

## Author

**Prateeksha Prabhu**

B.E. Computer Science and Engineering (IoT)

Sri Krishna College of Engineering and Technology