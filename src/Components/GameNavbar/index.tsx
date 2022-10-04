import React from 'react';
// Material UI
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';
import { alpha } from '@mui/material';
// Contexts
import { useUserContext } from '../../Contexts';
import Tooltip from '../Tooltip';


const Nav = styled(Box)(({ theme }) => ({
    display: 'flex',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    color: theme.palette.text.primary,
    position: 'absolute',
    paddingTop: 5,
    paddingBottom: 5,
    bottom: 0,
    zIndex: 3,
    backgroundColor: alpha('#000000', 0.3)
}));

const CustomTypography = styled(Typography)(({ theme }) => ({
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 600,
    padding: 5,
    userSelect: 'none'
}));

const GameNavbar = () => {
    const { testFunct } = useUserContext();

    const handleOnClick = () => {
        testFunct('Hello World!');
    };

    return (<>
        <Nav onClick={handleOnClick}>
            <Tooltip title="Esto es un Tooltip">
                <CustomTypography>Test</CustomTypography>
            </Tooltip>
            <Box sx={{ flexGrow: 1 }}></Box>
            <CustomTypography>Test</CustomTypography>
        </Nav>
        </>
    );
};

export default GameNavbar;
