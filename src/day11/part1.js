const getGrid = input => input
  .split("\n")
  .map(rowStr => rowStr.split(""))

const expandGrid = grid => {
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

  return grid.reduce((expandedGrid, row, rowI) => {
    const updatedRow = row.reduce((expandedRow, char, colI) => {
      const newRow = [...expandedRow, char]
      if (columnsToAdd.has(colI)) newRow.push('.')
      return newRow
    }, [])

    const updatedGrid = [...expandedGrid, updatedRow]
    if (rowsToAdd.has(rowI)) {
      updatedGrid.push(
        Array.from({ length: row.length + columnsToAdd.size })
          .map(() => '.')
      )
    }
    return updatedGrid
  }, [])
}

const getGalaxies = grid => grid
  .reduce((galaxies, row, rowI) => [
    ...galaxies, 
    ...row.reduce((rowGalaxies, col, colI) => 
      [...rowGalaxies, col === '#' ? `${colI},${rowI}` : false]
        .filter(Boolean)
    , [])
  ], [])

const getShortestPaths = (grid, galaxies) => {
  let paths = []
  galaxies.forEach((galaxy, i) => {
    const [fromX, fromY] = galaxy.split(",").map(Number)
    const galaxyPaths = []
    galaxies.slice(i + 1).forEach(compareGalaxy => {
      const [toX, toY] = compareGalaxy.split(",").map(Number)
      const distance = Math.abs(toX - fromX) + Math.abs(toY - fromY)
      galaxyPaths.push(distance)
    })
    if (galaxyPaths.length === 0) return
    paths = [...paths, ...galaxyPaths]
  })
  return paths
}

const run = input => {
  const grid = getGrid(input)
  const expandedGrid = expandGrid(grid)
  // grid
  //   .forEach((row, rowI) => console.log(
  //     JSON.stringify(row
  //       .map((char, i) => char + " ")
  //       .join("")
  //     ).replaceAll("\"", "")
  //   ))
  //   console.log('')
  // expandedGrid
  //   .forEach((row, rowI) => console.log(
  //     JSON.stringify(row
  //       .map((char, i) => char + " ")
  //       .join("")
  //     ).replaceAll("\"", "")
  //   ))

  const galaxies = getGalaxies(expandedGrid)
  return getShortestPaths(expandedGrid, galaxies)
    .reduce((sum, distance) => sum + distance, 0)
}

module.exports = run