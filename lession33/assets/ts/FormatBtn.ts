abstract class FormatAction<E extends HTMLElement> {
    btnEl: E;
    commandId: string;
    contentEl: HTMLElement;

    constructor(selector: string, commandId: string, contentEl: HTMLElement) {
        this.btnEl = document.querySelector(selector) as E;
        this.commandId = commandId;
        this.contentEl = contentEl;
    }

    abstract addActiveState(node?: HTMLElement): void;

    abstract removeActive(): void;

    abstract toggleActive(): void;

    abstract getEventType(): string;

    abstract eventHandler(): void;

    addEventListener() {
        this.btnEl.addEventListener(this.getEventType(), this.eventHandler.bind(this));
    }

}

class FormatBtn extends FormatAction<HTMLButtonElement> {
    getEventType(): string {
        return "click"
    }
    addActiveState(): void {
        this.btnEl.classList.add("active")
    }
    removeActive(): void {
        this.btnEl.classList.remove("active")
    }

    toggleActive(): void {
        this.btnEl.classList.toggle("active")
    }

    eventHandler(): void {
        document.execCommand(this.commandId, false);
        this.contentEl.focus();
        this.btnEl.classList.toggle("active");
    }

}

class FormatColorBtn extends FormatAction<HTMLInputElement> {
    eventHandler(): void {
        document.execCommand(this.commandId, false, this.btnEl.value);
        this.contentEl.focus();
    }

    getEventType(): string {
        return "input"
    }

    addActiveState(node?: HTMLElement): void {
        if (!node) return;
        this.btnEl.value = node.getAttribute("color") || "#000000"
    }
    removeActive(): void {
        this.btnEl.value = "#000000"
    }

    toggleActive(): void {
        return;
    }

}