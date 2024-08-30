const router = require('express').Router();
let LogTable = require('../models/logTable.model'); // Ensure you have this model set up as previously defined

// GET all log entries
router.route('/logs').get((req, res) => {
    LogTable.find().sort({ time: -1 }) // Sorting by time in descending order
        .then(logEntries => {
            res.json(logEntries);
        })
        .catch(err => {
            console.error('Error fetching log entries:', err);
            res.status(500).json('Error: ' + err);
        });
});

module.exports = router;
