import { PrismaClient, Guess, Mode } from '@prisma/client'
import { mockDeep, mockReset, DeepMockProxy } from 'jest-mock-extended'
import { db } from '~/server/db'

// Type definitions
export interface MockGuess extends Omit<Guess, 'mode'> {
  mode: Pick<Mode, 'name'>;
}

export interface MockStreak {
  mode: {
    name: string;
  };
  _count: {
    _all: number;
  };
}

export type Context = {
  prisma: PrismaClient;
}

export type MockContext = {
    prisma: DeepMockProxy<PrismaClient>;
}

// Guard type for operations
type GuessOperations = keyof typeof prismaMock.guess;

// Create the mock context
export const createMockContext = (): MockContext => ({
    prisma: mockDeep<PrismaClient>() as DeepMockProxy<PrismaClient>
})

// Mock the Prisma module
jest.mock('~/server/db', () => ({
  db: mockDeep<PrismaClient>(),
}))

// Reset all mocks before each test
beforeEach(() => {
  mockReset(prismaMock)
})

export const prismaMock = db as unknown as DeepMockProxy<PrismaClient>

// Rest of the mock helpers remain the same...
export const setupMockGuesses = (guesses: MockGuess[]): void => {
  prismaMock.guess.findMany.mockResolvedValue(guesses)
}

export const setupMockStreaks = (streaks: MockStreak[]): void => {
  prismaMock.guess.groupBy.mockResolvedValue(streaks)
}

export const simulatePrismaError = (operation: GuessOperations): void => {
  prismaMock.guess[operation].mockRejectedValue(new Error('Simulated Prisma error'))
}

export const mockTransaction = <T>(): jest.Mock<Promise<T>> => {
  const transactionMock = jest.fn().mockImplementation(
    (callback: (prisma: PrismaClient) => Promise<T>) => callback(prismaMock)
  )
  prismaMock.$transaction = transactionMock as any
  return transactionMock
}

// Helper functions
export const createMockGuess = (overrides?: Partial<MockGuess>): MockGuess => {
  const defaultGuess: MockGuess = {
    id: 1,
    createdAt: new Date(),
    userId: 1,
    modeId: 1,
    songSpotifyId: 'default-song-id',
    success: true,
    diff: {},
    mode: { name: 'easy' },
  }
  return { ...defaultGuess, ...overrides }
}

export const createMockStreak = (
  modeName: string, 
  count: number
): MockStreak => {
  return {
    mode: { name: modeName },
    _count: { _all: count }
  }
}