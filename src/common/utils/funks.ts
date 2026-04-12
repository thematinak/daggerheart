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