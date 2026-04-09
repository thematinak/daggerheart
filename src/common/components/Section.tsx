import styles from "../types/cssColor";
import Eyebrow from "./Eyebrow";
import H2 from "./H2";
import Subtitle from "./Subtitle";

const Section = ({ eyebrow, title, subtitle, className, children }: { eyebrow?: string; title?: string; subtitle?: string; className?: string; children?: React.ReactNode }) => (
  <div className={`${styles.tokens.page.section} ${className}`}>
    <div className="mb-5 text-center">
      {eyebrow && <Eyebrow eyebrow={eyebrow} className="mb-5" />}
      {title && <H2 className="mb-5">{title}</H2>}
      {subtitle && <Subtitle text={subtitle} className="mb-5" /> }
    </div>
    {children}
  </div>
);

export default Section;