import { expect } from 'chai';
import WdwScraper from "../main/scraper/wdwScraper"
import fs from "fs"

let parkTimesHtml: string

before( async () => {
  return new Promise((resolve) => {
    fs.readFile(__dirname + '/mockData/parkTimes.html', 'utf8', (err, html) => {
      parkTimesHtml = html
      resolve()
    })
  })
})

describe('WdwScraper', async () => {
  
  it('scrapes the correct number of park open and close times', async () => {
    const scraper: WdwScraper = new WdwScraper(parkTimesHtml)
  const parkTimesData: any = await scraper.scrapeParkTimes()
  console.log(parkTimesData)
    expect(parkTimesData.length).to.equal(6)
  })

  it('returns an array with populated ScrapedParkInfoData data', async () => {
    const scraper: WdwScraper = new WdwScraper(parkTimesHtml)
    const parkTimesData: any = await scraper.scrapeParkTimes()

    for( let i = 0; i < parkTimesData.length; i ++ ) {
      expect(parkTimesData[i].parkName).to.not.be.null
      expect(parkTimesData[i].openTime).to.not.be.null
      expect(parkTimesData[i].closeTime).to.not.be.null
    }
  })
})
