const mongoose = require('mongoose');
const { Schema } = mongoose;

const logTableSchema = new Schema({
  action: {
    type: String,
    required: true,
    trim: true // Removes any whitespace from the beginning and end of the string
  },
  time: {
    type: Date,
    default: Date.now // Automatically sets to the current date and time when the log is created
  }
});

const LogTable = mongoose.model('LogTable', logTableSchema);

module.exports = LogTable;
