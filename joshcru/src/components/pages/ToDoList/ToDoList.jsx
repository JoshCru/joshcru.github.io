import React from  'react';
import Todo from "./ToDo";


function ToDoList(props) {
  
  const taskList = props.tasks?.map((task) => (
    <Todo
      id={task.id}
      name={task.name}
      completed={task.completed}
      key={task.id}
    />
  ));

  return (
    <React.Fragment>
      <style>{`
        /* Resets */
        *,
        *::before,
        *::after {
          box-sizing: border-box;
        }
        *:focus-visible {
          outline: 3px dashed #228bec;
          outline-offset: 0;
        }
        html {
          font: 62.5% / 1.15 sans-serif;
        }
        h1,
        h2 {
          margin-bottom: 0;
        }
        ul {
          list-style: none;
          padding: 0;
        }
        button {
          -moz-osx-font-smoothing: inherit;
          -webkit-font-smoothing: inherit;
          appearance: none;
          background: transparent;
          border: none;
          color: inherit;
          font: inherit;
          line-height: normal;
          margin: 0;
          overflow: visible;
          padding: 0;
          width: auto;
        }
        button::-moz-focus-inner {
          border: 0;
        }
        button,
        input,
        optgroup,
        select,
        textarea {
          font-family: inherit;
          font-size: 100%;
          line-height: 1.15;
          margin: 0;
        }
        button,
        input {
          overflow: visible;
        }
        input[type="text"] {
          border-radius: 0;
        }
        body {
          background-color: #f5f5f5;
          color: #4d4d4d;
          font:
            1.6rem/1.25 Arial,
            sans-serif;
          margin: 0 auto;
          max-width: 68rem;
          width: 100%;
        }
        @media screen and (min-width: 620px) {
          body {
            font-size: 1.9rem;
            line-height: 1.31579;
          }
        }
        /* End resets */
        /* Global styles */
        .form-group > input[type="text"] {
          display: inline-block;
          margin-top: 0.4rem;
        }
        .btn {
          border: 0.2rem solid #4d4d4d;
          cursor: pointer;
          padding: 0.8rem 1rem 0.7rem;
          text-transform: capitalize;
        }
        .btn.toggle-btn {
          border-color: #d3d3d3;
          border-width: 1px;
        }
        .btn.toggle-btn[aria-pressed="true"] {
          border-color: #4d4d4d;
          text-decoration: underline;
        }
        .btn__danger {
          background-color: #ca3c3c;
          border-color: #bd2130;
          color: #fff;
        }
        .btn__filter {
          border-color: lightgrey;
        }
        .btn__primary {
          background-color: #000;
          color: #fff;
        }
        .btn-group {
          display: flex;
          justify-content: space-between;
        }
        .btn-group > * {
          flex: 1 1 49%;
        }
        .btn-group > * + * {
          margin-left: 0.8rem;
        }
        .label-wrapper {
          flex: 0 0 100%;
          margin: 0;
          text-align: center;
        }
        .visually-hidden {
          clip: rect(1px 1px 1px 1px);
          clip: rect(1px, 1px, 1px, 1px);
          height: 1px;
          overflow: hidden;
          position: absolute !important;
          white-space: nowrap;
          width: 1px;
        }
        [class*="stack"] > * {
          margin-bottom: 0;
          margin-top: 0;
        }
        .stack-small > * + * {
          margin-top: 1.25rem;
        }
        .stack-large > * + * {
          margin-top: 2.5rem;
        }
        @media screen and (min-width: 550px) {
          .stack-small > * + * {
            margin-top: 1.4rem;
          }
          .stack-large > * + * {
            margin-top: 2.8rem;
          }
        }
        .stack-exception {
          margin-top: 1.2rem;
        }
        /* End global styles */
        /* General app styles */
        .todoapp {
          background: #fff;
          box-shadow:
            0 2px 4px 0 rgb(0 0 0 / 20%),
            0 2.5rem 5rem 0 rgb(0 0 0 / 10%);
          margin: 2rem 0 4rem 0;
          padding: 1rem;
          position: relative;
        }
        @media screen and (min-width: 550px) {
          .todoapp {
            padding: 4rem;
          }
        }
        .todoapp > * {
          margin-left: auto;
          margin-right: auto;
          max-width: 50rem;
        }
        .todoapp > form {
          max-width: 100%;
        }
        .todoapp > h1 {
          display: block;
          margin: 0;
          margin-bottom: 1rem;
          max-width: 100%;
          text-align: center;
        }
        .label__lg {
          line-height: 1.01567;
          font-weight: 300;
          margin-bottom: 1rem;
          padding: 0.8rem;
          text-align: center;
        }
        .input__lg {
          border: 2px solid #000;
          padding: 2rem;
        }
        .input__lg:focus-visible {
          border-color: #4d4d4d;
          box-shadow: inset 0 0 0 2px;
        }
        [class*="__lg"] {
          display: inline-block;
          font-size: 1.9rem;
          width: 100%;
        }
        [class*="__lg"]:not(:last-child) {
          margin-bottom: 1rem;
        }
        @media screen and (min-width: 620px) {
          [class*="__lg"] {
            font-size: 2.4rem;
          }
        }
        /* End general app styles */
        /* Todo item styles */
        .todo {
          display: flex;
          flex-direction: row;
          flex-wrap: wrap;
        }
        .todo > * {
          flex: 0 0 100%;
        }
        .todo-text {
          border: 2px solid #565656;
          min-height: 4.4rem;
          padding: 0.4rem 0.8rem;
          width: 100%;
        }
        .todo-text:focus-visible {
          box-shadow: inset 0 0 0 2px;
        }
        /* End todo item styles */
        /* Checkbox styles */
        .c-cb {
          -webkit-font-smoothing: antialiased;
          box-sizing: border-box;
          clear: left;
          display: block;
          font-family: Arial, sans-serif;
          font-size: 1.6rem;
          font-weight: 400;
          line-height: 1.25;
          min-height: 44px;
          padding-left: 40px;
          position: relative;
        }
        .c-cb > label::before,
        .c-cb > input[type="checkbox"] {
          box-sizing: border-box;
          height: 44px;
          left: -2px;
          top: -2px;
          width: 44px;
        }
        .c-cb > input[type="checkbox"] {
          -webkit-font-smoothing: antialiased;
          cursor: pointer;
          margin: 0;
          opacity: 0;
          position: absolute;
          z-index: 1;
        }
        .c-cb > label {
          cursor: pointer;
          display: inline-block;
          font-family: inherit;
          font-size: inherit;
          line-height: inherit;
          margin-bottom: 0;
          padding: 8px 15px 5px;
          touch-action: manipulation;
        }
        .c-cb > label::before {
          background: transparent;
          border: 2px solid currentcolor;
          content: "";
          position: absolute;
        }
        .c-cb > input[type="checkbox"]:focus-visible + label::before {
          border-width: 4px;
          outline: 3px dashed #228bec;
        }
        .c-cb > label::after {
          background: transparent;
          border: solid;
          border-width: 0 0 5px 5px;
          border-top-color: transparent;
          box-sizing: content-box;
          content: "";
          height: 7px;
          left: 9px;
          opacity: 0;
          position: absolute;
          top: 11px;
          transform: rotate(-45deg);
          width: 18px;
        }
        .c-cb > input[type="checkbox"]:checked + label::after {
          opacity: 1;
        }
        /* End checkbox styles */
        
      `}
      </style>
      <div className="todoapp stack-large">
        <h1>TodoMatic</h1>
        <form>
          <h2 className="label-wrapper">
            <label htmlFor="new-todo-input" className="label__lg">
              What needs to be done?
            </label>
          </h2>
          <input
            type="text"
            id="new-todo-input"
            className="input input__lg"
            name="text"
            autoComplete="off"
          />
          <button type="submit" className="btn btn__primary btn__lg">
            Add
          </button>
        </form>
        <div className="filters btn-group stack-exception">
          <button type="button" className="btn toggle-btn" aria-pressed="true">
            <span className="visually-hidden">Show </span>
            <span>all</span>
            <span className="visually-hidden"> tasks</span>
          </button>
          <button type="button" className="btn toggle-btn" aria-pressed="false">
            <span className="visually-hidden">Show </span>
            <span>Active</span>
            <span className="visually-hidden"> tasks</span>
          </button>
          <button type="button" className="btn toggle-btn" aria-pressed="false">
            <span className="visually-hidden">Show </span>
            <span>Completed</span>
            <span className="visually-hidden"> tasks</span>
          </button>
        </div>
        <h2 id="list-heading">3 tasks remaining</h2>
        <ul
          className="todo-list stack-large stack-exception"
          aria-labelledby="list-heading">
          {taskList}
        </ul>
      </div>
    </React.Fragment>
  )
}

export default ToDoList;