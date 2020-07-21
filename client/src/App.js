import React from 'react';
import io from 'socket.io-client';
import { v4 as uuidv4 } from 'uuid';

class App extends React.Component {

  state = {
    tasks: [],
    taskName: ''
  };

  componentDidMount() {
    this.socket = io('localhost:8000');

    this.socket.on('removeTask', taskId => {this.removeTask(taskId)});
    this.socket.on('updateData', data => {this.updateTasks(data)});
    this.socket.on('addTask', newTask => {this.addTask(newTask)});
  };

  removeTask(id, local) {
    const {tasks} = this.state;


    this.setState({ tasks: tasks.filter(task => task.id !== id)
     });
    if (local) {
      this.socket.emit('removeTask', id);
    }
  };

  addTask(newTask) {
    this.setState({tasks: [...this.state.tasks, newTask]});
    console.log(newTask);
  };

  updateName(newName) {
    this.setState({taskName: newName});
  };

  submitForm(e) {
    const {taskName} = this.state;
    e.preventDefault();
    const newTaskData = {name: taskName, id: uuidv4()};
    this.addTask(newTaskData);
    this.socket.emit('addTask', newTaskData);
    this.setState({taskName: ''});
  };

  updateTasks(data) {
    this.setState({tasks: data});
  }

  render() {
    const {tasks, taskName} = this.state;

    return (
      <div className="App">

        <header>
          <h1>ToDoList.app</h1>
        </header>

        <section className="tasks-section" id="tasks-section">
          <h2>Tasks</h2>

          <ul className="tasks-section__list" id="tasks-list">
            {tasks.map(task => (
              <li key={task.id} className="task">
                {task.name}
                <button
                className="btn btn--red"
                onClick={() => this.removeTask(task.id, true)}
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>

          <form id="add-task-form">
            <input className="text-input" autoComplete="off" type="text" placeholder="Type your description" id="task-name" value={taskName} onChange={e => this.updateName(e.target.value)} />
            <button className="btn" type="submit" onClick={e => this.submitForm(e)}>Add</button>
          </form>

        </section>
      </div>
    );
  };

};

export default App;