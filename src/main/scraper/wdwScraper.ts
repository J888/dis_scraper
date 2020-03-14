import axios from 'axios'
import { ScrapedParkInfoData } from '../types/allTypes'
import cheerio from 'cheerio'

export default class WdwScraper {
  parkTimesHtml: string

  constructor(parkTimesHtml: string) { this.parkTimesHtml = parkTimesHtml }

  scrapeParkTimes = () => new Promise( async (resolve, reject) => {
    try {
      const loadedHtml$ = cheerio.load(this.parkTimesHtml)
      const parkListItems = loadedHtml$('ul.parkHoursList').children()

      const parkInfo: ScrapedParkInfoData[] = []
      parkListItems.each((i, el) => {
        const element = loadedHtml$(el)

        const parkName =
          element.find('.pkTitle').text().trim()
            .replace('Hours', '').trim()

        const openTime = element.find(`span[itemprop='opens']`).text().trim()
        const closeTime = element.find(`span[itemprop='closes']`).text().trim()

        parkInfo[i] = { parkName, openTime, closeTime }
      })

      resolve(parkInfo)
    } catch (err) {

      reject(`error scraping data: ${err}`)
    }
  })
}
