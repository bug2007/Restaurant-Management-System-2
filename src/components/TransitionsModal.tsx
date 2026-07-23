import Backdrop from '@mui/material/Backdrop';
import Modal from '@mui/material/Modal';
import Fade from '@mui/material/Fade';
import Box from '@mui/material/Box';
import type { ReactNode } from "react";

interface TransitionsModalProps {
  children: ReactNode;
  open: boolean;
  onClose?: () => void;
  sx?: {}
}

const style = {
  position: 'absolute',
  top: '40%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  maxHeight: '90vh',
  bgcolor: 'background.paper',
  boxShadow: 24,
  px: 4,
  pt: 1,
  pb: 3,
  borderRadius: 3
};

export default function TransitionsModal({children, onClose, open, sx}: TransitionsModalProps) {
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
          <Box sx={{...style, ...sx}}>
            {children}
          </Box>
        </Fade>
      </Modal>
  );
}
