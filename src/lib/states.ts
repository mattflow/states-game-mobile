import states from "../data/states.json";

export const stateNameAbbreviationMap = new Map(
  states.map(({ name, abbreviation }) => [name, abbreviation])
);

export const stateAbbreviationNameMap = new Map(
  states.map(({ abbreviation, name }) => [abbreviation, name])
);

export const stateAbbreviationDimensionMap = new Map(
  states.map(({ abbreviation, dimensions }) => [abbreviation, dimensions])
);

export const stateNameSet = new Set(stateNameAbbreviationMap.keys());
export const stateAbbreviationSet = new Set(stateAbbreviationNameMap.keys());
