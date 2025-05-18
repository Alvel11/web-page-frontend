import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { TextField, List, ListItem, ListItemText, CircularProgress, Paper } from '@mui/material';

const ArticuloSearch = ({ onSelect }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchArticulos = async () => {
      if (query.trim().length < 2) {
        setResults([]);
        return;
      }
      setLoading(true);
      try {
        const response = await axios.get(`http://localhost:8081/articulo/busqueda`, {
          params: { nombre: query }
        });
        setResults(response.data);
      } catch (error) {
        console.error('Fehler beim Laden der Artikel:', error);
        setResults([]);
      } finally {
        setLoading(false);
      }
    };

    const delayDebounce = setTimeout(fetchArticulos, 300); // debounce

    return () => clearTimeout(delayDebounce);
  }, [query]);

  return (
    <Paper sx={{ p: 2 }}>
      <TextField
        fullWidth
        label="Buscar articulo"
        variant="outlined"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      {loading && <CircularProgress size={24} sx={{ mt: 2 }} />}
      {!loading && results.length > 0 && (
        <List>
          {results.map((articulo) => (
            <ListItem button key={articulo.id} onClick={() => onSelect(articulo)}>
              <ListItemText
                primary={articulo.nombre}
                secondary={`${articulo.categoria} | ${articulo.color} | ${articulo.calidad}`}
              />
            </ListItem>
          ))}
        </List>
      )}
    </Paper>
  );
};

export default ArticuloSearch;
