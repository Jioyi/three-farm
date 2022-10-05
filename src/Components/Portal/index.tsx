import React from 'react';
import ReactDOM from 'react-dom';
// Material UI
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Dialog from '@mui/material/Dialog';

interface PortalProps {
    open: boolean;
    element: JSX.Element;
    onClose: () => void;
}

const Modal = styled(Dialog)(({ theme }) => ({
    boxShadow: 'none',
    '& .MuiDialog-root': {
        backgroundColor: '#fff'
    },
    '& .MuiDialog-paper': {
        boxShadow: 'none'
    },
    '& .MuiDialog-container': {
        boxShadow: 'none'
    }
}));

const Portal: React.FunctionComponent<PortalProps> = ({ open, element, onClose }) => {

    const modal = (
        <Modal BackdropProps={{ style: { backgroundColor: '#ffffff50' } }} PaperComponent={Box} onClose={onClose} open={open}>
            {element}
        </Modal>
    );
    
    return open ? ReactDOM.createPortal(modal, document.getElementById('modal') as HTMLElement) : null;
};

export default Portal;
