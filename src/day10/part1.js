const N = ['|', 'L', 'J', 'S'],
  E = ['-', 'L', 'F', 'S'],
  S = ['|', '7', 'F', 'S'],
  W = ['-', 'J', '7', 'S']

const getGrid = input => input
  .split("\n")
  .map(rowStr => rowStr.split(""))
  
const countSteps = grid => {
  const connectsRight = (x, y) =>  E.includes(grid[y]?.[x])
  const connectsLeft = (x, y) =>  W.includes(grid[y]?.[x])
  const connectsDown = (x, y) => S.includes(grid[y]?.[x])
  const connectsUp = (x, y) => N.includes(grid[y]?.[x])

  const goLeft = (x, y) => [`${x - 1},${y}`, connectsLeft(x, y) && connectsRight(x - 1, y)]
  const goRight = (x, y) => [`${x + 1},${y}`, connectsRight(x, y) && connectsLeft(x + 1, y)]

  const goUp = (x, y) => [`${x},${y - 1}`, connectsUp(x, y) && connectsDown(x, y - 1)]
  const goDown = (x, y) => [`${x},${y + 1}`, connectsDown(x, y) && connectsUp(x, y + 1)]
  const paths = []

  let sCord
  let startCord
  grid
    .forEach(row => console.log(
      JSON.stringify(row
        .map(char => char === "." ? " " : char)
        .join(" ")
      ).replaceAll("\"", "")
    ))
  grid.some((row, y)=> row.some((cell, x) => {
    if (cell === "S") {
      sCord = `${x},${y}`;
      const asd = [goLeft(x, y), goRight(x, y), goUp(x, y), goDown(x, y)]
      const [cord] = [goLeft(x, y), goRight(x, y), goUp(x, y), goDown(x, y)]
        .find(([_, allowed]) => allowed)

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

  return stepsCount + 1
}

const run = input => {
  const grid = getGrid(input)
  return countSteps(grid) / 2
}

module.exports = run