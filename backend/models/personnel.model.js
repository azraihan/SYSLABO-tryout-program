const mongoose = require('mongoose');
const { Schema } = mongoose;

const personnelSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  department: {
    type: String,
    required: true
  },
  status: {
    type: String,
    required: true,
    enum: ['member', 'department_head'],
    default: 'member',
  }
});

const Personnel = mongoose.model('Personnel', personnelSchema);

module.exports = Personnel;
