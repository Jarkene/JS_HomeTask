window.onload = function () {

    Vue.component('todo-list', {
        template: `
            <div class="todo-list">
                <h1>{{ listname }}</h1>
                <div class="main-input__button-set">
                    <button @click="removeList">delete</button>
                </div>
                <div class="app__main-input">
                    <input v-model="text" type="text" class="input">
                    <button v-if="!editManager.status" @click="addTodo">add todo</button>
                    <button v-else @click="editTodo">edit</button>
                </div>
                <todo v-for="(todo) in todos" :content="todo.text" @remove-todo="remove(todo.id)" @edit-todo="edit(todo.text)"></todo>
            </div>
        `,
        data() {
            return {
                editManager: {
                    status: false,
                    todo: null
                },
                curID: 0,
                emptyIDs: [], // used to fill up spaces in db
                text: "",
                todos: []  // {text, id}
            }
        },
        created() {
            this.fetchTodos()
            console.log(this.listname);
        },
        methods: {
            removeList() {
                this.$emit("remove-list");
            },
            editTodo() {
                const app = this;
                var todoToChange = this.todos.filter(todo => {
                    return todo.text == this.editManager.todo;
                })[0];

                firebase.database().ref('todos/' + `${this.listname}/` + `${todoToChange.id}`).set({
                    text: app.text,
                    id: todoToChange.id
                });
                this.resetData();
                this.fetchTodos();
            },
            edit(content) {
                this.text = content;
                this.editManager.status = true;
                this.editManager.todo = content;
            },
            remove(id) {
                firebase.database().ref('todos/' + `${this.listname}/` + `${id}`).remove();
                this.emptyIDs.push(id);
            },
            resetData() {
                this.text = "";
                this.editManager = {
                    status: false,
                    todo: null
                }
            },
            addTodo() {
                const app = this;
                var idToAdd = this.emptyIDs.length ? this.emptyIDs.sort((a, b) => a - b)
                    .shift() : ++this.curID;

                console.log(this.listname);

                firebase.database().ref('todos/' + `${this.listname}/` + `${idToAdd}`).set({
                    text: app.text,
                    id: idToAdd
                }).then(() => {
                    app.fetchTodos();
                });
                this.resetData();
            },
            fetchTodos() {
                const app = this;
                firebase.database().ref('todos/' + `${this.listname}`).on('value', function (snapshot) {
                    app.todos = [];
                    snapshot.forEach(function (childSnapshot) {
                        app.todos.push({
                            text: childSnapshot.val()['text'],
                            id: childSnapshot.val()['id']
                        });
                    });
                    app.curID = app.todos.length ? Math.max.apply(null, app.todos.map(todo => +todo['id'])) : 0;
                })
            },
        },
        props: ["listname"]
    })

    Vue.component('todo', {
        template: `
            <div class="todo">
            <span>{{ content }}</span>
            <div>
                <button @click="edit">edit</button>
                <button @click="remove">x</button>
            </div>
            </div>
        `,
        methods: {
            edit() {
                this.$emit("edit-todo", this.content)
            },
            remove() {
                this.$emit("remove-todo")
            }
        },
        props: ["content"]
    })

    new Vue({
        el: "#app",
        data: {
            lists: [],
            listsText: '',
            listsEditManager: {
                status: false,
                todo: null
            }
        },
        created() {
            this.fetchLists();
        },
        methods: {
            addList() {
                this.lists.push(this.listsText);
            },
            removeList(name) {
                firebase.database().ref('todos/' + `${name}`).remove();
                this.fetchLists();
            },
            fetchLists() {
                var app = this;
                firebase.database().ref('todos/').on('value', function (snapshot) {
                    app.lists = Object.keys(snapshot.val()).map(key => {
                        return key;
                    });
                })
            }
        }
    })
}