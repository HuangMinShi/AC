(function () {
  // declare variables
  const datapanel = document.querySelector('.data-panel')
  const result = document.querySelector('#result')
  let r = 0
  let g = 0
  let b = 0

  // function
  function rgbToHex(r, g, b) {
    let rgb = [r, g, b]
    let hex = '#'

    for (i = 0; i < 3; i++) {
      let value = Number(rgb[i])
      if (value < 16) {
        hex = hex + '0' + value.toString(16)
      } else {
        hex += value.toString(16)
      }
    }
    return hex
  }

  function changeRgbValue(color, value) {
    switch (color) {
      case 'red':
        r = value
        break
      case 'green':
        g = value
        break
      case 'blue':
        b = value
        break
    }
    result.textContent = rgbToHex(r, g, b)
  }

  // execute
  document.body.style.backgroundColor = rgbToHex(r, g, b)
  result.textContent = rgbToHex(r, g, b)

  datapanel.addEventListener('input', event => {
    let color = event.target.id
    let value = event.target.value

    document.querySelector(`#${color}-value`).textContent = value
    changeRgbValue(color, value)
    document.body.style.backgroundColor = rgbToHex(r, g, b)
  })

})()