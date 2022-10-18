import { splitTokenByPosition } from '@core/formatter/utils/helpers/format';

describe('\'splitTokenByPosition\' helper', () => {
  test('After position characters belong to second splitted token', () => {
    const tokenForSplitValue = 'text';
    const splitPosition: Position = 2;

    const tokenForSplit: TextToken = { type: 'text', value: tokenForSplitValue, formats: [] };
    const expectedFirstSplittedToken: TextToken = { type: 'text', value: tokenForSplitValue.slice(0, splitPosition), formats: [] };
    const expectedSecondSplittedToken: TextToken = { type: 'text', value: tokenForSplitValue.slice(splitPosition), formats: [] };

    const [firstSplittedToken, secondSplittedToken] = splitTokenByPosition(tokenForSplit, splitPosition);
    expect(firstSplittedToken).toStrictEqual(expectedFirstSplittedToken);
    expect(secondSplittedToken).toStrictEqual(expectedSecondSplittedToken);
  });

  test('Split set original token formats for both output tokens', () => {
    const tokenForSplitValue = 'text';
    const tokenForSplitFormats: TokenFormat[] = ['bold'];
    const splitPosition: Position = 2;

    const tokenForSplit: TextToken = { type: 'text', value: tokenForSplitValue, formats: tokenForSplitFormats };
    const expectedFirstSplittedToken: TextToken = { type: 'text', value: tokenForSplitValue.slice(0, splitPosition), formats: tokenForSplitFormats };
    const expectedSecondSplittedToken: TextToken = { type: 'text', value: tokenForSplitValue.slice(splitPosition), formats: tokenForSplitFormats };

    const [firstSplittedToken, secondSplittedToken] = splitTokenByPosition(tokenForSplit, splitPosition);
    expect(firstSplittedToken).toStrictEqual(expectedFirstSplittedToken);
    expect(secondSplittedToken).toStrictEqual(expectedSecondSplittedToken);
  });
});
