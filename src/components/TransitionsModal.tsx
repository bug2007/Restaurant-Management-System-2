import Backdrop from '@mui/material/Backdrop';
import Modal from '@mui/material/Modal';
import Fade from '@mui/material/Fade';
import Box from '@mui/material/Box';
import type { ReactNode } from "react";
import CloseIcon from '@mui/icons-material/Close';
import { IconButton } from '@mui/material';

interface TransitionsModalProps {
  children: ReactNode;
  open: boolean;
  onClose?: () => void;
}

const style = {
  position: 'absolute',
  top: '40%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  // border: '2px solid #000',
  boxShadow: 24,
  px: 4,
  pt: 1,
  pb: 3,
  borderRadius: 3
};

export default function TransitionsModal({children, onClose, open}: TransitionsModalProps) {
  return (
      <Modal
        open={open}
        onClose={onClose}
        closeAfterTransition
        slots={{ backdrop: Backdrop }}
        slotProps={{
          backdrop: {
            timeout: 500,
          },
        }}
      >
        <Fade in={open}>
          <Box sx={{...style, display: 'flex', flexDirection: 'column'}}>
            <IconButton sx={{marginLeft: 'auto', marginRight: -3, marginBottom: -2}} onClick={onClose}>
              <CloseIcon></CloseIcon>
            </IconButton>
            {children}
          </Box>
        </Fade>
      </Modal>
  );
}
