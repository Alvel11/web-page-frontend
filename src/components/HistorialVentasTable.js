import React, { useEffect, useState } from 'react';
import {
  Table, TableHead, TableRow, TableCell,
  TableBody, Paper, Typography, TextField, TableContainer
} from '@mui/material';

const HistorialVentasTable = ({ tiendaId }) => {
  const [ventas, setVentas] = useState([]);
  const [filters, setFilters] = useState({
    idVenta: '',
    articulo: '',
    categoria: '',
    calidad: '',
    color: '',
  });

  useEffect(() => {
    fetch(`http://localhost:8081/venta/${tiendaId}`)
      .then(res => res.json())
      .then(setVentas)
      .catch(err => console.error('Error al cargar historial de ventas:', err));
  }, [tiendaId]);

  const handleFilterChange = (field, value) => {
    setFilters(prev => ({ ...prev, [field]: value.toLowerCase() }));
  };

  const filteredVentas = ventas.filter(v =>
    v.idVenta.toString().includes(filters.idVenta) &&
    v.articulo.toLowerCase().includes(filters.articulo) &&
    v.categoria.toLowerCase().includes(filters.categoria) &&
    v.calidad.toLowerCase().includes(filters.calidad) &&
    v.color.toLowerCase().includes(filters.color)
  );

  return (
    <Paper sx={{ mt: 2 }}>
      <Typography variant="h6" sx={{ p: 2 }}>Historial de Ventas</Typography>
      <TableContainer>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>
                <TextField
                  label="ID"
                  variant="standard"
                  value={filters.idVenta}
                  onChange={e => handleFilterChange('idVenta', e.target.value)}
                />
              </TableCell>
              <TableCell>
                <TextField
                  label="Artículo"
                  variant="standard"
                  value={filters.articulo}
                  onChange={e => handleFilterChange('articulo', e.target.value)}
                />
              </TableCell>
              <TableCell>
                <TextField
                  label="Categoría"
                  variant="standard"
                  value={filters.categoria}
                  onChange={e => handleFilterChange('categoria', e.target.value)}
                />
              </TableCell>
              <TableCell>
                <TextField
                  label="Calidad"
                  variant="standard"
                  value={filters.calidad}
                  onChange={e => handleFilterChange('calidad', e.target.value)}
                />
              </TableCell>
              <TableCell>
                <TextField
                  label="Color"
                  variant="standard"
                  value={filters.color}
                  onChange={e => handleFilterChange('color', e.target.value)}
                />
              </TableCell>
              <TableCell align="right">Cantidad</TableCell>
              <TableCell align="right">Precio</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredVentas.map((venta) => (
              <TableRow key={venta.idVenta}>
                <TableCell>{venta.idVenta}</TableCell>
                <TableCell>{venta.articulo}</TableCell>
                <TableCell>{venta.categoria}</TableCell>
                <TableCell>{venta.calidad}</TableCell>
                <TableCell>{venta.color}</TableCell>
                <TableCell align="right">{venta.cantidad}</TableCell>
                <TableCell align="right">{venta.precio}</TableCell>
              </TableRow>
            ))}
            {filteredVentas.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  No se encontraron ventas.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
};

export default HistorialVentasTable;
