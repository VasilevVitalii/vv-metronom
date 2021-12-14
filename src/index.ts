import { Metronom, TMetronom, TMetronomCron, TMetronomCustom } from "./app";

export { Metronom, TMetronom as TypeMetronom, TMetronomCron, TMetronomCustom }

export function Create(options: TMetronom): Metronom {
    return new Metronom(options)
}