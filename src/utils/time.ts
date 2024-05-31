const DAY_MILLISECONDS = 24 * 60 * 60 * 1000;

function getNormalizedTime(date: Date): number {
    const clone = new Date(date);

    clone.setHours(0);
    clone.setMinutes(0);
    clone.setSeconds(0);

    return clone.getTime();
}

export function getDaysDiff(a: Date, b: Date): number {
    const aTime = getNormalizedTime(a);
    const bTime = getNormalizedTime(b);

    return Math.round((aTime - bTime) / DAY_MILLISECONDS);
}
