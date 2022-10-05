import React from 'react';
// Material UI
import { styled } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import CardMedia from '@mui/material/CardMedia';
// Icons
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
// Components
import Tooltip from '../Tooltip';
// Contexts
import { useUserContext } from '../../Contexts';

const CustomTypography = styled(Typography)(({ theme }) => ({
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: '0.8rem',
    textShadow: ' 0 -1px #000000, 1px 1px #000000, -1px -1px #000000, 1px -1px #000000, -1px 1px #000000',
    userSelect: 'none'
}));

const Avatar = () => {
    const { avatar, toggleCustomize, avatarImage, avatarNickname } = useUserContext();
    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
            <Box
                onClick={toggleCustomize}
                sx={{
                    display: 'flex',
                    backgroundImage: 'linear-gradient(0deg, #653f18, #75481a, #7a5126)',
                    verticalAlign: 'middle',
                    borderRadius: '50%',
                    border: 1,
                    borderColor: '#000000',
                    padding: 0.5,
                    cursor: 'pointer'
                }}
            >
                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: '#cb9968',
                        boxShadow: 1,
                        borderColor: '#000000',
                        border: 1,
                        padding: 0.5,
                        borderRadius: '50%'
                    }}
                >
                    <CardMedia
                        component="img"
                        sx={{
                            width: 80,
                            height: 80,
                            borderRadius: '50%',
                            userSelect: 'none'
                        }}
                        image={`assets/avatar/${avatarImage}.jpg`}
                        alt={'avatar'}
                    />
                </Box>
            </Box>
            <Tooltip title={`level: ${avatar.level}`}>
                <Box
                    sx={{
                        display: 'flex',
                        padding: 1,
                        paddingLeft: 2
                    }}
                >
                    <Box
                        sx={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            height: 30,
                            width: 120,
                            backgroundImage: 'linear-gradient(0deg, #653f18, #75481a, #7a5126)',
                            borderRadius: 10
                        }}
                    >
                        <Box
                            sx={{
                                display: 'flex',
                                position: 'relative',
                                justifyContent: 'center',
                                backgroundColor: '#000000',
                                borderRadius: 10,
                                height: 20,
                                width: 110
                            }}
                        >
                            <Box
                                sx={{
                                    top: '0',
                                    left: '0',
                                    position: 'absolute',
                                    overflow: 'hidden',
                                    borderRadius: 10,
                                    backgroundColor: 'red',
                                    width: `${(100 / avatar.expTotal) * avatar.exp * 1.1}px`,
                                    background: `linear-gradient(180deg, #f7d82f 0%, #cb7500 100%)`
                                }}
                            >
                                -
                            </Box>
                            <EmojiEventsIcon
                                sx={{
                                    fontSize: '30px',
                                    position: 'absolute',
                                    top: '-7.5px',
                                    left: '-15px',
                                    color: '#f9da34',
                                    backgroundImage: 'linear-gradient(0deg, #653f18, #75481a, #7a5126)',
                                    border: '3px solid #cb9968',
                                    borderRadius: 20
                                }}
                            />
                            <CustomTypography
                                sx={{
                                    margin: 0,
                                    padding: 0,
                                    width: 110,
                                    flexGrow: 1,
                                    zIndex: 1,
                                    textAlign: 'center'
                                }}
                            >
                                {`${avatar.exp} / ${avatar.expTotal}`}
                            </CustomTypography>
                        </Box>
                    </Box>
                </Box>
            </Tooltip>
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    backgroundImage: 'linear-gradient(0deg, #653f18, #75481a, #7a5126)',
                    borderRadius: 3,
                    border: 1,
                    flexGrow: 1,
                    borderColor: '#000000',
                    padding: 0.5
                }}
            >
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        backgroundColor: '#cb9968',
                        verticalAlign: 'middle',
                        borderRadius: 2,
                        borderColor: '#000000',
                        padding: 0.5
                    }}
                >
                    <CustomTypography>{avatarNickname}</CustomTypography>
                </Box>
            </Box>
        </Box>
    );
};

export default Avatar;
