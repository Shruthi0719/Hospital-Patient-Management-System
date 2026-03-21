<div align="center">

# 🏥 Hospital Patient Management System

*A full-stack web application for managing hospital patient records*
*with a RESTful backend and persistent database storage.*

![Node.js](https://img.shields.io/badge/Node.js-Backend-339933?style=flat&logo=nodedotjs&logoColor=white)
![Express](https://img.shields.io/badge/Express-REST%20API-000000?style=flat&logo=express)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?style=flat&logo=mongodb&logoColor=white)
![Frontend](https://img.shields.io/badge/Frontend-HTML%20%7C%20CSS%20%7C%20JS-F7DF1E?style=flat&logo=javascript&logoColor=black)
![Status](https://img.shields.io/badge/Status-Completed-2ea44f?style=flat)

</div>

---

## Overview

A complete hospital patient record management system built with a Node.js/Express backend and MongoDB Atlas for persistent storage. Supports full CRUD operations, bulk CSV import/export, and patient search — all accessible through a clean frontend interface.

---

## Features

| Feature | Description |
|---|---|
| **CRUD APIs** | Create, read, update, and delete patient records via RESTful endpoints |
| **MongoDB Atlas** | Cloud-hosted database with unique indexing on patient ID |
| **CSV Support** | Bulk data import and backup through CSV files |
| **Search** | Look up patients by ID or name |
| **Frontend UI** | Browser-based interface for managing records without API calls |

---

## Tech Stack

| Layer | Technologies |
|---|---|
| **Backend** | Node.js · Express |
| **Database** | MongoDB Atlas |
| **Frontend** | HTML · CSS · JavaScript |
| **Tools** | Git · GitHub |

---

## Getting Started

### Prerequisites

- Node.js v16+
- A [MongoDB Atlas](https://www.mongodb.com/atlas) account with a cluster set up

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/your-username/hospital-patient-management.git
cd hospital-patient-management

# 2. Install dependencies
npm install

# 3. Configure environment — create a .env file
MONGO_URI=your_mongodb_connection_string
PORT=3000

# 4. Start the server
node server.js
```

Server runs on `http://localhost:3000`

---

## API Reference

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/patients` | Fetch all patient records |
| `GET` | `/patients/:id` | Fetch a patient by ID |
| `POST` | `/patients` | Add a new patient record |
| `PUT` | `/patients/:id` | Update an existing record |
| `DELETE` | `/patients/:id` | Delete a patient record |
| `GET` | `/patients/search?name=` | Search patients by name |
| `POST` | `/patients/import` | Bulk import via CSV |
| `GET` | `/patients/export` | Export all records as CSV |

---

<div align="center">

Built by [R Shruthi Yadav](https://linkedin.com/in/rshruthiyadav)

</div>
