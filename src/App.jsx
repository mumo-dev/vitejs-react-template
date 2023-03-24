
function CreateTodo() {
  return (
    <div className="input-group">
        <input type="text" className="form-control" />
        <button className="btn btn-primary">Create Todo</button>
    </div>
  )
}


function Todo({item}) {
  return (
    <li className="list-group-item d-flex justify-content-between align-items-center">
      {item}
    <span
      className="badge bg-danger rounded-pill"
      style={{ cursor: 'pointer' }}
    >
      X
    </span>
  </li>
  )

}

function ListTodo({todos}) {
  let allTodos = todos.map(todo => (
    <Todo  key={todo.id} item={todo.text}/>
  ))

  return (
    <ul className="list-group list-group-flush">
      {allTodos}
  </ul>
  )
}


function TodoApp() {

  const items = [
    {
      id: 1,
      text: "Item 1",
      done: true
    },
    {
      id: 2,
      text: "Item 2",
      done: true
    },
    {
      id: 3,
      text: "Item 3",
      done: true
    },
    {
      id: 4,
      text: "Item 3",
      done: true
    }
  ]

  return (
    <div class="card">
    <div className="card-header">Todo App</div>
    <div className="card-body">
      <CreateTodo/>
    </div>
    <ListTodo todos={items}/>
  </div>
  )
}


function App() {
  return (
    <div className="container">
      <div className="row justify-content-center">
        <div className="col-md-8 mt-5">
          <TodoApp/>
        </div>
      </div>
    </div>
  );
}

export default App;
