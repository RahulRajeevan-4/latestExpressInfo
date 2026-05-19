const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const CourseSchema = new Schema({
  title: {
    type: String,
    required: true,
    maxlength: 200
  },
  description: {
    type: String,
    required: true,
    maxlength: 1000
  },
  level: {
    type: String,
    required: true,
    enum: ['Beginner', 'Intermediate', 'Advanced'],
    default: 'Beginner'
  },
  duration_weeks: {
    type: Number,
    required: true,
    min: 1,
    max: 52
  }
});

// Virtual for course's URL
CourseSchema.virtual('url').get(function () {
  return `/catalog/course/${this._id}`;
});

module.exports = mongoose.model('Course', CourseSchema);