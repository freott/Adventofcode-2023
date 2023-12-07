const getHands = (input) => input
  .split("\n")
  .map(handStr => {
    const [cardsStr, bidStr] = handStr.split(" ")
    return { cards: cardsStr, bid: Number(bidStr)}
  })

const gradeHand = (hand) => {
  const cards = []
  let jokersAmount = 0
  for (let card of hand.cards.split("")) {
    if (card === "J") {
      jokersAmount += 1
      continue
    }
    const cardIndex = cards.findIndex(ca => ca.card === card)
    if (cardIndex === -1) cards.push({ card, amount: 1 })
    else cards[cardIndex].amount += 1
  }
  const sortedCards = cards.sort((a, b) => b.amount - a.amount)

  const addJokers = (amount) => amount + jokersAmount
  
  if (addJokers(sortedCards[0]?.amount ?? 0) === 5) {
    hand.grade = 6
    return
  }
  if (addJokers(sortedCards[0].amount) === 4 && sortedCards[1].amount === 1) {
    hand.grade = 5
    return
  }

  // ABCCJ
  if (addJokers(sortedCards[0].amount) === 3 && sortedCards[1].amount === 2) {
    hand.grade = 4
    return
  }
  if (addJokers(sortedCards[0].amount) === 3) {
    hand.grade = 3
    return
  }
  if (sortedCards[0].amount === 2 && sortedCards[1].amount === 2) {
    hand.grade = 2
    return
  }
  if (addJokers(sortedCards[0].amount === 2)) {
    hand.grade = 1
    return
  }
  hand.grade = 0
  return
}

const ORDER = "AKQT98765432J"
const BASE = 14
const HAND_LENGTH = 5
const getHandValue = hand => hand.cards
  .split('')
  .reduce((acc, char, index) => {
    const characterValue = ORDER.indexOf(char) + 1;
    return acc 
      + characterValue 
      * Math.pow(BASE, HAND_LENGTH - index - 1)
  }, 0)

const sorter = (handA, handB) => {
  const diff = handB.grade - handA.grade
  if (diff !== 0) return diff
  const handAValue = getHandValue(handA)
  const handBValue = getHandValue(handB)
  return handAValue - handBValue
}

const run = (input) => {
  const hands = getHands(input)
  hands.forEach(gradeHand)
  const sortedHands = hands.sort(sorter)
  console.log({sortedHands})
  return sortedHands
    .reverse()
    .reduce((acc, hand, i) => acc + hand.bid * (i + 1), 0)
}

module.exports = run