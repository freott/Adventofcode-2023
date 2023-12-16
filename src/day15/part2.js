const getSequences = input => input
  .split(",")
  .map(seqStr => {
    const op = seqStr.includes('-') ? '-' : '='
    const [label, lens] = seqStr.split(op)
    return { label, op, lens: Number(lens) }
  })
    

const getBoxNr = str => {
  let value = 0
  str.split("")
    .forEach(char => {
      value += char.charCodeAt()
      value *= 17
      value %= 256
    })

    return value
}

const iterateBoxes = sequences => {
  const boxes = {}

  sequences.forEach(({ label, op, lens, box }) => {
    const existingI = boxes[box]
      ?.findIndex(lens => lens.label === label) 
        ?? -1
    
    switch (op) {
      case '=':
        if (!boxes[box]) {
          boxes[box] = []
        }

        const boxLens = { label, lens }
        if (existingI !== -1) boxes[box][existingI] = boxLens
        else boxes[box].push(boxLens)
        return

      case '-':
        if (existingI !== -1) boxes[box].splice(existingI, 1)
        return
    }
  })
  return boxes
}

const getResult = boxes => {
  let result = 0
  Object.entries(boxes).forEach(([ box, lenses ]) => {
    lenses.forEach(({ lens }, slot) => {
      const power = (Number(box) + 1) * (slot + 1) * lens
      result += power
    })
  })
  return result
}

const run = input => {
  const sequences = getSequences(input)
  sequences.forEach((sequence, i) => sequences[i].box = getBoxNr(sequence.label))
  
  return getResult(iterateBoxes(sequences))
}

module.exports = run