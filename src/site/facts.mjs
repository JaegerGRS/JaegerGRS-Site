// Single source of truth for facts that recur across pages. Edit a value here and every page follows.
// Values marked "unverified" are carried over from the owner's own description and need confirming.

export const PROFILE = {
  name: 'Jaeger Stratton',
  fullName: 'Jaeger George Richard Stratton',
  jobTitle: 'IT Technician and Independent Developer',
  location: 'United Kingdom',
  availability: 'Open to remote, hybrid and international IT opportunities',
  interestSince: '2013', // unverified: interest in IT, not paid employment
  firstWebsites: '2014', // unverified
  pcBuildingSince: '2016', // unverified: year of first own PC and first builds
};

// The owner's own description of the main machine. Not read from the live panel, and not yet confirmed.
export const WORKSTATION = { cpu: 'AMD Ryzen 9 5950X', ram: '64 GB', gpu: 'NVIDIA RTX 3070 Ti', verified: false };

// Allowed values, defined on the Projects page status key.
export const STATUS = {
  hardware: 'Active',
  rigApi: 'Released',
  svart: 'In development',
  jae: 'Prototype',
  greySignal: 'Active',
  jaethetech: 'Active',
  storyAi: 'In development',
  personalAi: 'In development',
};

export const PROJECT_COUNT = 7; // entries in the Projects directory

export const GITHUB = 'https://github.com/JaegerGRS';
export const REPOS = {
  site: `${GITHUB}/JaegerGRS-Site`,
  jae: `${GITHUB}/JAE`,
  jaethetech: 'https://github.com/JaeTheTech/JaeTheTech.com',
};

// No CV is published until verified source information is supplied.
export const CV = null;

export const CONTACT_EMAIL = 'jaegergrstratton@gmail.com';
