import './App.css';
import * as React from 'react';
import { useState, useEffect, useMemo } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import '@fortawesome/fontawesome-free/css/solid.css';
import '@fortawesome/fontawesome-free/css/fontawesome.css';

import { Button, Modal, Form } from 'react-bootstrap';
import TodoBox from './components/TodoBox';

function App() {
  const [input, setInput] = useState('');
  const [filter, setFilter] = useState('all');
  const [todos, setTodos] = useState([]);
  const [show, setShow] = useState(false);
  const [todo, setTodo] = useState({ text: '' });

  useEffect(() => {
    const _todos = JSON.parse(localStorage.getItem("_todos"));
    if (_todos) {
      setTodos(_todos);
    }
  }, []);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleSaveEdit = () => {
    let _todos = JSON.parse(localStorage.getItem("_todos"));
    if (_todos) {
      const _todosDetail = _todos.find((item => item.id === todo.id));
      if (_todosDetail && _todosDetail.completed) {
        const _todosIndex = _todos.findIndex((item => item.id === todo.id));
        _todos[_todosIndex].text = todo.text;
        localStorage.setItem("_todos", JSON.stringify(_todos));
      }
    }

    const todoIndex = todos.findIndex((item => item.id === todo.id));
    todos[todoIndex].text = todo.text;
    setTodos(todos);
    setShow(false);
  };

  const onChangeTaskName = (e) => {
    setTodo({ ...todo, text: e.target.value });
  };

  const sortSeqNo = (data) => {
    return data.sort((a, b) => {
      if (a.seqNo > b.seqNo)
        return -1;
      if (a.seqNo < b.seqNo)
        return 1;
      return 0;
    });
  }
  const checkTodo = (id, completed) => {
    if (completed) {
      let _todos = JSON.parse(localStorage.getItem("_todos"));
      let newList = [];
      let itemFromFind = todos.find(item => item.id === id);
      itemFromFind.completed = completed;
      if (_todos) {
        newList = [..._todos, itemFromFind];
      }
      else {
        newList.push(itemFromFind);
      }
      newList = sortSeqNo(newList);

      localStorage.setItem("_todos", JSON.stringify(newList));
    }
    else {
      let _todos = JSON.parse(localStorage.getItem("_todos"));
      let todosIndex = _todos.findIndex(item => item.id === id);
      _todos.splice(todosIndex, 1);
      _todos = sortSeqNo(_todos);
      localStorage.setItem("_todos", JSON.stringify(_todos));
    }
    setTodos(todos.map(item => item.id !== id ? item : { ...item, completed }));
  };

  const onSubmit = (e) => {
    e.preventDefault();

    if (!input.trim()) {
      alert("โปรดระบุงานที่ต้องทำ");
      return;
    }

    let seqNo = 1;
    if (todos.length > 0) {
      seqNo = Math.max(...todos.map(item => item.seqNo));
      seqNo = seqNo + 1;
    }
    const newTodo = { id: Math.random(), seqNo: seqNo, text: input, completed: false };

    let newTodos = [...todos, newTodo];

    newTodos.sort((a, b) => {
      if (a.seqNo > b.seqNo)
        return -1;
      if (a.seqNo < b.seqNo)
        return 1;
      return 0;
    });

    setTodos(newTodos);
    setInput("");
  }

  const editTodo = (id) => {
    const detail = todos.find(item => item.id === id);
    setTodo(detail);
    handleShow();
  };

  const removeTodo = (id) => {
    let _todos = JSON.parse(localStorage.getItem("_todos"));
    if (_todos) {
      let exceptTodos = _todos.filter(item => item.id !== id);
      localStorage.setItem("_todos", JSON.stringify(exceptTodos));
    }
    setTodos(todos.filter(item => item.id !== id));
  };

  const todosByFilter = useMemo(() => {
    return filter === 'completed' ? todos.filter(item => item.completed) : todos
  }, [filter, todos]);

  const renderFilterButton = (buttonFilter, text) => {
    return <button
      className={`btn btn-sm btn-outline-secondary ${filter === buttonFilter ? 'active' : ''}`}
      onClick={() => setFilter(buttonFilter)}
    >{text}</button>
  }

  return (
    <>
      <div className="p-4 mt-4" style={{
        maxWidth: "600px", margin: "0 auto",
        background: "#fff", borderRadius: "0.3rem"
      }}>
        <form className="input-group mb-2" onSubmit={onSubmit}>
          <input
            name="todo"
            className="form-control"
            placeholder="ระบุงานที่ต้องทำ"
            value={input}
            onChange={e => setInput(e.target.value)}
          />
          <button className="btn btn-primary">เพิ่ม</button>
        </form>

        <div className="btn-group mb-2">
          {renderFilterButton('all', 'งานทั้งหมด')}
          {renderFilterButton('completed', 'งานที่เสร็จแล้ว')}
        </div>

        <TodoBox todos={todosByFilter} onCheck={checkTodo} onRemove={removeTodo} onEdit={editTodo} />
      </div>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>แก้ไขงาน</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Label>ชื่องาน</Form.Label>
            <Form.Control type="text" value={todo.text} placeholder="ชื่องาน" onChange={e => onChangeTaskName(e)} />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            ปิด
          </Button>
          <Button variant="primary" onClick={handleSaveEdit}>
            บันทึก
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default App;
