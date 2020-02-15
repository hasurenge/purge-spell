#!/usr/bin/env node

const fs = require("fs").promises
const path = require("path")
const argv = require("yargs").argv

const target = "./"
const extensionFilter = argv._[0]

async function main() {
    if(!extensionFilter) return console.log("Missing file extension. (purge-spell {extension})")
    const files = await fs.readdir(`${target}`)
    let deleted = 0
    for await (const file of files) {
        const fileExtension = path.extname(file).replace(".", "")
        const filePath = path.join(target, file)
        try {
            if(fileExtension === extensionFilter) {
                await fs.unlink(filePath)
                deleted++
                console.log(`Deleted file ${file}...`)
            }
        }
        catch(error) {
            console.log(`Couldn't delete file ${file}:\n ${error}`)
        }
    }
    console.log(`Done. (Deleted ${deleted} files)`)
}
main()