import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { List, ListItem, ListItemText, Divider } from '@material-ui/core';

const DepartmentList = () => {
    const [departments, setDepartments] = useState([]);

    useEffect(() => {
        axios.get('http://localhost:5000/departments/')
            .then(response => {
                setDepartments(response.data);
            })
            .catch((error) => {
                console.log(error);
            })
    }, []);

    return (
        <List component="nav">
            {departments.map(dept => (
                <React.Fragment key={dept._id}>
                    <ListItem>
                        <ListItemText primary={dept.name} secondary={`Manager: ${dept.manager}`} />
                    </ListItem>
                    <Divider />
                </React.Fragment>
            ))}
        </List>
    );
};

export default DepartmentList;
