// Fisher–Yates shuffle, in place.
function shuffleArray<T>(array: T[]): void {
  for (let i = array.length - 1; i > 0; i--) {
    const swapIndex = Math.floor(Math.random() * (i + 1));
    [array[i], array[swapIndex]] = [array[swapIndex] as T, array[i] as T];
  }
}

export { shuffleArray };
