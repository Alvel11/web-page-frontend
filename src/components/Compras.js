// src/components/Compras.js
import React, { useEffect, useState } from 'react';
import { Card, CardContent, Typography, Table, TableBody, TableCell, TableHead, TableRow, Grid } from '@mui/material';

const Compras = () => {
  const [compras, setCompras] = useState([]);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    fetch('/metric/ventas-recientes')
      .then(res => res.json())
      .then(data => {
        setCompras(data);
        const totalSum = data.reduce((acc, compra) => acc + compra.precio, 0);
        setTotal(totalSum);
      });
  }, []);

  return (
    <div style={{ marginLeft: '220px', padding: '20px' }}>
      <Typography variant="h4" gutterBottom>
        Historial de Compras
      </Typography>

      <Card style={{ marginBottom: '20px' }}>
        <CardContent>
          <Typography variant="subtitle2">Total de Compras</Typography>
          <Typography variant="h6">${total.toFixed(2)}</Typography>
        </CardContent>
      </Card>

      <Table>
        <TableHead>
          <TableRow>
            <TableCell>ID</TableCell>
            <TableCell>Fecha</TableCell>
            <TableCell>precio</TableCell>
            <TableCell>ID Cliente</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {compras.map(compra => (
            <TableRow key={compra.id}>
              <TableCell>{compra.idCompra}</TableCell>
              <TableCell>{new Date(compra.fecha).toLocaleDateString()}</TableCell>
              <TableCell>${compra.precio.toFixed(2)}</TableCell>
              <TableCell>{compra.idCliente}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default Compras;
