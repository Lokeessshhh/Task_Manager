import React from 'react';
import TaskCard from './TaskCard';
import styles from './Column.module.css';

const Column = ({ title, stage, tasks, onAddTask, onEditTask, onDeleteTask, isLoading }) => {
  const dotColor = `var(--${stage}-dot)`;

  return (
    <div className={styles.column}>
      <header className={styles.header}>
        <div className={styles.titleGroup}>
          <span className={styles.dot} style={{ backgroundColor: dotColor }}></span>
          <h2 className={styles.title}>{title}</h2>
          <span className={styles.badge}>{tasks.length}</span>
        </div>
        <button className={styles.addBtn} onClick={() => onAddTask(stage)}>+</button>
      </header>

      <div className={styles.taskList}>
        {isLoading && tasks.length === 0 ? (
          [1, 2, 3].map((i) => (
            <div key={i} className={styles.skeletonCard}></div>
          ))
        ) : tasks.length === 0 ? (
          <div className={styles.emptyState}>No tasks yet</div>
        ) : (
          tasks.map((task) => (
            <TaskCard 
              key={task.id} 
              task={task} 
              onEdit={onEditTask} 
              onDelete={onDeleteTask} 
            />
          ))
        )}
      </div>
    </div>
  );
};

export default Column;
