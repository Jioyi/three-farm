import React, { FunctionComponent } from 'react';
import ReactDOM from 'react-dom';
// Material UI
import Box from '@mui/material/Box';
//icons
import CloseIcon from '@mui/icons-material/Close';

interface ModalProps {
    isShown: boolean;
    element: JSX.Element;
    close: () => void;
}

const Portal: FunctionComponent<ModalProps> = ({ isShown, element, close }) => {
    const modal = (
        <Box
            sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                backgroundColor: '#ffffff50',
                width: '100%',
                height: '100%',
                zIndex: 10,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center'
            }}
        >
            <Box
                sx={{
                    position: 'relative',
                    borderRadius: 5,
                    backgroundColor: `#f7bf82`,
                    border: `${2}px solid #edba79`,
                    borderTop: `${2}px solid #ffe0b9`,
                    borderBottom: `${3}px solid #ae753d`,
                    backgroundSize: 'contain'
                }}
            >
                {element}
                <CloseIcon
                    onClick={close}
                    sx={{
                        position: 'absolute',
                        fontSize: 30,
                        top: 10,
                        right: 10,
                        color: '#d9b38c'
                    }}
                />
            </Box>
        </Box>
    );

    return isShown ? ReactDOM.createPortal(modal, document.getElementById('modal') as HTMLElement) : null;
};
export default Portal;
