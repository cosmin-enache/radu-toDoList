import './ToDo.css'

function ToDo ({checked, priority, title, checkButton, deleteTodo, date, showDetails}) {

    return (
        <div className={`todo ${priority}-border`}>
            <div className="todo-first-half">
                <div onClick={checkButton} className={`${priority}-container check-container`}>
                    {checked && <i className={`fa-solid fa-check ${priority}-check`}></i>}
                </div>
                <p>{title}</p>
            </div>
            <div className="todo-second-half">
                <button onClick={showDetails} className={`details details-${priority}`}>DETAILS</button>
                <p className='date-container'>{date}</p>
                <i className={`fa-solid fa-pencil icon-${priority}`}></i>
                <i id onClick={deleteTodo} className={`fa-solid fa-ban icon-${priority}`}></i>
            </div>
        </div>
    )
}

export default ToDo