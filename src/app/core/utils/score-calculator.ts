export function calculateStats(correct: number, mistakes: number, elapsedSeconds: number) {
  const total = correct + mistakes;
  const accuracy = total ? correct / total * 100 : 100;
  const kpm = elapsedSeconds > 0 ? correct / (elapsedSeconds / 60) : 0;
  return { accuracy, kpm, score: kpm * Math.pow(accuracy / 100, 2) };
}

