import {todoService} from "../core/todoService.mjs";
import {success, error_sound, bong, task_created} from "../core/root.js"

const eventListsChanged = () => {
    document.dispatchEvent(new CustomEvent("custom:listsChanged"));
}


$(() => {
    // It is the same as $(document).ready(function() { ... });
    // This block will be executed once the page has been loaded
    // Some kind of unnecessary code, when the script tag is at the end of the body

    renderLists();
    document.addEventListener('custom:listsChanged', renderLists);
})

$(() => {
    const $modal = $("#addListModal");
    const $form = $modal.find("form");
    const $title = $form.find("#title");
    const $description = $form.find("#description");
    const $confirm = $modal.find(".btn-primary");

    $modal.on("hidden.bs.modal", () => {
        $form.trigger("reset");
        $title.removeClass("is-invalid");
        $description.removeClass("is-invalid");
    });
    $title.on("input", () => $title.removeClass("is-invalid"));
    $description.on("input", () => $description.removeClass("is-invalid"));

    $modal.keypress(function (event) {
        let keycode = (event.keyCode ? event.keyCode : event.which);
        if (keycode == '13'&& event.ctrlKey) {        
            const title = $title.val();
            let isValid = true;
            if (!title) {
                $title.addClass("is-invalid");
                isValid = false;
            }
        
            const description = $description.val();
            if (!description) {
                $description.addClass("is-invalid");
                isValid = false;
            }
        
            if (!isValid) {
                error_sound.play();
                return;
            }
        
            todoService.createList(title, description);
            eventListsChanged();
        
            // noinspection JSUnresolvedReference
            $modal.modal("toggle");
            task_created.play();
        }
        event.stopPropagation();
    });

    $confirm.click(() => {
        const title = $title.val();
        let isValid = true;
        if (!title) {
            $title.addClass("is-invalid");
            isValid = false;
        }

        const description = $description.val();
        if (!description) {
            $description.addClass("is-invalid");
            isValid = false;
        }

        if (!isValid) {
            error_sound.play();
            return;
        }

        todoService.createList(title, description);
        eventListsChanged();

        // noinspection JSUnresolvedReference
        $modal.modal("toggle");
        task_created.play();
    });

    $confirm.mouseover(() => {
        $confirm.attr("title", "Click to confirm");
    })
})


const renderLists = () => {
    const $lists = $("#lists");
    $lists.empty();

    if (!todoService.lists.length) {
        $lists.append(`
            <div class="list p-3 mb-3 rounded-3">
                <h3 class="list-name">No lists</h3>
                <p class="list-description">Create a new list</p>
            </div>
        `);
        return;
    }

    todoService.lists.forEach(list => {
        const $list = $(`
            <div class="list p-3 mb-3 rounded-3">
                <h3 class="list-name">${list.title}</h3>
                <p class="list-description">${list.description}</p>
                <div class="list-actions">
                    <a href="../list/index.html?listId=${list.id}" class="btn btn-primary btn-lg">
                        Open
                    </a>
                    <button class="btn btn-danger btn-lg ms-1">Delete</button>
                </div>
            </div>
        `);

        $list.find('.btn-danger').click(() => {
            todoService.deleteList(list.id);
            eventListsChanged();
        });

        $("#lists").append($list);
    });
}

// using snippter

let mybutton = document.getElementById("myBtn");

// When the user scrolls down 20px from the top of the document, show the button
window.onscroll = function() {scrollFunction()};

function scrollFunction() {
  if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
    mybutton.style.display = "block";
  } else {
    mybutton.style.display = "none";
  }
}

// When the user clicks on the button, scroll to the top of the document
function topFunction() {
  document.body.scrollTop = 0; // For Safari
  document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
} 
