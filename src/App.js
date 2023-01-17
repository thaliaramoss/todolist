
import './App.css';
import {useState, useEffect} from 'react' // hooks utilizados
import {BsTrash, BsBookmarkCheck, BsBookmarkCheckFill} from 'react-icons/bs' // ícones

const API = 'http://localhost:5000' // endereço básico da API

function App() {
  // states:
  const [title, setTitle] = useState("")
  const [time, setTime] = useState("")
  const [todos, setTodos] = useState([])
  const [loading, setLoading] = useState(false)

  // load todos on page load
  useEffect(() => {

    const loadData = async() => {
      setLoading(true)

      const res = await fetch(API + "/todos")
      .then((res) => res.json())
      .then((data) => data)
      .catch((err) => (console.log(err)))

      setLoading(false)

      setTodos(res)
    }

    loadData()

  }, [])

  // async = espera a resposta do fetch
  const handleSubmit = async (e) => {
    e.preventDefault()

    const todo = {
      id: Math.random(),
      title,
      time,
      done: false
    }

    await fetch(API + "/todos", {
      method: "POST",
      body: JSON.stringify(todo),
      headers: {
        "Content-Type": "application/json",
      }
    })

    setTodos((prevState) => [...prevState, todo])

    // envio para a api
    console.log(todo)

    setTitle("")
    setTime("")
  }

  const handleDelete = async(id) => {
    await fetch(API + "/todos/" + id, {
      method: "DELETE",
    })

    setTodos((prevState) => prevState.filter((todo) => todo.id !== id))
  }

  const handleEdit = async(todo) => {
    todo.done = !todo.done

    const data = await fetch(API + "/todos/" + todo.id, {
      method: "PUT",
      body: JSON.stringify(todo),
      headers: {
        "Content-Type": "application/json",
      }
    })
    setTodos((prevState) => 
    prevState.map((t) => (t.id === data.id ? (t = data) : t)))
  }

  if(loading) {
    return <p>Carregando...</p>
  }

  return (
    <div className="App">
      <div className='todo-header'>
        <h1>ToDo List</h1>
      </div>
      <div className='form-todo'>
        <h2>Insira a sua próxima tarefa</h2>
        <form onSubmit={handleSubmit}>
          <div className='form-control'>
            <label htmlFor="title">O que você vai fazer?</label>
            <input type="text"
             name="title"
              placeholder='título da tarefa' 
              onChange={(e) => setTitle(e.target.value)} 
              value={title || ""} 
              required/>
          </div>
          <div className='form-control'>
            <label htmlFor="time">Duração:</label>
            <input type="text"
             name="title"
              placeholder='tempo estimado (em horas)' 
              onChange={(e) => setTime(e.target.value)} 
              value={time || ""} 
              required/>
          </div>
          <input type="submit" name="" value="Criar tarefa"/>
        </form>
      </div>
      <div className='list-todo'>
        <h2>Lista de tarefas:</h2>
        {todos.length === 0 && <p>Não há tarefas.</p>}
        {todos.map((todo) => (
          <div className='todo' key={todo.id}>
            <h3 className={todo.done ? "todo-done" : ""}>{todo.title}</h3>
            <p>Duração: {todo.time}</p>
            <div className='actions'>
              <span onClick={() => handleEdit(todo)}>
                {!todo.done ? <BsBookmarkCheck/> : <BsBookmarkCheckFill/>}
              </span>
              <BsTrash onClick={() => handleDelete(todo.id)}/>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
