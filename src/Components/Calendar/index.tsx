import React from 'react';
// Material UI
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
// Icons
import CloseIcon from '@mui/icons-material/Close';
// Contexts
import { useUserContext } from '../../Contexts';
// Components
import Thermometer from '../Thermometer';

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
    color: '#ffffff',
    padding: 5,
    fontSize: '1rem',
    fontWeight: 'bold',
    letterSpacing: '0.1em',
    textShadow: ' 0 -1px #000000, 1px 1px #000000, -1px -1px #000000, 1px -1px #000000, -1px 1px #000000',
    userSelect: 'none'
}));

const MonthOfYear = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

const Calendar = () => {
    const { toggleCalendar, forecast } = useUserContext();
    const [weather, setWeather] = React.useState({
        temperature: 52,
        month: 0,
        day: 0,
        current: 'summer',
        next: 'spring',
        year: 2022,
        climate: 0,
        weak: 1
    });

    React.useEffect(() => {
        if (forecast) {
            let current = 'summer';
            let next = 'autumn';
            if (forecast[0].month === 8 || forecast[0].month === 9 || forecast[0].month === 10) {
                //AUTUMN (otoño)
                current = 'autumn';
                next = 'winter';
            } else if (forecast[0].month === 11 || forecast[0].month === 0 || forecast[0].month === 1) {
                //WINTER (invierno)
                current = 'winter';
                next = 'spring';
            } else if (forecast[0].month === 2 || forecast[0].month === 3 || forecast[0].month === 4) {
                //SPRING (primavera)
                current = 'spring';
                next = 'summer';
            }

            setWeather({
                temperature: forecast[0].temperature,
                month: forecast[0].month,
                day: forecast[0].day,
                current: current,
                next: next,
                year: forecast[0].year,
                climate: forecast[0].climate,
                weak: forecast[0].week
            });
        }
    }, [forecast]);

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
                        <CustomTypography flexGrow={1}>Weather</CustomTypography>
                        <Box>
                            <CustomIconButtonClose onClick={toggleCalendar}>
                                <CloseIcon sx={{ fontSize: 22 }} />
                            </CustomIconButtonClose>
                        </Box>
                    </Box>
                    <Box display="flex" justifyContent="center" alignItems="center">
                        <Box
                            sx={{
                                display: 'flex',
                                background: '#a98159',
                                margin: 1,
                                borderRadius: 2,
                                flexGrow: 1,
                                width: 380
                            }}
                        >
                            {weather?.current && (
                                <CardMedia
                                    component="img"
                                    sx={{ width: 30, height: 30, padding: 0.5 }}
                                    image={`assets/icons/${weather?.current}.png`}
                                    alt="current_season"
                                />
                            )}
                            <CustomTypography2 sx={{ padding: 1, flexGrow: 1 }}>
                                Week {weather?.weak} of {MonthOfYear[weather?.month]}
                            </CustomTypography2>
                            <CardMedia
                                component="img"
                                sx={{ width: 30, height: 30, padding: 0.5, borderRadius: 5 }}
                                image={`assets/icons/weather/weather${weather?.climate}.png`}
                                alt="climate"
                            />
                        </Box>
                    </Box>
                    <Box
                        sx={{
                            display: 'flex',
                            background: '#a98159',
                            margin: 1,
                            borderRadius: 2,
                            paddingTop: '30px',
                            paddingBottom: '20px'
                        }}
                    >
                        <Box
                            sx={{
                                display: 'flex',
                                background: '#a98159',
                                margin: 1,
                                borderRadius: 2,
                                flexGrow: 1
                            }}
                        >
                            <Box
                                sx={{
                                    background: '#a98159',
                                    margin: 1,
                                    flexGrow: 1,
                                    borderRadius: 2
                                }}
                            >
                                <Box
                                    sx={{
                                        background: 'red',
                                        borderTopRightRadius: 10,
                                        borderTopLeftRadius: 10
                                    }}
                                >
                                    <CustomTypography2 sx={{ padding: 0.5, fontSize: 10 }}>{weather?.year}</CustomTypography2>
                                    <CustomTypography2 sx={{ paddingBottom: 1 }}>{MonthOfYear[weather.month]}</CustomTypography2>
                                </Box>
                                <Box
                                    sx={{
                                        background: '#fff',
                                        borderBottomRightRadius: 10,
                                        borderBottomLeftRadius: 10
                                    }}
                                >
                                    <CustomTypography2 sx={{ padding: 1, fontSize: 40 }}>{weather?.day}</CustomTypography2>
                                </Box>
                            </Box>
                        </Box>
                        <Thermometer temperature={weather?.temperature} />
                    </Box>
                    <Box>
                        <Box
                            sx={{
                                justifyContent: 'center',
                                alignItems: 'center',
                                background: '#a98159',
                                margin: 1,
                                borderRadius: 2,
                                flexGrow: 1
                            }}
                        >
                            <Box
                                sx={{
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    paddingTop: 1
                                }}
                            >
                                {forecast?.slice(1, 8).map((forecast: any, index: any) => {
                                    return (
                                        <CardMedia
                                            key={index}
                                            component="img"
                                            sx={{ borderRadius: 5, width: 30, height: 30, padding: 0.5 }}
                                            image={`assets/icons/weather/weather${forecast.climate}.png`}
                                            alt={`forecast${forecast.climate}`}
                                        />
                                    );
                                })}
                            </Box>
                            <CustomTypography2 sx={{ padding: 1 }}>Seven Day Forecast</CustomTypography2>
                        </Box>
                    </Box>
                </Box>
            </Box>
        </Box>
    );
};

export default Calendar;
