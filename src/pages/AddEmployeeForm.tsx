import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import UploadPhoto from '../components/UploadPhoto';
import { Select, MenuItem, Button, InputLabel, OutlinedInput, FormHelperText } from '@mui/material';
import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { createEmployee, queryClient } from '../util/http';

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

export default function AddEmployeeForm({onClose}: {onClose: () => void}) {
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [joinDateVal, setJoinDateVal] = useState<string>('');

  const todayStr = new Date().toISOString().split('T')[0];

  const {mutate, isPending} = useMutation({
    mutationFn: createEmployee,
    onSuccess: () => {
      onClose()
      queryClient.invalidateQueries({queryKey: ['employees']})
    }
  })

  async function handleEmployeeForm(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)

    const newErrors: { [key: string]: string } = {}

    const optionalFields = ['middleName', 'spouseName', 'image'];
    for (const [key, value] of formData) {
      if (optionalFields.includes(key)) continue;
      if (typeof value === 'string' && value.trim() === "") {
        newErrors[key] = 'Please fill out this field.'
      }
    }

    const emailVal = formData.get('email') as string;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (emailVal && !emailRegex.test(emailVal)) {
      newErrors['email'] = 'Enter a valid email address.';
    }

    const phoneVal = formData.get('phoneNumber') as string;
    const phoneRegex = /^[0-9+\-\s()]{7,15}$/;
    if (phoneVal && !phoneRegex.test(phoneVal)) {
      newErrors['phoneNumber'] = 'Enter a valid phone number.';
    }

    const genderVal = formData.get('genderId');
    if (!genderVal) {
      newErrors['genderId'] = 'Please fill out this field.';
    }

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    const imageFile = formData.get('image') as File;
    const base64String = imageFile ? await fileToBase64(imageFile) : "";

    const body: Record<string, unknown> = Object.fromEntries(formData);

    body.dob = new Date(body.dob as string).toISOString();
    body.joinDate = new Date(body.joinDate as string).toISOString();

    body.image = imageFile && imageFile.size > 0 ? imageFile.name : "";
    body.base64 = base64String;
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
        <Typography variant="h6">New Employee</Typography>
        <IconButton onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </Box>

      <form id="addEmployeeForm" onSubmit={handleEmployeeForm} style={{
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
          "& > *": { display: 'flex', justifyContent: 'space-between', gap: '30px', mb: 3.5 }, 
          "& > *:last-child": { mb: 0 },
          "& > * > *": { width: '100%' }
        }}>
          <Box>
            <div>
              <InputLabel htmlFor='firstName' sx={{color: 'black', marginBottom: '5px'}}>First Name <span style={{color: 'red'}}>*</span></InputLabel>
              <OutlinedInput error={!!errors.firstName} id='firstName' name='firstName' fullWidth placeholder='First Name' />
              {errors.firstName && <FormHelperText error>{errors.firstName}</FormHelperText>}
            </div>
            <div>
              <InputLabel htmlFor='middleName' sx={{color: 'black', marginBottom: '5px'}}>Middle Name</InputLabel>
              <OutlinedInput id='middleName' name='middleName' fullWidth placeholder='Middle Name' />
            </div>
          </Box>

          <Box>
            <div>
              <InputLabel htmlFor='lastName' sx={{color: 'black', marginBottom: '5px'}}>Last Name <span style={{color: 'red'}}>*</span></InputLabel>
              <OutlinedInput error={!!errors.lastName} id='lastName' name='lastName' fullWidth placeholder='Last Name' />
              {errors.lastName && <FormHelperText error>{errors.lastName}</FormHelperText>}
            </div>
            <div>
              <InputLabel htmlFor='spouseName' sx={{color: 'black', marginBottom: '5px'}}>Spouse Name</InputLabel>
              <OutlinedInput id='spouseName' name='spouseName' fullWidth placeholder="Spouse Name" />
            </div>
          </Box>

          <Box>
            <div>
              <InputLabel htmlFor='fatherName' sx={{color: 'black', marginBottom: '5px'}}>Father's Name <span style={{color: 'red'}}>*</span></InputLabel>
              <OutlinedInput error={!!errors.fatherName} id='fatherName' name='fatherName' fullWidth placeholder="Father's Name" />
              {errors.fatherName && <FormHelperText error>{errors.fatherName}</FormHelperText>}
            </div>
            <div>
              <InputLabel htmlFor='motherName' sx={{color: 'black', marginBottom: '5px'}}>Mother's Name <span style={{color: 'red'}}>*</span></InputLabel>
              <OutlinedInput error={!!errors.motherName} id='motherName' name='motherName' fullWidth placeholder="Mother's Name" />
              {errors.motherName && <FormHelperText error>{errors.motherName}</FormHelperText>}
            </div>
          </Box>

          <Box>
            <div>
              <InputLabel htmlFor='designation' sx={{color: 'black', marginBottom: '5px'}}>Designation <span style={{color: 'red'}}>*</span></InputLabel>
              <OutlinedInput error={!!errors.designation} id='designation' name='designation' fullWidth placeholder="Designation" />
              {errors.designation && <FormHelperText error>{errors.designation}</FormHelperText>}
            </div>
            <div>
              <InputLabel htmlFor='email' sx={{color: 'black', marginBottom: '5px'}}>Email Address <span style={{color: 'red'}}>*</span></InputLabel>
              <OutlinedInput error={!!errors.email} id='email' name='email' fullWidth placeholder="Email Address" />
              {errors.email && <FormHelperText error>{errors.email}</FormHelperText>}
            </div>
          </Box>

          <Box>
            <div>
              <InputLabel htmlFor='phoneNumber' sx={{color: 'black', marginBottom: '5px'}}>Phone Number <span style={{color: 'red'}}>*</span></InputLabel>
              <OutlinedInput error={!!errors.phoneNumber} id='phoneNumber' name='phoneNumber' fullWidth placeholder="Phone Number" />
              {errors.phoneNumber && <FormHelperText error>{errors.phoneNumber}</FormHelperText>}
            </div>
            <div>
              <InputLabel htmlFor="genderId" sx={{ color: 'black', marginBottom: '5px' }}>Gender <span style={{color: 'red'}}>*</span></InputLabel>
              <Select
                id="genderId"
                name="genderId"
                defaultValue=""
                displayEmpty
                fullWidth
                error={!!errors.genderId}
              >
                <MenuItem value="" disabled>Select Gender</MenuItem>
                <MenuItem value={0}>Male</MenuItem>
                <MenuItem value={1}>Female</MenuItem>
                <MenuItem value={2}>Other</MenuItem>
              </Select>
              {errors.genderId && <FormHelperText error>{errors.genderId}</FormHelperText>}
            </div>
          </Box>

          <Box>
            <div>
              <InputLabel htmlFor='dob' sx={{color: 'black', marginBottom: '5px'}}>Date of Birth <span style={{color: 'red'}}>*</span></InputLabel>
              <OutlinedInput
                id="dob"
                name="dob"
                type="date"
                error={!!errors.dob}
                inputProps={{ max: joinDateVal || todayStr }}
                fullWidth
              />
              {errors.dob && <FormHelperText error>{errors.dob}</FormHelperText>}
            </div>
            <div>
              <InputLabel htmlFor='joinDate' sx={{color: 'black', marginBottom: '5px'}}>Date of Join</InputLabel>
              <OutlinedInput
                id="joinDate"
                name="joinDate"
                type="date"
                // placeholder="Date of Join"
                onChange={(e) => setJoinDateVal(e.target.value)}
                error={!!errors.joinDate}
                inputProps={{ min: todayStr }}
                fullWidth
                />
              {errors.joinDate && <FormHelperText error>{errors.joinDate}</FormHelperText>}
            </div>
          </Box>
          <Box>
            <div>
              <InputLabel htmlFor='nid' sx={{display: 'block !important', color: 'black', marginBottom: '5px'}}>NID <span style={{color: 'red'}}>*</span></InputLabel>
              <OutlinedInput error={!!errors.nid} id='nid' name='nid' fullWidth placeholder="NID" />
              {errors.nid && <FormHelperText error>{errors.nid}</FormHelperText>}
            </div> 
            <div></div>
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
        <Button variant="contained" form="addEmployeeForm" type="submit" disabled={isPending} sx={{ textTransform: 'none' }}>
          {isPending ? 'Creating...' : 'Create Employee'}
        </Button>
      </Box>
    </Box>
  );
}