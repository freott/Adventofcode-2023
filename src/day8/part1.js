const readMaps = (input) => {
  const [instructions, network] = input.split("\n\n")
  return [
    instructions,
    network
      .split("\n")
      .reduce((acc, row) => {
        const [from, to] = row.split(" = ")
        acc[from] = to
          .replace("(", "")
          .replace(")", "")
          .split(", ");
        return acc
      }, {})]
}

const getNextDestination = (memory, currentPointer, instructions, network) => {
  const memorizedPointer = memory[currentPointer]?.[instructions]
  if (memorizedPointer) {
    return [memorizedPointer, instructions]
  }

  const instruction = instructions[0]
  const newPointer = network[currentPointer][instruction === "L" ? 0 : 1]
  return [newPointer, instruction]
}

const stepAndRemember = (initialInstructions, network) => {
  const memory = {}
  let instructions = initialInstructions
  let currentPointer = "AAA"
  
  let currentIteration = [
    { 
      pointer: "AAA", 
      stepsTaken: "" 
    }
  ]

  let totalSteps = 0
  while (currentPointer !== "ZZZ") {
    // console.log(memory)
    const [pointer, stepsTaken] = getNextDestination(
      memory, currentPointer, instructions, network
    )
    
    // currentIteration.push({ pointer, stepsTaken })
    // for (let i = 0; i < currentIteration.length; i++) {
      
    //   const startPointer = currentIteration[i].pointer
    //   if (!memory[startPointer]) memory[startPointer] = {}
      
    //   let path = ""
    //   currentIteration
    //     .slice(i)
    //     .forEach((iteration) => {
    //       const { pointer, stepsTaken } = iteration
    //       path = stepsTaken + path
    //       if (path.length === 1 || memory?.[startPointer]?.[path]) return
    //       memory[startPointer][path] = pointer
    //   })
    // }

    let stepsAmount = stepsTaken.length
    totalSteps += stepsAmount
    currentPointer = pointer

    instructions = instructions.substring(stepsAmount)
    if (instructions.length === 0) {
      instructions = initialInstructions
      currentIteration = [{
        pointer: currentPointer,
        stepsTaken: ""
      }]
    }
  }

  return totalSteps
}

const run = (input) => {
  const [instructions, network] = readMaps(input)
  return stepAndRemember(instructions, network)
}

module.exports = run