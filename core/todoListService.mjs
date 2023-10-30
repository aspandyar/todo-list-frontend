class TodoListService {
    constructor() {
        this.lists = JSON.parse(localStorage.getItem('lists')) || [];
        this.todoIdCounter = JSON.parse(localStorage.getItem('todoIdCounter')) || 1;
        this.listIdCounter = JSON.parse(localStorage.getItem('listIdCounter')) || 1;
    }

    save() {
        localStorage.setItem('lists', JSON.stringify(this.lists));
        localStorage.setItem('todoIdCounter', this.todoIdCounter);
        localStorage.setItem('listIdCounter', this.listIdCounter);
    }

    generateTodoId() {
        return this.todoIdCounter++;
    }

    generateListId() {
        return this.listIdCounter++;
    }

    createList(name, description) {
        const id = this.generateListId();
        const newList = {
            id,
            name,
            description,
            todos: []
        };
        this.lists.push(newList);
        this.save();

        return id;
    }

    getListById(id) {
        return this.lists.find(list => list.id === id);
    }

    addTodoToList(listId, name, description, deadline, priority) {
        const list = this.getListById(listId);
        const id = this.generateTodoId();
        if (!list) {
            return null;
        }

        const newTodo = {
            id: id,
            name,
            description,
            deadline,
            priority
        };
        list.todos.push(newTodo);
        this.save();

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
}

export const todoService = new TodoListService();
