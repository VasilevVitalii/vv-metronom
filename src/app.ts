/* eslint-disable @typescript-eslint/naming-convention */
import * as schedule from 'node-schedule'

export type TMetronomCron = {
    kind: 'cron',
    cron: string
}
export type TMetronomCustom = {
    kind: 'custom',
    weekdaySun?: boolean,
    weekdayMon?: boolean,
    weekdayTue?: boolean,
    weekdayWed?: boolean,
    weekdayThu?: boolean,
    weekdayFri?: boolean,
    weekdaySat?: boolean,
    periodMinutes: number,
    periodicity: 'every' | 'once'
}

export type TMetronom = TMetronomCron | TMetronomCustom

export class Metronom {
    private _options: TMetronom
    private _job: schedule.Job
    private _callbackOnTick: () => void
    private _allowNextTick: boolean

    constructor(options: TMetronom) {
        this._allowNextTick = true
        if (options.kind === 'cron') {
            this._options = {
                kind: 'cron',
                cron: options.cron || '0 * * * * *'
            }
        } else if (options.kind === 'custom') {
            this._options = {
                kind: 'custom',
                weekdaySun: options.weekdaySun ? true: false,
                weekdayMon: options.weekdayMon ? true: false,
                weekdayTue: options.weekdayTue ? true: false,
                weekdayWed: options.weekdayWed ? true: false,
                weekdayThu: options.weekdayThu ? true: false,
                weekdayFri: options.weekdayFri ? true: false,
                weekdaySat: options.weekdaySat ? true: false,
                periodMinutes: !options.periodMinutes || options.periodMinutes < 1 || options.periodMinutes > 1439 ? 60 : options.periodMinutes,
                periodicity: options.periodicity === 'every' || options.periodicity === 'once' ? options.periodicity : 'every'
            }
        }
    }

    cron() : {cron: string, native: boolean} {
        return Cron(this._options)
    }

    onTick(callback: () => void) {
        this._callbackOnTick = callback
    }

    allowNextTick() {
        if (!this._job) return
        this._allowNextTick = true
    }

    start(): boolean {
        if (this._job) return true
        this._allowNextTick = true
        this._job = schedule.scheduleJob(this.cron().cron, () => {
            if (!this._allowNextTick || !this._callbackOnTick) return
            this._allowNextTick = false
            this._callbackOnTick()
        })
        if (this._job === null) {
            this._job = undefined
            return false
        }
        return true
    }

    stop() {
        if (!this._job) return
        this._allowNextTick = false
        this._job.removeAllListeners()
        schedule.cancelJob(this._job)
        this._job = undefined
    }
}

export function Cron(metronom: TMetronom): {cron: string, native: boolean} {
    if (!metronom) {
        return {cron: undefined, native: false}
    }
    if (metronom.kind === 'cron') {
        return {cron: metronom.cron, native: true}
    } else if (metronom.kind === 'custom') {
        const second = '0'
        let minute = '*'
        let hour = '*'
        const dayOfMonth = '*'
        const month = '*'
        let dayOfWeek = '*'

        if (metronom.periodicity === 'every') {
            minute = `*/${metronom.periodMinutes}`
        } else if (metronom.periodicity === 'once') {
            const h = Math.floor(metronom.periodMinutes / 60)
            minute = `${metronom.periodMinutes - (h * 60)}`
            hour = `${h}`
        } else {
            return {cron: undefined, native: false}
        }

        const daysOfWeek = [
            metronom.weekdaySun === true ? 0 : undefined,
            metronom.weekdayMon === true ? 1 : undefined,
            metronom.weekdayTue === true ? 2 : undefined,
            metronom.weekdayWed === true ? 3 : undefined,
            metronom.weekdayThu === true ? 4 : undefined,
            metronom.weekdayFri === true ? 5 : undefined,
            metronom.weekdaySat === true ? 6 : undefined,
        ].filter(f => f !== undefined)
        if (dayOfWeek.length <= 0) {
            return {cron: undefined, native: false}
        }
        if (daysOfWeek.length < 7) {
            dayOfWeek = ''
            let regular = [] as number[]
            for (let i = 0; i < daysOfWeek.length; i++) {
                if (regular.length > 0 && regular[regular.length - 1] + 1 === daysOfWeek[i]) {
                    regular.push(daysOfWeek[i])
                } else {
                    if (dayOfWeek.length > 0) dayOfWeek = `${dayOfWeek},`
                    if (regular.length > 2) {
                        dayOfWeek = `${dayOfWeek}${regular[0]}-${regular[regular.length-1]}`
                    } else {
                        dayOfWeek = `${dayOfWeek}${regular.join(',')}`
                    }
                    regular = [daysOfWeek[i]]
                }
            }
            if (regular.length > 0) {
                if (dayOfWeek.length > 0) dayOfWeek = `${dayOfWeek},`
                if (regular.length > 2) {
                    dayOfWeek = `${dayOfWeek}${regular[0]}-${regular[regular.length-1]}`
                } else {
                    dayOfWeek = `${dayOfWeek}${regular.join(',')}`
                }
            }
        }

        return {cron: `${second} ${minute} ${hour} ${dayOfMonth} ${month} ${dayOfWeek}`, native: false}
    } else {
        return {cron: undefined, native: false}
    }
}