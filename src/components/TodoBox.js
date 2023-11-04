import * as React from 'react';

const TodoBox = React.memo(({ todos, onCheck, onRemove, onEdit }) => {
  return <ul className="list-group">
    {todos.map(todo => (
      <li key={todo.id} className="list-group-item" style={{
        display: 'flex', alignItems: 'center',
        background: todo.completed ? '#9ad5ff' : 'none'
      }}>
        <input
          className="form-check-input me-3"
          type="checkbox"
          checked={todo.completed}
          onChange={() => onCheck(todo.id, !todo.completed)}
        />
        <span style={{ flex: 1 }}>{todo.text}</span>
        <button
          className="fa fa-edit"
          style={{ background: 'none', border: 'none' }}
          onClick={() => onEdit(todo.id)}
        />
        <button
          className="fa fa-times"
          style={{ background: 'none', border: 'none' }}
          onClick={() => onRemove(todo.id)}
        />
      </li>
    ))}
  </ul>
});

export default TodoBox;
