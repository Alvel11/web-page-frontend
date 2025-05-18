import React, { useState, useEffect } from 'react';
import {
  Grid, Typography, Box, Button
} from '@mui/material';
import DropdownTiendas from './DropdownTiendas';  // Importiere die DropdownTiendas-Komponente
import ArticuloSearch from './ArticuloSearch';
import TransferCart from './TransferCart';

const TransferManager = () => {
  const [tiendas, setTiendas] = useState([]);
  const [origenId, setOrigenId] = useState('');
  const [destinoId, setDestinoId] = useState('');
  const [cart, setCart] = useState([]);

  useEffect(() => {
    fetch('http://localhost:8081/tiendas')
      .then(res => res.json())
      .then(data => setTiendas(data))
      .catch(err => console.error('Fehler beim Laden der Tiendas:', err));
  }, []);

  const handleAddArticulo = async (articulo) => {
    if (!origenId) {
      alert('Bitte wähle zuerst ein Ursprungs-Geschäft.');
      return;
    }

    try {
      const res = await fetch(`http://localhost:8081/inventario/${origenId}/${articulo.id}`);
      const data = await res.json();

      const cantidad = prompt(`Wie viele "${articulo.nombre}" willst du transferieren? (Max: ${data.cantidad})`);
      const cantidadInt = parseInt(cantidad);

      if (isNaN(cantidadInt) || cantidadInt < 1 || cantidadInt > data.cantidad) {
        alert('Ungültige Menge.');
        return;
      }

      setCart(prev => [...prev, {
        articulo,
        cantidad: cantidadInt,
        maxDisponible: data.cantidad
      }]);

    } catch (e) {
      console.error('Fehler beim Abrufen des Lagerbestands', e);
    }
  };

  const handleRemove = (index) => {
    setCart(cart.filter((_, i) => i !== index));
  };

  const handleTransfer = async () => {
    if (!origenId || !destinoId) {
      alert('Bitte wähle sowohl ein Ursprungs- als auch ein Ziel-Geschäft.');
      return;
    }

    if (cart.length === 0) {
      alert('Der Warenkorb ist leer. Bitte füge Artikel hinzu.');
      return;
    }

    const transferData = cart.map(item => ({
      articuloId: item.articulo.id,
      cantidad: item.cantidad,
      origenId: origenId,
      destinoId: destinoId
    }));

    try {
      const response = await fetch('http://localhost:8081/transfer', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(transferData)
      });

      if (response.ok) {
        alert('Transfer erfolgreich abgeschlossen!');
        setCart([]); // Warenkorb nach erfolgreichem Transfer leeren
      } else {
        alert('Fehler beim Transfer. Bitte versuche es später noch einmal.');
      }
    } catch (error) {
      console.error('Fehler beim Transfer:', error);
      alert('Fehler beim Transfer. Bitte versuche es später noch einmal.');
    }
  };

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" gutterBottom>Transferencias</Typography>

      <Grid container spacing={4}>
        {/* Dropdown für Ursprungs- und Zielgeschäft */}
        <Grid item xs={12} sm={6}>
          <DropdownTiendas
            tiendas={tiendas}
            label="Tienda origen"
            value={origenId}
            onChange={(value) => setOrigenId(value)}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <DropdownTiendas
            tiendas={tiendas}
            label="Tienda Destino"
            value={destinoId}
            onChange={(value) => setDestinoId(value)}
          />
        </Grid>

        {/* Artikelsuche & Warenkorb */}
        <Grid item xs={12} md={6}>
          <ArticuloSearch onSelect={handleAddArticulo} />
        </Grid>
        <Grid item xs={12} md={6}>
          <TransferCart cart={cart} onRemove={handleRemove} />
        </Grid>
      </Grid>

      {/* Transfer Button */}
      <Box sx={{ mt: 4 }}>
        <Button
          variant="contained"
          color="primary"
          onClick={handleTransfer}
          disabled={cart.length === 0 || !origenId || !destinoId}
        >
          Transfer durchführen
        </Button>
      </Box>
    </Box>
  );
};

export default TransferManager;
