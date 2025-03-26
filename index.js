'use strict';

const formConfig = {
    task: {
        errorSelector: document.querySelector('.task-error'),
        setVisibility: function(visibility) {
            this.errorSelector.style.visibility = visibility;
        },
        setBorder: function(borderStyle) {
            this.errorSelector.style.border = borderStyle;
        }
    },
    priority: {
        errorSelector: document.querySelector('.priority-error'),
        setVisibility: function(visibility) {
            this.errorSelector.style.visibility = visibility;
        },
        setBorder: function(borderStyle) {
            this.errorSelector.style.border = borderStyle;
        }
    }
};

const inputElement = document.getElementById('input_field');
const priorityElement = document.getElementById('priority');
const addButton = document.getElementById('button_add');
const list = document.getElementById('task-list');

document.addEventListener('DOMContentLoaded', () => {
    const parsedTodos = getTodos();

    parsedTodos.forEach(todo => {
        createTodoItem(todo.task, todo.priority);
    });
});

const getTodos = () => JSON.parse(localStorage.getItem('todos')) || [];

addButton.addEventListener('click', addTask);

inputElement.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        event.preventDefault(); 
        addTask();
    }
});

priorityElement.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        event.preventDefault(); 
        addTask();
    }
});

list.addEventListener('click', event => {
    if (event.target.classList.contains('task-text')) {
        event.target.parentElement.parentElement.classList.toggle('crossed');
    }

    if (event.target.classList.contains('delete-button')) {
        event.target.parentElement.parentElement.remove();
        updateStorage();
    }
});

function updateStorage() {
    const updatedTodos = [];
    const listItems = list.querySelectorAll('li');

    for (let i = 0; i < listItems.length; i++) {
        const li = listItems[i];
        const taskText = li.querySelector('.task-text').textContent;
        const priority = li.querySelector('.priority-tag').textContent.split(' ')[1];

        updatedTodos.push({task: taskText, priority: priority}); 
    }

    localStorage.setItem('todos', JSON.stringify(updatedTodos)); 
}

function showSuccessMessage(message) {
    const parent = document.querySelector('.success-message-container');
    const successMsg = document.createElement('div');
    successMsg.textContent = message;
    successMsg.classList.add('success-message');

    parent.appendChild(successMsg);

    setTimeout(() => {
        successMsg.classList.add('fade-out');
        setTimeout(() => successMsg.remove(), 2000); 
    }, 1000);
}

function addTask() {
    const userInput = inputElement.value.trim();
    const selectedPriority = priority.options[priority.selectedIndex].value;    

    const parsedTodos = getTodos();

    const currentTask = {
        task: userInput,
        priority: selectedPriority,
    }

    let isValid = true;

    isValid &= validateForm('task', userInput, inputElement);
    isValid &= validateForm('priority', selectedPriority, priorityElement);

    if (!isValid) {
        return;
    }        

    parsedTodos.push(currentTask); 
    localStorage.setItem('todos', JSON.stringify(parsedTodos));

    createTodoItem(userInput, selectedPriority); 

    showSuccessMessage('The task is successfully added!');

    inputElement.value = '';
    priorityElement.value = 'default';
}

function validateForm(key, value, inputElement) {
    let isValid = true;

    if (value === '' || value === 'default') {
        isValid = false;
        formConfig[key].setVisibility('visible');
        inputElement.style.border = '1px solid rgb(255, 64, 102)';
    } else {
        formConfig[key].setVisibility('hidden');
        inputElement.style.border = '';
    }

    return isValid;
}

function createTodoItem(taskText, taskPriority) {
    const liItem = createElement('li', null, null, null, null, list);
    createElement('span', `Priority: ${taskPriority}`, 'priority-tag', null, null, liItem);
    const container = createElement('div', null, 'task-and-button', null, null, liItem);
    createElement('p', taskText, 'task-text', null, null, container);
    createElement('button', 'delete', 'delete-button', 'type', 'button', container);
    list.appendChild(liItem);   
}

function createElement(tagName, textContent, className, attribute, attributeValue, parentElement) {
    const element = document.createElement(tagName);

    if (textContent) {
        element.textContent = textContent;
    }
    if (className) {
        element.classList.add(className);
    }
    if (attribute && attributeValue) {
        element.setAttribute(attribute, attributeValue);
    }
    parentElement.appendChild(element);

    return element;
}