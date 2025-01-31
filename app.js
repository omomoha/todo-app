document.addEventListener('DOMContentLoaded', () => {
    const todoInput = document.getElementById('todoInput');
    const addTodoBtn = document.getElementById('addTodo');
    const todoList = document.getElementById('todoList');
    const todoCount = document.getElementById('todoCount');
    const clearCompletedBtn = document.getElementById('clearCompleted');
    const filterBtns = document.querySelectorAll('.filter-btn');

    let todos = JSON.parse(localStorage.getItem('todos')) || [];
    let currentFilter = 'all';

    function saveTodos() {
        localStorage.setItem('todos', JSON.stringify(todos));
    }

    function updateTodoCount() {
        const activeTodos = todos.filter(todo => !todo.completed).length;
        todoCount.textContent = `${activeTodos} item${activeTodos !== 1 ? 's' : ''} left`;
    }

    function createTodoElement(todo) {
        const li = document.createElement('li');
        li.className = `todo-item ${todo.completed ? 'completed' : ''}`;
        li.innerHTML = `
            <input type="checkbox" class="todo-checkbox" ${todo.completed ? 'checked' : ''}>
            <span class="todo-text">${todo.text}</span>
            <button class="delete-btn">×</button>
        `;

        const checkbox = li.querySelector('.todo-checkbox');
        checkbox.addEventListener('change', () => {
            todo.completed = checkbox.checked;
            li.classList.toggle('completed', todo.completed);
            saveTodos();
            updateTodoCount();
            renderTodos();
        });

        const deleteBtn = li.querySelector('.delete-btn');
        deleteBtn.addEventListener('click', () => {
            todos = todos.filter(t => t !== todo);
            saveTodos();
            updateTodoCount();
            renderTodos();
        });

        return li;
    }

    function renderTodos() {
        todoList.innerHTML = '';
        let filteredTodos = todos;

        if (currentFilter === 'active') {
            filteredTodos = todos.filter(todo => !todo.completed);
        } else if (currentFilter === 'completed') {
            filteredTodos = todos.filter(todo => todo.completed);
        }

        filteredTodos.forEach(todo => {
            todoList.appendChild(createTodoElement(todo));
        });
    }

    addTodoBtn.addEventListener('click', () => {
        const text = todoInput.value.trim();
        if (text) {
            const todo = {
                text,
                completed: false,
                id: Date.now()
            };
            todos.push(todo);
            saveTodos();
            todoInput.value = '';
            updateTodoCount();
            renderTodos();
        }
    });

    todoInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            addTodoBtn.click();
        }
    });

    clearCompletedBtn.addEventListener('click', () => {
        todos = todos.filter(todo => !todo.completed);
        saveTodos();
        updateTodoCount();
        renderTodos();
    });

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentFilter = btn.dataset.filter;
            renderTodos();
        });
    });

    // Initial render
    updateTodoCount();
    renderTodos();
});
