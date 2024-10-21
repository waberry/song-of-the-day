import { userRouter } from '~/server/router/user'
import { prismaMock } from '../__mocks__/prisma'

describe('userRouter', () => {
  it('should return user data', async () => {
    const mockGuesses = [
      {
        id: 1,
        createdAt: new Date(),
        userId: 1,
        modeId: 1,
        songSpotifyId: 'abc123',
        success: true,
        diff: {},
        mode: { name: 'easy' },
      },
      {
        id: 2,
        createdAt: new Date(),
        userId: 1,
        modeId: 2,
        songSpotifyId: 'def456',
        success: false,
        diff: {},
        mode: { name: 'hard' },
      },
    ]

    prismaMock.guess.findMany.mockResolvedValue(mockGuesses)

    prismaMock.guess.groupBy.mockResolvedValue([
      { mode: { name: 'easy' }, _count: { _all: 5 } },
      { mode: { name: 'hard' }, _count: { _all: 3 } },
    ])

    const caller = userRouter.createCaller({} as any) // You might need to mock the context if required

    const result = await caller.get({ anonymousUserId: 'test-user-id' })

    expect(result.todayGuesses).toEqual(mockGuesses)
    expect(result.dailyStreak).toEqual({ easy: [mockGuesses[0]], hard: [] })
    expect(result.maxStreak).toEqual({ easy: 5, hard: 3 })
    expect(result.currentStreak).toEqual(1)
  })
})