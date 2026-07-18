import {Typography } from '@mui/material'

interface ErrorMsgProps {
  message: string;
}

export default function ErrorMsg({ message }: ErrorMsgProps) {
  return (
    <Typography
      color="error"
      sx={{ fontSize: 18, fontWeight: "bold" }}
    >
      {message}
    </Typography>
  );
}