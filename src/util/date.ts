
function pad(num: number, size: number): string {
    let numStr = num.toString();
    while (numStr.length < size) numStr = "0" + num;
    return numStr;
}

export default function formatYMDDate(date: Date): string {
    return `${date.getFullYear()}-${pad(date.getMonth()+1, 2)}-${pad(date.getDate(), 2)}`;
}