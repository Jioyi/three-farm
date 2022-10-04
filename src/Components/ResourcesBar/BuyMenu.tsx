import React, { useState } from 'react';
// Material UI
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
//icons
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';

const listMenu = [
    {
        name: 'vehicles',
        icon: 'vehicles.jpg',
        list: [
            {
                name: 'Tractor',
                price: 400,
                description: 'Required for pulling various pieces of machinery.',
                icon: 'corn',
                model: 'corn'
            },
            {
                name: 'Crop Duster',
                price: 6000,
                description: 'The plane, boss, the plane!',
                icon: 'corn',
                model: 'corn'
            },
            {
                name: 'Truck',
                price: 500,
                description: 'Transports harvested crops to silos and the town.',
                icon: 'corn',
                model: 'corn'
            },
            {
                name: 'Trailer',
                price: 200,
                description: 'Pulled by a harvester, this holds harvested crops.',
                icon: 'corn',
                model: 'corn'
            },
            {
                name: 'Harvester',
                price: 400,
                description: 'Pulling a trailer, this harvests crops that have matured.',
                icon: 'corn',
                model: 'corn'
            },
            {
                name: 'Sprayer',
                price: 200,
                description: 'Pulled by a tractor, this sprays various additives on the soil.',
                icon: 'corn',
                model: 'corn'
            },
            {
                name: 'Planter',
                price: 200,
                description: 'Pulled by a tractor, this plants seed for crops.',
                icon: 'corn',
                model: 'corn'
            },
            {
                name: 'Plow',
                price: 200,
                description: 'Pulled by a tractor, this tills the soil for planting.',
                icon: 'corn',
                model: 'corn'
            }
        ]
    },
    {
        name: 'crops',
        icon: 'crop.jpg',
        list: [
            {
                name: 'Corn',
                price: 75,
                description: 'Removes a lot of nutrients from soil. Fertilize or rotate with other crops',
                icon: 'corn',
                model: 'corn'
            },
            {
                name: 'Cotton',
                price: 15,
                description: 'Anticipate summer rains. Stores well in silos',
                icon: 'cotton',
                model: 'cotton'
            },
            {
                name: 'Wheat',
                price: 19,
                description: 'Anticipate summer rains. Stores well in silos.',
                icon: 'wheat',
                model: 'wheat'
            },
            {
                name: 'onions',
                price: 14,
                description: 'A winter and summer crop.',
                icon: 'onions',
                model: 'onions'
            },
            {
                name: 'barley',
                price: 20,
                description: 'A grain crop that is not too dependant high temperatures, but store well.',
                icon: 'barley',
                model: 'barley'
            },
            {
                name: 'tomatoes',
                price: 160,
                description: 'Plant in warm, stable weather. Keep soil wet.',
                icon: 'tomatoes',
                model: 'tomatoes'
            },
            {
                name: 'Potatoes',
                price: 52,
                description: 'Keep wet, but do not flood. Rotate with other crops after two or three years.',
                icon: 'potatoes',
                model: 'potatoes'
            },
            {
                name: 'lettuce',
                price: 59,
                description: 'Matyres well in cool weather.',
                icon: 'lettuce',
                model: 'lettuce'
            },
            {
                name: 'oats',
                price: 5,
                description: 'A grain crop that is not too dependant on high temperatures.',
                icon: 'oats',
                model: 'oats'
            },
            {
                name: 'carrots',
                price: 51,
                description: 'Keep this crop warm and wet. Watch for cold weather.',
                icon: 'carrots',
                model: 'carrots'
            },
            {
                name: 'Rice',
                price: 19,
                description: 'Best grown in warm, dry Med-May until Mid-October.',
                icon: 'rice',
                model: 'rice'
            },
            {
                name: 'Strawberries',
                price: 242,
                description: 'Must be chilled to blossom. Plant in February or March.',
                icon: 'strawberries',
                model: 'strawberries'
            },
            {
                name: 'Sorghum',
                price: 27,
                description: 'Sorghum is a Warm-Wather crop. Plant in late May or early June.',
                icon: 'sorghum',
                model: 'sorghum'
            },
            {
                name: 'Sugar Beets',
                price: 374,
                description: 'The early stages of growth are sensitive, so treat them gently.',
                icon: 'sugarbeets',
                model: 'sugarbeets'
            },
            {
                name: 'Soybeans',
                price: 27,
                description: 'Great for rotating with other crops. Plant in February and June.',
                icon: 'soybeans',
                model: 'soybeans'
            },
            {
                name: 'Peanuts',
                price: 11,
                description: 'Plant during warm weather. Try not to plant in winter.',
                icon: 'peanuts',
                model: 'peanuts'
            }
        ]
    },
    {
        name: 'animals',
        icon: 'animals.jpg',
        list: [
            {
                name: 'Cow',
                price: 480,
                description: 'A fine, sturdy bossie for the best cream.',
                icon: 'corn',
                model: 'corn'
            },
            {
                name: 'Horse',
                price: 880,
                description: 'Breed the finest stock to get rich quick.',
                icon: 'corn',
                model: 'corn'
            },
            {
                name: 'Sheep',
                price: 180,
                description: 'Shear a fine coat of wool from this one.',
                icon: 'corn',
                model: 'corn'
            },
            {
                name: 'Pig',
                price: 380,
                description: 'A handsome little package of squeals for the pen.',
                icon: 'corn',
                model: 'corn'
            }
        ]
    },
    {
        name: 'building',
        icon: 'silo.jpg',
        list: [
            {
                name: 'Corn',
                price: 0,
                description: 'hola como estas todo bien?',
                icon: 'corn',
                model: 'corn'
            },
            {
                name: 'Corn',
                price: 0,
                description: 'hola como estas todo bien?',
                icon: 'corn',
                model: 'corn'
            },
            {
                name: 'Corn',
                price: 0,
                description: 'hola como estas todo bien?',
                icon: 'corn',
                model: 'corn'
            },
            {
                name: 'Corn',
                price: 0,
                description: 'hola como estas todo bien?',
                icon: 'corn',
                model: 'corn'
            },
            {
                name: 'Corn',
                price: 0,
                description: 'hola como estas todo bien?',
                icon: 'corn',
                model: 'corn'
            },
            {
                name: 'Corn',
                price: 0,
                description: 'hola como estas todo bien?',
                icon: 'corn',
                model: 'corn'
            },
        ]
    }
];

const BuyMenu = () => {
    const [option, setOption] = useState<string>('crops');
    const [positionMenu, setPositionMenu] = useState(0);
    const [actualSelection, setActualSelection] = useState([
        {
            name: 'Corn',
            price: 0,
            description: 'hola como estas todo bien?',
            icon: 'corn',
            model: 'corn'
        }
    ]);
    return (
        <Box
            sx={{
                backgroundColor: '#f5efcf',
                borderRadius: 5,
                margin: `${5}px`,
                padding: `${10}px`
            }}
        >
            <Typography
                sx={{
                    width: '100%',
                    textAlign: 'center',
                    color: '#d9b38c',
                    fontWeight: 600,
                    marginBottom: 1
                }}
            >
                BUY {option.toUpperCase()}
            </Typography>
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'row'
                }}
            >
                <Box>
                    {listMenu.map((item, index) => (
                        <Box
                            key={`menu-${index}`}
                            onClick={() => {
                                setPositionMenu(0);
                                setOption(item.name);
                                setActualSelection(item.list);
                            }}
                            display="flex"
                            justifyContent="center"
                            alignItems="center"
                        >
                            <CardMedia
                                component="img"
                                sx={{
                                    width: 40,
                                    borderRadius: 2,
                                    padding: `${2}px`,
                                    background: `linear-gradient(0deg, #ffdfb1 0%, #a17038 100%)`,
                                    border: `${1}px solid #edba79`,
                                    borderTop: `${1}px solid #ffe0b9`,
                                    borderBottom: `${2}px solid #ae753d`,
                                    marginBottom: 1
                                }}
                                image={`assets/icons/${item.icon}`}
                                alt={item.name}
                            />
                        </Box>
                    ))}
                </Box>
                <Box
                    sx={{
                        marginLeft: `${10}px`
                    }}
                >
                    <CardMedia
                        component="img"
                        sx={{
                            width: 200,
                            padding: `${5}px`,
                            backgroundColor: '#fabf85',
                            height: 140,
                            borderRadius: 2,
                            marginBottom: 1
                        }}
                        image={`assets/icons/${actualSelection[positionMenu].icon}.jpg`}
                        alt={`${actualSelection[positionMenu].name}`}
                    />
                    <Typography
                        sx={{
                            width: `${200}px`,
                            height: 143,
                            textAlign: 'center',
                            borderRadius: 2,
                            padding: `${5}px`,
                            color: '#8f6d4a',
                            backgroundColor: '#fabf85',
                            fontWeight: 600,
                            fontSize: 12
                        }}
                    >
                        {actualSelection[positionMenu].description}
                    </Typography>
                </Box>
                <Box
                    sx={{
                        marginLeft: `${10}px`
                    }}
                >
                    <CardMedia
                        component="img"
                        sx={{
                            width: 100,
                            padding: `${5}px`,
                            backgroundColor: '#fabf85',
                            height: 100,
                            borderRadius: 2,
                            marginBottom: 1
                        }}
                        image={`assets/icons/${actualSelection[positionMenu].icon}-model.jpg`}
                        alt="strawberries"
                    />
                    <Box
                        sx={{
                            display: 'flex',
                            flexGrow: 1
                        }}
                    >
                        <IconButton
                            onClick={() => {
                                if (positionMenu > 0) {
                                    setPositionMenu(positionMenu - 1);
                                }
                            }}
                            aria-label="delete"
                            size="large"
                        >
                            <KeyboardArrowUpIcon fontSize="inherit" />
                        </IconButton>
                        <Box sx={{ flexGrow: 1 }}></Box>
                        <IconButton
                            onClick={() => {
                                if (positionMenu < actualSelection.length - 1) {
                                    setPositionMenu(positionMenu + 1);
                                }
                            }}
                            aria-label="delete"
                            size="large"
                        >
                            <KeyboardArrowDownIcon fontSize="inherit" />
                        </IconButton>
                    </Box>
                    <Typography
                        sx={{
                            width: `${100}px`,
                            textAlign: 'center',
                            borderRadius: 2,
                            padding: `${5}px`,
                            color: '#8f6d4a',
                            backgroundColor: '#fabf85',
                            fontWeight: 600,
                            fontSize: 12,
                            marginBottom: 1
                        }}
                    >
                        Price:
                        <br />
                        {actualSelection[positionMenu].price}
                    </Typography>
                    <Typography
                        sx={{
                            width: `${100}px`,
                            textAlign: 'center',
                            borderRadius: 2,
                            padding: `${5}px`,
                            color: '#8f6d4a',
                            backgroundColor: '#fabf85',
                            fontWeight: 600,
                            fontSize: 12,
                            marginBottom: 1
                        }}
                    >
                        OWN:
                        <br />
                        200
                    </Typography>
                    <Button
                        sx={{
                            backgroundColor: '#b2d16a',
                            width: `${110}px`,
                            borderRadius: 2,
                            fontWeight: 600,
                            fontSize: 12,
                            color: '#ffffff'
                        }}
                    >
                        BUY
                    </Button>
                </Box>
            </Box>
        </Box>
    );
};

export default BuyMenu;
