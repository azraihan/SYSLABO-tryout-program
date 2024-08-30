import React from 'react';
import MaterialTable from '@material-table/core';
import { forwardRef } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import AddBox from '@material-ui/icons/AddBox';
import ArrowDownward from '@material-ui/icons/ArrowDownward';
import Check from '@material-ui/icons/Check';
import ChevronLeft from '@material-ui/icons/ChevronLeft';
import ChevronRight from '@material-ui/icons/ChevronRight';
import Clear from '@material-ui/icons/Clear';
import DeleteOutline from '@material-ui/icons/DeleteOutline';
import Edit from '@material-ui/icons/Edit';
import FilterList from '@material-ui/icons/FilterList';
import FirstPage from '@material-ui/icons/FirstPage';
import LastPage from '@material-ui/icons/LastPage';
import Remove from '@material-ui/icons/Remove';
import SaveAlt from '@material-ui/icons/SaveAlt';
import Search from '@material-ui/icons/Search';
import ViewColumn from '@material-ui/icons/ViewColumn';

const useStyles = makeStyles(theme => ({
  root: {
    width: '90%',
    margin: '20px auto',
    borderRadius: '30px',
    overflow: 'hidden'
  },
}));

const tableIcons = {
  //Add: forwardRef((props, ref) => <AddBox {...props} ref={ref} />),
  Check: forwardRef((props, ref) => <Check {...props} ref={ref} />),
  Clear: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
  //Delete: forwardRef((props, ref) => <DeleteOutline {...props} ref={ref} />),
  DetailPanel: forwardRef((props, ref) => <ChevronRight {...props} ref={ref} />),
  //Edit: forwardRef((props, ref) => <Edit {...props} ref={ref} />),
  Export: forwardRef((props, ref) => <SaveAlt {...props} ref={ref} />),
  Filter: forwardRef((props, ref) => <FilterList {...props} ref={ref} />),
  FirstPage: forwardRef((props, ref) => <FirstPage {...props} ref={ref} />),
  LastPage: forwardRef((props, ref) => <LastPage {...props} ref={ref} />),
  NextPage: forwardRef((props, ref) => <ChevronRight {...props} ref={ref} />),
  PreviousPage: forwardRef((props, ref) => <ChevronLeft {...props} ref={ref} />),
  ResetSearch: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
  Search: forwardRef((props, ref) => <Search {...props} ref={ref} />),
  SortArrow: forwardRef((props, ref) => <ArrowDownward {...props} ref={ref} />),
  ThirdStateCheck: forwardRef((props, ref) => <Remove {...props} ref={ref} />),
  ViewColumn: forwardRef((props, ref) => <ViewColumn {...props} ref={ref} />)
};

function LogTable({ data }) {
  const classes = useStyles();

  return (
    <Paper className={classes.root}>
      <MaterialTable
        icons={tableIcons}
        columns={[
          { title: 'ID', field: '_id' },
          { title: 'Action', field: 'action' },
          { title: 'Time', field: 'time' },
        ]}
        data={data}
        options={{
            headerStyle: {
              backgroundColor: '#c7c5c5',
              fontFamily: 'Impact',
              fontSize: 20,
            },
            titleStyle: {
              backgroundColor: 'red', // Set your desired color here
              color: '#ffffff', // Optional: Set text color
              padding: '10px', // Optional: Add padding
              fontFamily: 'Arial, sans-serif' // Optional: Change font style
            },
            rowStyle: (rowData, index) => ({
              backgroundColor: index % 2 === 0 ? '#f7f6b2' : '#fcfce6' // Ensuring alternating colors
            }),
            actionsColumnIndex: -1
          }}
          title={<div style={{ fontFamily: 'Tahoma, Arial, sans-serif', fontSize: '24px'}}>Logs</div>} 
          
      />
    </Paper>
  );
}

export default LogTable;
