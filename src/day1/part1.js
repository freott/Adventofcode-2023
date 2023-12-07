const getDigits = (row) => {
  const firstDigit = row
    .split('')
    .find(letter => !isNaN(letter))
  const lastDigit = row
    .split('')
    .reverse()
    .find(letter => !isNaN(letter))
  return firstDigit + lastDigit
}

const run = (input) => {
  const rows = input.split("\n")
  const digitRows = rows.map(getDigits)

  return digitRows.reduce((acc, digitRow) => acc + Number(digitRow), 0)
}

module.exports = run