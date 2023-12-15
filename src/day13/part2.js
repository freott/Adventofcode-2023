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

const replaceChar = (str, index, replacement) => {
  if (index < 0 || index >= str.length || str.length === 0) {
    return str;
  }
  return str.substring(0, index) + replacement + str.substring(index + 1);
}

const findLine = (pattern, oldVal) => {
  let amountsFromLine = 0

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
      if (!foundMismatch && i !== oldVal) {
        amountsFromLine = i
      }
    }
    return false
  })
  return amountsFromLine
}

const fixPatternAndFindLine = (pattern, oldVal) => {
  let columnsAmountFromLine = 0
  pattern.some((row, rowI) => {
    return row.split("").some((char, charI) => {
      const newPattern = JSON.parse(JSON.stringify(pattern))
      const rowStr = newPattern[rowI]
      newPattern[rowI] = rowStr[charI] === '#'
        ? replaceChar(rowStr, charI, '.')
        : replaceChar(rowStr, charI, '#')

      const val = findLine(newPattern, oldVal)
      if (val !== 0) {
        columnsAmountFromLine = val
        return true
      }
      return false
    })
  })

  return columnsAmountFromLine
}

const run = input => {
  const patterns = getPatterns(input)
  const columnAmounts = patterns
    .reduce((acc, { vertical, horizontal }) => {
      const horizontalValBeforeFix = findLine(horizontal)
      var horizontalVal = fixPatternAndFindLine(horizontal, horizontalValBeforeFix)
      if (horizontalVal !== 0) {
        acc.push(horizontalVal * 100)
        return acc
      }

      const verticalValBeforeFix = findLine(vertical)
      var verticalVal = fixPatternAndFindLine(vertical, verticalValBeforeFix)
      if (verticalVal !== 0) acc.push(verticalVal)
      return acc
    }, [])
  return columnAmounts.reduce((sum, val) => val + sum)
}

module.exports = run