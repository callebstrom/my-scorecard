import axios from 'axios'
export const getScorecard = () => {
  return axios.get('https://gitwidgets.golf.se/jsonp/?guid=664ea941-1a35-4af3-b533-20ac2cdfa60d&courseId=3764ef54-dd25-4ebb-81e7-6676cb5d3f93&widgetId=sgf-git-templates-widget-0&requestUrl=%2Fscorecard%2Fwidget&callback=GITWidget.jsonpCallback')
}