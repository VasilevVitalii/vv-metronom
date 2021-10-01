import { Metronom, TypeMetronom } from "./app";

export { Metronom, TypeMetronom }

export function CreateMetronom(options: TypeMetronom): Metronom {
    return new Metronom(options)
}