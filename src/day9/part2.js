const getHistories = input => input
  .split("\n")
  .map(historyStr => historyStr.split(" ").map(Number))

const getPrediction = history => {
  const sequences = [history]
  while (true) {
    const lastSeq = sequences.slice(-1)[0]
    if (lastSeq.every(number => number === 0)) break
    const nextSeq = lastSeq
      .reduce((acc, nbr, i, arr) => 
        i === 0 ? acc : [...acc, nbr - arr[i - 1]]
      , [])
    sequences.push(nextSeq)
  }
  
  let predictions = []
  sequences.reverse().forEach((seq, i) => i === 0 
    ? predictions.push(0)
    : predictions.push(seq[0] - predictions.slice(-1)[0])
  )
  return predictions.slice(-1)[0]
}

const run = input => {
  const histories = getHistories(input)
  const predictions = histories.map(getPrediction)
  return predictions.reduce((sum, p) => sum + p, 0)
}

module.exports = run