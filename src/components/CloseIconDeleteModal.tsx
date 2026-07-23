import CloseIcon from '@mui/icons-material/Close';
import { IconButton } from '@mui/material';

export default function CloseIconDeleteModal({onClose}: {onClose: (() => void) | undefined}) {
    return (
        <IconButton sx={{marginLeft: 'auto', marginRight: -3, marginBottom: -2}} onClick={onClose}>
            <CloseIcon></CloseIcon>
        </IconButton>
    )
}