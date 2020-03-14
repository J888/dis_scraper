import chai, { expect } from 'chai'
import chaiHttp from 'chai-http'
import WdwScraper from '../../main/scraper/wdwScraper'
import fs from 'fs'

/* Configure chai */
chai.use(chaiHttp)
chai.should()

let parkTimesHtml: string

before( async () => {

  return new Promise((resolve) => {

    fs.readFile(__dirname + '/mockData/parkTimes.html', 'utf8', (_err, html) => {
      parkTimesHtml = html
      resolve()
    })
  })
})

describe('WdwScraper', async () => {

  it('scrapes the correct number of park open and close times', async () => {

    const scraper: WdwScraper = new WdwScraper(parkTimesHtml)
    const parkTimesData: any = await scraper.scrapeParkTimes()

    expect(parkTimesData.length).to.equal(6)
  })

  it('returns an array with populated ScrapedParkInfoData data', async () => {

    const scraper: WdwScraper = new WdwScraper(parkTimesHtml)
    const parkTimesData: any = await scraper.scrapeParkTimes()

    for(const timeData of parkTimesData ) {
      expect(timeData.parkName).to.not.be.null
      expect(timeData.openTime).to.not.be.null
      expect(timeData.closeTime).to.not.be.null
    }
  })
})
