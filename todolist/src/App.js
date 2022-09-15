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
  const localCompleteCounter = localStorage.getItem('completeCounter');
  const localIncompleteCounter = localStorage.getItem('incompleteCounter');
  const defaultArr = [{
    "id" : 1,
    "title": "Brush Teeth",
    "date": "2023-09-15",
    "priority": "mid",
    "details": "details1",
    "checked": false,
  },
  {
    "id" : 2,
    "title": "Wash the dog",
    "date": "2022-09-15",
    "priority": "low",
    "details": "details2",
    "checked": true,
  },
  {
    "id" : 3,
    "title": "Homework",
    "date": "2022-09-15",
    "priority": "high",
    "details": "details4",
    "checked": false,
  },
  {
    "id" : 4,
    "title": "Walk the dog",
    "date": "2022-12-12",
    "priority": "high",
    "details": "details5",
    "checked": true,
  }
];
  const defaultCompleteCounter = 2;
  const defaultIncompleteCounter = 2;

  const [todos, setTodos] = useState(localTodos ? JSON.parse(localTodos) : defaultArr);
  const [completeCounter, setCompleteCounter] = useState(localCompleteCounter ? JSON.parse(localCompleteCounter) : defaultCompleteCounter);
  const [incompleteCounter, setIncompleteCounter] = useState(localIncompleteCounter ? JSON.parse(localIncompleteCounter) : defaultIncompleteCounter);


  const [inputTitle, setInputTitle] = useState('');
  const [inputDetails, setInputDetails] = useState('');
  const [inputEditTitle, setInputEditTitle] = useState();
  const [inputEditDetails, setInputEditDetails] = useState();
  const [currentId, setCurrentId] = useState(5);
  const [date, setDate] = useState();
  const [selectedToDoDetails, setSelectedToDoDetails] = useState();
  const [selectedToDoForEdit, setSelectedToDoForEdit] = useState();
  const [modifiedToDo, setModifiedToDo] = useState();


  const currentDate = useMemo(() => new Date(), []);
  const currentMonth = currentDate.getMonth();
  let isoDate = currentDate.toISOString();
  let isoTodayArr = [];
  let currentDay;
  let todoMonth;
  let currentYear;
  let todoYear;

  for(let i = 0; i < isoDate.length - 14; i++) {
    isoTodayArr.push(isoDate[i]);
    currentDay= isoTodayArr.join('').toString();
  }

  // Adds a current month property to each todo object used in later comparison
  for(let i = 0; i < todos.length; i++) {
    if(todos[i].date[5] === '0') {
      todos[i].currentMonth = todos[i].date[6] - 1;
    }
    else {
      todos[i].currentMonth = todos[i].date[5] + todos[i].date[6] - 1;
    }
    todoYear = `${todos[i].date[0]}${todos[i].date[1]}${todos[i].date[2]}${todos[i].date[3]}`
    currentYear = `${currentDay[0]}${currentDay[1]}${currentDay[2]}${currentDay[3]}`
  }

  
      // if(currentYear === todoYear && !yearTodos.includes(todos[i])) {
      //   setYearTodos(prevYearTodos => [...prevYearTodos, todos[i]]);
      // }
  
  // if(currentYear === todoYear && todoMonth === currentDate.getMonth() && !monthTodos.includes(todos[i])) {
  //   setMonthTodos(prevMonthsTodos => [...prevMonthsTodos, todos[i]]);
  // }
  let todayTodos = useMemo(() => todos.filter(todo => todo.date === currentDay), [todos, currentDay]);
  let yearTodos = useMemo(() => todos.filter(todo => `${todo.date[0]}${todo.date[1]}${todo.date[2]}${todo.date[3]}` === currentYear), [todos, currentYear] );
  let monthTodos = useMemo(() => yearTodos.filter(todo => todo.currentMonth === currentDate.getMonth()), [yearTodos, currentDate]);

  const [completeTodos, setCompleteTodos] = useState([]);
  const [incompleteTodos, setIncompleteTodos] = useState([]);
  
  // Saves the selected todo by it's details button in the selectedToDo state
  function showDetails (arr, index) {
    setSelectedToDoDetails(arr[index]);
  };

  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos))
  }, [todos]);

  useEffect(() => {
    localStorage.setItem('completeCounter', JSON.stringify(completeCounter))
  }, [completeCounter]);

  useEffect(() => {
    localStorage.setItem('incompleteCounter', JSON.stringify(incompleteCounter))
  }, [incompleteCounter]);

  function showEdit(arr, index) {
    const item = arr[index];

    setSelectedToDoForEdit(item);
    setInputEditDetails(item.details);
    setInputEditTitle(item.title);
  }
  // if a toDo has been selected, each time it gets refreshed, the details Overlay gets rendered with the correct props
  // also, the main page content gets disabled and blurred
  useEffect (() => {
    if(selectedToDoDetails) {
    let detailsOverlay = document.getElementsByClassName('details-overlay')[0];
    detailsOverlay.classList.remove('invisible');
    let mainPage = document.getElementById('main-page');
    mainPage.classList.add('blur');
    mainPage.classList.add('avoid-clicks');
   }
  }, [selectedToDoDetails]);

  useEffect (() => {
    if(selectedToDoForEdit) {
    let editOverlay = document.getElementsByClassName('edit-form')[0];
    editOverlay.classList.add('visible');
    let mainPage = document.getElementById('main-page');
    mainPage.classList.add('blur');
    mainPage.classList.add('avoid-clicks');
    }
  }, [selectedToDoForEdit])

  // the function return the the todos left after the deletion
    function deleteToDo (arr, index) {
    
      let selectedTodo = arr[index];

      if  (selectedTodo.checked) {setCompleteCounter(prevCompleteCounter => prevCompleteCounter - 1)}
      else                       {setIncompleteCounter(prevIncompleteCounter => prevIncompleteCounter - 1)}

    if(arr === todos) {
      setTodos(arr.filter((todo, todoIndex) => todoIndex !== index));
      // if(todayTodos.includes(selectedTodo)) setTodayTodos(todos.filter((todo, todoIndex) => todoIndex === todos[selectedTodo]));
      if(monthTodos.includes(selectedTodo)) monthTodos = todos.filter((todo, todoIndex) => todoIndex === todos[selectedTodo]);
      if(yearTodos.includes(selectedTodo)) yearTodos = todos.filter((todo, todoIndex) => todoIndex === todos[selectedTodo]);
      if(completeTodos.includes(selectedTodo)) setCompleteTodos(todos.filter((todo, todoIndex) => todoIndex === todos[selectedTodo]));
      if(incompleteTodos.includes(selectedTodo)) setIncompleteTodos(todos.filter((todo, todoIndex) => todoIndex === todos[selectedTodo]))
    };
    if(arr === todayTodos) {
      // setTodayTodos(arr.filter((todo, todoIndex) => todoIndex !== index));
      if(todos.includes(selectedTodo)) setTodos(todos.filter(todo => todo !== selectedTodo));
      if(monthTodos.includes(selectedTodo)) monthTodos = monthTodos.filter(todo => todo !== selectedTodo);
      if(yearTodos.includes(selectedTodo)) yearTodos = yearTodos.filter(todo => todo !== selectedTodo);
      if(completeTodos.includes(selectedTodo)) setCompleteTodos(completeTodos.filter(todo => todo !== selectedTodo));
      if(incompleteTodos.includes(selectedTodo)) setIncompleteTodos(incompleteTodos.filter(todo => todo !== selectedTodo));
    }
    if(arr === monthTodos) {
      monthTodos = arr.filter((todo, todoIndex) => todoIndex !== index);
      if(todos.includes(selectedTodo)) setTodos(todos.filter(todo => todo !== selectedTodo));
      // if(todayTodos.includes(selectedTodo)) setTodayTodos(todayTodos.filter(todo => todo !== selectedTodo));
      if(yearTodos.includes(selectedTodo)) yearTodos = yearTodos.filter(todo => todo !== selectedTodo);
      if(completeTodos.includes(selectedTodo)) setCompleteTodos(completeTodos.filter(todo => todo !== selectedTodo));
      if(incompleteTodos.includes(selectedTodo)) setIncompleteTodos(incompleteTodos.filter(todo => todo !== selectedTodo));
    }
    if(arr === yearTodos) {
      yearTodos = arr.filter((todo, todoIndex) => todoIndex !== index);
      if(todos.includes(selectedTodo)) setTodos(todos.filter(todo => todo !== selectedTodo));
      // if(todayTodos.includes(selectedTodo)) setTodayTodos(todayTodos.filter(todo => todo !== selectedTodo));
      if(monthTodos.includes(selectedTodo)) monthTodos = monthTodos.filter(todo => todo !== selectedTodo);
      if(completeTodos.includes(selectedTodo)) setCompleteTodos(completeTodos.filter(todo => todo !== selectedTodo));
      if(incompleteTodos.includes(selectedTodo)) setIncompleteTodos(incompleteTodos.filter(todo => todo !== selectedTodo));
    }
    if(arr === completeTodos) {
      setCompleteTodos(arr.filter((todo, todoIndex) => todoIndex !== index));
      if(todos.includes(selectedTodo)) setTodos(todos.filter(todo => todo !== selectedTodo));
      // if(todayTodos.includes(selectedTodo)) setTodayTodos(todayTodos.filter(todo => todo !== selectedTodo));
      if(monthTodos.includes(selectedTodo)) monthTodos = monthTodos.filter(todo => todo !== selectedTodo);
      if(yearTodos.includes(selectedTodo)) yearTodos = yearTodos.filter(todo => todo !== selectedTodo);
      if(incompleteTodos.includes(selectedTodo)) setIncompleteTodos(incompleteTodos.filter(todo => todo !== selectedTodo));
    }
    if(arr === incompleteTodos) {
      setIncompleteTodos(arr.filter((todo, todoIndex) => todoIndex !== index));
      if(todos.includes(selectedTodo)) setTodos(todos.filter(todo => todo !== selectedTodo));
      // if(todayTodos.includes(selectedTodo)) setTodayTodos(todayTodos.filter(todo => todo !== selectedTodo));
      if(monthTodos.includes(selectedTodo)) monthTodos = monthTodos.filter(todo => todo !== selectedTodo);
      if(yearTodos.includes(selectedTodo)) yearTodos = yearTodos.filter(todo => todo !== selectedTodo);
      if(completeTodos.includes(selectedTodo)) setCompleteTodos(completeTodos.filter(todo => todo !== selectedTodo));
    }
  }

  // The function gets the selected to do and adds a checked property to it, returning an updated array

    function checkButton(arr, todoIndex) {
      
      let updatedTodos = [];
      for(let i = 0; i < arr.length; i++) {
        let checkedTodo = arr[i];
        if(i === todoIndex) {
          checkedTodo.checked = !checkedTodo.checked;
          if(checkedTodo.checked) {
            setCompleteCounter(prevCompletedCounter => prevCompletedCounter + 1)
            setIncompleteCounter(prevUncheckedCounter => prevUncheckedCounter - 1)
          }
          else {
            setCompleteCounter(prevCompletedCounter => prevCompletedCounter - 1)
            setIncompleteCounter(prevUncheckedCounter => prevUncheckedCounter + 1)
          }
        }
        updatedTodos.push(checkedTodo);
      }
      if      (arr === todos)           setTodos(updatedTodos);
      // else if (arr === todayTodos)      setTodayTodos(updatedTodos);
      else if (arr === monthTodos)      monthTodos = updatedTodos;
      else if (arr === yearTodos)       yearTodos = updatedTodos;
      else if (arr === completeTodos)   setCompleteTodos(updatedTodos);

      for(let i = 0; i < todos.length; i++) {
        if(!todos[i].checked && completeTodos.includes(todos[i])) {
          setCompleteTodos(todos.filter(todo => todo.checked));
        } 
        if(todos[i].checked && incompleteTodos.includes(todos[i])) {
          setIncompleteTodos(todos.filter(todo => !todo.checked));
        }
      }
    }

    function checkCategory() {
    // Category filters

    // Brings the full date in yyyy-mm-dd format
    // let currentDate = new Date();
    

    for(let i = 0; i < todos.length; i++) {

      //Today check
      // if(todos[i].date === currentDay && !todayTodos.includes(todos[i])) {
      //   setTodayTodos(prevTodayTodos => [...prevTodayTodos, todos[i]]);
      // }

      // Year check
      
      

      //Month check
      

      // Complete check

      if(todos[i].checked && !completeTodos.includes(todos[i])) {
        setCompleteTodos(prevCompleteTodos => [...prevCompleteTodos, todos[i]]);
      }
      else if(!todos[i].checked && !incompleteTodos.includes(todos[i])) {
        setIncompleteTodos(prevIncompleteTodos => [...prevIncompleteTodos, todos[i]]);
        // if(!todos[i].checked && incompleteTodos.includes(todos[i])) {
        //   setIncompleteTodos(incompleteTodos.splice(incompleteTodos[todos[i]], 1));
        // }
      }
    }
  }

  function openHome () {
    
    checkCategory();

    let homeButton = document.getElementsByClassName('home-category')[0];
    let todayButton = document.getElementsByClassName('today-category')[0];
    let monthButton = document.getElementsByClassName('month-category')[0];
    let yearButton = document.getElementsByClassName('year-category')[0];
    let completeButton = document.getElementsByClassName('complete-category')[0];
    let incompleteButton = document.getElementsByClassName('incomplete-category')[0];

    let homeTodos = document.getElementsByClassName('home')[0];
    let todayTodos = document.getElementsByClassName('today')[0];
    let monthTodos = document.getElementsByClassName('month')[0];
    let yearTodos = document.getElementsByClassName('year')[0];
    let completeTodos = document.getElementsByClassName('complete')[0];
    let incompleteTodos = document.getElementsByClassName('incomplete')[0];

    homeButton.classList.add('category-active');
    todayButton.classList.remove('category-active');
    monthButton.classList.remove('category-active');
    yearButton.classList.remove('category-active');
    completeButton.classList.remove('category-active');
    incompleteButton.classList.remove('category-active');

    homeTodos.classList.add('display-show')
    todayTodos.classList.remove('display-show');
    monthTodos.classList.remove('display-show');
    yearTodos.classList.remove('display-show');
    completeTodos.classList.remove('display-show');
    incompleteTodos.classList.remove('display-show');

    homeTodos.classList.remove('display-hide')
    todayTodos.classList.add('display-hide');
    monthTodos.classList.add('display-hide');
    yearTodos.classList.add('display-hide');
    completeTodos.classList.add('display-hide');
    incompleteTodos.classList.add('display-hide');

    let mobileNav = document.getElementsByClassName('menu-add')[0];
    if(mobileNav.classList.contains('show'))     mobileNav.classList.remove('show')

  }

  function openToday () {

    checkCategory();

    let homeButton = document.getElementsByClassName('home-category')[0];
    let todayButton = document.getElementsByClassName('today-category')[0];
    let monthButton = document.getElementsByClassName('month-category')[0];
    let yearButton = document.getElementsByClassName('year-category')[0];
    let completeButton = document.getElementsByClassName('complete-category')[0];
    let incompleteButton = document.getElementsByClassName('incomplete-category')[0];

    let homeTodos = document.getElementsByClassName('home')[0];
    let todayTodos = document.getElementsByClassName('today')[0];
    let monthTodos = document.getElementsByClassName('month')[0];
    let yearTodos = document.getElementsByClassName('year')[0];
    let completeTodos = document.getElementsByClassName('complete')[0];
    let incompleteTodos = document.getElementsByClassName('incomplete')[0];

    homeButton.classList.remove('category-active');
    todayButton.classList.add('category-active');
    monthButton.classList.remove('category-active');
    yearButton.classList.remove('category-active');
    completeButton.classList.remove('category-active');
    incompleteButton.classList.remove('category-active');

    homeTodos.classList.remove('display-show');
    todayTodos.classList.add('display-show');
    monthTodos.classList.remove('display-show');
    yearTodos.classList.remove('display-show');
    completeTodos.classList.remove('display-show');
    incompleteTodos.classList.remove('display-show');

    homeTodos.classList.add('display-hide');
    todayTodos.classList.remove('display-hide');
    monthTodos.classList.add('display-hide');
    yearTodos.classList.add('display-hide');
    completeTodos.classList.add('display-hide');
    incompleteTodos.classList.add('display-hide');

    let mobileNav = document.getElementsByClassName('menu-add')[0];
    if(mobileNav.classList.contains('show'))     mobileNav.classList.remove('show')

  }

  function openMonth () {

    checkCategory();

    let homeButton = document.getElementsByClassName('home-category')[0];
    let todayButton = document.getElementsByClassName('today-category')[0];
    let monthButton = document.getElementsByClassName('month-category')[0];
    let yearButton = document.getElementsByClassName('year-category')[0];
    let completeButton = document.getElementsByClassName('complete-category')[0];
    let incompleteButton = document.getElementsByClassName('incomplete-category')[0];

    let homeTodos = document.getElementsByClassName('home')[0];
    let todayTodos = document.getElementsByClassName('today')[0];
    let monthTodos = document.getElementsByClassName('month')[0];
    let yearTodos = document.getElementsByClassName('year')[0];
    let completeTodos = document.getElementsByClassName('complete')[0];
    let incompleteTodos = document.getElementsByClassName('incomplete')[0];

    homeButton.classList.remove('category-active');
    todayButton.classList.remove('category-active');
    monthButton.classList.add('category-active');
    yearButton.classList.remove('category-active');
    completeButton.classList.remove('category-active');
    incompleteButton.classList.remove('category-active');

    homeTodos.classList.remove('display-show');
    todayTodos.classList.remove('display-show');
    monthTodos.classList.add('display-show');
    yearTodos.classList.remove('display-show');
    completeTodos.classList.remove('display-show');
    incompleteTodos.classList.remove('display-show');

    homeTodos.classList.add('display-hide');
    todayTodos.classList.add('display-hide');
    monthTodos.classList.remove('display-hide');
    yearTodos.classList.add('display-hide');
    completeTodos.classList.add('display-hide');
    incompleteTodos.classList.add('display-hide');

    let mobileNav = document.getElementsByClassName('menu-add')[0];
    if(mobileNav.classList.contains('show'))     mobileNav.classList.remove('show')

    }

  function openYear () {

    checkCategory();

    let homeButton = document.getElementsByClassName('home-category')[0];
    let todayButton = document.getElementsByClassName('today-category')[0];
    let monthButton = document.getElementsByClassName('month-category')[0];
    let yearButton = document.getElementsByClassName('year-category')[0];
    let completeButton = document.getElementsByClassName('complete-category')[0];
    let incompleteButton = document.getElementsByClassName('incomplete-category')[0];
  
    let homeTodos = document.getElementsByClassName('home')[0];
    let todayTodos = document.getElementsByClassName('today')[0];
    let monthTodos = document.getElementsByClassName('month')[0];
    let yearTodos = document.getElementsByClassName('year')[0];
    let completeTodos = document.getElementsByClassName('complete')[0];
    let incompleteTodos = document.getElementsByClassName('incomplete')[0];
  
    homeButton.classList.remove('category-active');
    todayButton.classList.remove('category-active');
    monthButton.classList.remove('category-active');
    yearButton.classList.add('category-active');
    completeButton.classList.remove('category-active');
    incompleteButton.classList.remove('category-active');
  
    homeTodos.classList.remove('display-show');
    todayTodos.classList.remove('display-show');
    monthTodos.classList.remove('display-show');
    yearTodos.classList.add('display-show');
    completeTodos.classList.remove('display-show');
    incompleteTodos.classList.remove('display-show');
  
    homeTodos.classList.add('display-hide');
    todayTodos.classList.add('display-hide');
    monthTodos.classList.add('display-hide');
    yearTodos.classList.remove('display-hide');
    completeTodos.classList.add('display-hide');
    incompleteTodos.classList.add('display-hide');
  
    let mobileNav = document.getElementsByClassName('menu-add')[0];
    if(mobileNav.classList.contains('show'))     mobileNav.classList.remove('show')

    }

  function openComplete () {

    checkCategory();
  
    let homeButton = document.getElementsByClassName('home-category')[0];
    let todayButton = document.getElementsByClassName('today-category')[0];
    let monthButton = document.getElementsByClassName('month-category')[0];
    let yearButton = document.getElementsByClassName('year-category')[0];
    let completeButton = document.getElementsByClassName('complete-category')[0];
    let incompleteButton = document.getElementsByClassName('incomplete-category')[0];
    
    let homeTodos = document.getElementsByClassName('home')[0];
    let todayTodos = document.getElementsByClassName('today')[0];
    let monthTodos = document.getElementsByClassName('month')[0];
    let yearTodos = document.getElementsByClassName('year')[0];
    let completeTodos = document.getElementsByClassName('complete')[0];
    let incompleteTodos = document.getElementsByClassName('incomplete')[0];
    
    homeButton.classList.remove('category-active');
    todayButton.classList.remove('category-active');
    monthButton.classList.remove('category-active');
    yearButton.classList.remove('category-active');
    completeButton.classList.add('category-active');
    incompleteButton.classList.remove('category-active');
    
    homeTodos.classList.remove('display-show');
    todayTodos.classList.remove('display-show');
    monthTodos.classList.remove('display-show');
    yearTodos.classList.remove('display-show');
    completeTodos.classList.add('display-show');
    incompleteTodos.classList.remove('display-show');
    
    homeTodos.classList.add('display-hide');
    todayTodos.classList.add('display-hide');
    monthTodos.classList.add('display-hide');
    yearTodos.classList.add('display-hide');
    completeTodos.classList.remove('display-hide');
    incompleteTodos.classList.add('display-hide');
    
    let mobileNav = document.getElementsByClassName('menu-add')[0];
    if(mobileNav.classList.contains('show'))     mobileNav.classList.remove('show')

  }

  function openIncomplete () {

    checkCategory();
  
    let homeButton = document.getElementsByClassName('home-category')[0];
    let todayButton = document.getElementsByClassName('today-category')[0];
    let monthButton = document.getElementsByClassName('month-category')[0];
    let yearButton = document.getElementsByClassName('year-category')[0];
    let completeButton = document.getElementsByClassName('complete-category')[0];
    let incompleteButton = document.getElementsByClassName('incomplete-category')[0];
    
    let homeTodos = document.getElementsByClassName('home')[0];
    let todayTodos = document.getElementsByClassName('today')[0];
    let monthTodos = document.getElementsByClassName('month')[0];
    let yearTodos = document.getElementsByClassName('year')[0];
    let completeTodos = document.getElementsByClassName('complete')[0];
    let incompleteTodos = document.getElementsByClassName('incomplete')[0];
    
    homeButton.classList.remove('category-active');
    todayButton.classList.remove('category-active');
    monthButton.classList.remove('category-active');
    yearButton.classList.remove('category-active');
    completeButton.classList.remove('category-active');
    incompleteButton.classList.add('category-active');
    
    homeTodos.classList.remove('display-show');
    todayTodos.classList.remove('display-show');
    monthTodos.classList.remove('display-show');
    yearTodos.classList.remove('display-show');
    completeTodos.classList.remove('display-show');
    incompleteTodos.classList.add('display-show');
    
    homeTodos.classList.add('display-hide');
    todayTodos.classList.add('display-hide');
    monthTodos.classList.add('display-hide');
    yearTodos.classList.add('display-hide');
    completeTodos.classList.add('display-hide');
    incompleteTodos.classList.remove('display-hide');
    
    let mobileNav = document.getElementsByClassName('menu-add')[0];
    if(mobileNav.classList.contains('show'))     mobileNav.classList.remove('show')

  }
    // Picks a todo for editing and shows the edit overlay with it's data

    checkCategory();


  return (
    <div className="App">
      <CreateForm 
      inputTitle={inputTitle}
      setInputTitle={setInputTitle}
      inputDetails={inputDetails}
      setInputDetails={setInputDetails}
      currentId={currentId}
      setCurrentId={setCurrentId}
      date={date}
      setDate={setDate}
      todos={todos}
      setTodos={setTodos}
      incompleteCounter={incompleteCounter}
      setIncompleteCounter={setIncompleteCounter}
      checkCategory={checkCategory}
      />
      {selectedToDoDetails && (<Details  {...selectedToDoDetails} setSelectedToDoDetails={setSelectedToDoDetails}/>)}
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
                                checkCategory={checkCategory}
                                todayTodos={todayTodos}
                                // setTodayTodos={setTodayTodos}
                                monthTodos={monthTodos}
                                // setMonthTodos={setMonthTodos}
                                yearTodos={yearTodos}
                                // setYearTodos={setYearTodos}
                                completeTodos={completeTodos}
                                setCompleteTodos={setCompleteTodos}
                                incompleteTodos={incompleteTodos}
                                setIncompleteTodos={setIncompleteTodos}
                                />)}
      <div id='main-page'>
      <div id='nav-with-add' className='menu-add'>
          <Nav 
          completeCounter={completeCounter} 
          incompleteCounter={incompleteCounter}
          todos={todos}
          todayTodos={todayTodos}
          monthTodos={monthTodos}
          yearTodos={yearTodos}
          openHome={openHome}
          openToday={openToday}
          openMonth={openMonth}
          openYear={openYear}
          openComplete={openComplete}
          openIncomplete={openIncomplete}
          />
      </div>
      <div className='main-content'>
        <div className='home display-show'>
          <Head />
          <div className="to-do-container">
            {todos.map((todo, index) =>
            (<ToDo
              {...todo}
              id={index}
              showEdit= {() => showEdit(todos, index)}
              showDetails={() => showDetails(todos, index)}
              deleteToDo= {() => deleteToDo(todos, index)}
              checkButton={() => checkButton(todos, index)}
            />))}
          </div>
        </div>
        <div className='today display-hide'>
          <Head />
          <div className='to-do-container'>
            {todayTodos.map((todo, index) =>
            (<ToDo
              {...todo}
              id={index}
              showEdit= {() => showEdit(todayTodos, index)}
              showDetails={() => showDetails(todayTodos, index)}
              deleteToDo= {() => deleteToDo(todayTodos, index)}
              checkButton={() => checkButton(todayTodos, index)}
            />))}
          </div>
        </div>
        <div className='month display-hide'>
          <Head />
          <div className='to-do-container'>
            {monthTodos.map((todo, index) =>
            (<ToDo
              {...todo}
              id={index}
              showEdit= {() => showEdit(monthTodos ,index)}
              showDetails={() => showDetails(monthTodos ,index)}
              deleteToDo= {() => deleteToDo(monthTodos ,index)}
              checkButton={() => checkButton(monthTodos ,index)}
            />))}
          </div>
        </div>
        <div className='year display-hide'>
          <Head />
          <div className='to-do-container'>
            {yearTodos.map((todo, index) =>
            (<ToDo
              {...todo}
              id={index}
              showEdit= {() => showEdit(yearTodos, index)}
              showDetails={() => showDetails(yearTodos, index)}
              deleteToDo= {() => deleteToDo(yearTodos, index)}
              checkButton={() => checkButton(yearTodos, index)}
            />))}
          </div>
        </div>
        <div className='complete display-hide'>
          <Head />
          <div className='to-do-container'>
            {completeTodos.map((todo, index) =>
            (<ToDo
              {...todo}
              id={index}
              showEdit= {() => showEdit(completeTodos, index)}
              showDetails={() => showDetails(completeTodos, index)}
              deleteToDo= {() => deleteToDo(completeTodos, index)}
              checkButton={() => checkButton(completeTodos, index)}
            />))}
          </div>
        </div>
        <div className='incomplete display-hide'>
          <Head />
          <div className='to-do-container'>
            {incompleteTodos.map((todo, index) =>
            (<ToDo
              {...todo}
              id={index}
              showEdit= {() => showEdit(incompleteTodos, index)}
              showDetails={() => showDetails(incompleteTodos, index)}
              deleteToDo= {() => deleteToDo(incompleteTodos, index)}
              checkButton={() => checkButton(incompleteTodos, index)}
            />))}
          </div>
        </div>
      </div>
      </div>
    </div>
  );
}

export default App;
