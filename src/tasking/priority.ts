
export function decodePriority(json: unknown): Priority|null {
    let key = "";
    let name = "";
    let description = "";
    let percent = 0;
    let amount = 0;

    if (typeof json !== "object") {
        return null;
    }

    const argMap = json as {[key: string]: unknown};

    if (argMap?.key && typeof argMap.key == "string") {
        key = argMap.key;
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

    if (!(key||name||description||percent||amount)) {
        return null;
    }
    return new Priority(key, name, description, percent, amount);
}

export class Priority {
    key:            string;
    name:           string;
    description:    string;
    loadingPercent: number;
    loadingAmount:  number;
    constructor(
        key:            string,
        name:           string,
        description:    string,
        loadingPercent: number,
        loadingAmount:  number,
    ) {
        this.key = key;
        this.name = name;
        this.description = description;
        this.loadingPercent = loadingPercent;
        this.loadingAmount = loadingAmount;
    }
    
}
