export class AppAvatarImg extends HTMLElement {
    constructor() {
        super();
        this.isFirstRender = true;
    }
    connectedCallback() {
        if (this.isFirstRender) {
            const src = this.getAttribute("v-src");
            const userName = this.getAttribute("v-userName");
            if (!src || !userName)
                throw Error("v-src AND v-userName must be defined");
            const imgEl = document.createElement("img");
            imgEl.src = src;
            const ignoreAttributesName = ['v-src', 'v-userName'];
            this.appendChild(imgEl);
            Array.from(this.attributes).forEach(attr => {
                if (ignoreAttributesName.includes(attr.name))
                    return;
                imgEl.setAttribute(attr.name, attr.value);
            });
            imgEl.onerror = e => {
                const divEl = this.definedFallbackAvatar(userName, imgEl);
                imgEl.replaceWith(divEl);
                if (divEl.classList.contains("avatar-xlarge")) {
                    divEl.style.fontSize = '100px';
                    divEl.style.margin = "auto";
                }
            };
            this.isFirstRender = false;
        }
    }
    definedFallbackAvatar(username, imgEl) {
        const colors = ['#4285F4', '#DB4437', '#0F9D58', '#F4B400', '#9E9E9E'];
        const divEl = document.createElement("div");
        divEl.className = imgEl.className;
        const firstChar = username.trim().toLowerCase().charAt(0);
        divEl.textContent = firstChar;
        divEl.style.cssText = `
            color: white;
            background-color: ${colors[firstChar.charCodeAt(0) % colors.length]};
            display: flex;
            align-items: center;
            justify-content:center;
            font-size: 50px;
            font-weight: 400;
            vertical-align: middle;
            text-transform: uppercase;
        `;
        return divEl;
    }
}
