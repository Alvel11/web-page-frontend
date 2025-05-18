import React, { useEffect, useState } from 'react';
import { FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import axios from 'axios';

const TiendaDropdown = ({ selectedTienda, onChange, label }) => {
  const [tiendas, setTiendas] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('http://localhost:8081/tiendas')
      .then(response => {
        setTiendas(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error("Fehler beim Laden der Tiendas", error);
        setLoading(false);
      });
  }, []);

  return (
    <FormControl fullWidth sx={{ mb: 2}}>
      <InputLabel>{label}</InputLabel>
      <Select
        value={selectedTienda}
        label={label}
        onChange={e => onChange(e.target.value)}
        disabled={loading}
        sx={{ minWidth: 240 }}
      >
        {tiendas.map(t => (
          <MenuItem key={t.idTienda} value={t.idTienda}>
            {t.nombre} – {t.ubicacion}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default TiendaDropdown;
