import React from 'react';
// Material UI
import Box from '@mui/material/Box';
import CardMedia from '@mui/material/CardMedia';
import { styled } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
// Components
import Tooltip from '../Tooltip';
// Icons
import SettingsIcon from '@mui/icons-material/Settings';
import GitHubIcon from '@mui/icons-material/GitHub';
import StoreIcon from '@mui/icons-material/Store';
import MapIcon from '@mui/icons-material/Map';
import SaveIcon from '@mui/icons-material/Save';
// Contexts
import { useUserContext } from '../../Contexts';
import Avatar from '../Avatar';

const Nav = styled(Box)(({ theme }) => ({
    display: 'flex',
    overflow: 'hidden',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    right: 0,
    left: 0,
    position: 'absolute',
    top: 0,
    zIndex: 3
}));

const CustomIconButton = styled(IconButton)(({ theme }) => ({
    margin: 5,
    color: theme.palette.text.primary,
    background: '#996633',
    border: '2px solid',
    borderColor: '#333300',
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
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: '1rem',
    textShadow: ' 0 -1px #000000, 1px 1px #000000, -1px -1px #000000, 1px -1px #000000, -1px 1px #000000',
    userSelect: 'none'
}));

const ResourcesBar = () => {
    const { toggleSettings, toggleStore, toggleGameMap, money } = useUserContext();

    const handleGitHub = () => {
        window.open('https://github.com/Jioyi', '_blank');
    };

    return (
        <Nav>
            <Box
                sx={{
                    display: 'flex',
                    width: 'calc(100% - 40px)',
                    backgroundImage: 'linear-gradient(0deg, #653f18, #75481a, #7a5126)',
                    flexGrow: 1,
                    margin: 1,
                    padding: 1,
                    borderRadius: '5px',
                    borderColor: '#ffffff',
                    border: 1
                }}
            >
                <Box
                    sx={{
                        display: 'flex',
                        width: '100%',
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: '#cb9968',
                        boxShadow: 1,
                        borderRadius: '5px',
                        borderColor: '#000000',
                        border: 1,
                        bottom: 0
                    }}
                >
                    <Tooltip title="Coin">
                        <Box display="flex" justifyContent="center" alignItems="center">
                            <CardMedia component="img" sx={{ width: 30, padding: 1 }} image="assets/icons/coin.png" alt="food" />
                        </Box>
                    </Tooltip>
                    <CustomTypography>{money}</CustomTypography>
                    <Tooltip title="Store">
                        <StoreIcon
                            onClick={toggleStore}
                            sx={{
                                fontSize: 26,
                                marginLeft: 2,
                                color: '#333300',
                                '&:hover': {
                                    cursor: 'pointer',
                                    color: '#333300'
                                }
                            }}
                        />
                    </Tooltip>
                    <Tooltip title="Map">
                        <MapIcon
                            onClick={toggleGameMap}
                            sx={{
                                fontSize: 26,
                                marginLeft: 2,
                                color: '#333300',
                                '&:hover': {
                                    cursor: 'pointer',
                                    color: '#333300'
                                }
                            }}
                        />
                    </Tooltip>
                    <Tooltip title="Save & Load">
                        <SaveIcon
                            sx={{
                                fontSize: 26,
                                marginLeft: 2,
                                color: '#333300',
                                '&:hover': {
                                    cursor: 'pointer',
                                    color: '#333300'
                                }
                            }}
                        />
                    </Tooltip>
                    <Box sx={{ flexGrow: 1 }}></Box>
                    <Tooltip title="GitHub">
                        <CustomIconButton sx={{ fontSize: 22 }} onClick={handleGitHub}>
                            <GitHubIcon sx={{ fontSize: 22 }} />
                        </CustomIconButton>
                    </Tooltip>
                    <Tooltip title="Settings">
                        <CustomIconButton sx={{ fontSize: 22, marginRight: 2 }} onClick={toggleSettings}>
                            <SettingsIcon sx={{ fontSize: 22 }} />
                        </CustomIconButton>
                    </Tooltip>
                </Box>
            </Box>
            <Avatar />
        </Nav>
    );
};

export default ResourcesBar;
