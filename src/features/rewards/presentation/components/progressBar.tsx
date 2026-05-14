import React from 'react';
import styles from './progressBar.module.css';

interface ProgressBarProps {
  percent: number;
  className?: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  percent,
  className = '',
}) => {
  const clamped = Math.min(100, Math.max(0, percent));

  return (
    <div className={`${styles.progressBar} ${className}`}>
      <div
        className={styles.progressFill}
        style={{ width: `${clamped}%` }}
        role="progressbar"
      />
    </div>
  );
};