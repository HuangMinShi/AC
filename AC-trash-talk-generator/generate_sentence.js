function selectPhrase(arrar) {
  const index = Math.floor(Math.random() * arrar.length)
  return arrar[index]
}

function generateSentence(option) {

  // Define things user might want
  const task = {
    engineer: ['加個按鈕', '加新功能', '切個版', '改一點 code'],
    designer: ['畫一張圖', '改個 logo', '順便幫忙設計一下', '隨便換個設計', '畫個石虎'],
    entrepreneur: ['週末加班', '要能賺錢', '想個 business model', '找 VC 募錢']
  }

  const phrase = ['很簡單', '很容易', '很快', '很正常', '不難']

  const jobNameInCh = {
    engineer: '工程師',
    designer: '設計師',
    entrepreneur: '創業家'
  }

  // Generate phrase randomly
  let sentence = ''
  if (option) {
    sentence = `「身為一個${jobNameInCh[option]}，${selectPhrase(task[option])}，${selectPhrase(phrase)}吧！」`
  } else {
    sentence = '選個職業吧！'
  }

  // Return sentence
  return sentence
}

module.exports = generateSentence