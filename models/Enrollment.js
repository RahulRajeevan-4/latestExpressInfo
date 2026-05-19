const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const EnrollmentSchema = new Schema({
  student: {
    type: Schema.Types.ObjectId,
    ref: 'Student',
    required: true
  },
  course: {
    type: Schema.Types.ObjectId,
    ref: 'Course',
    required: true
  },
  status: {
    type: String,
    enum: ['Active', 'Completed', 'Dropped'],
    default: 'Active'
  },
  enrollment_date: {
    type: Date,
    default: Date.now
  }
});

// Virtual for enrollment's URL
EnrollmentSchema.virtual('url').get(function () {
  return `/catalog/enrollment/${this._id}`;
});

module.exports = mongoose.model('Enrollment', EnrollmentSchema);