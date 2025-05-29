import React, { useEffect, useState } from 'react';
import {
  Table, TableHead, TableRow, TableCell,
  TableBody, Paper, IconButton, Typography, TextField, TableContainer
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';

const ArticuloTableWithAddButton = ({ tiendaId, onAdd, refreshTrigger }) => {
  const [articulos, setArticulos] = useState([]);
  const [filters, setFilters] = useState({
    nombre: '',
    categoria: '',
    calidad: '',
    color: '',
  });

  useEffect(() => {
    if (!tiendaId) {
      setArticulos([]);
      return;
    }

    fetch(`http://localhost:8081/inventario/${tiendaId}`)
      .then(res => res.json())
      .then(data => setArticulos(data))
      .catch(err => console.error('Error al cargar articulo:', err));
  }, [tiendaId, refreshTrigger]);

  const handleFilterChange = (field, value) => {
    setFilters(prev => ({ ...prev, [field]: value.toLowerCase() }));
  };

  const handlePrecioChange = (index, value) => {
    setArticulos(prev => {
      const updated = [...prev];
      updated[index].precio = value;
      return updated;
    });
  };

  const handlePrecioBlur = async (index, articulo) => {
    try {
      await fetch(`http://localhost:8081/inventario/${tiendaId}/precio/${articulo.idArticulo}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ precio: articulo.precio }),
      });
    } catch (err) {
      console.error('Error al actualizar el precio:', err);
    }
  };

  const filteredArticulos = articulos.filter(art =>
    art.nombre.toLowerCase().includes(filters.nombre) &&
    art.categoria.toLowerCase().includes(filters.categoria) &&
    art.calidad.toLowerCase().includes(filters.calidad) &&
    art.color.toLowerCase().includes(filters.color)
  );

  if (!tiendaId) {
    return <Typography>Elige una tienda primero.</Typography>;
  }

  return (
    <Paper sx={{ mt: 2 }}>
      <Typography variant="h6" sx={{ p: 2 }}>Artículos en la tienda</Typography>
      <TableContainer>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>
                <TextField
                  label="Nombre"
                  variant="standard"
                  value={filters.nombre}
                  onChange={e => handleFilterChange('nombre', e.target.value)}
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
              <TableCell align="right">Precio</TableCell>
              <TableCell align="right">Cantidad</TableCell>
              <TableCell align="center">Aktion</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredArticulos.map((articulo, index) => (
              <TableRow key={index}>
                <TableCell>{articulo.nombre}</TableCell>
                <TableCell>{articulo.categoria}</TableCell>
                <TableCell>{articulo.calidad}</TableCell>
                <TableCell>{articulo.color}</TableCell>
                <TableCell align="right">
                  <TextField
                    value={articulo.precio}
                    onChange={e => handlePrecioChange(index, e.target.value)}
                    onBlur={() => handlePrecioBlur(index, articulo)}
                    variant="standard"
                    type="number"
                    inputProps={{ min: 0 }}
                    sx={{ maxWidth: 80 }}
                  />
                </TableCell>
                <TableCell align="right">{articulo.cantidad}</TableCell>
                <TableCell align="center">
                  <IconButton onClick={() => onAdd(articulo)}>
                    <AddIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
            {filteredArticulos.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  No se encontró ningún artículo.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
};

export default ArticuloTableWithAddButton;
