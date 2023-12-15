const getRows = input => input
  .split("\n")
  .map(rowStr => {
    const [springsStr, listStr] = rowStr.split(" ")


    return {
      springs: springsStr.split(""),
      damagedList: listStr.split(",").map(Number)
    }
  })

const getPermutations = (str) => {
  if (str.length === 1) {
    return [str];
  }

  let permutations = [];
  for (let i = 0; i < str.length; i++) {
    const char = str[i];
    const remainingChars = str.slice(0, i) + str.slice(i + 1);
    const remainingPermutations = getPermutations(remainingChars);

    for (let permutation of remainingPermutations) {
      permutations.push(char + permutation);
    }
  }

  return permutations;
}


const countPossibilites = (springs, damagedList) => {
  const totalDamaged = damagedList.reduce((sum, val) => sum + val)
  const existingDamaged = springs.reduce((sum, val) => sum + (val === "#" ? 1 : 0), 0)

  const questionMarkIndexes = springs.reduce((acc, spring, i) => {
    if (spring !== '?') return acc
    return [...acc, i]
  }, [])

  let remainingDamaged = totalDamaged - existingDamaged
  const str = questionMarkIndexes.reduce((acc) => {
    if (remainingDamaged > 0) {
      remainingDamaged -= 1
      return acc + '#'
    } else {
      return acc + '.'
    }
  }, '')
  const permutations = getPermutations(str)
  console.log({permutations})

  const newSpringsSet = new Set()
  permutations.forEach(permutation => {
    const newSprings = questionMarkIndexes.reduce((newSprings, questionMarkIndex, i) => {
      newSprings[questionMarkIndex] = permutation[i]
      return newSprings
    }, [...springs])
    newSpringsSet.add(newSprings.join(""))
  })

  console.log({newSpringsSet})

  let possibiliets = 0;
  [...newSpringsSet]
  .map(springsStr => springsStr.split(""))
  .forEach(newSprings => {
    let remainingDamagedList = [...damagedList]
      let lastSpring
      const isValid = newSprings.every(spring => {
        if (spring === '#') {
          if (remainingDamagedList[0] === 0) return false
          remainingDamagedList[0] -= 1
          lastSpring = spring
          return true
        }

        if (spring === '.') {
          if (remainingDamagedList[0] === 0) remainingDamagedList.shift()
          else if (lastSpring === '#') return false
          lastSpring = spring
          return true
        }
      })

      const isPossibility = (remainingDamagedList.length === 0 || remainingDamagedList[0] === 0) && isValid
      // if (isPossibility) console.log('possibility:', newSprings.join(""))

      if (isPossibility) possibiliets += 1
    })
  return possibiliets
}

const run = input => {
  const rows = getRows(input)
  let possibilites = 0
  rows.forEach(({ springs, damagedList }, i) => {
    console.log('On', i + 1, 'of', rows.length)
    // console.log('springs', springs)
    const tot = countPossibilites(springs, damagedList)
    // console.log(tot, 'possibilites from', springs)
    possibilites += tot
  })
  return possibilites
}

module.exports = run