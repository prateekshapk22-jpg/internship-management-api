# Internship Management REST API

A RESTful API built using **Node.js, Express.js, and SQLite** to manage internship records. This project demonstrates backend development concepts, CRUD operations, input validation, pagination, and persistent database storage.

## Project Overview

The Internship Management REST API allows users to create, retrieve, update, and delete internship records through HTTP requests. It uses SQLite for persistent data storage.

## Technologies Used

- **Node.js** – JavaScript runtime environment
- **Express.js** – Backend web framework
- **SQLite** – Relational database
- **JavaScript** – Programming language
- **REST API** – API architecture

## Features

- Create new internship records
- Retrieve all internship records
- Retrieve a specific internship by ID
- Update existing internship details
- Delete internship records
- Validate required input fields
- Support pagination using page and limit parameters
- Store data persistently using SQLite

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

The SQLite database file is generated locally and is excluded from Git tracking.

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
node index.js
```

The server will run at:

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

## Author

**Prateeksha Prabhu**

B.E. Computer Science and Engineering (IoT)

