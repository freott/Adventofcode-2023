const getSequence = input => input.split(",")

const getValue = str => {
  let value = 0
  str.split("")
    .forEach(char => {
      value += char.charCodeAt()
      value *= 17
      value %= 256
    })

    return value
}

const run = input => {
  const sequence = getSequence(input)
  const values = sequence.map(getValue)
  return values.reduce((sum, value) => sum + value)
}

module.exports = run