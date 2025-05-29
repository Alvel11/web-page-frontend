import React, { useEffect, useState, useCallback } from 'react';
import {
  Table, TableHead, TableRow, TableCell, TableBody,
  Paper, Typography, Button, Box, TextField, TableContainer
} from '@mui/material';

const HistorialCreditoTable = ({ tiendaId }) => {
  const [creditos, setCreditos] = useState([]);
  const [filters, setFilters] = useState({
    idCredito: '',
    nombre: '',
    categoria: '',
    calidad: '',
    color: '',
    status: '',
  });

  const fetchCreditos = useCallback(() => {
    fetch(`http://localhost:8081/credito/${tiendaId}`)
      .then(res => res.json())
      .then(setCreditos)
      .catch(err => console.error('Error al cargar historial de crédito:', err));
  }, [tiendaId]);

  useEffect(() => {
    fetchCreditos();
  }, [fetchCreditos]);

  const handleFilterChange = (field, value) => {
    setFilters(prev => ({ ...prev, [field]: value.toLowerCase() }));
  };

  const handleAccion = async (idCredito, tipo) => {
    const endpoint = tipo === 'pagar'
      ? `http://localhost:8081/credito/pagar/${idCredito}`
      : `http://localhost:8081/credito/cancelar/${idCredito}`;

    try {
      const res = await fetch(endpoint, { method: 'PATCH' });

      if (res.ok) {
        alert(`Crédito ${tipo === 'pagar' ? 'pagado' : 'cancelado'} exitosamente`);
        fetchCreditos();
      } else {
        alert('Error en la operación');
      }
    } catch (err) {
      console.error('Error en acción de crédito:', err);
      alert('Fallo en la conexión');
    }
  };

  const filteredCreditos = creditos.filter(c =>
    c.idCredito.toString().includes(filters.idCredito) &&
    c.nombre.toLowerCase().includes(filters.nombre) &&
    c.categoria.toLowerCase().includes(filters.categoria) &&
    c.calidad.toLowerCase().includes(filters.calidad) &&
    c.color.toLowerCase().includes(filters.color) &&
    c.status.toLowerCase().includes(filters.status)
  );

  return (
    <Paper sx={{ mt: 2 }}>
      <Typography variant="h6" sx={{ p: 2 }}>Historial de Crédito</Typography>
      <TableContainer>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>
                <TextField
                  label="ID Crédito"
                  variant="standard"
                  value={filters.idCredito}
                  onChange={(e) => handleFilterChange('idCredito', e.target.value)}
                />
              </TableCell>
              <TableCell>
                <TextField
                  label="Nombre"
                  variant="standard"
                  value={filters.nombre}
                  onChange={(e) => handleFilterChange('nombre', e.target.value)}
                />
              </TableCell>
              <TableCell>
                <TextField
                  label="Categoría"
                  variant="standard"
                  value={filters.categoria}
                  onChange={(e) => handleFilterChange('categoria', e.target.value)}
                />
              </TableCell>
              <TableCell>
                <TextField
                  label="Calidad"
                  variant="standard"
                  value={filters.calidad}
                  onChange={(e) => handleFilterChange('calidad', e.target.value)}
                />
              </TableCell>
              <TableCell>
                <TextField
                  label="Color"
                  variant="standard"
                  value={filters.color}
                  onChange={(e) => handleFilterChange('color', e.target.value)}
                />
              </TableCell>
              <TableCell align="right">Precio</TableCell>
              <TableCell align="right">Cantidad</TableCell>
              <TableCell>
                <TextField
                  label="Status"
                  variant="standard"
                  value={filters.status}
                  onChange={(e) => handleFilterChange('status', e.target.value)}
                />
              </TableCell>
              <TableCell>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredCreditos.map((credito) => (
              <TableRow key={credito.idCredito}>
                <TableCell>{credito.idCredito}</TableCell>
                <TableCell>{credito.nombre}</TableCell>
                <TableCell>{credito.categoria}</TableCell>
                <TableCell>{credito.calidad}</TableCell>
                <TableCell>{credito.color}</TableCell>
                <TableCell align="right">{credito.precio}</TableCell>
                <TableCell align="right">{credito.cantidad}</TableCell>
                <TableCell>{credito.status}</TableCell>
                <TableCell>
                  {credito.status === 'pendiente' && (
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <Button
                        variant="contained"
                        color="success"
                        size="small"
                        onClick={() => handleAccion(credito.idCredito, 'pagar')}
                      >
                        Pagar
                      </Button>
                      <Button
                        variant="contained"
                        color="error"
                        size="small"
                        onClick={() => handleAccion(credito.idCredito, 'cancelar')}
                      >
                        Cancelar
                      </Button>
                    </Box>
                  )}
                </TableCell>
              </TableRow>
            ))}
            {filteredCreditos.length === 0 && (
              <TableRow>
                <TableCell colSpan={9} align="center">
                  No se encontraron créditos.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
};

export default HistorialCreditoTable;
