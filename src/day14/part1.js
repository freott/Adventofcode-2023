const getGroups = input => {
  const rows = input.split("\n")
  const groups = []
  let activeGroup
  for (let x = 0; x < rows[0].length; x++) {
    for (let y = 0; y < rows.length; y++) {
      const char = rows[y][x]
      if (char === '#') {
        if (activeGroup) groups.push(activeGroup)
        activeGroup = undefined
        continue
      }
      if (!activeGroup) {
        activeGroup = {
          yStart: y,
          range: 0,
          stones: 0
        }
      }
      if (char === 'O') {
        activeGroup.stones += 1
      }
      activeGroup.range += 1
    }

    if (activeGroup) {
      groups.push(activeGroup)
      activeGroup = undefined
    }
  }

  return [groups, rows.length]
}

const countSum = (groups, yMax) => {
  let sum = 0
  groups.forEach(group => {
    if (group.stones === 0) return
    const groupMax = yMax - group.yStart
    for (let i = 0; i < group.stones; i++) {
      sum += groupMax - i
    }
  })
  return sum
}

const run = input => {
  const [groups, yMax] = getGroups(input)
  return countSum(groups, yMax)
}

module.exports = run