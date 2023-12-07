const sumGames = (input) => {
  const gamesArr = input
    .split("\n")
    .map(gameStr => gameStr
      .split(": ")[1]
      .split("; ")
      .reduce((acc, setStr) => { 
        setStr
          .split(", ")
          .forEach(cubesStr => {
           const [amount, color] = cubesStr.split(" ")
           if (!acc[color]) acc[color] = []
            acc[color].push(Number(amount))
          })

        return acc
      }, {})
    ) 
  return gamesArr.reduce((games, game, i) => {
    games[i + 1] = game
    return games
  }, {})
}

const validateGames = (games) => Object.entries(games)
  .reduce((games, [id, game]) => {
    const allowed = Object
      .entries(game)
      .reduce((gameResult, [color, amounts]) => {
        return gameResult * Math.max(...amounts)
      }, 1)
    games[id] = allowed
    return games
  }, {})

const run = (input) => {
  const games = sumGames(input)
  const validatedGames = validateGames(games)
  return Object.entries(validatedGames)
    .reduce((acc, [id, result]) => acc + result, 0)
}

module.exports = run