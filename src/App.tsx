import './App.css';
import '@modules/todomvc-app-css/index.css';
import {
  useStarbeam,
  Cell,
  ReactiveElement,
  Resource,
  reactive,
} from './vendor/starbeam-react.js';
import { FormEvent, ReactElement } from 'react';
import classNames from 'classnames';
import { formData } from './utils';
import { active, all, completed, Router, TodoItem } from './router';
import { Todo } from './components/Todo';

function App() {
  return useStarbeam((component: ReactiveElement) => {
    const handler = component.use(Router);

    let ID = 0;

    const allTodos: Set<TodoItem> = reactive.Set();

    allTodos.add(
      reactive.object({
        id: String(ID++),
        label: 'Buy a unicorn',
        completed: false,
      })
    );

    allTodos.add(
      reactive.object({
        id: String(ID++),
        label: 'Taste JavaScript',
        completed: true,
      })
    );

    function todos() {
      return handler
        .current([...allTodos])
        .sort((a, b) => Number(b.id) - Number(a.id));
    }

    function destroyTodo(todo: TodoItem) {
      allTodos.delete(todo);
    }

    function addTodo(event: FormEvent<HTMLFormElement>) {
      event.preventDefault();
      const { label } = formData<{ label: string }>(event.currentTarget);
      allTodos.add(
        reactive.object({ id: String(ID++), label, completed: false })
      );
      event.currentTarget.reset();
    }

    function clearCompleted() {
      for (const todo of allTodos) {
        if (todo.completed) {
          allTodos.delete(todo);
        }
      }
    }

    function count() {
      const total = allTodos.size;
      const activeCount = active([...allTodos]).length;

      if (total === activeCount) {
        return `${total} active`;
      } else {
        return `${activeCount} active / ${total} total`;
      }
    }

    // setupRouter();

    component.on.cleanup(() => null);

    return (): ReactElement => (
      <>
        <section className="todoapp">
          <header className="header">
            <h1>todos</h1>
            <form onSubmit={addTodo}>
              <input
                className="new-todo"
                name="label"
                placeholder="What needs to be done?"
                autoFocus
              />
            </form>
          </header>
          {/* This section should be hidden by default and shown when there are todos */}
          <section className="main">
            <input id="toggle-all" className="toggle-all" type="checkbox" />
            <label htmlFor="toggle-all">Mark all as complete</label>
            <ul className="todo-list">
              {todos().map((todo) => (
                <Todo
                  key={todo.id}
                  todo={todo}
                  destroy={() => destroyTodo(todo)}
                />
              ))}
            </ul>
          </section>
          {/* This footer should be hidden by default and shown when there are todos */}
          <footer className="footer">
            {/* This should be `0 items left` by default */}
            <span className="todo-count">
              <strong>{count()}</strong>
            </span>
            {/* Remove this if you don't implement routing */}
            <ul className="filters">
              <li>
                <a
                  className={classNames({
                    selected: handler.current === all,
                  })}
                  href="#/"
                >
                  All
                </a>
              </li>
              <li>
                <a
                  href="#/active"
                  className={classNames({
                    selected: handler.current === active,
                  })}
                >
                  Active
                </a>
              </li>
              <li>
                <a
                  href="#/completed"
                  className={classNames({
                    selected: handler.current === completed,
                  })}
                >
                  Completed
                </a>
              </li>
            </ul>
            {/* Hidden if no completed items are left ↓ */}
            <button className="clear-completed" onClick={clearCompleted}>
              Clear completed
            </button>
          </footer>
        </section>
        <footer className="info">
          <p>Double-click to edit a todo</p>
          {/* Remove the below line ↓ */}
          <p>
            Template by <a href="http://sindresorhus.com">Sindre Sorhus</a>
          </p>
          {/* Change this out with your name and url ↓ */}
          <p>
            Created by <a href="http://todomvc.com">you</a>
          </p>
          <p>
            Part of <a href="http://todomvc.com">TodoMVC</a>
          </p>
        </footer>
      </>
    );
  });
}

export default App;
