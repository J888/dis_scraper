

## What is this app?
A once-per-day cron job scrapes the Disney World website for:
- park open/close times; data at endpoint `/park-times`  

## Clone and Run
```
$ git clone https://github.com/J888/dis_scraper
$ cd dis_scraper
$ npm install
$ PARK_HOURS_URL=https://disneyworld.disney.go.com/calendars/park-hours/ npm run start
```

## Run Tests
```
$ npm run test
```

## Tech. Used
- Express - to create a server
- Cheerio - to parse html with jQuery syntax
- Axios - to fetch html
- Cron - to run the scrape task on a regular schedule
- Mocha and Chai - to run unit tests



