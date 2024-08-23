export class AppNotification extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: "open" });
    }
    createNotification(type, message) {
        const notification = document.createElement("div");
        notification.innerHTML = `
            <span>${message}</span>
            <button class='btn-remove'>x</button>
        `;
        notification.className = 'notification notification-type-' + type;
        const btn = notification.querySelector(".btn-remove");
        btn.addEventListener("click", () => this.removeNotification(notification));
        return notification;
    }
    addNotification(type, message) {
        const classActive = "notification-enter-active";
        const classFrom = "notification-enter-from";
        const classTo = "notification-enter-to";
        const notification = this.createNotification(type, message);
        notification.classList.add(classActive);
        notification.classList.add(classFrom);
        this.shadowRoot?.append(notification);
        const { transitionDelay, transitionDuration } = window.getComputedStyle(notification);
        const delay = parseFloat(transitionDelay) + parseFloat(transitionDuration);
        setTimeout(() => {
            notification.classList.remove(classFrom);
            notification.classList.add(classTo);
        }, 10);
        setTimeout(() => notification.classList.remove(classActive, classTo), delay * 1000);
        const timeoutId = setTimeout(() => {
            this.removeNotification(notification);
        }, 5000);
        notification.$timeoutId = timeoutId;
    }
    removeNotification(el) {
        clearTimeout(el.$timeoutId);
        el.classList.add("notification-leave-active");
        el.classList.add("notification-leave-from");
        const { transitionDelay, transitionDuration } = window.getComputedStyle(el);
        const delay = parseFloat(transitionDelay) + parseFloat(transitionDuration);
        setTimeout(() => el.classList.add("notification-leave-to"), 10);
        const timeoutId = setTimeout(() => el.remove(), delay * 1000);
        el.$timeoutId = timeoutId;
    }
    connectedCallback() {
        const styleEl = document.createElement("style");
        styleEl.textContent = `    
            .notifications {
                position: fixed;
                top: 50px;
                right: 0;
            }
            .notification {
                background: white;
                display: flex;
                justify-content: space-between;
                width: 350px;
                box-shadow: 2px 2px 2px 2px rbga(0, 0, 0.5);
                padding: 10px 20px;
                margin-bottom: 5px;
                border-left: 5px solid #263959;
            }

            .notification.notification-type-error {
                border-left: 5px solid rgb(146, 5, 5);
            }
            .notification.notification-type-sucesss {
                border-left: 5px solid #28a745;
            }   
            .notification.notification-type-warning {
                border-left: 5px solid #ffc107;
            }
            .notification.notification-type-info {
                border-left: 5px solid #17a2b8;
            }   
            .notification-enter-active,
            .notification-leave-active {
                transition: all 0.5s ease;
            }
            .notification-enter-from,
            .notification-leave-to {
                opacity: 0;
                transform: translateX(30px);
            }
            button {
                background-color: rgba(0,0,0,0);
                border:none;
                outline:none;
                cursor:pointer;
            }
                
        `;
        this.shadowRoot?.appendChild(styleEl);
        this.style.cssText = `
            position: fixed;
            top: 100px;
            right: 0;
        `;
    }
}
