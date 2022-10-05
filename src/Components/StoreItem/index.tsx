import React from 'react';
// Material UI
import Box from '@mui/material/Box';
import CardMedia from '@mui/material/CardMedia';
// Components
import Tooltip from '../Tooltip';

type StoreItemProps = {
    id: number;
    image: string;
    name: string;
    assets: number[];
    setTargetID: (...args: any[]) => any;
    setTargetCategoryID: (...args: any[]) => any;
};

const StoreItem = ({ id, name, image, assets, setTargetCategoryID, setTargetID }: StoreItemProps) => {
    return (
        <Tooltip title={name}>
            <Box
                sx={{
                    background: '#653f18',
                    padding: 0.5,
                    borderRadius: 3,
                    marginBottom: 1,
                    cursor: 'pointer'
                }}
                onClick={() => {
                    setTargetCategoryID(id);
                    setTargetID(assets[0]);
                }}
            >
                <Box
                    sx={{
                        boxShadow: 1,
                        backgroundColor: '#000',
                        padding: 0,
                        borderRadius: 2,
                        borderColor: '#000000'
                    }}
                >
                    <CardMedia
                        component="img"
                        sx={{
                            borderRadius: 2,
                            width: 40
                        }}
                        image={image}
                        alt={name}
                    />
                </Box>
            </Box>
        </Tooltip>
    );
};

export default StoreItem;
