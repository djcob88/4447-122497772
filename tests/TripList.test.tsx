import React from 'react';
import { render } from '@testing-library/react-native';
import { TripContext } from '../app/_layout';
import IndexScreen from '../app/(tabs)/index';

jest.mock('@/db/client', () => ({
  db: {
    select: jest.fn(),
    insert: jest.fn(),
  },
}));

jest.mock('expo-router', () => ({
  useRouter: () => ({ push: jest.fn(), back: jest.fn() }),
}));

jest.mock('react-native-safe-area-context', () => {
  const { View } = require('react-native');
  return { SafeAreaView: View };
});

const mockTrip = {
  id: 1,
  title: 'Test Trip',
  destination: 'Test Destination',
  startDate: '2026-05-01',
  endDate: '2026-05-08',
  notes: 'Test Notes',
};

describe('IndexScreen', () => {
  it('renders the trip and the add button', () => {
    const { getByText } = render(
      <TripContext.Provider value={{ trips: [mockTrip], setTrips: jest.fn() }}>
        <IndexScreen />
      </TripContext.Provider>
    );

    expect(getByText('Test Trip')).toBeTruthy();
    expect(getByText('Add Trip')).toBeTruthy();
  });
});
