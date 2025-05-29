import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import ArticuloTableWithAddButton from './ArticuloTableWithAddButton';
import TransferCart from './TransferCart';
import HistorialVentasTable from './HistorialVentasTable';
import HistorialCreditoTable from './HistorialCreditoTable';
import {
  Box,
  Button,
  Typography,
  Tabs,
  Tab,
  MenuItem,
  Select,
  FormControl,
  InputLabel
} from '@mui/material';

const VentasTransferPage = () => {
  const { tiendaId } = useParams();
  const [cart, setCart] = useState([]);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [tabIndex, setTabIndex] = useState(0);
  const [mode, setMode] = useState("venta"); // "venta" or "credito"

  const handleAddArticulo = (articulo) => {
    if (cart.find(item => item.articulo.idArticulo === articulo.idArticulo)) {
      alert('Articulo ya en carrito de compra.');
      return;
    }

    const cantidad = prompt(`Cuantos "${articulo.nombre}" quiere agregar? (Max: ${articulo.cantidad})`);
    const cantidadInt = parseInt(cantidad);

    if (isNaN(cantidadInt) || cantidadInt < 1 || cantidadInt > articulo.cantidad) {
      alert('Cantidad no valida.');
      return;
    }

    setCart(prev => [...prev, {
      articulo: { id: articulo.idInventarioTienda, ...articulo },
      cantidad: cantidadInt,
      maxDisponible: articulo.cantidad
    }]);
  };

  const handleRemove = (index) => {
    setCart(cart.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    const tienda = parseInt(tiendaId);

    const body = {
      tienda,
      ventas: cart.map(item => ({
        idArticulo: item.articulo.idArticulo,
        cantidad: item.cantidad
      }))
    };

    const endpoint = mode === "venta" ? "venta" : "credito";

    try {
      const res = await fetch(`http://localhost:8081/${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });

      if (res.ok) {
        alert(mode === "venta" ? 'Venta exitosa!' : 'Crédito exitoso!');
        setCart([]);
        setRefreshTrigger(prev => prev + 1);
      } else {
        alert('Error al procesar la operación.');
      }
    } catch (err) {
      console.error('Error en operación:', err);
    }
  };

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" gutterBottom>Ventas für Tienda {tiendaId}</Typography>

      <Tabs value={tabIndex} onChange={(_, newIndex) => setTabIndex(newIndex)} sx={{ mb: 2 }}>
        <Tab label="Realizar Venta/Crédito" />
        <Tab label="Historial de Ventas" />
        <Tab label="Historial de Crédito" />
      </Tabs>

      {tabIndex === 0 && (
        <>
          <FormControl sx={{ minWidth: 200, mb: 2 }}>
            <InputLabel id="modo-label">Modo</InputLabel>
            <Select
              labelId="modo-label"
              value={mode}
              label="Modo"
              onChange={(e) => setMode(e.target.value)}
            >
              <MenuItem value="venta">Venta</MenuItem>
              <MenuItem value="credito">Crédito</MenuItem>
            </Select>
          </FormControl>

          <ArticuloTableWithAddButton
            tiendaId={tiendaId}
            onAdd={handleAddArticulo}
            refreshTrigger={refreshTrigger}
          />

          <Box sx={{ mt: 4 }}>
            <TransferCart cart={cart} onRemove={handleRemove} />
            <Button
              variant="contained"
              color="primary"
              onClick={handleSubmit}
              disabled={cart.length === 0}
              sx={{ mt: 2 }}
            >
              {mode === 'venta' ? 'Realizar venta' : 'Realizar crédito'}
            </Button>
          </Box>
        </>
      )}

      {tabIndex === 1 && <HistorialVentasTable tiendaId={tiendaId} />}
      {tabIndex === 2 && <HistorialCreditoTable tiendaId={tiendaId} />}
    </Box>
  );
};

export default VentasTransferPage;
