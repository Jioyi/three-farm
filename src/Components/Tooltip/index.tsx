import { styled } from '@mui/material/styles';
import { alpha } from '@mui/material';
import Tooltip, { TooltipProps, tooltipClasses } from '@mui/material/Tooltip';

const CustomTooltip = styled(({ className, ...props }: TooltipProps) => <Tooltip {...props} classes={{ popper: className }} />)(({ theme }) => ({
    [`& .${tooltipClasses.tooltip}`]: {
        backgroundColor: alpha('#000000', 0.8),
        color: '#ffffff',
        boxShadow: theme.shadows[1],
        fontSize: 12
    }
}));

export default CustomTooltip;
