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
            return Math.floor(currentTimeRes) + " " + dateNames[i].name + " ago";
        }
        else {
            max *= dateNames[i].max;
            currentTimeRes /= dateNames[i].max;
        }
    }
    return Math.floor(currentTimeRes) + " " + "days ago";
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
class FilterManager {
    constructor() {
        this.map = new Map();
        this.providers = [
            new FilterProvider("P", /(0|\+84)\d{9}/g, embedPhoneLink),
            new FilterProvider("M", /\w(?=[^@]{3,29}@)((\.|-)\w+|\w+)*@[a-zA-Z0-9](-[a-zA-Z0-9]|[a-zA-Z0-9])+(\.[a-zA-Z0-9](-[a-zA-Z0-9]|[a-zA-Z0-9])+){1,2}/g, embedEmailLink),
            new FilterProvider("YL", /https:\/\/www\.youtube\.com\/watch\?v=([\w-]{11})[^\s]*/g, embedYoutubeLink),
            new FilterProvider("YS", /https:\/\/youtu\.be\/([\w-]{11})[^\s]*/g, embedYoutubeLink),
            new FilterProvider("L", /https?:\/\/(www\.|ww2\.)?([\w-]+(\.[\w-]+)+)[^\s]*/g, embedLink),
            new FilterProvider("S", /(?:[^\S\n ]|(\n)|( )){2,}/g, removeTrailingSpace),
        ];
    }
    apply(content) {
        this.map = new Map();
        content = this.applyProviders(content);
        content = this.replaceAllContent(content);
        return content;
    }
    applyProviders(content) {
        return this.providers.reduce((c, provider) => {
            const changedDetail = provider.applyReplaceAll(c);
            changedDetail.changedContent.forEach(({ id, target }) => {
                this.map.set(id, target);
            });
            return changedDetail.content;
        }, content);
    }
    replaceAllContent(content) {
        const regexp = /\$\$(\w+)\$\$/g;
        return content.replaceAll(regexp, (match, g1) => {
            if (g1) {
                return this.map.get(g1);
            }
            return match;
        });
    }
}
class FilterProvider {
    constructor(id, regexp, replacer) {
        this.id = id;
        this.regexp = regexp;
        this.replacer = replacer;
        if (!this.regexp.global) {
            throw new Error("Regexp must be Global");
        }
    }
    applyReplaceAll(content) {
        let count = 0;
        const changedContent = [];
        content = content.replaceAll(this.regexp, (...args) => {
            const id = this.id + "_" + String(count);
            changedContent.push({ id, target: this.replacer(...args) });
            return `$$${id}$$`;
        });
        return {
            content,
            changedContent
        };
    }
}
export const embedManager = new FilterManager();
function embedPhoneLink(match) {
    return `<a href="tel:${match}">${match}</a>`;
}
function embedEmailLink(match) {
    const aEl = document.createElement("a");
    aEl.href = `mailto:${match}`;
    aEl.textContent = match;
    return aEl.outerHTML;
}
function embedYoutubeLink(match, id) {
    return `<iframe width="560" height="315" src="https://www.youtube.com/embed/${id}?si=CjtCwkca7pYIMeQ4"
        title="YouTube video player" frameborder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>`;
}
function embedLink(match) {
    const aEl = document.createElement("a");
    aEl.href = match;
    aEl.target = "_blank";
    aEl.textContent = match;
    return aEl.outerHTML;
}
// Caution: Server has auto trim() content. Don't Need to trim() again
function removeTrailingSpace(match, g1, g2) {
    if (g1) {
        return "\n";
    }
    if (g2) {
        return " ";
    }
    return " ";
}
