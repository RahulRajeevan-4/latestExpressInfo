# Course Tracker - Step-by-Step Implementation

This document describes exactly what was done to build the Course Tracker application.

---

## Step 1: Create the Project Structure

**What was done:**
Created the directory structure for an Express.js application with MVC architecture.

**Why:**
This matches the MDN Express tutorial project structure and provides proper separation of concerns.

**Directories created:**
- `models/` - Mongoose schema definitions
- `routes/` - Express route definitions
- `controllers/` - Business logic
- `views/` - Pug templates
- `public/stylesheets/` - CSS files
- `bin/` - Server entry point

**Command used:**
```bash
mkdir -p models routes controllers views public/stylesheets bin
```

---

## Step 2: Create package.json

**What was done:**
Created the package.json file with all necessary dependencies and scripts.

**Why:**
This defines the project metadata, dependencies, and npm scripts for running the application.

**File:** `package.json`

**Key dependencies:**
- `express` - Web framework
- `mongoose` - MongoDB object modeling
- `pug` - Template engine
- `express-validator` - Validation and sanitization
- `dotenv` - Environment variable management
- `morgan` - HTTP request logger
- `cookie-parser` - Cookie parsing
- `http-errors` - HTTP error creation
- `nodemon` - Development server (dev dependency)

<pre>
npm i express mongoose pug express-validator dotenv morgan cookie-parser http-errors
npm i -D nodemon
</pre>

**NPM scripts:**
- `npm start` - Run production server
- `npm run dev` - Run development server with nodemon
- `npm run seed` - Populate database with sample data

<pre>
"scripts": {
    "start": "node ./bin/www",
    "dev": "nodemon ./bin/www",
    "seed": "node ./seed.js"
  }
</pre>
---

## Step 3: Create Configuration Files

**What was done:**
Created `.env.example`, `.gitignore`, and `bin/www`.

<pre>
touch .env.example .gitignore
touch bin/www
chmod +x bin/www
</pre>

**Why:**
These files provide configuration templates, version control exclusions, and the server entry point.

**Files created:**

### .env.example
Template for environment variables containing:
- `MONGODB_URI` - MongoDB connection string
- `PORT` - Server port (default 3000)
- `NODE_ENV` - Environment (development/production)

<pre>
MONGODB_URI=mongodb://127.0.0.1:27017/my_app_dev
PORT=3000
NODE_ENV=development
</pre>

### .gitignore
Excluded from version control:
- `node_modules/` - Dependencies
- `.env` - Environment variables (contains credentials)
- `.DS_Store` - macOS system files
- `npm-debug.log` - Debug logs
- `logs/` - Log files

<pre>
# Dependencies
node_modules/

# Environment variables
.env
.env.local
.env.*.local

# macOS system files
.DS_Store

# Debug logs
npm-debug.log*
yarn-debug.log*
yarn-error.log*
pnpm-debug.log*

# Log files
logs/
*.log
</pre>

### bin/www
Node.js server entry point that:
- Normalizes the port from environment
- Creates HTTP server using Express app
- Handles server errors
- Listens for server events

---

## Step 4: Create the Express App (app.js)

**What was done:**
Created the main Express application file.

**Why:**
This is the central file that configures the Express application, middleware, and routes.

**File:** `app.js`

**Configuration:**
- Set views directory and Pug as view engine
- Configured middleware: morgan, express.json, express.urlencoded, cookie-parser, static files
- Loaded dotenv for environment variables
- Connected to MongoDB using Mongoose
- Mounted catalog router at `/catalog`
- Set up 404 and error handlers

<pre>
morgan('dev')
app.use(cookieParser());
app.use(express.json())
app.use(express.urlencoded());
app.set("views",path.join(__dirname,"views"));
app.set("view engine","pug");
app.use(express.static(path.join(__dirname, 'public')))
</pre>

---

## Step 5: Create Mongoose Models

**What was done:**
Created three Mongoose models: Student, Course, and Enrollment.

**Why:**
Mongoose models define the database schema, validations, and relationships for MongoDB.

### Student Model (models/Student.js)
**Fields:**
- `first_name` (String, required, max 100)
- `last_name` (String, required, max 100)
- `email` (String, required, unique, trim, lowercase)
- `date_of_birth` (Date, optional)

**Virtuals:**
- `name` - Returns "First Last"
- `url` - Returns "/catalog/student/<id>"

### Course Model (models/Course.js)
**Fields:**
- `title` (String, required, max 200)
- `description` (String, required, max 1000)
- `level` (String, enum: Beginner/Intermediate/Advanced, default: Beginner)
- `duration_weeks` (Number, required, min 1, max 52)

**Virtuals:**
- `url` - Returns "/catalog/course/<id>"

### Enrollment Model (models/Enrollment.js)
**Fields:**
- `student` (ObjectId, ref Student, required)
- `course` (ObjectId, ref Course, required)
- `status` (String, enum: Active/Completed/Dropped, default: Active)
- `enrollment_date` (Date, default Date.now)

**Virtuals:**
- `url` - Returns "/catalog/enrollment/<id>"

---

## Step 6: Create Controllers

**What was done:**
Created three controller files with CRUD operations for each model.

**Why:**
Controllers contain the business logic for handling requests, separating it from routes and views.

### studentController.js
**Functions:**
- `student_list` - Display all students sorted by last name
- `student_detail` - Display student with populated enrollments
- `student_create_get` - Display create form
- `student_create_post` - Validate and create new student
- `student_update_get` - Display update form
- `student_update_post` - Validate and update student
- `student_delete_get` - Display delete confirmation
- `student_delete_post` - Delete student (blocked if has enrollments)

**Validation:**
- First name and last name required
- Email required and must be valid
- Date of birth optional but must be valid if provided

**Delete protection:**
Student cannot be deleted if they have existing enrollments.

### courseController.js
**Functions:**
- `course_list` - Display all courses sorted by title
- `course_detail` - Display course with populated enrollments
- `course_create_get` - Display create form
- `course_create_post` - Validate and create new course
- `course_update_get` - Display update form
- `course_update_post` - Validate and update course
- `course_delete_get` - Display delete confirmation
- `course_delete_post` - Delete course (blocked if has enrollments)

**Validation:**
- Title and description required
- Level must be Beginner, Intermediate, or Advanced
- Duration weeks must be between 1 and 52

**Delete protection:**
Course cannot be deleted if it has existing enrollments.

### enrollmentController.js
**Functions:**
- `enrollment_list` - Display all enrollments with populated student and course
- `enrollment_detail` - Display enrollment detail
- `enrollment_create_get` - Display create form with student/course dropdowns
- `enrollment_create_post` - Validate and create new enrollment
- `enrollment_update_get` - Display update form
- `enrollment_update_post` - Validate and update enrollment
- `enrollment_delete_get` - Display delete confirmation
- `enrollment_delete_post` - Delete enrollment

**Validation:**
- Student and course must be selected
- Status must be Active, Completed, or Dropped
- Enrollment date optional but must be valid if provided

---

## Step 7: Create Routes

**What was done:**
Created the catalog router with all application routes.

**Why:**
Routes define the URL endpoints and map them to controller functions.

**File:** `routes/catalog.js`

**Route order is important:** Static routes (like `/student/create`) must come before dynamic routes (like `/student/:id`).

**Routes defined:**

### Dashboard
- `GET /` or `GET /catalog` - Display dashboard with statistics

### Students
- `GET /catalog/students` → student_list
- `GET /catalog/student/create` → student_create_get (before :id)
- `POST /catalog/student/create` → student_create_post
- `GET /catalog/student/:id` → student_detail
- `GET /catalog/student/:id/update` → student_update_get
- `POST /catalog/student/:id/update` → student_update_post
- `GET /catalog/student/:id/delete` → student_delete_get
- `POST /catalog/student/:id/delete` → student_delete_post

### Courses
- `GET /catalog/courses` → course_list
- `GET /catalog/course/create` → course_create_get (before :id)
- `POST /catalog/course/create` → course_create_post
- `GET /catalog/course/:id` → course_detail
- `GET /catalog/course/:id/update` → course_update_get
- `POST /catalog/course/:id/update` → course_update_post
- `GET /catalog/course/:id/delete` → course_delete_get
- `POST /catalog/course/:id/delete` → course_delete_post

### Enrollments
- `GET /catalog/enrollments` → enrollment_list
- `GET /catalog/enrollment/create` → enrollment_create_get (before :id)
- `POST /catalog/enrollment/create` → enrollment_create_post
- `GET /catalog/enrollment/:id` → enrollment_detail
- `GET /catalog/enrollment/:id/update` → enrollment_update_get
- `POST /catalog/enrollment/:id/update` → enrollment_update_post
- `GET /catalog/enrollment/:id/delete` → enrollment_delete_get
- `POST /catalog/enrollment/:id/delete` → enrollment_delete_post

**Dashboard implementation:**
Uses `Promise.all()` to efficiently run multiple count queries in parallel for:
- Total students
- Total courses
- Total enrollments
- Active enrollments
- Completed enrollments
- Dropped enrollments

---

## Step 8: Create Pug Views

**What was done:**
Created all Pug templates for the application.

**Why:**
Pug templates define the HTML structure and presentation of each page.

### Layout (views/layout.pug)
Base template with:
- HTML5 structure
- Page title variable
- CSS stylesheet link
- Navigation sidebar with links to all pages
- Content block for child templates

### Home (views/index.pug)
Dashboard page displaying:
- Student count
- Course count
- Enrollment count
- Active enrollment count
- Completed enrollment count
- Dropped enrollment count

### Error (views/error.pug)
Generic error page showing error message and stack trace.

### Student Views

#### student_list.pug
Lists all students in a table with actions (View, Edit, Delete).

#### student_detail.pug
Shows student details and all their enrollments with populated course information.

#### student_form.pug
Form for creating and updating students with validation error display.

#### student_delete.pug
Delete confirmation page that also checks for and displays blocking enrollments.

### Course Views

#### course_list.pug
Lists all courses in a table with level badges and actions.

#### course_detail.pug
Shows course details and all enrolled students with populated student information.

#### course_form.pug
Form for creating and updating courses with level dropdown and validation.

#### course_delete.pug
Delete confirmation page that checks for and displays blocking enrollments.

### Enrollment Views

#### enrollment_list.pug
Lists all enrollments with populated student and course details.

#### enrollment_detail.pug
Shows enrollment details with links to student and course.

#### enrollment_form.pug
Form with student and course dropdowns, plus status selector.

#### enrollment_delete.pug
Simple delete confirmation for enrollments (no blocking).

---

## Step 9: Create CSS Stylesheet

**What was done:**
Created a custom CSS stylesheet for styling the application.

**Why:**
CSS makes the application visually appealing and user-friendly without using frameworks.

**File:** `public/stylesheets/style.css`

**Styles include:**
- Layout with sidebar navigation
- Dashboard statistics cards
- Data tables with headers and rows
- Status badges (Active, Completed, Dropped)
- Level badges (Beginner, Intermediate, Advanced)
- Form styling with inputs and buttons
- Error message styling
- Responsive design for mobile devices
- Hover effects and transitions

**Design features:**
- Purple gradient header
- Clean white content cards
- Sidebar with hover effects
- Color-coded status indicators
- Responsive layout that collapses on mobile

---

## Step 10: Create Seed Script

**What was done:**
Created a database seeding script with sample data.

**Why:**
The seed script allows quick testing of the application without manual data entry.

**File:** `seed.js`

**Script functionality:**
1. Connects to MongoDB using MONGODB_URI from .env
2. Clears existing data from all collections
3. Creates 5 sample students
4. Creates 5 sample courses
5. Creates 10 sample enrollments linking students to courses
6. Displays summary of created records
7. Closes database connection

**Sample data includes:**
- Students with names, emails, and dates of birth
- Courses covering web development, Node.js, React, Python, and databases
- Enrollments in various states (Active, Completed, Dropped)

**Command to run:**
```bash
npm run seed
```

---

## Step 11: Local Installation

**What was done:**
Install all project dependencies.

**Why:**
Dependencies must be installed before the application can run.

**Command used:**
```bash
npm install
```

This installs all dependencies listed in package.json.

---

## Step 12: Create .env File

**What was done:**
Create a .env file with MongoDB connection string.

**Why:**
Environment variables keep sensitive data like database credentials out of source code.

**Steps:**
1. Copy .env.example to .env:
```bash
cp .env.example .env
```

2. Edit .env and set MONGODB_URI:
```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/course_tracker
PORT=3000
NODE_ENV=development
```

For local MongoDB:
```
MONGODB_URI=mongodb://localhost:27017/course_tracker
```

---

## Step 13: Run the Application

**What was done:**
Start the application in development mode.

**Why:**
This runs the application and makes it accessible via HTTP.

**Command used:**
```bash
npm run dev
```

**Alternative (production):**
```bash
npm start
```

**Access:**
Open browser to `http://localhost:3000/catalog`

---

## Step 14: Seed Database

**What was done:**
Populate the database with sample data for testing.

**Why:**
Sample data allows quick verification of all features.

**Command used:**
```bash
npm run seed
```

---

## Step 15: Git Commands

**What was done:**
Initialize git repository and make initial commit.

**Why:**
Git provides version control for the project.

**Commands used:**
```bash
git init
git add .
git commit -m "Initial commit: Course Tracker application"
```

---

## EC2 Deployment Commands

The following steps would be used to deploy to an AWS EC2 Ubuntu instance.

### Step 16: Connect to EC2 Instance

```bash
ssh -i your-key.pem ubuntu@your-ec2-public-ip
```

### Step 17: Update and Install Node.js

```bash
sudo apt update
sudo apt install -y nodejs npm
```

For newer Node.js version:
```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs
```

### Step 18: Install MongoDB

```bash
# Import MongoDB public GPG key
wget -qO - https://www.mongodb.org/static/pgp/server-7.0.asc | sudo apt-key add -

# Add MongoDB repository
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu jammy/mongodb-org/7.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-7.0.list

# Install MongoDB
sudo apt update
sudo apt install -y mongodb-org

# Start MongoDB
sudo systemctl start mongod
sudo systemctl enable mongod
```

### Step 19: Clone and Setup Project

```bash
# Clone project (or upload files)
git clone your-repo-url course-tracker
cd course-tracker

# Install dependencies
npm install

# Create .env file
cp .env.example .env
nano .env
```

Edit .env:
```
MONGODB_URI=mongodb://localhost:27017/course_tracker
PORT=3000
NODE_ENV=production
```

### Step 20: Install PM2

```bash
sudo npm install -g pm2
```

### Step 21: Start Application with PM2

```bash
pm2 start ./bin/www --name course-tracker
pm2 save
pm2 startup
```

Run the command suggested by PM2:
```bash
sudo env PATH=$PATH:/usr/bin pm2 startup systemd -u ubuntu --hp /home/ubuntu
```

### Step 22: Install and Configure Nginx

```bash
# Install Nginx
sudo apt install -y nginx

# Create site configuration
sudo nano /etc/nginx/sites-available/course-tracker
```

Add the Nginx configuration (see README.md for full config).

### Step 23: Enable Nginx Site

```bash
# Enable site
sudo ln -s /etc/nginx/sites-available/course-tracker /etc/nginx/sites-enabled/

# Test configuration
sudo nginx -t

# Restart Nginx
sudo systemctl restart nginx
```

### Step 24: Configure Security Group

In AWS Console:
1. Go to EC2 → Security Groups
2. Select your instance's security group
3. Add inbound rules:
   - Type: SSH, Port: 22, Source: Your IP
   - Type: HTTP, Port: 80, Source: 0.0.0.0/0
   - Type: Custom TCP, Port: 3000, Source: (DO NOT ADD - keep closed)

### Step 25: Access the Application

Open browser to:
`http://your-ec2-public-ip`

---

## Debugging Commands

### Check Application Logs
```bash
pm2 logs course-tracker
```

### Monitor Application
```bash
pm2 monit
```

### Check PM2 Status
```bash
pm2 status
```

### Restart Application
```bash
pm2 restart course-tracker
```

### Check MongoDB Status
```bash
sudo systemctl status mongod
```

### Check Nginx Status
```bash
sudo systemctl status nginx
```

### View Nginx Logs
```bash
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log
```

### Check Port Availability
```bash
sudo netstat -tlnp | grep :3000
sudo netstat -tlnp | grep :80
```

---

## Common Deployment Issues

### Issue: MongoDB connection failed
**Solution:**
- Check MongoDB is running: `sudo systemctl status mongod`
- Verify MONGODB_URI in .env
- Check firewall rules

### Issue: Port 3000 already in use
**Solution:**
```bash
pm2 delete course-tracker
pm2 start ./bin/www --name course-tracker
```

### Issue: Nginx 502 Bad Gateway
**Solution:**
- Verify PM2 is running: `pm2 status`
- Check app logs: `pm2 logs course-tracker`
- Verify Nginx proxy_pass points to correct port

### Issue: Cannot access from external IP
**Solution:**
- Check EC2 security group allows HTTP (port 80)
- Verify Nginx is running and configured correctly
- Check that port 3000 is not exposed (only Nginx should be accessible)

---

## Summary

This Course Tracker application demonstrates:
- Full CRUD operations for multiple related models
- MVC architecture with proper separation of concerns
- Form validation and sanitization
- Database relationships with populate()
- Delete protection based on dependencies
- Server-rendered views with Pug
- Production deployment with PM2 and Nginx
- Security best practices with environment variables

Use this application as practice for your hands-on exam!