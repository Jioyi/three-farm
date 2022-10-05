import React from 'react';
// Material UI
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import CardMedia from '@mui/material/CardMedia';
import IconButton from '@mui/material/IconButton';
// Icons
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
// Contexts
import { useUserContext } from '../../Contexts';
// Components
import StoreItem from '../StoreItem';
import ItemPreview from '../ItemPreview';
// Interface
import { AssetData, CategoryData } from '../../EngineGame/interfaces/index';
import Tooltip from '../Tooltip';

const CustomIconButton = styled(IconButton)(({ theme }) => ({
    padding: 0,
    background: '#996633',
    border: '2px solid',
    borderColor: '#333300',
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
    fontSize: '0.8rem',
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
        boxShadow: '0 0 0 0.2rem rgba(153,255,51,.5)'
    }
});

const Store = () => {
    const { toggleStore, gameData, createGameObject } = useUserContext();
    const [targetCategoryID, setTargetCategoryID] = React.useState();
    const [targetID, setTargetID] = React.useState();
    const [target, setTarget] = React.useState<AssetData>();

    React.useEffect(() => {
        let assetIndex = gameData?.assets?.findIndex((asset: AssetData) => asset.id === targetID);
        if (assetIndex <= -1) {
            setTarget(undefined);
            return;
        }
        let assetData = gameData?.assets[assetIndex];
        setTarget(assetData);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [targetID]);

    React.useEffect(() => {
        let categoryID = gameData?.categories[0].id;
        setTargetCategoryID(categoryID);
        let assetIndex = gameData?.categories[0].assets[0];
        setTargetID(assetIndex);
    }, [gameData]);

    const handleBuy = (_nameAsset: string) => {
        toggleStore();
        createGameObject(_nameAsset);
    };

    const handlePrevious = () => {
        let categoryIndex = gameData?.categories?.findIndex((category: CategoryData) => category.id === targetCategoryID);
        if (categoryIndex <= -1) return;
        let category = gameData?.categories[categoryIndex];

        let currentIndex = category.assets?.findIndex((id: number) => id === targetID);
        if (currentIndex <= -1) return;

        let nextIndex = category.assets?.findIndex((id: number) => id === gameData?.categories[categoryIndex].assets[currentIndex - 1]);
        if (nextIndex <= -1) return;

        let assetIndex = gameData?.assets?.findIndex((asset: AssetData) => asset.id === gameData?.categories[categoryIndex].assets[nextIndex]);
        if (assetIndex <= -1) {
            setTarget(undefined);
            return;
        }
        let assetData = gameData?.assets[assetIndex];
        setTarget(assetData);
        setTargetID(assetData.id);
    };

    const handleNext = () => {
        let categoryIndex = gameData?.categories?.findIndex((category: CategoryData) => category.id === targetCategoryID);
        if (categoryIndex <= -1) return;
        let category = gameData?.categories[categoryIndex];

        let currentIndex = category.assets?.findIndex((id: number) => id === targetID);
        if (currentIndex <= -1) return;

        let nextIndex = category.assets?.findIndex((id: number) => id === gameData?.categories[categoryIndex].assets[currentIndex + 1]);
        if (nextIndex <= -1) return;

        let assetIndex = gameData?.assets?.findIndex((asset: AssetData) => asset.id === gameData?.categories[categoryIndex].assets[nextIndex]);
        if (assetIndex <= -1) {
            setTarget(undefined);
            return;
        }
        let assetData = gameData?.assets[assetIndex];
        setTarget(assetData);
        setTargetID(assetData.id);
    };

    return (
        <Box sx={{ minWidth: 350 }}>
            <Box
                sx={{
                    background: '#653f18',
                    padding: 0.5,
                    borderRadius: 4,
                    borderColor: '#ffffff',
                    border: 2
                }}
            >
                <Box
                    sx={{
                        boxShadow: 1,
                        backgroundColor: '#e8e2b3',
                        padding: 0,
                        borderRadius: 4,
                        borderColor: '#000000',
                        border: 2
                    }}
                >
                    <Box display="flex" justifyContent="center" alignItems="center">
                        <CustomTypography>Store</CustomTypography>
                    </Box>
                    <Grid container alignItems="top">
                        <Box
                            sx={{
                                display: 'flex',
                                alignItems: 'flex-start',
                                flexDirection: 'column',
                                m: 1
                            }}
                        >
                            {gameData?.categories?.map((item: CategoryData, index: any) => {
                                return (
                                    <StoreItem
                                        key={index}
                                        id={item.id}
                                        image={item.image}
                                        name={item.name}
                                        assets={item.assets}
                                        setTargetID={setTargetID}
                                        setTargetCategoryID={setTargetCategoryID}
                                    />
                                );
                            })}
                        </Box>
                        <Grid sx={{ m: 1 }} item xs>
                            {target && <ItemPreview id={target.id} label={target.label} image={target.image} description={target.description} />}
                        </Grid>
                        <Grid sx={{ m: 1 }} item>
                            {target && (
                                <Box
                                    sx={{
                                        display: 'flex',
                                        flexDirection: 'column'
                                    }}
                                    alignItems="center"
                                >
                                    <Tooltip title={target.label}>
                                        <Box
                                            sx={{
                                                background: '#653f18',
                                                padding: 0.5,
                                                borderRadius: 3,
                                                marginBottom: 1,
                                                cursor: 'pointer'
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
                                                        width: 100
                                                    }}
                                                    image={target.imageModel}
                                                    alt={target.label}
                                                />
                                            </Box>
                                        </Box>
                                    </Tooltip>
                                    <Box
                                        sx={{
                                            display: 'flex',
                                            width: '100%',
                                            borderRadius: 2,
                                            marginBottom: 1
                                        }}
                                    >
                                        <CustomIconButton sx={{ marginLeft: 1 }} onClick={handlePrevious}>
                                            <KeyboardArrowUpIcon sx={{ fontSize: 22 }} />
                                        </CustomIconButton>
                                        <Box sx={{ flexGrow: 1 }}></Box>
                                        <CustomIconButton sx={{ marginRight: 1 }} onClick={handleNext}>
                                            <KeyboardArrowDownIcon sx={{ fontSize: 22 }} />
                                        </CustomIconButton>
                                    </Box>
                                    <Box
                                        sx={{
                                            display: 'flex',
                                            height: '100%',
                                            width: '100%',
                                            flexDirection: 'column',
                                            background: '#a98159',
                                            borderRadius: 2,
                                            marginBottom: 1,
                                            maxWidth: 210
                                        }}
                                        display="flex"
                                        justifyContent="center"
                                        alignItems="center"
                                    >
                                        <Box display="flex" justifyContent="center" alignItems="center">
                                            <CardMedia
                                                component="img"
                                                sx={{
                                                    width: 20,
                                                    height: 20
                                                }}
                                                image={'assets/icons/coin.png'}
                                                alt={'price'}
                                            />
                                            <CustomTypography2
                                                display="flex"
                                                justifyContent="center"
                                                alignItems="center"
                                                sx={{
                                                    padding: 0.5
                                                }}
                                            >
                                                {target.price}
                                            </CustomTypography2>
                                        </Box>
                                    </Box>
                                    <Box display="flex" justifyContent="center" alignItems="center">
                                        <CustomButton variant="contained" disableRipple onClick={() => handleBuy(target.name)}>
                                            Buy
                                        </CustomButton>
                                    </Box>
                                </Box>
                            )}
                        </Grid>
                    </Grid>
                </Box>
            </Box>
        </Box>
    );
};

export default Store;
