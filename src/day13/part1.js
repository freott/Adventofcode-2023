const getPatterns = input => input
  .split("\n\n")
  .map(patternStr => {
    const horizontal = patternStr.split("\n")
    let vertical = []
    for (let i = 0; i < horizontal[0].length; i++) {
      vertical[i] = ''
      horizontal.forEach(row => vertical[i] += row[i])
    }
    return { horizontal, vertical }
  })

const findLine = pattern => {
  let columnsAmountFromLine = 0
  pattern.some((row, i, arr) => {
    if (i === 0) return
    let previousI = i - 1
    if (row === arr[i - 1]) {
      let a = 1
      let foundMismatch = false
      while (arr[previousI - a] && arr[i + a]) {
        if (arr[previousI - a] !== arr[i + a]) foundMismatch = true
        a += 1
      }
      if (!foundMismatch) columnsAmountFromLine = i
    }
    return false
  })
  return columnsAmountFromLine
}

const run = input => {
  const patterns = getPatterns(input)
  const columnAmounts = patterns
    .reduce((acc, { vertical, horizontal}) => {
      var verticalVal = findLine(vertical)
      var horizontalVal = findLine(horizontal)
      if (verticalVal) acc.push(verticalVal)
      if (horizontalVal) acc.push(horizontalVal * 100)
      return acc
    }, [])
  return columnAmounts.reduce((sum, val) => val + sum)
}

module.exports = run