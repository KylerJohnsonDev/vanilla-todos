function main() {
  new TodoApp();
}

class TodoApp {
  localStorageKey = "todos";
  todoInputEl;
  todoContainerEl;
  todoCountEl;

  constructor() {
    this.initializeApp();
  }

  initializeApp() {
    // <input class="todo-input" />
    this.todoInputEl = document.createElement("input");
    this.todoInputEl.classList.add("todo-input");
    this.todoInputEl.placeholder = "Enter a todo and press enter...";
    this.todoInputEl.addEventListener("keydown", (event) => {
      if (event.key === "Enter") {
        this.addTodo(event.target.value, false);
      }
    });

    // <ul class="todo-container"></ul>
    this.todoContainerEl = document.createElement("ul");
    this.todoContainerEl.classList.add("todo-container");

    // <div class="counts"></div>
    this.todoCountEl = document.createElement("div");
    this.todoCountEl.classList.add("counts");

    document.body.append(
      this.todoInputEl,
      this.todoContainerEl,
      this.todoCountEl
    );
    this.updateCounts();
    this.loadTodos();
  }

  loadTodos() {
    const todosJson = window.localStorage.getItem(this.localStorageKey);
    if (todosJson) {
      const todosArr = JSON.parse(todosJson);
      todosArr.forEach(({ text, isComplete }) => {
        this.addTodo(text, isComplete);
      });
    }
  }

  syncTodos() {
    const todoItemEls = [...document.querySelectorAll(".todo-item")];
    const todoItems = todoItemEls.map((el) => {
      const text = el.querySelector("span").textContent;
      const isComplete = el.classList.contains("complete");
      return { text, isComplete };
    });
    window.localStorage.setItem(
      this.localStorageKey,
      JSON.stringify(todoItems)
    );
  }

  addTodo(text, isComplete) {
    if (text) {
      const todoItemEl = document.createElement("li");
      todoItemEl.classList.add("todo-item");
      if (isComplete) {
        todoItemEl.classList.add("complete");
      }
      todoItemEl.innerHTML = `<span>${text}</span>`;

      // when todo item is clicked, we want to toggle the status
      todoItemEl.addEventListener("click", () => {
        todoItemEl.classList.toggle("complete");
        this.updateCounts();
        this.syncTodos();
      });

      const deleteButtonEl = document.createElement("button");
      deleteButtonEl.classList.add("delete-btn");
      deleteButtonEl.innerHTML = "X";
      deleteButtonEl.addEventListener("click", () => {
        todoItemEl.remove();
      });
      todoItemEl.appendChild(deleteButtonEl);
      this.todoContainerEl.append(todoItemEl);
      this.todoInputEl.value = "";
      this.updateCounts();
      this.syncTodos();
    }
  }

  updateCounts() {
    const todoCount = this.todoContainerEl.children.length;
    const completeCount = this.todoContainerEl.querySelectorAll(
      ".todo-item.complete"
    ).length;
    this.todoCountEl.innerHTML = `${completeCount} / ${todoCount} complete`;
  }
}
