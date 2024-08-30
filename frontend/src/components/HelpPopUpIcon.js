import React, { useState } from 'react';

// MUI
import { IconButton, Popover, Typography } from '@mui/material';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';

function HelpPopUpIcon({ message }) {
    // for pop-up message
    const [anchorEl, setAnchorEl] = useState(null);

    const handlePopoverOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handlePopoverClose = () => {
        setAnchorEl(null);
    };

    const open = Boolean(anchorEl);

    return (
        <div>
            <IconButton
                style={{
                    position: 'fixed',
                    bottom: 20,
                    right: 20,
                    color: 'white',
                    backgroundColor: '#4a90e2',
                    borderRadius: '50%',
                }}
                onClick={handlePopoverOpen}
            >
                <HelpOutlineIcon />
            </IconButton>
            <Popover
                open={open}
                anchorEl={anchorEl}
                onClose={handlePopoverClose}
                anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'left',
                }}
                transformOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right',
                }}
                //style={{ maxWidth: 800 }}  // Limiting the width of the Popover
            >
                <Typography style={{ padding: 16, maxWidth: 500}}>
                    {message}
                </Typography>
            </Popover>
        </div>
    );
}

export default HelpPopUpIcon;
