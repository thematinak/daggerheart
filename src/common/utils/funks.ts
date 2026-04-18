import { Level } from "../types/Character";

export const reduceListById = <T extends { id: string }>(l: T[]) => l.reduce((acc, item) => {
  acc[item.id] = item;
  return acc;
}, {} as Record<string, T>);


export const mapArmorWeight = (baseScore: number) => {
  if (baseScore <= 2) {
    return "light";
  }

  if (baseScore <= 4) {
    return "medium";
  }

  return "heavy";
};

export function getTierColor(tier:  1 | 2 | 3 | 4) {
  if (tier === 1) return "green";
  if (tier === 2) return "blue";
  if (tier === 3) return "purple";
  return "yellow";
}

export const getTierFromLevel = (level: Level) => {
  if (level <= 1) return 1;
  if (level <= 4) return 2;
  if (level <= 7) return 3;
  return 4;
};