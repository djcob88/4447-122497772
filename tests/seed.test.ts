import { seedTripsIfEmpty } from '../db/seed';
import { db } from '../db/client';

jest.mock('../db/client', () => ({
  db: {
    select: jest.fn(),
    insert: jest.fn(),
  },
}));

const mockDb = db as unknown as { select: jest.Mock; insert: jest.Mock };

describe('seedTripsIfEmpty', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('inserts trips when the table is empty', async () => {
    const mockValues = jest.fn().mockResolvedValue(undefined);
    const mockFrom = jest.fn().mockResolvedValue([]);
    mockDb.select.mockReturnValue({ from: mockFrom });
    mockDb.insert.mockReturnValue({ values: mockValues });

    await seedTripsIfEmpty();

    expect(mockDb.insert).toHaveBeenCalled();
    expect(mockValues).toHaveBeenCalledWith(
      expect.arrayContaining([
        expect.objectContaining({ title: 'UK Trip' }),
        expect.objectContaining({ title: 'Greece Trip' }),
        expect.objectContaining({ title: 'France Trip' }),
      ])
    );
  });

  it('does nothing when trips already exist', async () => {
    const mockFrom = jest.fn().mockResolvedValue([
      { id: 1, title: 'Existing Trip', destination: 'UK', startDate: '2026-05-01', endDate: '2026-05-08', notes: '' },
    ]);
    mockDb.select.mockReturnValue({ from: mockFrom });

    await seedTripsIfEmpty();

    expect(mockDb.insert).not.toHaveBeenCalled();
  });
});
