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
        }, {
            root: null,
            rootMargin: '0px',
            threshold: 0.1
        });
    }
    addStyle() {
        this.style.cssText = `
            width: 20px;
            height: 20px;
            transform: translateY(-100px);
            cursor: none;
            display:block;
        `;
    }
    connectedCallback() {
        this.observer.observe(this);
    }
    disconnectedCallback() {
        this.observer.unobserve(this);
    }
}
