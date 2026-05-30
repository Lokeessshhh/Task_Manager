import React from 'react';
import styles from './TaskCard.module.css';

const TaskCard = ({ task, onEdit, onDelete }) => {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className={styles.card} onClick={() => onEdit(task)}>
      <h3 className={styles.title}>{task.title}</h3>
      {task.description && (
        <p className={styles.description}>{task.description}</p>
      )}
      <div className={styles.footer}>
        <span className={styles.timestamp}>{formatDate(task.created_at)}</span>
        <div className={styles.actions}>
          <button 
            className={styles.actionBtn} 
            onClick={(e) => { e.stopPropagation(); onEdit(task); }}
          >
            Edit
          </button>
          <button 
            className={styles.deleteBtn} 
            onClick={(e) => { e.stopPropagation(); onDelete(task.id); }}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default TaskCard;
