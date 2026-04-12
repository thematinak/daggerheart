import React from "react";
import styles from "../types/cssColor";

type ContentToolShellProps = {
  eyebrow: string;
  title: string;
  description: string;
  children: React.ReactNode;
};

const ContentToolShell: React.FC<ContentToolShellProps> = ({ eyebrow, title, description, children }) => (
  <div className="mx-auto flex w-full max-w-4xl flex-col gap-6">
    <section className={`${styles.tokens.page.section} p-5 sm:p-6 lg:p-8`}>
      <div className="text-center">
        <div className={styles.tokens.page.eyebrow}>{eyebrow}</div>
        <h1 className={`mt-2 ${styles.tokens.page.title}`}>{title}</h1>
        <p className={`mx-auto mt-3 max-w-2xl ${styles.tokens.page.subtitle}`}>{description}</p>
      </div>
    </section>

    <section className={`${styles.tokens.page.section} p-5 sm:p-6 lg:p-8`}>
      {children}
    </section>
  </div>
);

export default ContentToolShell;
