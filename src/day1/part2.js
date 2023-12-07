numberDict = {
  zero: 0,
  one: 1,
  two: 2,
  three: 3,
  four: 4,
  five: 5,
  six: 6,
  seven: 7,
  eight: 8,
  nine: 9
}

const getDigit = (row, reverse = false) => {
  for (let letterIndex = 0; letterIndex < row.length; letterIndex++) {
    var remainingLetters = reverse
      ? row.slice(0, row.length - letterIndex)
      : row.slice(letterIndex)

    const singleLetter = reverse
      ? remainingLetters.slice(remainingLetters.length - 1)
      : remainingLetters[0]
    if (!isNaN(Number(singleLetter))) return Number(singleLetter)
    
    const foundNumberStr = Object
      .keys(numberDict)
      .find(numberStr => reverse
        ? remainingLetters.endsWith(numberStr)
        : remainingLetters.startsWith(numberStr))

    if (foundNumberStr) return numberDict[foundNumberStr]

  }
}

const getDigits = row =>
  `${getDigit(row)}` + `${getDigit(row, true)}`

const run = (input) => {
  const rows = input.split("\n")
  const digitRows = rows.map(getDigits)

  return digitRows.reduce((acc, digitRow) => acc + Number(digitRow), 0)
}

module.exports = run