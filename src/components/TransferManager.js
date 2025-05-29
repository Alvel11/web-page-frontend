// src/components/TransferManager.js
import React, { useState, useEffect } from 'react';
import {
  Grid, Typography, Box, Button
} from '@mui/material';
import DropdownTiendas from './DropdownTiendas';
import TransferCart from './TransferCart';
import ArticuloTableWithAddButton from './ArticuloTableWithAddButton';

const TransferManager = () => {
  const [tiendas, setTiendas] = useState([]);
  const [origenId, setOrigenId] = useState('');
  const [destinoId, setDestinoId] = useState('');
  const [cart, setCart] = useState([]);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  useEffect(() => {
    fetch('http://localhost:8081/tiendas')
      .then(res => res.json())
      .then(data => setTiendas(data))
      .catch(err => console.error('Error al cargar tiendas:', err));
  }, []);

  const handleAddArticulo = (articulo) => {
    if (!origenId) {
      alert('Elige primero una tienda origen.');
      return;
    }

    if (cart.find(item => item.articulo.idArticulo === articulo.idArticulo)) {
      alert('Este articulo ya se encuentra en el carrito.');
      return;
    }

    const cantidad = prompt(`Cuantos "${articulo.nombre}" quiere transferir? (Max: ${articulo.cantidad})`);
    const cantidadInt = parseInt(cantidad);

    if (isNaN(cantidadInt) || cantidadInt < 1 || cantidadInt > articulo.cantidad) {
      alert('Cantidad no valida.');
      return;
    }

    setCart(prev => [...prev, {
      articulo,
      cantidad: cantidadInt,
      maxDisponible: articulo.cantidad
    }]);
  };

  const handleRemove = (index) => {
    setCart(cart.filter((_, i) => i !== index));
  };

  const handleTransfer = async () => {
    if (!origenId || !destinoId) {
      alert('Por favor elige tienda destino y origen.');
      return;
    }

    if (cart.length === 0) {
      alert('El carrito de compra esta vacio, por favor agrega articulos.');
      return;
    }

    const solicitudTransferencia = {
      tiendaOrigen: origenId,
      tiendaDestino: destinoId,
      transferencias: cart.map(item => ({
        idArticulo: item.articulo.idArticulo,
        cantidad: item.cantidad
      }))
    };

    try {
      const response = await fetch('http://localhost:8081/transferencia', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(solicitudTransferencia)
      });

      if (response.ok) {
        alert('Transfer erfolgreich abgeschlossen!');
        setCart([]); // Warenkorb leeren
        setRefreshTrigger(prev => prev + 1);
      } else {
        alert('Error en la transferencia.');
      }
    } catch (error) {
      console.error('Fehler beim Transfer:', error);
      alert('Error en la transferencia.');
    }
  };


  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" gutterBottom>Transferencias</Typography>

      <Grid container spacing={4}>
        <Grid item xs={12} sm={6}>
          <DropdownTiendas
            tiendas={tiendas}
            label="Tienda Origen"
            value={origenId}
            onChange={setOrigenId}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <DropdownTiendas
            tiendas={tiendas}
            label="Tienda Destino"
            value={destinoId}
            onChange={setDestinoId}
          />
        </Grid>

        {origenId && (
          <Grid item xs={12}>
            <ArticuloTableWithAddButton tiendaId={origenId} onAdd={handleAddArticulo} refreshTrigger={refreshTrigger} />
          </Grid>
        )}

        <Grid item xs={12}>
          <TransferCart cart={cart} onRemove={handleRemove} />
        </Grid>
      </Grid>

      <Box sx={{ mt: 4 }}>
        <Button
          variant="contained"
          color="primary"
          onClick={handleTransfer}
          disabled={cart.length === 0 || !origenId || !destinoId}
        >
          Realizar transferencia
        </Button>
      </Box>
    </Box>
  );
};

export default TransferManager;
