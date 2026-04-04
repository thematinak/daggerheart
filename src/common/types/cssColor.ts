export type Color = "gray" | "yellow" | "blue" | "green" | "purple" | "red";

export type ColorStyles = {
    [key in Color]: {
        bg: string;
        border: string;
        bgHover: string;
        fill: string;
        text: string;
        lightText: string
    }
};


const styles: ColorStyles = {
    gray:   { bg: "bg-gray-100",   bgHover: "hover:bg-gray-200",   border: "border-gray-600",   fill: "fill-gray-400",   text: "text-gray-800",   lightText: "text-gray-400" },
    yellow: { bg: "bg-yellow-100", bgHover: "hover:bg-yellow-200", border: "border-yellow-600", fill: "fill-yellow-400", text: "text-yellow-800", lightText: "text-yellow-400" },
    blue:   { bg: "bg-blue-100",   bgHover: "hover:bg-blue-200",   border: "border-blue-600",   fill: "fill-blue-400",   text: "text-blue-800",   lightText: "text-blue-400" },
    green:  { bg: "bg-green-100",  bgHover: "hover:bg-green-200",  border: "border-green-600",  fill: "fill-green-400",  text: "text-green-800",  lightText: "text-green-400" },
    purple: { bg: "bg-purple-100", bgHover: "hover:bg-purple-200", border: "border-purple-600", fill: "fill-purple-400", text: "text-purple-800", lightText: "text-purple-400" },
    red:    { bg: "bg-red-100",    bgHover: "hover:bg-red-200",    border: "border-red-600",    fill: "fill-red-400",    text: "text-red-800",    lightText: "text-red-400" },
};


export default styles;