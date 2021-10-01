import { Metronom, TypeMetronom } from "./app";

export { TypeMetronom }

export function CreateMetronom(options: TypeMetronom): Metronom {
    return new Metronom(options)
}