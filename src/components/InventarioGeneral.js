import React, { useEffect, useState } from 'react';
import {
  Table, TableHead, TableRow, TableCell,
  TableBody, Paper, TextField, IconButton, Typography, TableContainer
} from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import EditIcon from '@mui/icons-material/Edit';

const InventarioGeneral = () => {
  const [inventario, setInventario] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editedPrecio, setEditedPrecio] = useState({});
  const [filters, setFilters] = useState({
    nombre: '',
    categoria: '',
    calidad: '',
    color: '',
    tienda: '',
  });

  useEffect(() => {
    fetch('http://localhost:8081/inventario')
      .then(res => res.json())
      .then(data => setInventario(data))
      .catch(err => console.error('Error al cargar inventario:', err));
  }, []);

  const handleEdit = (item) => {
    setEditingId(item.idInventarioTienda);
    setEditedPrecio({ ...editedPrecio, [item.idInventarioTienda]: item.precioVenta });
  };

  const handleSave = async (item) => {
    const nuevoPrecio = editedPrecio[item.idInventarioTienda];
    const id = item.idInventarioTienda;

    try {
      const res = await fetch(`http://localhost:8081/inventario/${id}/precio`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nuevoPrecio }),
      });

      if (res.ok) {
        const updated = inventario.map(i =>
          i.idInventarioTienda === id ? { ...i, precioVenta: nuevoPrecio } : i
        );
        setInventario(updated);
        setEditingId(null);
      } else {
        alert('Error al actualizar el precio');
      }
    } catch (error) {
      console.error('Error al actualizar:', error);
    }
  };

  const filteredInventario = inventario.filter(item =>
    item.nombre.toLowerCase().includes(filters.nombre.toLowerCase()) &&
    item.categoria.toLowerCase().includes(filters.categoria.toLowerCase()) &&
    item.calidad.toLowerCase().includes(filters.calidad.toLowerCase()) &&
    item.color.toLowerCase().includes(filters.color.toLowerCase()) &&
    item.tienda.toLowerCase().includes(filters.tienda.toLowerCase())
  );

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  return (
    <Paper sx={{ mt: 2, p: 2 }}>
      <Typography variant="h6" gutterBottom>Inventario General</Typography>
      <TableContainer>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>
                <TextField
                  size="small"
                  label="Nombre"
                  variant="standard"
                  value={filters.nombre}
                  onChange={(e) => handleFilterChange('nombre', e.target.value)}
                />
              </TableCell>
              <TableCell>
                <TextField
                  size="small"
                  label="Categoría"
                  variant="standard"
                  value={filters.categoria}
                  onChange={(e) => handleFilterChange('categoria', e.target.value)}
                />
              </TableCell>
              <TableCell>
                <TextField
                  size="small"
                  label="Calidad"
                  variant="standard"
                  value={filters.calidad}
                  onChange={(e) => handleFilterChange('calidad', e.target.value)}
                />
              </TableCell>
              <TableCell>
                <TextField
                  size="small"
                  label="Color"
                  variant="standard"
                  value={filters.color}
                  onChange={(e) => handleFilterChange('color', e.target.value)}
                />
              </TableCell>
              <TableCell>
                <TextField
                  size="small"
                  label="Tienda"
                  variant="standard"
                  value={filters.tienda}
                  onChange={(e) => handleFilterChange('tienda', e.target.value)}
                />
              </TableCell>
              <TableCell align="right">Cantidad</TableCell>
              <TableCell align="right">Precio</TableCell>
              <TableCell align="center">Acción</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredInventario.map((item) => (
              <TableRow key={item.idInventarioTienda}>
                <TableCell>{item.nombre}</TableCell>
                <TableCell>{item.categoria}</TableCell>
                <TableCell>{item.calidad}</TableCell>
                <TableCell>{item.color}</TableCell>
                <TableCell>{item.tienda}</TableCell>
                <TableCell align="right">{item.cantidad}</TableCell>
                <TableCell align="right">
                  {editingId === item.idInventarioTienda ? (
                    <TextField
                      size="small"
                      type="number"
                      value={editedPrecio[item.idInventarioTienda]}
                      onChange={(e) =>
                        setEditedPrecio({
                          ...editedPrecio,
                          [item.idInventarioTienda]: e.target.value,
                        })
                      }
                    />
                  ) : (
                    item.precioVenta
                  )}
                </TableCell>
                <TableCell align="center">
                  {editingId === item.idInventarioTienda ? (
                    <IconButton onClick={() => handleSave(item)}>
                      <SaveIcon />
                    </IconButton>
                  ) : (
                    <IconButton onClick={() => handleEdit(item)}>
                      <EditIcon />
                    </IconButton>
                  )}
                </TableCell>
              </TableRow>
            ))}
            {filteredInventario.length === 0 && (
              <TableRow>
                <TableCell colSpan={8} align="center">
                  No hay artículos que coincidan con el filtro.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
};

export default InventarioGeneral;
