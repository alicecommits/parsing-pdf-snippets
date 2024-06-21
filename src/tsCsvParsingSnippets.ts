import * as fs from "fs"
import * as path from "path"
import "node:perf_hooks"
import * as readline from "node:readline"
import * as fsp from "fs/promises"

const filepath = path.resolve('inputs', 'rawDataSample.csv')
console.log(filepath)

//readFile (sync) version ----------------------
let DT_SYNC = 0
function readFileSync(filepath: string): String[][] {
    try {
        const startSync = performance.now()

        const data = fs.readFileSync(filepath, { encoding: 'utf8' })
        let parsed = data.split('\r\n').map(row => row.split(','))//.map( row => row.map(cell => regex to trim(cell)))
        
        const endSync = performance.now()
        DT_SYNC = endSync - startSync

        return parsed
    } catch (err) {
        console.log(err)
    }
}
console.table(readFileSync(filepath))
console.log(`SYNC - file read and parsed in ${DT_SYNC}ms.`)

//readFile (async) version --------------------
let DT_ASYNC = 0
async function readFileAsync(filepath: string): Promise<String[][]> {
    try {
        const startAsync = performance.now()

        const data = await fsp.readFile(filepath, { encoding: 'utf8' })
        let parsed = data.split('\r\n').map(row => row.split(','))//.map( row => row.map(cell => regex to trim(cell)))
        
        const endAsync = performance.now()
        DT_ASYNC = endAsync - startAsync

        return parsed
    } catch (err) {
        console.log(err)
    }
}
readFileAsync(filepath)
.then(res => console.table(res))
.then(() => {
    console.log(`ASYNC - file read and parsed in ${DT_ASYNC}ms.`)
    })
.catch(err => console.log(err))

// readline (sync) version -------------------------------------
const START_RL = performance.now()

const stream = fs.createReadStream(filepath)
const rl = readline.createInterface({ input: stream })

let FILE_ROWS = new Array<Array<String>>
rl.on("line", (row) => {
    let parsed = row.split(',')
    FILE_ROWS.push(parsed)
})
rl.on("close", () => {
    const endRl = performance.now()
    const DT_SYNC_RL = endRl - START_RL

    console.log(`array looks like this inside the interface: `)
    console.table(FILE_ROWS)
    console.log(`SYNC - READLINE INTERFACE VERSION - file read and parsed in ${DT_SYNC_RL}ms.`)
})