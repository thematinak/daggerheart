export type Color = "gray" | "yellow" | "blue" | "green" | "purple" | "red";

export type ColorStyles = {
  bg: string;
  bgHover: string;
  border: string;
  fill: string;
  text: string;
  lightText: string;
};

export type ColorPalette = Record<Color, ColorStyles>;

export type SemanticColors = {
  primary: ColorStyles;
  secondary: ColorStyles;
  success: ColorStyles;
  warning: ColorStyles;
  error: ColorStyles;
  info: ColorStyles;
  accent: ColorStyles;
  muted: ColorStyles;
};

export type ComponentTokens = {
  page: {
    shell: string;
    container: string;
    section: string;
    title: string;
    smallerTitle: string;
    subtitle: string;
    eyebrow: string;
  };
  button: {
    base: string;
    primary: string;
    secondary: string;
    danger: string;
    ghost: string;
  };
  badge: string;
  card: {
    base: string;
    hover: string;
    selected: string;
  };
  stepIndicator: {
    bar: string;
    progress: string;
    stepBase: string;
    active: string;
    completed: string;
    upcoming: string;
  };
  input: {
    base: string;
    focus: string;
  };
  panel: {
    base: string;
    muted: string;
    accent: string;
  };
  text: {
    heading: string;
    body: string;
    muted: string;
    label: string;
  };
  pill: {
    base: string;
    muted: string;
    accent: string;
    info: string;
  };
  notification: {
    viewport: string;
    card: string;
    iconWrap: string;
    closeButton: string;
    title: string;
    message: string;
    progressTrack: string;
  };
  emptyState: string;
};

const palette: ColorPalette = {
  gray: {
    bg: "bg-[var(--pill-muted-bg)]",
    bgHover: "hover:bg-[var(--surface-muted)]",
    border: "border-[color:var(--border-soft)]",
    fill: "fill-[var(--text-muted)]",
    text: "text-[var(--text-primary)]",
    lightText: "text-[var(--text-muted)]",
  },
  yellow: {
    bg: "bg-amber-100",
    bgHover: "hover:bg-amber-200",
    border: "border-amber-600",
    fill: "fill-amber-400",
    text: "text-amber-900",
    lightText: "text-amber-500",
  },
  blue: {
    bg: "bg-sky-100",
    bgHover: "hover:bg-sky-200",
    border: "border-sky-600",
    fill: "fill-sky-400",
    text: "text-sky-900",
    lightText: "text-sky-500",
  },
  green: {
    bg: "bg-emerald-100",
    bgHover: "hover:bg-emerald-200",
    border: "border-emerald-600",
    fill: "fill-emerald-400",
    text: "text-emerald-900",
    lightText: "text-emerald-500",
  },
  purple: {
    bg: "bg-violet-100",
    bgHover: "hover:bg-violet-200",
    border: "border-violet-600",
    fill: "fill-violet-400",
    text: "text-violet-900",
    lightText: "text-violet-500",
  },
  red: {
    bg: "bg-rose-100",
    bgHover: "hover:bg-rose-200",
    border: "border-rose-600",
    fill: "fill-rose-400",
    text: "text-rose-900",
    lightText: "text-rose-500",
  },
};

const semantic: SemanticColors = {
  primary: palette.yellow,
  secondary: palette.gray,
  success: palette.green,
  warning: palette.yellow,
  error: palette.red,
  info: palette.blue,
  accent: palette.blue,
  muted: palette.gray,
};

const tokens: ComponentTokens = {
  page: {
    shell: "relative min-h-screen overflow-hidden bg-[image:var(--bg-shell)] text-[var(--text-primary)]",
    container: "relative z-10 mx-auto w-full max-w-screen-2xl px-3 py-4 sm:px-5 sm:py-6 lg:px-8",
    section: "rounded-[1.5rem] border border-[color:var(--border-soft)] bg-[var(--surface-elevated)] shadow-[var(--shadow-soft)] backdrop-blur p-4 sm:rounded-[2rem] sm:p-5",
    title: "text-2xl font-black tracking-tight text-[var(--text-primary)] sm:text-4xl",
    smallerTitle: "text-xl font-black tracking-tight text-[var(--text-primary)] sm:text-3xl",
    subtitle: "text-sm leading-6 text-[var(--text-muted)] sm:text-base",
    eyebrow: "text-[11px] font-semibold uppercase tracking-[0.28em] text-[var(--text-accent)]",
  },
  button: {
    base: "inline-flex items-center justify-center rounded-xl border px-4 py-2.5 font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[var(--ring-accent)] focus:ring-offset-2 focus:ring-offset-transparent",
    primary: "border-[color:var(--border-strong)] bg-[image:var(--button-primary-bg)] text-[var(--button-primary-text)] shadow-[var(--shadow-card)] hover:-translate-y-0.5 hover:brightness-105",
    secondary: "border-[color:var(--border-soft)] bg-[var(--button-secondary-bg)] text-[var(--button-secondary-text)] shadow-sm hover:-translate-y-0.5 hover:brightness-105",
    danger: "border-rose-300/70 bg-[var(--button-danger-bg)] text-[var(--button-danger-text)] hover:-translate-y-0.5 hover:brightness-105",
    ghost: "border-transparent bg-transparent text-[var(--text-primary)] hover:bg-[var(--surface-panel)]",
  },
  badge: "rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-wide shadow-sm",
  card: {
    base: "rounded-[1.25rem] border border-[color:var(--border-soft)] bg-[var(--surface-panel)] p-4 shadow-[var(--shadow-card)] backdrop-blur sm:rounded-[1.5rem] sm:p-5",
    hover: "transition-all duration-200 hover:-translate-y-1 hover:brightness-[1.02]",
    selected: "border-amber-500 bg-[var(--surface-accent)] shadow-[var(--shadow-card)] ring-1 ring-amber-300/70",
  },
  stepIndicator: {
    bar: "relative h-2 w-full overflow-hidden rounded-full border border-[color:var(--border-soft)] bg-[var(--surface-panel)] shadow-inner",
    progress: "h-full rounded-full bg-[linear-gradient(90deg,_#b45309,_#f59e0b,_#fbbf24)] transition-all duration-300",
    stepBase: "flex h-11 w-11 items-center justify-center rounded-2xl border font-semibold shadow-sm transition-all",
    active: "border-[color:var(--border-strong)] bg-[var(--pill-accent-bg)] text-[var(--pill-accent-text)] ring-2 ring-[var(--ring-accent)]",
    completed: "border-[color:var(--border-strong)] bg-[var(--surface-accent)] text-[var(--pill-accent-text)] hover:brightness-105",
    upcoming: "border-[color:var(--border-soft)] bg-[var(--surface-panel)] text-[var(--text-muted)]",
  },
  input: {
    base: "w-full rounded-xl border border-[color:var(--border-soft)] bg-[var(--surface-panel)] px-3 py-2.5 text-[var(--text-primary)] shadow-sm placeholder:text-[var(--text-muted)]",
    focus: "focus:outline-none focus:ring-2 focus:ring-[var(--ring-accent)] focus:border-amber-400",
  },
  panel: {
    base: "rounded-[1.5rem] border border-[color:var(--border-soft)] bg-[var(--surface-panel)] p-5 shadow-sm",
    muted: "rounded-2xl border border-[color:var(--border-soft)] bg-[var(--surface-muted)] px-4 py-3",
    accent: "rounded-[1.5rem] border border-amber-200/80 bg-[var(--surface-accent)] p-5",
  },
  text: {
    heading: "text-[var(--text-primary)]",
    body: "text-sm leading-6 text-[var(--text-secondary)]",
    muted: "text-sm text-[var(--text-muted)]",
    label: "text-[11px] font-semibold uppercase tracking-[0.22em] text-[var(--text-muted)]",
  },
  pill: {
    base: "rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-wide",
    muted: "border-[color:var(--border-soft)] bg-[var(--pill-muted-bg)] text-[var(--pill-muted-text)]",
    accent: "border-amber-200 bg-[var(--pill-accent-bg)] text-[var(--pill-accent-text)]",
    info: "border-[color:var(--border-soft)] bg-[var(--surface-panel)] text-[var(--text-accent)]",
  },
  notification: {
    viewport: "pointer-events-none fixed right-4 top-4 z-50 flex w-[min(100vw-2rem,24rem)] flex-col gap-3 sm:right-6 sm:top-6",
    card: "pointer-events-auto overflow-hidden rounded-[1.5rem] border bg-[var(--surface-panel)] p-4 shadow-[var(--shadow-soft)] backdrop-blur transition-all duration-300",
    iconWrap: "flex h-11 w-11 items-center justify-center rounded-2xl border",
    closeButton: "rounded-full border border-transparent p-2 text-[var(--text-muted)] transition hover:border-[color:var(--border-soft)] hover:bg-[var(--surface-panel)] hover:text-[var(--text-primary)]",
    title: "text-sm font-black tracking-tight text-[var(--text-primary)]",
    message: "text-sm leading-6 text-[var(--text-secondary)]",
    progressTrack: "mt-4 h-1 overflow-hidden rounded-full bg-[var(--surface-muted)]",
  },
  emptyState: "rounded-2xl border border-dashed border-[color:var(--border-soft)] bg-[var(--surface-muted)] px-4 py-6 text-center text-sm text-[var(--text-muted)]",
};

const styles = {
  ...palette,
  semantic,
  tokens,
};

export default styles;
