import {todoService, priority} from "../core/todoService.mjs";
import {success, error_sound, bong, task_created} from "../core/root.js"

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

$(() => {
    const $modal = $("#addTodosModal");
    const $form = $modal.find("form");
    const $confirm = $modal.find(".btn-primary");

    $modal.keypress(function (event) {
        let keycode = (event.keyCode ? event.keyCode : event.which);
        if (keycode == '13' && event.ctrlKey) {
            const title = $form.find("#title").val();
            const description = $form.find("#description").val();
            const date = $form.find("#date").val();
            const priority = $form.find("#priority").val();
            todoService.addTodoToList(listId, title, description, date, priority);
            eventTodosChanged();

            // noinspection JSUnresolvedReference
            $modal.modal("toggle");

            task_created.play()
        }
        event.stopPropagation();
    });

    const $title = $form.find("#title");
    const $description = $form.find("#description");
    const $deadline = $form.find("#deadline");
    const $priority = $form.find("#priority");

    $modal.on("hidden.bs.modal", () => {
        $form.trigger("reset");
        $title.removeClass("is-invalid");
        $description.removeClass("is-invalid");
        $deadline.removeClass("is-invalid");
        $priority.removeClass("is-invalid");
    });
    $title.on("input", () => $title.removeClass("is-invalid"));
    $description.on("input", () => $description.removeClass("is-invalid"));
    $deadline.on("input", () => $deadline.removeClass("is-invalid"));

    $confirm.click(() => {
        const title = $title.val();
        const description = $description.val();
        const deadline = $deadline.val();
        const priority = $priority.val();

        let isValid = true;
        if (!title) {
            $title.addClass("is-invalid");
            isValid = false;
        }
        if (!description) {
            $description.addClass("is-invalid");
            isValid = false;
        }
        if (!deadline) {
            $deadline.addClass("is-invalid");
            isValid = false;
        }

        if (!isValid) {
            // TODO: play sound
            // TODO: show alert
            return;
        }

        todoService.addTodoToList(listId, title, description, deadline, priority);
        eventTodosChanged();

        // noinspection JSUnresolvedReference
        $modal.modal("toggle");

        task_created.play().then();
    });

    $confirm.mouseover(() => {
        $confirm.attr("title", "Click to confirm");
    })

    $close.mouseover(() => {
        $close.attr("title", "Click to close");
    })
})

const renderTodos = () => {
    const $todos = $("#todos");
    $todos.empty();
    todoService.getListById(listId).todos.forEach(todo => {
        const $todo = $(`
            <div class="todo card bg-secondary p-3 mb-3 rounded-3">
                <h4>${todo.title}</h4>
                <p>${todo.description}</p>
                <p>Deadline: ${todo.deadline}</p>
                <p>Priority: ${priority[todo.priority]}</p>
                <div class="list-actions">
                    <button class="btn btn-danger btn-lg ms-1">Delete</button>
                </div>
            </div>
        `);

        $todo.find(".btn-danger").click(() => {
            // TODO: play sound
            todoService.deleteTodoFromList(listId, todo.id);
            eventTodosChanged();
        });

        $todos.append($todo);
    });
}

const getCurrentList = () => {
    const list = todoService.getListById(listId);
    if (!list) {
        window.location.href = "../lists/index.html";
    }
    return list;
}
