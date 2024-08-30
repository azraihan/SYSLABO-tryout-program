import React, { useState, useEffect } from "react";
import MaterialTable from "@material-table/core";
import { forwardRef } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import AddBox from "@material-ui/icons/AddBox";
import ArrowDownward from "@material-ui/icons/ArrowDownward";
import Check from "@material-ui/icons/Check";
import ChevronLeft from "@material-ui/icons/ChevronLeft";
import ChevronRight from "@material-ui/icons/ChevronRight";
import Clear from "@material-ui/icons/Clear";
import DeleteOutline from "@material-ui/icons/DeleteOutline";
import Edit from "@material-ui/icons/Edit";
import FilterList from "@material-ui/icons/FilterList";
import FirstPage from "@material-ui/icons/FirstPage";
import LastPage from "@material-ui/icons/LastPage";
import Remove from "@material-ui/icons/Remove";
import SaveAlt from "@material-ui/icons/SaveAlt";
import Search from "@material-ui/icons/Search";
import ViewColumn from "@material-ui/icons/ViewColumn";

//components
import HelpPopUpIcon from "./HelpPopUpIcon";

import { FormControl, InputLabel, Select, MenuItem } from "@mui/material";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "95%",
    margin: "auto",
    borderRadius: "30px",
    overflow: "hidden",
    marginTop: 50,
  },
}));

const tableIcons = {
  Add: forwardRef((props, ref) => <AddBox {...props} ref={ref} />),
  Check: forwardRef((props, ref) => <Check {...props} ref={ref} />),
  Clear: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
  Delete: forwardRef((props, ref) => <DeleteOutline {...props} ref={ref} />),
  DetailPanel: forwardRef((props, ref) => (
    <ChevronRight {...props} ref={ref} />
  )),
  Edit: forwardRef((props, ref) => <Edit {...props} ref={ref} />),
  Export: forwardRef((props, ref) => <SaveAlt {...props} ref={ref} />),
  Filter: forwardRef((props, ref) => <FilterList {...props} ref={ref} />),
  FirstPage: forwardRef((props, ref) => <FirstPage {...props} ref={ref} />),
  LastPage: forwardRef((props, ref) => <LastPage {...props} ref={ref} />),
  NextPage: forwardRef((props, ref) => <ChevronRight {...props} ref={ref} />),
  PreviousPage: forwardRef((props, ref) => (
    <ChevronLeft {...props} ref={ref} />
  )),
  ResetSearch: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
  Search: forwardRef((props, ref) => <Search {...props} ref={ref} />),
  SortArrow: forwardRef((props, ref) => <ArrowDownward {...props} ref={ref} />),
  ThirdStateCheck: forwardRef((props, ref) => <Remove {...props} ref={ref} />),
  ViewColumn: forwardRef((props, ref) => <ViewColumn {...props} ref={ref} />),
};

function arrayToJson(array) {
  const jsonObject = {};

  array.forEach((item) => {
    if (item && typeof item === "object") {
      const [key, value] = Object.entries(item)[0];
      jsonObject[key] = value;
    }
  });

  return jsonObject;
}

const fetchDepartmentNames = async () => {
  try {
    const res = await fetch(
      "http://localhost:5000/department/department-names",
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const parseRes = await res.json();
    if (res.ok) {
    } else {
      return;
    }
    return parseRes;
  } catch (err) {
    console.error(err.message);
  }
};

function replaceSpacesWithPercent(text) {
  return text.replace(/\s/g, "%");
}

const fetchDepartmentIDFromName = async (departmentName) => {
  try {
    const res = await fetch(
      `http://localhost:5000/department/id?departmentName=${departmentName}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const parseRes = await res.json();
    if (res.ok) {
    } else {
      return;
    }
    return parseRes;
  } catch (err) {
    console.error(err.message);
  }
};

function DepartmentTable({ data, setTriggerUpdate }) {
  const classes = useStyles();

  const helpMessage =
    "You can search, add, delete, and update department info here.";

  const [departmentNames, setDepartmentNames] = useState([]);

  const [triggerFetch, setTriggerFetch] = useState(0);
  const [deptIDAndNameMap, setDeptIDAndNameMap] = useState(null);

  useEffect(() => {
    const fetchAllDepartmentID = async () => {
      const departmentIDAndNameMap = await Promise.all(
        data.map((dept) => {
          return fetchDepartmentIDFromName(dept.name)
            .then((res) => {
              return { [dept.name]: res.id };
            })
            .catch((err) => {
              console.log(err);
            });
        })
      );
      setDeptIDAndNameMap(arrayToJson(departmentIDAndNameMap));
    };

    fetchAllDepartmentID();

    fetchDepartmentNames()
      .then((names) => {
        setDepartmentNames(names);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [triggerFetch, data]);

  return (
    <>
      <Paper className={classes.root}>
        <MaterialTable
          icons={tableIcons}
          columns={[
            { title: "ID", field: "id" },
            { title: "System ID", field: "sys_id" },
            { title: "Name", field: "name" },
            {
              title: "ParentName",
              field: "parentName",
              editComponent: (props) => {
                const filteredDepartmentNames = departmentNames.filter(
                  (name) => name !== props.rowData.name
                );

                return (
                  <FormControl style={{ width: "100%" }}>
                    <InputLabel id="type-label">Parent</InputLabel>
                    <Select
                      labelId="type-label"
                      value={props.value}
                      onChange={(e) => props.onChange(e.target.value)}
                      style={{ width: "100%" }}
                    >
                      {filteredDepartmentNames.map((option) => (
                        <MenuItem key={option} value={option}>
                          {option}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                );
              },
            },
            { title: "Department Head", field: "department_head" },
            { title: "Description", field: "description" },
            { title: "Primary Contact", field: "primary_contact" },
          ]}
          data={data}
          options={{
            headerStyle: {
              backgroundColor: "#c7c5c5",
              fontFamily: "Impact",
              fontSize: 20,
            },
            titleStyle: {
              backgroundColor: "red", // Set your desired color here
              color: "#ffffff", // Optional: Set text color
              padding: "10px", // Optional: Add padding
              fontFamily: "Arial, sans-serif", // Optional: Change font style
            },
            rowStyle: (rowData, index) => ({
              backgroundColor: index % 2 === 0 ? "#f7f6b2" : "#fcfce6", // Ensuring alternating colors
            }),
            actionsColumnIndex: -1,
          }}
          title={
            <div
              style={{
                fontFamily: "Tahoma, Arial, sans-serif",
                fontSize: "24px",
              }}
            >
              Department Details
            </div>
          }
          editable={{
            onRowAdd: (newData) =>
              new Promise((resolve, reject) => {
                newData["parent"] = deptIDAndNameMap[newData.parentName];
                fetch("http://localhost:5000/department/add", {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify(newData),
                })
                  .then((response) => response.json())
                  .then((data) => {
                    console.log("Added:", data);
                    setTriggerUpdate((prev) => prev + 1);
                    setTriggerFetch((prev) => prev + 1);
                    resolve();
                  })
                  .catch((error) => {
                    console.error("Error:", error);
                    reject();
                  });
              }),
            onRowUpdate: (newData, oldData) =>
              new Promise((resolve, reject) => {
                newData["parent"] = deptIDAndNameMap[newData.parentName];
                fetch(
                  `http://localhost:5000/department/update/${oldData._id}`,
                  {
                    method: "PUT",
                    headers: {
                      "Content-Type": "application/json",
                    },
                    body: JSON.stringify(newData),
                  }
                )
                  .then((response) => response.json())
                  .then((data) => {
                    console.log("Updated:", data);
                    setTriggerUpdate((prev) => prev + 1);
                    setTriggerFetch((prev) => prev + 1);
                    resolve();
                  })
                  .catch((error) => {
                    console.error("Error:", error);
                    reject();
                  });
              }),
            onRowDelete: (oldData) =>
              new Promise((resolve, reject) => {
                fetch(
                  `http://localhost:5000/department/delete/${oldData._id}`,
                  {
                    method: "DELETE",
                    headers: {
                      "Content-Type": "application/json",
                    },
                  }
                )
                  .then((response) => response.json())
                  .then((data) => {
                    console.log("Deleted:", data);
                    setTriggerUpdate((prev) => prev + 1);
                    setTriggerFetch((prev) => prev + 1);
                    resolve();
                  })
                  .catch((error) => {
                    console.error("Error:", error);
                    reject();
                  });
              }),
          }}
        />
      </Paper>
      <HelpPopUpIcon message={helpMessage} />
    </>
  );
}

export default DepartmentTable;
