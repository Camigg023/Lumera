import React, { useCallback } from 'react';
import { useUserPoints } from '../hooks/useUserPoints';
import { useRewards } from '../hooks/useRewards';
import { useRewardHistory } from '../hooks/useRewardHistory';
import { Reward } from '../../domain/entities';
import { Navbar, RewardGrid, RewardHeader, RewardHistoryItem } from '../components';
import styles from '../components/rewardHistoryItem.module.css';
import pageStyles from './rewardsPage.module.css'; // 👈 ESTE ES EL IMPORT REAL

export const RewardsPage: React.FC = () => {
  const { userPoints, isLoading: pointsLoading } = useUserPoints();
  const {
    filteredRewards,
    activeCategory,
    setActiveCategory,
    isLoading: rewardsLoading,
  } = useRewards();
  const { history, isLoading: historyLoading } = useRewardHistory();

  const handleClaimBonus = useCallback(() => {
    alert('Daily bonus claimed! +50 Lumens 🎉');
  }, []);

  const handleRedeem = useCallback((reward: Reward) => {
    alert(`Redeeming: ${reward.title} for ${reward.costInLumens} Lumens`);
  }, []);

  return (
    /* 🔥 AHORA SÍ: CONTENEDOR CREMA REAL */
    <div className={pageStyles.container}>
      <div className="bg-surface text-on-surface font-body-md antialiased mb-24 min-h-screen">
        <Navbar activeLink="Profile" />

        <main
          className="max-w-7xl mx-auto px-container-padding-mobile md:px-container-padding-desktop py-8 space-y-section-gap"
          style={{
            paddingTop: '10px',
            paddingLeft: '5px',
            paddingRight: '5px',
          }}
        >
          {/* Points Header */}
          {pointsLoading || !userPoints ? (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 h-52 rounded-2xl bg-surface-container animate-pulse" />
              <div className="h-52 rounded-2xl bg-surface-container animate-pulse" />
            </div>
          ) : (
            <RewardHeader
              userPoints={userPoints}
              onClaimBonus={handleClaimBonus}
            />
          )}

          {/* Reward Grid */}
          <RewardGrid
            rewards={filteredRewards}
            activeCategory={activeCategory}
            isLoading={rewardsLoading}
            onCategoryChange={setActiveCategory}
            onRedeem={handleRedeem}
          />

          {/* Redemption History */}
          <section className="space-y-6">
            <h2 className="font-h2 text-h2 text-on-surface">
              Redemption History
            </h2>
            
            <div className="bg-surface-container-low rounded-3xl p-2 md:p-4 overflow-hidden border border-outline-variant/10">
              {historyLoading ? (
                <div className="space-y-2">
                  {[1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="h-20 rounded-2xl bg-white animate-pulse"
                    />
                  ))}
                </div>
              ) : (
                <div className={styles.historyContainer}>
                  {history.map((entry) => (
                    <RewardHistoryItem key={entry.id} entry={entry} />
                  ))}

                  {/* Contenedor decorativo inferior */}
                  <div
                    style={{
                      background: '#f5f6fa',
                      borderRadius: '20px',
                      padding: '10px',
                      border: '1px solid rgba(0,0,0,0.05)',
                    }}
                  />
                </div>
              )}
            </div>
          </section>
        </main>
      </div>
    </div>
  );
};