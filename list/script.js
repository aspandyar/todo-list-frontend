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

    $("#list-name").text(list.title);
    $("#list-description").text(list.description);

    renderTodos();
    document.addEventListener('custom:todosChanged', renderTodos);
})

let task_created = new Audio("../audio/task_created.mp3")

$(() => {
    const $modal = $("#addTodosModal");
    const $form = $modal.find("form");
    const $confirm = $modal.find(".btn-primary");
    const $close = $modal.find(".btn-secondary");

    $confirm.click(() => {
        const title = $form.find("#title").val();
        const description = $form.find("#description").val();
        const date = $form.find("#date").val();
        const priority = $form.find("#priority").val();
        console.log(title, description, date, priority)
        todoService.addTodoToList(listId, title, description, date, priority);
        eventTodosChanged();

        // noinspection JSUnresolvedReference
        $modal.modal("toggle");

        task_created.play()
    });

    $confirm.mouseover(() => {
        $confirm.attr("title", "Click to confirm");
    })

    $close.mouseover(() => {
        $confirm.attr("title", "Click to close");
    })

    // $("#text-input").keypress(function(event) {
    //     if (event.which == 13) { // 13 is the key code for Enter
    //       alert("Enter key pressed");
    //     }
    //   });
})

const renderTodos = () => {
    const $todos = $("#todos");
    $todos.empty();
    todoService.getListById(listId).todos.forEach(todo => {
        $todos.append($(`
            <div class="todo card bg-secondary p-3 mb-3 rounded-3">
                <h4>${todo.title}</h4>
                <p>${todo.description}</p>
                <p>Deadline: ${todo.deadline}</p>
                <p>Priority: ${priority[todo.priority]}</p>
                <div class="list-actions">
                    <button class="btn btn-danger btn-lg ms-1">Delete</button>
                </div>
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
