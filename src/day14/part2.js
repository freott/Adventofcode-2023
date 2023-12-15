const getGroups = input => {
  const rows = input.split("\n")
  const xGroups = []
  const xGroups = []
  let activeGroup
  for (let x = 0; x < rows[0].length; x++) {
    xGroups[x] = []
    yGroups[x] = []
    for (let y = 0; y < rows.length; y++) {
      const char = rows[y][x]
      if (char === '#') {
        if (activeGroup) yGroups.push(activeGroup)
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
      yGroups.push(activeGroup)
      activeGroup = undefined
    }
  }

  return [yGroups, rows.length]
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