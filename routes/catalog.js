const express = require('express');
const router = express.Router();
const studentController = require('../controllers/studentController');
const courseController = require('../controllers/courseController');
const enrollmentController = require('../controllers/enrollmentController');

// HOME PAGE
router.get('/', async (req, res, next) => {
  try {
    const Student = require('../models/Student');
    const Course = require('../models/Course');
    const Enrollment = require('../models/Enrollment');

    const [
      studentCount,
      courseCount,
      enrollmentCount,
      activeCount,
      completedCount,
      droppedCount
    ] = await Promise.all([
      Student.countDocuments({}).exec(),
      Course.countDocuments({}).exec(),
      Enrollment.countDocuments({}).exec(),
      Enrollment.countDocuments({ status: 'Active' }).exec(),
      Enrollment.countDocuments({ status: 'Completed' }).exec(),
      Enrollment.countDocuments({ status: 'Dropped' }).exec()
    ]);

    res.render('index', {
      title: 'Course Tracker Dashboard',
      student_count: studentCount,
      course_count: courseCount,
      enrollment_count: enrollmentCount,
      active_count: activeCount,
      completed_count: completedCount,
      dropped_count: droppedCount
    });
  } catch (err) {
    next(err);
  }
});

// STUDENT ROUTES
router.get('/students', studentController.student_list);

// Student create GET must come before student/:id (dynamic route)
router.get('/student/create', studentController.student_create_get);
router.post('/student/create', studentController.student_create_post);

router.get('/student/:id', studentController.student_detail);
router.get('/student/:id/update', studentController.student_update_get);
router.post('/student/:id/update', studentController.student_update_post);
router.get('/student/:id/delete', studentController.student_delete_get);
router.post('/student/:id/delete', studentController.student_delete_post);

// COURSE ROUTES
router.get('/courses', courseController.course_list);

// Course create GET must come before course/:id (dynamic route)
router.get('/course/create', courseController.course_create_get);
router.post('/course/create', courseController.course_create_post);

router.get('/course/:id', courseController.course_detail);
router.get('/course/:id/update', courseController.course_update_get);
router.post('/course/:id/update', courseController.course_update_post);
router.get('/course/:id/delete', courseController.course_delete_get);
router.post('/course/:id/delete', courseController.course_delete_post);

// ENROLLMENT ROUTES
router.get('/enrollments', enrollmentController.enrollment_list);

// Enrollment create GET must come before enrollment/:id (dynamic route)
router.get('/enrollment/create', enrollmentController.enrollment_create_get);
router.post('/enrollment/create', enrollmentController.enrollment_create_post);

router.get('/enrollment/:id', enrollmentController.enrollment_detail);
router.get('/enrollment/:id/update', enrollmentController.enrollment_update_get);
router.post('/enrollment/:id/update', enrollmentController.enrollment_update_post);
router.get('/enrollment/:id/delete', enrollmentController.enrollment_delete_get);
router.post('/enrollment/:id/delete', enrollmentController.enrollment_delete_post);

module.exports = router;