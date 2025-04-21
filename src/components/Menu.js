import React from 'react';
import { Link } from 'react-router-dom';
import { AppBar, Toolbar, Tab, Tabs, Typography } from '@mui/material';

const Menu = () => {
  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" style={{ flexGrow: 1 }}>
          Menu
        </Typography>
        <Tabs>
          <Tab label="Dashboard" component={Link} to="/" />
          <Tab label="Tiendas" component={Link} to="/stores" />
          <Tab label="Compras" component={Link} to="/compras" />
        </Tabs>
      </Toolbar>
    </AppBar>
  );
};

export default Menu;