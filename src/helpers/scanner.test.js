import { getGenotype, getUid, getPotNumber } from "./scanner";

test("it finds the uid", () => {
  const uid = "1181-inbr-2018";
  const input = `{UID_${uid}}{Row_2}{Root_2}{Genotype_W280B}{Scale_463}{Photo_1}{Location_Randolph}`;
  const foundUid = getUid(input);
  expect(foundUid).toEqual(uid);
});

test("it does not find the uid", () => {
  const uid = "1181-inbr-2018";
  const input = `{UUID_${uid}}{Row_2}{Root_2}{Genotype_W280B}{Scale_463}{Photo_1}{Location_Randolph}`;
  const foundUid = getUid(input);
  expect(foundUid).toBeNull();
});

test("it finds the uid", () => {
  const genotype = "W280B";
  const input = `{UID_1181-inbr-2018}{Row_2}{Root_2}{Genotype_${genotype}}{Scale_463}{Photo_1}{Location_Randolph}`;
  const foundGenotype = getGenotype(input);
  expect(foundGenotype).toEqual(genotype);
});

test("it does not find the uid", () => {
  const input = `bingenheimer Saatgut`;
  const foundGenotype = getGenotype(input);
  expect(foundGenotype).toBeNull();
});

test("it finds the pot number", () => {
  const input = "0010";
  const foundPotNumber = getPotNumber(input);
  expect(foundPotNumber).toEqual(input);
});
