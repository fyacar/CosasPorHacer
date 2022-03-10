
// minuto 13

const listsContainer = document.querySelector('[data-lists]');
const newListForm = document.querySelector('[data-new-list-form]');
const newListInput = document.querySelector('[data-new-list-input]');
//local storege keys
const LOCAL_STORAGE_LIST_KEY = 'task.lists';
const LOCAL_STORAGE_LIST_ID_KEY = 'task.selectedListID';
//lists lee las listas desde el local storage y almacena esa información
let lists = JSON.parse(localStorage.getItem(LOCAL_STORAGE_LIST_KEY)) || [];
let selectedListId = localStorage.getItem(LOCAL_STORAGE_LIST_ID_KEY);

const deleteListButton = document.querySelector('[data-delete-list-button]');

const listDisplayContainer = document.querySelector('[data-list-display-container]');
const listTitleElement = document.querySelector('[data-list-title]');
const listCountElement = document.querySelector('[data-list-count]');

const taskContainer = document.querySelector('[data-tasks]');

const taksTemplate = document.getElementById('task-template');

const newTaskForm = document.querySelector('[data-new-task-form]');
const newTaskInput = document.querySelector('[data-new-task-input]');

const clearCompleteTasksButton = document.querySelector('[data-clear-complete-tasks-button]');



clearCompleteTasksButton.addEventListener('click', e=>{
  const selectedList = lists.find(list=> list.id === selectedListId);
  selectedList.tasks = selectedList.tasks.filter(task => !task.complete);
  saveAndRender();
})

taskContainer.addEventListener('click', e=>{
  if(e.target.tagName.toLowerCase()=== 'input'){
    const selectedList = lists.find(list => list.id === selectedListId);
    const selectedTask = selectedList.tasks.find(task=> task.id === e.target.id);
    selectedTask.complete = e.target.checked;
    save();
    renderTaskCount(selectedList);
  }
})


deleteListButton.addEventListener('click', e => {
  //creamos una nueva lista filtrando la lista que está seleccionada actualmente
  lists = lists.filter(list => list.id !== selectedListId);
  //le damos el valor de null a selectedListID para que no guarde el último id.
  selectedListId = null;
  saveAndRender();
})

newListForm.addEventListener('submit', e => {
  e.preventDefault();
  const listName = newListInput.value;
  if(listName == null || listName.trim().length == 0) return;
  const list = createList(listName);
  newListInput.value = null;
  lists.push(list);
  saveAndRender(); 
})

newTaskForm.addEventListener('submit', e => {
  e.preventDefault();
  const taskName = newTaskInput.value;
  if(taskName == null || taskName.trim().length == 0) return;
  const task = createTask(taskName);
  newTaskInput.value = null;
  const selectedList = lists.find(list=> list.id === selectedListId);
  selectedList.tasks.push(task);
  saveAndRender(); 
})

function createTask(name){
  return {
    id: Date.now().toString(),
    name: name,
    complete: false
   }
}

function createList(name){
  return {
   id: Date.now().toString(),
   name: name,
   tasks:[]
  }

}

function saveAndRender(){
  save();
  render();
}

function save(){
  //guardamos la información de las listas en localStorage, pasando primero el valor de la llave
  localStorage.setItem(LOCAL_STORAGE_LIST_KEY , JSON.stringify(lists));
  //se guarda el id de la lista que se seleccionó para que se quede con la clase 'lista-activa'
  localStorage.setItem(LOCAL_STORAGE_LIST_ID_KEY , selectedListId);
}

function render() {
  clearElement(listsContainer);
  renderLists();
  const selectedList = lists.find(list => list.id === selectedListId)
  if(selectedList == null){
    listDisplayContainer.style.display="none";
  }else{
    listDisplayContainer.style.display="";
    listTitleElement.innerText= selectedList.name;
    renderTaskCount(selectedList);
    clearElement(taskContainer);
    renderTasks(selectedList);
  }
}
function renderTasks(selectedList){
    selectedList.tasks.forEach(task =>{
      const taskElement = document.importNode(taksTemplate.content , true);
      const checkbox = taskElement.querySelector('input');
      checkbox.id = task.id;
      checkbox.checked = task.complete;
      const label = taskElement.querySelector('label');
      label.htmlFor = task.id;
      label.append(task.name);
      taskContainer.appendChild(taskElement);
    })
}



function renderTaskCount(selectedList){
    const incompleteTaskCount = selectedList.tasks.filter(task => !task.complete).length;
    const taskString = incompleteTaskCount === 1 ? "tarea" : "tareas";
    listCountElement.innerText= `${incompleteTaskCount} ${taskString} por completar`
}

function renderLists(){
  lists.forEach(list => {
    const listElement = document.createElement('li');
    listElement.dataset.listId=list.id;
    listElement.classList.add('nombre-lista');
    listElement.innerText = list.name;
    // Si el id del elemento es igual al id al que se ha hecho click (listsContaine.addEventListener()) se le agrega la clase 'Lista Activa'
    if(list.id === selectedListId) listElement.classList.add('lista-activa');
    listsContainer.appendChild(listElement);
  })
}

function clearElement(element) {
  while (element.firstChild) {
    element.removeChild(element.firstChild);
  }
}


listsContainer.addEventListener('click', e =>{
  if(e.target.tagName.toLowerCase() === 'li'){
    // Se guarda el id del elemento li al que le ha hecho click
    selectedListId = e.target.dataset.listId;    
    saveAndRender();
  }
} )

render();