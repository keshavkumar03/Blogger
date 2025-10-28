# Full-Stack Blog App (React, Node.js, MySQL)

This is a complete full-stack blog application built with React.js for the frontend and a Node.js/Express backend. It uses a MySQL database for data persistence, JSON Web Tokens (JWT) for user authentication, and Multer for handling image uploads.

## Features

* **User Authentication:** Full user registration and login system.
* **JWT Authorization:** Secure routes using JSON Web Tokens. Users can only edit or delete their own posts.
* **Post Management:** Full CRUD (Create, Read, Update, Delete) functionality for blog posts.
* **File Storage:** Image uploads for posts are handled by the backend using  **Multer** .
* **Rich Text Editor:** Uses `react-quill` for a modern post-creation experience.
* **Dynamic Categories:** Filter posts by category (e.g., Art, Science, Food).

## Technologies Used

### Frontend

* React.js
* React Router (`react-router-dom`)
* Axios (for API requests)
* React Quill (rich text editor)
* Sass (for styling)

### Backend

* Node.js
* Express.js
* MySQL (`mysql`)
* **JSON Web Token (`jsonwebtoken`)** for authentication
* **Multer** for file upload handling
* `bcryptjs` for password hashing
* `cookie-parser`

## Prerequisites

* [Node.js](https://nodejs.org/ "null") (v16 or later)
* [NPM](https://www.npmjs.com/ "null")
* A running [MySQL](https://www.mysql.com/ "null") server

## Setup & Installation

Follow these steps to get the application running locally.

### 1. Clone the Repository

```
git clone [https://github.com/keshavkumar03/Blogger.git](https://github.com/keshavkumar03/Blogger.git)
cd your-repo-name
```

### 2. Backend Setup (API)

1. **Navigate to the API folder and install dependencies:**

   ```
   cd api
   npm install
   ```
2. **Database Setup:**

   * Ensure your MySQL server is running.
   * Create a new database named `blog`.
   * You will need to create two tables: `users` and `posts`. You can use the following SQL queries as a starting point:
     ```
     CREATE TABLE users (
         id INT PRIMARY KEY AUTO_INCREMENT,
         username VARCHAR(45) NOT NULL,
         email VARCHAR(255) NOT NULL,
         password VARCHAR(255) NOT NULL,
         img VARCHAR(255)
     );

     CREATE TABLE posts (
         id INT PRIMARY KEY AUTO_INCREMENT,
         title VARCHAR(255) NOT NULL,
         `desc` TEXT NOT NULL,
         img VARCHAR(255),
         cat VARCHAR(45),
         date DATETIME,
         uid INT NOT NULL,
         FOREIGN KEY (uid) REFERENCES users(id)
             ON DELETE CASCADE
             ON UPDATE CASCADE
     );
     ```
3. **Update Database Connection:**

   * Open `api/db.js` and update your MySQL connection details (password, user, etc.).

   ```
   // api/db.js
   export const db = mysql.createConnection({
     host: "localhost",
     user: "root",
     password: "YOUR_MYSQL_PASSWORD", // <-- Update this
     database: "blog"
   });
   ```
4. **Run the Backend Server:**

   ```
   npm start
   ```

   The backend server will be running on `http://localhost:8800`.

### 3. Frontend Setup (Client)

1. **Navigate to the Client folder (from the root) and install dependencies:**

   ```
   cd ../client
   npm install
   ```
2. **Run the Frontend App:**

   ```
   npm start
   ```

   The React development server will start, and your application will be available at `http://localhost:3000`.

The frontend is configured with a proxy in `package.json` to forward API requests to the backend at `http://localhost:8800`.
