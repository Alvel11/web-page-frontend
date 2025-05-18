import React, { useState, useEffect } from 'react';
import {
  Grid,
  Typography,
  TextField,
  Button,
  List,
  ListItem,
  Paper,
  IconButton,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import axios from 'axios';

const GestionDeTiendas = () => {
  const [nombre, setNombre] = useState('');
  const [ubicacion, setUbicacion] = useState('');
  const [tiendas, setTiendas] = useState([]);
  const [editOpen, setEditOpen] = useState(false);
  const [editNombre, setEditNombre] = useState('');
  const [editUbicacion, setEditUbicacion] = useState('');
  const [editId, setEditId] = useState(null);

  const fetchTiendas = async () => {
    try {
      const response = await axios.get('http://localhost:8081/tiendas');
      setTiendas(response.data);
    } catch (error) {
      console.error('Fehler beim Laden der Tiendas:', error);
    }
  };

  const handleSubmit = async () => {
    try {
      await axios.post('http://localhost:8081/tienda', {
        nombre: nombre,
        ubicacion: ubicacion,
      });
      setNombre('');
      setUbicacion('');
      fetchTiendas();
    } catch (error) {
      console.error('Fehler beim Erstellen der Tienda:', error);
    }
  };

  const handleDelete = async (idTienda) => {
    try {
      await axios.delete(`http://localhost:8081/tienda/${idTienda}`);
      fetchTiendas();
    } catch (error) {
      console.error('Fehler beim Löschen der Tienda:', error);
    }
  };

const handleEdit = (tienda) => {
  setEditNombre(tienda.nombre || '');
  setEditUbicacion(tienda.ubicacion || '');
  setEditId(tienda.idTienda)
  setEditOpen(true);
};

const handleUpdate = async () => {
  try {
    await axios.patch(`http://localhost:8081/tienda/${editId}`, {
      nombre: editNombre || null,
      ubicacion: editUbicacion || null
    });
    setEditOpen(false);
    fetchTiendas();
  } catch (error) {
    console.error('Fehler beim Aktualisieren der Tienda:', error);
  }
};

  useEffect(() => {
    fetchTiendas();
  }, []);

  return (
    <Box sx={{ display: 'flex' }}>
      {/* Platzhalter für Seitenmenü */}


      <Box sx={{ flexGrow: 1, padding: '20px' }}>
        <Grid container spacing={4} style={{ padding: '20px', marginLeft: '40px' }}>

          {/* Linke Seite – Formular */}
          <Grid item xs={12} md={5}>
            <Paper sx={{ padding: '20px' }}>
              <Typography variant="h6" gutterBottom>Crear Tienda</Typography>
              <TextField
                label="Nombre"
                fullWidth
                margin="normal"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
              />
              <TextField
                label="Ubicacion"
                fullWidth
                margin="normal"
                value={ubicacion}
                onChange={(e) => setUbicacion(e.target.value)}
              />
              <Button
                variant="contained"
                color="primary"
                onClick={handleSubmit}
                sx={{ mt: 2 }}
              >
                Crear
              </Button>
            </Paper>
          </Grid>

          {/* Rechte Seite – Editor */}
          <Grid item xs={12} md={7}>
            <Paper sx={{ padding: '20px' }}>
              <Typography variant="h6" gutterBottom>Editar Tienda</Typography>
              <List>
                {tiendas.map((tienda) => (
                  <ListItem
                    key={tienda.idTienda}
                    divider
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}
                  >
                    <Box>
                      <Typography variant="body1">{tienda.nombre}</Typography>
                      <Typography variant="body2" color="textSecondary">{tienda.ubicacion}</Typography>
                    </Box>
                    <Box display="flex" gap={1}>
                      <IconButton onClick={() => handleEdit(tienda)}>
                        <EditIcon />
                      </IconButton>
                      <IconButton onClick={() => handleDelete(tienda.idTienda)}>
                        <DeleteIcon />
                      </IconButton>
                    </Box>
                  </ListItem>
                ))}
              </List>
            </Paper>
          </Grid>
        </Grid>
            <Dialog open={editOpen} onClose={() => setEditOpen(false)}>
              <DialogTitle>Editar Tienda</DialogTitle>
              <DialogContent>
                <TextField
                  label="Nombre"
                  fullWidth
                  margin="normal"
                  value={editNombre}
                  onChange={(e) => setEditNombre(e.target.value)}
                />
                <TextField
                  label="Ubicación"
                  fullWidth
                  margin="normal"
                  value={editUbicacion}
                  onChange={(e) => setEditUbicacion(e.target.value)}
                />
              </DialogContent>
              <DialogActions>
                <Button onClick={() => setEditOpen(false)}>Cancelar</Button>
                <Button onClick={handleUpdate} variant="contained">Guardar</Button>
              </DialogActions>
            </Dialog>
      </Box>
    </Box>
  );
};

export default GestionDeTiendas;
