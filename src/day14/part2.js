const getGroups = input => {
  const rows = input.split("\n")
  const xMax = rows[0].length - 1
  const yMax = rows.length - 1
  const xGroups = []
  const yGroups = []
  const xGroupLookup = {}
  const yGroupLookup = {}
  for (let y = 0; y < rows.length; y++) {
    for (let x = 0; x < rows[0].length; x++) {
      const char = rows[y][x]
      if (char === '#') continue
      let yGroup = yGroupLookup[`${x},${y - 1}`]
      if (!yGroup) {
        yGroup = { xStart: x, yStart: y, stones: 0, range: 0 }
        yGroups.push(yGroup)
      }
      yGroupLookup[`${x},${y}`] = yGroup
      if (char === 'O') yGroup.stones += 1
      yGroup.range += 1

      let xGroup = xGroupLookup[`${x - 1},${y}`]
      if (!xGroup) {
        xGroup = { xStart: x, yStart: y, stones: 0, range: 0 }
        xGroups.push(xGroup)
      }
      xGroupLookup[`${x},${y}`] = xGroup
      xGroup.range += 1
    }
  }

  return { xGroups, yGroups, xGroupLookup, yGroupLookup, xMax, yMax }
}

const tilt = (xGroups, yGroups, xGroupLookup, yGroupLookup, direction) => {
  switch (direction) {
    case 'right': {
      yGroups.forEach(group => {
        if (group.stones === 0) return
        let initialStones = group.stones
        const start = group.yStart + (group.range - 1)
        for (let i = 0; i < initialStones; i++) {
          xGroupLookup[`${group.xStart},${start - i}`].stones += 1
          group.stones -= 1
        }
      })
      return
    }
    case 'down': {
      xGroups.forEach(group => {
        if (group.stones === 0) return
        let initialStones = group.stones
        for (let i = 0; i < initialStones; i++) {
          yGroupLookup[`${group.xStart + i},${group.yStart}`].stones += 1
          group.stones -= 1
        }
      })
      return
    }
    case 'left': {
      yGroups.forEach(group => {
        if (group.stones === 0) return
        let initialStones = group.stones
        for (let i = 0; i < initialStones; i++) {
          xGroupLookup[`${group.xStart},${group.yStart + i}`].stones += 1
          group.stones -= 1
        }
      })
      return
    }
    case 'up': {
      xGroups.forEach(group => {
        if (group.stones === 0) return
        let initialStones = group.stones
        const start = group.xStart + (group.range - 1)
        for (let i = 0; i < initialStones; i++) {
          yGroupLookup[`${start - i},${group.yStart}`].stones += 1
          group.stones -= 1
        }
      })
      return
    }
  }
}

const countNorthSum = (groups, yMax) => {
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

const cycle = (xGroups, yGroups, xGroupLookup, yGroupLookup) => {
  let firstRun = true
  for (let i = 0; i < 1_000_000_000; i++) {
    console.log('iteration', i);
    ['up', 'left', 'down', 'right'].forEach(direction => {
      if (firstRun && direction === 'up') {
        firstRun = false
        return
      }
      tilt(xGroups, yGroups, xGroupLookup, yGroupLookup, direction)
    })
  }
}

const run = input => {
  const { xGroups, yGroups, xGroupLookup, yGroupLookup, xMax, yMax } = getGroups(input)
  cycle(xGroups, yGroups, xGroupLookup, yGroupLookup)
  return countNorthSum(yGroups, yMax)
}

module.exports = run