import React, { useState } from 'react';
import axios from 'axios';
import { Fab, Button, Typography, Paper } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

const FileUpload = ({ uploadUrl }) => {
    const [file, setFile] = useState(null);
    const [error, setError] = useState(null);

    const handleFileChange = (event) => {
        const selectedFile = event.target.files[0];
        if (selectedFile) {
            setFile(selectedFile);
            handleUpload(selectedFile); // Automatischer Upload nach Auswahl
        }
    };

    const handleUpload = async (fileToUpload) => {
        const formData = new FormData();
        formData.append('file', fileToUpload);
        try {
            const response = await axios.post(uploadUrl, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            console.log('Upload erfolgreich:', response.data);
        } catch (error) {
            console.error('Fehler beim Hochladen:', error);
        }
    };

  return (
    <Paper sx={{ p: 2, mb: 2 }}>
      <Typography variant="h6" gutterBottom>Leer Excel</Typography>
      <input
        type="file"
        accept=".xlsx, .xls"
        onChange={handleFileChange}
        style={{ marginTop: 8 }}
      />
      {error && <Typography color="error">{error}</Typography>}
    </Paper>
    );
};

export default FileUpload;
