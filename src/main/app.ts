import express from 'express'
import fs from 'fs'
import axios from 'axios'
import { CronJob } from 'cron'
import WdwScraper from './scraper/wdwScraper'
import { writeOutToFile } from './util/fileUtil'

const PARK_HOURS_URL = process.env.PARK_HOURS_URL
const PARK_HOURS_GENERATED_DATA_PATH = 'scraped_data/parkHours.json'
const ENDPOINTS = {
  PARK_TIMES: '/park-times'
}

const app = express()
const port = process.env.PORT || 5000

app.get(ENDPOINTS.PARK_TIMES, async (req, res) => {
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

    console.log('Running cron job to scrape park times from WDW site')

    const htmlRes = await axios({
      url: PARK_HOURS_URL,
      method: 'GET',
      responseType: 'blob'
    })

    const { data: html } = htmlRes

    const wdwScraper = new WdwScraper(html)

    data = await wdwScraper.scrapeParkTimes()
    writeOutToFile(data, PARK_HOURS_GENERATED_DATA_PATH)

  }, null, true, 'America/New_York')

  job.start()
})

/* export for testing */
export default app
