// URL base de la API de productos
const BASE_URL = 'http://localhost:5000/api/products';

// Referencias a los elementos del DOM
const list = document.getElementById('product-list');
const form = document.getElementById('product-form');


// Obtiene y muestra la lista de productos desde la API (GET resuelto)
async function fetchProducts() {
  const res = await fetch(BASE_URL);
  const products = await res.json();
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
}

// EJERCICIO: Completa la función para crear un producto usando fetch POST
async function createProduct(name, price, description) {
  try{
    const res = await fetch(BASE_URL, {
      method: 'POST',
      headers :{ 
       'Content-Type' : 'application/json'
    },
    body: JSON.stringify({
      name: name,
      price: parseFloat(price),
      description: description
      })
    });
    
    if (!res.ok) {
      throw new Error('Error al crear el producto');
    }

    const data = await res.json();
    console.log('Producto creado:', data);

  }catch(error){
    console.error('Error al crear el producto',error);
  };
  
}

// EJERCICIO: Completa la función para eliminar un producto usando fetch DELETE
async function deleteProduct(id) {
    try {
    const res = await fetch(`${BASE_URL}/${id}`, {
      method: 'DELETE'
    });

    if (!res.ok) {
      throw new Error('Error al eliminar el producto');
    }

    console.log(`Producto con id ${id} eliminado.`);
  } catch (error) {
    console.error('Error al eliminar producto:', error);
  }
}

// EJERCICIO: Completa la función para mostrar detalles usando fetch GET /products/:id
async function showDetails(id) {
  try {
    const res = await fetch(`${BASE_URL}/${id}`);
    if (!res.ok) {
      throw new Error('No se pudo obtener el producto');
    }
    const product = await res.json();
    alert(`Producto: ${product.name}\nPrecio: $${product.price}\nDescripción: ${product.description}`);
  } catch (error) {
    console.error('Error al obtener detalles:', error);
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
