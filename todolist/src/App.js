import './App.css';
import Head from './components/Head/Head';
import Nav from './components/Nav/Nav';
import ToDo from './components/ToDo/ToDo';
import Details from './components/Details/Details';
import CreateForm from './components/CreateForm/CreateForm';
import Edit from './components/Edit/Edit';
import { useState, useEffect, useMemo } from 'react';

function App() {

  const localTodos = localStorage.getItem('todos');
  const localId = localStorage.getItem('id');

  const defaultArr = [{
    "id": 1,
    "title": "Brush Teeth",
    "date": "2023-09-15",
    "priority": "mid",
    "details": "details1",
    "checked": false,
  },
  {
    "id": 2,
    "title": "Wash the dog",
    "date": "2022-09-18",
    "priority": "low",
    "details": "details2",
    "checked": true,
  },
  {
    "id": 3,
    "title": "Homework",
    "date": "2022-09-18",
    "priority": "high",
    "details": "details4",
    "checked": false,
  },
  {
    "id": 4,
    "title": "Walk the dog",
    "date": "2022-12-12",
    "priority": "high",
    "details": "details5",
    "checked": true,
  }
  ];
  const defaultId = 5;

  const [todos, setTodos] = useState(localTodos ? JSON.parse(localTodos) : defaultArr);
  const [currentId, setCurrentId] = useState(localId ? JSON.parse(localId) : defaultId);

  const [selectedFilter, setSelectedFilter] = useState('home');

  const [inputEditTitle, setInputEditTitle] = useState('');
  const [inputEditDetails, setInputEditDetails] = useState('');
  const [date, setDate] = useState();
  const [selectedToDoDetails, setSelectedToDoDetails] = useState();
  const [selectedToDoForEdit, setSelectedToDoForEdit] = useState();
  const [modifiedToDo, setModifiedToDo] = useState();


  const currentDate = useMemo(() => new Date(), []);
  let isoDate = currentDate.toISOString();
  let isoTodayArr = [];
  let currentDay;
  let currentYear;

  for (let i = 0; i < isoDate.length - 14; i++) {
    isoTodayArr.push(isoDate[i]);
    currentDay = isoTodayArr.join('').toString();
  }

  // Adds a current month property to each todo object used in later comparison
  for (let i = 0; i < todos.length; i++) {
    if (todos[i].date[5] === '0') {
      todos[i].currentMonth = todos[i].date[6] - 1;
    }
    else {
      todos[i].currentMonth = todos[i].date[5] + todos[i].date[6] - 1;
    }
    todos[i].currentYear = `${todos[i].date[0]}${todos[i].date[1]}${todos[i].date[2]}${todos[i].date[3]}`
    currentYear = `${currentDay[0]}${currentDay[1]}${currentDay[2]}${currentDay[3]}`
  }

  let todayTodos = todos.filter(todo => todo.date === currentDay);
  let yearTodos = todos.filter(todo => todo.currentYear === currentYear);
  let monthTodos = yearTodos.filter(todo => todo.currentMonth === currentDate.getMonth());
  let completeTodos = todos.filter(todo => todo.checked);
  let incompleteTodos = todos.filter(todo => !todo.checked);

  // Saves the selected todo by it's details/edit button in the corresponding state
  function showDetails(arr, index) {
    setSelectedToDoDetails(arr[index]);
  };

  function showEdit(arr, index) {
    const item = arr[index];

    setSelectedToDoForEdit(item);
    setInputEditDetails(item.details);
    setInputEditTitle(item.title);
  }

  // Saves these variables in local storage each time a change occurs to them
  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos))
    localStorage.setItem('id', JSON.stringify(currentId))

    if (selectedToDoDetails) {
      let detailsOverlay = document.getElementsByClassName('details-overlay')[0];
      detailsOverlay.classList.remove('invisible');
      let mainPage = document.getElementById('main-page');
      mainPage.classList.add('blur');
      mainPage.classList.add('avoid-clicks');
    }

    if (selectedToDoForEdit) {
      let editForm = document.getElementsByClassName('edit-form')[0];
      editForm.classList.add('visible');
      let mainPage = document.getElementById('main-page');
      mainPage.classList.add('blur');
      mainPage.classList.add('avoid-clicks');
    }
  }, [todos, selectedToDoDetails, selectedToDoForEdit]);

  // The function gets the selected todo and deletes it from the main array
  function deleteToDo(arr, todoIndex) {
    for (let i = 0; i < arr.length; i++) {
      if (i === todoIndex) {
        let selectedTodo = arr[i];
        setTodos(todos.filter(todo => todo !== selectedTodo))
      }
    }
  }

  // The function gets the selected todo and adds a checked property to it, updating the main array with the modified todo
  function checkTodo(arr, todoIndex) {
    for (let i = 0; i < arr.length; i++) {
      if (i === todoIndex) {
        let selectedTodo = arr[i]
        selectedTodo.checked = !selectedTodo.checked;
        setTodos([...todos], todos.splice(todos.indexOf(selectedTodo), 1, selectedTodo))
      }
    }
  }

  // Saves the selected array and filter for later use in rendering
  const shownTodos = (() => {
    if (selectedFilter === 'home') return todos;
    else if (selectedFilter === 'today') return todayTodos;
    else if (selectedFilter === 'month') return monthTodos;
    else if (selectedFilter === 'year') return yearTodos;
    else if (selectedFilter === 'complete') return completeTodos;
    else if (selectedFilter === 'incomplete') return incompleteTodos;
  })();

  return (
    <div className="App">
      <CreateForm
        currentId={currentId}
        setCurrentId={setCurrentId}
        date={date}
        setDate={setDate}
        todos={todos}
        setTodos={setTodos}
      />
      {selectedToDoDetails && (<Details  {...selectedToDoDetails} setSelectedToDoDetails={setSelectedToDoDetails} />)}
      {selectedToDoForEdit && (<Edit {...selectedToDoForEdit}
        selectedToDoForEdit={selectedToDoForEdit}
        modifiedToDo={modifiedToDo}
        setModifiedToDo={setModifiedToDo}
        todos={todos} setTodos={setTodos}
        inputEditTitle={inputEditTitle}
        setInputEditTitle={setInputEditTitle}
        inputEditDetails={inputEditDetails}
        setInputEditDetails={setInputEditDetails}
        setDate={setDate}
        setSelectedToDoForEdit={setSelectedToDoForEdit}
      />)}
      <div id='main-page'>
        <div id='nav-with-add' className='menu-add'>
          <Nav
            selectedFilter={selectedFilter}
            setSelectedFilter={setSelectedFilter}
            completeTodos={completeTodos}
            incompleteTodos={incompleteTodos}
          />
        </div>
        <div className='main-content'>
          <div className={`${selectedFilter} display-show`}>
            <Head />
            <div className="to-do-container">
              {shownTodos.map((todo, index) =>
              (<ToDo
                {...todo}
                key={index}
                showEdit={() => showEdit(shownTodos, index)}
                showDetails={() => showDetails(shownTodos, index)}
                deleteToDo={() => deleteToDo(shownTodos, index)}
                checkTodo={() => checkTodo(shownTodos, index)}
              />))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
