// src/components/ArticuloList.js
import React, { useEffect, useState } from 'react';
import {
  Table, TableHead, TableRow, TableCell, TableBody, Paper, IconButton, Typography
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';

const ArticuloList = ({ tiendaId, onAdd }) => {
  const [articulos, setArticulos] = useState([]);

  useEffect(() => {
    if (!tiendaId) return;

    const fetchArticulos = async () => {
      try {
        const res = await fetch(`http://localhost:8081/inventario/${tiendaId}`);
        const data = await res.json();
        setArticulos(data);
      } catch (err) {
        console.error('Fehler beim Laden der Artikel:', err);
      }
    };

    fetchArticulos();
  }, [tiendaId]);

  if (!tiendaId) {
    return <Typography>Bitte wähle zuerst eine Ursprungs-Tienda.</Typography>;
  }

  return (
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
            <TableCell></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {articulos.map((articulo) => (
            <TableRow key={articulo.idInventarioTienda}>
              <TableCell>{articulo.nombre}</TableCell>
              <TableCell>{articulo.color}</TableCell>
              <TableCell>{articulo.calidad}</TableCell>
              <TableCell>{articulo.categoria}</TableCell>
              <TableCell align="right">{articulo.precio}</TableCell>
              <TableCell align="right">{articulo.cantidad}</TableCell>
              <TableCell>
                <IconButton
                  onClick={() => onAdd(articulo)}
                  size="small"
                  color="primary"
                >
                  <AddIcon />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
          {articulos.length === 0 && (
            <TableRow>
              <TableCell colSpan={7} align="center">
                Keine Artikel gefunden.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </Paper>
  );
};

export default ArticuloList;
