import React from 'react';
import styles from './DonationDetailPage.module.css';
import { mockDonationDetail } from '../../../data/datasource/DonationDataSource';

export const DonationDetailPage: React.FC = () => {
  const donation = mockDonationDetail;

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <button className={styles.backButton}>←</button>
        <h1 className={styles.title}>Detalle de Donación</h1>
        <div className={styles.spacer} />
      </header>

      <main className={styles.main}>
        <div className={styles.card}>
          <div className={styles.idBadge}>
            ID: {donation.id}
          </div>

          <section className={styles.timelineSection}>
            <h2 className={styles.sectionTitle}>Estado de la Entrega</h2>
            <div className={styles.timeline}>
              {donation.timeline.map((step, index) => (
                <div 
                  key={step.status} 
                  className={`${styles.timelineItem} ${step.isCompleted ? styles.completed : styles.pending}`}
                >
                  <div className={styles.iconWrapper}>
                    <span className={styles.icon}>{step.icon}</span>
                    {index < donation.timeline.length - 1 && (
                      <div className={`${styles.line} ${donation.timeline[index + 1].isCompleted ? styles.lineCompleted : ''}`} />
                    )}
                  </div>
                  <div className={styles.stepInfo}>
                    <p className={styles.stepLabel}>{step.label}</p>
                    <p className={styles.stepDate}>{step.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className={styles.infoSection}>
            <h2 className={styles.sectionTitle}>Información General</h2>
            <div className={styles.infoGrid}>
              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>Donador</span>
                <span className={styles.infoValue}>{donation.donorName}</span>
              </div>
              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>Beneficiario</span>
                <span className={styles.infoValue}>{donation.beneficiaryName}</span>
              </div>
              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>Fecha</span>
                <span className={styles.infoValue}>{donation.date}</span>
              </div>
              {donation.pickupLocation && (
                <div className={`${styles.infoItem} ${styles.fullWidth}`}>
                  <span className={styles.infoLabel}>Punto de Recogida</span>
                  <span className={styles.infoValue}>
                    <span className="material-symbols-outlined" style={{ fontSize: 16, verticalAlign: 'middle', marginRight: 4 }}>location_on</span>
                    {donation.pickupLocation}
                  </span>
                </div>
              )}
            </div>
          </section>

          <section className={styles.itemsSection}>
            <h2 className={styles.sectionTitle}>Productos</h2>
            <ul className={styles.itemsList}>
              {donation.items.map((item, index) => (
                <li key={index} className={styles.productItem}>
                  <span className={styles.dot}>•</span> {item}
                </li>
              ))}
            </ul>
          </section>
        </div>
      </main>
    </div>
  );
};
