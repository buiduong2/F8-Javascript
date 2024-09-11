export class FilterManager {
    constructor(providers) {
        this.map = new Map();
        this.providers = providers;
        this.validateProviders();
    }
    validateProviders() {
        const idSet = new Set([...this.providers.map(provider => provider.id)]);
        if (idSet.size !== this.providers.length) {
            throw new Error("Type Error: Provider's Id must be Unique");
        }
        const allGlobalRegexp = this.providers
            .map(provider => provider.regexp)
            .every(regexp => regexp.global);
        if (!allGlobalRegexp) {
            throw new Error("Type Error: Modifler's regexp of Provider must be Global");
        }
    }
    applyFilter(content) {
        content = this.applyProviders(content);
        content = this.replaceAllContent(content);
        this.map = new Map();
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
        const regexp = /\$\$(.+?)\$\$/g;
        return content.replaceAll(regexp, (match, g1) => {
            if (this.map.has(g1)) {
                return this.map.get(g1);
            }
            return match;
        });
    }
}
class FilterProvider {
    constructor(id, regexp) {
        this.id = id;
        this.regexp = regexp;
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
class EmbedPhoneLink extends FilterProvider {
    constructor() {
        super("P", /(0|\+84)\d{9}/g);
    }
    replacer(phoneNumber) {
        return `<a href="tel:${phoneNumber}">${phoneNumber}</a>`;
    }
}
class EmbedEmailLink extends FilterProvider {
    constructor() {
        super("M", /\w(?=[^@]{3,29}@)((\.|-)\w+|\w+)*@[a-zA-Z0-9](-[a-zA-Z0-9]|[a-zA-Z0-9])+(\.[a-zA-Z0-9](-[a-zA-Z0-9]|[a-zA-Z0-9])+){1,2}/g);
    }
    replacer(email) {
        const aEl = document.createElement("a");
        aEl.href = `mailto:${email}`;
        aEl.textContent = email;
        return aEl.outerHTML;
    }
}
class EmbedYoutubeLink extends FilterProvider {
    constructor() {
        super("Y", /https:\/\/(?:www\.youtube\.com\/watch\?v=([\w-]{11})[^\s]*|youtu\.be\/([\w-]{11})[^\s]*)/g);
    }
    applyReplaceAll(content) {
        const idSet = new Set();
        const changedContent = [];
        content = content.replaceAll(this.regexp, (youtubeLink, id1, id2) => {
            const yId = id1 ?? id2;
            const id = this.id + "_" + yId;
            if (idSet.has(id)) {
                return "";
            }
            idSet.add(id);
            changedContent.push({ id, target: this.replacer(youtubeLink, yId) });
            return `$$${id}$$`;
        });
        return {
            content,
            changedContent
        };
    }
    replacer(youtubeLink, id) {
        return `<iframe width="560" height="315" src="https://www.youtube.com/embed/${id}"
            title="YouTube video player" frameborder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>`;
    }
}
class EmbedLink extends FilterProvider {
    constructor() {
        super("L", /https?:\/\/(www\.|ww2\.)?([\w-]+(\.[\w-]+)+)[^\s]*/g);
    }
    replacer(link) {
        const aEl = document.createElement("a");
        aEl.href = link;
        aEl.target = "_blank";
        aEl.textContent = link;
        return aEl.outerHTML;
    }
}
class RemoveTrailingSpace extends FilterProvider {
    constructor() {
        super("S", /\s{2,}/g);
    }
    replacer(mutilSpace) {
        if (mutilSpace.includes("\n")) {
            return "\n";
        }
        return " ";
    }
}
const providers = [
    new EmbedPhoneLink(),
    new EmbedEmailLink(),
    new EmbedYoutubeLink(),
    new EmbedLink(),
    new RemoveTrailingSpace(),
];
export const embedManager = new FilterManager(providers);
