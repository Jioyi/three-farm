import React from 'react';
// Material UI
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';
// Icons
import CloseIcon from '@mui/icons-material/Close';
// Contexts
import { useUserContext } from '../../Contexts';

const CustomIconButtonClose = styled(IconButton)(({ theme }) => ({
    margin: 5,
    padding: 2,
    background: '#ff7f7f',
    border: '3px solid',
    borderColor: '#333300',
    '& .MuiSvgIcon-root': {
        color: '#333300'
    },
    '&:hover': {
        background: '#ff0000',
        '& .MuiSvgIcon-root': {
            color: '#333300'
        }
    }
}));

const CustomTypography = styled(Typography)(({ theme }) => ({
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    color: '#ffcc00',
    padding: 5,
    fontSize: '1.5rem',
    fontWeight: 'bold',
    letterSpacing: '0.1em',
    textShadow: ' 0 -1px #000000, 1px 1px #000000, -1px -1px #000000, 1px -1px #000000, -1px 1px #000000',
    userSelect: 'none'
}));

const CustomTypography2 = styled(Typography)(({ theme }) => ({
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    color: '#ffcc00',
    padding: 5,
    fontSize: '1rem',
    fontWeight: 'bold',
    letterSpacing: '0.1em',
    textShadow: ' 0 -1px #000000, 1px 1px #000000, -1px -1px #000000, 1px -1px #000000, -1px 1px #000000',
    userSelect: 'none'
}));

const CustomButton = styled(Button)({
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: '1rem',
    textShadow: '1px 1px 0px #000000',
    textTransform: 'uppercase',
    lineHeight: 1.5,
    fontFamily: [
        '-apple-system',
        'BlinkMacSystemFont',
        '"Segoe UI"',
        'Roboto',
        '"Helvetica Neue"',
        'Arial',
        'sans-serif',
        '"Apple Color Emoji"',
        '"Segoe UI Emoji"',
        '"Segoe UI Symbol"'
    ].join(','),
    padding: '6px 12px',
    border: '1px solid',
    borderRadius: 6,
    margin: 10,
    backgroundImage: 'linear-gradient(0deg, #bced17, #97e216, #79da15)',
    borderColor: '#8dff1b',
    '&:hover': {
        borderColor: '#000000'
    },
    '&:active': {
        borderColor: '#000000'
    },
    '&:focus': {
        boxShadow: 'none'
    }
});

const GameMap = () => {
    const { toggleGameMap, slots, buySlot, sellSlot } = useUserContext();

    const [currentSlot, setCurrentSlot] = React.useState({
        x: 11,
        y: 11
    });

    const handleBuy = () => {
        buySlot(currentSlot.x, currentSlot.y);
    };

    const handleSell = () => {
        sellSlot(currentSlot.x, currentSlot.y);
    };

    return (
        <Box>
            <Box
                sx={{
                    backgroundImage: 'linear-gradient(0deg, #653f18, #75481a, #7a5126)',
                    padding: 1,
                    borderRadius: 2,
                    borderColor: '#ffffff',
                    border: 2
                }}
            >
                <Box
                    sx={{
                        boxShadow: 1,
                        backgroundColor: '#e8e2b3',
                        padding: 0,
                        borderRadius: 2,
                        borderColor: '#000000',
                        border: 2
                    }}
                >
                    <Box display="flex" justifyContent="center" alignItems="center">
                        <CustomTypography flexGrow={1}>Game Map</CustomTypography>
                        <Box>
                            <CustomIconButtonClose onClick={toggleGameMap}>
                                <CloseIcon sx={{ fontSize: 22 }} />
                            </CustomIconButtonClose>
                        </Box>
                    </Box>
                    <Box
                        sx={{
                            display: 'flex'
                        }}
                    >
                        <Box
                            sx={{
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                perspective: '1000px',
                                width: '380px',
                                margin: 1,
                                borderRadius: 2,
                                height: '250px',
                                background: '#a98159'
                            }}
                        >
                            <Box
                                sx={{
                                    transform: 'rotateX(60deg) rotateZ(-45deg)',
                                    display: 'flex',
                                    width: '240px',
                                    flexWrap: 'wrap',
                                    height: '240px',
                                    backgroundColor: '#1a1a1a'
                                }}
                            >
                                {slots.map((listSlot: any, x: any) => {
                                    return listSlot.map((slot: any, y: any) => {
                                        return (
                                            <Box
                                                sx={{
                                                    width: '20px',
                                                    height: '20px',
                                                    boxShadow: '0px 0px 0px 1px #336600 inset',
                                                    backgroundColor:
                                                        currentSlot.x === x && currentSlot.y === y ? '#ffaf47de' : slot.sold ? '#ff6347' : '#9bc000',
                                                    '&:hover': {
                                                        boxShadow: '0px 0px 0px 1px #ffffff inset'
                                                    }
                                                }}
                                                key={`${x}-${y}`}
                                                onClick={() => setCurrentSlot({ x, y })}
                                            ></Box>
                                        );
                                    });
                                })}
                            </Box>
                        </Box>
                    </Box>
                    <Box display="flex" justifyContent="center" alignItems="center">
                        <CustomTypography2 flexGrow={1}>Land Value: {slots[currentSlot.x][currentSlot.y].price}</CustomTypography2>
                    </Box>
                    <Box display="flex" justifyContent="center" alignItems="center">
                        <CustomButton variant="contained" onClick={handleBuy} disableRipple>
                            Buy
                        </CustomButton>
                        <CustomButton
                            sx={{
                                borderColor: '#ff7f7f',
                                backgroundImage: 'linear-gradient(0deg, #ff0000, #ff3232, #ff6666)'
                            }}
                            variant="contained"
                            onClick={handleSell}
                            disableRipple
                        >
                            Sel
                        </CustomButton>
                    </Box>
                </Box>
            </Box>
        </Box>
    );
};

export default GameMap;
