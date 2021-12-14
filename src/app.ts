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
        if (this._options.kind === 'cron') {
            return {cron: this._options.cron, native: true}
        }

        const second = '0'
        let minute = '*'
        let hour = '*'
        const dayOfMonth = '*'
        const month = '*'
        let dayOfWeek = '*'

        if (this._options.periodicity === 'every') {
            minute = `*/${this._options.periodMinutes}`
        } else {
            const h = Math.floor(this._options.periodMinutes / 60)
            minute = `${this._options.periodMinutes - (h * 60)}`
            hour = `${h}`
        }

        const daysOfWeek = [
            this._options.weekdaySun === true ? 0 : undefined,
            this._options.weekdayMon === true ? 1 : undefined,
            this._options.weekdayTue === true ? 2 : undefined,
            this._options.weekdayWed === true ? 3 : undefined,
            this._options.weekdayThu === true ? 4 : undefined,
            this._options.weekdayFri === true ? 5 : undefined,
            this._options.weekdaySat === true ? 6 : undefined,
        ].filter(f => f)
        if (daysOfWeek.length < 7) {
            dayOfWeek = daysOfWeek.join(',')
        }

        return {cron: `${second} ${minute} ${hour} ${dayOfMonth} ${month} ${dayOfWeek}`, native: false}
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
        //this.job.cancel()
        schedule.cancelJob(this._job)
        this._job = undefined
    }
}