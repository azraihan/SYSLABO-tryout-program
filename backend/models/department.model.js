const mongoose = require('mongoose');
const { Schema } = mongoose;

const departmentSchema = new Schema({
  id: {
    type: String,
    required: true,
    unique: true
  },
  sys_id: {
    type: String,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true
  },
  parentName: {
    type: String,
    default: ''
  },
  parent: {
    type: String,
    default: ''
  },
  department_head: {
    type: String,
    required: true
  },
  description: {
    type: String,
    default: ''
  },
  primary_contact: {
    type: String,
    default:'',
  },
  members: {
    type: [String], 
    default: []
  },
  expanded: {
    type: Boolean, 
    default: false
  }
});

const Department = mongoose.model('Department', departmentSchema);

module.exports = Department;
