export const bodyPartDefaultColor = 'teal.400';

export const BODY_PART_COLOR = {
  teal: 'teal.400',
  red: 'red.400',
  orange: 'orange.400',
  yellow: 'yellow.400',
  green: 'green.400',
  blue: 'blue.400',
  purple: 'purple.400',
  pink: 'pink.400',
};

export type BodyPartColor = keyof typeof BODY_PART_COLOR;

export const BodyPartColorList = Object.entries(BODY_PART_COLOR).map(([name, displayName]) => ({
  name: name as BodyPartColor,
  displayName,
}));

export const displayBodyPartColor = (name: string): (typeof BODY_PART_COLOR)[BodyPartColor] | '' => {
  const bodyPartColor = BodyPartColorList.find((bodyPartColor) => bodyPartColor.name === name);
  if (bodyPartColor) return bodyPartColor.displayName;
  return '';
};
