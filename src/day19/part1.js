const getData = input => {
  const [workFlowsStr, ratingsStr] = input.split('\n\n')
  const workFlows = {}
  workFlowsStr.split('\n')
    .forEach(workFlowStr => {
      const [name, rest] = workFlowStr.split('{')
      workFlows[name] = { rules: [] }
      rest.replace('}', '')
        .split(',')
        .forEach((ruleStr, i, arr) => {
          if ((i + 1) === arr.length) return workFlows[name].fallback = ruleStr
          const category = ruleStr[0]
          const operator = ruleStr[1]
          const [value, destination] = ruleStr.slice(2).split(":")
          workFlows[name].rules.push({ 
            category, 
            operator, 
            value: Number(value), 
            destination 
          })
        })
    })
  const ratings = []
  ratingsStr.split('\n')
    .forEach(ratingStr => {
      const ratingObj = {}
      ratingStr
        .replace('{', '')
        .replace('}', '')
        .split(",")
        .forEach(rating => {
          const [category, value] = rating.split("=")
          ratingObj[category] = Number(value)
        })
        ratings.push(ratingObj)
    })
    return [workFlows, ratings]
}

const validate = (workFlows, rating) => {
  let workFlow = 'in'
  while (!['R', 'A'].includes(workFlow)) {
    const foundMatch = workFlows[workFlow].rules.some(rule => {
      switch(rule.operator) {
        case '<': {
          if (rating[rule.category] < rule.value) {
            workFlow = rule.destination
            return true
          }
          return false
        }
        case '>': {
          if (rating[rule.category] > rule.value) {
            workFlow = rule.destination
            return true
          }
          return false
        }
      }
    })
    if (!foundMatch) workFlow = workFlows[workFlow].fallback
  }
  return workFlow === 'A'
}

const sum = ({ x, m, a, s }) => x + m + a + s

const run = input => {
  const [workFlows, ratings] = getData(input)
  console.log(JSON.stringify(workFlows, null, 2))
  console.log(ratings)
  const results = ratings.map(rating => validate(workFlows, rating) ? sum(rating) : 0)
  console.log(results)
  return results.reduce((sum, val) => val + sum)
}

module.exports = run