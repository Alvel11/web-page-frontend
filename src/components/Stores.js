// src/components/Stores.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Fab, Card, CardContent, Button, Typography, Grid } from '@mui/material';
import UploadIcon from '@mui/icons-material/Upload';
import FileUpload from './FileUpload';

const Stores = () => {
  const [stores, setStores] = useState([]);

  useEffect(() => {
    const fetchStores = async () => {
      try {
        const response = await axios.get('http://localhost:8081/tiendas'); // Replace with your API endpoint
        console.log(response.data)
        setStores(response.data);
      } catch (error) {
        console.error('Error fetching test:', error);
      }
    };

    fetchStores();
  }, []);

  return (
      <div style={{ marginLeft: '220px', padding: '20px' }}>
        <Typography variant="h4" gutterBottom>
          Stores
        </Typography>
        {stores.length === 0 ? (
          <Typography variant="body1">No stores available.</Typography>
        ) : (
          <Grid container spacing={2}>
            {stores.map(store => (
              <Grid item xs={12} sm={6} md={4} key={store.idTienda}>
                <Card>
                  <CardContent>
                    <Typography variant="h6">{store.nombre}</Typography>
                    <Typography variant="body2" color="textSecondary">
                      {store.ubication}
                    </Typography>
                    <Button variant="contained" color="primary" style={{ marginTop: '10px' }}>
                      View Details
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
        <FileUpload uploadUrl="http://localhost:8081/upload/tienda" />
      </div>
    );
};

export default Stores;
