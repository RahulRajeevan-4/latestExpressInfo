const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const StudentSchema = new Schema({
  first_name: {
    type: String,
    required: true,
    maxlength: 100
  },
  last_name: {
    type: String,
    required: true,
    maxlength: 100
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  date_of_birth: {
    type: Date
  }
});

// Virtual for student's full name
StudentSchema.virtual('name').get(function () {
  let fullname = '';
  if (this.first_name && this.last_name) {
    fullname = `${this.first_name} ${this.last_name}`;
  }
  return fullname;
});

// Virtual for student's URL
StudentSchema.virtual('url').get(function () {
  return `/catalog/student/${this._id}`;
});

module.exports = mongoose.model('Student', StudentSchema);