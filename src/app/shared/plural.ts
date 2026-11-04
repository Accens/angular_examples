/** "wynik / wyniki / wyników" dla liczby wyników. */
export function resultsLabel(n: number): string {
  const mod10 = n % 10;
  const mod100 = n % 100;
  if (n === 1) {
    return '1 wynik';
  }
  if (mod10 >= 2 && mod10 <= 4 && !(mod100 >= 12 && mod100 <= 14)) {
    return `${n} wyniki`;
  }
  return `${n} wyników`;
}

export const FRUITS = [
  'Jabłko',
  'Jagoda',
  'Banan',
  'Gruszka',
  'Śliwka',
  'Truskawka',
  'Malina',
  'Borówka',
  'Winogrono',
  'Pomarańcza',
  'Cytryna',
  'Arbuz',
];
