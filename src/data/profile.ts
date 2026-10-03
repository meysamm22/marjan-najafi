// Language-independent facts. Translatable copy lives in src/i18n/*.json.
export const profile = {
  name: 'Marjan Najafi Dehkordi',
  shortName: 'Marjan Najafi',
  monogram: 'MN',
  figmaUrl: 'https://www.figma.com/design/uhbUNrZsGehHWuPvrALoX5/Tebeto?node-id=110-11422',
};

// Survey results (percent of respondents), in the order of the lang-file labels.
export const survey = [
  [51, 21, 21, 7, 0],
  [25, 21, 19, 3, 11, 21, 12],
  [11, 21, 11, 6, 5, 9],
  [22, 19, 28, 17, 14],
];

// Competitor benchmark, one row per feature label in the lang files.
// `null` hides the column until the data is filled in.
export const benchmark: { name: string; values: boolean[] | null }[] = [
  { name: 'Paziresh24', values: [true, true, true, true, true, true, false, true, true, true, true, false, true] },
  { name: 'DrDr', values: null },
  { name: 'Doctoreto', values: [true, true, true, true, true, true, true, true, true, true, true, true, false] },
];

// Hi-fi screens: drop exports into src/assets/tebeto/screens/ (png, jpg or webp).
// Files listed here come first, in this order; any others follow alphabetically.
export const screenOrder = ['schedule', 'home', 'tebot-chat'];

export const styleGuide = {
  colors: [
    { key: 'primary', hex: '#144EDE' },
    { key: 'secondary', hex: '#2A94E0' },
    { key: 'text', hex: '#575757' },
    { key: 'success', hex: '#43A047' },
  ],
  type: [
    { name: 'Heading 1', size: 20, weight: 400, label: 'Regular' },
    { name: 'Heading 2', size: 16, weight: 400, label: 'Regular' },
    { name: 'Heading 3', size: 16, weight: 600, label: 'Semibold' },
    { name: 'Heading 4', size: 16, weight: 700, label: 'Bold' },
    { name: 'Body', size: 13, weight: 500, label: 'Medium' },
    { name: 'Body', size: 12, weight: 400, label: 'Regular' },
  ],
};
