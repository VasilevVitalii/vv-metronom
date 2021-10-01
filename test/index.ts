import * as metronom from '../src/index'

// const task0 = metronom.CreateMetronom({
//     kind: 'cron',
//     cron: '*/30 * * * * *'
// })
// task0.onTick(() => {
//     console.log(`tick`)
//     task0.stop()
// })
// task0.start()

// const taskX = metronom.CreateMetronom({
//     kind: 'custom',
//     weekday_sun: true,
//     weekday_mon: true,
//     weekday_tue: true,
//     weekday_wed: true,
//     weekday_thu: true,
//     weekday_fri: true,
//     weekday_sat: true,
//     periodicity: 'every',
//     period_minutes: 1
// })
// taskX.onTick(() => {
//     console.log(`tick`)
//     taskX.stop()
// })
// taskX.start()

let task1_count = 0
const task1 = metronom.CreateMetronom({
    kind: 'cron',
    cron: '*/2 * * * * *'
})
task1.onTick(() => {
    task1_count++
    console.log(`task1 tick ${task1_count}`)
    if (task1_count < 2) {
        task1.allowNextTick()
    }
})
task1.start()

let task2_count = 0
const task2 = metronom.CreateMetronom({
    kind: 'custom',
    weekday_sun: true,
    weekday_mon: true,
    weekday_tue: true,
    weekday_wed: true,
    weekday_thu: true,
    weekday_fri: true,
    weekday_sat: true,
    periodicity: 'every',
    period_minutes: 1
})
task2.onTick(() => {
    task2_count++
    console.log(`task2 tick ${task2_count}`)
    if (task2_count < 3) {
        task2.allowNextTick()
    } else {
        task2.stop()
    }
})
task2.start()

const d = new Date()
const period = (d.getHours() * 60) + d.getMinutes() + 2

let task3_count = 0
const task3 = metronom.CreateMetronom({
    kind: 'custom',
    weekday_sun: true,
    weekday_mon: true,
    weekday_tue: true,
    weekday_wed: true,
    weekday_thu: true,
    weekday_fri: true,
    weekday_sat: true,
    periodicity: 'once',
    period_minutes: period
})
task3.onTick(() => {
    task3_count++
    console.log(`task3 tick ${task3_count}`)
    task3.allowNextTick()
})
task3.start()

const min4 = 4 * 60 * 1000

setTimeout(() => {
    const errors = [] as string[]
    if (task1_count !== 2) {
        errors.push(`task1_count !== 2, task1_count === ${task1_count}`)
    }
    if (task2_count !== 3) {
        errors.push(`task2_count !== 3, task2_count === ${task2_count}`)
    }
    if (task3_count !== 1) {
        errors.push(`task3_count !== 1, task3_count === ${task3_count}`)
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

