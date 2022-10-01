// Material UI
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import Backdrop from '@mui/material/Backdrop';

import LinearProgress, { linearProgressClasses } from '@mui/material/LinearProgress';

const BorderLinearProgress = styled(LinearProgress)(({ theme }) => ({
    height: 6,
    borderRadius: 5,
    [`&.${linearProgressClasses.colorPrimary}`]: {
        backgroundColor: '#ffffff'
    },
    [`& .${linearProgressClasses.bar}`]: {
        borderRadius: 5,
        backgroundColor: '#62e3f6'
    }
}));

const CustomTypography = styled(Typography)(({ theme }) => ({
    color: '#FFFFFF',
    padding: 5
}));

type LoadingProps = {
    loading: boolean;
    progress: number;
};

const Loading = ({ loading, progress }: LoadingProps) => {
    return (
        <Backdrop sx={{ flexGrow: 1, backgroundColor: '#000', color: '#fff', opacity: 1, zIndex: (theme) => theme.zIndex.drawer + 1 }} open={loading}>
            <Box sx={{ flexGrow: 0.8 }}>
                <Box display="flex" justifyContent="center" alignItems="center">
                    <CardMedia component="img" sx={{ width: 150, padding: 5 }} image="/logo512.png" alt="logo" />
                </Box>
                <Box display="flex" justifyContent="center" alignItems="center">
                    <CustomTypography>Loading Demo / three-farm</CustomTypography>
                </Box>
                <BorderLinearProgress variant="determinate" value={progress} />
                <Box display="flex" justifyContent="center" alignItems="center">
                    <CustomTypography>{progress}%</CustomTypography>
                </Box>
            </Box>
        </Backdrop>
    );
};

export default Loading;
