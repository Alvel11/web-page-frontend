// src/components/Compras.js
import React, { useEffect, useState } from 'react';
import {
  Box,
  Grid,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
} from '@mui/material';
import axios from 'axios';
import FileUpload from './FileUpload';

const Compras = () => {
  const [stores, setStores] = useState([]);
  const [selectedStore, setSelectedStore] = useState('');
  const [loadingStores, setLoadingStores] = useState(true);
  const [batch, setBatch] = useState([]);
  const [compras, setCompras] = useState([]);

  // Tiendas laden
  useEffect(() => {
    const fetchStores = async () => {
      try {
        const res = await axios.get('http://localhost:8081/tiendas');
        setStores(res.data);
      } catch (err) {
        console.error('Fehler beim Laden der Tiendas:', err);
      } finally {
        setLoadingStores(false);
      }
    };
    fetchStores();
  }, []);

  // Excel-Daten und Historie beim Start laden
  useEffect(() => {
    fetchUploaded();
    fetchCompras();
  }, []);

  const fetchUploaded = async () => {
    try {
      const res = await axios.get('http://localhost:8081/compra/latestBatch');
      setBatch(res.data);
    } catch (err) {
      console.error('Fehler beim Laden der Upload-Liste:', err);
    }
  };

  const fetchCompras = async () => {
    try {
      const res = await axios.get('http://localhost:8081/compra/history');
      setCompras(res.data);
    } catch (err) {
      console.error('Fehler beim Laden der Historie:', err);
    }
  };

  const handleStoreChange = (e) => {
    const id = e.target.value;
    setSelectedStore(id);
    fetchUploaded();
    fetchCompras();
  };

  return (
    <Box sx={{ ml: '220px', p: 4 }}>
      <Typography variant="h4" gutterBottom>Compras</Typography>
      <Grid container spacing={4}>
        {/* Linke Seite */}
        <Grid item xs={12} md={4}>
          <FormControl fullWidth sx={{ mb: 2, minWidth: 240 }}>
            <InputLabel id="store-select-label">Elegir tienda</InputLabel>
            {loadingStores ? (
              <CircularProgress size={24} />
            ) : (
              <Select
                labelId="store-select-label"
                value={selectedStore}
                label="Elegir Tienda"
                onChange={handleStoreChange}
                displayEmpty
                renderValue={selectedStore !== '' ? undefined : () => ''}
                sx={{ minWidth: 240 }}
              >
                <MenuItem value="">
                  <em>Elegir tienda</em>
                </MenuItem>
                {stores.map((store) => (
                  <MenuItem key={store.idTienda} value={store.idTienda}>
                    {store.nombre}
                  </MenuItem>
                ))}
              </Select>
            )}
          </FormControl>

          {selectedStore && (
            <FileUpload
              uploadUrl={`http://localhost:8081/upload/compra/${selectedStore}`}
              onUploadSuccess={() => fetchUploaded()}
            />
          )}

          <Box sx={{ mt: 4 }}>
            <Typography variant="h5" gutterBottom>Carga de excel más reciente</Typography>
            <Paper>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Nombre</TableCell>
                    <TableCell>Color</TableCell>
                    <TableCell>Calidad</TableCell>
                    <TableCell>Categoría</TableCell>
                    <TableCell align="right">Precio</TableCell>
                    <TableCell align="right">Cantidad</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {batch.map((row, idx) => (
                    <TableRow key={idx}>
                      <TableCell>{row.nombre}</TableCell>
                      <TableCell>{row.color}</TableCell>
                      <TableCell>{row.calidad}</TableCell>
                      <TableCell>{row.categoria}</TableCell>
                      <TableCell align="right">{row.precio}</TableCell>
                      <TableCell align="right">{row.cantidad}</TableCell>
                    </TableRow>
                  ))}
                  {batch.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={6} align="center">
                        Keine Datensätze gefunden.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </Paper>
          </Box>
        </Grid>

        {/* Rechte Seite */}
        <Grid item xs={12} md={8}>
          <Typography variant="h6" gutterBottom>Historial de Compras</Typography>
          <Paper>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Id</TableCell>
                  <TableCell>Articulo</TableCell>
                  <TableCell>Tienda</TableCell>
                  <TableCell>Cantidad</TableCell>
                  <TableCell align="right">Precio</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {compras.map((compra, index) => (
                  <TableRow key={index}>
                    <TableCell>{compra.idCompra}</TableCell>
                    <TableCell>{compra.articulo}</TableCell>
                    <TableCell>{compra.tienda}</TableCell>
                    <TableCell>{compra.cantidad}</TableCell>
                    <TableCell align="right">{compra.precio}</TableCell>
                  </TableRow>
                ))}
                {compras.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} align="center">Keine Käufe gefunden.</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Compras;
