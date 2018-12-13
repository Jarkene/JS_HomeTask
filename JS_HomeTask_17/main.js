Vue.component('todo', {
    template: `
        <div class="todo">
        <span>{{ content }}</span>
        <div>
            <button @click="editTodo">edit</button>
            <button @click="removeTodo">x</button>
        </div>
        </div>
    `,
    methods: {
        editTodo() {
            this.$emit('edit-todo');
        },
        removeTodo() {
            this.$emit('remove-todo');
        }
    },
    props: ['content']
})

Vue.component('todo-list', {
    template: `
        <div class="todo-list">
            <h1>{{ list.title }}</h1>
            <div class="main-input__button-set">
                <button @click="removeList">Удалить</button>
                <button @click="renameList">Редактировать</button>
            </div>
            <div class="app__todo-input">
                <input v-model="todoInput" type="text" class="input">
                <button v-if="!editManager.isEdit" @click="addTodo">Добавить</button>
                <button v-else @click="editTodo">Изменить</button>
            </div>
            <todo 
                v-for="(todo) in list.data" 
                :content="todo" 
                @remove-todo="removeTodo(todo)" 
                @edit-todo="toggleAddingInput(todo)">
            </todo>
        </div>
    `,
    data() {
        return {
            todoInput: '',
            editManager: {
                isEdit: false,
                text: ''
            }
        }
    },
    methods: {
        removeList() {
            this.$emit("remove-list");
        },
        renameList() {
            this.$emit("rename-list");
        },
        addTodo() {
            if (!this.list.data) this.list.data = [];
            this.list.data.push(this.todoInput);
            this.todoInput = '';
            this.$emit("add-todo", this.list);
        },
        toggleAddingInput(todo) {
            this.editManager.isEdit = true;
            this.editManager.text = todo;
            this.todoInput = todo;
        },
        editTodo() {
            const index = this.list.data.findIndex(todo => todo == this.editManager.text);
            this.list.data[index] = this.todoInput;
            this.editManager.isEdit = false;
            this.todoInput = '';
            this.$emit("edit-todo", this.list);
        },
        removeTodo(todoToRemove) {
            const index = this.list.data.findIndex(todo => todo == todoToRemove);
            this.list.data.splice(index, 1);
            this.$emit("remove-todo", this.list);
        }
    },
    props: ['list']
})

new Vue({
    el: '#app',
    data: {
        listInput: '',
        database: firebase.database().ref('todo-lists/'),
        todoLists: [],
        editManager: {
            isEdit: false,
            text: ''
        }
    },
    created() {
        this.loadData();
    },
    methods: {
        isListNameValid() {
            if (this.todoLists.some(list => list.title == this.listInput)) {
                return false;
            }
            if (this.listInput == '') {
                return false;
            }
            return true;
        },
        addTodoList() {
            this.todoLists.push({ title: this.listInput });
            this.reloadDatabase();
        },
        removeList(listToRemove) {
            this.todoLists = this.todoLists.filter(list => list.title != listToRemove.title);
            this.reloadDatabase();
        },
        toggleAddingInput(listToRename) {
            this.listInput = listToRename.title;
            this.editManager.text = listToRename.title;
            this.editManager.isEdit = true;
        },
        renameList() {
            // if (!this.isListNameValid()) {
            //     alert('Поле ввода пустое либо такое название уже есть!');
            //     return;
            // }
            this.todoLists.filter(list => list.title == this.editManager.text)[0].title = this.listInput;
            this.reloadDatabase();
        },
        addTodo(listToAdd) {
            this.todoLists.filter(list => list.title == listToAdd.title)[0] = listToAdd;
            this.reloadDatabase();
        },
        editTodo(listToEdit) {
            this.todoLists.filter(list => list.title == listToEdit.title)[0] = listToEdit;
            this.reloadDatabase();
        },
        removeTodo(listToRemove) {
            this.todoLists.filter(list => list.title == listToRemove.title)[0] = listToRemove;
            this.reloadDatabase();
        },
        loadData() {
            const app = this;
            this.database.on('value', function (snapshot) {
                if (snapshot.val()) app.todoLists = snapshot.val();
            });
        },
        reloadDatabase() {
            const app = this;
            this.database.remove();
            this.database.set(this.todoLists).then(() => {
                app.loadData();
                app.listInput = '';
                app.editManager = {
                    isEdit: false,
                    text: ''
                }
            });
        }
    }
})