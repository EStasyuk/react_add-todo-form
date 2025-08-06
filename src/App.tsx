import { title } from 'process';
import './App.scss';
import React, { useId, useImperativeHandle, useState } from 'react';


import usersFromServer from './api/users';
import todosFromServer from './api/todos';
import { TodoList } from './components/TodoList';

interface User {
  id: number;
  name: string;
  username: string;
  email: string;
}


interface Todo {
  id: number,
  title: string,
  userId: number,
  completed: boolean,
  user: User,
}

export const App = () => {
  const [title, setTitle] = useState('');
  const [userId , setUserId] = useState('');
  const [todos, setTodos] = useState<Todo[]>([]);
  const [titleError, setTitleError] = useState('');
  const [userError, setUserError] = useState('');
  const [completed, setCompleted] = useState(false);
  const handleUserIdChange = (event) => {
    setUserId(event.target.value);
  };

  const maxId = todos.reduce((max, todo) => Math.max(max, todo.id), 0);
  const users = usersFromServer;
  const foundUserCorrected = users.find(user => user.id === parseInt(userId, 10));

  

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!title) {
      setTitleError('Please enter a title');
    }
    if (!userId) {
        setUserError('Please enter a user');
    }
    if (title && userId) {
      const newTodo = {
      id: maxId,
      title: title,
      userId: Number(userId),
      completed: false,
      user: foundUserCorrected,
};
      setTodos((prevTodos) => [...prevTodos, newTodo]);
    }
    setTitle(''),
    setUserId(''),
    setCompleted(false)
  }

const isFulled = title.trim() !== '' && userId !== '';


  return (
    <div className="App">
      <h1>Add todo form</h1>

      <form action="/api/todos" method="POST" onSubmit={handleSubmit} >
        <div className="field">
          <input
            type="text"
            data-cy="titleInput"
            value={title}
            onChange={event => {
              setTitle(event.target.value);
              setTitleError('');
            }}
          />
          {titleError && <span className="error">{titleError}</span>}
          {userError && <span className="error">{userError}</span>}

        </div>

        <div className="field">
          <select data-cy="userSelect"
             value={userId}
             onChange={handleUserIdChange}>
            <option value="" disabled selected>
              Choose a user
            </option>
            {usersFromServer.map((user) => (
              <option key={user.id} value={user.id}>
                {user.name}
              </option>
           ))}
          </select>

          <span className="error">Please choose a user</span>
        </div>

        <button
          type="submit"
          data-cy="submitButton"
          disabled={!isFulled}
          >
          Add
        </button>
      </form>

      <TodoList todos={todos} />
    </div>
  );
};
