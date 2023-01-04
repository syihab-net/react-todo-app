const express = require('express');
const fs = require('fs');
const app = express();
const port = 3001;

app.use(express.json());

const loadTodos = () => {
  const todoFile = fs.readFileSync('data/todos.json');
  return JSON.parse(todoFile);
};

const addTodo = ({ todo, date, time }) => {
  let todos = loadTodos();
  if (todos.length) {
    const lastId = todos.length - 1;
    const id = todos[lastId].id + 1;
    const newTodo = { id, todo, date, time, isDone: false };
    todos = todos.concat([newTodo]);
  } else {
    todos = [{ id: 1, todo, date, time, isDone: false }];
  }
  fs.writeFileSync('data/todos.json', JSON.stringify(todos));
};

/* const todos = 
  {
    id: 1,
    todo: 'Learn react JS',
    date: '2022/12/12',
    time: '10.00',
    isDone: false,
  },
  {
    id: 2,
    todo: 'Learn express JS',
    date: '2022/12/13',
    time: '10.00',
    isDone: false,
  },
  {
    id: 3,
    todo: 'Break time for learn',
    date: '2022/12/14',
    time: '10.00',
    isDone: false,
  },
]; */

app.get('/todos', (req, res) => {
  res.json({ response: { todos: loadTodos() } });
});

app.post('/todos', (req, res) => {
  const prevTodos = loadTodos();
  addTodo(req.body);
  const newTodos = loadTodos();
  if (newTodos.length - prevTodos.length === 1) {
    res.json({ response: { status: true } });
  } else {
    res.json({ response: { status: false } });
  }
});

app.delete('/todos/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const prevTodos = loadTodos();
  const todo = prevTodos.find((i) => i.id === id);
  if (todo) {
    let deletedTodos = prevTodos.filter((data) => data.id !== id);
    fs.writeFileSync('data/todos.json', JSON.stringify(deletedTodos));
    const newTodos = loadTodos();
    if (prevTodos.length - newTodos.length === 1) {
      res.json({ response: { status: true } });
    } else {
      res.json({ response: { status: false } });
    }
  } else {
    res.json({ response: { status: false, message: 'Todo not found' } });
  }
});

app.patch('/todos/:id/complete', (req, res) => {
  const deleteId = parseInt(req.params.id);
  const prevTodos = loadTodos();
  const todo = prevTodos.find((i) => i.id === deleteId);
  if (todo) {
    const updatedTodos = prevTodos.map((val) => {
      const { id, todo, date, time, isDone } = val;
      return id === deleteId ? { id, todo, date, time, isDone: true } : { id, todo, date, time, isDone };
    });
    fs.writeFileSync('data/todos.json', JSON.stringify(updatedTodos));
    res.json({ response: { status: true } });
  } else {
    res.json({ response: { status: false, message: 'Todo not found' } });
  }
});

app.patch('/todos/:id', (req, res) => {
  const updatedId = parseInt(req.params.id);
  const prevTodos = loadTodos();
  const todo = prevTodos.find((i) => i.id === updatedId);
  if (todo) {
    const updatedTodos = prevTodos.map((val) => {
      const { id, todo, date, time, isDone } = val;
      return id === updatedId
        ? {
            id,
            todo: req.body.todo,
            date: req.body.date,
            time: req.body.time,
            isDone,
          }
        : { id, todo, date, time, isDone };
    });
    fs.writeFileSync('data/todos.json', JSON.stringify(updatedTodos));
    res.json({ response: { status: true } });
  } else {
    res.json({ response: { status: false, message: 'Todo not found' } });
  }
});

app.use('*', (req, res) => {
  res.json({ response: 'Undefined method or path' });
});

app.listen(port, () => {
  console.log(`App started on port ${port}`);
});
