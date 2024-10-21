// import seedrandom from 'seedrandom';
function seedrandom() {return 1;}
function getRandom64BitNumber(): string {
    const random64BitNumber = BigInt.asUintN(64, BigInt(Math.floor(Math.random() * Number.MAX_SAFE_INTEGER)));
    return random64BitNumber.toString();
  }

function ShuffleIndexes(seed: string, maxIndex: number): number[] {
    const rng = seedrandom(seed);  // Create a seeded random number generator
    const randomIndexes = [];

    // Generate maxIndex random indices in the range [0, maxIndex - 1]
    for (let i = 0; i < maxIndex; i++) {
        randomIndexes.push(Math.floor(rng() * maxIndex));
    }

    return randomIndexes;
}

export { getRandom64BitNumber, ShuffleIndexes };