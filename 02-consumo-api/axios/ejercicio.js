// URL base de la API de productos
const BASE_URL = 'http://localhost:5000/api/products';

// Referencias a los elementos del DOM
const list = document.getElementById('product-list');
const form = document.getElementById('product-form');

// Obtiene y muestra la lista de productos desde la API usando axios (GET resuelto)
async function fetchProducts() {
  try {
    const res = await axios.get(BASE_URL);
    const products = res.data;
    list.innerHTML = '';
    products.forEach(prod => {
      const li = document.createElement('li');
      li.textContent = `${prod.name} - $${prod.price}`;
      // Llama a showDetails al hacer clic en el nombre del producto
      li.onclick = () => showDetails(prod.id);
      // Botón para eliminar (completar en el ejercicio)
      const btn = document.createElement('button');
      btn.textContent = 'Eliminar';
      btn.onclick = e => {
        e.stopPropagation();
        // TODO: Llama a deleteProduct y luego fetchProducts
      };
      li.appendChild(btn);
      list.appendChild(li);
    });
  } catch (err) {
    alert('Error al obtener productos');
  }
}

// EJERCICIO: Completa la función para crear un producto usando axios POST
async function createProduct(name, price, description) {
  try {
    const res = await axios.post(BASE_URL, {
      name,
      price: parseFloat(price),
      description
    });

    console.log('Producto creado:', res.data);
  } catch (error) {
    console.error('Error al crear producto:', error);
    alert('No se pudo crear el producto.');
  }
}

// EJERCICIO: Completa la función para eliminar un producto usando axios DELETE
async function deleteProduct(id) {
  try {
    await axios.delete(`${BASE_URL}/${id}`);
    console.log(`Producto con id ${id} eliminado.`);
  } catch (error) {
    console.error('Error al eliminar producto:', error);
    alert('No se pudo eliminar el producto.');
  }
}

// EJERCICIO: Completa la función para mostrar detalles usando axios GET /products/:id
async function showDetails(id) {
  try {
    const res = await axios.get(`${BASE_URL}/${id}`);
    const product = res.data;

    alert(`Producto: ${product.name}\nPrecio: $${product.price}\nDescripción: ${product.description}`);
  } catch (error) {
    console.error('Error al obtener detalles:', error);
    alert('No se pudo mostrar los detalles del producto.');
  }
}

// Maneja el submit del formulario para crear un producto
form.onsubmit = async e => {
  e.preventDefault();
  const name = document.getElementById('name').value;
  const price = document.getElementById('price').value;
  const description = document.getElementById('description').value;
  // TODO: Llama a createProduct y luego fetchProducts
  form.reset();
};

// Render inicial
fetchProducts(); 
