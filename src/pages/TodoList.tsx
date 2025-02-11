import { useEffect, useState } from 'react';
import axios from 'axios';

type Task = {
  id: number;
  text: string;
  completed: boolean;
}

export default function TodoList() {
  const userID = 'sampleUserId';
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [listTitle, setListTitle] = useState<string>("To do list title");
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState<string>('');

  useEffect(() => {
    setLoading(true);
  
    axios
      .get(`${import.meta.env.VITE_BE_DOMAIN_NAME}/api/${userID}/tasks`) //with credentials
      .then((response) => {
        setTasks(response.data.tasks);
        setListTitle(response.data.listTitle)
      })
      .catch(() => {
        setError('Error fetching tasks.');
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);



  const addTask = async (userID: string) => {
    // if (newTask.trim() !== '') {
    //   const newTaskObj: Task = {
    //     id: Date.now(),
    //     text: newTask,
    //     completed: false,
    //   };
    //   setTasks([...tasks, newTaskObj]);
    //   setNewTask('');
    // }

    await axios
      .post(`${import.meta.env.VITE_BE_DOMAIN_NAME}/api/${userID}/tasks`, {
        id: Date.now(),
        text: newTask,
        completed: false
      })
  };

  const toggleCompletion = (taskId: number): void => {
    setTasks(
      tasks.map((task) =>
        task.id === taskId ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const deleteTask = async (taskId: number) => {
    // setTasks(tasks.filter((task) => task.id !== taskId));
    
    await axios
      .delete(`${import.meta.env.VITE_BE_DOMAIN_NAME}/api/${userID}/tasks/${taskId}`) //with credentials

    
  }
    

  const updateTask = async(taskId: number) => {
    // const objIndex = tasks.findIndex(obj => obj.id == taskId);

    await axios
      .put(`${import.meta.env.VITE_BE_DOMAIN_NAME}/api/${userID}/tasks/${taskId}`, {
        text: newTask, //from a textfield
      }) //with credentials
  }

  return (
    <div style={{ maxWidth: '500px', margin: '0 auto', padding: '20px' }}>
      <h1>{listTitle}</h1>

      <input
        type="text"
        value={newTask}
        onChange={(e) => setNewTask(e.target.value)}
        placeholder="Add a new task"
        style={{ padding: '10px', width: '80%' }}
      />
      <button
        onClick={() => addTask(userID)}
        style={{
          padding: '10px',
          marginLeft: '10px',
          backgroundColor: '#4CAF50',
          color: 'white',
          border: 'none',
          cursor: 'pointer',
        }}
      >
        Add Task
      </button>

      <ul style={{ padding: 0, listStyleType: 'none', marginTop: '20px' }}>
        {tasks.map((task) => (
          <li
            key={task.id}
            style={{
              backgroundColor: task.completed ? '#d3ffd3' : '#f9f9f9',
              padding: '10px',
              marginBottom: '10px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              borderRadius: '4px',
            }}
          >
            <span
              onClick={() => toggleCompletion(task.id)}
              style={{
                textDecoration: task.completed ? 'line-through' : 'none',
                cursor: 'pointer',
              }}
            >
              {task.text}
            </span>
            <button
              onClick={() => updateTask(task.id)}
              style={{
                backgroundColor: 'blue',
                color: 'white',
                border: 'none',
                cursor: 'pointer',
                padding: '5px 10px',
                borderRadius: '4px',
              }}
            >
              Update
            </button>
            <button
              onClick={() => deleteTask(task.id)}
              style={{
                backgroundColor: '#f44336',
                color: 'white',
                border: 'none',
                cursor: 'pointer',
                padding: '5px 10px',
                borderRadius: '4px',
              }}
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};
