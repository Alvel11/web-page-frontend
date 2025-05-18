import React from 'react';
import { Paper, Typography, List, ListItem, ListItemText, IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

const TransferCart = ({ cart, onRemove }) => {
  return (
    <Paper sx={{ p: 2, mt: 2 }}>
      <Typography variant="h6" gutterBottom>Carrito de transferencia</Typography>
      {cart.length === 0 ? (
        <Typography>Carrito vacio.</Typography>
      ) : (
        <List>
          {cart.map((item, index) => (
            <ListItem
              key={`${item.articulo.id}-${index}`}
              secondaryAction={
                <IconButton edge="end" aria-label="delete" onClick={() => onRemove(index)}>
                  <DeleteIcon />
                </IconButton>
              }
            >
              <ListItemText
                primary={`${item.articulo.nombre} (${item.cantidad} Stk.)`}
                secondary={`Verfügbar: ${item.maxDisponible}`}
              />
            </ListItem>
          ))}
        </List>
      )}
    </Paper>
  );
};

export default TransferCart;
