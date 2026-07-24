import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import UploadPhoto from '../components/UploadPhoto';
import { Button, InputLabel, OutlinedInput, FormHelperText } from '@mui/material';
import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { createFood, queryClient } from '../util/http';

function fileToBase64(file: File): Promise<string | null> {
  return new Promise((resolve) => {
    if (!file || file.size === 0) {
      resolve("");
      return;
    }
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => resolve("");
  });
}

export default function AddFoodForm({onClose}: {onClose: () => void}) {
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const {mutate, isPending} = useMutation({
    mutationFn: createFood,
    onSuccess: () => {
      onClose()
      queryClient.invalidateQueries({queryKey: ['foods']})
    }
  })

  async function handleTableForm(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)

    const newErrors: { [key: string]: string } = {}

    for (const [key, value] of formData) {
      if (typeof value === 'string' && value.trim() === "") {
        newErrors[key] = 'Please fill out this field.'
      }
    }

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    const imageFile = formData.get('image') as File;
    const base64String = imageFile ? await fileToBase64(imageFile) : "";

    const body: Record<string, unknown> = Object.fromEntries(formData);

    body.image = imageFile && imageFile.size > 0 ? imageFile.name : "";
    body.base64 = base64String;
    body.numberOfSeats = Number(body.numberOfSeats)
    mutate({body})
  }

  return (
    <Box sx={{display: 'flex', flexDirection: 'column', height: '100%', maxHeight: '90vh', overflow: 'hidden' }}>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "8px 5px 8px 15px",
          borderBottom: '1px solid rgba(0, 0, 0, 0.5)',
        //   flexShrink: 0
        }}
      >
        <Typography variant="h6">New Food</Typography>
        <IconButton onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </Box>

      <form id="addFoodForm" onSubmit={handleTableForm} style={{
        flex: 1,
        // minHeight: 0,        
        overflowY: 'auto',  
        display: 'flex', 
        justifyContent: 'space-between',
        alignItems: 'start',
        padding: '1.5rem', 
        // gap: '2rem', 
        // backgroundColor: '#fff'
      }}>
        <UploadPhoto />
        
        <Box sx={{
          border: '1px solid rgba(0, 0, 0, 0.2)', 
        //   flexGrow: 1, 
          width: '68%',
          p: 2.5, 
          height: 'fit-content', 
          "& > *": { mb: 3.5 }, 
          "& > *:last-child": { mb: 0 },
          "& > * > *": { width: '100%' }
        }}>
          <Box>
            <InputLabel htmlFor='tableNumber' sx={{color: 'black', marginBottom: '5px'}}>Food Name <span style={{color: 'red'}}>*</span></InputLabel>
            <OutlinedInput error={!!errors.tableNumber} id='name' name='name' placeholder='Food Name' />
            {errors.name && <FormHelperText error>{errors.name}</FormHelperText>}
          </Box>  
          <Box>
              <InputLabel htmlFor='numberOfSeats' sx={{color: 'black', marginBottom: '5px'}}>Number of Seats <span style={{color: 'red'}}>*</span></InputLabel>
              <OutlinedInput id='numberOfSeats' name='numberOfSeats' placeholder='Number of Seats' type="number" inputProps={{
                    min: 1,
                    step: 1,
                    pattern: '[0-9]*',
                    inputMode: 'numeric',
                }}
                onKeyDown={(e) => {if (['e', 'E', '+', '-', '.'].includes(e.key)) {e.preventDefault()}}}
                />
              {errors.numberOfSeats && <FormHelperText error>{errors.numberOfSeats}</FormHelperText>}
          </Box>
        </Box>
      </form>

      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "end",
          padding: "12px 15px",
          borderTop: '1px solid rgba(0, 0, 0, 0.5)',
          flexShrink: 0
        }}
      >
        <Button variant="contained" form="addTableForm" type="submit" disabled={isPending} sx={{ textTransform: 'none' }}>
          {isPending ? 'Creating...' : 'Create Table'}
        </Button>
      </Box>
    </Box>
  );
}