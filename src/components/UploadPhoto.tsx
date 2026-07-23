import { Box, Button } from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import noProfileImg from '../assets/noPfp.png'
import { useState, useRef } from "react";

export default function UploadPhoto() {

  const [previewImage, setPreviewImage] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null);

  function handleImageChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    if (!file) return;
    if (previewImage) {
        URL.revokeObjectURL(previewImage);
    }
    setPreviewImage(URL.createObjectURL(file))
  }

  function handleRemoveImage() {
    if (previewImage) {
        URL.revokeObjectURL(previewImage);
    }
    setPreviewImage(null)
    if (fileInputRef.current) {
        fileInputRef.current.value = "";
    }
  }

  return (
    <Box
      sx={{
        width: '25%',
        // bgcolor: 'red',
        display: "flex",
        flexDirection: "column",
        // alignItems: "center",
        gap: 1,
      }}
    >
      <Box sx={{border: '1px solid rgba(0, 0, 0, 0.2)', aspectRatio: '1 / 1', overflow: 'hidden'}}>
        <img src={previewImage ?? noProfileImg} style={{display: 'block', width: '100%', height: '100%', objectFit: 'cover'}} />
      </Box>

      <Button
        variant="contained"
        component="label"
        startIcon={<CloudUploadIcon />}
        fullWidth
        sx={{
          textTransform: "none",
        }}
      >
        Upload Photo
        <input
          ref={fileInputRef}
          name="image"
          hidden
          type="file"
          accept="image/*"
          onChange={handleImageChange}
        />
      </Button>
      <Button
        color="error"
        variant="contained"
        onClick={handleRemoveImage}
        disabled={!previewImage}
        fullWidth
        sx={{
            textTransform: 'none'
        }}
        >
        Remove Photo
      </Button>
    </Box>
  );
}