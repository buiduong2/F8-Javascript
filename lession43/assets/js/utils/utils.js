export function applyTransitionClasses(el, prefix) {
    return new Promise(resolve => {
        el.classList.add(`${prefix}-from`);
        el.classList.add(`${prefix}-active`);
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
    });
}
export function showFromNow(dateStr) {
    const intervalInSeconds = (new Date().getTime() - new Date(dateStr).getTime()) / 1000;
    const dateNames = [
        { name: "seconds", max: 60 },
        { name: "mins", max: 60 },
        { name: "hours", max: 24 },
        { name: "days", max: 30 },
        { name: "months", max: 30 },
        { name: "years", max: 30 },
    ];
    let currentTimeRes = intervalInSeconds;
    let max = 60;
    for (let i = 0; i < dateNames.length; i++) {
        if (intervalInSeconds < max) {
            return Math.floor(Math.max(0, currentTimeRes)) + " " + dateNames[i].name + " ago";
        }
        else {
            max *= dateNames[i].max;
            currentTimeRes /= dateNames[i].max;
        }
    }
    return Math.floor(Math.max(0, currentTimeRes)) + " " + "days ago";
}
export function detailedFromNow(str) {
    const diffDate = new Date(new Date(str).getTime() - Date.now());
    const entry = [
        ['getFullYear', 'year'],
        ['getMonth', 'month'],
        ['getDate', 'day'],
        ['getHours', 'hours'],
        ['getMinutes', 'minutes'],
        ['getSeconds', 'seconds']
    ];
    const timeFormat = [];
    const startDate = new Date(0);
    const offset = startDate.getTimezoneOffset();
    startDate.setMinutes(startDate.getMinutes() - offset);
    diffDate.setMinutes(diffDate.getMinutes() - offset);
    for (const [getter, name] of entry) {
        const diff = diffDate[getter]() - startDate[getter]();
        timeFormat.push([diff, name]);
    }
    while (timeFormat.length > 0 && timeFormat[0][0] <= 0) {
        timeFormat.shift();
    }
    return timeFormat.map(entry => entry.join(" ")).join(",");
}
export function escapeHTML(str) {
    const escapeDictionary = {
        '&': '&amp;',
        '<': "&lt;",
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#x27;',
        '/': '&#x2F;'
    };
    return str
        .split("")
        .map(char => char in escapeDictionary ? escapeDictionary[char] : char)
        .join("");
}
