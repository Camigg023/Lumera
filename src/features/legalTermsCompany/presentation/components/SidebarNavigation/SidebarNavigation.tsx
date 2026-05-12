import type { LegalMetadata } from "../../../domain/entities/LegalMetadata";
import styles from "./SidebarNavigation.module.css";

interface NavItem {
  anchor: string;
  label: string;
}

interface SidebarNavigationProps {
  items: NavItem[];
  activeSection: string;
  onSectionClick: (anchor: string) => void;
  metadata: LegalMetadata | null;
}

export function SidebarNavigation({
  items,
  activeSection,
  onSectionClick,
  metadata,
}: SidebarNavigationProps) {
  const handleClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    anchor: string
  ) => {
    e.preventDefault();
    onSectionClick(anchor);
    const el = document.getElementById(anchor);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <aside className={styles.aside}>
      <nav className={styles.navList}>
        {items.map((item) => (
          <a
            key={item.anchor}
            href={`#${item.anchor}`}
            onClick={(e) => handleClick(e, item.anchor)}
            className={
              activeSection === item.anchor
                ? styles.linkActive
                : styles.link
            }
          >
            {item.label}
          </a>
        ))}
      </nav>

      {metadata && (
        <div className={styles.metaCard}>
          <span className="material-symbols-outlined text-secondary mb-2">
            info
          </span>
          <p className={styles.metaText}>
            Last updated: <br />
            {metadata.lastUpdated}
          </p>
        </div>
      )}
    </aside>
  );
}
