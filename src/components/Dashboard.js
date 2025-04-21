import React, { useEffect, useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  CircularProgress,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
} from '@mui/material';

const Dashboard = () => {
  const [utilidadBruta, setUtilidadBruta] = useState(null);
  const [utilidadFinal, setUtilidadFinal] = useState(null);
  const [articuloMasVendido, setArticuloMasVendido] = useState(null);
  const [ventasRecientes, setVentasRecientes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [brutaRes, finalRes, articuloRes, ventasRes] = await Promise.all([
          fetch('http://localhost:8081/metric/utilidad-bruta'),
          fetch('http://localhost:8081/metric/utilidad-final'),
          fetch('http://localhost:8081/metric/articulo-mas-vendido'),
          fetch('http://localhost:8081/metric/ventas-recientes'),
        ]);

        const [bruta, final, articulo, ventas] = await Promise.all([
          brutaRes.json(),
          finalRes.json(),
          articuloRes.json(),
          ventasRes.json(),
        ]);

        setUtilidadBruta(bruta);
        setUtilidadFinal(final);
        setArticuloMasVendido(articulo);
        setVentasRecientes(ventas);
      } catch (error) {
        console.error('Fehler beim Laden der Metriken:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ marginLeft: '220px', padding: 4 }}>
      <Typography variant="h4" gutterBottom>
        Dashboard
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="subtitle2">Utilidad Bruta</Typography>
              <Typography variant="h6">${utilidadBruta.toFixed(2)}</Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="subtitle2">Utilidad Final</Typography>
              <Typography variant="h6">${utilidadFinal.toFixed(2)}</Typography>
            </CardContent>
          </Card>
        </Grid>

        {articuloMasVendido && (
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="subtitle2">Artículo más vendido</Typography>
                <Typography variant="body1">{articuloMasVendido.nombre}</Typography>
                <Typography variant="body2" color="text.secondary">
                  {articuloMasVendido.categoria} — {articuloMasVendido.calidad} — {articuloMasVendido.color}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        )}

        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="subtitle2" gutterBottom>
                Ventas recientes
              </Typography>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>ID</TableCell>
                    <TableCell>Fecha</TableCell>
                    <TableCell>Precio</TableCell>
                    <TableCell>ID Cliente</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {ventasRecientes.map((venta) => (
                    <TableRow key={venta.id}>
                      <TableCell>{venta.idCompra}</TableCell>
                      <TableCell>{new Date(venta.fecha).toLocaleDateString()}</TableCell>
                      <TableCell>${venta.precio.toFixed(2)}</TableCell>
                      <TableCell>{venta.idCliente}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;
