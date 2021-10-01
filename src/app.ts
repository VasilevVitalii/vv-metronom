import * as schedule from 'node-schedule'

export type TypeMetronom = {
    kind: 'cron',
    cron: string
} | {
    kind: 'custom',
    weekday_sun: boolean,
    weekday_mon: boolean,
    weekday_tue: boolean,
    weekday_wed: boolean,
    weekday_thu: boolean,
    weekday_fri: boolean,
    weekday_sat: boolean,
    period_minutes: number,
    periodicity: 'every' | 'once'
}

export class Metronom {
    private options: TypeMetronom
    private job: schedule.Job
    private callback_ontick: () => void
    private allow_next_tick: boolean

    constructor(options: TypeMetronom) {
        this.allow_next_tick = true
        if (options.kind === 'cron') {
            this.options = {
                kind: 'cron',
                cron: options.cron || '0 * * * * *'
            }
        } else if (options.kind === 'custom') {
            this.options = {
                kind: 'custom',
                weekday_sun: options.weekday_sun ? true: false,
                weekday_mon: options.weekday_mon ? true: false,
                weekday_tue: options.weekday_tue ? true: false,
                weekday_wed: options.weekday_wed ? true: false,
                weekday_thu: options.weekday_thu ? true: false,
                weekday_fri: options.weekday_fri ? true: false,
                weekday_sat: options.weekday_sat ? true: false,
                period_minutes: !options.period_minutes || options.period_minutes < 1 || options.period_minutes > 1439 ? 60 : options.period_minutes,
                periodicity: options.periodicity === 'every' || options.periodicity === 'once' ? options.periodicity : 'every'
            }
        }
    }

    cron() : {cron: string, native: boolean} {
        if (this.options.kind === 'cron') {
            return {cron: this.options.cron, native: true}
        }

        const second = '0'
        let minute = '*'
        let hour = '*'
        const day_of_month = '*'
        const month = '*'
        let day_of_week = '*'

        if (this.options.periodicity === 'every') {
            minute = `*/${this.options.period_minutes}`
        } else {
            const h = Math.floor(this.options.period_minutes / 60)
            minute = `${this.options.period_minutes - (h * 60)}`
            hour = `${h}`
        }

        const day_of_week_list = [
            this.options.weekday_sun === true ? 0 : undefined,
            this.options.weekday_mon === true ? 1 : undefined,
            this.options.weekday_tue === true ? 2 : undefined,
            this.options.weekday_wed === true ? 3 : undefined,
            this.options.weekday_thu === true ? 4 : undefined,
            this.options.weekday_fri === true ? 5 : undefined,
            this.options.weekday_sat === true ? 6 : undefined,
        ].filter(f => f)
        if (day_of_week_list.length < 7) {
            day_of_week = day_of_week_list.join(',')
        }

        return {cron: `${second} ${minute} ${hour} ${day_of_month} ${month} ${day_of_week}`, native: false}
    }

    onTick(callback: () => void) {
        this.callback_ontick = callback
    }

    allowNextTick() {
        if (!this.job) return
        this.allow_next_tick = true
    }

    start(): boolean {
        if (this.job) return true
        this.allow_next_tick = true
        this.job = schedule.scheduleJob(this.cron().cron, () => {
            if (!this.allow_next_tick || !this.callback_ontick) return
            this.allow_next_tick = false
            this.callback_ontick()
        })
        if (this.job === null) {
            this.job = undefined
            return false
        }
        return true
    }

    stop() {
        if (!this.job) return
        this.allow_next_tick = false
        this.job.removeAllListeners()
        //this.job.cancel()
        schedule.cancelJob(this.job)
        this.job = undefined
    }
}