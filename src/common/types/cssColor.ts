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
    subtitle: string;
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
};

const palette: ColorPalette = {
  gray: {
    bg: "bg-slate-100",
    bgHover: "hover:bg-slate-200",
    border: "border-slate-300",
    fill: "fill-slate-400",
    text: "text-slate-900",
    lightText: "text-slate-500",
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
    shell: "relative min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top,_rgba(251,191,36,0.2),_transparent_30%),radial-gradient(circle_at_bottom_right,_rgba(59,130,246,0.14),_transparent_28%),linear-gradient(180deg,_#fffaf0_0%,_#f8fafc_40%,_#eef2ff_100%)] text-slate-900",
    container: "relative z-10 mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 lg:px-8",
    section: "rounded-[2rem] border border-white/70 bg-white/80 shadow-[0_24px_70px_-36px_rgba(15,23,42,0.35)] backdrop-blur",
    title: "text-3xl font-black tracking-tight text-slate-950 sm:text-4xl",
    subtitle: "text-sm leading-6 text-slate-600 sm:text-base",
  },
  button: {
    base: "inline-flex items-center justify-center rounded-xl border px-4 py-2.5 font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-amber-300/70 focus:ring-offset-2",
    primary: "border-amber-700 bg-[linear-gradient(135deg,_#b45309,_#d97706_55%,_#f59e0b)] text-white shadow-[0_18px_35px_-18px_rgba(180,83,9,0.8)] hover:-translate-y-0.5 hover:brightness-105",
    secondary: "border-slate-300 bg-white/90 text-slate-800 shadow-sm hover:-translate-y-0.5 hover:bg-slate-50",
    danger: "border-rose-300 bg-rose-50 text-rose-800 hover:-translate-y-0.5 hover:bg-rose-100",
    ghost: "border-transparent bg-transparent text-slate-900 hover:bg-white/70",
  },
  badge: "rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-wide shadow-sm",
  card: {
    base: "rounded-[1.5rem] border border-white/70 bg-white/82 p-5 shadow-[0_18px_45px_-30px_rgba(15,23,42,0.3)] backdrop-blur",
    hover: "transition-all duration-200 hover:-translate-y-1 hover:shadow-[0_28px_65px_-35px_rgba(15,23,42,0.38)]",
    selected: "border-amber-500 bg-[linear-gradient(180deg,_rgba(255,251,235,0.98),_rgba(255,247,237,0.96))] ring-1 ring-amber-300/70",
  },
  stepIndicator: {
    bar: "relative h-2 w-full overflow-hidden rounded-full border border-white/60 bg-white/70 shadow-inner",
    progress: "h-full rounded-full bg-[linear-gradient(90deg,_#b45309,_#f59e0b,_#fbbf24)] transition-all duration-300",
    stepBase: "flex h-11 w-11 items-center justify-center rounded-2xl border font-semibold shadow-sm transition-all",
    active: "border-amber-500 bg-amber-100 text-amber-900 ring-2 ring-amber-200/80",
    completed: "border-emerald-300 bg-emerald-50 text-emerald-800 hover:bg-emerald-100",
    upcoming: "border-slate-200 bg-white/80 text-slate-400",
  },
  input: {
    base: "w-full rounded-xl border border-slate-200 bg-white/90 px-3 py-2.5 text-slate-900 shadow-sm placeholder:text-slate-400",
    focus: "focus:outline-none focus:ring-2 focus:ring-amber-300/70 focus:border-amber-400",
  },
};

const styles = {
  ...palette,
  semantic,
  tokens,
};

export default styles;
