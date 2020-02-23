#!/usr/bin/env node

const fs = require("fs").promises
const path = require("path")
const argv = require("yargs").argv
const trash = require("trash")

const target = "./"
const extensionFilter = argv._[0]
const permanently = argv._[1] && argv._[1].includes("perm")

async function main() {
    if(!extensionFilter) return console.log("Missing file extension. (purge-spell {extension})")
    const files = await fs.readdir(`${target}`)
    let deleted = 0
    for await (const file of files) {
        const fileExtension = path.extname(file).replace(".", "")
        const filePath = path.join(target, file)
        try {
            if(fileExtension === extensionFilter) {
                if(permanently) {
                    await fs.unlink(filePath)
                    deleted++
                    console.log(`Deleted file ${file}...`)
                }
                else {
                    await trash(filePath)
                    deleted++
                    console.log(`Moved file ${file} to recycle bin...`)
                }
            }
        }
        catch(error) {
            console.log(`Couldn't delete file ${file}:\n ${error}`)
        }
    }
    console.log(`Done. (Deleted ${deleted} files)`)
}
main()