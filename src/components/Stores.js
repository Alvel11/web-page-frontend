// src/components/Stores.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Fab, Card, CardContent, Button, Typography, Grid } from '@mui/material';
import UploadIcon from '@mui/icons-material/Upload';
import FileUpload from './FileUpload';
import { useNavigate } from 'react-router-dom';


const Stores = () => {
  const [stores, setStores] = useState([]);
  const navigate = useNavigate();

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
          Tiendas
        </Typography>
        {stores.length === 0 ? (
          <Typography variant="body1">No hay tiendas disponibles.</Typography>
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
                      Detalles
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}

        <Button
          variant="outlined"
          color="secondary"
          onClick={() => navigate('/gestion-tiendas')}
          style={{
            position: 'absolute',
            top: '20px',
            right: '20px',
            zIndex: 1000
          }}
        >
          Gestion de Tiendas
        </Button>
      </div>

    );
};

export default Stores;
