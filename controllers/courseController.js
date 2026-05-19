const Course = require('../models/Course');
const Enrollment = require('../models/Enrollment');
const { body, validationResult } = require('express-validator');

// Display list of all courses.
exports.course_list = async (req, res, next) => {
  try {
    const allCourses = await Course.find().sort({ title: 1 }).exec();
    res.render('course_list', {
      title: 'All Courses',
      course_list: allCourses
    });
  } catch (err) {
    next(err);
  }
};

// Display detail page for a specific course.
exports.course_detail = async (req, res, next) => {
  try {
    const course = await Course.findById(req.params.id).exec();

    if (course === null) {
      const err = new Error('Course not found');
      err.status = 404;
      return next(err);
    }

    // Get all enrollments for this course, populate with student details
    const enrollments = await Enrollment.find({ course: req.params.id })
      .populate('student')
      .sort({ enrollment_date: -1 })
      .exec();

    res.render('course_detail', {
      title: 'Course: ' + course.title,
      course: course,
      enrollments: enrollments
    });
  } catch (err) {
    next(err);
  }
};

// Display course create form on GET.
exports.course_create_get = async (req, res, next) => {
  res.render('course_form', {
    title: 'Create Course'
  });
};

// Handle course create on POST.
exports.course_create_post = [
  // Validate and sanitize fields.
  body('title', 'Title must not be empty.')
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body('description', 'Description must not be empty.')
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body('level', 'Level must be valid.')
    .trim()
    .isIn(['Beginner', 'Intermediate', 'Advanced'])
    .escape(),
  body('duration_weeks', 'Duration must be between 1 and 52.')
    .trim()
    .isInt({ min: 1, max: 52 })
    .escape(),

  // Process request after validation and sanitization.
  async (req, res, next) => {
    const errors = validationResult(req);

    // Create Course object with escaped and trimmed data
    const course = new Course({
      title: req.body.title,
      description: req.body.description,
      level: req.body.level || 'Beginner',
      duration_weeks: req.body.duration_weeks
    });

    if (!errors.isEmpty()) {
      // There are errors. Render form again with sanitized values/error messages.
      res.render('course_form', {
        title: 'Create Course',
        course: course,
        errors: errors.array()
      });
      return;
    } else {
      // Data from form is valid.
      try {
        await course.save();
        // Successful - redirect to new course record.
        res.redirect(course.url);
      } catch (err) {
        next(err);
      }
    }
  }
];

// Display course delete form on GET.
exports.course_delete_get = async (req, res, next) => {
  try {
    const course = await Course.findById(req.params.id).exec();

    if (course === null) {
      res.redirect('/catalog/courses');
    }

    // Check if course has enrollments
    const enrollments = await Enrollment.find({ course: req.params.id }).exec();

    res.render('course_delete', {
      title: 'Delete Course',
      course: course,
      enrollments: enrollments
    });
  } catch (err) {
    next(err);
  }
};

// Handle course delete on POST.
exports.course_delete_post = async (req, res, next) => {
  try {
    const course = await Course.findById(req.params.id).exec();
    const enrollments = await Enrollment.find({ course: req.params.id }).exec();

    if (enrollments.length > 0) {
      // Course has enrollments. Render in same way as for GET route.
      res.render('course_delete', {
        title: 'Delete Course',
        course: course,
        enrollments: enrollments,
        error: 'Course cannot be deleted because it has existing enrollments.'
      });
      return;
    } else {
      // Course has no enrollments. Delete object and redirect to the list of courses.
      await Course.findByIdAndDelete(req.body.courseid);
      res.redirect('/catalog/courses');
    }
  } catch (err) {
    next(err);
  }
};

// Display course update form on GET.
exports.course_update_get = async (req, res, next) => {
  try {
    const course = await Course.findById(req.params.id).exec();

    if (course === null) {
      const err = new Error('Course not found');
      err.status = 404;
      return next(err);
    }

    res.render('course_form', {
      title: 'Update Course',
      course: course
    });
  } catch (err) {
    next(err);
  }
};

// Handle course update on POST.
exports.course_update_post = [
  // Validate and sanitize fields.
  body('title', 'Title must not be empty.')
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body('description', 'Description must not be empty.')
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body('level', 'Level must be valid.')
    .trim()
    .isIn(['Beginner', 'Intermediate', 'Advanced'])
    .escape(),
  body('duration_weeks', 'Duration must be between 1 and 52.')
    .trim()
    .isInt({ min: 1, max: 52 })
    .escape(),

  // Process request after validation and sanitization.
  async (req, res, next) => {
    const errors = validationResult(req);

    // Create Course object with escaped and trimmed data.
    const course = new Course({
      title: req.body.title,
      description: req.body.description,
      level: req.body.level || 'Beginner',
      duration_weeks: req.body.duration_weeks,
      _id: req.params.id // This is required, or a new ID will be assigned!
    });

    if (!errors.isEmpty()) {
      // There are errors. Render form again with sanitized values/error messages.
      res.render('course_form', {
        title: 'Update Course',
        course: course,
        errors: errors.array()
      });
      return;
    } else {
      // Data from form is valid. Update the record.
      try {
        const updatedCourse = await Course.findByIdAndUpdate(
          req.params.id,
          course,
          {}
        );
        // Successful - redirect to course detail page.
        res.redirect(updatedCourse.url);
      } catch (err) {
        next(err);
      }
    }
  }
];