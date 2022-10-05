import React from 'react';
// Material UI
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import TableContainer from '@mui/material/TableContainer';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
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

const CustomTextField = styled(TextField)({
    textShadow: ' 0 -1px #000000, 1px 1px #000000, -1px -1px #000000, 1px -1px #000000, -1px 1px #000000',
    userSelect: 'none',
    '& label.Mui-focused': {
        letterSpacing: '1px',
        color: '#ffcc00'
    },
    '& .MuiInput-underline:after': {
        borderBottomColor: '#7a5126'
    },
    '& .MuiOutlinedInput-root': {
        '& fieldset': {
            borderColor: 'red',
            border: '3px solid'
        },
        '&:hover fieldset': {
            borderColor: '#ffcc00',
            border: '3px solid'
        },
        '&.Mui-focused fieldset': {
            borderColor: '#7a5126',
            border: '3px solid'
        }
    },
    '& .MuiInputBase-input': {
        borderRadius: 4,
        position: 'relative',
        width: 'auto',
        padding: '10px 12px',
        color: '#ffcc00',
        fontSize: '1.2rem',
        fontWeight: 'bold',
        letterSpacing: '0.1em',
        textShadow: ' 0 -1px #000000, 1px 1px #000000, -1px -1px #000000, 1px -1px #000000, -1px 1px #000000',
        '&:focus': {}
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

const Customize = () => {
    const { toggleCustomize, avatarImage, setAvatarImage, avatarNickname, setAvatarNickname } = useUserContext();

    const [nickname, setNickname] = React.useState(avatarNickname);

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setNickname(event.target.value);
    };

    const handleSave = () => {
        setAvatarNickname(nickname);
        toggleCustomize();
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
                        <CustomTypography flexGrow={1}>Customize Avatar</CustomTypography>
                        <Box>
                            <CustomIconButtonClose onClick={toggleCustomize}>
                                <CloseIcon sx={{ fontSize: 22 }} />
                            </CustomIconButtonClose>
                        </Box>
                    </Box>
                    <Box
                        sx={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            padding: 1
                        }}
                    >
                        <CustomTextField label="Nickname" value={nickname} onChange={handleChange} focused />
                    </Box>
                    <TableContainer
                        sx={{
                            display: 'flex',
                            userSelect: 'none',
                            padding: 1,
                            paddingRight: '0.5rem',
                            maxWidth: 440,
                            height: 400,
                            overflow: 'auto',
                            flexDirection: 'row',
                            alignItems: 'center',
                            flexWrap: 'wrap',
                            '&::-webkit-scrollbar': {
                                width: 12,
                                borderRadius: 2
                            },
                            '&::-webkit-scrollbar-track': {
                                backgroundColor: '#b9b388',
                                borderRadius: 2
                            },
                            '&::-webkit-scrollbar-thumb': {
                                backgroundColor: '#7a5126',
                                borderRadius: 2
                            },
                            scrollbarColor: '#7a5126 #b9b388'
                        }}
                    >
                        {Array.from(Array(51).keys())
                            .slice(1, 51)
                            .map((image) => {
                                return (
                                    <CardMedia
                                        key={image}
                                        component="img"
                                        onClick={() => {
                                            setAvatarImage(image);
                                        }}
                                        sx={{
                                            margin: 1,
                                            borderRadius: 2,
                                            width: 80,
                                            height: 80,
                                            filter: `grayscale(${avatarImage === image ? 0 : 1})`,
                                            border: '3px solid #ae753d',
                                            borderTop: '3px solid #ffe0b9',
                                            borderBottom: '3px solid #653f18',
                                            transition: '0.2s',
                                            '&:hover': {
                                                filter: 'grayscale(0)',
                                                animation: 'move 0.3s 2',
                                                transition: '0.2s'
                                            },
                                            '@keyframes move': {
                                                '0%': {
                                                    transform: 'rotate(-2deg)'
                                                },
                                                '33%': {
                                                    transform: 'rotate(0deg)'
                                                },
                                                '66%': {
                                                    transform: 'rotate(2deg)'
                                                },
                                                '100%': {
                                                    transform: 'rotate(0deg)'
                                                }
                                            }
                                        }}
                                        image={`assets/avatar/${image}.jpg`}
                                        alt={`avatar${image}`}
                                    />
                                );
                            })}
                    </TableContainer>
                    <Box display="flex" justifyContent="center" alignItems="center">
                        <CustomButton variant="contained" onClick={handleSave} disableRipple>
                            Save Avatar
                        </CustomButton>
                    </Box>
                </Box>
            </Box>
        </Box>
    );
};

export default Customize;
