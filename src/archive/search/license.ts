// decodeLicense is a helper for reading results from JSON, it is not intended for public use
export function decodeLicense(json: unknown): License|null {
    let name = "";
    let href = "";
    let percent = 0;
    let amount = 0;

    if (typeof json !== "object") {
        return null;
    }

    const argMap = json as {[key: string]: unknown};

    if (argMap?.name && typeof argMap.name == "string") {
        name = argMap.name;
    }

    if (argMap?.href && typeof argMap.href == "string") {
        href = argMap.href;
    }

    if (argMap?.loadingPercent && typeof argMap.loadingPercent == "number") {
        percent = argMap.loadingPercent;
    }

    if (argMap?.loadingAmount && typeof argMap.loadingAmount == "number") {
        amount = argMap.loadingAmount;
    }

    if (!(name||href||percent||amount)) {
        return null;
    }
    return new License(name, href, percent, amount);
}

/**
 * License contains a licensing option for ordering, and its associated pricing information
 * Full details can be found on the API documentation
 * 
 * @see {https://arlula.com/documentation/#archive-search|Archive Search endpoint documentation}
 * or
 * @see {https://arlula.com/documentation/#ref-license|Archive License structure reference}
 */
export default class License {
    name: string;
    href: string;
    loadingPercent: number;
    loadingAmount: number;
    constructor(name: string, href: string, loadingPercent: number, loadingAmount: number) {
        this.name = name;
        this.href = href;
        this.loadingPercent = loadingPercent;
        this.loadingAmount = loadingAmount;
    }

    public loadPrice(basePrice: number): number {
        return Math.ceil((basePrice * (1+(this.loadingPercent/100)) + this.loadingAmount)/100)*100
    }
}