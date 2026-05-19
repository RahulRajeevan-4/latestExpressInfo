# Course Tracker

A complete Express.js + MongoDB hands-on exam practice application.

## Project Purpose

This application is designed to help you practice all the concepts needed for a hands-on exam where you must build and deploy an Express application on an AWS EC2 Ubuntu instance.

## Exam Topics Covered

This application covers the following MDN Express/Node.js Local Library tutorial topics:

- Express/Node.js introduction and project setup
- Express Generator-style structure (MVC architecture)
- Pug templating for server-rendered views
- MongoDB database connection
- Mongoose models with schemas, virtuals, and relationships
- Routes and controllers with proper separation of concerns
- Displaying data with populate() for relationships
- Working with forms (GET/POST)
- Validation and sanitization with express-validator
- Full CRUD operations (Create, Read, Update, Delete)
- Delete protection based on dependencies
- Production deployment preparation (PM2 and Nginx)

## Features

- **Dashboard** with statistics for students, courses, and enrollments
- **Full CRUD** for Students, Courses, and Enrollments
- **Relationship management** between Students, Courses, and Enrollments
- **Form validation** with express-validator
- **Delete protection** - Students/Courses with existing enrollments cannot be deleted
- **Clean, responsive UI** with custom CSS
- **Seed script** for quick testing with sample data

## Tech Stack

- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **Pug** - Template engine
- **express-validator** - Validation and sanitization
- **dotenv** - Environment variable management
- **morgan** - HTTP request logger
- **cookie-parser** - Cookie parsing
- **http-errors** - HTTP error creation
- **nodemon** - Development server with auto-reload
- **PM2** - Production process manager (for EC2 deployment)
- **Nginx** - Reverse proxy server (for EC2 deployment)

## Folder Structure

```
course-tracker/
├── bin/
│   └── www              # Server entry point
├── controllers/         # Business logic
│   ├── studentController.js
│   ├── courseController.js
│   └── enrollmentController.js
├── models/             # Mongoose schemas
│   ├── Student.js
│   ├── Course.js
│   └── Enrollment.js
├── routes/             # Express routes
│   └── catalog.js
├── views/              # Pug templates
│   ├── layout.pug
│   ├── index.pug
│   ├── error.pug
│   ├── student_*.pug
│   ├── course_*.pug
│   └── enrollment_*.pug
├── public/
│   └── stylesheets/
│       └── style.css
├── app.js              # Express app configuration
├── seed.js             # Database seeding script
├── package.json
├── .env.example
├── .gitignore
├── README.md
└── STEPS.md
```

## Models and Relationships

### Student
- Represents a person who can enroll in courses
- Fields: first_name, last_name, email (unique), date_of_birth
- Virtual: name (full name), url
- Relationship: has many Enrollments

### Course
- Represents a course catalog item
- Fields: title, description, level (Beginner/Intermediate/Advanced), duration_weeks
- Virtual: url
- Relationship: has many Enrollments

### Enrollment
- Represents a student's enrollment in a course
- Fields: student (ref), course (ref), status (Active/Completed/Dropped), enrollment_date
- Virtual: url
- Relationship: belongs to Student and Course

**Relationship Diagram:**
```
Student 1 ---- many Enrollment ---- 1 Course
```

## Route List

### Dashboard
- `GET /catalog` - Home page with statistics

### Students
- `GET /catalog/students` - List all students
- `GET /catalog/student/create` - Create student form
- `POST /catalog/student/create` - Create student
- `GET /catalog/student/:id` - Student detail with enrollments
- `GET /catalog/student/:id/update` - Update student form
- `POST /catalog/student/:id/update` - Update student
- `GET /catalog/student/:id/delete` - Delete student confirmation
- `POST /catalog/student/:id/delete` - Delete student

### Courses
- `GET /catalog/courses` - List all courses
- `GET /catalog/course/create` - Create course form
- `POST /catalog/course/create` - Create course
- `GET /catalog/course/:id` - Course detail with enrollments
- `GET /catalog/course/:id/update` - Update course form
- `POST /catalog/course/:id/update` - Update course
- `GET /catalog/course/:id/delete` - Delete course confirmation
- `POST /catalog/course/:id/delete` - Delete course

### Enrollments
- `GET /catalog/enrollments` - List all enrollments
- `GET /catalog/enrollment/create` - Create enrollment form
- `POST /catalog/enrollment/create` - Create enrollment
- `GET /catalog/enrollment/:id` - Enrollment detail
- `GET /catalog/enrollment/:id/update` - Update enrollment form
- `POST /catalog/enrollment/:id/update` - Update enrollment
- `GET /catalog/enrollment/:id/delete` - Delete enrollment confirmation
- `POST /catalog/enrollment/:id/delete` - Delete enrollment

## Installation

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or MongoDB Atlas)
- npm or yarn

### Steps

1. Clone or download the project

2. Navigate to the project directory:
```bash
cd course-tracker
```

3. Install dependencies:
```bash
npm install
```

4. Create a `.env` file in the project root

## Creating the .env File

Copy the `.env.example` file to `.env` and update the values:

```bash
cp .env.example .env
```

Edit `.env` with your MongoDB connection string:

```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/course_tracker
PORT=3000
NODE_ENV=development
```

**For local MongoDB:**
```
MONGODB_URI=mongodb://localhost:27017/course_tracker
PORT=3000
NODE_ENV=development
```

## Running the Application

### Development mode (with nodemon):
```bash
npm run dev
```

### Production mode:
```bash
npm start
```

Visit `http://localhost:3000/catalog` in your browser.

## Seeding Sample Data

To populate the database with sample data for testing:

```bash
npm run seed
```

This will:
- Connect to MongoDB
- Clear existing data
- Create 5 sample students
- Create 5 sample courses
- Create 10 sample enrollments
- Display a summary

## Manual Testing Checklist

### Students
1. View the student list at `/catalog/students`
2. Create a new student at `/catalog/student/create`
3. View a student's detail page with their enrollments
4. Update a student's information
5. Try deleting a student with enrollments (should be blocked)
6. Delete a student without enrollments (should work)

### Courses
1. View the course list at `/catalog/courses`
2. Create a new course at `/catalog/course/create`
3. View a course's detail page with enrolled students
4. Update a course's information
5. Try deleting a course with enrollments (should be blocked)
6. Delete a course without enrollments (should work)

### Enrollments
1. View the enrollment list at `/catalog/enrollments`
2. Create a new enrollment at `/catalog/enrollment/create`
3. View an enrollment's detail page
4. Update an enrollment's status
5. Delete an enrollment (should always work)

### Validation Testing
1. Try creating a student without required fields
2. Try creating a student with an invalid email
3. Try creating a student with a duplicate email
4. Try creating a course with invalid duration (outside 1-52)
5. Try creating an enrollment without selecting student or course

## Common Errors and Fixes

### MongoDB Connection Error
```
MongoServerError: Authentication failed
```
- Fix: Check your MONGODB_URI in `.env` file

### Port Already in Use
```
Error: listen EADDRINUSE: address already in use :::3000
```
- Fix: Kill the process using port 3000 or change PORT in `.env`

### Module Not Found
```
Error: Cannot find module 'express'
```
- Fix: Run `npm install`

### Duplicate Key Error
```
MongoServerError: E11000 duplicate key error collection
```
- Fix: Email field has unique index. Use a different email.

## EC2 Deployment Overview

This application is designed for deployment on AWS EC2 Ubuntu instances.

### Key Components:
1. **PM2** - Process manager to keep the app running
2. **Nginx** - Reverse proxy for security and performance
3. **Security Groups** - EC2 firewall rules

## PM2 Commands

### Install PM2 globally:
```bash
sudo npm install -g pm2
```

### Start the application:
```bash
pm2 start ./bin/www --name course-tracker
```

### View status:
```bash
pm2 status
pm2 logs course-tracker
pm2 monit
```

### Restart the application:
```bash
pm2 restart course-tracker
```

### Stop the application:
```bash
pm2 stop course-tracker
```

### Delete the application from PM2:
```bash
pm2 delete course-tracker
```

### Save PM2 configuration (for auto-start on reboot):
```bash
pm2 save
pm2 startup
```
Then run the command suggested by PM2 (usually with sudo).

## Nginx Reverse Proxy Sample Config

Create a file at `/etc/nginx/sites-available/course-tracker`:

```nginx
server {
    listen 80;
    server_name your-ec2-public-ip;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Enable the site:
```bash
sudo ln -s /etc/nginx/sites-available/course-tracker /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

## Security Group Notes

Configure your EC2 security group to allow:
- **SSH (port 22)** - From your IP only
- **HTTP (port 80)** - From anywhere (0.0.0.0/0)
- **HTTPS (port 443)** - From anywhere (if using SSL)
- **Custom (port 3000)** - Keep closed! Only Nginx should access it internally

**DO NOT expose port 3000 directly to the internet.**

## Final Exam Checklist

Before your exam, ensure you can:

- [ ] Set up a new Express.js project with Express Generator structure
- [ ] Configure Pug as the view engine
- [ ] Connect to MongoDB using Mongoose
- [ ] Create Mongoose models with proper fields, validations, and virtuals
- [ ] Set up relationships using ObjectId refs
- [ ] Create routes in Express with proper HTTP methods
- [ ] Implement controllers with async/await and error handling
- [ ] Create Pug views for listing, details, forms, and delete confirmation
- [ ] Handle form submissions with POST requests
- [ ] Implement validation and sanitization with express-validator
- [ ] Use populate() to resolve document references
- [ ] Implement delete protection based on dependencies
- [ ] Use dotenv for environment variables
- [ ] Deploy to Ubuntu EC2 instance
- [ ] Set up PM2 to keep the app running
- [ ] Configure Nginx as a reverse proxy
- [ ] Configure EC2 security groups properly

## License

ISC