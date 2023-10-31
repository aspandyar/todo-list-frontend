import {todoService} from "../core/todoService.mjs";


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
    const $confirm = $modal.find(".btn-primary");

    $confirm.click(() => {
        const title = $form.find("#title").val();
        const description = $form.find("#description").val();
        todoService.createList(title, description);
        eventListsChanged();

        // noinspection JSUnresolvedReference
        $modal.modal("toggle");
    });

    $confirm.mouseover(() => {
        $confirm.attr("title", "Click to confirm");
    })

    $close.mouseover(() => {
        $confirm.attr("title", "Click to close");
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
