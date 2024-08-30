const router = require("express").Router();
let Department = require("../models/department.model");
let Personnel = require("../models/personnel.model");
let LogTable = require("../models/logTable.model");

// Helper function to log actions
function logAction(description) {
  const logEntry = new LogTable({ action: description });
  logEntry.save().catch((err) => console.error("Logging error:", err));
}

// POST a new department
router.route("/add").post((req, res) => {
  const {
    id,
    sys_id,
    name,
    parentName,
    parent,
    department_head,
    description,
    primary_contact,
    members,
  } = req.body;

  const newDepartment = new Department({
    id,
    sys_id,
    name,
    parentName,
    parent,
    department_head,
    description,
    primary_contact,
    members,
  });

  newDepartment
    .save()
    .then((savedDepartment) => {
      const newPersonnel = new Personnel({
        name: department_head,
        department: name,
        status: "department_head",
      });

      return newPersonnel
        .save()
        .then((savedPersonnel) => {
          res.json({ department: savedDepartment, personnel: savedPersonnel });
          logAction(
            `Added department: ${name} and department head: ${department_head}`
          );
          console.log(newPersonnel);
        })
        .catch((err) => {
          console.error("Error adding department head to Personnel:", err);
          res.status(400).json("Error: " + err);
        });
    })
    .catch((err) => res.status(400).json("Error: " + err));
});

// // DELETE a department by ID and all associated personnel
// router.route("/delete/:id").delete((req, res) => {
//   Department.findByIdAndDelete(req.params.id)
//     .then((deletedDepartment) => {
//       if (!deletedDepartment) {
//         return res.status(404).json("Department not found");
//       }

//       // Delete all personnel associated with the deleted department
//       Personnel.deleteMany({ department: deletedDepartment.name })
//         .then(() => {
//           res.json("Department and all associated personnel deleted.");
//           logAction(
//             `Deleted department with ID: ${req.params.id} and all associated personnel`
//           );
//         })
//         .catch((err) =>
//           res.status(400).json("Error deleting personnel: " + err)
//         );
//     })
//     .catch((err) => res.status(400).json("Error: " + err));
// });

// UPDATE a department
// UPDATE a department
router.route("/update/:id").put((req, res) => {
  Department.findById(req.params.id)
    .then((department) => {
      if (!department) {
        return res.status(404).json("Department not found");
      }

      const oldDepartmentName = department.name;
      const oldDepartmentId = department.id;

      const updates = {
        id: req.body.id,
        sys_id: req.body.sys_id,
        name: req.body.name,
        parentName: req.body.parentName,
        parent: req.body.parent,
        department_head: req.body.department_head,
        description: req.body.description,
        primary_contact: req.body.primary_contact,
        members: req.body.members,
      };

      Object.assign(department, updates);

      department
        .save()
        .then((updatedDepartment) => {
          Department.updateMany(
            { parent: oldDepartmentId },
            {
              parent: updatedDepartment.id,
              parentName: updatedDepartment.name,
            }
          )
            .then(() => {
              Personnel.updateMany(
                { department: oldDepartmentName },
                { department: updatedDepartment.name }
              )
                .then(() => {
                  res.json(updatedDepartment);
                  logAction(
                    `Updated department with ID: ${req.params.id}, and updated child departments' parent and personnel departments from ${oldDepartmentName} to ${updatedDepartment.name}`
                  );
                })
                .catch((err) =>
                  res.status(400).json("Error updating personnel: " + err)
                );
            })
            .catch((err) =>
              res
                .status(400)
                .json(
                  "Error updating child departments with new parent info: " +
                    err
                )
            );
        })
        .catch((err) => res.status(400).json("Error: " + err));
    })
    .catch((err) => res.status(400).json("Error: " + err));
});

// DELETE a department by ID and update child departments
router.route("/delete/:id").delete((req, res) => {
  Department.findByIdAndDelete(req.params.id)
    .then((deletedDepartment) => {
      if (!deletedDepartment) {
        return res.status(404).json("Department not found");
      }

      // Update child departments that had the deleted department as their parent
      Department.updateMany(
        { parent: deletedDepartment.id },
        {
          parent: "",
          parentName: "",
        }
      )
        .then(() => {
          Personnel.deleteMany({ department: deletedDepartment.name })
            .then(() => {
              res.json(
                "Department and all associated personnel deleted. Child departments updated."
              );
              logAction(
                `Deleted department with ID: ${req.params.id}, and updated child departments' parent to empty`
              );
            })
            .catch((err) =>
              res.status(400).json("Error deleting personnel: " + err)
            );
        })
        .catch((err) =>
          res
            .status(400)
            .json(
              "Error updating child departments after parent department deletion: " +
                err
            )
        );
    })
    .catch((err) => res.status(400).json("Error: " + err));
});

// GET all departments
router.route("/").get((req, res) => {
  Department.find()
    .then((departments) => {
      res.json(departments);
      //logAction("Fetched all departments");
    })
    .catch((err) => {
      console.error("Error fetching departments:", err);
      res.status(500).json("Error: " + err);
    });
});

// GET all distinct department names
router.route("/department-names").get((req, res) => {
  Department.find({}, "name")
    .then((departments) => {
      const departmentNames = departments.map((department) => department.name);
      res.json(departmentNames);
      //logAction("Fetched all department names");
    })
    .catch((err) => {
      console.error("Error fetching department names:", err);
      res.status(500).json("Error: " + err);
    });
});

// GET department ID by department name
router.route("/id").get((req, res) => {
  const { departmentName } = req.query; // Expecting department name to be provided as a query parameter

  if (!departmentName) {
    return res.json({ id: "" });
  }

  Department.findOne({ name: departmentName })
    .then((department) => {
      if (!department) {
        return res.status(404).json("Error: Department not found");
      }
      res.json({ id: department.id }); // Send back the department ID
    })
    .catch((err) => {
      console.error("Error fetching department by name:", err);
      res.status(500).json("Error: " + err);
    });
});

module.exports = router;
