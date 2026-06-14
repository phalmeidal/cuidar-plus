import * as seedData from '../../api/prisma/seedData.js';
import * as originalMockData from '../../src/services/mockData.js';

describe('teaching seed data', () => {
  it('preserves the original frontend mock dataset', () => {
    expect(seedData.userProfile).toMatchObject(originalMockData.userProfile);
    expect(seedData.riskSummary).toEqual(originalMockData.riskSummary);
    expect(seedData.fallEvents).toEqual(originalMockData.fallEvents);
    expect(seedData.movementPatterns).toEqual(originalMockData.movementPatterns);
  });
});
