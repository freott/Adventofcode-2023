const getGames = (input) => input
  .split("\n")
  .map(gameStr => {
    const [ winningNrs, myNrs ] = gameStr
      .split(": ")[1]
      .split(" | ")
      .map(nrsString => nrsString
        .split(" ")
        .map(str => str.trim())
        .filter(Boolean)
      )
    return { winningNrs, myNrs }
  })

const playGame = ({ winningNrs, myNrs }) => {
  const myWinningNrs = myNrs
    .filter(myNr => winningNrs.includes(myNr))
  
  return myWinningNrs.length > 0
    ? Array
      .from({ length: myWinningNrs.length })
      .reduce(score => score === 0 
        ? 1 
        : score * 2, 0
     )
    : 0
}

const playGames = (games) => games
  .reduce((totalScore, game) => totalScore + playGame(game) ,0)

const run = (input) => {
  const games = getGames(input)
  const score = playGames(games)
  return score
  
}

module.exports = run