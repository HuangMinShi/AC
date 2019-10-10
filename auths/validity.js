module.exports = {
  checkUrl: (req, res, next) => {
    const url = req.body.url
    const pattern = /(https?:\/\/)?[\w-]+(\.[\w]+)+[\w-+&@#/%?=~_|!:,.;]+/
    const isValidity = pattern.test(url)

    if (!isValidity) {
      const failure_msg = '輸入網址無效，請重新輸入。'
      return res.render('index', { url, failure_msg })
    }

    next()
  }
}