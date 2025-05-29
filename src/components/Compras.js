import React, { useEffect, useState } from 'react';
import {
  Box, Grid, Typography, FormControl, InputLabel, Select, MenuItem,
  CircularProgress, Paper, Table, TableHead, TableRow, TableCell,
  TableBody, TextField, TableContainer
} from '@mui/material';
import axios from 'axios';
import FileUpload from './FileUpload';

const Compras = () => {
  const [stores, setStores] = useState([]);
  const [selectedStore, setSelectedStore] = useState('');
  const [loadingStores, setLoadingStores] = useState(true);
  const [batch, setBatch] = useState([]);
  const [compras, setCompras] = useState([]);

  const [batchFilter, setBatchFilter] = useState({
    nombre: '', color: '', calidad: '', categoria: ''
  });
  const [comprasFilter, setComprasFilter] = useState({
    idCompra: '', articulo: '', tienda: ''
  });

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

  const filteredBatch = batch.filter(item =>
    item.nombre?.toLowerCase().includes(batchFilter.nombre.toLowerCase()) &&
    item.color?.toLowerCase().includes(batchFilter.color.toLowerCase()) &&
    item.calidad?.toLowerCase().includes(batchFilter.calidad.toLowerCase()) &&
    item.categoria?.toLowerCase().includes(batchFilter.categoria.toLowerCase())
  );

  const filteredCompras = compras.filter(item =>
    item.idCompra.toString().includes(comprasFilter.idCompra) &&
    item.articulo?.toLowerCase().includes(comprasFilter.articulo.toLowerCase()) &&
    item.tienda?.toLowerCase().includes(comprasFilter.tienda.toLowerCase())
  );

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
              onUploadSuccess={fetchUploaded}
            />
          )}

          <Box sx={{ mt: 4 }}>
            <Typography variant="h5" gutterBottom>Carga de excel más reciente</Typography>
            <Paper>
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>
                        <TextField
                          variant="standard"
                          label="Nombre"
                          value={batchFilter.nombre}
                          onChange={(e) => setBatchFilter({ ...batchFilter, nombre: e.target.value })}
                        />
                      </TableCell>
                      <TableCell>
                        <TextField
                          variant="standard"
                          label="Color"
                          value={batchFilter.color}
                          onChange={(e) => setBatchFilter({ ...batchFilter, color: e.target.value })}
                        />
                      </TableCell>
                      <TableCell>
                        <TextField
                          variant="standard"
                          label="Calidad"
                          value={batchFilter.calidad}
                          onChange={(e) => setBatchFilter({ ...batchFilter, calidad: e.target.value })}
                        />
                      </TableCell>
                      <TableCell>
                        <TextField
                          variant="standard"
                          label="Categoría"
                          value={batchFilter.categoria}
                          onChange={(e) => setBatchFilter({ ...batchFilter, categoria: e.target.value })}
                        />
                      </TableCell>
                      <TableCell align="right">Precio</TableCell>
                      <TableCell align="right">Cantidad</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filteredBatch.map((row, idx) => (
                      <TableRow key={idx}>
                        <TableCell>{row.nombre}</TableCell>
                        <TableCell>{row.color}</TableCell>
                        <TableCell>{row.calidad}</TableCell>
                        <TableCell>{row.categoria}</TableCell>
                        <TableCell align="right">{row.precio}</TableCell>
                        <TableCell align="right">{row.cantidad}</TableCell>
                      </TableRow>
                    ))}
                    {filteredBatch.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={6} align="center">
                          Keine Datensätze gefunden.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
          </Box>
        </Grid>

        {/* Rechte Seite */}
        <Grid item xs={12} md={8}>
          <Typography variant="h6" gutterBottom>Historial de Compras</Typography>
          <Paper>
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>
                      <TextField
                        variant="standard"
                        label="Id"
                        value={comprasFilter.idCompra}
                        onChange={(e) => setComprasFilter({ ...comprasFilter, idCompra: e.target.value })}
                      />
                    </TableCell>
                    <TableCell>
                      <TextField
                        variant="standard"
                        label="Articulo"
                        value={comprasFilter.articulo}
                        onChange={(e) => setComprasFilter({ ...comprasFilter, articulo: e.target.value })}
                      />
                    </TableCell>
                    <TableCell>
                      <TextField
                        variant="standard"
                        label="Tienda"
                        value={comprasFilter.tienda}
                        onChange={(e) => setComprasFilter({ ...comprasFilter, tienda: e.target.value })}
                      />
                    </TableCell>
                    <TableCell>Cantidad</TableCell>
                    <TableCell align="right">Precio</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredCompras.map((compra, index) => (
                    <TableRow key={index}>
                      <TableCell>{compra.idCompra}</TableCell>
                      <TableCell>{compra.articulo}</TableCell>
                      <TableCell>{compra.tienda}</TableCell>
                      <TableCell>{compra.cantidad}</TableCell>
                      <TableCell align="right">{compra.precio}</TableCell>
                    </TableRow>
                  ))}
                  {filteredCompras.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={5} align="center">
                        Keine Käufe gefunden.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Compras;
