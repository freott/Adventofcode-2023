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

const getNextDestination = (currentPointer, instructions, network) => {
  const instruction = instructions[0]
  return network[currentPointer][instruction === "L" ? 0 : 1]
}

const goForAWalk = (initialInstructions, network, pointer) => {
  let instructions = initialInstructions

  let totalSteps = 0
  let currentPointer = pointer
  while (!currentPointer.endsWith("Z")) {
    currentPointer = getNextDestination(
      currentPointer, instructions, network
    )

    totalSteps += 1
    instructions = instructions.substring(1)
    if (instructions.length === 0) {
      instructions = initialInstructions
    }
  }

  return totalSteps
}

function gcd(a, b) {
  if (b === 0) {
      return a;
  }
  return gcd(b, a % b);
}

function lcm(a, b) {
  return Math.abs(a * b) / gcd(a, b);
}

function lcmArray(arr) {
  let result = arr[0];
  for (let i = 1; i < arr.length; i++) {
      result = lcm(result, arr[i]);
  }
  return result;
}

const run = (input) => {
  const [instructions, network] = readMaps(input)
  let currentPointers = Object.keys(network)
    .filter(pointer => pointer.endsWith("A"))
  const allSteps = currentPointers.map(pointer => goForAWalk(instructions, network, pointer))

  return lcmArray(allSteps)
}

module.exports = run