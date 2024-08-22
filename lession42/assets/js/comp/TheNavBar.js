import { store } from "../index.js";
import { Router } from "../utils/Router.js";
export class TheNavBar extends HTMLElement {
    constructor() {
        super();
        this.userEl = document.createElement("div");
        this.isConnectedHtml = true;
    }
    addEventHandler() {
        const userDropDown = this.querySelector("#user-dropdown");
        const userInfo = this.userEl.querySelector(".user-link");
        const logOutBtnEl = this.querySelector(".logout-btn");
        let isFetching = false;
        logOutBtnEl.addEventListener("click", async (e) => {
            e.preventDefault();
            if (isFetching) {
                return;
            }
            isFetching = true;
            const res = await store.logout();
            isFetching = false;
            Router.getIntance().renderPageFromHash();
        });
        const clickOutside = (e) => {
            if (!userDropDown.contains(e.target)) {
                userDropDown.classList.remove("active-drop");
            }
        };
        userInfo.addEventListener("click", e => {
            e.stopPropagation();
            e.preventDefault();
            if (!userDropDown.classList.contains("active-drop")) {
                document.addEventListener("click", clickOutside, { once: true });
            }
            else {
                document.removeEventListener("click", clickOutside);
            }
            userDropDown.classList.toggle("active-drop");
        });
    }
    addInfoUserEl() {
        if (!store.user)
            return;
        const userNameEl = this.userEl.querySelector(".user-name");
        userNameEl.textContent = store.user.name;
    }
    connectedCallback() {
        if (this.isConnectedHtml) {
            this.innerHTML = innerHTML;
            this.userEl = this.querySelector(".navbar-user");
            store.authListeners.push(this.addInfoUserEl.bind(this));
            this.addInfoUserEl();
            this.addEventHandler();
        }
    }
    disconnectedCallback() {
    }
}
const innerHTML = `
        <header class="header" id="header">

            <app-link v-to="{ name :'Blog' }" class="logo">
                <img src="./assets/img/vueschool-logo.svg">
            </app-link>

            <div class="btn-hamburger ">
                <!-- use .btn-humburger-active to open the menu -->
                <div class="top bar"></div>
                <div class="middle bar"></div>
                <div class="bottom bar"></div>
            </div>

            <!-- use .navbar-open to open nav -->
            <nav class="navbar">
                <ul>
                    <app-auth v-auth="auth">
                        <li class="navbar-user" data-auth="auth">
                            <a class="user-link" href="#">
                                <img class="avatar-small"
                                    src="./assets/img/default-avatar.jpg"
                                    alt="">
                                <span>
                                    <span class="user-name">Alex Kyriakidis</span>
                                    <img class="icon-profile" src="./assets/img/arrow-profile.svg" alt="">
                                </span>
                            </a>
    
                            <!-- dropdown menu -->
                            <!-- add class "active-drop" to show the dropdown -->
                            <div id="user-dropdown" >
                                <div class="triangle-drop"></div>
                                <ul class="dropdown-menu">
                                    <li class="dropdown-menu-item"><app-link v-to="{ name: 'Me' }">View profile</app-link></li>
                                    <li class="dropdown-menu-item"><a href="#" class="logout-btn">Log out</a></li>
                                </ul>
                            </div>
                        </li>
                    </app-auth>
                    <app-auth v-auth="guest">
                        <li class="navbar-item">
                            <app-link v-to="{name: 'Login'}" data-auth="guest">Sign In</app-link>
                        </li>
                        <li class="navbar-item">
                            <app-link v-to="{name: 'Register'}" data-auth="guest">Register</app-link>
                        </li>
                    </app-auth>
                </ul>

                <ul>
                    <li class="navbar-item">
                        <app-link v-to="{name: 'Blog'}">Home</app-link>
                    </li>
                    <!-- Show these option only on mobile-->
                    <li class="navbar-item mobile-only navbar-user">
                        <a href="profile.html">My Profile</a>
                    </li>
                    <li class="navbar-item mobile-only navbar-user">
                        <a href="#">Logout</a>
                    </li>
                </ul>
            </nav>
        </header>
`;
