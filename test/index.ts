import { TMetronom } from '../src/app'
import * as metronom from '../src/index'


const defMetronom: TMetronom = {kind: 'custom', periodicity: 'every', periodMinutes: 4, weekdaySun: true, weekdayMon: true, weekdayTue: true, weekdayWed: true, weekdayThu: true, weekdayFri: true, weekdaySat: true}

const testCron: {metronom: TMetronom, cron: string}[] = [
    {metronom: defMetronom, cron: '0 */4 * * * *'},
    {metronom: {...defMetronom, weekdayMon: false, weekdayTue: false, weekdayWed: false, weekdayThu: false, weekdayFri: false, weekdaySat: false}, cron: '0 */4 * * * 0'},
    {metronom: {...defMetronom,  weekdaySun: false, weekdayMon: false, weekdayTue: false, weekdayWed: false, weekdayThu: false, weekdayFri: false}, cron: '0 */4 * * * 6'},
    {metronom: {...defMetronom,  weekdaySun: false, weekdayMon: false, weekdayWed: false, weekdayThu: false, weekdayFri: false}, cron: '0 */4 * * * 2,6'},
    {metronom: {...defMetronom,  weekdayTue: false}, cron: '0 */4 * * * 0,1,3-6'},
    {metronom: {...defMetronom,  weekdayTue: false, weekdayThu: false}, cron: '0 */4 * * * 0,1,3,5,6'},
    {metronom: {...defMetronom,  weekdaySun: false, weekdaySat: false}, cron: '0 */4 * * * 1-5'},
    {metronom: {...defMetronom,  weekdayWed: false}, cron: '0 */4 * * * 0-2,4-6'},
]

let isCronError = false
testCron.forEach((c, i) => {
    const test = metronom.Cron(c.metronom)
    if (test.cron !== c.cron) {
        isCronError = true
        console.warn(`error test cron #${i}, result "${test.cron}", need = "${c.cron}"`)
    }
})
if (isCronError) {
    process.exit()
}

let task1Count = 0
const task1 = metronom.Create({
    kind: 'cron',
    cron: '*/2 * * * * *'
})
task1.onTick(() => {
    task1Count++
    console.log(`task1 tick ${task1Count}`)
    if (task1Count < 2) {
        task1.allowNextTick()
    }
})
task1.start()

let task2Count = 0
const task2 = metronom.Create({
    kind: 'custom',
    weekdaySun: true,
    weekdayMon: true,
    weekdayTue: true,
    weekdayWed: true,
    weekdayThu: true,
    weekdayFri: true,
    weekdaySat: true,
    periodicity: 'every',
    periodMinutes: 1
})
task2.onTick(() => {
    task2Count++
    console.log(`task2 tick ${task2Count}`)
    if (task2Count < 3) {
        task2.allowNextTick()
    } else {
        task2.stop()
    }
})
task2.start()

const d = new Date()
const period = (d.getHours() * 60) + d.getMinutes() + 2

let task3Count = 0
const task3 = metronom.Create({
    kind: 'custom',
    weekdaySun: true,
    weekdayMon: true,
    weekdayTue: true,
    weekdayWed: true,
    weekdayThu: true,
    weekdayFri: true,
    weekdaySat: true,
    periodicity: 'once',
    periodMinutes: period
})
task3.onTick(() => {
    task3Count++
    console.log(`task3 tick ${task3Count}`)
    task3.allowNextTick()
})
task3.start()

let task4Count = 0
const task4 = metronom.Create({
    kind: 'custom',
    weekdaySun: true,
    weekdayMon: (new Date()).getDay() === 1 ? true : false,
    weekdayTue: (new Date()).getDay() === 2 ? true : false,
    weekdayWed: true,
    weekdayThu: true,
    weekdayFri: true,
    weekdaySat: true,
    periodicity: 'every',
    periodMinutes: 1
})
task4.onTick(() => {
    task4Count++
    console.log(`task4 tick ${task4Count}`)
    if (task4Count < 3) {
        task4.allowNextTick()
    } else {
        task4.stop()
    }
})
task4.start()

const min4 = 4 * 60 * 1000

setTimeout(() => {
    const errors = [] as string[]
    if (task1Count !== 2) {
        errors.push(`task1_count !== 2, task1_count === ${task1Count}`)
    }
    if (task2Count !== 3) {
        errors.push(`task2_count !== 3, task2_count === ${task2Count}`)
    }
    if (task3Count !== 1) {
        errors.push(`task3_count !== 1, task3_count === ${task3Count}`)
    }
    if (task4Count !== 3) {
        errors.push(`task4_count !== 3, task4_count === ${task4Count}`)
    }

    if (errors.length <= 0) {
        console.log(`TEST DONE, IF PROCESS NOT STOPPED - ERROR!`)
    }
    errors.forEach(e => {
        console.warn(`ERROR - ${e}`)
    })

    task1.stop()
    task2.stop()
    task3.stop()
}, min4)

