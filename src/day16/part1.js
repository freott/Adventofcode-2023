const getGrid = input => input.split("\n").map(rowStr => rowStr.split("").map(() => '.'))
const getTiles = input => {
  const tiles = {}
  const rows = input.split("\n").map(rowStr => rowStr.split(""))
  rows.forEach((row, y) => {
    row.forEach((tile, x) => {
      if (tile !== ".") tiles[`${x},${y}`] = tile
    })
  })
  return { tiles, maxX: rows[0].length - 1, maxY: rows.length - 1 }
}

const log = (grid, paths) => {
  let paintedGrid = grid
  paths.forEach(path => {
    const [x, y] = path.split(",")
    paintedGrid[y][x] = '#'
  })
  paintedGrid.forEach(row => {
    // console.log(row.join(""))
  })
}

const runBeams = (tiles, maxX, maxY) => {
  const memorizedPaths = new Set()
  const beams = [{ x: 0, y: 0, dir: "r" }]

  const add = (x, y, dir) => beams.push({ x, y, dir })
  while (beams.length) {
    beams.forEach(({ x, y, dir }, i) => {
      const discard = () => beams.splice(i, 1)
      const step = (x, y, dir) => beams[i] = { x, y, dir }

      const path = `${x},${y},${dir}`
      const tilePath = `${x},${y}`
      const tile = tiles[tilePath]

      if (x > maxX || 0 > x || y > maxY || 0 > y) return discard()
      if (memorizedPaths.has(path)) return discard()
      memorizedPaths.add(path)

      switch (dir) {
        case 'r': {
          if (!tile) return step(x + 1, y, dir)
          switch (tile) {
            case '|':
              discard()
              add(x, y - 1, 'u')
              add(x, y + 1, 'd')
              return
            case '-':
              return step(x + 1, y, dir)
            case '\\':
              return step(x, y + 1, 'd')
            case '/':
              return step(x, y - 1, 'u')
          }
        }
        case 'l': {
          if (!tile) return step(x - 1, y, dir)
          switch (tile) {
            case '|':
              discard()
              add(x, y - 1, 'u')
              add(x, y + 1, 'd')
              return
            case '-':
              return step(x - 1, y, dir)
            case '\\':
              return step(x, y - 1, 'u')
            case '/':
              return step(x, y + 1, 'd')
          }
        }
        case 'u': {
          if (!tile) return step(x, y - 1, dir)
          switch (tile) {
            case '|':
              return step(x, y - 1, dir)
            case '-':
              discard()
              add(x - 1, y, 'l')
              add(x + 1, y, 'r')
              return
            case '\\':
              return step(x - 1, y, 'l')
            case '/':
              return step(x + 1, y, 'r')
          }
        }
        case 'd': {
          if (!tile) return step(x, y + 1, dir)
          switch (tile) {
            case '|':
              return step(x, y + 1, dir)
            case '-':
              discard()
              add(x - 1, y, 'l')
              add(x + 1, y, 'r')
              return
            case '\\':
              return step(x + 1, y, 'r')
            case '/':
              return step(x - 1, y, 'l')
          }
        }
      }
    })
  }

  return memorizedPaths
}

const run = input => {
  const { tiles, maxX, maxY } = getTiles(input)
  const paths = runBeams(tiles, maxX, maxY)
  const uniquePaths = new Set()
  paths.forEach(pathStr => {
    const [x, y] = pathStr.split(",")
    uniquePaths.add(`${x},${y}`)
  })
  log(getGrid(input), [...uniquePaths])
  return uniquePaths.size
}

module.exports = run