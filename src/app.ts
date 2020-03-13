import express from "express"
import cheerio from "cheerio"
import axios from "axios"
import fs from "fs"
import { CronJob } from "cron"

const PARK_HOURS_URL = process.env.PARK_HOURS_URL
const PARK_HOURS_GENERATED_DATA_PATH = 'scraped_data/parkHours.json'

const app = express()
const port = 8080

interface ScrapedParkInfoData {
  parkName: string
  openTime: string
  closeTime: string
}

const scrape = () => new Promise( async (resolve, reject) => {

    try {
      const htmlRes = await axios({
        url: PARK_HOURS_URL,
        method: 'GET',
        responseType: 'blob'
      })

      const { data: html } = htmlRes

      const loadedHtml$ = cheerio.load(html)
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
      reject('error scraping and fetching data')
    }
  })


const writeOutToFile = async (data: ScrapedParkInfoData) => {

  const writeData = {
    lastUpdated: Date.now(),
    data
  }

  const stringifiedData = JSON.stringify(writeData, null, '\t')

  /* The \t character (tab) pretty-prints the JSON in the file */
  fs.writeFile(PARK_HOURS_GENERATED_DATA_PATH, stringifiedData, err => {
    if (err) console.log('there was an error')
    console.log('write to file done')
  })
}

app.get('/park-times', async (req, res) => {
    fs.readFile(PARK_HOURS_GENERATED_DATA_PATH, {encoding: 'utf-8'}, (err, data) => {
      if (err)
        return res.send('There was an error getting the data').status(500)

      return res.json(JSON.parse(data)).status(200)
    })
})

app.listen(port, async () => {
  console.log(`server started at http://localhost:${port}`)

  let data: any

  /* Runs at 07:00 */
  const job = new CronJob('0 7 * * *', async () => {

    console.log('Running cron job')

    data = await scrape()
    writeOutToFile(data)

  }, null, true, 'America/New_York')

  job.start()
})