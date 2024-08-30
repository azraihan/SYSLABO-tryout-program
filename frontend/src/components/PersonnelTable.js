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

import { FormControl, InputLabel, Select, MenuItem } from "@mui/material";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "90%",
    margin: "20px auto",
    borderRadius: "30px",
    overflow: "hidden",
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

function PersonnelTable({ data, setTriggerUpdate }) {
  const classes = useStyles();

  const [departmentNames, setDepartmentNames] = useState([]);

  useEffect(() => {
    fetchDepartmentNames()
      .then((names) => {
        setDepartmentNames(names);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  return (
    <Paper className={classes.root}>
      <MaterialTable
        icons={tableIcons}
        columns={[
          { title: "Name", field: "name" },
          {
            title: "Department",
            field: "department",
            editComponent: (props) => (
              <FormControl style={{ width: "100%" }}>
                <InputLabel id="type-label">Department</InputLabel>
                <Select
                  labelId="type-label"
                  value={props.value}
                  onChange={(e) => props.onChange(e.target.value)}
                  style={{ width: "100%" }}
                >
                  {departmentNames.map((option) => (
                    <MenuItem
                      key={option}
                      value={option}
                    >{`${option}`}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            ),
          },
          // {
          //   title: "Status",
          //   field: "status",
          //   editComponent: (props) => (
          //     <FormControl style={{ width: "100%" }}>
          //       <InputLabel id="type-label">Status</InputLabel>
          //       <Select
          //         labelId="type-label"
          //         value={props.value}
          //         onChange={(e) => props.onChange(e.target.value)}
          //         style={{ width: "100%" }}
          //       >
          //         {["member"].map((option) => (
          //           <MenuItem
          //             key={option}
          //             value={option}
          //           >{`${option}`}</MenuItem>
          //         ))}
          //       </Select>
          //     </FormControl>
          //   ),
          // },
        ]}
        data={data}
        options={{
          headerStyle: {
            backgroundColor: "#c7c5c5",
            fontFamily: "Impact",
            fontSize: 20,
          },
          titleStyle: {
            backgroundColor: "red",
            color: "#ffffff",
            padding: "10px",
            fontFamily: "Arial, sans-serif",
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
            Personnel Details
          </div>
        }
        editable={{
          onRowAdd: (newData) =>
            new Promise((resolve, reject) => {
              fetch("http://localhost:5000/personnel/add", {
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
                  resolve();
                })
                .catch((error) => {
                  console.error("Error:", error);
                  reject();
                });
            }),
          onRowUpdate: (newData, oldData) =>
            new Promise((resolve, reject) => {
              fetch(`http://localhost:5000/personnel/update/${oldData._id}`, {
                method: "PUT",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify(newData),
              })
                .then((response) => response.json())
                .then((data) => {
                  console.log("Updated:", data);
                  setTriggerUpdate((prev) => prev + 1);
                  resolve();
                })
                .catch((error) => {
                  console.error("Error:", error);
                  reject();
                });
            }),
          onRowDelete: (oldData) =>
            new Promise((resolve, reject) => {
              fetch(`http://localhost:5000/personnel/delete/${oldData._id}`, {
                method: "DELETE",
                headers: {
                  "Content-Type": "application/json",
                },
              })
                .then((response) => response.json())
                .then((data) => {
                  console.log("Deleted:", data);
                  setTriggerUpdate((prev) => prev + 1);
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
  );
}

export default PersonnelTable;
