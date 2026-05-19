const Student = require('../models/Student');
const Enrollment = require('../models/Enrollment');
const { body, validationResult } = require('express-validator');

// Display list of all students.
exports.student_list = async (req, res, next) => {
  try {
    const allStudents = await Student.find().sort({ last_name: 1 }).exec();
    res.render('student_list', {
      title: 'All Students',
      student_list: allStudents
    });
  } catch (err) {
    next(err);
  }
};

// Display detail page for a specific student.
exports.student_detail = async (req, res, next) => {
  try {
    const student = await Student.findById(req.params.id).exec();

    if (student === null) {
      const err = new Error('Student not found');
      err.status = 404;
      return next(err);
    }

    // Get all enrollments for this student, populate with course details
    const enrollments = await Enrollment.find({ student: req.params.id })
      .populate('course')
      .sort({ enrollment_date: -1 })
      .exec();

    res.render('student_detail', {
      title: 'Student: ' + student.name,
      student: student,
      enrollments: enrollments
    });
  } catch (err) {
    next(err);
  }
};

// Display student create form on GET.
exports.student_create_get = async (req, res, next) => {
  res.render('student_form', {
    title: 'Create Student'
  });
};

// Handle student create on POST.
exports.student_create_post = [
  // Validate and sanitize fields.
  body('first_name', 'First name must not be empty.')
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body('last_name', 'Last name must not be empty.')
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body('email', 'Email must not be empty.')
    .trim()
    .isLength({ min: 1 })
    .isEmail()
    .withMessage('Invalid email address')
    .escape(),
  body('date_of_birth', 'Invalid date of birth')
    .optional({ checkFalsy: true })
    .isISO8601()
    .toDate(),

  // Process request after validation and sanitization.
  async (req, res, next) => {
    const errors = validationResult(req);

    // Create Student object with escaped and trimmed data
    const student = new Student({
      first_name: req.body.first_name,
      last_name: req.body.last_name,
      email: req.body.email.toLowerCase(),
      date_of_birth: req.body.date_of_birth
    });

    if (!errors.isEmpty()) {
      // There are errors. Render form again with sanitized values/error messages.
      res.render('student_form', {
        title: 'Create Student',
        student: student,
        errors: errors.array()
      });
      return;
    } else {
      // Data from form is valid.
      try {
        await student.save();
        // Successful - redirect to new student record.
        res.redirect(student.url);
      } catch (err) {
        if (err.code === 11000) {
          // Duplicate email error
          res.render('student_form', {
            title: 'Create Student',
            student: student,
            errors: [{ msg: 'Email already exists' }]
          });
        } else {
          next(err);
        }
      }
    }
  }
];

// Display student delete form on GET.
exports.student_delete_get = async (req, res, next) => {
  try {
    const student = await Student.findById(req.params.id).exec();

    if (student === null) {
      res.redirect('/catalog/students');
    }

    // Check if student has enrollments
    const enrollments = await Enrollment.find({ student: req.params.id }).exec();

    res.render('student_delete', {
      title: 'Delete Student',
      student: student,
      enrollments: enrollments
    });
  } catch (err) {
    next(err);
  }
};

// Handle student delete on POST.
exports.student_delete_post = async (req, res, next) => {
  try {
    const student = await Student.findById(req.params.id).exec();
    const enrollments = await Enrollment.find({ student: req.params.id }).exec();

    if (enrollments.length > 0) {
      // Student has enrollments. Render in same way as for GET route.
      res.render('student_delete', {
        title: 'Delete Student',
        student: student,
        enrollments: enrollments,
        error: 'Student cannot be deleted because they have existing enrollments.'
      });
      return;
    } else {
      // Student has no enrollments. Delete object and redirect to the list of students.
      await Student.findByIdAndDelete(req.body.studentid);
      res.redirect('/catalog/students');
    }
  } catch (err) {
    next(err);
  }
};

// Display student update form on GET.
exports.student_update_get = async (req, res, next) => {
  try {
    const student = await Student.findById(req.params.id).exec();

    if (student === null) {
      const err = new Error('Student not found');
      err.status = 404;
      return next(err);
    }

    res.render('student_form', {
      title: 'Update Student',
      student: student
    });
  } catch (err) {
    next(err);
  }
};

// Handle student update on POST.
exports.student_update_post = [
  // Validate and sanitize fields.
  body('first_name', 'First name must not be empty.')
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body('last_name', 'Last name must not be empty.')
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body('email', 'Email must not be empty.')
    .trim()
    .isLength({ min: 1 })
    .isEmail()
    .withMessage('Invalid email address')
    .escape(),
  body('date_of_birth', 'Invalid date of birth')
    .optional({ checkFalsy: true })
    .isISO8601()
    .toDate(),

  // Process request after validation and sanitization.
  async (req, res, next) => {
    const errors = validationResult(req);

    // Create Student object with escaped and trimmed data.
    const student = new Student({
      first_name: req.body.first_name,
      last_name: req.body.last_name,
      email: req.body.email.toLowerCase(),
      date_of_birth: req.body.date_of_birth,
      _id: req.params.id // This is required, or a new ID will be assigned!
    });

    if (!errors.isEmpty()) {
      // There are errors. Render form again with sanitized values/error messages.
      res.render('student_form', {
        title: 'Update Student',
        student: student,
        errors: errors.array()
      });
      return;
    } else {
      // Data from form is valid. Update the record.
      try {
        // Check for duplicate email (excluding current student)
        const existingStudent = await Student.findOne({
          email: req.body.email.toLowerCase(),
          _id: { $ne: req.params.id }
        }).exec();

        if (existingStudent) {
          res.render('student_form', {
            title: 'Update Student',
            student: student,
            errors: [{ msg: 'Email already in use by another student' }]
          });
          return;
        }

        const updatedStudent = await Student.findByIdAndUpdate(
          req.params.id,
          student,
          {}
        );
        // Successful - redirect to student detail page.
        res.redirect(updatedStudent.url);
      } catch (err) {
        next(err);
      }
    }
  }
];