import {todoService} from "../core/todoService.mjs";

$(() => {
    // It is the same as $(document).ready(function() { ... });
    // This block will be executed once the page has been loaded
    // Some kind of unnecessary code, when the script tag is at the end of the body
    $(".flex-grow-1").css("background-color", "red");
})
