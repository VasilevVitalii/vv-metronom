import { Metronom, TMetronom, TMetronomCron, TMetronomCustom, Cron } from "./app";

export { Metronom, TMetronom as TypeMetronom, TMetronomCron, TMetronomCustom, Cron }

export function Create(options: TMetronom): Metronom {
    return new Metronom(options)
}