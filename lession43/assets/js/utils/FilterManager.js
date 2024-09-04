export class FilterManager {
    constructor(providers) {
        this.map = new Map();
        this.providers = providers.map(({ id, regexp, replacer }) => new FilterProvider(id, regexp, replacer));
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
    /**
     * - Tiến hành duyệt qua từng Filter một và chỉnh sửa lại nội dung của content
     * Như là nhúng link nhúng video.
     */
    applyFilter(content) {
        // Lưu trữ nội dung . Lưu trữ vị trí thay đổi
        content = this.applyProviders(content);
        // Tiến hành sửa đổi thực sự
        content = this.replaceAllContent(content);
        // Xóa đi dữ liệu không còn cần thiết
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
        const regexp = /\$\$(\w+)\$\$/g;
        return content.replaceAll(regexp, (match, g1) => {
            if (this.map.has(g1)) {
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
function embedPhoneLink(phoneNumber) {
    return `<a href="tel:${phoneNumber}">${phoneNumber}</a>`;
}
function embedEmailLink(email) {
    const aEl = document.createElement("a");
    aEl.href = `mailto:${email}`;
    aEl.textContent = email;
    return aEl.outerHTML;
}
function embedYoutubeLink(youtubeLink, id) {
    return `<iframe width="560" height="315" src="https://www.youtube.com/embed/${id}?si=CjtCwkca7pYIMeQ4"
        title="YouTube video player" frameborder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>`;
}
function embedLink(link) {
    const aEl = document.createElement("a");
    aEl.href = link;
    aEl.target = "_blank";
    aEl.textContent = link;
    return aEl.outerHTML;
}
function removeTrailingSpace(mutilSpace) {
    if (mutilSpace.includes("\n")) {
        return "\n";
    }
    return " ";
}
// Replacer là các hàm mà sẽ thay đổi nội dung của dữ liệu khớp tương ứng với regexp
const providers = [
    {
        id: "P",
        regexp: /(0|\+84)\d{9}/g,
        replacer: embedPhoneLink
    },
    {
        id: "M",
        regexp: /\w(?=[^@]{3,29}@)((\.|-)\w+|\w+)*@[a-zA-Z0-9](-[a-zA-Z0-9]|[a-zA-Z0-9])+(\.[a-zA-Z0-9](-[a-zA-Z0-9]|[a-zA-Z0-9])+){1,2}/g,
        replacer: embedEmailLink
    },
    {
        id: "YL",
        regexp: /https:\/\/www\.youtube\.com\/watch\?v=([\w-]{11})[^\s]*/g,
        replacer: embedYoutubeLink
    },
    {
        id: "YS",
        regexp: /https:\/\/youtu\.be\/([\w-]{11})[^\s]*/g,
        replacer: embedYoutubeLink
    },
    {
        id: "L",
        regexp: /https?:\/\/(www\.|ww2\.)?([\w-]+(\.[\w-]+)+)[^\s]*/g,
        replacer: embedLink
    },
    {
        id: "S",
        regexp: /\s{2,}/g,
        replacer: removeTrailingSpace
    },
];
export const embedManager = new FilterManager(providers);
