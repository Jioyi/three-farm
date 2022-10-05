import React, { useState, useEffect } from 'react';
// Material UI
import Box from '@mui/material/Box';
import CardMedia from '@mui/material/CardMedia';
import { styled } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
// Components
import Tooltip from '../Tooltip';
import Portal from '../Portal';
// Icons
import SettingsIcon from '@mui/icons-material/Settings';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import StoreIcon from '@mui/icons-material/Store';
import SellIcon from '@mui/icons-material/Sell';
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment';
//sub components
import BuyMenu from './BuyMenu';
import Map from '../Map';
import Customize from '../Customize';

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
    const [username, setUsername] = useState('Jioyi');
    const [exp, setExp] = useState(1);
    const [buy, setBuy] = useState(false);
    const [dataLevel, setDataLevel] = useState({
        level: 1,
        exp: 100,
        expTotal: 200
    });
    const updateLevel = (exp: any) => {
        let actualExp = exp;
        let actualMaxExp = 100;
        let lvl = 1;
        while (actualExp >= actualMaxExp) {
            actualExp = actualExp - actualMaxExp;
            actualMaxExp = Math.trunc(actualMaxExp * 1.1);
            lvl = lvl + 1;
        }
        setDataLevel({
            level: lvl,
            exp: actualExp,
            expTotal: actualMaxExp
        });
    };
    useEffect(() => {
        updateLevel(exp);
    }, [exp]);

    return (
        <>
            {' '}
            <Portal isShown={false} close={() => {}} element={<Map />} />
            <Portal isShown={true} close={() => {}} element={<Customize />} />
            <Portal isShown={buy} close={() => setBuy(false)} element={<BuyMenu />} />
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
                    <Tooltip title="Buy">
                        <Box onClick={() => setBuy(true)} display="flex" justifyContent="center" alignItems="center">
                            <StoreIcon sx={{ width: 40, padding: 1 }} />
                        </Box>
                    </Tooltip>
                    <Tooltip title="Sell">
                        <Box display="flex" justifyContent="center" alignItems="center">
                            <SellIcon sx={{ width: 40, padding: 1 }} />
                        </Box>
                    </Tooltip>
                    <Tooltip title="Climate">
                        <Box display="flex" justifyContent="center" alignItems="center">
                            <LocalFireDepartmentIcon sx={{ width: 40, padding: 1 }} />
                        </Box>
                    </Tooltip>
                    <Box sx={{ flexGrow: 1 }}></Box>
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
                <Tooltip title="level">
                    <Box
                        sx={{
                            position: 'absolute',
                            top: 10,
                            right: -150,
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
                                    width: `${(100 / dataLevel.expTotal) * dataLevel.exp * 1.1}px`,
                                    background: `linear-gradient(180deg, #f7d82f 0%, #cb7500 100%)`
                                }}
                            ></Box>
                            <CustomTypography
                                sx={{
                                    margin: 0,
                                    padding: 0,
                                    width: 110,
                                    top: 1,
                                    textAlign: 'center',
                                    position: 'absolute'
                                }}
                            >
                                {`${dataLevel.exp} / ${dataLevel.expTotal}`}
                            </CustomTypography>
                        </Box>
                        <EmojiEventsIcon
                            sx={{
                                fontSize: 30,
                                position: 'absolute',
                                padding: `${2}px`,
                                top: -6,
                                left: -25,
                                color: '#f9da34',
                                background: `linear-gradient(0deg, #d1820c 0%,#efb627 50%, #d1820c 100%)`,
                                border: `${2}px solid #edba79`,
                                borderTop: `${2}px solid #ffe0b9`,
                                borderRadius: 20
                            }}
                        />
                    </Box>
                </Tooltip>
            </Box>
        </>
    );
};

export default ResourcesBar;
