import React from 'react';
// Material UI
import { styled } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import CardMedia from '@mui/material/CardMedia';
import Box from '@mui/material/Box';
// Contexts
import { useUserContext } from '../../Contexts';

const CustomTypography = styled(Typography)(({ theme }) => ({
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

//const DayOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MonthOfYear = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

const MiniCalendar = () => {
    const { toggleCalendar, forecast } = useUserContext();

    const [day, setDay] = React.useState({
        month: 0,
        day: 0,
        year: 2022,
        climate: 0
    });

    React.useEffect(() => {
        if (forecast) {
            setDay({
                month: forecast[0].month,
                day: forecast[0].day,
                year: forecast[0].year,
                climate: forecast[0].climate
            });
        }
    }, [forecast]);

    return (
        <Box
            sx={{
                display: 'flex',
                position: 'absolute',
                bottom: 0,
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                zIndex: 3,
                left: 0
            }}
        >
            <Box
                onClick={toggleCalendar}
                sx={{
                    display: 'flex',
                    margin: 1,
                    borderRadius: 2,
                    flexGrow: 1,
                    minWidth: 150,
                    cursor: 'pointer',
                }}
            >
                <Box
                    sx={{
                        background: '#a98159',
                        margin: 1,
                        flexGrow: 1,
                        borderRadius: 3,
                        borderColor: '#000',
                        border: 2
                    }}
                >
                    <Box
                        sx={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            background: 'red',
                            borderTopRightRadius: 10,
                            borderTopLeftRadius: 10
                        }}
                    >
                        <CustomTypography sx={{ padding: 0.5, fontSize: 10 }}>
                            {day?.year} {MonthOfYear[day.month]}
                        </CustomTypography>
                        <CardMedia
                                component="img"
                                sx={{ width: 20, height: 20, padding: 0.5, borderRadius: "50%" }}
                                image={`assets/icons/weather/weather${day.climate}.png`}
                                alt="climate"
                            />
                    </Box>
                    <Box
                        sx={{
                            background: '#fff',
                            borderBottomRightRadius: 10,
                            borderBottomLeftRadius: 10
                        }}
                    >
                        <CustomTypography sx={{ padding: 1, fontSize: 25 }}>{day?.day}</CustomTypography>
                    </Box>
                </Box>
            </Box>
        </Box>
    );
};

export default MiniCalendar;
