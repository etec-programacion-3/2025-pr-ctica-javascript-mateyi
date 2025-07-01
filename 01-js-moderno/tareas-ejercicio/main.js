// Importa las funciones del módulo de tareas
import { getTasks, addTask, removeTask, editTask } from './tareas.js';

// Referencias a los elementos del DOM
const form = document.getElementById('task-form');
const input = document.getElementById('task-input');
const list = document.getElementById('task-list');

// Agrega un array para guardar el estado de completado de cada tarea
let completedStates = JSON.parse(localStorage.getItem('completedStates')) || [];

function saveCompletedStates() {
  localStorage.setItem('completedStates', JSON.stringify(completedStates));
}

// Crea controles de filtro
const filterDiv = document.createElement('div');
const filterLabel = document.createElement('label');
filterLabel.textContent = 'Filtrar: ';
const filterSelect = document.createElement('select');
const optionTodos = document.createElement('option');
optionTodos.value = 'todos';
optionTodos.textContent = 'Todos';
const optionCompletadas = document.createElement('option');
optionCompletadas.value = 'completadas';
optionCompletadas.textContent = 'Completadas';
const optionPendientes = document.createElement('option');
optionPendientes.value = 'pendientes';
optionPendientes.textContent = 'Pendientes';
filterSelect.appendChild(optionTodos);
filterSelect.appendChild(optionCompletadas);
filterSelect.appendChild(optionPendientes);
filterDiv.appendChild(filterLabel);
filterDiv.appendChild(filterSelect);
list.parentNode.insertBefore(filterDiv, list);

let currentFilter = 'todos';
filterSelect.value = currentFilter;
filterSelect.onchange = () => {
  currentFilter = filterSelect.value;
  renderTasks();
};

function renderTasks() {
  list.innerHTML = '';
  const tasks = getTasks();
  // Sincroniza el array de estados con la cantidad de tareas
  while (completedStates.length < tasks.length) completedStates.push(false);
  while (completedStates.length > tasks.length) completedStates.pop();
  saveCompletedStates();
  // Aplica el filtro seleccionado
  let filtered = tasks.map((task, idx) => ({ task, idx, completed: completedStates[idx] }));
  if (currentFilter === 'completadas') {
    filtered = filtered.filter(({ completed }) => completed);
  } else if (currentFilter === 'pendientes') {
    filtered = filtered.filter(({ completed }) => !completed);
  }
  filtered.forEach(({ task, idx, completed }) => {
    const li = document.createElement('li');
    li.textContent = task;
    if (completed) li.style.textDecoration = 'line-through';
    // Checkbox para marcar como completada
    const check = document.createElement('input');
    check.type = 'checkbox';
    check.checked = completed;
    check.onchange = () => {
      completedStates = [
        ...completedStates.slice(0, idx),
        check.checked,
        ...completedStates.slice(idx + 1)
      ];
      saveCompletedStates();
      renderTasks();
    };
    li.prepend(check);
    // Botón para editar la tarea
    const editBtn = document.createElement('button');
    editBtn.textContent = 'Editar';
    editBtn.onclick = () => {
      const nuevoTexto = prompt('Editar tarea:', task);
      if (nuevoTexto !== null && nuevoTexto.trim() !== '') {
        editTask(idx, nuevoTexto.trim());
        renderTasks();
      }
    };
    li.appendChild(editBtn);
    // Botón para eliminar la tarea
    const btn = document.createElement('button');
    btn.textContent = 'Eliminar';
    btn.onclick = () => {
      removeTask(idx);
      completedStates = [
        ...completedStates.slice(0, idx),
        ...completedStates.slice(idx + 1)
      ];
      saveCompletedStates();
      renderTasks();
    };
    li.appendChild(btn);
    list.appendChild(li);
  });
}

// Maneja el evento submit del formulario para agregar una tarea
form.onsubmit = e => {
  e.preventDefault();
  addTask(input.value);
  completedStates = [...completedStates, false]; // Nueva tarea empieza como pendiente
  saveCompletedStates();
  input.value = '';
  renderTasks();
};

// Render inicial de las tareas
renderTasks();
