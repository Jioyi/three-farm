import React from 'react';
// Material UI
import { styled } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

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

type ThermometerProps = {
    temperature: number;
};

const Thermometer = ({ temperature }: ThermometerProps) => {
    const [porcent, setPorcent] = React.useState(0);

    React.useEffect(() => {
        if (temperature < 0) {
            setPorcent(((temperature * -1) / 145) * 100);
        } else {
            setPorcent(((temperature + 20) / 145) * 100);
        }
    }, [temperature]);

    return (
        <Box
            sx={{
                display: 'flex',
                background: '#a98159',
                margin: 1,
                marginLeft: 3,
                marginRight: 3,
                borderRadius: 2,
                flexGrow: 1
            }}
        >
            <Box
                sx={{
                    position: 'relative',
                    margin: 1,
                    borderRadius: 2,
                    flexGrow: 1
                }}
            >
                <Box
                    sx={{
                        width: '16px',
                        margin: 'auto',
                        left: '0',
                        right: '0',
                        height: 'calc(100%)',
                        position: 'absolute',
                        backgroundColor: '#d6d6d6',
                        borderRadius: '10px 10px 0 0',
                        zIindex: '1'
                    }}
                >
                    <Box
                        id={'statistics'}
                        sx={{
                            position: 'absolute',
                            left: '0',
                            zIndex: '1',
                            fontSize: '1em',
                            top: '0',
                            height: '100%',
                            fontStyle: 'italic',
                            fontWeight: '500',
                            textShadow: '1px 1px #fff'
                        }}
                    >
                        <Box
                            id={'bg-color'}
                            sx={{
                                bottom: '-22px',
                                left: '-5px',
                                height: '26px',
                                position: 'absolute',
                                width: '26px',
                                background: '#336699',
                                borderRadius: 10,
                                padding: 0
                            }}
                        ></Box>
                        <CustomTypography
                            sx={{
                                textAlign: 'right',
                                position: 'absolute',
                                right: 0,
                                width: 70,
                                fontSize: 12,
                                padding: 0,
                                bottom: 'calc(115% )'
                            }}
                        >
                            °F
                        </CustomTypography>
                        <CustomTypography
                            sx={{
                                borderBottom: '1px solid #ffffff',
                                textAlign: 'right',
                                position: 'absolute',
                                right: 0,
                                width: 70,
                                fontSize: 12,
                                padding: 0,
                                bottom: 'calc(100%)'
                            }}
                        >
                            125
                        </CustomTypography>
                        <CustomTypography
                            sx={{
                                borderBottom: '1px solid #ffffff',
                                textAlign: 'right',
                                position: 'absolute',
                                right: 0,
                                width: 70,
                                fontSize: 12,
                                padding: 0,
                                bottom: 'calc(87.5%)'
                            }}
                        >
                            105
                        </CustomTypography>
                        <CustomTypography
                            sx={{
                                borderBottom: '1px solid #ffffff',
                                textAlign: 'right',
                                position: 'absolute',
                                right: 0,
                                width: 70,
                                fontSize: 12,
                                padding: 0,
                                bottom: 'calc(75%)'
                            }}
                        >
                            90
                        </CustomTypography>
                        <CustomTypography
                            sx={{
                                borderBottom: '1px solid #ffffff',
                                textAlign: 'right',
                                position: 'absolute',
                                right: 0,
                                width: 70,
                                fontSize: 12,
                                padding: 0,
                                bottom: 'calc(62.5%)'
                            }}
                        >
                            70
                        </CustomTypography>
                        <CustomTypography
                            sx={{
                                borderBottom: '1px solid #ffffff',
                                textAlign: 'right',
                                position: 'absolute',
                                right: 0,
                                width: 70,
                                fontSize: 12,
                                padding: 0,
                                bottom: 'calc(50%)'
                            }}
                        >
                            50
                        </CustomTypography>
                        <CustomTypography
                            sx={{
                                borderBottom: '1px solid #ffffff',
                                textAlign: 'right',
                                position: 'absolute',
                                right: 0,
                                width: 70,
                                fontSize: 12,
                                padding: 0,
                                bottom: 'calc(37.5%)'
                            }}
                        >
                            35
                        </CustomTypography>
                        <CustomTypography
                            sx={{
                                borderBottom: '1px solid #ffffff',
                                textAlign: 'right',
                                position: 'absolute',
                                right: 0,
                                width: 70,
                                fontSize: 12,
                                padding: 0,
                                bottom: 'calc(25%)'
                            }}
                        >
                            20
                        </CustomTypography>
                        <CustomTypography
                            sx={{
                                borderBottom: '1px solid #ffffff',
                                textAlign: 'right',
                                position: 'absolute',
                                right: 0,
                                width: 70,
                                fontSize: 12,
                                padding: 0,
                                bottom: 'calc(12.5%)'
                            }}
                        >
                            0
                        </CustomTypography>
                        <CustomTypography
                            sx={{
                                borderBottom: '1px solid #ffffff',
                                textAlign: 'right',
                                position: 'absolute',
                                right: 0,
                                width: 70,
                                fontSize: 12,
                                padding: 0,
                                bottom: 'calc(0%)'
                            }}
                        >
                            -20
                        </CustomTypography>
                        <CustomTypography
                            sx={{
                                textAlign: 'right',
                                position: 'absolute',
                                left: 0,
                                width: 70,
                                fontSize: 12,
                                padding: 0,
                                bottom: 'calc(115% )'
                            }}
                        >
                            °C
                        </CustomTypography>
                        <CustomTypography
                            sx={{
                                borderBottom: '1px solid #ffffff',
                                textAlign: 'right',
                                position: 'absolute',
                                left: 0,
                                width: 70,
                                fontSize: 12,
                                padding: 0,
                                bottom: 'calc(100%)'
                            }}
                        >
                            50
                        </CustomTypography>
                        <CustomTypography
                            sx={{
                                borderBottom: '1px solid #ffffff',
                                textAlign: 'right',
                                position: 'absolute',
                                left: 0,
                                width: 70,
                                fontSize: 12,
                                padding: 0,
                                bottom: 'calc(87.5%)'
                            }}
                        >
                            40
                        </CustomTypography>
                        <CustomTypography
                            sx={{
                                borderBottom: '1px solid #ffffff',
                                textAlign: 'right',
                                position: 'absolute',
                                left: 0,
                                width: 70,
                                fontSize: 12,
                                padding: 0,
                                bottom: 'calc(75%)'
                            }}
                        >
                            30
                        </CustomTypography>
                        <CustomTypography
                            sx={{
                                borderBottom: '1px solid #ffffff',
                                textAlign: 'right',
                                position: 'absolute',
                                left: 0,
                                width: 70,
                                fontSize: 12,
                                padding: 0,
                                bottom: 'calc(62.5%)'
                            }}
                        >
                            20
                        </CustomTypography>
                        <CustomTypography
                            sx={{
                                borderBottom: '1px solid #ffffff',
                                textAlign: 'right',
                                position: 'absolute',
                                left: 0,
                                width: 70,
                                fontSize: 12,
                                padding: 0,
                                bottom: 'calc(50%)'
                            }}
                        >
                            10
                        </CustomTypography>
                        <CustomTypography
                            sx={{
                                borderBottom: '1px solid #ffffff',
                                textAlign: 'right',
                                position: 'absolute',
                                left: 0,
                                width: 70,
                                fontSize: 12,
                                padding: 0,
                                bottom: 'calc(37.5%)'
                            }}
                        >
                            0
                        </CustomTypography>
                        <CustomTypography
                            sx={{
                                borderBottom: '1px solid #ffffff',
                                textAlign: 'right',
                                position: 'absolute',
                                left: 0,
                                width: 70,
                                fontSize: 12,
                                padding: 0,
                                bottom: 'calc(25%)'
                            }}
                        >
                            -10
                        </CustomTypography>
                        <CustomTypography
                            sx={{
                                borderBottom: '1px solid #ffffff',
                                textAlign: 'right',
                                position: 'absolute',
                                left: 0,
                                width: 70,
                                fontSize: 12,
                                padding: 0,
                                bottom: 'calc(12.5%)'
                            }}
                        >
                            -20
                        </CustomTypography>
                        <CustomTypography
                            sx={{
                                borderBottom: '1px solid #ffffff',
                                textAlign: 'right',
                                position: 'absolute',
                                left: 0,
                                width: 70,
                                fontSize: 12,
                                padding: 0,
                                bottom: 'calc(0%)'
                            }}
                        >
                            -30
                        </CustomTypography>
                    </Box>
                    <Box
                        id={'mercury'}
                        sx={{
                            height: `${porcent}%`,
                            position: 'absolute',
                            bottom: '0',
                            left: '0',
                            width: '100%',
                            backgroundColor: '#ff0000',
                            borderRadius: '10px 10px 0 0',
                            transition: 'all .5s ease-in-out',
                            backgroundImage: 'linear-gradient(0deg, #336699, #ff0000, #ff0000)'
                        }}
                    ></Box>
                </Box>
            </Box>
        </Box>
    );
};

export default Thermometer;
