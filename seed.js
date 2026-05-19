require('dotenv').config();
const mongoose = require('mongoose');

const Student = require('./models/Student');
const Course = require('./models/Course');
const Enrollment = require('./models/Enrollment');

const main = async () => {
  console.log('Connecting to MongoDB...');
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('Connected to MongoDB');

  console.log('Clearing existing data...');
  await Student.deleteMany({});
  await Course.deleteMany({});
  await Enrollment.deleteMany({});
  console.log('Cleared existing data');

  console.log('Creating students...');
  const students = await Student.insertMany([
    {
      first_name: 'Alice',
      last_name: 'Johnson',
      email: 'alice.johnson@email.com',
      date_of_birth: new Date('1995-03-15')
    },
    {
      first_name: 'Bob',
      last_name: 'Smith',
      email: 'bob.smith@email.com',
      date_of_birth: new Date('1992-07-22')
    },
    {
      first_name: 'Carol',
      last_name: 'Williams',
      email: 'carol.williams@email.com',
      date_of_birth: new Date('1998-11-08')
    },
    {
      first_name: 'David',
      last_name: 'Brown',
      email: 'david.brown@email.com'
    },
    {
      first_name: 'Emma',
      last_name: 'Davis',
      email: 'emma.davis@email.com',
      date_of_birth: new Date('1996-01-30')
    }
  ]);
  console.log(`Created ${students.length} students`);

  console.log('Creating courses...');
  const courses = await Course.insertMany([
    {
      title: 'Introduction to Web Development',
      description: 'Learn the fundamentals of HTML, CSS, and JavaScript to build modern websites.',
      level: 'Beginner',
      duration_weeks: 8
    },
    {
      title: 'Node.js Fundamentals',
      description: 'Master server-side JavaScript with Node.js, Express, and MongoDB.',
      level: 'Intermediate',
      duration_weeks: 12
    },
    {
      title: 'Advanced React Patterns',
      description: 'Deep dive into React hooks, context, performance optimization, and advanced patterns.',
      level: 'Advanced',
      duration_weeks: 10
    },
    {
      title: 'Python for Data Science',
      description: 'Introduction to Python programming for data analysis and visualization.',
      level: 'Beginner',
      duration_weeks: 6
    },
    {
      title: 'Database Design and SQL',
      description: 'Learn relational database design principles and advanced SQL queries.',
      level: 'Intermediate',
      duration_weeks: 8
    }
  ]);
  console.log(`Created ${courses.length} courses`);

  console.log('Creating enrollments...');
  const enrollments = await Enrollment.insertMany([
    {
      student: students[0]._id,
      course: courses[0]._id,
      status: 'Completed',
      enrollment_date: new Date('2024-01-15')
    },
    {
      student: students[0]._id,
      course: courses[1]._id,
      status: 'Active',
      enrollment_date: new Date('2024-06-01')
    },
    {
      student: students[1]._id,
      course: courses[0]._id,
      status: 'Active',
      enrollment_date: new Date('2024-07-10')
    },
    {
      student: students[1]._id,
      course: courses[3]._id,
      status: 'Dropped',
      enrollment_date: new Date('2024-02-20')
    },
    {
      student: students[2]._id,
      course: courses[0]._id,
      status: 'Completed',
      enrollment_date: new Date('2024-03-01')
    },
    {
      student: students[2]._id,
      course: courses[1]._id,
      status: 'Active',
      enrollment_date: new Date('2024-05-15')
    },
    {
      student: students[2]._id,
      course: courses[2]._id,
      status: 'Active',
      enrollment_date: new Date('2024-08-01')
    },
    {
      student: students[3]._id,
      course: courses[4]._id,
      status: 'Completed',
      enrollment_date: new Date('2024-04-10')
    },
    {
      student: students[4]._id,
      course: courses[3]._id,
      status: 'Active',
      enrollment_date: new Date('2024-06-20')
    },
    {
      student: students[4]._id,
      course: courses[4]._id,
      status: 'Active',
      enrollment_date: new Date('2024-07-05')
    }
  ]);
  console.log(`Created ${enrollments.length} enrollments`);

  console.log('Seed completed successfully!');

  console.log('\nSummary:');
  console.log(`- Students: ${students.length}`);
  console.log(`- Courses: ${courses.length}`);
  console.log(`- Enrollments: ${enrollments.length}`);

  await mongoose.disconnect();
  console.log('\nDisconnected from MongoDB');
  process.exit(0);
};

main().catch(err => {
  console.error('Error during seeding:', err);
  process.exit(1);
});