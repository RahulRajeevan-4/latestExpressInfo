const Enrollment = require('../models/Enrollment');
const Student = require('../models/Student');
const Course = require('../models/Course');
const { body, validationResult } = require('express-validator');

// Display list of all enrollments.
exports.enrollment_list = async (req, res, next) => {
  try {
    const allEnrollments = await Enrollment.find()
      .populate('student')
      .populate('course')
      .sort({ enrollment_date: -1 })
      .exec();
    res.render('enrollment_list', {
      title: 'All Enrollments',
      enrollment_list: allEnrollments
    });
  } catch (err) {
    next(err);
  }
};

// Display detail page for a specific enrollment.
exports.enrollment_detail = async (req, res, next) => {
  try {
    const enrollment = await Enrollment.findById(req.params.id)
      .populate('student')
      .populate('course')
      .exec();

    if (enrollment === null) {
      const err = new Error('Enrollment not found');
      err.status = 404;
      return next(err);
    }

    res.render('enrollment_detail', {
      title: 'Enrollment Detail',
      enrollment: enrollment
    });
  } catch (err) {
    next(err);
  }
};

// Display enrollment create form on GET.
exports.enrollment_create_get = async (req, res, next) => {
  try {
    const [students, courses] = await Promise.all([
      Student.find().sort({ last_name: 1 }).exec(),
      Course.find().sort({ title: 1 }).exec()
    ]);

    res.render('enrollment_form', {
      title: 'Create Enrollment',
      students: students,
      courses: courses
    });
  } catch (err) {
    next(err);
  }
};

// Handle enrollment create on POST.
exports.enrollment_create_post = [
  // Validate and sanitize fields.
  body('student', 'Student must be selected.')
    .trim()
    .notEmpty()
    .escape(),
  body('course', 'Course must be selected.')
    .trim()
    .notEmpty()
    .escape(),
  body('status', 'Status must be valid.')
    .trim()
    .isIn(['Active', 'Completed', 'Dropped'])
    .escape(),
  body('enrollment_date', 'Invalid enrollment date')
    .optional({ checkFalsy: true })
    .isISO8601()
    .toDate(),

  // Process request after validation and sanitization.
  async (req, res, next) => {
    const errors = validationResult(req);

    // Create Enrollment object with escaped and trimmed data
    const enrollment = new Enrollment({
      student: req.body.student,
      course: req.body.course,
      status: req.body.status || 'Active',
      enrollment_date: req.body.enrollment_date
    });

    if (!errors.isEmpty()) {
      // There are errors. Fetch students and courses for the dropdowns.
      try {
        const [students, courses] = await Promise.all([
          Student.find().sort({ last_name: 1 }).exec(),
          Course.find().sort({ title: 1 }).exec()
        ]);

        res.render('enrollment_form', {
          title: 'Create Enrollment',
          students: students,
          courses: courses,
          enrollment: enrollment,
          errors: errors.array()
        });
      } catch (err) {
        next(err);
      }
      return;
    } else {
      // Data from form is valid.
      try {
        await enrollment.save();
        // Successful - redirect to new enrollment record.
        res.redirect(enrollment.url);
      } catch (err) {
        next(err);
      }
    }
  }
];

// Display enrollment delete form on GET.
exports.enrollment_delete_get = async (req, res, next) => {
  try {
    const enrollment = await Enrollment.findById(req.params.id)
      .populate('student')
      .populate('course')
      .exec();

    if (enrollment === null) {
      res.redirect('/catalog/enrollments');
    }

    res.render('enrollment_delete', {
      title: 'Delete Enrollment',
      enrollment: enrollment
    });
  } catch (err) {
    next(err);
  }
};

// Handle enrollment delete on POST.
exports.enrollment_delete_post = async (req, res, next) => {
  try {
    await Enrollment.findByIdAndDelete(req.body.enrollmentid);
    res.redirect('/catalog/enrollments');
  } catch (err) {
    next(err);
  }
};

// Display enrollment update form on GET.
exports.enrollment_update_get = async (req, res, next) => {
  try {
    const [enrollment, students, courses] = await Promise.all([
      Enrollment.findById(req.params.id).exec(),
      Student.find().sort({ last_name: 1 }).exec(),
      Course.find().sort({ title: 1 }).exec()
    ]);

    if (enrollment === null) {
      const err = new Error('Enrollment not found');
      err.status = 404;
      return next(err);
    }

    res.render('enrollment_form', {
      title: 'Update Enrollment',
      students: students,
      courses: courses,
      enrollment: enrollment
    });
  } catch (err) {
    next(err);
  }
};

// Handle enrollment update on POST.
exports.enrollment_update_post = [
  // Validate and sanitize fields.
  body('student', 'Student must be selected.')
    .trim()
    .notEmpty()
    .escape(),
  body('course', 'Course must be selected.')
    .trim()
    .notEmpty()
    .escape(),
  body('status', 'Status must be valid.')
    .trim()
    .isIn(['Active', 'Completed', 'Dropped'])
    .escape(),
  body('enrollment_date', 'Invalid enrollment date')
    .optional({ checkFalsy: true })
    .isISO8601()
    .toDate(),

  // Process request after validation and sanitization.
  async (req, res, next) => {
    const errors = validationResult(req);

    // Create Enrollment object with escaped and trimmed data.
    const enrollment = new Enrollment({
      student: req.body.student,
      course: req.body.course,
      status: req.body.status || 'Active',
      enrollment_date: req.body.enrollment_date,
      _id: req.params.id // This is required, or a new ID will be assigned!
    });

    if (!errors.isEmpty()) {
      // There are errors. Fetch students and courses for the dropdowns.
      try {
        const [students, courses] = await Promise.all([
          Student.find().sort({ last_name: 1 }).exec(),
          Course.find().sort({ title: 1 }).exec()
        ]);

        res.render('enrollment_form', {
          title: 'Update Enrollment',
          students: students,
          courses: courses,
          enrollment: enrollment,
          errors: errors.array()
        });
      } catch (err) {
        next(err);
      }
      return;
    } else {
      // Data from form is valid. Update the record.
      try {
        const updatedEnrollment = await Enrollment.findByIdAndUpdate(
          req.params.id,
          enrollment,
          {}
        );
        // Successful - redirect to enrollment detail page.
        res.redirect(updatedEnrollment.url);
      } catch (err) {
        next(err);
      }
    }
  }
];