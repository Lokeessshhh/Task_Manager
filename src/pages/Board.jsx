import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import Column from '../components/Column';
import TaskModal from '../components/TaskModal';
import { useTaskStore } from '../store/taskStore';
import toast from 'react-hot-toast';
import styles from './Board.module.css';

const Board = () => {
  const { tasks, fetchTasks, createTask, updateTask, deleteTask, isLoading } = useTaskStore();
  const [modalOpen, setModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [initialStage, setInitialStage] = useState('todo');

  useEffect(() => {
    fetchTasks().catch(() => toast.error('Failed to load tasks'));
  }, [fetchTasks]);

  const handleAddTask = (stage) => {
    setInitialStage(stage);
    setEditingTask(null);
    setModalOpen(true);
  };

  const handleEditTask = (task) => {
    setEditingTask(task);
    setModalOpen(true);
  };

  const handleSubmit = async (data) => {
    try {
      if (editingTask) {
        await updateTask(editingTask.id, data);
        toast.success('Task updated');
      } else {
        await createTask(data);
        toast.success('Task created');
      }
    } catch (error) {
      toast.error('Operation failed');
      throw error;
    }
  };

  const handleDeleteTask = async (id) => {
    try {
      await deleteTask(id);
      toast.success('Task deleted');
    } catch (error) {
      toast.error('Failed to delete task');
    }
  };

  const filterTasks = (stage) => tasks.filter(t => t.stage === stage);

  return (
    <div className={styles.container}>
      <Navbar />
      <main className={styles.board}>
        <Column 
          title="To Do" 
          stage="todo" 
          tasks={filterTasks('todo')} 
          onAddTask={handleAddTask}
          onEditTask={handleEditTask}
          onDeleteTask={handleDeleteTask}
          isLoading={isLoading}
        />
        <Column 
          title="In Progress" 
          stage="inprogress" 
          tasks={filterTasks('inprogress')} 
          onAddTask={handleAddTask}
          onEditTask={handleEditTask}
          onDeleteTask={handleDeleteTask}
          isLoading={isLoading}
        />
        <Column 
          title="Done" 
          stage="done" 
          tasks={filterTasks('done')} 
          onAddTask={handleAddTask}
          onEditTask={handleEditTask}
          onDeleteTask={handleDeleteTask}
          isLoading={isLoading}
        />
      </main>

      <TaskModal 
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleSubmit}
        task={editingTask}
        initialStage={initialStage}
      />
    </div>
  );
};

export default Board;
