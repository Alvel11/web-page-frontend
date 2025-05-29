const handleAddArticulo = (articulo) => {
  const cantidad = prompt(`Wie viele "${articulo.nombre}" willst du transferieren? (Max: ${articulo.cantidad})`);
  const cantidadInt = parseInt(cantidad);

  if (isNaN(cantidadInt) || cantidadInt < 1 || cantidadInt > articulo.cantidad) {
    alert('Ungültige Menge.');
    return;
  }

  setCart(prev => [...prev, {
    articulo,
    cantidad: cantidadInt,
    maxDisponible: articulo.cantidad
  }]);
};
