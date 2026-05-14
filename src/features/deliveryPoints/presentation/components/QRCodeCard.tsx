import styles from "./QRCodeCard.module.css";

export function QRCodeCard() {
  return (
    <div className={styles.card}>
      <span className={styles.label}>PERSONAL COLLECTION CODE</span>
      <div className={styles.qrWrapper}>
        <div className={styles.qrInner}>
          <img
            className={styles.qrImg}
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuC-IaDrW1gX-S-XykPgk9D7VuwQHBT1EWl3r_7Eoiym8fz1iJjVXq3qemdDYx5sY8A6iTkK2IYSzAAnQINfrtXOgb9ZByDTiWTc7b7rlevdQpCxCkJxkV3HvmYlHnbeSxmTG90GVzCWhdD8MCb4X0DmITIQxAOGDL3JdN8N4rNHPcn4nM-hN0Yq_cHGftmQiDleNQAP1kyUc33A6W3UpB6XYxG8itucV31IUFwNjxmcjjiPjfcf69GJBOdw8nnQ2mXzAg2c93Y--o8Z"
            alt="QR Code"
          />
        </div>
        <div className={styles.qrHover}>
          <span className={`material-symbols-outlined ${styles.zoomIcon}`}>
            zoom_in
          </span>
        </div>
      </div>
      <p className={styles.hint}>
        Show this at any point to verify your eligibility
      </p>
    </div>
  );
}
