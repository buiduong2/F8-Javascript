export class AudioWrapper {

    el: HTMLAudioElement;
    actionBtn: HTMLButtonElement;

    constructor(el: HTMLAudioElement) {
        this.el = el;
        this.actionBtn = document.querySelector(".player-actions .player-btn") as HTMLButtonElement;
        this.moute();
    }

    moute(): void {
        
    }
}