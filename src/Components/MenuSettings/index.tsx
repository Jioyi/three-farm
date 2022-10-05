import React from 'react';
// Material UI
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Slider from '@mui/material/Slider';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
// Icons
import VolumeUp from '@mui/icons-material/VolumeUp';
// Contexts
import { useUserContext } from '../../Contexts';

const CustomTypography = styled(Typography)(({ theme }) => ({
    color: '#ffcc00',
    padding: 5,
    fontSize: '1.5rem',
    fontWeight: 'bold',
    letterSpacing: '0.1em',
    textShadow: ' 0 -1px #000000, 1px 1px #000000, -1px -1px #000000, 1px -1px #000000, -1px 1px #000000',
    userSelect: 'none'
}));

const CustomTypography2 = styled(Typography)(({ theme }) => ({
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: '1rem',
    textShadow: ' 0 -1px #000000, 1px 1px #000000, -1px -1px #000000, 1px -1px #000000, -1px 1px #000000',
    userSelect: 'none'
}));

const CustomSlider = styled(Slider)({
    color: '#b9b388',
    height: 8,
    '& .MuiSlider-track': {
        border: '2px solid',
        borderColor: '#000000'
    },
    '& .MuiSlider-rail': {
        border: '2px solid',
        borderColor: '#000000'
    },
    '& .MuiSlider-thumb': {
        height: 20,
        width: 20,
        backgroundColor: '#ffcc00',
        border: '2px solid',
        borderColor: '#000000',
        '&:focus, &:hover, &.Mui-active, &.Mui-focusVisible': {
            boxShadow: 'inherit'
        },
        '&:before': {
            display: 'none'
        }
    },
    '& .MuiSlider-valueLabel': {
        lineHeight: 1.2,
        fontSize: 12,
        background: 'unset',
        padding: 0,
        width: 32,
        height: 32,
        borderRadius: '50% 50% 50% 0',
        backgroundColor: '#00000088',
        transformOrigin: 'bottom left',
        transform: 'translate(50%, -100%) rotate(-45deg) scale(0)',
        '&:before': { display: 'none' },
        '&.MuiSlider-valueLabelOpen': {
            transform: 'translate(50%, -100%) rotate(-45deg) scale(1)'
        },
        '& > *': {
            transform: 'rotate(45deg)'
        }
    }
});

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
        boxShadow: '0 0 0 0.2rem rgba(153,255,51,.5)'
    }
});

const MenuSettings = () => {
    const { toggleSettings, changeVolume } = useUserContext();
    const [volume, setVolume] = React.useState<number | string | Array<number | string>>(100);

    const handleSliderChange = (event: Event, newValue: number | number[]) => {
        setVolume(newValue);
        changeVolume(newValue as number);
    };

    return (
        <Box sx={{ width: 350 }}>
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
                        <CustomTypography>Game Settings</CustomTypography>
                    </Box>
                    <Box display="flex" justifyContent="center" alignItems="center">
                        <CustomTypography2>Volume</CustomTypography2>
                    </Box>
                    <Grid container spacing={1} alignItems="center">
                        <Grid item>
                            <VolumeUp
                                sx={{
                                    color: '#664800',
                                    paddingLeft: 2,
                                    paddingRight: 1,
                                    fontSize: 30
                                }}
                            />
                        </Grid>
                        <Grid item sx={{ paddingLeft: 2 }} xs>
                            <CustomSlider value={typeof volume === 'number' ? volume : 0} onChange={handleSliderChange} aria-labelledby="input-slider" />
                        </Grid>
                        <Grid item>
                            <Box sx={{ paddingLeft: 1, paddingRight: 1, width: 40 }} display="flex" justifyContent="center" alignItems="center">
                                <CustomTypography2>{volume}</CustomTypography2>
                            </Box>
                        </Grid>
                    </Grid>
                    <Box display="flex" justifyContent="center" alignItems="center">
                        <CustomButton variant="contained" onClick={toggleSettings} disableRipple>
                            Save Settings
                        </CustomButton>
                    </Box>
                </Box>
            </Box>
        </Box>
    );
};

export default MenuSettings;
