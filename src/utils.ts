export function getRandom64BitNumber() {
    // Generate two 32-bit random numbers using Math.random()
    const high = Math.floor(Math.random() * 0xFFFFFFFF); // Upper 32 bits
    const low = Math.floor(Math.random() * 0xFFFFFFFF);  // Lower 32 bits
  
    // Combine high and low to create a 64-bit number
    const random64BitNumber = (BigInt(high) << 32n) | BigInt(low);
  
    return random64BitNumber;
  }