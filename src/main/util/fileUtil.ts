import fs from "fs"
import { ScrapedParkInfoData } from "../types/allTypes"

export const writeOutToFile = async (data: ScrapedParkInfoData, filePath: string) => {

  const writeData = {
    lastUpdated: Date.now(),
    data
  }

  const stringifiedData = JSON.stringify(writeData, null, '\t')

  /* The \t character (tab) pretty-prints the JSON in the file */
  fs.writeFile(filePath, stringifiedData, err => {
    if (err) console.log(`there was an error writing to ${filePath}`)
    console.log(`write to ${filePath} done`)
  })
}
