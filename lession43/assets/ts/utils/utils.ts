import type { EscapeDictionary } from "../types/type"

export function applyTransitionClasses(el: HTMLElement, prefix: string): Promise<void> {
    return new Promise(resolve => {
        el.classList.add(`${prefix}-from`);
        el.classList.add(`${prefix}-active`)
        const { transitionDelay, transitionDuration } = window.getComputedStyle(el);

        setTimeout(() => {
            el.classList.add(`${prefix}-to`);
            el.classList.remove(`${prefix}-from`);
        }, 100);

        const trantitionTime = parseFloat(transitionDelay) + parseFloat(transitionDuration);
        setTimeout(() => {
            el.classList.remove(`${prefix}-active`, `${prefix}-to`);
            resolve();
        }, trantitionTime * 1000);
    })
}

export function showFromNow(dateStr: string): string {
    const intervalInSeconds = (new Date().getTime() - new Date(dateStr).getTime()) / 1000;

    const dateNames = [
        { name: "seconds", max: 60 },
        { name: "mins", max: 60 },
        { name: "hours", max: 24 },
        { name: "days", max: 30 },
        { name: "months", max: 30 },
        { name: "years", max: 30 },
    ]

    let currentTimeRes = intervalInSeconds;
    let max = 60;

    for (let i = 0; i < dateNames.length; i++) {

        if (intervalInSeconds < max) {
            return Math.floor(currentTimeRes) + " " + dateNames[i].name + " ago";

        } else {
            max *= dateNames[i].max;
            currentTimeRes /= dateNames[i].max;
        }
    }

    return Math.floor(currentTimeRes) + " " + "days ago"
}

type DateGetterMethods = 'getFullYear' | 'getMonth' | 'getDate' | 'getDay' | 'getHours' | 'getMinutes' | 'getSeconds' | 'getMilliseconds' | 'getTime';
type DateGetterEntry = [DateGetterMethods, any];


export function detailedFromNow(str: string): string {
    const diffDate = new Date(new Date(str).getTime() - Date.now());
    const entry: DateGetterEntry[] = [
        ['getFullYear', 'year'],
        ['getMonth', 'month'],
        ['getDate', 'day'],
        ['getHours', 'hours'],
        ['getMinutes', 'minutes'],
        ['getSeconds', 'seconds']
    ]


    const timeFormat = [];
    const startDate = new Date(0);
    for (const [getter, name] of entry) {
        const diff = diffDate[getter]() - startDate[getter]();
        timeFormat.push([diff, name]);
    }

    while (timeFormat.length > 0 && timeFormat[0][0] <= 0) {
        timeFormat.shift();
    }

    return timeFormat.map(entry => entry.join(" ")).join(",");
}

export function escapeHTML(str: string): string {
    const escapeDictionary: EscapeDictionary = {
        '&': '&amp;',
        '<': "&lt;",
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#x27;',
        '/': '&#x2F;'
    }

    return str
        .split("")
        .map(char => char in escapeDictionary ? escapeDictionary[char] : char)
        .join("")
}
