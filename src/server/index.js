const { JSDOM } = require('jsdom')
const express = require('express')
const axios = require('axios')
const app = express()

const router = express.Router()

const parseScorecard = contentDom => {
  const pars = Array.from(contentDom.window.document.querySelectorAll('.sgf-git-templates-scorecard-tee-row-par td'))
    .map(({ innerHTML: par }) => par)

  const indices = Array.from(contentDom.window.document.querySelectorAll('.sgf-git-templates-scorecard-tee-row-index td'))
    .map(({ innerHTML: index }) => index)

  return pars.map((par, i) => ({
    hole: i + 1,
    par,
    index: indices[i]
  }))
}

const parseSlope = contentDom => {
  return Array.from(contentDom.window.document.querySelectorAll('tbody tr'))
    .reduce((acc, el) => {
      acc.push({
        tee: el.children[0].innerHTML,
        length: el.children[1].innerHTML,
        womenSlope: el.children[2].innerHTML,
        menSlope: el.children[3].innerHTML
      })
      return acc
    }, [])
}

app.use(express.static(__dirname + './../../'))
app.use(router)

router.get('/api/club/:id', async function (req, res) {
  const club = req.params.id
  try {
    const courses = await axios.get('https://gitwidgets.golf.se/scorecard/courses', {
      params: {
        guid: club
      }
    })
    res.send(courses.data)
  } catch (e) {
    console.error(e)
    res.send(e)
  }
})

router.get('/api/slope', async function (req, res) {

  const clubId = req.query.club
  const courseId = req.query.course
  const hcp = req.query.hcp.replace('.', '%252C')

  const dom = await JSDOM.fromURL(`https://gitwidgets.golf.se/jsonp/?guid=${clubId}&courseId=${courseId}&hcp=${hcp}&widgetId=sgf-git-templates-widget-0&requestUrl=%2Fslopecalculator%2Fwidget&callback=GITWidget.jsonpCallback`, {
    referrer: "https://gitwidgets.golf.se/",
    resources: "usable"
  })
  const domSerialized = dom.serialize();

  const GITWidget = {
    jsonpCallback: ({ query, content }) => {

      const contentDom = new JSDOM(content)
      const slopes = parseSlope(contentDom)

      res.send(slopes)
    }
  }

  eval(dom.window.document.body.innerHTML)

})

router.get('/api/scorecard', async function (req, res) {

  const clubId = req.query.club
  const courseId = req.query.course

  const dom = await JSDOM.fromURL(`https://gitwidgets.golf.se/jsonp/?guid=${clubId}&courseId=${courseId}&widgetId=sgf-git-templates-widget-0&requestUrl=%2Fscorecard%2Fwidget&callback=GITWidget.jsonpCallback`, {
    referrer: "https://gitwidgets.golf.se/",
    resources: "usable"
  })
  const domSerialized = dom.serialize();

  const GITWidget = {
    jsonpCallback: ({ query, content }) => {

      let scorecard

      const contentDom = new JSDOM(content)
      scorecard = parseScorecard(contentDom)
      res.send(scorecard)
    }
  }

  eval(dom.window.document.body.innerHTML)

})

app.use('/', router)

app.listen(3000, () => console.log('Local app listening on port 3000!'))