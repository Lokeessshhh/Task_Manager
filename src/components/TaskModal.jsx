import React, { useState, useEffect } from 'react';
import styles from './TaskModal.module.css';

const TaskModal = ({ isOpen, onClose, onSubmit, task = null, initialStage = 'todo' }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [stage, setStage] = useState(initialStage);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setDescription(task.description || '');
      setStage(task.stage);
    } else {
      setTitle('');
      setDescription('');
      setStage(initialStage);
    }
  }, [task, initialStage]);

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onSubmit({ title, description, stage });
      onClose();
    } catch (error) {
      // Error handled by parent/toast
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <h2 className={styles.modalTitle}>{task ? 'Edit Task' : 'Create Task'}</h2>
        
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.field}>
            <label className={styles.label}>Title</label>
            <input 
              className={styles.input} 
              value={title} 
              onChange={(e) => setTitle(e.target.value)} 
              required 
              autoFocus
            />
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Description</label>
            <textarea 
              className={styles.textarea} 
              value={description} 
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
            />
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Stage</label>
            <div className={styles.segmentedControl}>
              {['todo', 'inprogress', 'done'].map((s) => (
                <button
                  key={s}
                  type="button"
                  className={`${styles.segment} ${stage === s ? styles.active : ''}`}
                  onClick={() => setStage(s)}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          <button type="submit" className={styles.submitBtn} disabled={loading}>
            {loading ? <span className={styles.spinner}></span> : (task ? 'Save Changes' : 'Create Task')}
          </button>
        </form>
      </div>
    </div>
  );
};

export default TaskModal;
