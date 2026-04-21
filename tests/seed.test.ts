import { seedTripsIfEmpty, seedCategoriesIfEmpty, seedActivitiesIfEmpty, seedTargetsIfEmpty } from '../db/seed';
import { db } from '../db/client';

jest.mock('../db/client', () => ({
  db: {
    select: jest.fn(),
    insert: jest.fn(),
  },
}));

const mockDb = db as unknown as { select: jest.Mock; insert: jest.Mock };

describe('seed functions', () => {
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

  it('inserts categories when the table is empty', async () => {
    const mockValues = jest.fn().mockResolvedValue(undefined);
    const mockFrom = jest.fn().mockResolvedValue([]);
    mockDb.select.mockReturnValue({ from: mockFrom });
    mockDb.insert.mockReturnValue({ values: mockValues });

    await seedCategoriesIfEmpty();

    expect(mockDb.insert).toHaveBeenCalled();
    expect(mockValues).toHaveBeenCalledWith(
      expect.arrayContaining([
        expect.objectContaining({ name: 'Sightseeing' }),
        expect.objectContaining({ name: 'Outdoors' }),
        expect.objectContaining({ name: 'Entertainment' }),
        expect.objectContaining({ name: 'Food' }),
      ])
    );
  });

  it('does nothing when categories already exist', async () => {
    const mockFrom = jest.fn().mockResolvedValue([
      { id: 1, name: 'Existing Category', colour: '#000000', icon: 'Existing icon' },
    ]);
    mockDb.select.mockReturnValue({ from: mockFrom });

    await seedCategoriesIfEmpty();

    expect(mockDb.insert).not.toHaveBeenCalled();
  });

  it('inserts activities when the table is empty', async () => {
    const mockValues = jest.fn().mockResolvedValue(undefined);
    const mockFrom = jest.fn().mockResolvedValue([]);
    mockDb.select.mockReturnValue({ from: mockFrom });
    mockDb.insert.mockReturnValue({ values: mockValues });

    await seedActivitiesIfEmpty();

    expect(mockDb.insert).toHaveBeenCalled();
    expect(mockValues).toHaveBeenCalledWith(
      expect.arrayContaining([
        expect.objectContaining({ title: 'Visit Old Trafford' }),
        expect.objectContaining({ title: 'Go to the Grand Pacific' }),
        expect.objectContaining({ title: 'Visit Eiffel Tower' }),
      ])
    );
  });


  it('does nothing when activities already exist', async () => {
    const mockFrom = jest.fn().mockResolvedValue([
      { id: 1, tripId: 1, title: 'Existing Activity', date: '2026-05-01', durationMinutes: 60, notes: '', categoryId: 1, },
    ]);
    mockDb.select.mockReturnValue({ from: mockFrom });

    await seedActivitiesIfEmpty();

    expect(mockDb.insert).not.toHaveBeenCalled();
  });



  it('inserts targets when the table is empty', async () => {
    const mockValues = jest.fn().mockResolvedValue(undefined);
    const mockFrom = jest.fn().mockResolvedValue([]);
    mockDb.select.mockReturnValue({ from: mockFrom });
    mockDb.insert.mockReturnValue({ values: mockValues });

    await seedTargetsIfEmpty();

    expect(mockDb.insert).toHaveBeenCalled();
    expect(mockValues).toHaveBeenCalledWith(
      expect.arrayContaining([
        expect.objectContaining({ timePeriod: 'weekly', targetMinutes: 300 }),
        expect.objectContaining({ timePeriod: 'monthly', targetMinutes: 1200 }),
      ])
    );
  });


  it('does nothing when targets already exist', async () => {
    const mockFrom = jest.fn().mockResolvedValue([
      { id: 1, timePeriod: 'weekly', targetMinutes: 100, categoryId: 1, },
    ]);
    mockDb.select.mockReturnValue({ from: mockFrom });

    await seedTargetsIfEmpty();

    expect(mockDb.insert).not.toHaveBeenCalled();
  });
});