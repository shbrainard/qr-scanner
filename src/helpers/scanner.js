const UID_REGEX = /{uid_(.+?)}/i;
const GENOTYPE_REGEX = /{genotype_(.+?)}/i;
const POTNUMBER_REGEX = /^([0-9]{4})$/;

export const getUid = string => {
  const match = UID_REGEX.exec(string);
  if (match && match[1]) {
    return match[1];
  }
  return null;
};

export const getGenotype = string => {
  const match = GENOTYPE_REGEX.exec(string);
  if (match && match[1]) {
    return match[1];
  }
  return null;
};

export const getPotNumber = string => {
  const match = POTNUMBER_REGEX.exec(string);
  if (match && match[1]) {
    return match[1];
  }
  return null;
};
