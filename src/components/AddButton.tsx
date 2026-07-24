import AddIcon from '@mui/icons-material/Add';
import { Button } from '@mui/material';
import { useState } from 'react';
import TransitionsModal from './TransitionsModal';
import AddEmployeeForm from '../pages/AddEmployeeForm';
import AddTableForm from '../pages/AddTableForm';
import AddFoodForm from '../pages/AddFoodForm';

export default function AddButton({type}: {type: string}) {
    const [open, setOpen] = useState<string | null>(null)

    return (
        <>
        <Button variant='contained' startIcon={<AddIcon />} sx={{textTransform: 'none'}} onClick={() => setOpen(type)}>
            {`Add New ${type}`}
        </Button>

        <TransitionsModal sx={{borderRadius: 'none', width: '100%', maxWidth: 1000, p: 0, top: '50%'}} open={!!open} onClose={() => setOpen(null)}>
            {open === "Employee" ? <AddEmployeeForm onClose={() => setOpen(null)} /> : open === "Table" ? <AddTableForm onClose={() => setOpen(null)} /> : <AddFoodForm onClose={() => setOpen(null)} />}
        </TransitionsModal>
        </>
    )
}