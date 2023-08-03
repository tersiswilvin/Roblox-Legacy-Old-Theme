// ==UserScript==
// @name         Legacy Site Restoration
// @namespace    userstyles.world/user/tersiswilvin
// @version      1.2.4
// @description  Restores Legacy Site elements back on Roblox.
// @author       TersisWilvin
// @match        *.roblox.com*
// @match        *.roblox.com/*
// @icon         https://images.rbxcdn.com/23421382939a9f4ae8bbe60dbe2a3e7e.ico.gzip
// @grant        GM_xmlhttpRequest
// @run-at       document-start
// ==/UserScript==

/*/== Variables ==/*/

const url = window.location.protocol+"//"+window.location.hostname

var Events = {
    CustomEvents: {
        Event1: {
            Enabled: false,
            Link: "",
            Source: "",
            Title: "",
        },
        Event2: {
            Enabled: false,
            Link: "",
            Source: "",
            Title: "",
        },
        Event3: {
            Enabled: false,
            Link: "",
            Source: "",
            Title: "",
        },
    },
    RobloxEvents: {
        GiftCards: {
            Enabled: false,
            Link: url+"/sponsored/Giftcards",
            Source: "https://images.rbxcdn.com/9efed3e5941099646c48c0ce4f0fae40",
            Title: "Giftcards",
        }
    },
}

var Settings = {
    BulkLoading: false, /*/ Loads everything at once then in chunks (may be slower) /*/
    CustomEvents: false, /*/ (Configurable => Events.CustomEvents) Uses your custom events then Roblox events. /*/
    DeveloperOptions: {
        demoMode: false,
        forceMembership: false,
        forceinfLoading: false,
        fix2020homeFormat: false,
        /*/ My Feed FFlags /*/
        Soothsayer: true, /*/ Swaps the /feeds/ error page content with the my feed page content /*/
        enablePosting: true, /*/ Currently not function, however adds the input field and post button back on the page /*/
        GamestoExperience: false, /*/ Swaps Game(s) text to Experience(s) /*/
        CatalogtoAvatarShop: false, /*/ Swaps Catalog to Avatar Shop /*/
        enableforumlistItem: false, /*/ Enables the last list item for forums /*/
        ModernFormat: true, /*/ Uses 2021/2022 HTML then the 2018 HTML originally used /*/
    },
    DisplayNames: false, /*/ (2021+) Swaps usernames with displaynames on the home header /*/
    FavIcon: "2018L", /*/ {"2012M", "2015L", "2017E", "2017L", "2018L"} /*/
    homeGreeting: true, /*/ (Configurable => homeGreetingType) Adds the Greeting back to the homepage, requires RestoreHomePage to be enabled. (This was eventually removed in 2021+) /*/
    homeGreetingType: "Hello", /*/ {"Dynamic", "Hello", "Welcome"} /*/
    homeFormat: "2017", /*/ {"2017", "2020", "2021", "2022"} (Warning: If you use RoPro please use "2017" or "2020" as anything later breaks most played.) /*/
    homeavatarPresences: false, /*/ Adds the status icon to your home header avatar /*/
    JSClasses: true, /*/ Adds classes to the body for certain options that are enabled for themes/extentions. /*/
    MembershipType: "OBC", /*/ (2017){"BC", "TBC", "OBC"} (2020 - 2022){"Premium"} /*/
    ORHCompatible: false, /*/ (2021) Swaps CSS to use aubymori Old Roblox Header for legacy theme compatibility. /*/
    RestoreLegacyFavIcon: true, /*/ (Configurable => FavIcon) Replaces the favicon in your browser to what year is set. /*/
    RestoreEvents: true, /*/ Brings back events in the sidebar, used along customevents. /*/
    RestoreHomePage: true, /*/ (Configurable => homeFormat) Brings back the username and user avatar back on the home page /*/
    RestoreMyFeed: true, /*/ Restores "My Feed" back onto the side navigation bar /*/
    RestoreUpgradeNow: true, /*/ Replaces "Get Premium" to "Upgrade Now" /*/
}

var userData = {
    avatar: {
        data: {
            imageUrl: null,
            Response: {},
            state: null,
            targetId: 1,
        }
    },
    displayName: null,
    id: "{id}",
    Membership: false,
    name: null,
    Response: {},
    userPresences: {
        Errored: false,
        gameId: null,
        invisibleModeExpiry: null,
        lastLocation: "string",
        lastOnline: null,
        placeId: 0,
        Response: {},
        rootPlaceId: 0,
        universeId: 0,
        userLastPresenceType: 0,
        userPresenceType: 0,
        userId: 0,
    },
    Status: {
        AvatarDataErrored: false,
        AvatarDataPaused: false,
        AvatarDataLoaded: false,
        ErrorStatus: {},
        FullyLoaded: false,
        FullyLoadedErrored: false,
        FullyLoadedPaused: false,
        InfoDataErrored: false,
        InfoDataPaused: false,
        InfoDataLoaded: false,
        MembershipDataErrored: false,
        MembershipDataPaused: false,
        MembershipDataLoaded: false,
    },
}

/*/== Functions ==/*/

function homeGreeting() {
    if ((Settings.homeGreetingType == "Dynamic" || Settings.homeGreetingType == "Hello" || Settings.homeGreetingType == "Welcome") && Settings.homeGreeting) {
        const hours = new Date().getHours()
        return ((Settings.homeGreetingType == "Dynamic" && (hours < 5 ? "Night" : hours < 12 ? "Morning" : hours < 18 ? "Afternoon" : "Evening") || Settings.homeGreetingType) + ", ")
    } else {
        return ""
    }
}
function insertAfter(NewElement, ExistingElement) {
    ExistingElement.parentNode.insertBefore(NewElement, ExistingElement.nextSibling)
}
function MembershipTemplate(parentElement) {
    var membershipiconcontainer, membershipicon
    switch(Settings.MembershipType) {
        case "BC":
            membershipicon = document.createElement("span")
            membershipicon.classList.add("icon-bc")
            parentElement.appendChild(membershipicon)
            break
        case "TBC":
            membershipicon = document.createElement("span")
            membershipicon.classList.add("icon-tbc")
            parentElement.appendChild(membershipicon)
            break
        case "OBC":
            membershipicon = document.createElement("span")
            membershipicon.classList.add("icon-obc")
            parentElement.appendChild(membershipicon)
            console.log(membershipicon)
            break
        case "Premium":
            if (Settings.homeFormat == "2020") {
                membershipicon = document.createElement("span")
                membershipicon.classList.add("medium-icon", "icon-premium-medium")
                parentElement.parentNode.insertBefore(membershipicon, parentElement)
                membershipicon = document.createElement("span")
                membershipicon.classList.add("small-icon", "icon-premium-small")
                parentElement.parentNode.insertBefore(membershipicon, parentElement)
            } else if (Settings.homeFormat == "2021" || Settings.homeFormat == "2022") {
                membershipiconcontainer = document.createElement("div")
                membershipiconcontainer.classList.add("user-icon-container")
                parentElement.parentNode.insertBefore(membershipiconcontainer, parentElement)
                membershipicon = document.createElement("span")
                membershipicon.classList.add("medium-icon", "icon-premium-medium")
                membershipiconcontainer.appendChild(membershipicon)
                membershipicon = document.createElement("span")
                membershipicon.classList.add("small-icon", "icon-premium-small")
                membershipiconcontainer.appendChild(membershipicon)
            }
            break
        default:
            var errorcontainer = document.createElement("div");
            errorcontainer.classList.add("error-container");
            parentElement.appendChild(errorcontainer);
            membershipicon = document.createElement('span');
            membershipicon.classList.add("icon-warning");
            errorcontainer.appendChild(membershipicon);
            var iconerrorlabel = document.createElement("span");
            iconerrorlabel.classList.add("text-error", "ng-binding");
            iconerrorlabel.textContent = " Invalid Membership Type";
            errorcontainer.appendChild(iconerrorlabel)
    }
}
function SponsorTemplate(parentChild, link, title, source, InsertAfter) {
    const sponsorBase = document.createElement("li")
    sponsorBase.classList.add("rbx-nav-sponsor")
    sponsorBase.setAttribute("ng-non-bindable", "")
    if (InsertAfter) {
        insertAfter(sponsorBase, parentChild)
    } else {
        parentChild.appendChild(sponsorBase)
    }
    const sponsorItem = document.createElement("a")
    sponsorItem.classList.add("text-nav", "menu-item")
    sponsorItem.setAttribute("href", link)
    sponsorItem.setAttribute("title", title)
    sponsorBase.appendChild(sponsorItem)
    const sponsorimg = document.createElement("img")
    sponsorimg.setAttribute("src", source)
    sponsorItem.appendChild(sponsorimg)
}
function StyleSheet() {
    switch(Settings.homeFormat) {
        case "2017":
            return `
.home-header {
    margin-bottom: 12px;
}

.home-header:before,.home-header:after {
    content: " ";
    display: table;
}

.home-header:after {
    clear: both;
}

.home-header .avatar,.home-header .home-header-content {
    float: left;
}

.home-header .avatar {
    margin-right: 24px;
}

.home-header-content {
    width: 75%;
    width: calc(100% - 180px - 36px);
    position: relative;
}
.ropro-enabled .home-header-content {
    width: 40%;
    width: calc(100% - 180px - 400px);
}

@media(max-width: 991px) {
    .home-header-content {
        padding:0 15px;
    }
}

.home-header-content h1 {
    margin: 36px 0 12px;
}

.non-bc h1 {
    margin-top: 60px;
}

@media(max-width: 991px) {
    .home-header .avatar {
        height:120px;
        width: 120px;
    }

    .home-header .avatar img {
        height: 120px;
        width: 120px;
    }

    .home-header-content {
        width: 75%;
        width: calc(100% - 120px - 36px);
    }
    .ropro-enabled .home-header-content {
        width: 25%;
        width: calc(100% - 120px - 425px);
    }

    .home-header-content h1 {
        margin: 12px 0 6px;
    }

    .non-bc h1 {
        margin-top: 36px;
    }
}

@media(max-width: 767px) {
    .home-header .avatar {
        display:none;
    }

    .home-header-content {
        width: 100%;
    }

    .home-header-content:before,.home-header-content:after {
        content: " ";
        display: table;
    }

    .home-header-content:after {
        clear: both;
    }

    .home-header-content h1,.home-header-content span[class^="icon"] {
        float: left;
        margin: 12px 0;
    }

    .home-header-content h1 {
        max-width: 80%;
        max-width: calc(100% - 52px - 12px);
    }

    .home-header-content span[class^="icon"] {
        margin: 24px 0 0 12px;
    }
}

@media(max-width: 543px) {
    .home-header-content {
        width:100%;
    }

    .home-header-content h1,.home-header-content span[class^="icon"] {
        float: none;
        margin: 6px 0;
    }

    .home-header-content span[class^="icon"] {
        float: left;
    }
}
        `
            break
        case "2020":
            return `
.home-header {
    margin-bottom: 12px;
}

.home-header:before,.home-header:after {
    content: " ";
    display: table;
}

.home-header:after {
    clear: both;
}

.home-header .avatar,.home-header .home-header-content {
    float: left;
}

.home-header .avatar {
    margin-right: 24px;
}

.home-header-content {
    width: 75%;
    width: calc(100% - 180px - 36px);
    position: relative;
}
.ropro-enabled .home-header-content {
    width: 40%;
    width: calc(100% - 180px - 400px);
}

@media(max-width: 991px) {
    .home-header-content {
        padding:0 15px;
    }
}

.home-header-content h1 {
    margin: 36px 0 12px;
}
.hF2020PositionFix h1 {
    margin-top: 60px;
}

.home-header-content h1 .icon-premium-medium {
    display: inline-block;
    margin-bottom: 5px;
}

.home-header-content h1 .icon-premium-small {
    display: none;
}

@media(max-width: 991px) {
    .home-header .avatar {
        height:120px;
        width: 120px;
    }

    .home-header .avatar img {
        height: 120px;
        width: 120px;
    }

    .home-header-content {
        width: 75%;
        width: calc(100% - 120px - 36px);
    }
    .ropro-enabled .home-header-content {
        width: 25%;
        width: calc(100% - 120px - 425px);
    }

    .home-header-content h1 {
        margin: 12px 0 6px;
    }
    .hF2020PositionFix h1 {
        margin-top: 36px;
    }

    .home-header-content h1 .icon-premium-medium {
        display: inline-block;
        margin-bottom: 5px;
    }

    .home-header-content h1 .icon-premium-small {
        display: none;
    }
}

@media(max-width: 767px) {
    .home-header .avatar {
        display:none;
    }

    .home-header-content {
        width: 100%;
    }

    .home-header-content:before,.home-header-content:after {
        content: " ";
        display: table;
    }

    .home-header-content:after {
        clear: both;
    }

    .home-header-content h1,.home-header-content span[class^="icon"] {
        margin: 12px 0;
    }

    .home-header-content h1 {
        max-width: 80%;
        max-width: calc(100% - 52px - 12px);
    }

    .home-header-content h1 .icon-premium-medium {
        display: none;
    }

    .home-header-content h1 .icon-premium-small {
        display: inline-block;
    }
}

@media(max-width: 543px) {
    .home-header-content {
        width:100%;
    }

    .home-header-content h1,.home-header-content span[class^="icon"] {
        margin: 8px 0;
    }
}
            `
            break
        case "2021":
            if (Settings.ORHCompatible) {
                return `
.home-header-shimmer {
    display: flex;
    margin-bottom: 25px;
}

@media(max-width: 767px) {
    .home-header-shimmer {
        padding:0 0 0 15px;
    }
}

.home-header-shimmer .shimmer-home-avatar {
    width: 150px;
    height: 150px;
    border-radius: 50%;
    margin: 0 24px 0 0;
}

@media(max-width: 767px) {
    .home-header-shimmer .shimmer-home-avatar {
        display:none;
    }
}

.home-header-shimmer .shimmer-home-user-info {
    display: flex;
    flex-direction: column;
    justify-content: center;
    width: 30%;
}

@media(max-width: 767px) {
    .home-header-shimmer .shimmer-home-user-info {
        width:60%;
    }
}

.home-header-shimmer .shimmer-home-user-info .shimmer-line {
    height: 32px;
}

.home-header {
    display: flex;
    flex-direction: row;
    margin-bottom: 25px;
}

.user-info-container {
    display: flex;
    align-items: center;
    margin-left: 25px;
}

.user-avatar-container {
    min-width: 150px;
}
                `
            } else {
                return `
.home-header {
    margin-bottom: 12px;
}

.home-header:before,.home-header:after {
    content: " ";
    display: table;
}

.home-header:after {
    clear: both;
}

.home-header .avatar,.home-header .home-header-content {
    float: left;
}

.home-header .avatar {
    margin-right: 24px;
}

.home-header-container {
    min-height: 150px;
    margin-bottom: 12px;
}

@media(max-width: 767px) {
    .home-header-container {
        min-height:60px;
    }
}

.home-header-content {
    width: 75%;
    width: calc(100% - 180px - 36px);
    position: relative;
}

@media(max-width: 991px) {
    .home-header-content {
        padding:0 15px;
    }
}

.home-header-content h1 {
    margin: 36px 0 12px;
}

.home-header-content h1 .icon-premium-medium {
    display: inline-block;
    margin-bottom: 5px;
}

.home-header-content h1 .icon-premium-small {
    display: none;
}

.home-header-shimmer {
    display: flex;
}

@media(max-width: 767px) {
    .home-header-shimmer {
        padding:0 0 0 15px;
    }
}

.home-header-shimmer .shimmer-home-avatar {
    width: 150px;
    height: 150px;
    border-radius: 50%;
    margin: 0 24px 0 0;
}

@media(max-width: 767px) {
    .home-header-shimmer .shimmer-home-avatar {
        display:none;
    }
}

.home-header-shimmer .shimmer-home-user-info {
    display: flex;
    flex-direction: column;
    justify-content: center;
    width: 30%;
}

@media(max-width: 767px) {
    .home-header-shimmer .shimmer-home-user-info {
        width:60%;
    }
}

.home-header-shimmer .shimmer-home-user-info .shimmer-line {
    height: 32px;
}

@media(max-width: 991px) {
    .home-header .avatar {
        height:120px;
        width: 120px;
    }

    .home-header .avatar img {
        height: 120px;
        width: 120px;
    }

    .home-header-content {
        width: 75%;
        width: calc(100% - 120px - 36px);
    }

    .home-header-content h1 {
        margin: 12px 0 6px;
    }

    .home-header-content h1 .icon-premium-medium {
        display: inline-block;
        margin-bottom: 5px;
    }

    .home-header-content h1 .icon-premium-small {
        display: none;
    }
}

@media(max-width: 767px) {
    .home-header .avatar {
        display:none;
    }

    .home-header-content {
        width: 100%;
    }

    .home-header-content:before,.home-header-content:after {
        content: " ";
        display: table;
    }

    .home-header-content:after {
        clear: both;
    }

    .home-header-content h1,.home-header-content span[class^="icon"] {
        margin: 12px 0;
    }

    .home-header-content h1 {
        max-width: 80%;
        max-width: calc(100% - 52px - 12px);
    }

    .home-header-content h1 .icon-premium-medium {
        display: none;
    }

    .home-header-content h1 .icon-premium-small {
        display: inline-block;
    }
}

@media(max-width: 543px) {
    .home-header-content {
        width:100%;
    }

    .home-header-content h1,.home-header-content span[class^="icon"] {
        margin: 8px 0;
    }
}

@media (max-width: 767px) {
    .user-avatar-container {
        display:none
    }
}

.user-info-container {
    display: flex
}

.user-info-container .user-icon-container,.user-info-container .user-name-container {
    display: inline-flex;
    flex-direction: column;
    justify-content: center
}

.user-info-container .user-icon-container {
    margin: 0 12px 0 0
}

@media (max-width: 767px) {
    .user-info-container .user-icon-container .medium-icon {
        display:none
    }
}

.user-info-container .user-icon-container .small-icon {
    display: none
}

@media (max-width: 767px) {
    .user-info-container .user-icon-container .small-icon {
        display:inline-block
    }
}

.home-header {
    display: flex
}

@media (max-width: 767px) {
    .home-header {
        padding:0 0 0 15px
    }
}
                `
            }
            break
        case "2022":
            return `
@media (max-width: 767px) {
    .user-avatar-container {
        display:none
    }
}

.user-info-container {
    display: flex
}

.user-info-container .user-icon-container,.user-info-container .user-name-container {
    display: inline-flex;
    flex-direction: column;
    justify-content: center
}

.user-info-container .user-icon-container {
    margin: 0 12px 0 0
}

@media (max-width: 767px) {
    .user-info-container .user-icon-container .medium-icon {
        display:none
    }
}

.user-info-container .user-icon-container .small-icon {
    display: none
}

@media (max-width: 767px) {
    .user-info-container .user-icon-container .small-icon {
        display:inline-block
    }
}

.home-header {
    display: flex
}

@media (max-width: 767px) {
    .home-header {
        padding:0 0 0 15px
    }
}

.home-userinfo-upsell-container {
    display: flex;
    flex-direction: column;
    justify-content: center
}

.home-header {
    margin-bottom: 12px;
}

.home-header:before,.home-header:after {
    content: " ";
    display: table;
}

.home-header:after {
    clear: both;
}

.home-header .avatar,.home-header .home-header-content {
    float: left;
}

.home-header .avatar {
    margin-right: 24px;
}

.home-header-container {
    min-height: 150px;
    margin-bottom: 12px;
}

@media(max-width: 767px) {
    .home-header-container {
        min-height:60px;
    }
}

.home-header-content {
    width: 75%;
    width: calc(100% - 180px - 36px);
    position: relative;
}

@media(max-width: 991px) {
    .home-header-content {
        padding:0 15px;
    }
}

.home-header-content h1 {
    margin: 36px 0 12px;
}

.home-header-content h1 .icon-premium-medium {
    display: inline-block;
    margin-bottom: 5px;
}

.home-header-content h1 .icon-premium-small {
    display: none;
}

.home-header-shimmer {
    display: flex;
}

@media(max-width: 767px) {
    .home-header-shimmer {
        padding:0 0 0 15px;
    }
}

.home-header-shimmer .shimmer-home-avatar {
    width: 150px;
    height: 150px;
    border-radius: 50%;
    margin: 0 24px 0 0;
}

@media(max-width: 767px) {
    .home-header-shimmer .shimmer-home-avatar {
        display:none;
    }
}

.home-header-shimmer .shimmer-home-user-info {
    display: flex;
    flex-direction: column;
    justify-content: center;
    width: 30%;
}

@media(max-width: 767px) {
    .home-header-shimmer .shimmer-home-user-info {
        width:60%;
    }
}

.home-header-shimmer .shimmer-home-user-info .shimmer-line {
    height: 32px;
}

@media(max-width: 991px) {
    .home-header .avatar {
        height:120px;
        width: 120px;
    }

    .home-header .avatar img {
        height: 120px;
        width: 120px;
    }

    .home-header-content {
        width: 75%;
        width: calc(100% - 120px - 36px);
    }

    .home-header-content h1 {
        margin: 12px 0 6px;
    }

    .home-header-content h1 .icon-premium-medium {
        display: inline-block;
        margin-bottom: 5px;
    }

    .home-header-content h1 .icon-premium-small {
        display: none;
    }
}

@media(max-width: 767px) {
    .home-header .avatar {
        display:none;
    }

    .home-header-content {
        width: 100%;
    }

    .home-header-content:before,.home-header-content:after {
        content: " ";
        display: table;
    }

    .home-header-content:after {
        clear: both;
    }

    .home-header-content h1,.home-header-content span[class^="icon"] {
        margin: 12px 0;
    }

    .home-header-content h1 {
        max-width: 80%;
        max-width: calc(100% - 52px - 12px);
    }

    .home-header-content h1 .icon-premium-medium {
        display: none;
    }

    .home-header-content h1 .icon-premium-small {
        display: inline-block;
    }
}

@media(max-width: 543px) {
    .home-header-content {
        width:100%;
    }

    .home-header-content h1,.home-header-content span[class^="icon"] {
        margin: 8px 0;
    }
}
            `
    }
}

/*/== RunTime ==/*/

if (Settings.MembershipType == "Premium" && (Settings.homeFormat == "2017")) {
    Settings.homeFormat = "2020"
} else if ((Settings.MembershipType == "BC" || Settings.MembershipType == "TBC" || Settings.MembershipType == "OBC") && (Settings.homeFormat == "2020" || Settings.homeFormat == "2021" || Settings.homeFormat == "2022")) {
    Settings.homeFormat = "2017"
}

async function waitForElm(q) {
    while (document.querySelector(q) == null) {
        await new Promise(r => requestAnimationFrame(r));
    };
    return document.querySelector(q);
}

if (Settings.RestoreLegacyFavIcon) {
    waitForElm("link[rel*='icon']").then(async (hdrSec) => {
        switch(Settings.FavIcon) {
            case "2012M":
                hdrSec.href = "data:image/x-icon;base64,AAABAAEAEBAAAAAAIABoBAAAFgAAACgAAAAQAAAAIAAAAAEAIAAAAAAAQAQAAAAAAAAAAAAAAAAAAAAAAAA7KeYAY0vbAVxE3QWAT80Hw3q9BwAA/wCqfb4A3KWwBl1C38VdP9Zy/+2eEv//TAAAAPUAKB3wAEYy5gD/5p0AUjrgAGlQ2QA7K+cAjlbIALJsvwBwVdIIbFPZHlM73FIgHvj/Kyr5/xYS9vAjFu3RHxPtpDMm7X1IN+No/8ioLGhN2wB7XtYUSDTgTWBL4mx0WuiTQTbs2FI83544LOzEysr+/vz9/vrT1P3/wsP+/3J0/f8TDvb/PC3qvDYl7SIiEOYASjLbbTIu9f/d3P3/6+3//z48+f00Hd+5kpP8//////37+v7+////+b/B//9DOfDqYU7aWVE95QBMN+cAEAHlADwl22tGRPf9////9dHT//s1JuflVUfr6uvt//7///79////+5WW/f83KOnTPSTiKl1G3wBTPuABAAD/AQEA6QAmEuBsWFb4/v39/vmfn/z+OSLc96Ce+v3///7+/////oSE/P9CLeO5ak/XDEUv5wCygsQCQjLmAXhb0gAAAOwAEgPkanJx+f/////6VU7y/Tgq6P/p7P/+9PX+/HNw+Po+ItuSMiHhCGxcxRc4JeMs/9mwB0w54gBMOeIBAADzAC8a4YeIh/r/////+nl5+f6nqPz9///+/o6P/P8lIPH2WUnrvTMu9tM7NvTtJiP2+jUl4qYuJO0IKh/uAgAA+wAhEeqSmZn8//////n///////////////z///79+Pn//+fp///o6P7/7u///+Pk//1maPv/OSznsg4L+wAAAP4AKRvmq6Wm/P/////7bm35+VRP9vqMifv/vb7+//z8/v7///78///+/f7+/f7////6lpb8/DQh5MQCAPcAAAD/AC8h57m3t/z//////11V8tjHs90qNCDZXgwA6LuYmPz+/v7//Pn5/f79/f7+/v7++UtI9v9fPNN0US/VAAME/gAfFu60v7/9/v7+/vtZVPT4QDHiw0lB8MJNSPTqxcX8/v7+/v76+v7+///+/ePl//01K+371KWmLduvmQAAAP8LHhn1ydrb//7////45+j++9vc///s7f////////////z+/v799/f9/vv7//ykpv7/MyLkzk1U2gEDB/YB/+mUQUIz6eB+evb7qKX6/7++/P/R0f7/5+f//+7v///3+P///////////v/////7Y2H4/00w2YMKAvIAMSPvBt2ixgvjtq4oKQTEKUIe50YjE+VuPy7njk9D7K5US/DFYlv31Xd0+OSDgPn0dXX7/C8l7/25h705nnHGAIRh1QPurr4As4zBABgAzwApGeQAFAvvAAAA/wAeMf8AJJn/AAAAAAwAAMQuMQ/TfB8K4NQxD9N8/8uoGOCpuQDDkL0B/z8AAP8BAADgAQAAgAcAAIAPAACAHwAAgD8AAIADAACAAQAAgAEAAIYBAACAAwAAgAMAAIADAADwBwAA/8cAAA=="
                break
            case "2015L":
                hdrSec.href = "http://images.rbxcdn.com/7aee41db80c1071f60377c3575a0ed87.ico"
                break
            case "2017E":
                hdrSec.href = "https://images.rbxcdn.com/2bb82200dbc00ef3d000c5cf2c8f457b.ico"
                break
            case "2017L":
                hdrSec.href = "https://images.rbxcdn.com/1387da00c070fd34110985aee87f3155.ico.gzip"
                break
            case "2018L":
                hdrSec.href = "https://images.rbxcdn.com/23421382939a9f4ae8bbe60dbe2a3e7e.ico.gzip"
                break
        }
    })
}

waitForElm(".left-col-list").then(async (hdrSec) => {
    if (Settings.RestoreMyFeed) {
        if (Settings.JSClasses) {
            document.body.classList.add("MyFeedEnabled")
        }
        const navgroup = document.getElementById("nav-group")
        const feedsBase = document.createElement("li")
        insertAfter(feedsBase, navgroup.parentElement)
        const navmyfeed = document.createElement("a")
        navmyfeed.classList.add("dynamic-overflow-container", "text-nav")
        navmyfeed.setAttribute("href", url+"/feeds/")
        navmyfeed.setAttribute("id", "nav-my-feed")
        navmyfeed.setAttribute("target", "_self")
        feedsBase.appendChild(navmyfeed)
        const feeddiv = document.createElement("div")
        navmyfeed.appendChild(feeddiv)
        const feedsicon = document.createElement("span")
        feedsicon.classList.add("icon-nav-my-feed")
        feeddiv.appendChild(feedsicon)
        const feedsfontheader = document.createElement("span")
        feedsfontheader.classList.add("font-header-2", "dynamic-ellipsis-item")
        feedsfontheader.textContent = "My Feed"
        navmyfeed.appendChild(feedsfontheader)
    }
    if (Settings.RestoreUpgradeNow) {
        if (Settings.JSClasses) {
            document.body.classList.add("UNRenamedEnabled")
        }
        document.getElementById("upgrade-now-button").innerHTML = document.getElementById("upgrade-now-button").innerHTML.replace(/Get Premium/g, "Upgrade Now");
    }
    if (Settings.RestoreEvents) {
        if (Settings.JSClasses) {
            document.body.classList.add("EventsEnabled")
        }
        const EventsLbl = document.createElement("li")
        EventsLbl.classList.add("font-bold", "text-nav")
        EventsLbl.textContent = "Events"
        hdrSec.appendChild(EventsLbl)
        if (Settings.CustomEvents) {
            if (Events.CustomEvents.Event1.Enabled) {
                SponsorTemplate(hdrSec, Events.CustomEvents.Event1.Link, Events.CustomEvents.Event1.Title, Events.CustomEvents.Event1.Source, false)
            }
            if (Events.CustomEvents.Event2.Enabled) {
                SponsorTemplate(hdrSec, Events.CustomEvents.Event2.Link, Events.CustomEvents.Event2.Title, Events.CustomEvents.Event2.Source, Events.CustomEvents.Event2.Enabled && true || false)
            }
            if (Events.CustomEvents.Event3.Enabled) {
                SponsorTemplate(hdrSec, Events.CustomEvents.Event3.Link, Events.CustomEvents.Event3.Title, Events.CustomEvents.Event3.Source, (Events.CustomEvents.Event3.Enabled || Events.CustomEvents.Event2.Enabled) && true || false)
            }
        } else {
            if (Events.RobloxEvents.GiftCards.Enabled) {
                SponsorTemplate(hdrSec, Events.RobloxEvents.GiftCards.Link, Events.RobloxEvents.GiftCards.Title, Events.RobloxEvents.GiftCards.Source, false)
            }
        }
    }
})

if (window.location.href == url+"/feeds" || window.location.href == url+"/feeds/") {
    waitForElm(".content").then(async (hdrSec) => {
        if (Settings.DeveloperOptions.Soothsayer) {
            function listItemTemplate(id, secClassName, iconName, URL, body, content, parentElement, useInnerHTML) {
                var listitemBody = document.createElement("li")
                if (id != "None") {
                    listitemBody.setAttribute("id", id)
                }
                listitemBody.classList.add("list-item", (secClassName != "None") && secClassName)
                listitemBody.setAttribute("data-default-roblox-feed", "")
                parentElement.appendChild(listitemBody)
                var listHeader = document.createElement("a")
                listHeader.classList.add("list-header")
                listHeader.setAttribute("href", URL)
                listitemBody.appendChild(listHeader)
                var listIcon = document.createElement("span")
                listIcon.classList.add(iconName)
                listHeader.appendChild(listIcon)
                var listBody = document.createElement("div")
                listBody.classList.add("list-body")
                listitemBody.appendChild(listBody)
                var listBodyHeader
                if (Settings.DeveloperOptions.ModernFormat) {
                    listBodyHeader = document.createElement("h1")
                } else {
                    listBodyHeader = document.createElement("h2")
                }
                listBodyHeader.textContent = body
                listBody.appendChild(listBodyHeader)
                var listContent = document.createElement("p")
                listContent.classList.add("list-content")
                if (useInnerHTML) {
                    listContent.innerHTML = content
                } else {
                    listContent.textContent = content
                }
                listBody.appendChild(listContent)
                if (secClassName == "feed-game" && iconName == "icon-games") {
                    var FeaturedGamesContainer = document.createElement("div")
                    FeaturedGamesContainer.setAttribute("id", "FeaturedGamesContainer")
                    FeaturedGamesContainer.classList.add("list-gallery")
                    listBody.appendChild(FeaturedGamesContainer)
                }
                if (secClassName == "feed-creation" && (iconName == "icon-charactercustomizer" || iconName == "icon-nav-charactercustomizer")) {
                    var listGallery = document.createElement("ul")
                    listGallery.classList.add("list-gallery")
                    listBody.appendChild(listGallery)
                    var itemasset = document.createElement("li")
                    itemasset.classList.add("item-asset")
                    listGallery.appendChild(itemasset)
                    var itemassetimg = document.createElement("img")
                    itemassetimg.setAttribute("src", "https://images.rbxcdn.com/005a0f4d764d9c609ff4c37a2bb99006.png")
                    itemasset.appendChild(itemassetimg)
                    itemasset = document.createElement("li")
                    itemasset.classList.add("item-asset")
                    listGallery.appendChild(itemasset)
                    itemassetimg = document.createElement("img")
                    itemassetimg.setAttribute("src", "https://images.rbxcdn.com/e861c0c517df63e9f17e96685cc4bb14.png")
                    itemasset.appendChild(itemassetimg)
                    itemasset = document.createElement("li")
                    itemasset.classList.add("item-asset")
                    listGallery.appendChild(itemasset)
                    itemassetimg = document.createElement("img")
                    itemassetimg.setAttribute("src", "https://images.rbxcdn.com/7fd0bef40b29834e8add92234b352c3e.png")
                    itemasset.appendChild(itemassetimg)
                    itemasset = document.createElement("li")
                    itemasset.classList.add("item-asset")
                    listGallery.appendChild(itemasset)
                    itemassetimg = document.createElement("img")
                    itemassetimg.setAttribute("src", "https://images.rbxcdn.com/294ebb9ceaac3c5352de0ebecab909ec.png")
                    itemasset.appendChild(itemassetimg)
                }
            }
            var HomePageCSS = document.createElement("Style")
            HomePageCSS.innerHTML = `
.icon-default-creation, .icon-profile, .icon-develop, .icon-charactercustomizer, .icon-place, .icon-shirt, .icon-tshirt, .icon-decal, .icon-pants, .icon-models, .icon-tutorial, .feeds .icon-develop, .feeds .icon-charactercustomizer {
    background-image: url(/images/Shared/creation.svg);
    background-repeat: no-repeat;
    background-size: auto auto;
    width: 28px;
    height: 28px;
    display: inline-block;
    vertical-align: middle;
}
.light-theme .icon-default-creation, .light-theme .icon-profile, .light-theme .icon-develop, .light-theme .icon-charactercustomizer, .light-theme .icon-place, .light-theme .icon-shirt, .light-theme .icon-tshirt, .light-theme .icon-decal, .light-theme .icon-pants, .light-theme .icon-models, .light-theme .icon-tutorial, .light-theme .feeds .icon-develop, .light-theme .feeds .icon-charactercustomizer {
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' version='1.1' x='0px' y='0px' width='56px' height='308px' viewBox='0 0 56 308' enable-background='new 0 0 56 308' xml:space='preserve'%3E%3Cg id='label'%3E%3C/g%3E%3Cg id='BC'%3E%3C/g%3E%3Cg id='brand'%3E%3C/g%3E%3Cg id='generic'%3E%3C/g%3E%3Cg id='negative'%3E%3C/g%3E%3Cg id='creation'%3E%3Cpath id='tutorial-on' fill='%237B7C7D' d='M42,304c-0.4,0-0.8-0.3-0.9-0.7c0-0.1-0.9-2.3-4.1-2.3c-3.6,0-5.5,0.9-5.6,0.9 c-0.3,0.1-0.7,0.1-1-0.1c-0.3-0.2-0.5-0.5-0.5-0.8v-15c0-0.4,0.2-0.7,0.6-0.9c0.1,0,2.3-1.1,6.4-1.1c2.6,0,4.1,1.1,5,2.1 c0.9-1,2.4-2.1,5-2.1c4.2,0,6.4,1.1,6.4,1.1c0.3,0.2,0.6,0.5,0.6,0.9v15c0,0.3-0.2,0.7-0.5,0.8c-0.3,0.2-0.7,0.2-1,0.1 c0,0-1.9-0.9-5.6-0.9c-3.2,0-4,2.3-4.1,2.3C42.8,303.7,42.4,304,42,304z M43,298v-8c0-0.6-0.4-1-1-1s-1,0.4-1,1v8c0,0.6,0.4,1,1,1 S43,298.6,43,298z'/%3E%3Cg id='tutorial'%3E%3Cg%3E%3Cpath fill='%237B7C7D' d='M14,304c-0.4,0-0.8-0.3-0.9-0.7c0-0.1-0.9-2.3-4.1-2.3c-3.6,0-5.5,0.9-5.6,0.9c-0.3,0.1-0.7,0.1-1-0.1 C2.2,301.7,2,301.3,2,301v-15c0-0.4,0.2-0.7,0.6-0.9c0.1,0,2.3-1.1,6.4-1.1c4.6,0,5.9,3.5,5.9,3.7c0,0.1,0.1,0.2,0.1,0.3v15 c0,0.5-0.4,0.9-0.8,1C14.1,304,14.1,304,14,304z M9,299c1.8,0,3.1,0.5,4,1.2v-12c-0.2-0.5-1.2-2.2-4-2.2c-2.5,0-4.2,0.4-5,0.7 v12.9C5.1,299.3,6.8,299,9,299z'/%3E%3C/g%3E%3Cg%3E%3Cpath fill='%237B7C7D' d='M14,304c-0.1,0-0.1,0-0.2,0c-0.5-0.1-0.8-0.5-0.8-1v-15c0-0.1,0-0.2,0.1-0.3c0.1-0.2,1.3-3.7,5.9-3.7 c4.2,0,6.4,1.1,6.4,1.1c0.3,0.2,0.6,0.5,0.6,0.9v15c0,0.3-0.2,0.7-0.5,0.8c-0.3,0.2-0.7,0.2-1,0.1c0,0-1.9-0.9-5.6-0.9 c-3.2,0-4,2.3-4.1,2.3C14.8,303.7,14.4,304,14,304z M15,288.2v12c0.9-0.7,2.2-1.2,4-1.2c2.2,0,3.9,0.3,5,0.6v-12.9 c-0.8-0.3-2.5-0.7-5-0.7C16.2,286,15.2,287.7,15,288.2z'/%3E%3C/g%3E%3C/g%3E%3Cg id='model-on'%3E%3Cpath fill='%237B7C7D' d='M53,239h-9c-0.6,0-1,0.4-1,1v9c0,0.6,0.4,1,1,1h9c0.6,0,1-0.4,1-1v-9C54,239.4,53.6,239,53,239z'/%3E%3Cpath fill='%237B7C7D' d='M36,237h12c0,0,0,0,0,0c0.6,0,1-0.4,1-1c0-0.3-0.1-0.5-0.3-0.7l-5.9-8.9c-0.4-0.6-1.3-0.6-1.7,0l-6,9 c-0.2,0.3-0.2,0.7,0,1S35.6,237,36,237z'/%3E%3Cpath fill='%237B7C7D' d='M35.5,239c-3,0-5.5,2.5-5.5,5.5s2.5,5.5,5.5,5.5s5.5-2.5,5.5-5.5S38.5,239,35.5,239z'/%3E%3C/g%3E%3Cg id='model'%3E%3Cg%3E%3Cpath fill='%237B7C7D' d='M25,250h-9c-0.6,0-1-0.4-1-1v-9c0-0.6,0.4-1,1-1h9c0.6,0,1,0.4,1,1v9C26,249.6,25.6,250,25,250z M17,248 h7v-7h-7V248z'/%3E%3C/g%3E%3Cg%3E%3Cpath fill='%237B7C7D' d='M20,237C20,237,20,237,20,237H8c-0.4,0-0.7-0.2-0.9-0.5s-0.2-0.7,0-1l6-9c0.4-0.6,1.3-0.6,1.7,0l5.9,8.9 c0.2,0.2,0.3,0.4,0.3,0.7C21,236.6,20.6,237,20,237z M9.9,235h8.3l-4.1-6.2L9.9,235z'/%3E%3C/g%3E%3Cg%3E%3Cpath fill='%237B7C7D' d='M7.5,250c-3,0-5.5-2.5-5.5-5.5s2.5-5.5,5.5-5.5s5.5,2.5,5.5,5.5S10.5,250,7.5,250z M7.5,241 c-1.9,0-3.5,1.6-3.5,3.5s1.6,3.5,3.5,3.5s3.5-1.6,3.5-3.5S9.4,241,7.5,241z'/%3E%3C/g%3E%3C/g%3E%3Cpolygon id='pants-on' fill='%237B7C7D' points='47,199 37,199 35,204 35,221 39,221 42,207 45,221 49,221 49,204 '/%3E%3Cg id='pants'%3E%3Cpath fill='%237B7C7D' d='M21,221h-4c-0.5,0-0.9-0.3-1-0.8l-2-8.8l-2,8.8c-0.1,0.5-0.5,0.8-1,0.8H7c-0.6,0-1-0.4-1-1v-16 c0-0.2,0-0.3,0.1-0.4l2-4c0.2-0.3,0.5-0.6,0.9-0.6h10c0.4,0,0.7,0.2,0.9,0.6l2,4c0.1,0.1,0.1,0.3,0.1,0.4v16 C22,220.6,21.6,221,21,221z M17.8,219H20v-14.8l-1.6-3.2H9.6L8,204.2V219h2.2l2.8-12.2c0.1-0.5,0.5-0.8,1-0.8s0.9,0.3,1,0.8 L17.8,219z'/%3E%3C/g%3E%3Cg id='decal-on'%3E%3Cpath fill='%237B7C7D' d='M53,256c0-0.6-0.4-1-1-1H32c-0.6,0-1,0.4-1,1v20c0,0.6,0.4,1,1,1h20c0.6,0,1-0.4,1-1V256z M46.4,271.8 L42,269l-4.4,2.8l1.7-4.6l-3.3-2.8l4.3,0l1.7-4.6l1.7,4.6l4.3,0l-3.3,2.8L46.4,271.8z'/%3E%3C/g%3E%3Cg id='decal'%3E%3Cg%3E%3Cg%3E%3Cpath fill='%237B7C7D' d='M24,277h-3c-0.6,0-1-0.4-1-1s0.4-1,1-1h2v-2c0-0.6,0.4-1,1-1s1,0.4,1,1v3C25,276.6,24.6,277,24,277z'/%3E%3C/g%3E%3Cg%3E%3Cpath fill='%237B7C7D' d='M16.3,277h-4.7c-0.6,0-1-0.4-1-1s0.4-1,1-1h4.7c0.6,0,1,0.4,1,1S16.9,277,16.3,277z'/%3E%3C/g%3E%3Cg%3E%3Cpath fill='%237B7C7D' d='M7,277H4c-0.6,0-1-0.4-1-1v-3c0-0.6,0.4-1,1-1s1,0.4,1,1v2h2c0.6,0,1,0.4,1,1S7.6,277,7,277z'/%3E%3C/g%3E%3Cg%3E%3Cpath fill='%237B7C7D' d='M4,269.3c-0.6,0-1-0.4-1-1v-4.7c0-0.6,0.4-1,1-1s1,0.4,1,1v4.7C5,268.9,4.6,269.3,4,269.3z'/%3E%3C/g%3E%3Cg%3E%3Cpath fill='%237B7C7D' d='M4,260c-0.6,0-1-0.4-1-1v-3c0-0.6,0.4-1,1-1h3c0.6,0,1,0.4,1,1s-0.4,1-1,1H5v2C5,259.6,4.6,260,4,260z'/%3E%3C/g%3E%3Cg%3E%3Cpath fill='%237B7C7D' d='M16.3,257h-4.7c-0.6,0-1-0.4-1-1s0.4-1,1-1h4.7c0.6,0,1,0.4,1,1S16.9,257,16.3,257z'/%3E%3C/g%3E%3Cg%3E%3Cpath fill='%237B7C7D' d='M24,260c-0.6,0-1-0.4-1-1v-2h-2c-0.6,0-1-0.4-1-1s0.4-1,1-1h3c0.6,0,1,0.4,1,1v3 C25,259.6,24.6,260,24,260z'/%3E%3C/g%3E%3Cg%3E%3Cpath fill='%237B7C7D' d='M24,269.3c-0.6,0-1-0.4-1-1v-4.7c0-0.6,0.4-1,1-1s1,0.4,1,1v4.7C25,268.9,24.6,269.3,24,269.3z'/%3E%3C/g%3E%3C/g%3E%3Cg%3E%3Cpolygon fill='%237B7C7D' points='14,259.8 15.7,264.3 20,264.4 16.7,267.2 18.4,271.8 14,269 9.6,271.8 11.3,267.2 8,264.4 12.3,264.3 '/%3E%3C/g%3E%3C/g%3E%3Cg id='tshirt-on'%3E%3Cpath fill='%237B7C7D' d='M51,173l-5-2c0,0-1.4,2-4,2s-4-2-4-2l-5,2l-3,6l4,3v11h16v-11l4-3L51,173z M39,189h-2c-0.6,0-1-0.4-1-1v-2 c0-0.6,0.4-1,1-1s1,0.4,1,1v1h1c0.6,0,1,0.4,1,1S39.6,189,39,189z M36,183c0-0.3,0.1-0.5,0.3-0.7c0.4-0.4,1-0.4,1.4,0 c0.2,0.2,0.3,0.5,0.3,0.7s-0.1,0.5-0.3,0.7c-0.2,0.2-0.5,0.3-0.7,0.3s-0.5-0.1-0.7-0.3C36.1,183.5,36,183.3,36,183z M39,179h-1v1 c0,0.6-0.4,1-1,1s-1-0.4-1-1v-2c0-0.6,0.4-1,1-1h2c0.6,0,1,0.4,1,1S39.6,179,39,179z M42.7,188.7c-0.2,0.2-0.5,0.3-0.7,0.3 s-0.5-0.1-0.7-0.3c-0.2-0.2-0.3-0.4-0.3-0.7c0-0.3,0.1-0.5,0.3-0.7c0.4-0.4,1-0.4,1.4,0c0.2,0.2,0.3,0.4,0.3,0.7 C43,188.3,42.9,188.5,42.7,188.7z M42.7,178.7c-0.2,0.2-0.5,0.3-0.7,0.3s-0.5-0.1-0.7-0.3c-0.2-0.2-0.3-0.5-0.3-0.7 c0-0.3,0.1-0.5,0.3-0.7c0.4-0.4,1-0.4,1.4,0c0.2,0.2,0.3,0.4,0.3,0.7C43,178.3,42.9,178.5,42.7,178.7z M48,188c0,0.6-0.4,1-1,1h-2 c-0.6,0-1-0.4-1-1s0.4-1,1-1h1v-1c0-0.6,0.4-1,1-1s1,0.4,1,1V188z M47.7,183.7c-0.2,0.2-0.5,0.3-0.7,0.3s-0.5-0.1-0.7-0.3 c-0.2-0.2-0.3-0.5-0.3-0.7c0-0.3,0.1-0.5,0.3-0.7c0.4-0.4,1-0.4,1.4,0c0.2,0.2,0.3,0.5,0.3,0.7S47.9,183.5,47.7,183.7z M48,180 c0,0.6-0.4,1-1,1s-1-0.4-1-1v-1h-1c-0.6,0-1-0.4-1-1s0.4-1,1-1h2c0.6,0,1,0.4,1,1V180z'/%3E%3C/g%3E%3Cg id='tshirt'%3E%3Cg%3E%3Cpath fill='%237B7C7D' d='M22,193H6c-0.6,0-1-0.4-1-1v-10.5l-2.6-1.7c-0.4-0.3-0.6-0.8-0.3-1.3l3-6c0.1-0.3,0.4-0.5,0.7-0.5l4-1 c0.4-0.1,0.8,0.1,1.1,0.4c0,0.1,1.1,1.6,3.2,1.6s3.1-1.5,3.2-1.6c0.2-0.3,0.7-0.5,1.1-0.4l4,1c0.3,0.1,0.5,0.3,0.7,0.5l3,6 c0.2,0.5,0.1,1-0.3,1.3l-2.6,1.7V192C23,192.6,22.6,193,22,193z M7,191h14v-10c0-0.3,0.2-0.6,0.4-0.8l2.3-1.5l-2.4-4.8l-3-0.7 c-0.7,0.7-2.2,1.9-4.4,1.9s-3.7-1.2-4.4-1.9l-3,0.7l-2.4,4.8l2.3,1.5c0.3,0.2,0.4,0.5,0.4,0.8V191z'/%3E%3C/g%3E%3Cg%3E%3Cpath fill='%237B7C7D' d='M9,181c-0.6,0-1-0.4-1-1v-2c0-0.6,0.4-1,1-1h2c0.6,0,1,0.4,1,1s-0.4,1-1,1h-1v1C10,180.6,9.6,181,9,181z'/%3E%3C/g%3E%3Cg%3E%3Cpath fill='%237B7C7D' d='M19,181c-0.6,0-1-0.4-1-1v-1h-1c-0.6,0-1-0.4-1-1s0.4-1,1-1h2c0.6,0,1,0.4,1,1v2 C20,180.6,19.6,181,19,181z'/%3E%3C/g%3E%3Cg%3E%3Cpath fill='%237B7C7D' d='M11,189H9c-0.6,0-1-0.4-1-1v-2c0-0.6,0.4-1,1-1s1,0.4,1,1v1h1c0.6,0,1,0.4,1,1S11.6,189,11,189z'/%3E%3C/g%3E%3Cg%3E%3Cpath fill='%237B7C7D' d='M19,189h-2c-0.6,0-1-0.4-1-1s0.4-1,1-1h1v-1c0-0.6,0.4-1,1-1s1,0.4,1,1v2C20,188.6,19.6,189,19,189z'/%3E%3C/g%3E%3Cg%3E%3Cpath fill='%237B7C7D' d='M14,189c-0.3,0-0.5-0.1-0.7-0.3c-0.2-0.2-0.3-0.5-0.3-0.7s0.1-0.5,0.3-0.7c0.4-0.4,1-0.4,1.4,0 c0.2,0.2,0.3,0.5,0.3,0.7s-0.1,0.5-0.3,0.7C14.5,188.9,14.3,189,14,189z'/%3E%3C/g%3E%3Cg%3E%3Cpath fill='%237B7C7D' d='M14,179c-0.3,0-0.5-0.1-0.7-0.3c-0.2-0.2-0.3-0.5-0.3-0.7s0.1-0.5,0.3-0.7c0.4-0.4,1-0.4,1.4,0 c0.2,0.2,0.3,0.4,0.3,0.7c0,0.3-0.1,0.5-0.3,0.7C14.5,178.9,14.3,179,14,179z'/%3E%3C/g%3E%3Cg%3E%3Cpath fill='%237B7C7D' d='M9,184c-0.3,0-0.5-0.1-0.7-0.3C8.1,183.5,8,183.3,8,183s0.1-0.5,0.3-0.7c0.4-0.4,1.1-0.4,1.4,0 c0.2,0.2,0.3,0.4,0.3,0.7c0,0.3-0.1,0.5-0.3,0.7C9.5,183.9,9.3,184,9,184z'/%3E%3C/g%3E%3Cg%3E%3Cpath fill='%237B7C7D' d='M19,184c-0.3,0-0.5-0.1-0.7-0.3c-0.2-0.2-0.3-0.5-0.3-0.7s0.1-0.5,0.3-0.7c0.4-0.4,1-0.4,1.4,0 c0.2,0.2,0.3,0.5,0.3,0.7s-0.1,0.5-0.3,0.7C19.5,183.9,19.3,184,19,184z'/%3E%3C/g%3E%3C/g%3E%3Cg id='shirt-on'%3E%3Cpath fill='%237B7C7D' d='M51.2,146.7l-1.8-0.6c-0.3-0.1-0.5-0.3-0.6-0.6l-0.6-1.8c-0.1-0.4-0.5-0.7-0.9-0.7H42h-5.3 c-0.4,0-0.8,0.3-0.9,0.7l-0.6,1.8c-0.1,0.3-0.3,0.5-0.6,0.6l-1.8,0.6c-0.4,0.1-0.7,0.6-0.7,1.1l1.8,15.3c0.1,0.5,0.5,0.9,1,0.9 h14.2c0.5,0,0.9-0.4,1-0.9l1.8-15.3C52,147.3,51.7,146.9,51.2,146.7z M42,162c-0.6,0-1-0.4-1-1s0.4-1,1-1s1,0.4,1,1 S42.6,162,42,162z M42,158c-0.6,0-1-0.4-1-1s0.4-1,1-1s1,0.4,1,1S42.6,158,42,158z M42,154c-0.6,0-1-0.4-1-1s0.4-1,1-1s1,0.4,1,1 S42.6,154,42,154z M48.3,147.4l-3,2c-0.1,0.1-0.2,0.1-0.3,0.1s-0.2,0-0.3-0.1l-2.7-1.8l-2.7,1.8c-0.2,0.1-0.4,0.1-0.6,0l-3-2 c-0.2-0.2-0.3-0.5-0.1-0.7c0.2-0.2,0.5-0.3,0.7-0.1l2.7,1.8l2.7-1.8c0.2-0.1,0.4-0.1,0.6,0l2.7,1.8l2.7-1.8 c0.2-0.2,0.5-0.1,0.7,0.1C48.6,147,48.5,147.3,48.3,147.4z'/%3E%3C/g%3E%3Cg id='shirt'%3E%3Cg%3E%3Cpath fill='%237B7C7D' d='M22,165H6c-0.5,0-0.9-0.4-1-0.9l-2-16c-0.1-0.5,0.2-0.9,0.7-1.1l2.5-0.8l0.8-2.5c0.1-0.3,0.4-0.6,0.7-0.6 c0.3-0.1,0.7,0,0.9,0.2l5.4,4.5l5.4-4.5c0.3-0.2,0.6-0.3,0.9-0.2c0.3,0.1,0.6,0.3,0.7,0.6l0.8,2.5l2.5,0.8 c0.5,0.2,0.7,0.6,0.7,1.1l-2,16C22.9,164.6,22.5,165,22,165z M6.9,163h14.2l1.8-14.3l-2.2-0.7c-0.3-0.1-0.5-0.3-0.6-0.6l-0.5-1.6 l-4.9,4.1c-0.4,0.3-0.9,0.3-1.3,0l-4.9-4.1l-0.5,1.6c-0.1,0.3-0.3,0.5-0.6,0.6l-2.2,0.7L6.9,163z'/%3E%3C/g%3E%3Cg%3E%3Cpath fill='%237B7C7D' d='M14,154c-0.6,0-1,0.4-1,1s0.4,1,1,1s1-0.4,1-1S14.6,154,14,154L14,154z'/%3E%3C/g%3E%3Cg%3E%3Cpath fill='%237B7C7D' d='M14,158c-0.6,0-1,0.4-1,1s0.4,1,1,1s1-0.4,1-1S14.6,158,14,158L14,158z'/%3E%3C/g%3E%3Cg%3E%3Cpath fill='%237B7C7D' d='M14,162c-0.6,0-1,0.4-1,1s0.4,1,1,1s1-0.4,1-1S14.6,162,14,162L14,162z'/%3E%3C/g%3E%3Cg%3E%3Cpath fill='%237B7C7D' d='M17,153c-0.3,0-0.5-0.1-0.7-0.3l-2.3-2.3l-2.3,2.3c-0.2,0.2-0.5,0.3-0.8,0.3c-0.3,0-0.5-0.2-0.7-0.4l-4-5 c-0.3-0.4-0.3-1.1,0.2-1.4c0.4-0.3,1.1-0.3,1.4,0.2l3.3,4.1l2.2-2.2c0.4-0.4,1-0.4,1.4,0l2.2,2.2l3.3-4.1c0.3-0.4,1-0.5,1.4-0.2 c0.4,0.3,0.5,1,0.2,1.4l-4,5C17.6,152.8,17.3,153,17,153C17,153,17,153,17,153z'/%3E%3C/g%3E%3Cg%3E%3Cpath fill='%237B7C7D' d='M20,145H8c-0.6,0-1-0.4-1-1s0.4-1,1-1h12c0.6,0,1,0.4,1,1S20.6,145,20,145z'/%3E%3C/g%3E%3C/g%3E%3Cg id='personalserver-on'%3E%3Cpath fill='%237B7C7D' d='M49,115H35c-0.6,0-1,0.4-1,1v20c0,0.6,0.4,1,1,1h14c0.6,0,1-0.4,1-1v-20C50,115.4,49.6,115,49,115z M38.5,118c0.8,0,1.5,0.7,1.5,1.5s-0.7,1.5-1.5,1.5s-1.5-0.7-1.5-1.5S37.7,118,38.5,118z M47,133H37c-0.6,0-1-0.4-1-1s0.4-1,1-1 h10c0.6,0,1,0.4,1,1S47.6,133,47,133z M47,129H37c-0.6,0-1-0.4-1-1s0.4-1,1-1h10c0.6,0,1,0.4,1,1S47.6,129,47,129z'/%3E%3C/g%3E%3Cg id='personalserver'%3E%3Cg%3E%3Cpath fill='%237B7C7D' d='M21,137H7c-0.6,0-1-0.4-1-1v-20c0-0.6,0.4-1,1-1h14c0.6,0,1,0.4,1,1v20C22,136.6,21.6,137,21,137z M8,135 h12v-18H8V135z'/%3E%3C/g%3E%3Cg%3E%3Cpath fill='%237B7C7D' d='M10.5,118c-0.8,0-1.5,0.7-1.5,1.5s0.7,1.5,1.5,1.5s1.5-0.7,1.5-1.5S11.3,118,10.5,118L10.5,118z'/%3E%3C/g%3E%3Cg%3E%3Cpath fill='%237B7C7D' d='M21,129H7c-0.6,0-1-0.4-1-1s0.4-1,1-1h14c0.6,0,1,0.4,1,1S21.6,129,21,129z'/%3E%3C/g%3E%3Cg%3E%3Cpath fill='%237B7C7D' d='M21,133H7c-0.6,0-1-0.4-1-1s0.4-1,1-1h14c0.6,0,1,0.4,1,1S21.6,133,21,133z'/%3E%3C/g%3E%3C/g%3E%3Cg id='place'%3E%3Cpath fill='%237B7C7D' d='M52,106h-2v-2h1.7c0.9,0,1.5-1,1-1.8L50.8,99h0.8c0.9,0,1.5-1,1-1.7L50,92.6c-0.4-0.8-1.6-0.8-2,0 l-2.7,4.7c-0.4,0.8,0.1,1.7,1,1.7h0.8l-1.9,3.2c-0.4,0.8,0.1,1.8,1,1.8H48v2h-4V89c0-0.6-0.4-1-1-1H33c-0.6,0-1,0.4-1,1v17 c-0.6,0-1,0.4-1,1s0.4,1,1,1h20c0.6,0,1-0.4,1-1S52.6,106,52,106z M40,99h-4c-0.6,0-1-0.4-1-1s0.4-1,1-1h4c0.6,0,1,0.4,1,1 S40.6,99,40,99z M40,96h-4c-0.6,0-1-0.4-1-1s0.4-1,1-1h4c0.6,0,1,0.4,1,1S40.6,96,40,96z M40,93h-4c-0.6,0-1-0.4-1-1s0.4-1,1-1h4 c0.6,0,1,0.4,1,1S40.6,93,40,93z'/%3E%3C/g%3E%3Cg id='place_1_'%3E%3Cg%3E%3Cpath fill='%237B7C7D' d='M24,99C24,99,24,99,24,99h-6c-0.4,0-0.7-0.2-0.9-0.5s-0.2-0.7,0-1l3-5c0.4-0.6,1.4-0.6,1.7,0l2.9,4.9 c0.2,0.2,0.3,0.4,0.3,0.7C25,98.6,24.6,99,24,99z M19.8,97h2.5L21,94.9L19.8,97z'/%3E%3C/g%3E%3Cg%3E%3Cpath fill='%237B7C7D' d='M24,104C24,104,24,104,24,104h-6c-0.4,0-0.7-0.2-0.9-0.5s-0.2-0.7,0-1l3-5c0.4-0.6,1.4-0.6,1.7,0l2.9,4.9 c0.2,0.2,0.3,0.4,0.3,0.7C25,103.6,24.6,104,24,104z M19.8,102h2.5L21,99.9L19.8,102z'/%3E%3C/g%3E%3Cg%3E%3Cpath fill='%237B7C7D' d='M21,107c-0.6,0-1-0.4-1-1v-3c0-0.6,0.4-1,1-1s1,0.4,1,1v3C22,106.6,21.6,107,21,107z'/%3E%3C/g%3E%3Cg%3E%3Cpath fill='%237B7C7D' d='M24,108H4c-0.6,0-1-0.4-1-1s0.4-1,1-1h20c0.6,0,1,0.4,1,1S24.6,108,24,108z'/%3E%3C/g%3E%3Cg%3E%3Cpath fill='%237B7C7D' d='M15,108H5c-0.6,0-1-0.4-1-1V89c0-0.6,0.4-1,1-1h10c0.6,0,1,0.4,1,1v18C16,107.6,15.6,108,15,108z M6,106 h8V90H6V106z'/%3E%3C/g%3E%3Cg%3E%3Cpath fill='%237B7C7D' d='M12,93H8c-0.6,0-1-0.4-1-1s0.4-1,1-1h4c0.6,0,1,0.4,1,1S12.6,93,12,93z'/%3E%3C/g%3E%3Cg%3E%3Cpath fill='%237B7C7D' d='M12,96H8c-0.6,0-1-0.4-1-1s0.4-1,1-1h4c0.6,0,1,0.4,1,1S12.6,96,12,96z'/%3E%3C/g%3E%3Cg%3E%3Cpath fill='%237B7C7D' d='M12,99H8c-0.6,0-1-0.4-1-1s0.4-1,1-1h4c0.6,0,1,0.4,1,1S12.6,99,12,99z'/%3E%3C/g%3E%3C/g%3E%3Cg%3E%3Ccircle fill='%237B7C7D' cx='39' cy='62' r='4'/%3E%3Cpath fill='%237B7C7D' d='M43,67H31c-0.5,0-1,0.5-1,1v1c0,0.5,0.4,1.1,1,1.2l3,0.6c0.5,0.1,0.9,0.6,0.8,1.2l-1.6,9 c-0.1,0.5,0.3,1,0.8,1h1c0.5,0,1.2-0.4,1.5-0.9l7.1-13.2C43.8,67.4,43.5,67,43,67z'/%3E%3Cpath fill='%237B7C7D' d='M53.8,61.4C53.6,61.2,53.3,61,53,61h-2c-0.4,0-0.7,0.2-0.9,0.5l-6,10C44,71.7,44,72,44,72.3 c0.1,0.3,0.3,0.5,0.5,0.6l4,2C48.7,75,48.8,75,49,75c0.1,0,0.3,0,0.4-0.1c0.3-0.1,0.5-0.3,0.6-0.6l4-12C54.1,62,54,61.7,53.8,61.4 z'/%3E%3Cpath fill='%237B7C7D' d='M45,75c-2.7,0-3.2,1.5-3.7,2.9c-0.3,0.7-0.6,1.6-1.2,2.6c-0.2,0.3-0.2,0.7,0,1c0.2,0.3,0.5,0.5,0.9,0.5 c1.7,0,7,0,7-4C48,76.4,46.6,75,45,75z'/%3E%3C/g%3E%3Cg%3E%3Cpath fill='%237B7C7D' d='M11,66c2.2,0,4-1.8,4-4s-1.8-4-4-4s-4,1.8-4,4S8.8,66,11,66z M11,60c1.1,0,2,0.9,2,2s-0.9,2-2,2 s-2-0.9-2-2S9.9,60,11,60z'/%3E%3Cpath fill='%237B7C7D' d='M11.4,74.1c-0.5-0.2-1.1,0-1.3,0.4L7.4,80H6.2L8,72.2c0.1-0.5-0.2-1.1-0.7-1.2L4,70.2V69h10 c0.6,0,1-0.4,1-1s-0.4-1-1-1H3c-0.6,0-1,0.4-1,1v3c0,0.5,0.3,0.9,0.8,1l3.1,0.8l-1.8,8c-0.1,0.3,0,0.6,0.2,0.8 C4.4,81.9,4.7,82,5,82h3c0.4,0,0.7-0.2,0.9-0.6l3-6C12.1,75,11.9,74.4,11.4,74.1z'/%3E%3Cpath fill='%237B7C7D' d='M25.8,61.4C25.6,61.2,25.3,61,25,61h-2c-0.3,0-0.6,0.2-0.8,0.4l-7,10C15,71.7,15,72,15,72.3 c0.1,0.3,0.3,0.5,0.6,0.6l5,2c0.1,0,0.2,0.1,0.4,0.1c0.1,0,0.3,0,0.4-0.1c0.2-0.1,0.4-0.3,0.5-0.6l4-12C26.1,62,26,61.7,25.8,61.4 z M20.4,72.7l-2.8-1.1l6-8.5h0.1L20.4,72.7z'/%3E%3Cpath fill='%237B7C7D' d='M16,74c-2.6,0-3.2,1.9-3.6,3.5c-0.3,0.9-0.6,1.9-1.2,3c-0.2,0.3-0.2,0.7,0,1c0.2,0.3,0.5,0.5,0.9,0.5 c7,0,8-2.5,8-4C20,75.4,17.7,74,16,74z M13.7,79.9c0.3-0.7,0.5-1.3,0.6-1.9C14.8,76.3,15,76,16,76c0.5,0,2,0.5,2,2 C18,79,16.3,79.7,13.7,79.9z'/%3E%3C/g%3E%3Cg id='develop-on'%3E%3Cg%3E%3Cpath fill='%237B7C7D' d='M52,38c-0.6,0-1-0.4-1-1v-4h-4c-0.6,0-1-0.4-1-1s0.4-1,1-1h5c0.6,0,1,0.4,1,1v5C53,37.6,52.6,38,52,38z'/%3E%3C/g%3E%3Cg%3E%3Cpath fill='%237B7C7D' d='M37,53h-5c-0.6,0-1-0.4-1-1v-5c0-0.6,0.4-1,1-1s1,0.4,1,1v4h4c0.6,0,1,0.4,1,1S37.6,53,37,53z'/%3E%3C/g%3E%3Cg%3E%3Cpath fill='%237B7C7D' d='M34,31h4.6c0.3,0,0.5,0.1,0.7,0.3l2.4,2.4c0.2,0.2,0.3,0.4,0.3,0.7v4.2c0,0.3,0.1,0.5,0.3,0.7l2.4,2.4 c0.2,0.2,0.4,0.3,0.7,0.3h4.2c0.3,0,0.5,0.1,0.7,0.3l2.4,2.4c0.2,0.2,0.3,0.4,0.3,0.7V50l-3.7-3.7c-0.2-0.2-0.4-0.3-0.7-0.3H47 c-0.6,0-1,0.4-1,1v1.6c0,0.3,0.1,0.5,0.3,0.7L50,53h-4.6c-0.3,0-0.5-0.1-0.7-0.3l-2.4-2.4c-0.2-0.2-0.3-0.4-0.3-0.7v-4.2 c0-0.3-0.1-0.5-0.3-0.7l-2.4-2.4c-0.2-0.2-0.4-0.3-0.7-0.3h-4.2c-0.3,0-0.5-0.1-0.7-0.3l-2.4-2.4c-0.2-0.2-0.3-0.4-0.3-0.7V34 l3.7,3.7c0.2,0.2,0.4,0.3,0.7,0.3H37c0.6,0,1-0.4,1-1v-1.6c0-0.3-0.1-0.5-0.3-0.7L34,31z'/%3E%3C/g%3E%3C/g%3E%3Cg id='develop'%3E%3Cg%3E%3Cpath fill='%237B7C7D' d='M24,38c-0.6,0-1-0.4-1-1v-4h-4c-0.6,0-1-0.4-1-1s0.4-1,1-1h5c0.6,0,1,0.4,1,1v5C25,37.6,24.6,38,24,38z'/%3E%3C/g%3E%3Cg%3E%3Cpath fill='%237B7C7D' d='M9,53H4c-0.6,0-1-0.4-1-1v-5c0-0.6,0.4-1,1-1s1,0.4,1,1v4h4c0.6,0,1,0.4,1,1S9.6,53,9,53z'/%3E%3C/g%3E%3Cg%3E%3Cpath fill='%237B7C7D' d='M21,53C21,53,21,53,21,53h-5c-0.3,0-0.5-0.1-0.7-0.3l-2-2C13.1,50.5,13,50.3,13,50v-4.6L10.6,43H6 c-0.3,0-0.5-0.1-0.7-0.3l-2-2C3.1,40.5,3,40.3,3,40v-5c0-0.4,0.2-0.8,0.6-0.9s0.8-0.1,1.1,0.2L7.4,37H9v-1.6l-2.7-2.7 C6,32.4,5.9,32,6.1,31.6C6.2,31.2,6.6,31,7,31h5c0.3,0,0.5,0.1,0.7,0.3l2,2c0.2,0.2,0.3,0.4,0.3,0.7v4.6l2.4,2.4H22 c0.3,0,0.5,0.1,0.7,0.3l2,2c0.2,0.2,0.3,0.4,0.3,0.7v5c0,0.4-0.2,0.8-0.6,0.9c-0.4,0.2-0.8,0.1-1.1-0.2L20.6,47H19v1.6l2.6,2.6 c0.3,0.2,0.4,0.5,0.4,0.8C22,52.6,21.6,53,21,53z M16.4,51h2.2l-1.3-1.3C17.1,49.5,17,49.3,17,49v-3c0-0.6,0.4-1,1-1h3 c0.3,0,0.5,0.1,0.7,0.3l1.3,1.3v-2.2L21.6,43H17c-0.3,0-0.5-0.1-0.7-0.3l-3-3C13.1,39.5,13,39.3,13,39v-4.6L11.6,33H9.4l1.3,1.3 c0.2,0.2,0.3,0.4,0.3,0.7v3c0,0.6-0.4,1-1,1H7c-0.3,0-0.5-0.1-0.7-0.3L5,37.4v2.2L6.4,41H11c0.3,0,0.5,0.1,0.7,0.3l3,3 c0.2,0.2,0.3,0.4,0.3,0.7v4.6L16.4,51z'/%3E%3C/g%3E%3C/g%3E%3Cg id='profile-on'%3E%3Ccircle fill='%237B7C7D' cx='42' cy='8' r='6'/%3E%3Cpath fill='%237B7C7D' d='M42,16c0,0,6,0,7,1c0.8,0.8,1.6,4.6,1.9,6.2c0.1,0.5-0.2,0.9-0.6,1.1C48.9,24.9,45.7,26,42,26 s-6.9-1.1-8.3-1.7c-0.4-0.2-0.7-0.6-0.6-1.1c0.3-1.7,1.1-5.4,1.9-6.2C36,16,42,16,42,16z'/%3E%3C/g%3E%3Cg id='profile'%3E%3Cg%3E%3Cpath fill='%237B7C7D' d='M14,14c-3.3,0-6-2.7-6-6s2.7-6,6-6s6,2.7,6,6S17.3,14,14,14z M14,4c-2.2,0-4,1.8-4,4s1.8,4,4,4s4-1.8,4-4 S16.2,4,14,4z'/%3E%3C/g%3E%3Cg%3E%3Cpath fill='%237B7C7D' d='M14,26c-5.2,0-8.4-2.1-8.5-2.2c-0.3-0.2-0.5-0.6-0.4-1c0.2-1.2,1.1-5.4,2.3-6.5C8.5,15.1,12.4,15,14,15 c1.6,0,5.5,0.1,6.7,1.3c1.1,1.1,2,5.3,2.3,6.5c0.1,0.4-0.1,0.8-0.4,1C22.4,23.9,19.2,26,14,26z M7.1,22.5C8.2,23,10.6,24,14,24 c3.4,0,5.8-1,6.9-1.5c-0.5-2.1-1.2-4.3-1.6-4.8C18.9,17.3,16.4,17,14,17c-2.4,0-4.9,0.3-5.3,0.7C8.3,18.1,7.6,20.4,7.1,22.5z'/%3E%3C/g%3E%3C/g%3E%3C/g%3E%3Cg id='games'%3E%3C/g%3E%3Cg id='Social_and_Interaction'%3E%3C/g%3E%3Cg id='Navigation'%3E%3C/g%3E%3Cg id='Friends_Status'%3E%3C/g%3E%3C/svg%3E");
}
.dark-theme .icon-default-creation, .dark-theme .icon-profile, .dark-theme .icon-develop, .dark-theme .icon-charactercustomizer, .dark-theme .icon-place, .dark-theme .icon-shirt, .dark-theme .icon-tshirt, .dark-theme .icon-decal, .dark-theme .icon-pants, .dark-theme .icon-models, .dark-theme .icon-tutorial, .dark-theme .feeds .icon-develop, .dark-theme .feeds .icon-charactercustomizer {
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' version='1.1' x='0px' y='0px' width='56px' height='308px' viewBox='0 0 56 308' enable-background='new 0 0 56 308' xml:space='preserve'%3E%3Cg id='label'%3E%3C/g%3E%3Cg id='BC'%3E%3C/g%3E%3Cg id='brand'%3E%3C/g%3E%3Cg id='generic'%3E%3C/g%3E%3Cg id='negative'%3E%3C/g%3E%3Cg id='creation'%3E%3Cpath id='tutorial-on' fill='%23BDBEBE' d='M42,304c-0.4,0-0.8-0.3-0.9-0.7c0-0.1-0.9-2.3-4.1-2.3c-3.6,0-5.5,0.9-5.6,0.9 c-0.3,0.1-0.7,0.1-1-0.1c-0.3-0.2-0.5-0.5-0.5-0.8v-15c0-0.4,0.2-0.7,0.6-0.9c0.1,0,2.3-1.1,6.4-1.1c2.6,0,4.1,1.1,5,2.1 c0.9-1,2.4-2.1,5-2.1c4.2,0,6.4,1.1,6.4,1.1c0.3,0.2,0.6,0.5,0.6,0.9v15c0,0.3-0.2,0.7-0.5,0.8c-0.3,0.2-0.7,0.2-1,0.1 c0,0-1.9-0.9-5.6-0.9c-3.2,0-4,2.3-4.1,2.3C42.8,303.7,42.4,304,42,304z M43,298v-8c0-0.6-0.4-1-1-1s-1,0.4-1,1v8c0,0.6,0.4,1,1,1 S43,298.6,43,298z'/%3E%3Cg id='tutorial'%3E%3Cg%3E%3Cpath fill='%23BDBEBE' d='M14,304c-0.4,0-0.8-0.3-0.9-0.7c0-0.1-0.9-2.3-4.1-2.3c-3.6,0-5.5,0.9-5.6,0.9c-0.3,0.1-0.7,0.1-1-0.1 C2.2,301.7,2,301.3,2,301v-15c0-0.4,0.2-0.7,0.6-0.9c0.1,0,2.3-1.1,6.4-1.1c4.6,0,5.9,3.5,5.9,3.7c0,0.1,0.1,0.2,0.1,0.3v15 c0,0.5-0.4,0.9-0.8,1C14.1,304,14.1,304,14,304z M9,299c1.8,0,3.1,0.5,4,1.2v-12c-0.2-0.5-1.2-2.2-4-2.2c-2.5,0-4.2,0.4-5,0.7 v12.9C5.1,299.3,6.8,299,9,299z'/%3E%3C/g%3E%3Cg%3E%3Cpath fill='%23BDBEBE' d='M14,304c-0.1,0-0.1,0-0.2,0c-0.5-0.1-0.8-0.5-0.8-1v-15c0-0.1,0-0.2,0.1-0.3c0.1-0.2,1.3-3.7,5.9-3.7 c4.2,0,6.4,1.1,6.4,1.1c0.3,0.2,0.6,0.5,0.6,0.9v15c0,0.3-0.2,0.7-0.5,0.8c-0.3,0.2-0.7,0.2-1,0.1c0,0-1.9-0.9-5.6-0.9 c-3.2,0-4,2.3-4.1,2.3C14.8,303.7,14.4,304,14,304z M15,288.2v12c0.9-0.7,2.2-1.2,4-1.2c2.2,0,3.9,0.3,5,0.6v-12.9 c-0.8-0.3-2.5-0.7-5-0.7C16.2,286,15.2,287.7,15,288.2z'/%3E%3C/g%3E%3C/g%3E%3Cg id='model-on'%3E%3Cpath fill='%23BDBEBE' d='M53,239h-9c-0.6,0-1,0.4-1,1v9c0,0.6,0.4,1,1,1h9c0.6,0,1-0.4,1-1v-9C54,239.4,53.6,239,53,239z'/%3E%3Cpath fill='%23BDBEBE' d='M36,237h12c0,0,0,0,0,0c0.6,0,1-0.4,1-1c0-0.3-0.1-0.5-0.3-0.7l-5.9-8.9c-0.4-0.6-1.3-0.6-1.7,0l-6,9 c-0.2,0.3-0.2,0.7,0,1S35.6,237,36,237z'/%3E%3Cpath fill='%23BDBEBE' d='M35.5,239c-3,0-5.5,2.5-5.5,5.5s2.5,5.5,5.5,5.5s5.5-2.5,5.5-5.5S38.5,239,35.5,239z'/%3E%3C/g%3E%3Cg id='model'%3E%3Cg%3E%3Cpath fill='%23BDBEBE' d='M25,250h-9c-0.6,0-1-0.4-1-1v-9c0-0.6,0.4-1,1-1h9c0.6,0,1,0.4,1,1v9C26,249.6,25.6,250,25,250z M17,248 h7v-7h-7V248z'/%3E%3C/g%3E%3Cg%3E%3Cpath fill='%23BDBEBE' d='M20,237C20,237,20,237,20,237H8c-0.4,0-0.7-0.2-0.9-0.5s-0.2-0.7,0-1l6-9c0.4-0.6,1.3-0.6,1.7,0l5.9,8.9 c0.2,0.2,0.3,0.4,0.3,0.7C21,236.6,20.6,237,20,237z M9.9,235h8.3l-4.1-6.2L9.9,235z'/%3E%3C/g%3E%3Cg%3E%3Cpath fill='%23BDBEBE' d='M7.5,250c-3,0-5.5-2.5-5.5-5.5s2.5-5.5,5.5-5.5s5.5,2.5,5.5,5.5S10.5,250,7.5,250z M7.5,241 c-1.9,0-3.5,1.6-3.5,3.5s1.6,3.5,3.5,3.5s3.5-1.6,3.5-3.5S9.4,241,7.5,241z'/%3E%3C/g%3E%3C/g%3E%3Cpolygon id='pants-on' fill='%23BDBEBE' points='47,199 37,199 35,204 35,221 39,221 42,207 45,221 49,221 49,204 '/%3E%3Cg id='pants'%3E%3Cpath fill='%23BDBEBE' d='M21,221h-4c-0.5,0-0.9-0.3-1-0.8l-2-8.8l-2,8.8c-0.1,0.5-0.5,0.8-1,0.8H7c-0.6,0-1-0.4-1-1v-16 c0-0.2,0-0.3,0.1-0.4l2-4c0.2-0.3,0.5-0.6,0.9-0.6h10c0.4,0,0.7,0.2,0.9,0.6l2,4c0.1,0.1,0.1,0.3,0.1,0.4v16 C22,220.6,21.6,221,21,221z M17.8,219H20v-14.8l-1.6-3.2H9.6L8,204.2V219h2.2l2.8-12.2c0.1-0.5,0.5-0.8,1-0.8s0.9,0.3,1,0.8 L17.8,219z'/%3E%3C/g%3E%3Cg id='decal-on'%3E%3Cpath fill='%23BDBEBE' d='M53,256c0-0.6-0.4-1-1-1H32c-0.6,0-1,0.4-1,1v20c0,0.6,0.4,1,1,1h20c0.6,0,1-0.4,1-1V256z M46.4,271.8 L42,269l-4.4,2.8l1.7-4.6l-3.3-2.8l4.3,0l1.7-4.6l1.7,4.6l4.3,0l-3.3,2.8L46.4,271.8z'/%3E%3C/g%3E%3Cg id='decal'%3E%3Cg%3E%3Cg%3E%3Cpath fill='%23BDBEBE' d='M24,277h-3c-0.6,0-1-0.4-1-1s0.4-1,1-1h2v-2c0-0.6,0.4-1,1-1s1,0.4,1,1v3C25,276.6,24.6,277,24,277z'/%3E%3C/g%3E%3Cg%3E%3Cpath fill='%23BDBEBE' d='M16.3,277h-4.7c-0.6,0-1-0.4-1-1s0.4-1,1-1h4.7c0.6,0,1,0.4,1,1S16.9,277,16.3,277z'/%3E%3C/g%3E%3Cg%3E%3Cpath fill='%23BDBEBE' d='M7,277H4c-0.6,0-1-0.4-1-1v-3c0-0.6,0.4-1,1-1s1,0.4,1,1v2h2c0.6,0,1,0.4,1,1S7.6,277,7,277z'/%3E%3C/g%3E%3Cg%3E%3Cpath fill='%23BDBEBE' d='M4,269.3c-0.6,0-1-0.4-1-1v-4.7c0-0.6,0.4-1,1-1s1,0.4,1,1v4.7C5,268.9,4.6,269.3,4,269.3z'/%3E%3C/g%3E%3Cg%3E%3Cpath fill='%23BDBEBE' d='M4,260c-0.6,0-1-0.4-1-1v-3c0-0.6,0.4-1,1-1h3c0.6,0,1,0.4,1,1s-0.4,1-1,1H5v2C5,259.6,4.6,260,4,260z'/%3E%3C/g%3E%3Cg%3E%3Cpath fill='%23BDBEBE' d='M16.3,257h-4.7c-0.6,0-1-0.4-1-1s0.4-1,1-1h4.7c0.6,0,1,0.4,1,1S16.9,257,16.3,257z'/%3E%3C/g%3E%3Cg%3E%3Cpath fill='%23BDBEBE' d='M24,260c-0.6,0-1-0.4-1-1v-2h-2c-0.6,0-1-0.4-1-1s0.4-1,1-1h3c0.6,0,1,0.4,1,1v3 C25,259.6,24.6,260,24,260z'/%3E%3C/g%3E%3Cg%3E%3Cpath fill='%23BDBEBE' d='M24,269.3c-0.6,0-1-0.4-1-1v-4.7c0-0.6,0.4-1,1-1s1,0.4,1,1v4.7C25,268.9,24.6,269.3,24,269.3z'/%3E%3C/g%3E%3C/g%3E%3Cg%3E%3Cpolygon fill='%23BDBEBE' points='14,259.8 15.7,264.3 20,264.4 16.7,267.2 18.4,271.8 14,269 9.6,271.8 11.3,267.2 8,264.4 12.3,264.3 '/%3E%3C/g%3E%3C/g%3E%3Cg id='tshirt-on'%3E%3Cpath fill='%23BDBEBE' d='M51,173l-5-2c0,0-1.4,2-4,2s-4-2-4-2l-5,2l-3,6l4,3v11h16v-11l4-3L51,173z M39,189h-2c-0.6,0-1-0.4-1-1v-2 c0-0.6,0.4-1,1-1s1,0.4,1,1v1h1c0.6,0,1,0.4,1,1S39.6,189,39,189z M36,183c0-0.3,0.1-0.5,0.3-0.7c0.4-0.4,1-0.4,1.4,0 c0.2,0.2,0.3,0.5,0.3,0.7s-0.1,0.5-0.3,0.7c-0.2,0.2-0.5,0.3-0.7,0.3s-0.5-0.1-0.7-0.3C36.1,183.5,36,183.3,36,183z M39,179h-1v1 c0,0.6-0.4,1-1,1s-1-0.4-1-1v-2c0-0.6,0.4-1,1-1h2c0.6,0,1,0.4,1,1S39.6,179,39,179z M42.7,188.7c-0.2,0.2-0.5,0.3-0.7,0.3 s-0.5-0.1-0.7-0.3c-0.2-0.2-0.3-0.4-0.3-0.7c0-0.3,0.1-0.5,0.3-0.7c0.4-0.4,1-0.4,1.4,0c0.2,0.2,0.3,0.4,0.3,0.7 C43,188.3,42.9,188.5,42.7,188.7z M42.7,178.7c-0.2,0.2-0.5,0.3-0.7,0.3s-0.5-0.1-0.7-0.3c-0.2-0.2-0.3-0.5-0.3-0.7 c0-0.3,0.1-0.5,0.3-0.7c0.4-0.4,1-0.4,1.4,0c0.2,0.2,0.3,0.4,0.3,0.7C43,178.3,42.9,178.5,42.7,178.7z M48,188c0,0.6-0.4,1-1,1h-2 c-0.6,0-1-0.4-1-1s0.4-1,1-1h1v-1c0-0.6,0.4-1,1-1s1,0.4,1,1V188z M47.7,183.7c-0.2,0.2-0.5,0.3-0.7,0.3s-0.5-0.1-0.7-0.3 c-0.2-0.2-0.3-0.5-0.3-0.7c0-0.3,0.1-0.5,0.3-0.7c0.4-0.4,1-0.4,1.4,0c0.2,0.2,0.3,0.5,0.3,0.7S47.9,183.5,47.7,183.7z M48,180 c0,0.6-0.4,1-1,1s-1-0.4-1-1v-1h-1c-0.6,0-1-0.4-1-1s0.4-1,1-1h2c0.6,0,1,0.4,1,1V180z'/%3E%3C/g%3E%3Cg id='tshirt'%3E%3Cg%3E%3Cpath fill='%23BDBEBE' d='M22,193H6c-0.6,0-1-0.4-1-1v-10.5l-2.6-1.7c-0.4-0.3-0.6-0.8-0.3-1.3l3-6c0.1-0.3,0.4-0.5,0.7-0.5l4-1 c0.4-0.1,0.8,0.1,1.1,0.4c0,0.1,1.1,1.6,3.2,1.6s3.1-1.5,3.2-1.6c0.2-0.3,0.7-0.5,1.1-0.4l4,1c0.3,0.1,0.5,0.3,0.7,0.5l3,6 c0.2,0.5,0.1,1-0.3,1.3l-2.6,1.7V192C23,192.6,22.6,193,22,193z M7,191h14v-10c0-0.3,0.2-0.6,0.4-0.8l2.3-1.5l-2.4-4.8l-3-0.7 c-0.7,0.7-2.2,1.9-4.4,1.9s-3.7-1.2-4.4-1.9l-3,0.7l-2.4,4.8l2.3,1.5c0.3,0.2,0.4,0.5,0.4,0.8V191z'/%3E%3C/g%3E%3Cg%3E%3Cpath fill='%23BDBEBE' d='M9,181c-0.6,0-1-0.4-1-1v-2c0-0.6,0.4-1,1-1h2c0.6,0,1,0.4,1,1s-0.4,1-1,1h-1v1C10,180.6,9.6,181,9,181z'/%3E%3C/g%3E%3Cg%3E%3Cpath fill='%23BDBEBE' d='M19,181c-0.6,0-1-0.4-1-1v-1h-1c-0.6,0-1-0.4-1-1s0.4-1,1-1h2c0.6,0,1,0.4,1,1v2 C20,180.6,19.6,181,19,181z'/%3E%3C/g%3E%3Cg%3E%3Cpath fill='%23BDBEBE' d='M11,189H9c-0.6,0-1-0.4-1-1v-2c0-0.6,0.4-1,1-1s1,0.4,1,1v1h1c0.6,0,1,0.4,1,1S11.6,189,11,189z'/%3E%3C/g%3E%3Cg%3E%3Cpath fill='%23BDBEBE' d='M19,189h-2c-0.6,0-1-0.4-1-1s0.4-1,1-1h1v-1c0-0.6,0.4-1,1-1s1,0.4,1,1v2C20,188.6,19.6,189,19,189z'/%3E%3C/g%3E%3Cg%3E%3Cpath fill='%23BDBEBE' d='M14,189c-0.3,0-0.5-0.1-0.7-0.3c-0.2-0.2-0.3-0.5-0.3-0.7s0.1-0.5,0.3-0.7c0.4-0.4,1-0.4,1.4,0 c0.2,0.2,0.3,0.5,0.3,0.7s-0.1,0.5-0.3,0.7C14.5,188.9,14.3,189,14,189z'/%3E%3C/g%3E%3Cg%3E%3Cpath fill='%23BDBEBE' d='M14,179c-0.3,0-0.5-0.1-0.7-0.3c-0.2-0.2-0.3-0.5-0.3-0.7s0.1-0.5,0.3-0.7c0.4-0.4,1-0.4,1.4,0 c0.2,0.2,0.3,0.4,0.3,0.7c0,0.3-0.1,0.5-0.3,0.7C14.5,178.9,14.3,179,14,179z'/%3E%3C/g%3E%3Cg%3E%3Cpath fill='%23BDBEBE' d='M9,184c-0.3,0-0.5-0.1-0.7-0.3C8.1,183.5,8,183.3,8,183s0.1-0.5,0.3-0.7c0.4-0.4,1.1-0.4,1.4,0 c0.2,0.2,0.3,0.4,0.3,0.7c0,0.3-0.1,0.5-0.3,0.7C9.5,183.9,9.3,184,9,184z'/%3E%3C/g%3E%3Cg%3E%3Cpath fill='%23BDBEBE' d='M19,184c-0.3,0-0.5-0.1-0.7-0.3c-0.2-0.2-0.3-0.5-0.3-0.7s0.1-0.5,0.3-0.7c0.4-0.4,1-0.4,1.4,0 c0.2,0.2,0.3,0.5,0.3,0.7s-0.1,0.5-0.3,0.7C19.5,183.9,19.3,184,19,184z'/%3E%3C/g%3E%3C/g%3E%3Cg id='shirt-on'%3E%3Cpath fill='%23BDBEBE' d='M51.2,146.7l-1.8-0.6c-0.3-0.1-0.5-0.3-0.6-0.6l-0.6-1.8c-0.1-0.4-0.5-0.7-0.9-0.7H42h-5.3 c-0.4,0-0.8,0.3-0.9,0.7l-0.6,1.8c-0.1,0.3-0.3,0.5-0.6,0.6l-1.8,0.6c-0.4,0.1-0.7,0.6-0.7,1.1l1.8,15.3c0.1,0.5,0.5,0.9,1,0.9 h14.2c0.5,0,0.9-0.4,1-0.9l1.8-15.3C52,147.3,51.7,146.9,51.2,146.7z M42,162c-0.6,0-1-0.4-1-1s0.4-1,1-1s1,0.4,1,1 S42.6,162,42,162z M42,158c-0.6,0-1-0.4-1-1s0.4-1,1-1s1,0.4,1,1S42.6,158,42,158z M42,154c-0.6,0-1-0.4-1-1s0.4-1,1-1s1,0.4,1,1 S42.6,154,42,154z M48.3,147.4l-3,2c-0.1,0.1-0.2,0.1-0.3,0.1s-0.2,0-0.3-0.1l-2.7-1.8l-2.7,1.8c-0.2,0.1-0.4,0.1-0.6,0l-3-2 c-0.2-0.2-0.3-0.5-0.1-0.7c0.2-0.2,0.5-0.3,0.7-0.1l2.7,1.8l2.7-1.8c0.2-0.1,0.4-0.1,0.6,0l2.7,1.8l2.7-1.8 c0.2-0.2,0.5-0.1,0.7,0.1C48.6,147,48.5,147.3,48.3,147.4z'/%3E%3C/g%3E%3Cg id='shirt'%3E%3Cg%3E%3Cpath fill='%23BDBEBE' d='M22,165H6c-0.5,0-0.9-0.4-1-0.9l-2-16c-0.1-0.5,0.2-0.9,0.7-1.1l2.5-0.8l0.8-2.5c0.1-0.3,0.4-0.6,0.7-0.6 c0.3-0.1,0.7,0,0.9,0.2l5.4,4.5l5.4-4.5c0.3-0.2,0.6-0.3,0.9-0.2c0.3,0.1,0.6,0.3,0.7,0.6l0.8,2.5l2.5,0.8 c0.5,0.2,0.7,0.6,0.7,1.1l-2,16C22.9,164.6,22.5,165,22,165z M6.9,163h14.2l1.8-14.3l-2.2-0.7c-0.3-0.1-0.5-0.3-0.6-0.6l-0.5-1.6 l-4.9,4.1c-0.4,0.3-0.9,0.3-1.3,0l-4.9-4.1l-0.5,1.6c-0.1,0.3-0.3,0.5-0.6,0.6l-2.2,0.7L6.9,163z'/%3E%3C/g%3E%3Cg%3E%3Cpath fill='%23BDBEBE' d='M14,154c-0.6,0-1,0.4-1,1s0.4,1,1,1s1-0.4,1-1S14.6,154,14,154L14,154z'/%3E%3C/g%3E%3Cg%3E%3Cpath fill='%23BDBEBE' d='M14,158c-0.6,0-1,0.4-1,1s0.4,1,1,1s1-0.4,1-1S14.6,158,14,158L14,158z'/%3E%3C/g%3E%3Cg%3E%3Cpath fill='%23BDBEBE' d='M14,162c-0.6,0-1,0.4-1,1s0.4,1,1,1s1-0.4,1-1S14.6,162,14,162L14,162z'/%3E%3C/g%3E%3Cg%3E%3Cpath fill='%23BDBEBE' d='M17,153c-0.3,0-0.5-0.1-0.7-0.3l-2.3-2.3l-2.3,2.3c-0.2,0.2-0.5,0.3-0.8,0.3c-0.3,0-0.5-0.2-0.7-0.4l-4-5 c-0.3-0.4-0.3-1.1,0.2-1.4c0.4-0.3,1.1-0.3,1.4,0.2l3.3,4.1l2.2-2.2c0.4-0.4,1-0.4,1.4,0l2.2,2.2l3.3-4.1c0.3-0.4,1-0.5,1.4-0.2 c0.4,0.3,0.5,1,0.2,1.4l-4,5C17.6,152.8,17.3,153,17,153C17,153,17,153,17,153z'/%3E%3C/g%3E%3Cg%3E%3Cpath fill='%23BDBEBE' d='M20,145H8c-0.6,0-1-0.4-1-1s0.4-1,1-1h12c0.6,0,1,0.4,1,1S20.6,145,20,145z'/%3E%3C/g%3E%3C/g%3E%3Cg id='personalserver-on'%3E%3Cpath fill='%23BDBEBE' d='M49,115H35c-0.6,0-1,0.4-1,1v20c0,0.6,0.4,1,1,1h14c0.6,0,1-0.4,1-1v-20C50,115.4,49.6,115,49,115z M38.5,118c0.8,0,1.5,0.7,1.5,1.5s-0.7,1.5-1.5,1.5s-1.5-0.7-1.5-1.5S37.7,118,38.5,118z M47,133H37c-0.6,0-1-0.4-1-1s0.4-1,1-1 h10c0.6,0,1,0.4,1,1S47.6,133,47,133z M47,129H37c-0.6,0-1-0.4-1-1s0.4-1,1-1h10c0.6,0,1,0.4,1,1S47.6,129,47,129z'/%3E%3C/g%3E%3Cg id='personalserver'%3E%3Cg%3E%3Cpath fill='%23BDBEBE' d='M21,137H7c-0.6,0-1-0.4-1-1v-20c0-0.6,0.4-1,1-1h14c0.6,0,1,0.4,1,1v20C22,136.6,21.6,137,21,137z M8,135 h12v-18H8V135z'/%3E%3C/g%3E%3Cg%3E%3Cpath fill='%23BDBEBE' d='M10.5,118c-0.8,0-1.5,0.7-1.5,1.5s0.7,1.5,1.5,1.5s1.5-0.7,1.5-1.5S11.3,118,10.5,118L10.5,118z'/%3E%3C/g%3E%3Cg%3E%3Cpath fill='%23BDBEBE' d='M21,129H7c-0.6,0-1-0.4-1-1s0.4-1,1-1h14c0.6,0,1,0.4,1,1S21.6,129,21,129z'/%3E%3C/g%3E%3Cg%3E%3Cpath fill='%23BDBEBE' d='M21,133H7c-0.6,0-1-0.4-1-1s0.4-1,1-1h14c0.6,0,1,0.4,1,1S21.6,133,21,133z'/%3E%3C/g%3E%3C/g%3E%3Cg id='place'%3E%3Cpath fill='%23BDBEBE' d='M52,106h-2v-2h1.7c0.9,0,1.5-1,1-1.8L50.8,99h0.8c0.9,0,1.5-1,1-1.7L50,92.6c-0.4-0.8-1.6-0.8-2,0 l-2.7,4.7c-0.4,0.8,0.1,1.7,1,1.7h0.8l-1.9,3.2c-0.4,0.8,0.1,1.8,1,1.8H48v2h-4V89c0-0.6-0.4-1-1-1H33c-0.6,0-1,0.4-1,1v17 c-0.6,0-1,0.4-1,1s0.4,1,1,1h20c0.6,0,1-0.4,1-1S52.6,106,52,106z M40,99h-4c-0.6,0-1-0.4-1-1s0.4-1,1-1h4c0.6,0,1,0.4,1,1 S40.6,99,40,99z M40,96h-4c-0.6,0-1-0.4-1-1s0.4-1,1-1h4c0.6,0,1,0.4,1,1S40.6,96,40,96z M40,93h-4c-0.6,0-1-0.4-1-1s0.4-1,1-1h4 c0.6,0,1,0.4,1,1S40.6,93,40,93z'/%3E%3C/g%3E%3Cg id='place_1_'%3E%3Cg%3E%3Cpath fill='%23BDBEBE' d='M24,99C24,99,24,99,24,99h-6c-0.4,0-0.7-0.2-0.9-0.5s-0.2-0.7,0-1l3-5c0.4-0.6,1.4-0.6,1.7,0l2.9,4.9 c0.2,0.2,0.3,0.4,0.3,0.7C25,98.6,24.6,99,24,99z M19.8,97h2.5L21,94.9L19.8,97z'/%3E%3C/g%3E%3Cg%3E%3Cpath fill='%23BDBEBE' d='M24,104C24,104,24,104,24,104h-6c-0.4,0-0.7-0.2-0.9-0.5s-0.2-0.7,0-1l3-5c0.4-0.6,1.4-0.6,1.7,0l2.9,4.9 c0.2,0.2,0.3,0.4,0.3,0.7C25,103.6,24.6,104,24,104z M19.8,102h2.5L21,99.9L19.8,102z'/%3E%3C/g%3E%3Cg%3E%3Cpath fill='%23BDBEBE' d='M21,107c-0.6,0-1-0.4-1-1v-3c0-0.6,0.4-1,1-1s1,0.4,1,1v3C22,106.6,21.6,107,21,107z'/%3E%3C/g%3E%3Cg%3E%3Cpath fill='%23BDBEBE' d='M24,108H4c-0.6,0-1-0.4-1-1s0.4-1,1-1h20c0.6,0,1,0.4,1,1S24.6,108,24,108z'/%3E%3C/g%3E%3Cg%3E%3Cpath fill='%23BDBEBE' d='M15,108H5c-0.6,0-1-0.4-1-1V89c0-0.6,0.4-1,1-1h10c0.6,0,1,0.4,1,1v18C16,107.6,15.6,108,15,108z M6,106 h8V90H6V106z'/%3E%3C/g%3E%3Cg%3E%3Cpath fill='%23BDBEBE' d='M12,93H8c-0.6,0-1-0.4-1-1s0.4-1,1-1h4c0.6,0,1,0.4,1,1S12.6,93,12,93z'/%3E%3C/g%3E%3Cg%3E%3Cpath fill='%23BDBEBE' d='M12,96H8c-0.6,0-1-0.4-1-1s0.4-1,1-1h4c0.6,0,1,0.4,1,1S12.6,96,12,96z'/%3E%3C/g%3E%3Cg%3E%3Cpath fill='%23BDBEBE' d='M12,99H8c-0.6,0-1-0.4-1-1s0.4-1,1-1h4c0.6,0,1,0.4,1,1S12.6,99,12,99z'/%3E%3C/g%3E%3C/g%3E%3Cg%3E%3Ccircle fill='%23BDBEBE' cx='39' cy='62' r='4'/%3E%3Cpath fill='%23BDBEBE' d='M43,67H31c-0.5,0-1,0.5-1,1v1c0,0.5,0.4,1.1,1,1.2l3,0.6c0.5,0.1,0.9,0.6,0.8,1.2l-1.6,9 c-0.1,0.5,0.3,1,0.8,1h1c0.5,0,1.2-0.4,1.5-0.9l7.1-13.2C43.8,67.4,43.5,67,43,67z'/%3E%3Cpath fill='%23BDBEBE' d='M53.8,61.4C53.6,61.2,53.3,61,53,61h-2c-0.4,0-0.7,0.2-0.9,0.5l-6,10C44,71.7,44,72,44,72.3 c0.1,0.3,0.3,0.5,0.5,0.6l4,2C48.7,75,48.8,75,49,75c0.1,0,0.3,0,0.4-0.1c0.3-0.1,0.5-0.3,0.6-0.6l4-12C54.1,62,54,61.7,53.8,61.4 z'/%3E%3Cpath fill='%23BDBEBE' d='M45,75c-2.7,0-3.2,1.5-3.7,2.9c-0.3,0.7-0.6,1.6-1.2,2.6c-0.2,0.3-0.2,0.7,0,1c0.2,0.3,0.5,0.5,0.9,0.5 c1.7,0,7,0,7-4C48,76.4,46.6,75,45,75z'/%3E%3C/g%3E%3Cg%3E%3Cpath fill='%23BDBEBE' d='M11,66c2.2,0,4-1.8,4-4s-1.8-4-4-4s-4,1.8-4,4S8.8,66,11,66z M11,60c1.1,0,2,0.9,2,2s-0.9,2-2,2 s-2-0.9-2-2S9.9,60,11,60z'/%3E%3Cpath fill='%23BDBEBE' d='M11.4,74.1c-0.5-0.2-1.1,0-1.3,0.4L7.4,80H6.2L8,72.2c0.1-0.5-0.2-1.1-0.7-1.2L4,70.2V69h10 c0.6,0,1-0.4,1-1s-0.4-1-1-1H3c-0.6,0-1,0.4-1,1v3c0,0.5,0.3,0.9,0.8,1l3.1,0.8l-1.8,8c-0.1,0.3,0,0.6,0.2,0.8 C4.4,81.9,4.7,82,5,82h3c0.4,0,0.7-0.2,0.9-0.6l3-6C12.1,75,11.9,74.4,11.4,74.1z'/%3E%3Cpath fill='%23BDBEBE' d='M25.8,61.4C25.6,61.2,25.3,61,25,61h-2c-0.3,0-0.6,0.2-0.8,0.4l-7,10C15,71.7,15,72,15,72.3 c0.1,0.3,0.3,0.5,0.6,0.6l5,2c0.1,0,0.2,0.1,0.4,0.1c0.1,0,0.3,0,0.4-0.1c0.2-0.1,0.4-0.3,0.5-0.6l4-12C26.1,62,26,61.7,25.8,61.4 z M20.4,72.7l-2.8-1.1l6-8.5h0.1L20.4,72.7z'/%3E%3Cpath fill='%23BDBEBE' d='M16,74c-2.6,0-3.2,1.9-3.6,3.5c-0.3,0.9-0.6,1.9-1.2,3c-0.2,0.3-0.2,0.7,0,1c0.2,0.3,0.5,0.5,0.9,0.5 c7,0,8-2.5,8-4C20,75.4,17.7,74,16,74z M13.7,79.9c0.3-0.7,0.5-1.3,0.6-1.9C14.8,76.3,15,76,16,76c0.5,0,2,0.5,2,2 C18,79,16.3,79.7,13.7,79.9z'/%3E%3C/g%3E%3Cg id='develop-on'%3E%3Cg%3E%3Cpath fill='%23BDBEBE' d='M52,38c-0.6,0-1-0.4-1-1v-4h-4c-0.6,0-1-0.4-1-1s0.4-1,1-1h5c0.6,0,1,0.4,1,1v5C53,37.6,52.6,38,52,38z'/%3E%3C/g%3E%3Cg%3E%3Cpath fill='%23BDBEBE' d='M37,53h-5c-0.6,0-1-0.4-1-1v-5c0-0.6,0.4-1,1-1s1,0.4,1,1v4h4c0.6,0,1,0.4,1,1S37.6,53,37,53z'/%3E%3C/g%3E%3Cg%3E%3Cpath fill='%23BDBEBE' d='M34,31h4.6c0.3,0,0.5,0.1,0.7,0.3l2.4,2.4c0.2,0.2,0.3,0.4,0.3,0.7v4.2c0,0.3,0.1,0.5,0.3,0.7l2.4,2.4 c0.2,0.2,0.4,0.3,0.7,0.3h4.2c0.3,0,0.5,0.1,0.7,0.3l2.4,2.4c0.2,0.2,0.3,0.4,0.3,0.7V50l-3.7-3.7c-0.2-0.2-0.4-0.3-0.7-0.3H47 c-0.6,0-1,0.4-1,1v1.6c0,0.3,0.1,0.5,0.3,0.7L50,53h-4.6c-0.3,0-0.5-0.1-0.7-0.3l-2.4-2.4c-0.2-0.2-0.3-0.4-0.3-0.7v-4.2 c0-0.3-0.1-0.5-0.3-0.7l-2.4-2.4c-0.2-0.2-0.4-0.3-0.7-0.3h-4.2c-0.3,0-0.5-0.1-0.7-0.3l-2.4-2.4c-0.2-0.2-0.3-0.4-0.3-0.7V34 l3.7,3.7c0.2,0.2,0.4,0.3,0.7,0.3H37c0.6,0,1-0.4,1-1v-1.6c0-0.3-0.1-0.5-0.3-0.7L34,31z'/%3E%3C/g%3E%3C/g%3E%3Cg id='develop'%3E%3Cg%3E%3Cpath fill='%23BDBEBE' d='M24,38c-0.6,0-1-0.4-1-1v-4h-4c-0.6,0-1-0.4-1-1s0.4-1,1-1h5c0.6,0,1,0.4,1,1v5C25,37.6,24.6,38,24,38z'/%3E%3C/g%3E%3Cg%3E%3Cpath fill='%23BDBEBE' d='M9,53H4c-0.6,0-1-0.4-1-1v-5c0-0.6,0.4-1,1-1s1,0.4,1,1v4h4c0.6,0,1,0.4,1,1S9.6,53,9,53z'/%3E%3C/g%3E%3Cg%3E%3Cpath fill='%23BDBEBE' d='M21,53C21,53,21,53,21,53h-5c-0.3,0-0.5-0.1-0.7-0.3l-2-2C13.1,50.5,13,50.3,13,50v-4.6L10.6,43H6 c-0.3,0-0.5-0.1-0.7-0.3l-2-2C3.1,40.5,3,40.3,3,40v-5c0-0.4,0.2-0.8,0.6-0.9s0.8-0.1,1.1,0.2L7.4,37H9v-1.6l-2.7-2.7 C6,32.4,5.9,32,6.1,31.6C6.2,31.2,6.6,31,7,31h5c0.3,0,0.5,0.1,0.7,0.3l2,2c0.2,0.2,0.3,0.4,0.3,0.7v4.6l2.4,2.4H22 c0.3,0,0.5,0.1,0.7,0.3l2,2c0.2,0.2,0.3,0.4,0.3,0.7v5c0,0.4-0.2,0.8-0.6,0.9c-0.4,0.2-0.8,0.1-1.1-0.2L20.6,47H19v1.6l2.6,2.6 c0.3,0.2,0.4,0.5,0.4,0.8C22,52.6,21.6,53,21,53z M16.4,51h2.2l-1.3-1.3C17.1,49.5,17,49.3,17,49v-3c0-0.6,0.4-1,1-1h3 c0.3,0,0.5,0.1,0.7,0.3l1.3,1.3v-2.2L21.6,43H17c-0.3,0-0.5-0.1-0.7-0.3l-3-3C13.1,39.5,13,39.3,13,39v-4.6L11.6,33H9.4l1.3,1.3 c0.2,0.2,0.3,0.4,0.3,0.7v3c0,0.6-0.4,1-1,1H7c-0.3,0-0.5-0.1-0.7-0.3L5,37.4v2.2L6.4,41H11c0.3,0,0.5,0.1,0.7,0.3l3,3 c0.2,0.2,0.3,0.4,0.3,0.7v4.6L16.4,51z'/%3E%3C/g%3E%3C/g%3E%3Cg id='profile-on'%3E%3Ccircle fill='%23BDBEBE' cx='42' cy='8' r='6'/%3E%3Cpath fill='%23BDBEBE' d='M42,16c0,0,6,0,7,1c0.8,0.8,1.6,4.6,1.9,6.2c0.1,0.5-0.2,0.9-0.6,1.1C48.9,24.9,45.7,26,42,26 s-6.9-1.1-8.3-1.7c-0.4-0.2-0.7-0.6-0.6-1.1c0.3-1.7,1.1-5.4,1.9-6.2C36,16,42,16,42,16z'/%3E%3C/g%3E%3Cg id='profile'%3E%3Cg%3E%3Cpath fill='%23BDBEBE' d='M14,14c-3.3,0-6-2.7-6-6s2.7-6,6-6s6,2.7,6,6S17.3,14,14,14z M14,4c-2.2,0-4,1.8-4,4s1.8,4,4,4s4-1.8,4-4 S16.2,4,14,4z'/%3E%3C/g%3E%3Cg%3E%3Cpath fill='%23BDBEBE' d='M14,26c-5.2,0-8.4-2.1-8.5-2.2c-0.3-0.2-0.5-0.6-0.4-1c0.2-1.2,1.1-5.4,2.3-6.5C8.5,15.1,12.4,15,14,15 c1.6,0,5.5,0.1,6.7,1.3c1.1,1.1,2,5.3,2.3,6.5c0.1,0.4-0.1,0.8-0.4,1C22.4,23.9,19.2,26,14,26z M7.1,22.5C8.2,23,10.6,24,14,24 c3.4,0,5.8-1,6.9-1.5c-0.5-2.1-1.2-4.3-1.6-4.8C18.9,17.3,16.4,17,14,17c-2.4,0-4.9,0.3-5.3,0.7C8.3,18.1,7.6,20.4,7.1,22.5z'/%3E%3C/g%3E%3C/g%3E%3C/g%3E%3Cg id='games'%3E%3C/g%3E%3Cg id='Social_and_Interaction'%3E%3C/g%3E%3Cg id='Navigation'%3E%3C/g%3E%3Cg id='Friends_Status'%3E%3C/g%3E%3C/svg%3E");
}

.form-horizontal .form-control-label {
    display: none;
}

.content .list-gallery {
    display: inline-block;
    width: 100%;
}

.content .list-gallery li {
    display: inline-block;
    padding: 0 0 20px 0;
    margin-right: 1%;
}

.content .list-gallery .item-place {
    margin-right: 4px;
    width: 20%;
}

.content .list-gallery .item-place a {
    display: block;
}

.content .list-gallery .item-place img {
    width: 100%;
    height: auto;
}

${ (!Settings.DeveloperOptions.ModernFormat) && `
.content .list-gallery .item-asset {
    width: 23%;
}
`}

.content .list-gallery .font-bold {
    white-space: nowrap;
    margin: 0;
}

.content .share-login {
    display: none;
    margin: 8px;
}

@media(max-width: 767px) {
    .content .list-gallery li.item-place {
        margin-right:1%;
        width: 48%;
    }

    .content .list-gallery li.item-place:nth-child(4) {
        display: inline-block;
    }

    .content .list-gallery li.item-place img {
        min-width: 150px;
        min-height: 150px;
    }
}

@media(max-width: 543px) {
    .content .list-gallery li.item-place {
        width:99%;
    }

    .content .list-gallery li.item-place:nth-child(4) {
        display: none;
    }

    .content .list-gallery li.item-place img {
        min-width: 60px;
        min-height: 60px;
    }
}

.content .item-place {
    margin-right: 1%;
    width: 48%;
}

.content .item-place img {
    min-width: 150px;
    min-height: 150px;
}

@media(max-width: 991px) {
    .content .item-place {
        width:99%;
    }

    .content .item-place:nth-child(4) {
        display: none;
    }
}

@media(max-width: 767px) {
    .content .section-content {
        padding-bottom:54px;
    }

    .content .section {
        margin-right: 0;
    }
}

.feeds .feed-game span[class^="icon"],.feeds .feed-creation span[class^="icon"],.feeds .feed-social span[class^="icon"] {
    background-size: 200% auto;
    width: 60px;
    height: 60px;
}

.feeds .feed-game {
    border-top: 2px solid #02b757;
}

.feeds .feed-creation {
    border-top: 2px solid #F68802;
}

.feeds .feed-social {
    border-top: 2px solid #00A2FF;
}

.feeds .icon-games {
    background-position: 0 -60px;
}

.feeds .icon-develop {
    background-position: 0 -60px;
}

.feeds .icon-charactercustomizer {
    background-position: 0 -120px;
}

.feeds .icon-friends {
    background-position: 0 -120px;
}

.feeds .icon-forum {
    background-position: 0 -240px;
}

.feeds .feedtext {
    word-break: break-word;
    overflow: hidden;
}

.feeds .list-item a span {
    display: block;
}
            `
            document.head.appendChild(HomePageCSS)
            var sectionheader = document.createElement("div")
            sectionheader.classList.add("container-header")
            hdrSec.appendChild(sectionheader)
            var sectionheaderh1 = document.createElement("h1")
            sectionheaderh1.textContent = "My Feed"
            sectionheader.appendChild(sectionheaderh1)
            var sectioncontent = document.createElement("div")
            sectioncontent.classList.add("section-content")
            hdrSec.appendChild(sectioncontent)
            if (Settings.DeveloperOptions.enablePosting) {
                var statusForm = document.createElement("div")
                statusForm.classList.add("form-horizontal")
                statusForm.setAttribute("id", "statusForm")
                statusForm.setAttribute("role", "form")
                sectioncontent.appendChild(statusForm)
                var formgroup = document.createElement("div")
                formgroup.classList.add("form-group")
                statusForm.appendChild(formgroup)
                var inputfield = document.createElement("input")
                inputfield.classList.add("form-control", "input-field")
                inputfield.setAttribute("id", "txtStatusMessage")
                inputfield.setAttribute("maxlength", 254)
                inputfield.setAttribute("placeholder", "What are you up to?")
                inputfield.setAttribute("value", "")
                formgroup.appendChild(inputfield)
                var formcontrollabel = document.createElement("p")
                formcontrollabel.classList.add("form-control-label")
                formcontrollabel.textContent = "Status update failed."
                formgroup.appendChild(formcontrollabel)
                var btnprimarymd = document.createElement("a")
                btnprimarymd.setAttribute("type", "button")
                btnprimarymd.classList.add("btn-primary-md", "btn-fixed-width")
                btnprimarymd.setAttribute("id", "shareButton")
                btnprimarymd.textContent = "Share"
                statusForm.appendChild(btnprimarymd)
                var loadingImage = document.createElement("img")
                loadingImage.setAttribute("id", "loadingImage")
                loadingImage.classList.add("share-login")
                loadingImage.setAttribute("alt", "Sharing...")
                loadingImage.setAttribute("src", "https://images.rbxcdn.com/ec4e85b0c4396cf753a06fade0a8d8af.gif")
                loadingImage.setAttribute("height", 17)
                loadingImage.setAttribute("width", 48)
                statusForm.appendChild(loadingImage)
                btnprimarymd.addEventListener("click", function() {
                    btnprimarymd.style = "display: none"
                    loadingImage.style = "display: inline-block"
                    setTimeout(function() {
                        btnprimarymd.removeAttribute("style")
                        loadingImage.removeAttribute("style")
                        formcontrollabel.style = "display: block"
                    }, 4000)
                });
            }
            var feedvlist = document.createElement("ul")
            feedvlist.classList.add("vlist", "feeds")
            sectioncontent.appendChild(feedvlist)
            listItemTemplate("gameFeed", "feed-game", "icon-games", url+((Settings.DeveloperOptions.GamestoExperience) && "/discover" || "/games"), (Settings.DeveloperOptions.GamestoExperience) && "Play Experiences" || "Play Games", (Settings.DeveloperOptions.GamestoExperience) && "Nearly all Roblox experiences are built by players like you. Here are some of our favorites:" || "Nearly all Roblox games are built by players like you. Here are some of our favorites:", feedvlist, false)
            listItemTemplate("None", "feed-creation", "icon-charactercustomizer", url+"/catalog/browse.aspx?CatalogContext=1&Subcategory=1&CreatorID=1&CurrencyType=0&pxMin=0&pxMax=0&SortType=4&SortAggregation=3&SortCurrency=0&IncludeNotForSale=false&LegendExpanded=true&Category=1", "Customize Your Avatar", `Visit the <a href="${ url }/my/avatar"> Avatar ${ Settings.DeveloperOptions.ModernFormat && "Editor" || "page" } </a> to customize your ${ Settings.DeveloperOptions.ModernFormat && "character" || "avatar" }. ${ Settings.DeveloperOptions.ModernFormat && "Shop for clothing in the" || "Get new clothing in the" } <a href="${ url }/catalog/browse.aspx?CatalogContext=1&amp;Subcategory=1&amp;CreatorID=1&amp;CurrencyType=0&amp;pxMin=0&amp;pxMax=0&amp;SortType=4&amp;SortAggregation=3&amp;SortCurrency=0&amp;IncludeNotForSale=false&amp;LegendExpanded=true&amp;Category=1">${ (Settings.DeveloperOptions.ModernFormat) && (Settings.DeveloperOptions.CatalogtoAvatarShop && "Avatar Shop" || "Catalog") || Settings.DeveloperOptions.CatalogtoAvatarShop && "avatar shop" || "catalog" }</a>`, feedvlist, true)
            listItemTemplate("None", "feed-creation", "icon-develop", url+"/develop", "Build Something", `Builders will enjoy playing our multiplayer building ${ Settings.DeveloperOptions.GamestoExperience && "experience" || "game" }. Professional builders will want to check out Roblox Studio, our ${ (!Settings.DeveloperOptions.ModernFormat && (Settings.DeveloperOptions.GamestoExperience && "experience" || "game") || "") } development environment on your <a href="h${ url }/develop">Develop page</a>.`, feedvlist, true)
            listItemTemplate("None", "feed-social", "icon-friends", url+"/search/users", "Make Friends", `Meet other players in-${ Settings.DeveloperOptions.GamestoExperience && "experience" || "game" } and send them a friend request. If you miss your opportunity you can always send a request later by <a href="${ url }/search/users">searching</a> for their user profile.`, feedvlist, true)
            if (Settings.DeveloperOptions.enableforumlistItem) {
                listItemTemplate("None", "feed-social", "icon-forum", url+"/forum", "Roblox forums for help", `No matter what you're looking for, if it's Roblox related, there are people talking about it <a href="${ url }/forum">here</a>.`, feedvlist, true)
            }
        }
    })
    waitForElm(".request-error-page-content").then(async (hdrSec) => {
        if (Settings.DeveloperOptions.Soothsayer) {
            document.querySelector(".content").removeChild(hdrSec)
        } else {
            hdrSec.querySelector(".error-title").textContent = "Page under construction"
            hdrSec.querySelector(".error-message").textContent = ""
            hdrSec.querySelector(".error-message").innerHTML = `403 <span>|</span>You don't have permission to view this page`
            hdrSec.querySelector(".message-container")
            var contactfooter = document.createElement("p")
            contactfooter.classList.add("contact-message", "text-footer")
            contactfooter.textContent = "Check back later!"
            hdrSec.appendChild(contactfooter)
            hdrSec.querySelector(".error-image").setAttribute("src", "https://images.rbxcdn.com/ad109e93f630415cde65a19fd2f84d2b.png")
        }
    })
}

if (Settings.RestoreHomePage && window.location.href == url+"/home") {
    var Style = document.createElement("style")
    Style.innerHTML = StyleSheet()
    document.head.appendChild(Style)
    var avatarLoadingHeadshot, avatarLoadingThumb, headerLoadingcontent, homeLoadingheader, headerLoadingLbl
    var homecontainer, hcfirstsection, homeheaderBase, homeheaderBaseSub, homeheaderSubBase, avatarHeadshot, thumbnail2dcontainer, avatarThumb, headeruserinfo, headercontent, homeheader, headerLbl
    var PresenceDiv, PresenceSpan, PresenceStatus
    var initialSetup = setInterval(function() {
        try {
            homecontainer = document.getElementById("HomeContainer")
            hcfirstsection = homecontainer.querySelector(".section:first-child")
            /*/ Swap "home" section element to our home template /*/
            if (homecontainer && hcfirstsection) {
                switch(Settings.homeFormat) {
                    case "2017":
                    case "2020":
                        homeheaderBase = document.createElement("div")
                        homeheaderBase.classList.add("col-xs-12", "home-header")
                        homecontainer.insertBefore(homeheaderBase, hcfirstsection)
                        homecontainer.removeChild(hcfirstsection)
                        avatarLoadingHeadshot = document.createElement("span")
                        avatarLoadingHeadshot.classList.add("avatar", "avatar-headshot-lg", "placeholder", "shimmer")
                        homeheaderBase.appendChild(avatarLoadingHeadshot)
                        //==========//
                        headerLoadingcontent = document.createElement("div")
                        headerLoadingcontent.classList.add("home-header-content", "non-bc")
                        homeheaderBase.appendChild(headerLoadingcontent)
                        if (Settings.DeveloperOptions.fix2020homeFormat && Settings.homeFormat == "2020") {
                            headerLoadingcontent.classList.add("hF2020PositionFix")
                        }
                        homeLoadingheader = document.createElement("h1")
                        homeLoadingheader.classList.add("col-xs-3", "shimmer-lines")
                        headerLoadingcontent.appendChild(homeLoadingheader)
                        headerLoadingLbl = document.createElement("span")
                        headerLoadingLbl.classList.add("placeholder", "shimmer", "shimmer-line")
                        homeLoadingheader.appendChild(headerLoadingLbl)
                        break
                    case "2021":
                    case "2022":
                        ` Shimmer Template ( Formatted )
                        <div id="home-header" class="col-xs-12 home-header-container">
                            <div id="home-header-shimmer" class="home-header-shimmer">
                                <span class="placeholder shimmer shimmer-home-avatar"></span>
                                <span class="shimmer-lines shimmer-home-user-info">
                                    <div class="placeholder shimmer-line"></div>
                                </span>
                            </div>
                        </div>
                        `
                        homeheaderBase = document.createElement("div")
                        homeheaderBase.classList.add("col-xs-12", "home-header-container")
                        homecontainer.insertBefore(homeheaderBase, hcfirstsection)
                        homecontainer.removeChild(hcfirstsection)
                        homeheaderBaseSub = document.createElement("div")
                        homeheaderBaseSub.setAttribute("id", "home-header-shimmer")
                        homeheaderBaseSub.classList.add("home-header-shimmer")
                        homeheaderBase.appendChild(homeheaderBaseSub)
                        avatarLoadingHeadshot = document.createElement("span")
                        avatarLoadingHeadshot.classList.add("placeholder", "shimmer", "shimmer-home-avatar")
                        homeheaderBaseSub.appendChild(avatarLoadingHeadshot)
                        //==========//
                        headerLoadingcontent = document.createElement("span")
                        headerLoadingcontent.classList.add("shimmer-lines", "shimmer-home-user-info")
                        homeheaderBaseSub.appendChild(headerLoadingcontent)
                        headerLoadingLbl = document.createElement("span")
                        headerLoadingLbl.classList.add("placeholder", "shimmer-line")
                        headerLoadingcontent.appendChild(headerLoadingLbl)
                        break
                }
                clearInterval(initialSetup)
            }
        } catch {
        }
    }, 0)
    setInterval(function() {
        /*/ Check if ropro is enabled and add our class /*/
        if (document.getElementById("mostPlayedContainer") && (Settings.homeFormat == "2017" || Settings.homeFormat == "2020")) {
            homeheaderBase.classList.add("ropro-enabled")
            if (homeLoadingheader.classList.contains("col-xs-3", "shimmer-lines")) {
                homeLoadingheader.classList.remove("col-xs-3", "shimmer-lines")
                homeLoadingheader.classList.add("col-xs-6", "shimmer-lines")
            }
        }
        if (!Settings.DeveloperOptions.forceinfLoading) {
            if (!userData.Status.InfoDataLoaded) {
                if (Settings.DeveloperOptions.demoMode) {
                    userData.Response = {id: 1, name: "Roblox", displayName: "Roblox"}
                    userData.id = userData.Response.id
                    userData.name = userData.Response.name
                    userData.displayName = userData.Response.displayName
                    userData.Status.InfoDataLoaded = true
                } else {
                    GM_xmlhttpRequest({
                        method: "GET",
                        url: "https://users.roblox.com/v1/users/authenticated",
                        headers: {
                            "Content-Type": "application/json"
                        },
                        onload: function(response) {
                            userData.Response = JSON.parse(response.responseText)
                            userData.id = userData.Response.id
                            userData.name = userData.Response.name
                            userData.displayName = userData.Response.displayName
                            userData.Status.InfoDataLoaded = true
                        },
                        onerror: function(error) {
                            userData.Status.InfoDataErrored = true;
                        }
                    });
                }
            }
            if (!userData.Status.MembershipDataLoaded) {
                if (Settings.DeveloperOptions.forceMembership) {
                    userData.Membership = true
                    userData.Status.MembershipDataLoaded = true
                } else {
                    GM_xmlhttpRequest({
                        method: "GET",
                        url: "https://premiumfeatures.roblox.com/v1/users/"+userData.id+"/validate-membership",
                        onload: function(response) {
                            userData.Membership = JSON.parse(response.responseText)
                            userData.Status.MembershipDataLoaded = true
                        },
                        onerror: function(error) {
                            userData.Status.MembershipDataErrored = true
                        }
                    });
                }
            }
            if (!userData.Status.AvatarDataLoaded) {
                GM_xmlhttpRequest({
                    method: "GET",
                    url: "https://thumbnails.roblox.com/v1/users/avatar-headshot?userIds="+userData.id+"&size=150x150&format=Png",
                    onload: function(response) {
                        try {
                            userData.avatar.data.Response = JSON.parse(response.responseText).data[0]
                            userData.avatar.data.imageUrl = userData.avatar.data.Response.imageUrl
                            userData.Status.AvatarDataLoaded = true
                        } catch {
                        }
                    },
                    onerror: function(error) {
                        userData.Status.AvatarDataErrored = true
                    }
                })
            }
            if (Settings.BulkLoading && userData.Status.InfoDataLoaded && userData.Status.MembershipDataLoaded && userData.Status.AvatarDataLoaded) {
                userData.Status.FullyLoaded = true
                if (!userData.Status.FullyLoadedPaused && Settings.BulkLoading) {
                    userData.Status.FullyLoadedPaused = true
                    switch(Settings.homeFormat) {
                        case "2017":
                        case "2020":
                            if (Settings.JSClasses) {
                                switch(Settings.homeFormat) {
                                    case "2017":
                                        document.body.classList.add("HP2017")
                                        break
                                    case "2020":
                                        document.body.classList.add("HP2020")
                                        break
                                }
                            }
                            homeheaderBase.removeChild(avatarLoadingHeadshot)
                            avatarHeadshot = document.createElement("a")
                            avatarHeadshot.setAttribute("href", url+"/users/"+userData.id+"/profile")
                            avatarHeadshot.classList.add("avatar", "avatar-headshot-lg")
                            homeheaderBase.appendChild(avatarHeadshot)
                            avatarThumb = document.createElement("img")
                            avatarThumb.setAttribute("alt", "avatar")
                            avatarThumb.setAttribute("src", userData.avatar.data.imageUrl)
                            avatarThumb.setAttribute("id", "home-avatar-thumb")
                            avatarThumb.classList.add("avatar-card-image")
                            avatarHeadshot.appendChild(avatarThumb)
                            //==========//
                            homeheaderBase.removeChild(headerLoadingcontent)
                            headercontent = document.createElement("div")
                            if (userData.Membership || Settings.homeFormat == "2020") {
                                headercontent.classList.add("home-header-content")
                            } else {
                                headercontent.classList.add("home-header-content", "non-bc")
                            }
                            if (Settings.DeveloperOptions.fix2020homeFormat && Settings.homeFormat == "2020") {
                                headercontent.classList.add("hF2020PositionFix")
                            }
                            homeheaderBase.appendChild(headercontent)
                            homeheader = document.createElement("h1")
                            headercontent.appendChild(homeheader)
                            if (userData.Membership && Settings.homeFormat == "2017") {
                                MembershipTemplate(headercontent)
                            }
                            headerLbl = document.createElement("a")
                            headerLbl.setAttribute("href", url+"/users/"+userData.id+"/profile")
                            headerLbl.textContent = " " + homeGreeting() + ((Settings.DisplayNames) && userData.displayName || userData.name) + (homeGreeting() && "!") + " "
                            homeheader.appendChild(headerLbl)
                            if (userData.Membership && Settings.homeFormat == "2020") {
                                MembershipTemplate(headerLbl)
                            }
                            break
                        case "2021":
                            ` Fully Loaded Template ( Formatted )
                            <div id="home-header" class="col-xs-12 home-header-container">
                                <div class="home-header">
                                    <a class="user-avatar-container avatar avatar-headshot-lg" href="userData.id">
                                        <span class="thumbnail-2d-container avatar-card-image"></span>
                                    </a>
                                    <div class="user-info-container">
                                        <h1 class="user-name-container">
                                            <a class="" href="userData.id">userData.name</a>
                                        </h1>
                                    </div>
                                </div>
                            </div>
                            `
                            if (Settings.JSClasses) {
                                document.body.classList.add("HP2021")
                            }
                            homeheaderBaseSub.removeAttribute("id")
                            homeheaderBaseSub.classList.remove("home-header-shimmer")
                            homeheaderBaseSub.classList.add("home-header")
                            homeheaderBaseSub.removeChild(avatarLoadingHeadshot)
                            avatarHeadshot = document.createElement("a")
                            avatarHeadshot.setAttribute("href", url+"/users/"+userData.id+"/profile")
                            avatarHeadshot.classList.add("thumbnail-2d-container", "avatar", "avatar-headshot-lg")
                            homeheaderBaseSub.appendChild(avatarHeadshot)
                            thumbnail2dcontainer = document.createElement("span")
                            thumbnail2dcontainer.classList.add("thumbnail-2d-container", "avatar-card-image")
                            avatarHeadshot.appendChild(thumbnail2dcontainer)
                            avatarThumb = document.createElement("img")
                            avatarThumb.setAttribute("src", userData.avatar.data.imageUrl)
                            avatarThumb.classList.add("avatar-card-image")
                            thumbnail2dcontainer.appendChild(avatarThumb)
                            //==========//
                            homeheaderBaseSub.removeChild(headerLoadingcontent)
                            headercontent = document.createElement("div")
                            headercontent.classList.add("user-info-container")
                            homeheaderBaseSub.appendChild(headercontent)
                            homeheader = document.createElement("h1")
                            homeheader.classList.add("user-name-container")
                            headercontent.appendChild(homeheader)
                            if (userData.Membership && !Settings.ORHCompatible) {
                                MembershipTemplate(homeheader)
                            }
                            headerLbl = document.createElement("a")
                            headerLbl.setAttribute("href", url+"/users/"+userData.id+"/profile")
                            headerLbl.textContent = " " + homeGreeting() + ((Settings.DisplayNames) && userData.displayName || userData.name) + (homeGreeting() && "!") + " "
                            homeheader.appendChild(headerLbl)
                            break
                        case "2022":
                            ` Fully Loaded Template ( Formatted )
                            <div id="home-header" class="col-xs-12 home-header-container">
                                <div class="home-header">
                                    <a class="user-avatar-container avatar avatar-headshot-lg" href="userData.id">
                                        <span class="thumbnail-2d-container avatar-card-image"></span>
                                    </a>
                                    <div class="home-userinfo-upsell-container">
                                        <div class="user-info-container">
                                            <h1 class="user-name-container">
                                                <a class="" href="userData.id">userData.name</a>
                                            </h1>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            `
                            if (Settings.JSClasses) {
                                document.body.classList.add("HP2022")
                            }
                            homeheaderBaseSub.removeAttribute("id")
                            homeheaderBaseSub.classList.remove("home-header-shimmer")
                            homeheaderBaseSub.classList.add("home-header")
                            homeheaderBaseSub.removeChild(avatarLoadingHeadshot)
                            avatarHeadshot = document.createElement("a")
                            avatarHeadshot.setAttribute("href", url+"/users/"+userData.id+"/profile")
                            avatarHeadshot.classList.add("user-avatar-container", "avatar", "avatar-headshot-lg")
                            homeheaderBaseSub.appendChild(avatarHeadshot)
                            thumbnail2dcontainer = document.createElement("span")
                            thumbnail2dcontainer.classList.add("thumbnail-2d-container", "avatar-card-image")
                            avatarHeadshot.appendChild(thumbnail2dcontainer)
                            avatarThumb = document.createElement("img")
                            avatarThumb.setAttribute("src", userData.avatar.data.imageUrl)
                            avatarThumb.classList.add("avatar-card-image")
                            thumbnail2dcontainer.appendChild(avatarThumb)
                            //==========//
                            homeheaderBaseSub.removeChild(headerLoadingcontent)
                            headeruserinfo = document.createElement("div")
                            headeruserinfo.classList.add("home-userinfo-upsell-container")
                            homeheaderBaseSub.appendChild(headeruserinfo)
                            headercontent = document.createElement("div")
                            headercontent.classList.add("user-info-container")
                            headeruserinfo.appendChild(headercontent)
                            homeheader = document.createElement("h1")
                            homeheader.classList.add("user-name-container")
                            headercontent.appendChild(homeheader)
                            if (userData.Membership) {
                                MembershipTemplate(homeheader)
                            }
                            headerLbl = document.createElement("a")
                            headerLbl.setAttribute("href", url+"/users/"+userData.id+"/profile")
                            headerLbl.textContent = " " + homeGreeting() + ((Settings.DisplayNames) && userData.displayName || userData.name) + (homeGreeting() && "!") + " "
                            homeheader.appendChild(headerLbl)
                            break
                    }
                }
            } else if (!Settings.BulkLoading) {
                if (userData.Status.AvatarDataLoaded && !userData.Status.AvatarDataPaused) {
                    userData.Status.AvatarDataPaused = true
                    switch(Settings.homeFormat) {
                        case "2017":
                        case "2020":
                            if (Settings.JSClasses) {
                                switch (Settings.homeFormat) {
                                    case "2017":
                                        document.body.classList.add("HP2017");
                                        break;
                                    case "2020":
                                        document.body.classList.add("HP2020");
                                        break;
                                }
                            }
                            homeheaderBase.removeChild(avatarLoadingHeadshot)
                            avatarHeadshot = document.createElement("a")
                            avatarHeadshot.setAttribute("href", url+"/users/"+userData.id+"/profile")
                            avatarHeadshot.classList.add("avatar", "avatar-headshot-lg")
                            homeheaderBase.appendChild(avatarHeadshot)
                            if (userData.Status.InfoDataPaused) {
                                homeheaderBase.appendChild(headercontent)
                            }
                            avatarThumb = document.createElement("img")
                            avatarThumb.setAttribute("alt", "avatar")
                            avatarThumb.setAttribute("src", userData.avatar.data.imageUrl)
                            avatarThumb.setAttribute("id", "home-avatar-thumb")
                            avatarThumb.classList.add("avatar-card-image")
                            avatarHeadshot.appendChild(avatarThumb)
                            break
                        case "2021":
                            if (Settings.JSClasses) {
                                document.body.classList.add("HP2021")
                            }
                            homeheaderBaseSub.removeAttribute("id")
                            homeheaderBaseSub.classList.remove("home-header-shimmer")
                            homeheaderBaseSub.classList.add("home-header")
                            homeheaderBaseSub.removeChild(avatarLoadingHeadshot)
                            avatarHeadshot = document.createElement("a")
                            avatarHeadshot.setAttribute("href", url+"/users/"+userData.id+"/profile")
                            avatarHeadshot.classList.add("thumbnail-2d-container", "avatar", "avatar-headshot-lg")
                            homeheaderBaseSub.appendChild(avatarHeadshot)
                            if (userData.Status.InfoDataPaused) {
                                homeheaderBaseSub.appendChild(headercontent)
                            }
                            thumbnail2dcontainer = document.createElement("span")
                            thumbnail2dcontainer.classList.add("thumbnail-2d-container", "avatar-card-image")
                            avatarHeadshot.appendChild(thumbnail2dcontainer)
                            avatarThumb = document.createElement("img")
                            avatarThumb.setAttribute("src", userData.avatar.data.imageUrl)
                            avatarThumb.classList.add("avatar-card-image")
                            thumbnail2dcontainer.appendChild(avatarThumb)
                            break
                        case "2022":
                            if (Settings.JSClasses) {
                                document.body.classList.add("HP2022")
                            }
                            homeheaderBaseSub.removeAttribute("id")
                            homeheaderBaseSub.classList.remove("home-header-shimmer")
                            homeheaderBaseSub.classList.add("home-header")
                            homeheaderBaseSub.removeChild(avatarLoadingHeadshot)
                            avatarHeadshot = document.createElement("a")
                            avatarHeadshot.setAttribute("href", url+"/users/"+userData.id+"/profile")
                            avatarHeadshot.classList.add("user-avatar-container", "avatar", "avatar-headshot-lg")
                            homeheaderBaseSub.appendChild(avatarHeadshot)
                            if (userData.Status.InfoDataPaused) {
                                homeheaderBaseSub.appendChild(headeruserinfo)
                            }
                            thumbnail2dcontainer = document.createElement("span")
                            thumbnail2dcontainer.classList.add("thumbnail-2d-container", "avatar-card-image")
                            avatarHeadshot.appendChild(thumbnail2dcontainer)
                            avatarThumb = document.createElement("img")
                            avatarThumb.setAttribute("src", userData.avatar.data.imageUrl)
                            avatarThumb.classList.add("avatar-card-image")
                            thumbnail2dcontainer.appendChild(avatarThumb)
                    }
                }
                if (userData.Status.InfoDataLoaded && userData.Status.MembershipDataLoaded && !userData.Status.InfoDataPaused && !userData.Status.MembershipDataPaused) {
                    userData.Status.InfoDataPaused = true
                    userData.Status.MembershipDataPaused = true
                    switch(Settings.homeFormat) {
                        case "2017":
                        case "2020":
                            homeheaderBase.removeChild(headerLoadingcontent)
                            headercontent = document.createElement("div")
                            if (userData.Membership || Settings.homeFormat == "2020") {
                                headercontent.classList.add("home-header-content")
                            } else {
                                headercontent.classList.add("home-header-content", "non-bc")
                            }
                            if (Settings.DeveloperOptions.fix2020homeFormat && Settings.homeFormat == "2020") {
                                headercontent.classList.add("hF2020PositionFix")
                            }
                            homeheaderBase.appendChild(headercontent)
                            homeheader = document.createElement("h1")
                            headercontent.appendChild(homeheader)
                            if (userData.Membership && Settings.homeFormat == "2017") {
                                MembershipTemplate(headercontent)
                            }
                            headerLbl = document.createElement("a")
                            headerLbl.setAttribute("href", url+"/users/"+userData.id+"/profile")
                            headerLbl.textContent = " " + homeGreeting() + ((Settings.DisplayNames) && userData.displayName || userData.name) + (homeGreeting() && "!") + " "
                            homeheader.appendChild(headerLbl)
                            if (userData.Membership && Settings.homeFormat == "2020") {
                                MembershipTemplate(headerLbl)
                            }
                            break
                        case "2021":
                            homeheaderBaseSub.removeChild(headerLoadingcontent)
                            headercontent = document.createElement("div")
                            headercontent.classList.add("user-info-container")
                            homeheaderBaseSub.appendChild(headercontent)
                            homeheader = document.createElement("h1")
                            homeheader.classList.add("user-name-container")
                            headercontent.appendChild(homeheader)
                            if (userData.Membership && !Settings.ORHCompatible) {
                                MembershipTemplate(homeheader)
                            }
                            headerLbl = document.createElement("a")
                            headerLbl.setAttribute("href", url+"/users/"+userData.id+"/profile")
                            headerLbl.textContent = " " + homeGreeting() + ((Settings.DisplayNames) && userData.displayName || userData.name) + (homeGreeting() && "!") + " "
                            homeheader.appendChild(headerLbl)
                            break
                        case "2022":
                            homeheaderBaseSub.removeChild(headerLoadingcontent)
                            headeruserinfo = document.createElement("div")
                            headeruserinfo.classList.add("home-userinfo-upsell-container")
                            homeheaderBaseSub.appendChild(headeruserinfo)
                            headercontent = document.createElement("div")
                            headercontent.classList.add("user-info-container")
                            headeruserinfo.appendChild(headercontent)
                            homeheader = document.createElement("h1")
                            homeheader.classList.add("user-name-container")
                            headercontent.appendChild(homeheader)
                            if (userData.Membership) {
                                MembershipTemplate(homeheader)
                            }
                            headerLbl = document.createElement("a")
                            headerLbl.setAttribute("href", url+"/users/"+userData.id+"/profile")
                            headerLbl.textContent = " " + homeGreeting() + ((Settings.DisplayNames) && userData.displayName || userData.name) + (homeGreeting() && "!") + " "
                            homeheader.appendChild(headerLbl)
                            break
                    }
                }
            }
        }
        if (Settings.homeavatarPresences && userData.Status.InfoDataLoaded) {
            function userPresenceTemplate(parentElement) {
                if (PresenceDiv) {
                    PresenceSpan.classList.remove(PresenceStatus)
                    PresenceStatus = userData.userPresences.userPresenceType === 1 && "icon-online" || userData.userPresences.userPresenceType === 2 && "icon-game" || userData.userPresences.userPresenceType === 3 && "icon-studio"
                    PresenceSpan.classList.add(PresenceStatus)
                    PresenceSpan.setAttribute("title", userData.userPresences.lastLocation)
                } else {
                    PresenceDiv = document.createElement("div")
                    PresenceDiv.setAttribute("ng-non-bindable", "")
                    parentElement.appendChild(PresenceDiv)
                    PresenceSpan = document.createElement("span")
                    PresenceDiv.appendChild(PresenceSpan)
                    PresenceStatus = userData.userPresences.userPresenceType === 1 && "icon-online" || userData.userPresences.userPresenceType === 2 && "icon-game" || userData.userPresences.userPresenceType === 3 && "icon-studio"
                    PresenceSpan.classList.add("avatar-status", PresenceStatus)
                    PresenceSpan.setAttribute("title", userData.userPresences.lastLocation)
                }
            }
            GM_xmlhttpRequest({
                method: 'POST',
                url: "https://Presence.roblox.com/v1/Presence/users",
                headers: {
                    'accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                data: JSON.stringify(
                    {
                        userIds: [
                            userData.id
                        ]
                    }
                ),
                onload: function (response) {
                    userData.userPresences.Response = JSON.parse(response.responseText).userPresences[0];
                    userData.userPresences.gameId = userData.userPresences.Response.gameId;
                    userData.userPresences.invisibleModeExpiry = userData.userPresences.Response.invisibleModeExpiry;
                    userData.userPresences.lastLocation = userData.userPresences.Response.lastLocation;
                    userData.userPresences.lastOnline = userData.userPresences.Response.lastOnline;
                    userData.userPresences.placeId = userData.userPresences.Response.placeId;
                    userData.userPresences.rootPlaceId = userData.userPresences.Response.rootPlaceId;
                    userData.userPresences.userPresenceType = userData.userPresences.Response.userPresenceType;
                    userData.userPresences.universeId = userData.userPresences.Response.universeId;
                },
                onerror: function (error) {
                    userData.userPresences.Errored = true
                }
            });
            if (userData.userPresences.userLastPresenceType !== userData.userPresences.userPresenceType && userData.userPresences.userPresenceType === 0) {
                userData.userPresences.userLastPresenceType = userData.userPresences.userPresenceType;
                PresenceDiv = null;
            } else if (userData.userPresences.userLastPresenceType !== userData.userPresences.userPresenceType && userData.userPresences.userPresenceType !== 0) {
                userData.userPresences.userLastPresenceType = userData.userPresences.userPresenceType;
                userPresenceTemplate(avatarHeadshot);
            }
        }
    }, 62.5)
    setTimeout(function() {
        if (!userData.Status.AvatarDataLoaded) {
            avatarLoadingHeadshot.classList.remove("shimmer")
            var avatariconbroken = document.createElement("thumbnail-2d")
            avatariconbroken.classList.add("avatar-headshot-lg", "icon-broken")
            avatarLoadingHeadshot.appendChild(avatariconbroken)
        }
    }, 8000)
}