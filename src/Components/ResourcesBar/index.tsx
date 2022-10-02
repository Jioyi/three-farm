import React, { useState } from 'react';
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
    width: `calc(100% - ${34}px)`,
    alignItems: 'center',
    justifyContent: 'center',
    color: theme.palette.text.primary,
    position: 'absolute',
    paddingTop: 3,
    paddingBottom: 3,
    margin: 15,
    top: 0,
    zIndex: 3,
    borderRadius: 10,
    backgroundColor: `#f7bf82`,
    border: `${2}px solid #edba79`,
    borderTop: `${2}px solid #ffe0b9`,
    borderBottom: `${3}px solid #ae753d`,
    backgroundSize: 'contain'
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
    const [exp, setExp] = useState(70);
    const [username, setUsername] = useState('Jioyi');
    return (
        <>
            <Nav>
                <Box
                    sx={{
                        display: 'flex',
                        width: `calc(100% - ${10}px)`,
                        alignItems: 'center',
                        borderRadius: 2,
                        justifyContent: 'center',
                        backgroundColor: '#b98d60'
                    }}
                >
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
                </Box>
            </Nav>
            <Box
                sx={{
                    position: 'absolute',
                    top: 80,
                    left: 15,
                    zIndex: 5
                }}
                display="flex"
                justifyContent="center"
                alignItems="center"
            >
                <CardMedia
                    component="img"
                    sx={{
                        width: 80,
                        borderRadius: 7,
                        padding: `${3}px`,
                        background: `linear-gradient(0deg, #ffdfb1 0%, #a17038 100%)`,
                        border: `${2}px solid #edba79`,
                        borderTop: `${2}px solid #ffe0b9`,
                        borderBottom: `${3}px solid #ae753d`
                    }}
                    image="assets/avatars/1.jpg"
                    alt="avatar"
                />
                <Tooltip title={username}>
                    <Box
                        sx={{
                            position: 'absolute',
                            bottom: -27,
                            left: 5,
                            width: 80,
                            backgroundColor: '#b98d60',
                            border: `${2}px solid #edba79`,
                            borderTop: `${2}px solid #ffe0b9`,
                            borderBottom: `${3}px solid #ae753d`,
                            borderRadius: 10
                        }}
                    >
                        <CustomTypography
                            sx={{
                                margin: 0,
                                padding: 0,
                                textAlign: 'center'
                            }}
                        >
                            {username}
                        </CustomTypography>
                    </Box>
                </Tooltip>
                <Box
                    sx={{
                        position: 'absolute',

                        top: 10,
                        right: -140,
                        height: 26,
                        width: 120,
                        backgroundColor: `#ffffff20`,
                        border: `${2}px solid #edba79`,
                        borderTop: `${2}px solid #ffe0b9`,
                        borderBottom: `${3}px solid #ae753d`,
                        borderRadius: 10
                    }}
                >
                    <Box
                        sx={{
                            position: 'absolute',
                            borderRadius: 10,
                            height: 20,
                            width: 110,
                            top: 3,
                            left: 5,
                            overflow: 'hidden'
                        }}
                    >
                        <Box
                            sx={{
                                position: 'absolute',
                                backgroundColor: 'red',
                                height: 20,
                                width: exp,
                                background: `linear-gradient(180deg, #f7d82f 0%, #cb7500 100%)`
                            }}
                        ></Box>
                    </Box>
                </Box>
            </Box>
        </>
    );
};

export default ResourcesBar;
