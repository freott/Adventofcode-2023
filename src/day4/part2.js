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

  return myWinningNrs.length
}

const iterateOld = cardScores => {
  let totalScore = cardScores.length
  let cardQueue = cardScores.map((_, i) => i)
  while (cardQueue.length > 0) {
    const [score, newCards] = cardQueue
      .reduce((acc, card) => {
        const cardScore = cardScores[card]
        const nextCards = Array
          .from(
            { 
              length: card + cardScore >= cardScores.length
                ? cardScores.length - (card + 1)
                : cardScore
            }, 
            (_, i) => i + card + 1
          )

        return [
          acc[0] + cardScore,
          [...acc[1], ...nextCards]
        ]
      }, [0, []])
    
    cardQueue = newCards
    totalScore += score
  }

  return totalScore
}

const resolveCard = (card, cardScores, scoreTable) => {
  const cardScore = cardScores[card]
  if (card + 1 === cardScores.length) {
    scoreTable[card] = cardScore
    return cardScore
  }

  const resolvedCardScore = cardScore + Array
    .from({ length: cardScore })
    .reduce(
      (sum, _, i) => {
        const cardValue = scoreTable[card + (i + 1)] ?? 0
        return cardValue + sum
      }
      , 0
    )

  scoreTable[card] = resolvedCardScore
  return resolvedCardScore
}

const iterate = (cardScores) => {
  const reversedCards = cardScores
    .map((_, i) => i)
    .reverse()

  let totalScore = cardScores.length
  const scoreTable = {}
  reversedCards.forEach(cardIndex => {
    const resolvedScore = resolveCard(
      cardIndex, cardScores, scoreTable
    )
    totalScore += resolvedScore
  })

  return totalScore
}

const run = (input) => {
  const games = getGames(input)
  const cardScores = games.map(playGame)
  return iterate(cardScores)
}

module.exports = run