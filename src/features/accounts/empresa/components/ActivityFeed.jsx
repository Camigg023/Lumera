import { CheckCircle, Truck, AlertTriangle, Edit, FileText } from 'lucide-react';

const ICON_MAP = {
  check: { Icon: CheckCircle, bg: '#ecfdf5', color: '#047857' },
  truck: { Icon: Truck,       bg: '#e0e7ff', color: '#4f46e5' },
  alert: { Icon: AlertTriangle, bg: '#fef9c3', color: '#854d0e' },
  edit:  { Icon: Edit,        bg: '#f2f3ff', color: '#3525cd' },
  file:  { Icon: FileText,    bg: '#ecfdf5', color: '#047857' },
};

export default function ActivityFeed({ activity = [] }) {
  return (
    <div>
      {activity.map(item => {
        const { Icon, bg, color } = ICON_MAP[item.icon] || ICON_MAP.edit;
        return (
          <div key={item.id} className="empresa-activity-item">
            <div className="empresa-activity-dot" style={{ background: bg }}>
              <Icon size={15} color={color} />
            </div>
            <div className="empresa-activity-body">
              <p className="empresa-activity-text">{item.text}</p>
              <span className="empresa-activity-time">{item.time}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
