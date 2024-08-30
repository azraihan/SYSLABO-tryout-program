const router = require("express").Router();
let Personnel = require("../models/personnel.model");
let Department = require("../models/department.model");
let LogTable = require("../models/logTable.model");

// Helper function to log actions
function logAction(description) {
  const logEntry = new LogTable({ action: description });
  logEntry.save().catch((err) => console.error("Logging error:", err));
}

// POST a new personnel
router.route("/add").post((req, res) => {
  const { name, department } = req.body;
  const status = "member";

  const newPersonnel = new Personnel({
    name,
    department,
    status,
  });

  newPersonnel
    .save()
    .then((addedPersonnel) => {
      Department.findOne({ name: department })
        .then((departmentDoc) => {
          if (!departmentDoc) {
            return res.status(404).json("Department not found");
          }
          if (status === "member") {
            departmentDoc.members.push(name);
          }
          //   else if (status === "department_head") {
          //     departmentDoc.department_head = name;
          //   }
          departmentDoc
            .save()
            .then(() => {
              res.json(addedPersonnel);
              logAction(
                `Added personnel: ${name} in ${department} as ${status}`
              );
            })
            .catch((err) =>
              res.status(400).json("Error updating department: " + err)
            );
        })
        .catch((err) =>
          res.status(400).json("Error finding department: " + err)
        );
    })
    .catch((err) => res.status(400).json("Error: " + err));
});

// DELETE a personnel by ID
router.route("/delete/:id").delete((req, res) => {
  Personnel.findByIdAndDelete(req.params.id)
    .then((deletedPersonnel) => {
      if (!deletedPersonnel) {
        return res.status(404).json("Personnel not found");
      }

      // Find the department and remove the personnel's name from the members array
      Department.findOne({ name: deletedPersonnel.department })
        .then((departmentDoc) => {
          if (!departmentDoc) {
            return res.status(404).json("Department not found");
          }

          if (deletedPersonnel.status === "member") {
            departmentDoc.members = departmentDoc.members.filter(
              (member) => member !== deletedPersonnel.name
            );
          }
          //   else if (deletedPersonnel.status === "department_head") {
          //     departmentDoc.department_head = ""; // Clear the department head
          //   }

          departmentDoc
            .save()
            .then(() => {
              res.json("Personnel deleted and department updated.");
              logAction(
                `Deleted personnel with ID: ${req.params.id} and updated department ${deletedPersonnel.department}`
              );
            })
            .catch((err) =>
              res.status(400).json("Error updating department: " + err)
            );
        })
        .catch((err) =>
          res.status(400).json("Error finding department: " + err)
        );
    })
    .catch((err) => res.status(400).json("Error: " + err));
});

// UPDATE a personnel
router.route("/update/:id").put((req, res) => {
  Personnel.findById(req.params.id)
    .then((personnel) => {
      const oldDepartment = personnel.department;
      const oldName = personnel.name;
      const newDepartment = req.body.department;
      const name = req.body.name;
      const status = req.body.status;

      personnel.name = name;
      personnel.department = newDepartment;
      personnel.status = status;

      personnel
        .save()
        .then((updatedPersonnel) => {
          Department.findOne({ name: oldDepartment })
            .then((oldDeptDoc) => {
              if (oldDeptDoc && status === "member") {
                console.log(oldName)
                oldDeptDoc.members = oldDeptDoc.members.filter(
                  (member) => member !== oldName
                );
                console.log(oldDeptDoc.members)
              }
              //   else if (oldDeptDoc && status === "department_head") {
              //     oldDeptDoc.department_head = "";
              //   }

              oldDeptDoc
                ? oldDeptDoc
                    .save()
                    .catch((err) =>
                      console.error("Error updating old department: " + err)
                    )
                : null;

              // Add to new department
              Department.findOne({ name: newDepartment })
                .then((newDeptDoc) => {
                  if (!newDeptDoc) {
                    return res.status(404).json("New department not found");
                  }

                  if (status === "member") {
                    newDeptDoc.members.push(name);
                  }
                  //   else if (status === "department_head") {
                  //     newDeptDoc.department_head = name;
                  //   }

                  newDeptDoc
                    .save()
                    .then(() => {
                      res.json(updatedPersonnel);
                      logAction(
                        `Updated personnel with ID: ${req.params.id} - New details: Name: ${name}, Department: ${newDepartment}, Status: ${status}`
                      );
                    })
                    .catch((err) =>
                      res
                        .status(400)
                        .json("Error updating new department: " + err)
                    );
                })
                .catch((err) =>
                  res.status(400).json("Error finding new department: " + err)
                );
            })
            .catch((err) =>
              res.status(400).json("Error finding old department: " + err)
            );
        })
        .catch((err) => res.status(400).json("Error: " + err));
    })
    .catch((err) => res.status(400).json("Error: " + err));
});

// GET all personnel
router.route("/").get((req, res) => {
  Personnel.find()
    .then((personnelList) => {
      res.json(personnelList);
      //logAction("Fetched all personnel");
    })
    .catch((err) => {
      console.error("Error fetching personnel:", err);
      res.status(500).json("Error: " + err);
    });
});


  

module.exports = router;
