document.addEventListener('DOMContentLoaded', function () {

    loadTodos();
    loadTodosFromServer();
});

let list = document.querySelector('.todo-list');
let items = list.children;
let emptyListMessage = document.querySelector('.empty-tasks');
let newItemForm = document.querySelector('.add-form');
let newItemTitle = newItemForm.querySelector('.add-form__input');
let taskTemplate = document.querySelector('#task-template').content;
let newItemTemplate = taskTemplate.querySelector('.todo-list__item');


let toggleEmptyListMessage = function () {
    if (items.length === 0) {
        emptyListMessage.classList.remove('hidden');
    } else {
        emptyListMessage.classList.add('hidden');
    }
};


let addCheckHandler = function (item) {
    let checkbox = item.querySelector('.todo-list__input');

    checkbox.addEventListener('change', function () {
        key = item.querySelector('span').textContent;

        item.remove();
        localStorage.removeItem(key);

        toggleEmptyListMessage();
    });
};


// для покормить кота в index.html
// for (let i = 0; i < items.length; i++) {
//   addCheckHandler(items[i]);
//   console.log('111')
// }


newItemForm.addEventListener('submit', function (evt) {
    evt.preventDefault();

    let taskText = newItemTitle.value;
    let task = newItemTemplate.cloneNode(true);
    let taskDescription = task.querySelector('span');

    taskDescription.textContent = taskText;
    localStorage.setItem(`${taskText}`, task.innerHTML);
    addCheckHandler(task);
    list.appendChild(task);
    toggleEmptyListMessage();
    newItemTitle.value = '';
    window.location.reload();
});


function loadTodos() {
    for (let i = 0; i < localStorage.length; i++) {
        let key = localStorage.key(i);
        let newLi = document.createElement('li');

        newLi.innerHTML = localStorage.getItem(key);
        newLi.classList.add('todo-list__item');

        addCheckHandler(newLi);
        innerPage(newLi);
        list.append(newLi);
    }
}


function loadTodosFromServer() {
    fetch("https://jsonplaceholder.typicode.com/todos/")
        .then(response => response.json())
        .then(todos => {
            for (let i of Object.keys(todos)) {
                let newLi = document.createElement('li');
                newLi.innerHTML = `
                        <label>
                            <input type="checkbox" class="todo-list__input">
                            <span>${todos[i].title}</span>
                        </label>
                        <br>
                        <a class="add-form-button button-inner-page">Содержание задачи</a>
                        <br>
                        <br>
                        `
                newLi.classList.add('todo-list__item');

                addCheckHandler(newLi);
                innerPage(newLi);

                list.append(newLi);
            }
        })
}


let innerPage = function (item) {
    let button = item.querySelector('.button-inner-page');

    button.addEventListener('click', function () {
        title = item.querySelector('span').textContent
        document.querySelector('.container').style.display = 'none';
        let page = document.querySelector('.page')
        page.innerHTML = `
                        <h4>Описание задачи</h4>
                        <div>Задача: ${title} </div>
                        <br>
                        <input class="add-form-button" type="button" value="Назад" onClick="window.location.reload()">
                        `;
    });
};

// localStorage.clear()