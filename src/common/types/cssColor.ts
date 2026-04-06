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
  primary: palette.green,
  secondary: palette.gray,
  success: palette.green,
  warning: palette.yellow,
  error: palette.red,
  info: palette.blue,
  accent: palette.purple,
  muted: palette.gray,
};

const tokens: ComponentTokens = {
  button: {
    base: "px-4 py-2 rounded-lg font-semibold border transition-all duration-200",
    primary: `bg-indigo-600 text-white border-indigo-600 hover:bg-indigo-700`,
    secondary: `bg-slate-100 text-slate-900 border-slate-300 hover:bg-slate-200`,
    danger: `bg-rose-100 text-rose-800 border-rose-600 hover:bg-rose-200`,
    ghost: "bg-transparent text-slate-900 border-transparent hover:bg-slate-100",
  },
  badge: "rounded-full text-xs px-3 py-1 font-semibold border",
  card: {
    base: "rounded-xl border p-4 bg-white shadow-sm",
    hover: "transition-all duration-200 hover:shadow-lg hover:scale-[1.02]",
    selected: `${palette.green.bg} ${palette.green.border}`,
  },
  stepIndicator: {
    bar: "relative w-full h-2 rounded-full mb-4",
    stepBase: "w-10 h-10 flex items-center justify-center font-semibold rounded-md border transition-colors",
    active: `${palette.blue.bg} ${palette.blue.border} ${palette.blue.text}`,
    completed: `${palette.green.bg} ${palette.green.border} ${palette.green.text} ${palette.green.bgHover}`,
    upcoming: `${palette.gray.bg} ${palette.gray.border} ${palette.gray.lightText}`,
  },
  input: {
    base: "w-full rounded-lg border px-3 py-2 bg-white text-slate-900",
    focus: "focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500",
  },
};

const styles = {
  ...palette,
  semantic,
  tokens,
};

export default styles;
