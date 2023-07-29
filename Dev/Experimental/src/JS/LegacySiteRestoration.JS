// ==UserScript==
// @name         Legacy Site Restoration
// @namespace    userstyles.world/user/tersiswilvin
// @version      1.2.0
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
    BulkLoading: false, /*/ Loads everything at once then in chunks /*/
    CustomEvents: false, /*/ Uses your custom events then Roblox events. /*/
    DeveloperOptions: {
        demoMode: false,
        forceMembership: false,
        forceinfLoading: false,
        fix2020homeFormat: false,
    },
    DisplayNames: false, /*/ Swaps usernames with displaynames on the home header /*/
    FavIcon: "2018L", /*/ {"2012M", "2015L", "2017E", "2017L", "2018L"} /*/
    homeGreeting: true,
    homeGreetingType: "Hello", /*/ {"Dynamic", "Hello", "Welcome"} /*/
    homeFormat: "2017", /*/ {"2017", "2020", "2021", "2022"} (Warning: If you use RoPro please use "2017" or "2020" as anything later breaks most played.) /*/
    homeavatarPresences: false, /*/ Adds the status icon to your home header avatar /*/
    JSClasses: true, /*/ Adds classes for options for those working with themes or extentions. /*/
    MembershipType: "OBC", /*/ {"BC", "TBC", "OBC", "Premium"} /*/
    ORHCompatible: false, /*/ if true will use aubymori Old Roblox Header for legacy theme compatibility, requires homeFormat to be 2021. /*/
    RestoreLegacyFavIcon: true,
    RestoreEvents: true,
    RestoreHomePage: true,
    RestoreMyFeed: true,
    RestoreUpgradeNow: true,
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
.home-header-content.hF2020PositionFix h1 {
    margin: 56px 0 12px;
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
    .home-header-content.hF2020PositionFix h1 {
        margin: 42px 0 12px;
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
    .home-header-content.hF2020PositionFix h1 {
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
    try {
        var link = document.head.querySelector("link[rel*='icon']")
        switch(Settings.FavIcon) {
            case "2012M":
                link.href = "data:image/x-icon;base64,AAABAAEAEBAAAAAAIABoBAAAFgAAACgAAAAQAAAAIAAAAAEAIAAAAAAAQAQAAAAAAAAAAAAAAAAAAAAAAAA7KeYAY0vbAVxE3QWAT80Hw3q9BwAA/wCqfb4A3KWwBl1C38VdP9Zy/+2eEv//TAAAAPUAKB3wAEYy5gD/5p0AUjrgAGlQ2QA7K+cAjlbIALJsvwBwVdIIbFPZHlM73FIgHvj/Kyr5/xYS9vAjFu3RHxPtpDMm7X1IN+No/8ioLGhN2wB7XtYUSDTgTWBL4mx0WuiTQTbs2FI83544LOzEysr+/vz9/vrT1P3/wsP+/3J0/f8TDvb/PC3qvDYl7SIiEOYASjLbbTIu9f/d3P3/6+3//z48+f00Hd+5kpP8//////37+v7+////+b/B//9DOfDqYU7aWVE95QBMN+cAEAHlADwl22tGRPf9////9dHT//s1JuflVUfr6uvt//7///79////+5WW/f83KOnTPSTiKl1G3wBTPuABAAD/AQEA6QAmEuBsWFb4/v39/vmfn/z+OSLc96Ce+v3///7+/////oSE/P9CLeO5ak/XDEUv5wCygsQCQjLmAXhb0gAAAOwAEgPkanJx+f/////6VU7y/Tgq6P/p7P/+9PX+/HNw+Po+ItuSMiHhCGxcxRc4JeMs/9mwB0w54gBMOeIBAADzAC8a4YeIh/r/////+nl5+f6nqPz9///+/o6P/P8lIPH2WUnrvTMu9tM7NvTtJiP2+jUl4qYuJO0IKh/uAgAA+wAhEeqSmZn8//////n///////////////z///79+Pn//+fp///o6P7/7u///+Pk//1maPv/OSznsg4L+wAAAP4AKRvmq6Wm/P/////7bm35+VRP9vqMifv/vb7+//z8/v7///78///+/f7+/f7////6lpb8/DQh5MQCAPcAAAD/AC8h57m3t/z//////11V8tjHs90qNCDZXgwA6LuYmPz+/v7//Pn5/f79/f7+/v7++UtI9v9fPNN0US/VAAME/gAfFu60v7/9/v7+/vtZVPT4QDHiw0lB8MJNSPTqxcX8/v7+/v76+v7+///+/ePl//01K+371KWmLduvmQAAAP8LHhn1ydrb//7////45+j++9vc///s7f////////////z+/v799/f9/vv7//ykpv7/MyLkzk1U2gEDB/YB/+mUQUIz6eB+evb7qKX6/7++/P/R0f7/5+f//+7v///3+P///////////v/////7Y2H4/00w2YMKAvIAMSPvBt2ixgvjtq4oKQTEKUIe50YjE+VuPy7njk9D7K5US/DFYlv31Xd0+OSDgPn0dXX7/C8l7/25h705nnHGAIRh1QPurr4As4zBABgAzwApGeQAFAvvAAAA/wAeMf8AJJn/AAAAAAwAAMQuMQ/TfB8K4NQxD9N8/8uoGOCpuQDDkL0B/z8AAP8BAADgAQAAgAcAAIAPAACAHwAAgD8AAIADAACAAQAAgAEAAIYBAACAAwAAgAMAAIADAADwBwAA/8cAAA=="
                break
            case "2015L":
                link.href = "http://images.rbxcdn.com/7aee41db80c1071f60377c3575a0ed87.ico"
                break
            case "2017E":
                link.href = "https://images.rbxcdn.com/2bb82200dbc00ef3d000c5cf2c8f457b.ico"
                break
            case "2017L":
                link.href = "https://images.rbxcdn.com/1387da00c070fd34110985aee87f3155.ico.gzip"
                break
            case "2018L":
                link.href = "https://images.rbxcdn.com/23421382939a9f4ae8bbe60dbe2a3e7e.ico.gzip"
                break
        }
    } catch {
    }
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
});

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
}