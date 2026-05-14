import React from 'react';
import { Reward } from '../../domain/entities';
import styles from './rewardCard.module.css';

interface RewardCardProps {
  reward: Reward;
  onRedeem: (reward: Reward) => void;
}

export const RewardCard: React.FC<RewardCardProps> = ({ reward, onRedeem }) => {
  const {
    title,
    description,
    costInLumens,
    imageType,
    imageUrl,
    iconOverlay,
    gradientFrom,
    gradientTo,
  } = reward;

  return (
    <div className={styles.card}>

      {/* IMAGE + PRICE */}
      <div className={styles.imageWrapper}>

        {imageType === 'url' && imageUrl ? (
          <img src={imageUrl} alt={title} className={styles.image} />
        ) : (
          <div
            className={styles.fallback}
            style={{
              background: `linear-gradient(135deg, ${gradientFrom ?? '#6366f1'}, ${gradientTo ?? '#9333ea'})`,
            }}
          >
            {iconOverlay && (
              <span className="material-symbols-outlined">
                {iconOverlay}
              </span>
            )}
          </div>
        )}

        {/* 💎 LUMENS ARRIBA DERECHA */}
        <div className={styles.priceTag}>
          {costInLumens.toLocaleString()} Lumens
        </div>

      </div>

      {/* CONTENT */}
      <div className={styles.content}>
        <div className={styles.textBlock}>
          <h3 className={styles.title}>{title}</h3>
          <p className={styles.description}>{description}</p>
        </div>

        <button
          onClick={() => onRedeem(reward)}
          className={styles.button}
        >
          Redeem Reward
        </button>
      </div>

    </div>
  );
};