import styles from "./QuoteBlock.module.css";

interface QuoteBlockProps {
  text: string;
}

export function QuoteBlock({ text }: QuoteBlockProps) {
  return (
    <div className={styles.block}>
      <p className={styles.quote}>"{text}"</p>
    </div>
  );
}
