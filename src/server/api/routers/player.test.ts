import { prismaMock, setupMockGuesses, setupMockStreaks } from 'sod/sod-t3/__mocks__/prisma'
import { playerRouter } from './player'
import { type inferProcedureInput } from '@trpc/server'
import { type Guess, type Mode } from '@prisma/client'

// Define types for our mock data structures
interface MockGuess extends Omit<Guess, 'mode'> {
  mode: Pick<Mode, 'name'>;
}

interface MockStreak {
  mode: {
    name: string;
  };
  _count: {
    _all: number;
  };
}

interface TestContext {
  prisma: typeof prismaMock;
}

// Helper type for the procedure result
type ProcedureResult = {
  todayGuesses: MockGuess[];
  dailyStreak: Record<string, MockGuess[]>;
  maxStreak: Record<string, number>;
  currentStreak: number;
};

describe('playerRouter', () => {
  describe('get', () => {
    it('should return user data with correct streaks', async () => {
      // Define mock data with proper types and realistic mode names
      const mockGuesses: MockGuess[] = [
        {
          id: 1,
          date: new Date(),
          userId: 1,
          modeId: 1,
          songSpotifyId: 'abc123',
          success: true,
          diff: {},
          mode: { name: 'Pop Hits' },  // Using realistic mode name
        },
        {
          id: 2,
          date: new Date(),
          userId: 1,
          modeId: 2,
          songSpotifyId: 'def456',
          success: false,
          diff: {},
          mode: { name: 'Rock Classics' },  // Using realistic mode name
        },
      ]

      const mockStreaks: MockStreak[] = [
        { mode: { name: 'Pop Hits' }, _count: { _all: 5 } },
        { mode: { name: 'Rock Classics' }, _count: { _all: 3 } },
      ]

      // Setup mocks using helper functions with typed data
      setupMockGuesses(mockGuesses)
      setupMockStreaks(mockStreaks)

      // Define input type using tRPC inference
      type Input = inferProcedureInput<typeof playerRouter['get']>
      const input: Input = { anonymousUserId: 'test-user-id' }

      // Create properly typed context
      const ctx: TestContext = { prisma: prismaMock }

      // Call the procedure with proper types
      const result = await playerRouter.get.call(
        { ctx, input },
        input
      ) as ProcedureResult

      // Type-safe assertions
      expect(result).toBeDefined()
      expect(result.todayGuesses).toEqual<MockGuess[]>(mockGuesses)
      expect(result.dailyStreak).toEqual<Record<string, MockGuess[]>>({
        'Pop Hits': [mockGuesses[0]],
        'Rock Classics': []
      })
      expect(result.maxStreak).toEqual<Record<string, number>>({
        'Pop Hits': 5,
        'Rock Classics': 3
      })
      expect(result.currentStreak).toEqual<number>(1)

      // Type-safe mock call verifications
      expect(prismaMock.guess.findMany).toHaveBeenCalledWith({
        where: {
          user: {
            anonymousUserId: 'test-user-id'
          },
          date: {  // Changed from createdAt to date based on your schema
            gte: expect.any(Date),
            lt: expect.any(Date),
          },
        },
        include: {
          mode: true
        }
      })

      expect(prismaMock.guess.groupBy).toHaveBeenCalledWith({
        by: ['modeId'],  // Changed from 'mode' to 'modeId' based on your schema
        where: {
          user: {
            anonymousUserId: 'test-user-id'
          },
          success: true
        },
        _count: {
          _all: true
        }
      })
    })

    it('should handle case with no guesses', async () => {
      setupMockGuesses([])
      setupMockStreaks([])

      type Input = inferProcedureInput<typeof playerRouter['get']>
      const input: Input = { anonymousUserId: 'test-user-id' }
      const ctx: TestContext = { prisma: prismaMock }

      const result = await playerRouter.get.call(
        { ctx, input },
        input
      ) as ProcedureResult

      expect(result.todayGuesses).toEqual<MockGuess[]>([])
      expect(result.dailyStreak).toEqual<Record<string, MockGuess[]>>({})
      expect(result.maxStreak).toEqual<Record<string, number>>({})
      expect(result.currentStreak).toEqual<number>(0)
    })

    it('should handle database errors', async () => {
      prismaMock.guess.findMany.mockRejectedValue(new Error('Database error'))

      type Input = inferProcedureInput<typeof playerRouter['get']>
      const input: Input = { anonymousUserId: 'test-user-id' }
      const ctx: TestContext = { prisma: prismaMock }

      await expect(
        playerRouter.get.call(
          { ctx, input },
          input
        )
      ).rejects.toThrow('An error occurred while processing the user data')
    })
  })
})