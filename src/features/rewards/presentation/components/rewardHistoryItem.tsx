import React from 'react';
import { RewardHistory } from '../../domain/entities';
import styles from './rewardHistoryItem.module.css';

interface RewardHistoryItemProps {
  entry: RewardHistory;
}

export const RewardHistoryItem: React.FC<RewardHistoryItemProps> = ({
  entry,
}) => {
  const { title, date, points, type, status, icon } = entry;
  const isCredit = type === 'credit';

  return (
    <div className={styles.card}>
      
      {/* 🔹 LEFT SIDE */}
      <div className={styles.left}>
        
        {/* ICON */}
        <div className={styles.iconBox}>
          <span className="material-symbols-outlined">{icon}</span>
        </div>

        {/* TEXT */}
        <div className={styles.text}>
          <h4 className={styles.title}>{title}</h4>
          <p className={styles.date}>{date}</p>
        </div>
      </div>

      {/* 🔹 RIGHT SIDE */}
      <div className={styles.right}>
        <p className={`${styles.points} ${isCredit ? styles.credit : styles.debit}`}>
          {isCredit ? '+' : '-'} {points.toLocaleString()}
        </p>

        <span
          className={`${styles.status} ${
            status === 'COMPLETED'
              ? styles.completed
              : status === 'PENDING'
              ? styles.pending
              : styles.system
          }`}
        >
          {status}
        </span>
      </div>
    </div>
  );
};