const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
//const { MongoClient } = require("mongodb");

require("dotenv").config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// MongoDB connection
const uri = process.env.ATLAS_URI;
if (!uri) {
  console.error("Missing ATLAS_URI in environment variables.");
  process.exit(1); 
}
mongoose.connect(uri).then(() => { 
  console.log("MongoDB database connection established successfully");
}).catch(err => {
  console.error("MongoDB connection error:", err);
});

// Routes
const personnelRouter = require("./routes/personnel");
app.use('/personnel', personnelRouter);

const departmentRouter =require("./routes/department")
app.use('/department', departmentRouter)

const logTableRouter = require('./routes/logTable')
app.use('/user', logTableRouter)

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});
