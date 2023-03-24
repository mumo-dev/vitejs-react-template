import { useMutation, useQuery } from "@apollo/client"
import { useState } from "react"
import { CREATE_TODO, DELETE_TODO, FETCH_TODOS, TOGGLE_TODO } from "./graphql/queries"

function CreateTodo() {
  const [todoValue, setTodoValue] = useState("")
  const [CreateTodo, { data, loading, error }] = useMutation(CREATE_TODO, {
    refetchQueries: [
      { query: FETCH_TODOS }, 'getTodos'
    ]
  })

  const submitTodo = async () => {
    if (!todoValue) return
    const variables = {
      text: todoValue
    }
    await CreateTodo({ variables })
    setTodoValue('')
  }

  return (
    <>
      {error && (<div className="alert alert-danger" role="alert">
        An error occurred. could not create the todo.
      </div>)
      }
      <div className="input-group">
        <input type="text"
          className="form-control"
          placeholder="Enter your todo here..."
          value={todoValue}
          onChange={e => setTodoValue(e.target.value)} />

        <button
          className="btn btn-primary"
          onClick={submitTodo}
          disabled={loading} >
          {loading ? 'Creating...' : 'Create Todo'}
        </button>
      </div>

    </>
  )
}


function Todo({ item }) {
  const [DeleteTodo] = useMutation(DELETE_TODO, {
    refetchQueries: [
      { query: FETCH_TODOS }, 'getTodos'
    ]
  })

  const [UpdateTodo] = useMutation(TOGGLE_TODO, {
    refetchQueries: [
      { query: FETCH_TODOS }, 'getTodos'
    ]
  })

  const handleDelete = async () => {
    const confirm = window.confirm("Are you sure you want to delete this item?")
    if (confirm) {
      const variables = {
        id: item.id
      }
      await DeleteTodo({ variables })
    }
  }

  const handleToggle = async () => {
    const variables = {
      id: item.id,
      done: !item.done
    }
    await UpdateTodo({ variables })
  }


  return (
    <li className={`list-group-item d-flex justify-content-between align-items-center`}
      onDoubleClick={handleToggle}
    >
      <span className={`${item.done ? "text-decoration-line-through" : ""}`}>  {item.text} </span>
      <span
        className="badge bg-danger rounded-pill"
        style={{ cursor: 'pointer' }}
        onClick={handleDelete}
      >
        X
      </span>
    </li>
  )

}

function ListTodo() {
  const { data, loading, error } = useQuery(FETCH_TODOS)

  if (error) {
    return (
      <div className="alert alert-danger" role="alert">
        An error occurred
      </div>
    )
  }

  if (loading) {
    return (
      <ProgressSpinner />
    )
  }

  let allTodos = data.todos.map(todo => (
    <Todo key={todo.id} item={todo} />
  ))

  return (
    <ul className="list-group list-group-flush">
      {allTodos}
    </ul>
  )
}

function ProgressSpinner() {
  return (
    <div className="d-flex justify-content-center align-items-center m-2">
      <div className="spinner-border text-secondary" role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
    </div>
  )
}

function TodoApp() {
  return (
    <div className="card">
      <div className="card-header">Todo App</div>
      <div className="card-body">
        <CreateTodo />
      </div>
      <ListTodo/>
    </div>
  )
}


function App() {
  return (
    <div className="container">
      <div className="row justify-content-center">
        <div className="col-md-8 mt-5">
          <TodoApp />
        </div>
      </div>
    </div>
  );
}

export default App;
