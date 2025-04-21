import React, { useState } from 'react';
import axios from 'axios';
import { Fab } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

const FileUpload = ({ uploadUrl }) => {
    const [file, setFile] = useState(null);

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
        <div>
            <input
                type="file"
                accept=".xlsx, .xls"
                id="upload-file"
                style={{ display: 'none' }}
                onChange={handleFileChange}
            />
            <label htmlFor="upload-file">
                <Fab
                    color="primary"
                    aria-label="upload"
                    component="span"
                    style={{ position: 'absolute', bottom: '20px', right: '20px' }}
                >
                    <CloudUploadIcon />
                </Fab>
            </label>
        </div>
    );
};

export default FileUpload;
