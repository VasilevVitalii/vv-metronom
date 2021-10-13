# For NodeJS, scheduler, based on node-schedule
## License
**MIT**
## Install
```
npm i vv-metronom
```
## Example
Starting three tasks. First and second tasks - every 2 minutes, third task - at 9:00 AM each day

```javascript
import * as metronom from 'vv-metronom'

const task1 = metronom.Create({
    kind: 'cron',
    cron: '0 */2 * * * *'
})
task1.onTick(() => {
    console.log('tick from task1')
    task1.allowNextTick()
})
task1.start()

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
    periodMinutes: 2
})
console.log(`this timetable as cron format: ${task2.cron().cron}`)
task2.onTick(() => {
    console.log('tick from task1')
    task2.allowNextTick()
})
task2.start()

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
    periodMinutes: 60 * 9
})
console.log(`this timetable as cron format: ${task3.cron().cron}`)
task3.onTick(() => {
    console.log('tick from task3')
    task3.allowNextTick()
})
task3.start()
```