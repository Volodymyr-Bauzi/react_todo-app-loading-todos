/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useState } from 'react';
import { UserWarning } from './UserWarning';
import { server, USER_ID } from './api/todos';
import { Todo } from './types/Todo';
import { ErrorMessage } from './types/error';
import cn from 'classnames';
import TodoList from './components/TodoList';
import { StatusFilter } from './types/statusFilter';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [status, setStatus] = useState<StatusFilter>(StatusFilter.All);
  const [query, setQuery] = useState('');
  const [showErrorNotification, setShowErrorNotification] = useState(false);
  const [errorMessage, setErrorMessage] = useState<ErrorMessage>(
    ErrorMessage.LoadingTodos,
  );

  const showError = (errorMsg: ErrorMessage) => {
    setErrorMessage(errorMsg);
    setShowErrorNotification(true);

    setTimeout(() => {
      setShowErrorNotification(false);
      setErrorMessage(ErrorMessage.Null);
    }, 4000);
  };

  useEffect(() => {
    setErrorMessage(ErrorMessage.Null);
    server
      .getTodos()
      .then(setTodos)
      .catch(() => showError(ErrorMessage.LoadingTodos));
  }, []);

  if (!USER_ID) {
    return <UserWarning />;
  }

  const handleChangeQuery = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };

  const filteredTodos = [...todos].filter(todo => {
    if (status !== StatusFilter.All) {
      if (status === StatusFilter.Completed) {
        return todo.completed;
      }

      return !todo.completed;
    }

    return todo;
  });

  const doneTodos = todos.filter(todo => !todo.completed);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          {todos.length > 0 && (
            <button
              type="button"
              className="todoapp__toggle-all active"
              data-cy="ToggleAllButton"
            />
          )}

          <form>
            <input
              data-cy="NewTodoField"
              type="text"
              className="todoapp__new-todo"
              placeholder="What needs to be done?"
              value={query}
              onChange={handleChangeQuery}
            />
          </form>
        </header>

        <section className="todoapp__main" data-cy="TodoList">
          <TodoList todos={filteredTodos} />
        </section>

        {todos.length > 0 && (
          <footer className="todoapp__footer" data-cy="Footer">
            <span className="todo-count" data-cy="TodosCounter">
              {doneTodos.length} items left
            </span>

            <nav className="filter" data-cy="Filter">
              <a
                href={`#/${StatusFilter.All}`}
                className={cn('filter__link', {
                  selected: status === StatusFilter.All,
                })}
                data-cy="FilterLinkAll"
                onClick={() => setStatus(StatusFilter.All)}
              >
                All
              </a>

              <a
                href={`#/${StatusFilter.Active}`}
                className={cn('filter__link', {
                  selected: status === StatusFilter.Active,
                })}
                data-cy="FilterLinkActive"
                onClick={() => setStatus(StatusFilter.Active)}
              >
                Active
              </a>

              <a
                href={`#/${StatusFilter.Completed}`}
                className={cn('filter__link', {
                  selected: status === StatusFilter.Completed,
                })}
                data-cy="FilterLinkCompleted"
                onClick={() => setStatus(StatusFilter.Completed)}
              >
                Completed
              </a>
            </nav>

            <button
              type="button"
              className="todoapp__clear-completed"
              data-cy="ClearCompletedButton"
            >
              Clear completed
            </button>
          </footer>
        )}
      </div>

      {/* DON'T use conditional rendering to hide the notification */}
      {/* Add the 'hidden' class to hide the message smoothly */}
      <div
        data-cy="ErrorNotification"
        className={cn(
          'notification is-danger is-light has-text-weight-normal',
          { hidden: !showErrorNotification },
        )}
      >
        <button
          data-cy="HideErrorButton"
          type="button"
          className="delete"
          onClick={() => setShowErrorNotification(false)}
        />
        {/* show only one message at a time */}
        {errorMessage}
      </div>
    </div>
  );
};
