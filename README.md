
# Internship Management REST API

## Project Overview
A RESTful API developed using Node.js, Express.js, and SQLite to manage internship records. The API supports CRUD operations, input validation, and pagination.

## Technologies Used
- Node.js
- Express.js
- SQLite
- JavaScript
- REST API

## Features
- Create new internship records
- Retrieve all internship records
- Retrieve an internship by ID
- Update internship details
- Delete internship records
- Input validation for required fields
- Pagination with page and limit parameters
- Persistent storage using SQLite

## Project Structure

internship-management-api/
- database/
  - db.js
  - internships.db
- routes/
  - internshipRoutes.js
- index.js
- package.json
- README.md

## Installation

1. Clone the repository.
2. Install dependencies:

   npm install

3. Start the server:

   node index.js

4. Open:

   http://localhost:3000

## API Endpoints

| Method | Endpoint | Description |
| POST | /api/internships | Create internship |
| GET | /api/internships | Get all internships |
| GET | /api/internships/:id | Get internship by ID |
| PUT | /api/internships/:id | Update internship |
| DELETE | /api/internships/:id | Delete internship |

## Pagination Example

GET /api/internships?page=1&limit=2

## Author
Prateeksha Prabhu
