const N = ['|', 'L', 'J', 'S'],
  E = ['-', 'L', 'F', 'S'],
  S = ['|', '7', 'F', 'S'],
  W = ['-', 'J', '7', 'S']

const getGrid = input => input
  .split("\n")
  .map(rowStr => rowStr.split(""))
  
const getLoop = grid => {
  const connectsRight = (x, y) =>  E.includes(grid[y]?.[x])
  const connectsLeft = (x, y) =>  W.includes(grid[y]?.[x])
  const connectsDown = (x, y) => S.includes(grid[y]?.[x])
  const connectsUp = (x, y) => N.includes(grid[y]?.[x])

  const goLeft = (x, y) => [`${x - 1},${y}`, connectsLeft(x, y) && connectsRight(x - 1, y)]
  const goRight = (x, y) => [`${x + 1},${y}`, connectsRight(x, y) && connectsLeft(x + 1, y)]

  const goUp = (x, y) => [`${x},${y - 1}`, connectsUp(x, y) && connectsDown(x, y - 1)]
  const goDown = (x, y) => [`${x},${y + 1}`, connectsDown(x, y) && connectsUp(x, y + 1)]

  let sCord
  let startCord
  let sTile

  const path = new Set()
  grid.some((row, y)=> row.some((cell, x) => {
    if (cell === "S") {
      sCord = `${x},${y}`;
      path.add(sCord)
      const directions = [goLeft(x, y), goRight(x, y), goUp(x, y), goDown(x, y)]
      const [cord] = directions
        .find(([_, allowed]) => allowed)

      if (directions[0][1] && directions[2][1]) {
        sTile = 'J'
      } else if (directions[0][1] && directions[3][1]) {
        sTile = '7'
      } else if (directions[1][1] && directions[2][1]) {
        sTile = 'L'
      } else if (directions[1][1] && directions[3][1]) {
        sTile = 'F'
      } else if (directions[0][1] && directions[1][1]) {
        sTile = '-'
      } else if (directions[2][1] && directions[3][1]) {
        sTile = '|'
      }

      startCord = cord
      return true
    }
    return false
  }))

  let prevCords = { [startCord]: sCord }
  let currentCords = [startCord]
  let stepsCount = 0
  let lookingForS = true
  while (lookingForS) {
    path.add(currentCords[0])
    if (currentCords.length === 0) process.exit()
    
    let nextCurrentCords = []
    let nextPrevCords = {}

    for (let currentCord of currentCords) {
      const [x, y] = currentCord.split(",").map(Number)

      const tryStep = (toCord, canStep) => {
        if (![startCord, prevCords[currentCord]].includes(toCord) && canStep) {
          if (toCord === sCord) {
            lookingForS = false
          }
          nextPrevCords[toCord] = currentCord
          nextCurrentCords.push(toCord)
        }
      };

      [
        goLeft(x, y),
        goRight(x, y),
        goUp(x, y),
        goDown(x, y)
      ].forEach(input => tryStep(...input))
    }

    prevCords = nextPrevCords
    currentCords = nextCurrentCords

    stepsCount += 1
  }

  return [path, sTile]
}

const countOutsiders = (grid, path, sTile) => {
  let outsiders = 0
  grid.forEach((row, y) => {
    row.forEach((_, x) => {
      if (path.has(`${x},${y}`)) return
      let crossings = 0

      let currentSplitter
      row.slice(0, x).forEach((tile, tileX) => {
        const translatedTile = tile === "S" ? sTile : tile
        if (path.has(`${tileX},${y}`)) {
          switch (translatedTile) {
            case 'J':
              if (currentSplitter === 'F') crossings += 1
              currentSplitter = null
              break
            case '7':
              if (currentSplitter === 'L') crossings += 1
              currentSplitter = null
              break
            case '|':
              crossings += 1
              break
            default:
          }
        }

        if (['F', 'L'].includes(translatedTile)) currentSplitter = translatedTile
      })

      if (crossings % 2 === 1) {
        console.log('crossing:', x, y, crossings)
        outsiders += 1
      }
    })
  })

  return outsiders
}

const run = input => {
  const grid = getGrid(input)
  grid
  .forEach((row, rowI) => console.log(
    JSON.stringify(row
      .map((char, colI) => {
        if (rowI === 0) return colI
        if (colI === 0) return rowI
        return char === "." 
          ? " " 
          : char
      })
      .map((char, i) => (i > 9 && rowI === 0) ? char : char + " ")
      .join("")
    ).replaceAll("\"", "")
  ))
  const [path, sTile] = getLoop(grid)

  return countOutsiders(grid, path, sTile)
}

module.exports = run