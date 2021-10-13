import { Metronom, TMetronom } from "./app";

export { Metronom, TMetronom as TypeMetronom }

export function Create(options: TMetronom): Metronom {
    return new Metronom(options)
}