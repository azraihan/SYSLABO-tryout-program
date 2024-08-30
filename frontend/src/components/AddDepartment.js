import React, { useState } from 'react';
import axios from 'axios';
import { Button, TextField, Dialog, DialogActions, DialogContent, DialogTitle } from '@material-ui/core';

const AddDepartment = ({ updateDepartments }) => {
    const [open, setOpen] = useState(false);
    const [departmentName, setDepartmentName] = useState('');
    const [managerName, setManagerName] = useState('');

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleSave = () => {
        const department = {
            name: departmentName,
            manager: managerName
        };

        axios.post('http://localhost:5000/departments/add', department)
            .then(res => {
                console.log(res.data);
                updateDepartments();
                handleClose();
            })
            .catch(err => {
                console.log(err);
            });
    };

    return (
        <div>
            <Button variant="outlined" color="primary" onClick={handleClickOpen}>
                Add Department
            </Button>
            <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
                <DialogTitle id="form-dialog-title">Add a New Department</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        id="name"
                        label="Department Name"
                        type="text"
                        fullWidth
                        value={departmentName}
                        onChange={e => setDepartmentName(e.target.value)}
                    />
                    <TextField
                        margin="dense"
                        id="manager"
                        label="Manager Name"
                        type="text"
                        fullWidth
                        value={managerName}
                        onChange={e => setManagerName(e.target.value)}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={handleSave} color="primary">
                        Save
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};

export default AddDepartment;
