import { useActivity } from '../hooks/useActivity';
import styles from './ActivityList.module.css';

type ActivityListProps = {
  userId: string;
};

export function ActivityList({ userId }: ActivityListProps) {
  const { activities, isLoading, error } = useActivity(userId);

  const getIcon = (type: string) => {
    switch (type) {
      case 'donation_created':
        return '🎁';
      case 'donation_received':
        return '📦';
      case 'profile_updated':
        return '👤';
      case 'company_verified':
        return '✅';
      case 'status_changed':
        return '🔄';
      case 'login':
        return '🔐';
      case 'logout':
        return '🚪';
      default:
        return '📝';
    }
  };

  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('es-CO', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (isLoading && activities.length === 0) {
    return <div className={styles.loading}>Cargando actividades...</div>;
  }

  if (error) {
    return <div className={styles.error}>{error}</div>;
  }

  if (activities.length === 0) {
    return <div className={styles.empty}>No hay actividades registradas.</div>;
  }

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Actividad reciente</h2>
      <div className={styles.list}>
        {activities.map(activity => (
          <div key={activity.id} className={styles.item}>
            <div className={styles.icon}>{getIcon(activity.type)}</div>
            <div className={styles.content}>
              <p className={styles.description}>{activity.description}</p>
              <div className={styles.meta}>
                <span className={styles.type}>{activity.type}</span>
                <span className={styles.timestamp}>{formatDate(activity.timestamp)}</span>
              </div>
              {activity.metadata && Object.keys(activity.metadata).length > 0 && (
                <div className={styles.metadata}>
                  {Object.entries(activity.metadata).map(([key, value]) => (
                    <span key={key} className={styles.metadataItem}>
                      {key}: <strong>{String(value)}</strong>
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}