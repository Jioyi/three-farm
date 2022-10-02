import React from 'react';
// Material UI
import Box from '@mui/material/Box';
import CardMedia from '@mui/material/CardMedia';
import { styled } from '@mui/material/styles';
import { alpha } from '@mui/material';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
// Components
import Tooltip from '../Tooltip';
// Icons
import SettingsIcon from '@mui/icons-material/Settings';

const Nav = styled(Box)(({ theme }) => ({
    display: 'flex',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    color: theme.palette.text.primary,
    position: 'absolute',
    paddingTop: 5,
    paddingBottom: 5,
    top: 0,
    zIndex: 3,
    background: alpha('#000000', 0.3),
    backgroundImage: `url(assets/images/lower_bar.png)`,
    backgroundSize: 'contain',
    transform: "rotate(-180deg)",
}));

const CustomIconButton = styled(IconButton)(({ theme }) => ({
    margin: 5,
    color: theme.palette.text.primary,
    background: '#996633',
    '& .MuiSvgIcon-root': {
        color: '#333300'
    },
    '&:hover': {
        background: '#ffcc00',
        '& .MuiSvgIcon-root': {
            color: '#333300'
        }
    }
}));

const CustomTypography = styled(Typography)(({ theme }) => ({
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 600,
    padding: 5,
    userSelect: 'none'
}));

const ResourcesBar = () => {
    return (
        <Nav>
            <Tooltip title="Food">
                <Box display="flex" justifyContent="center" alignItems="center">
                    <CardMedia component="img" sx={{ width: 40, padding: 1 }} image="assets/icons/food.png" alt="food" />
                </Box>
            </Tooltip>
            <CustomTypography>5000</CustomTypography>
            <Tooltip title="Wood">
                <Box display="flex" justifyContent="center" alignItems="center">
                    <CardMedia component="img" sx={{ width: 40, padding: 1, userSelect: 'none' }} image="assets/icons/wood.png" alt="food" />
                </Box>
            </Tooltip>
            <CustomTypography>5000</CustomTypography>
            <Tooltip title="Gold">
                <Box display="flex" justifyContent="center" alignItems="center">
                    <CardMedia component="img" sx={{ width: 40, padding: 1, userSelect: 'none' }} image="assets/icons/gold.png" alt="food" />
                </Box>
            </Tooltip>
            <CustomTypography>5000</CustomTypography>
            <Tooltip title="Stone">
                <Box display="flex" justifyContent="center" alignItems="center">
                    <CardMedia component="img" sx={{ width: 40, padding: 1, userSelect: 'none' }} image="assets/icons/stone.png" alt="food" />
                </Box>
            </Tooltip>
            <CustomTypography>5000</CustomTypography>
            <Box sx={{ flexGrow: 1 }}></Box>
            <Tooltip title="Settings">
                <CustomIconButton sx={{ fontSize: 22, marginRight: 2 }}>
                    <SettingsIcon sx={{ fontSize: 22 }} />
                </CustomIconButton>
            </Tooltip>
        </Nav>
    );
};

export default ResourcesBar;
