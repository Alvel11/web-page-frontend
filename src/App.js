// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Menu from './components/Menu';
import Dashboard from './components/Dashboard';
import Stores from './components/Stores';
import Compras from './components/Compras';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import GestionDeTiendas from './components/GestionDeTiendas';
import TransferManager from './components/TransferManager';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2', // Customize your primary color
    },
    secondary: {
      main: '#dc004e', // Customize your secondary color
    },
  },
});

const App = () => {
  return (
      <ThemeProvider theme={theme}>
        <CssBaseline /> {/* This helps with consistent baseline styles */}
            <Router>
              <Menu />
              <div style={{ marginLeft: '220px' }}>
                <Routes>
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/stores" element={<Stores />} />
                   <Route path="/compras" element={<Compras />} />
                   <Route path="/gestion-tiendas" element={<GestionDeTiendas />} />
                   <Route path="/transferencias" element={<TransferManager />} />
                </Routes>
              </div>
            </Router>
      </ThemeProvider>

  );
};

export default App;
