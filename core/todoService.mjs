/*
  Some notes:
  - deadline should be in format `YYYY-MM-DDTHH:mm:ss.sssZ` (e.g. `2020-12-31T23:59:59.000Z`)
    It can be loaded using: `new Date(deadline)`
    And then displayed using: `deadline.toLocaleString()`
  - to get date from form input use: `new Date(deadline.value)`
    Considering that form is something like this:
    ```html
     <form>
        <input id="deadline" type="datetime-local" />
     </form>
    ```
  - priority is a number from 1 to infinity
    1 is the highest priority

  - Some type hints as JS don't have them:
    listObject = {
        id: number,
        name: string,
        description: string,
        todos: todoObject[]
    }
    todoObject = {
        id: number,
        name: string,
        description: string,
        deadline: string,
        priority: number
    }
 */


class TodoService {
    constructor() {
        this.lists = JSON.parse(localStorage.getItem('lists')) || [];

        // Internal properties
        this._todoIdCounter = JSON.parse(localStorage.getItem('_todoIdCounter')) || 1;
        this._listIdCounter = JSON.parse(localStorage.getItem('_listIdCounter')) || 1;
    }

    createList(name, description) {
        const id = this._generateListId();
        const newList = {
            id,
            name,
            description,
            todos: []
        };
        this.lists.push(newList);
        this._save();

        return id;
    }

    getListById(id) {
        return this.lists.find(list => list.id === id);
    }

    addTodoToList(listId, name, description, deadline, priority) {
        const list = this.getListById(listId);
        const id = this._generateTodoId();
        if (!list) {
            return null;
        }

        const newTodo = {
            id,
            name,
            description,
            deadline,
            priority
        };
        list.todos.push(newTodo);
        this._save();

        return id;
    }

    getTodosSortedByDeadlinePriority(listId) {
        const list = this.getListById(listId);
        if (list) {
            return list.todos.slice().sort((a, b) => {
                if (a.deadline !== b.deadline) {
                    return a.deadline.localeCompare(b.deadline);
                } else {
                    return b.priority - a.priority;
                }
            });
        }
        return [];
    }

    getTodosSortedByPriorityDeadline(listId) {
        const list = this.getListById(listId);
        if (list) {
            return list.todos.slice().sort((a, b) => {
                if (a.priority !== b.priority) {
                    return b.priority - a.priority;
                } else {
                    return a.deadline.localeCompare(b.deadline);
                }
            });
        }
        return [];
    }


    // Internal methods
    _save() {
        // You don't have to manually call this method, it's called automatically
        localStorage.setItem('lists', JSON.stringify(this.lists));
        localStorage.setItem('todoIdCounter', this._todoIdCounter);
        localStorage.setItem('listIdCounter', this._listIdCounter);
    }

    _generateTodoId() {
        return this._todoIdCounter++;
    }

    _generateListId() {
        return this._listIdCounter++;
    }
}

export const todoService = new TodoService();
export const priority = {
    HIGH: 1,
    MEDIUM: 2,
    LOW: 3,
}
