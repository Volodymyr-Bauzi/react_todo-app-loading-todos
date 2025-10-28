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
import Footer from './components/Footer';

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

  const todosLeft = todos.filter(todo => !todo.completed).length;

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
          <Footer todosLeft={todosLeft} onStatusChange={setStatus} />
        )}
      </div>

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
        {errorMessage}
      </div>
    </div>
  );
};
