
export function decodeCloudLevel(json: unknown): CloudLevel|null {
    let max = 0;
    let name = "";
    let description = "";
    let percent = 0;
    let amount = 0;

    if (typeof json !== "object") {
        return null;
    }

    const argMap = json as {[key: string]: unknown};

    if (argMap?.max && typeof argMap.max == "number") {
        max = argMap.max;
    }

    if (argMap?.name && typeof argMap.name == "string") {
        name = argMap.name;
    }

    if (argMap?.description && typeof argMap.description == "string") {
        description = argMap.description;
    }

    if (argMap?.loadingPercent && typeof argMap.loadingPercent == "number") {
        percent = argMap.loadingPercent;
    }

    if (argMap?.loadingAmount && typeof argMap.loadingAmount == "number") {
        amount = argMap.loadingAmount;
    }

    if (!(max||name||description||percent||amount)) {
        return null;
    }
    return new CloudLevel(max, name, description, percent, amount);
}

export class CloudLevel {
    max:            number;
    name:           string;
    description:    string;
    loadingPercent: number;
    loadingAmount:  number;
    constructor(
        max:            number,
        name:           string,
        description:    string,
        loadingPercent: number,
        loadingAmount:  number,
    ) {
        this.max = max;
        this.name = name;
        this.description = description;
        this.loadingPercent = loadingPercent;
        this.loadingAmount = loadingAmount;
    }
    
}
