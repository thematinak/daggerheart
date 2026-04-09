import styles from "../types/cssColor";

const Subtitle = ({text, className}: {text: string; className?: string}) => (
  <p className={className + " " + styles.tokens.page.subtitle}>
    {text}
  </p>
);

export default Subtitle;