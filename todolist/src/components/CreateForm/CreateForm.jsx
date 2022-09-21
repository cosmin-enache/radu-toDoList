import './CreateForm.css'
import { useState } from "react";

function CreateForm({
    currentId,
    setCurrentId,
    date,
    setDate,
    todos,
    setTodos
}) {
    const [inputTitle, setInputTitle] = useState('');
    const [inputDetails, setInputDetails] = useState('');

    // Disables the entire form
    function removeForm() {

        let createForm = document.getElementsByClassName('create-form')[0];
        createForm.classList.remove('visible');
        let mainPage = document.getElementById('main-page');
        mainPage.classList.remove('blur');
        mainPage.classList.remove('avoid-clicks');
    }

    // Applies styling to the selected priority
    const checkIfActive = () => {

        let lowPrioInput = document.getElementById('create-new-low');
        let lowPrioContainer = document.getElementsByClassName('create-new-prio-low')[0];
        let midPrioInput = document.getElementById('create-new-mid');
        let midPrioContainer = document.getElementsByClassName('create-new-prio-mid')[0];
        let highPrioInput = document.getElementById('create-new-high');
        let highPrioContainer = document.getElementsByClassName('create-new-prio-high')[0];

        if (lowPrioInput.checked) {
            lowPrioContainer.classList.add('create-new-prio-low-active');
            midPrioContainer.classList.remove('create-new-prio-mid-active');
            highPrioContainer.classList.remove('create-new-prio-high-active');
        }
        else if (midPrioInput.checked) {
            lowPrioContainer.classList.remove('create-new-prio-low-active');
            midPrioContainer.classList.add('create-new-prio-mid-active');
            highPrioContainer.classList.remove('create-new-prio-high-active');
        }
        else if (highPrioInput.checked) {
            lowPrioContainer.classList.remove('create-new-prio-low-active');
            midPrioContainer.classList.remove('create-new-prio-mid-active');
            highPrioContainer.classList.add('create-new-prio-high-active');
        }

    }

    // Creates the todo object when the form is submitted

    const handleSubmit = e => {

        e.preventDefault();
        let priority;
        let dateWarning = document.getElementsByClassName('create-date-warn')[0];
        // Checks the priority so it can add the correct styling to the toDo
        let lowPriority = document.getElementById('create-new-low');
        if (lowPriority.checked) {
            priority = "low";
        }
        let midPriority = document.getElementById('create-new-mid');
        if (midPriority.checked) {
            priority = "mid";
        }
        let highPriority = document.getElementById('create-new-high');
        if (highPriority.checked) {
            priority = "high";
        }

        //The todo is created only if the submitted due date is valid
        let selectedYear = Number(date[0] + date[1] + date[2] + date[3])

        if (selectedYear >= 2022 && selectedYear < 2100) {
            dateWarning.style.visibility = 'hidden';
            setTodos([...todos, { id: currentId, title: inputTitle, date, details: inputDetails, priority }]);
            setCurrentId(currentId => currentId + 1);
            removeForm();
        }
        else {
            dateWarning.style.visibility = 'visible';
        }
    };
    //Targets the title selected by the user in the form
    const inputTitleHandler = e => {
        setInputTitle(e.target.value)
    }

    //Targets the details field
    const inputDetailsHandler = e => {
        setInputDetails(e.target.value)
    }

    //Targets the data selected by the user in the form
    const dateHandler = e => {
        if (e.target.value) { setDate(e.target.value) } else { setDate('No due date') }
    }

    return (
        <div className="create-form">
            <div className='create-nav'>
                <h3>Create a new ToDo</h3>
                <div className="create-close-butt" onClick={removeForm}>X</div>
            </div>
            <div className='create-main-content'>
                <form onSubmit={handleSubmit}>
                    <div><textarea className='text-box' value={inputTitle} name="title" id="title" onChange={inputTitleHandler} maxLength={25} required placeholder={'Title'}></textarea></div>
                    <div className='create-details'>
                        <textarea name="details" maxLength={55} className='text-box' id="details" onChange={inputDetailsHandler} placeholder='Details' required></textarea>
                    </div>
                    <div className='create-date'>
                        <label htmlFor="create-date">Due date: </label>
                        <input value={date} onChange={dateHandler} type="date" name="due-date" id="due-date" required />
                        <p className='create-date-warn'>Please enter a valid date!</p>
                    </div>
                    <div className='priority-and-send'>
                        <div className='create-priority'>
                            <label className='priority-tag-label' htmlFor="create-priority">Priority: </label>
                            <div className='create-new-prio-butt create-new-prio-low'>
                                <label className='prio-label' htmlFor="create-new-low">Low</label>
                            </div>
                            <input onClick={checkIfActive} type="radio" required name="create-new-priority" id="create-new-low" className='create-new-prio-input' />
                            <div className='create-new-prio-butt create-new-prio-mid'>
                                <label className='prio-label' htmlFor="create-new-mid">Mid</label>
                            </div>
                            <input onClick={checkIfActive} type="radio" required name='create-new-priority' id='create-new-mid' className='create-new-prio-input' />
                            <div className='create-new-prio-butt create-new-prio-high'>
                                <label className='prio-label' htmlFor="create-new-high">High</label>
                            </div>
                            <input onClick={checkIfActive} type="radio" required name="create-new-priority" id="create-new-high" className='create-new-prio-input' />
                        </div>
                        <div className='create-submit'>
                            <button type='submit'>Add</button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    )

}

export default CreateForm