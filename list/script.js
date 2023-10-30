import {todoService, priority} from "../core/todoService.mjs";


const getCurrentListId = () => {
    // http://localhost/list/index.html?listId=1
    const listId = Number.parseInt(
        new URLSearchParams(window.location.search).get("listId")
    );
    if (!listId) {
        window.location.href = "../lists/index.html";
    }
    return listId;
}
const eventTodosChanged = () => {
    document.dispatchEvent(new CustomEvent("custom:todosChanged"));
}


const listId = getCurrentListId();


$(() => {
    const list = getCurrentList();

    $("#list-name").text(list.name);
    $("#list-description").text(list.description);

    if (!list.todos.length) {
        // Create some todos for testing
        for (let i = 0; i < 5; i++) {
            todoService.addTodoToList(
                listId,
                `Todo ${i}`,
                `Description ${i}`,
                (new Date()).toISOString(),
                Math.floor(Math.random() * 3) + 1,
            );
        }
        eventTodosChanged();
    }

    renderTodos();
    document.addEventListener('custom:todosChanged', renderTodos);
})


const renderTodos = () => {
    const $todos = $("#todos");
    $todos.empty();
    todoService.getListById(listId).todos.forEach(todo => {
        $todos.append($(`
            <div class="todo">
                <h4>${todo.name}</h4>
                <p>${todo.description}</p>
                <p>Deadline: ${todo.deadline}</p>
                <p>Priority: ${priority[todo.priority]}</p>
            </div>
        `));
    });
}

const getCurrentList = () => {
    const list = todoService.getListById(listId);
    if (!list) {
        window.location.href = "../lists/index.html";
    }
    return list;
}
