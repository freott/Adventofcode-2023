const getGrid = input => input
  .split("\n")
  .map(rowStr => rowStr.split(""))

const getExpandIndexes = grid => {
  let rowsToAdd = new Set()
  let columnsToAdd = new Set()
  
  grid.forEach((row, rowI) => {
    if (row.every(char => char === ".")) rowsToAdd.add(rowI)
  })

  for (let colI = 0; colI < grid[0].length; colI++) {
    let hasGalaxy = false
    for (let rowI = 0; rowI < grid.length; rowI++) {
      if (grid[rowI][colI] === '#') {
        hasGalaxy = true
        break
      }
    }
    if (!hasGalaxy) columnsToAdd.add(colI)
  }

  return [[...columnsToAdd], [...rowsToAdd]]
}

const getGalaxies = grid => grid
  .reduce((galaxies, row, rowI) => [
    ...galaxies, 
    ...row.reduce((rowGalaxies, col, colI) => 
      [...rowGalaxies, col === '#' ? `${colI},${rowI}` : false]
        .filter(Boolean)
    , [])
  ], [])

const getShortestPaths = (galaxies, columnsToAdd, rowsToAdd) => {
  let paths = []
  const expand = (index, expandIndexes) => {
    const indexesAmount = expandIndexes.filter(ei => index > ei).length
    return index + (indexesAmount > 0 ? indexesAmount * (1000000 - 1) : 0)
  }
  galaxies.forEach((galaxy, i) => {
    const [fromX, fromY] = galaxy.split(",").map(Number)
    const galaxyPaths = []
    galaxies.slice(i + 1).forEach(compareGalaxy => {
      const [toX, toY] = compareGalaxy.split(",").map(Number)
    
      const distance = Math.abs(
        expand(toX, columnsToAdd) - expand(fromX, columnsToAdd)
      ) + Math.abs(
        expand(toY, rowsToAdd) - expand(fromY, rowsToAdd)
      )
      galaxyPaths.push(distance)
    })
    if (galaxyPaths.length === 0) return
    paths = [...paths, ...galaxyPaths]
  })
  return paths
}

const run = input => {
  const grid = getGrid(input)
  let [columnsToAdd, rowsToAdd] = getExpandIndexes(grid)
  const galaxies = getGalaxies(grid)
  return getShortestPaths(galaxies, columnsToAdd, rowsToAdd)
    .reduce((sum, distance) => sum + distance, 0)
}

module.exports = run