import React from 'react';
// Material UI
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
// Components
import Tooltip from '../Tooltip';

const CustomTypography = styled(Typography)(({ theme }) => ({
    color: '#ffffff',
    fontSize: '0.8rem',
    textShadow: ' 0 -1px #000000, 1px 1px #000000, -1px -1px #000000, 1px -1px #000000, -1px 1px #000000',
    userSelect: 'none'
}));

type StoreItemProps = {
    id: number;
    image: string;
    label: string;
    description: string;
};

const ItemPreview = ({ id, label, image, description }: StoreItemProps) => {
    return (
        <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            sx={{
                display: 'flex',
                height: '100%',
                flexDirection: 'column'
            }}
        >
            <Box
                sx={{
                    backgroundImage: 'linear-gradient(0deg, #653f18, #75481a, #7a5126)',
                    padding: 0.5,
                    borderRadius: 3,
                    borderColor: '#ffffff',
                    marginBottom: 1
                }}
            >
                <Box
                    sx={{
                        boxShadow: 1,
                        backgroundColor: '#000',
                        padding: 0,
                        borderRadius: 2,
                        borderColor: '#000000',
                        border: 1
                    }}
                >
                    <Tooltip title={label}>
                        <CardMedia
                            component="img"
                            sx={{
                                borderRadius: 2,
                                width: 210
                            }}
                            image={image}
                            alt={label}
                        />
                    </Tooltip>
                </Box>
            </Box>
            <Box
                sx={{
                    display: 'flex',
                    background: '#a98159',
                    padding: 0.5,
                    borderRadius: 2,
                    marginBottom: 1,
                    minWidth: '100%',
                    maxWidth: 210,
                    minHeight: 110
                }}
            >
                <CustomTypography
                    sx={{
                        padding: 0.5,
                        borderRadius: 2,
                        marginBottom: 1
                    }}
                    style={{ wordWrap: 'break-word' }}
                >
                    {description}
                </CustomTypography>
            </Box>
        </Box>
    );
};

export default ItemPreview;
