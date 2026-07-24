import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import UploadPhoto from '../components/UploadPhoto';
import { Select, MenuItem, Button, InputLabel, OutlinedInput, FormHelperText } from '@mui/material';
import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { createFood, queryClient } from '../util/http';

function fileToBase64(file: File): Promise<string> {
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

export default function AddFoodForm({ onClose }: { onClose: () => void }) {
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const [price, setPrice] = useState<number | ''>('');
  const [discountType, setDiscountType] = useState<string>('None');
  const [discount, setDiscount] = useState<number | ''>(0);

  const { mutate, isPending } = useMutation({
    mutationFn: createFood,
    onSuccess: () => {
      onClose();
      queryClient.invalidateQueries({ queryKey: ['foods'] });
    }
  });

  function getDiscountLabel() {
    if (discountType === 'Flat') return 'Discount In (৳)';
    if (discountType === 'Percentage') return 'Discount In (%)';
    return 'Discount In';
  }

  function calculateDiscountedPrice(): number {
    const numPrice = Number(price) || 0;
    const numDiscount = Number(discount) || 0;

    if (numPrice === 0) return 0;
    if (discountType === 'None') return numPrice;

    let finalPrice = numPrice;
    if (discountType === 'Flat') {
      finalPrice = numPrice - numDiscount;
    } else if (discountType === 'Percentage') {
      finalPrice = numPrice - (numPrice * (numDiscount / 100));
    }

    return finalPrice;
  }

  const discountedPrice = calculateDiscountedPrice();

  function handleDiscountChange(e: React.ChangeEvent<HTMLInputElement>) {
    const rawVal = e.target.value;
    if (rawVal === '') {
      setDiscount('');
      return;
    }

    let numVal = e.target.valueAsNumber;
    if (isNaN(numVal)) numVal = 0;

    const numPrice = Number(price) || 0;

    if (discountType === 'Flat' && numVal > numPrice) {
      numVal = numPrice;
    } else if (discountType === 'Percentage' && numVal > 100) {
      numVal = 100;
    }

    setDiscount(numVal);
  }

  async function handleFoodForm(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const newErrors: { [key: string]: string } = {};

    const name = (formData.get('name') as string || '').trim();
    const description = (formData.get('description') as string || '').trim();
    const numPrice = Number(price) || 0;

    if (!name) {
      newErrors.name = 'Please fill out this field.';
    }

    if (!description) {
      newErrors.description = 'Please fill out this field.';
    }

    if (numPrice === 0) {
      newErrors.price = 'Please fill out this field.';
    }

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    const imageFile = formData.get('image') as File;
    const base64String = imageFile ? await fileToBase64(imageFile) : "";

    const body: Record<string, unknown> = {
      name,
      description,
      price: numPrice,
      discountType,
      discount: discountType === 'None' ? 0 : (Number(discount) || 0),
      image: imageFile && imageFile.size > 0 ? imageFile.name : "",
      base64: base64String,
    };

    mutate({ body });
  }

  return (
    <Box
      component="form"
      id="addFoodForm"
      onSubmit={handleFoodForm}
      sx={{ display: 'flex', flexDirection: 'column', height: '100%', maxHeight: '90vh', overflow: 'hidden' }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "8px 5px 8px 15px",
          borderBottom: '1px solid rgba(0, 0, 0, 0.5)',
        }}
      >
        <Typography variant="h6">New Food Item</Typography>
        <IconButton onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </Box>

      <Box
        sx={{
          flex: 1,
          overflowY: 'auto',
          display: 'flex',
          justify: 'space-between',
          alignItems: 'start',
          padding: '1.5rem',
        }}
      >
        <UploadPhoto />

        <Box
          sx={{
            border: '1px solid rgba(0, 0, 0, 0.2)',
            width: '68%',
            p: 2.5,
            height: 'fit-content',
            "& > *": { display: 'flex', justifyContent: 'space-between', gap: '30px', mb: 3.5 },
            "& > *:last-child": { mb: 0 },
            "& > * > *": { width: '100%' }
          }}
        >
          <Box>
            <div>
              <InputLabel htmlFor='name' sx={{ color: 'black', marginBottom: '5px' }}>Food Name <span style={{ color: 'red' }}>*</span></InputLabel>
              <OutlinedInput error={!!errors.name} id='name' name='name' fullWidth placeholder='Food Name' />
              {errors.name && <FormHelperText error>{errors.name}</FormHelperText>}
            </div>
            <div>
              <InputLabel htmlFor='description' sx={{ color: 'black', marginBottom: '5px' }}>Description <span style={{ color: 'red' }}>*</span></InputLabel>
              <OutlinedInput error={!!errors.description} id='description' name='description' fullWidth placeholder='Description' />
              {errors.description && <FormHelperText error>{errors.description}</FormHelperText>}
            </div>
          </Box>

          <Box>
            <div>
              <InputLabel htmlFor='price' sx={{ color: 'black', marginBottom: '5px' }}>Price <span style={{ color: 'red' }}>*</span></InputLabel>
              <OutlinedInput
                fullWidth
                id='price'
                name='price'
                placeholder='0'
                type="number"
                value={price}
                onChange={(e) => {
                  const raw = e.target.value;
                  if (raw === '') {
                    setPrice('');
                    return;
                  }
                  const val = (e.target as HTMLInputElement).valueAsNumber || 0;
                  setPrice(val);

                  const numDiscount = Number(discount) || 0;
                  if (discountType === 'Flat' && numDiscount > val) {
                    setDiscount(val);
                  }
                }}
                error={!!errors.price}
                inputProps={{ min: 0, step: 'any', inputMode: 'decimal' }}
                onKeyDown={(e) => {
                  if (['e', 'E', '+', '-'].includes(e.key)) {
                    e.preventDefault();
                  }
                }}
                sx={{
                  '& input[type=number]::-webkit-outer-spin-button, & input[type=number]::-webkit-inner-spin-button': { WebkitAppearance: 'none', margin: 0 },
                  '& input[type=number]': { MozAppearance: 'textfield' }
                }}
              />
              {errors.price && <FormHelperText error>{errors.price}</FormHelperText>}
            </div>

            <div>
              <InputLabel htmlFor='discountType' sx={{ color: 'black', marginBottom: '5px' }}>Discount Type</InputLabel>
              <Select
                id="discountType"
                name="discountType"
                value={discountType}
                onChange={(e) => {
                  setDiscountType(e.target.value);
                  setDiscount(0);
                }}
                fullWidth
              >
                <MenuItem value="None">None</MenuItem>
                <MenuItem value="Flat">Flat</MenuItem>
                <MenuItem value="Percentage">Percentage</MenuItem>
              </Select>
            </div>
          </Box>

          <Box>
            <div>
              <InputLabel htmlFor='discount' sx={{ color: discountType === 'None' ? 'gray' : 'black', marginBottom: '5px' }}>
                {getDiscountLabel()}
              </InputLabel>
              <OutlinedInput
                id='discount'
                name='discount'
                fullWidth
                placeholder='0'
                type="number"
                value={discountType === 'None' ? 0 : discount}
                onChange={handleDiscountChange}
                disabled={discountType === 'None'}
                inputProps={{
                  min: 0,
                  max: discountType === 'Flat' ? (Number(price) || 0) : 100,
                  step: 'any',
                  inputMode: 'decimal',
                }}
                onKeyDown={(e) => {
                  if (['e', 'E', '+', '-'].includes(e.key)) {
                    e.preventDefault();
                  }
                }}
                sx={{
                  '& input[type=number]::-webkit-outer-spin-button, & input[type=number]::-webkit-inner-spin-button': { WebkitAppearance: 'none', margin: 0 },
                  '& input[type=number]': { MozAppearance: 'textfield' }
                }}
              />
            </div>

            <div>
              <InputLabel htmlFor='discountedPrice' sx={{ color: discountType === 'None' ? 'gray' : 'black', marginBottom: '5px' }}>
                Discounted Price
              </InputLabel>
              <OutlinedInput
                id='discountedPrice'
                fullWidth
                readOnly
                disabled={discountType === 'None'}
                value={discountedPrice}
                placeholder="0"
              />
            </div>
          </Box>
        </Box>
      </Box>

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
        <Button
          variant="contained"
          type="submit"
          disabled={isPending}
          sx={{ textTransform: 'none' }}
        >
          {isPending ? 'Creating...' : 'Create Food'}
        </Button>
      </Box>
    </Box>
  );
}