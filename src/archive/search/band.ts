// decodeBand is a helper for reading results from JSON, it is not intended for public use
export function decodeBand(json: unknown): Band|null {
    let name = "";
    let id = "";
    let min = 0;
    let max = 0;

    if (typeof json !== "object") {
        return null;
    }

    const argMap = json as {[key: string]: unknown};

    if (argMap?.name && typeof argMap.name == "string") {
        name = argMap.name;
    }

    if (argMap?.id && typeof argMap.id == "string") {
        id = argMap.id;
    }

    if (argMap?.min && typeof argMap.min == "number") {
        min = argMap.min;
    }

    if (argMap?.max && typeof argMap.max == "number") {
        max = argMap.max;
    }

    if (!(name||id||min||max)) {
        return null;
    }
    return new Band(name, id, min, max);
}

/**
 * Band contains information on a scenes spectral resolution, detailing the properties of a given imaging band
 * Full details can be found on the API documentation
 * 
 * @see {https://arlula.com/documentation/#archive-search|Archive Search endpoint documentation}
 * or
 * @see {https://arlula.com/documentation/#ref-band|Archive Band structure reference}
 */
export default class Band {
    name: string;
    id: string;
    min: number;
    max: number;
    constructor(name: string, id: string, min: number, max: number) {
        this.name = name;
        this.id = id;
        this.min = min;
        this.max = max;
    }

    // get the band min and max range as an object
    public range(): {min:number,max:number} {
        return {min: this.min, max: this.max};
    }

    // get the band min and max range as an array tuple
    public rangeArray(): number[] {
        return [this.min, this.max];
    }

    // get the band centre wavelength
    public centre(): number {
        return (this.min+this.max)/2;
    }

    // get the band width
    public width(): number {
        return this.max-this.min;
    }

    // get the band in the form centre and width (FWHM)
    public centreWidth(): {centre: number, width: number} {
        return {centre: this.centre(), width: this.width()};
    }

    // get the band as a tuple of the centre wavelength and band width
    public centreWidthArray(): number[] {
        return [this.centre(), this.width()];
    }
}