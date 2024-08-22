const interceptEvent = new Event("visibile");
export class AppInfinityScroll extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: "open" });
        this.addStyle();
        this.observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.dispatchEvent(interceptEvent);
                }
            });
        });
    }
    addStyle() {
        this.style.cssText = `
            width: 20px;
            height: 20px;
            background-color: red;
            transform: translateY(-50px);
            cursor: none;
        `;
    }
    connectedCallback() {
        this.observer.observe(this);
    }
    disconnectedCallback() {
        this.observer.unobserve(this);
    }
}
