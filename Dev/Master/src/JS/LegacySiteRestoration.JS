// ==UserScript==
// @name         Legacy Site Restoration
// @namespace    userstyles.world/user/tersiswilvin
// @version      1.2.7.1
// @description  Restores Legacy Site elements back on Roblox.
// @author       TersisWilvin
// @match        *.roblox.com*
// @match        *.roblox.com/*
// @icon         https://images.rbxcdn.com/23421382939a9f4ae8bbe60dbe2a3e7e.ico.gzip
// @updateURL    https://raw.githubusercontent.com/tersiswilvin/Roblox-2019-Old-Theme/Release/Dev/Master/src/JS/LegacySiteRestoration.JS
// @downloadURL  https://raw.githubusercontent.com/tersiswilvin/Roblox-2019-Old-Theme/Release/Dev/Master/src/JS/LegacySiteRestoration.JS
// @grant        GM_xmlhttpRequest
// @run-at       document-start
// ==/UserScript==

/*/== Variables ==/*/

var url = window.location.protocol+"//"+window.location.hostname

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
    Global: {
        CustomEvents: false, /*/ (Configurable => Events.CustomEvents) Uses your custom events then Roblox events. /*/
        DevForumFavIcon: "Modern", /*/ {"2015L", "2018M"} /*/
        DevForumFavTitle: "2017M", /*/ {"2015L", "2017M"} /*/
        RobloxFavIcon: "2018L", /*/ {"2012M", "2015L", "2017E", "2017L", "2018L"} /*/
        RestoreLegacyFavIcon: true, /*/ (Configurable => Global.RobloxFavIcon) Replaces the favicon in your browser to what year is set. /*/
        RestoreLegacyFavTitle: false,
        RestoreEvents: true, /*/ Brings back events in the sidebar, used along customevents. /*/
        // RestoreForums: false, /*/ Restores Forums on the sidebar and page ( ! ) /*/
        RestoreMyFeed: true, /*/ Restores My Feed on the sidebar and page /*/
        RestoreUpgradeNow: true, /*/ Replaces "Get Premium" to "Upgrade Now" /*/
        JSClasses: true, /*/ Adds classes to the body for certain options that are enabled for themes/extentions. /*/
    },
    Pages: {
        DeveloperOptions: {
            demoMode: false,
            demoPreference: 1, /*/ {[1]: "Roblox", [2]: "OnlyTwentyCharacters"} /*/
            disablebrokenicon: false,
            forceinfLoading: {
                Enabled: false, /*/ When true is the same effect as enabling info, membership, and thumbnail infinite loading /*/
                info: false,
                membership: false,
                thumbnail: false,
            },
            forceMembership: false,
            fix2020homeFormat: false,
        },
        Forums: {
            /*/ Coming Soon /*/
        },
        home: {
            avatarPresences: false, /*/ Adds the status icon to your home header avatar /*/
            BulkLoading: false, /*/ Loads everything at once then in chunks (may be slower) /*/
            DisplayNames: false, /*/ (2021+) Swaps usernames with displaynames /*/
            Format: "2017", /*/ {"2017", "2020", "2021", "2022"} (Warning: If you use RoPro please use "2017" or "2020" as anything later breaks most played.) /*/
            Greeting: true, /*/ (Configurable => Pages.home.GreetingType) Adds the Greeting back to the homepage, requires RestoreHomePage to be enabled. (This was eventually removed in 2021+) /*/
            GreetingType: "Hello", /*/ {"Dynamic", "Hello", "Welcome"} /*/
            MembershipType: "OBC", /*/ (2017){"BC", "TBC", "OBC"} (2020 - 2022){"Premium"} /*/
        },
        MyFeeds: {
            enablePosting: true, /*/ Currently not functional, however adds the input field and post button back on the page /*/
            entirecardislink: false, /*/ makes the entire game card into a clickable link instead of the title /*/
            GamestoExperience: false, /*/ Swaps Game(s) text to Experience(s) /*/
            CatalogtoAvatarShop: false, /*/ Swaps Catalog to Avatar Shop /*/
            enableforumlistItem: false, /*/ Enables the last list item for forums /*/
            ModernFormat: true, /*/ Uses 2021/2022 HTML then the 2018 HTML originally used /*/
        },
        ORHCompatible: false, /*/ (2021) Swaps CSS to use aubymori Old Roblox Header for legacy theme compatibility. /*/
        RestoreHomePage: true, /*/ (Configurable => Pages.home.Format) Brings back the username and user avatar back on the home page /*/
    },
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
    if (Settings.Pages.home.Greeting) {
        if (Settings.Pages.home.GreetingType == "Dynamic" || Settings.Pages.home.GreetingType == "Hello" || Settings.Pages.home.GreetingType == "Welcome") {
            const hours = new Date().getHours()
            return ((Settings.Pages.home.GreetingType == "Dynamic" && (hours < 5 ? "Night" : hours < 12 ? "Morning" : hours < 18 ? "Afternoon" : "Evening") || Settings.Pages.home.GreetingType) + ", ")
        } else {
            return "Hello, "
        }
    } else {
        return ""
    }
}
function insertAfter(NewElement, ExistingElement) {
    ExistingElement.parentNode.insertBefore(NewElement, ExistingElement.nextSibling)
}
function MembershipTemplate(parentElement) {
    var membershipiconcontainer, membershipicon
    switch(Settings.Pages.home.MembershipType) {
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
            switch(Settings.Pages.home.Format) {
                case "2020":
                    membershipicon = document.createElement("span")
                    membershipicon.classList.add("medium-icon", "icon-premium-medium")
                    parentElement.parentNode.insertBefore(membershipicon, parentElement)
                    membershipicon = document.createElement("span")
                    membershipicon.classList.add("small-icon", "icon-premium-small")
                    parentElement.parentNode.insertBefore(membershipicon, parentElement)
                    break
                case "2021":
                case "2022":
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
function SideBarItem(URL, Id, iconClass, text, parentChild, InsertAfter) {
    const itemlistBase = document.createElement("li")
    if (InsertAfter) {
        insertAfter(itemlistBase, parentChild)
    } else {
        parentChild.appendChild(itemlistBase)
    }
    const itemnavtext = document.createElement("a")
    itemnavtext.classList.add("dynamic-overflow-container", "text-nav")
    itemnavtext.setAttribute("href", URL)
    itemnavtext.setAttribute("id", Id)
    itemnavtext.setAttribute("target", "_self")
    itemlistBase.appendChild(itemnavtext)
    const itemdiv = document.createElement("div")
    itemnavtext.appendChild(itemdiv)
    const itemicon = document.createElement("span")
    itemicon.classList.add(iconClass)
    itemdiv.appendChild(itemicon)
    const itemfontheader = document.createElement("span")
    itemfontheader.classList.add("font-header-2", "dynamic-ellipsis-item")
    itemfontheader.textContent = text
    itemnavtext.appendChild(itemfontheader)
}
function StyleSheet() {
    switch(Settings.Pages.home.Format) {
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
            if (Settings.Pages.home.ORHCompatible) {
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

if (Settings.Pages.home.MembershipType == "Premium" && (Settings.Pages.home.Format == "2017")) {
    Settings.Pages.home.Format = "2020"
} else if ((Settings.Pages.home.MembershipType == "BC" || Settings.Pages.home.MembershipType == "TBC" || Settings.Pages.home.MembershipType == "OBC") && (Settings.Pages.home.Format == "2020" || Settings.Pages.home.Format == "2021" || Settings.Pages.home.Format == "2022")) {
    Settings.Pages.home.Format = "2017"
}

async function waitForElm(q) {
    while (document.querySelector(q) == null) {
        await new Promise(r => requestAnimationFrame(r));
    };
    return document.querySelector(q);
}

if (Settings.Global.RestoreLegacyFavIcon) {
    waitForElm("link[rel*='icon']").then(async (hdrSec) => {
        if (url == "https://devforum.roblox.com") {
            switch(Settings.Global.DevForumFavIcon) {
                case "2015L":
                    hdrSec.href = "data:image/png;base64,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"
                    break
                case "2018M":
                    hdrSec.href = "data:image/png;base64,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"
            }
        } else {
            switch(Settings.Global.RobloxFavIcon) {
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
        }
    })
}
if (Settings.Global.RestoreLegacyFavTitle) {
    var titlename = document.title
    titlename = titlename.replace("Roblox", "ROBLOX")
    document.title = titlename
}

waitForElm(".left-col-list").then(async (hdrSec) => {
    const navgroup = document.getElementById("nav-group")
    if (Settings.Global.RestoreMyFeed) {
        if (Settings.Global.JSClasses) {
            document.body.classList.add("MyFeedEnabled")
        }
        SideBarItem(url+"/feeds/", "nav-my-feed", "icon-nav-my-feed", "My Feed", navgroup.parentElement, true)
    }
    if (Settings.Global.RestoreForums) {
        function StyleFix() {
            return `
.icon-nav-forum {
    background-image: url(data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4NCjwhLS0gR2VuZXJhdG9yOiBBZG9iZSBJbGx1c3RyYXRvciAxOS4xLjAsIFNWRyBFeHBvcnQgUGx1Zy1JbiAuIFNWRyBWZXJzaW9uOiA2LjAwIEJ1aWxkIDApICAtLT4NCjwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCI+DQo8c3ZnIHZlcnNpb249IjEuMSIgaWQ9Im5hdmlnYXRpb24iIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHg9IjBweCIgeT0iMHB4Ig0KCSB3aWR0aD0iNTZweCIgaGVpZ2h0PSI0NzZweCIgdmlld0JveD0iMCAwIDU2IDQ3NiIgc3R5bGU9ImVuYWJsZS1iYWNrZ3JvdW5kOm5ldyAwIDAgNTYgNDc2OyIgeG1sOnNwYWNlPSJwcmVzZXJ2ZSI+DQo8c3R5bGUgdHlwZT0idGV4dC9jc3MiPg0KCS5zdDB7ZmlsbDojMDBBMkZGO30NCgkuc3Qxe2ZpbGw6IzE5MTkxOTt9DQoJLnN0MntmaWxsOiMwMkI3NTc7fQ0KCS5zdDN7ZmlsbDojRjY4ODAyO30NCgkuc3Q0e2ZpbGw6I0ZGRkZGRjt9DQo8L3N0eWxlPg0KPHBhdGggaWQ9InNob3Atb24iIGNsYXNzPSJzdDAiIGQ9Ik01MCw0NTcuOWMwLTAuNS0wLjUtMC45LTEtMC45aC0ydi0yYzAtMi44LTIuMi01LTUtNXMtNSwyLjItNSw1djJoLTJjLTAuNSwwLTEsMC40LTEsMC45bC0xLDE1DQoJYzAsMC4zLDAuMSwwLjUsMC4zLDAuOGMwLjIsMC4yLDAuNSwwLjMsMC43LDAuM2gxNmMwLjMsMCwwLjUtMC4xLDAuNy0wLjNjMC4yLTAuMiwwLjMtMC41LDAuMy0wLjhMNTAsNDU3Ljl6IE0zOSw0NTUNCgljMC0xLjcsMS4zLTMsMy0zczMsMS4zLDMsM3YyaC02VjQ1NXogTTM1LjEsNDcybDAuOS0xM2gxdjJjMCwwLjYsMC40LDEsMSwxczEtMC40LDEtMXYtMmg2djJjMCwwLjYsMC40LDEsMSwxczEtMC40LDEtMXYtMmgxLjENCglsMC45LDEzSDM1LjF6Ii8+DQo8cGF0aCBpZD0ic2hvcCIgY2xhc3M9InN0MSIgZD0iTTIyLDQ1Ny45YzAtMC41LTAuNS0wLjktMS0wLjloLTJ2LTJjMC0yLjgtMi4yLTUtNS01cy01LDIuMi01LDV2Mkg3Yy0wLjUsMC0xLDAuNC0xLDAuOWwtMSwxNQ0KCWMwLDAuMywwLjEsMC41LDAuMywwLjhjMC4yLDAuMiwwLjUsMC4zLDAuNywwLjNoMTZjMC4zLDAsMC41LTAuMSwwLjctMC4zYzAuMi0wLjIsMC4zLTAuNSwwLjMtMC44TDIyLDQ1Ny45eiBNMTEsNDU1DQoJYzAtMS43LDEuMy0zLDMtM3MzLDEuMywzLDN2MmgtNlY0NTV6IE03LjEsNDcyTDgsNDU5aDF2MmMwLDAuNiwwLjQsMSwxLDFzMS0wLjQsMS0xdi0yaDZ2MmMwLDAuNiwwLjQsMSwxLDFzMS0wLjQsMS0xdi0yaDEuMQ0KCWwwLjksMTNINy4xeiIvPg0KPGcgaWQ9ImJsb2ctb25fMV8iPg0KCTxnPg0KCQk8cGF0aCBjbGFzcz0ic3QwIiBkPSJNNTEsNDE2Yy0wLjEsMC0wLjMsMC0wLjQtMC4xTDM2LjgsNDEwaC0xLjZsLTEuOCwwLjljLTAuMywwLjItMC43LDAuMS0xLDBjLTAuMy0wLjItMC41LTAuNS0wLjUtMC45di03DQoJCQljMC0wLjMsMC4yLTAuNywwLjUtMC45czAuNy0wLjIsMSwwbDEuOCwwLjloMS41bDEzLjgtNi45YzAuMy0wLjIsMC43LTAuMSwxLDBjMC4zLDAuMiwwLjUsMC41LDAuNSwwLjl2MThjMCwwLjMtMC4yLDAuNi0wLjQsMC44DQoJCQlDNTEuNCw0MTUuOSw1MS4yLDQxNiw1MSw0MTZ6IE0zNSw0MDhoMmMwLjEsMCwwLjMsMCwwLjQsMC4xbDEyLjYsNS40di0xNC45bC0xMi42LDYuM2MtMC4xLDAuMS0wLjMsMC4xLTAuNCwwLjFoLTINCgkJCWMtMC4yLDAtMC4zLDAtMC40LTAuMWwtMC42LTAuM3YzLjhsMC42LTAuM0MzNC43LDQwOCwzNC44LDQwOCwzNSw0MDh6Ii8+DQoJPC9nPg0KCTxnPg0KCQk8cGF0aCBjbGFzcz0ic3QwIiBkPSJNNDIsNDE3Yy0wLjEsMC0wLjMsMC0wLjQtMC4xbC02LTNjLTAuMy0wLjItMC42LTAuNS0wLjYtMC45di0zYzAtMC42LDAuNC0xLDEtMXMxLDAuNCwxLDF2Mi40bDQuNiwyLjMNCgkJCWwxLjYtMy4xYzAuMi0wLjUsMC44LTAuNywxLjMtMC40YzAuNSwwLjIsMC43LDAuOCwwLjQsMS4zbC0yLDRDNDIuNyw0MTYuOCw0Mi40LDQxNyw0Miw0MTd6Ii8+DQoJPC9nPg0KPC9nPg0KPGcgaWQ9ImJsb2dfM18iPg0KCTxnPg0KCQk8cGF0aCBjbGFzcz0ic3QxIiBkPSJNMjMsNDE2Yy0wLjEsMC0wLjMsMC0wLjQtMC4xTDguOCw0MTBINy4ybC0xLjgsMC45Yy0wLjMsMC4yLTAuNywwLjEtMSwwQzQuMiw0MTAuNyw0LDQxMC4zLDQsNDEwdi03DQoJCQljMC0wLjMsMC4yLTAuNywwLjUtMC45czAuNy0wLjIsMSwwbDEuOCwwLjloMS41bDEzLjgtNi45YzAuMy0wLjIsMC43LTAuMSwxLDBjMC4zLDAuMiwwLjUsMC41LDAuNSwwLjl2MThjMCwwLjMtMC4yLDAuNi0wLjQsMC44DQoJCQlDMjMuNCw0MTUuOSwyMy4yLDQxNiwyMyw0MTZ6IE03LDQwOGgyYzAuMSwwLDAuMywwLDAuNCwwLjFsMTIuNiw1LjR2LTE0LjlsLTEyLjYsNi4zQzkuMyw0MDUsOS4yLDQwNSw5LDQwNUg3DQoJCQljLTAuMiwwLTAuMywwLTAuNC0wLjFMNiw0MDQuNnYzLjhsMC42LTAuM0M2LjcsNDA4LDYuOCw0MDgsNyw0MDh6Ii8+DQoJPC9nPg0KCTxnPg0KCQk8cGF0aCBjbGFzcz0ic3QxIiBkPSJNMTQsNDE3Yy0wLjEsMC0wLjMsMC0wLjQtMC4xbC02LTNDNy4yLDQxMy43LDcsNDEzLjQsNyw0MTN2LTNjMC0wLjYsMC40LTEsMS0xczEsMC40LDEsMXYyLjRsNC42LDIuMw0KCQkJbDEuNi0zLjFjMC4yLTAuNSwwLjgtMC43LDEuMy0wLjRjMC41LDAuMiwwLjcsMC44LDAuNCwxLjNsLTIsNEMxNC43LDQxNi44LDE0LjQsNDE3LDE0LDQxN3oiLz4NCgk8L2c+DQo8L2c+DQo8ZyBpZD0iZm9ydW0tb25fMV8iPg0KCTxnPg0KCQk8cGF0aCBjbGFzcz0ic3QwIiBkPSJNNDYsMzg4Yy0wLjEsMC0wLjMsMC0wLjQtMC4xYy0wLjQtMC4yLTAuNi0wLjUtMC42LTAuOXYtMmgtMmMtMC42LDAtMS0wLjQtMS0xczAuNC0xLDEtMWgzYzAuNiwwLDEsMC40LDEsMQ0KCQkJdjAuOWwyLTEuNmMwLjItMC4xLDAuNC0wLjIsMC42LTAuMkg1MnYtNWgtMWMtMC42LDAtMS0wLjQtMS0xYzAtMC42LDAuNC0xLDEtMWgyYzAuNiwwLDEsMC40LDEsMXY3YzAsMC42LTAuNCwxLTEsMWgtM2wtMy4zLDIuOA0KCQkJQzQ2LjUsMzg3LjksNDYuMiwzODgsNDYsMzg4eiIvPg0KCTwvZz4NCgk8Zz4NCgkJPHBhdGggY2xhc3M9InN0MCIgZD0iTTM5LDM4N2MtMC4zLDAtMC41LTAuMS0wLjctMC4zbC00LjctNC43SDMxYy0wLjYsMC0xLTAuNC0xLTF2LTEyYzAtMC42LDAuNC0xLDEtMWgxN2MwLjYsMCwxLDAuNCwxLDF2MTINCgkJCWMwLDAuNi0wLjQsMS0xLDFoLTh2NGMwLDAuNC0wLjIsMC44LTAuNiwwLjlDMzkuMywzODcsMzkuMSwzODcsMzksMzg3eiBNMzIsMzgwaDJjMC4zLDAsMC41LDAuMSwwLjcsMC4zbDMuMywzLjNWMzgxDQoJCQljMC0wLjYsMC40LTEsMS0xaDh2LTEwSDMyVjM4MHoiLz4NCgk8L2c+DQo8L2c+DQo8ZyBpZD0iZm9ydW1fM18iPg0KCTxnPg0KCQk8cGF0aCBjbGFzcz0ic3QxIiBkPSJNMTgsMzg4Yy0wLjEsMC0wLjMsMC0wLjQtMC4xYy0wLjQtMC4yLTAuNi0wLjUtMC42LTAuOXYtMmgtMmMtMC42LDAtMS0wLjQtMS0xczAuNC0xLDEtMWgzYzAuNiwwLDEsMC40LDEsMQ0KCQkJdjAuOWwyLTEuNmMwLjItMC4xLDAuNC0wLjIsMC42LTAuMkgyNHYtNWgtMWMtMC42LDAtMS0wLjQtMS0xYzAtMC42LDAuNC0xLDEtMWgyYzAuNiwwLDEsMC40LDEsMXY3YzAsMC42LTAuNCwxLTEsMWgtM2wtMy4zLDIuOA0KCQkJQzE4LjUsMzg3LjksMTguMiwzODgsMTgsMzg4eiIvPg0KCTwvZz4NCgk8Zz4NCgkJPHBhdGggY2xhc3M9InN0MSIgZD0iTTExLDM4N2MtMC4zLDAtMC41LTAuMS0wLjctMC4zTDUuNiwzODJIM2MtMC42LDAtMS0wLjQtMS0xdi0xMmMwLTAuNiwwLjQtMSwxLTFoMTdjMC42LDAsMSwwLjQsMSwxdjEyDQoJCQljMCwwLjYtMC40LDEtMSwxaC04djRjMCwwLjQtMC4yLDAuOC0wLjYsMC45QzExLjMsMzg3LDExLjEsMzg3LDExLDM4N3ogTTQsMzgwaDJjMC4zLDAsMC41LDAuMSwwLjcsMC4zbDMuMywzLjNWMzgxDQoJCQljMC0wLjYsMC40LTEsMS0xaDh2LTEwSDRWMzgweiIvPg0KCTwvZz4NCjwvZz4NCjxnIGlkPSJncm91cC1vbl8xXyI+DQoJPGc+DQoJCTxwYXRoIGNsYXNzPSJzdDAiIGQ9Ik00MiwzNTBjLTIuOCwwLTUtMi4yLTUtNXMyLjItNSw1LTVzNSwyLjIsNSw1UzQ0LjgsMzUwLDQyLDM1MHogTTQyLDM0MmMtMS43LDAtMywxLjMtMywzczEuMywzLDMsMw0KCQkJczMtMS4zLDMtM1M0My43LDM0Miw0MiwzNDJ6Ii8+DQoJPC9nPg0KCTxnPg0KCQk8cGF0aCBjbGFzcz0ic3QwIiBkPSJNNDIsMzYxYy00LjIsMC02LjYtMi4yLTYuNy0yLjNjLTAuMi0wLjItMC4zLTAuNS0wLjMtMC44YzAuMS0xLjcsMC40LTQuNywxLjMtNS43czMuOS0xLjIsNS43LTEuM2gwLjENCgkJCWMxLjcsMC4xLDQuNywwLjQsNS43LDEuM2MxLDAuOSwxLjIsMy45LDEuMyw1LjdjMCwwLjMtMC4xLDAuNi0wLjMsMC44QzQ4LjYsMzU4LjgsNDYuMiwzNjEsNDIsMzYxeiBNMzcsMzU3LjUNCgkJCWMwLjcsMC41LDIuNCwxLjUsNSwxLjVzNC4zLTEsNS0xLjVjLTAuMS0xLjgtMC40LTMuNS0wLjctMy45Yy0wLjMtMC4yLTIuNC0wLjYtNC4zLTAuN2MtMS45LDAuMS0zLjksMC40LTQuMywwLjcNCgkJCUMzNy41LDM1NCwzNy4yLDM1NS44LDM3LDM1Ny41eiIvPg0KCTwvZz4NCgk8Zz4NCgkJPGc+DQoJCQk8cGF0aCBjbGFzcz0ic3QwIiBkPSJNMzYsMzUxYy0yLjIsMC00LTEuOC00LTRjMC0xLjcsMS4xLTMuMiwyLjctMy44YzAuNS0wLjIsMS4xLDAuMSwxLjMsMC42cy0wLjEsMS4xLTAuNiwxLjMNCgkJCQljLTAuOCwwLjMtMS4zLDEtMS4zLDEuOWMwLDEuMSwwLjksMiwyLDJjMC42LDAsMSwwLjQsMSwxUzM2LjYsMzUxLDM2LDM1MXoiLz4NCgkJPC9nPg0KCQk8Zz4NCgkJCTxwYXRoIGNsYXNzPSJzdDAiIGQ9Ik0zMywzNThjLTAuMSwwLTAuMSwwLTAuMiwwYy0xLjMtMC4zLTIuMy0xLjEtMi40LTEuMmMtMC4zLTAuMi0wLjQtMC42LTAuMy0xYzAuMy0xLjQsMC44LTMuOSwxLjYtNC42DQoJCQkJYzAuNC0wLjQsMy4zLTIsNC4yLTIuMmMwLjUtMC4xLDEuMSwwLjMsMS4yLDAuOHMtMC4zLDEuMS0wLjgsMS4ycy0yLjgsMS4zLTMuMiwxLjdjLTAuMiwwLjItMC42LDEuNS0wLjksMi45DQoJCQkJYzAuMywwLjIsMC43LDAuNCwxLjEsMC41YzAuNSwwLjEsMC45LDAuNiwwLjgsMS4yQzMzLjksMzU3LjcsMzMuNSwzNTgsMzMsMzU4eiIvPg0KCQk8L2c+DQoJCTxnPg0KCQkJPHBhdGggY2xhc3M9InN0MCIgZD0iTTQ4LDM1MWMtMC42LDAtMS0wLjQtMS0xczAuNC0xLDEtMWMxLjEsMCwyLTAuOSwyLTJjMC0wLjgtMC41LTEuNi0xLjMtMS45Yy0wLjUtMC4yLTAuOC0wLjgtMC42LTEuMw0KCQkJCXMwLjgtMC44LDEuMy0wLjZjMS42LDAuNiwyLjcsMi4xLDIuNywzLjhDNTIsMzQ5LjIsNTAuMiwzNTEsNDgsMzUxeiIvPg0KCQk8L2c+DQoJCTxnPg0KCQkJPHBhdGggY2xhc3M9InN0MCIgZD0iTTUxLDM1OGMtMC41LDAtMC45LTAuMy0xLTAuOHMwLjItMS4xLDAuOC0xLjJjMC40LTAuMSwwLjgtMC4zLDEuMS0wLjVjLTAuMy0xLjQtMC43LTIuNy0wLjktMw0KCQkJCWMtMC40LTAuMy0yLjYtMS41LTMuMS0xLjZzLTAuOS0wLjYtMC44LTEuMmMwLjEtMC41LDAuNi0wLjksMS4xLTAuOGMwLjksMC4yLDMuOCwxLjgsNC4yLDIuMmMwLjgsMC44LDEuMywzLjIsMS42LDQuNg0KCQkJCWMwLjEsMC40LTAuMSwwLjctMC4zLDFjLTAuMSwwLjEtMS4xLDAuOS0yLjQsMS4yQzUxLjEsMzU4LDUxLjEsMzU4LDUxLDM1OHoiLz4NCgkJPC9nPg0KCTwvZz4NCjwvZz4NCjxnIGlkPSJncm91cF8zXyI+DQoJPGc+DQoJCTxwYXRoIGNsYXNzPSJzdDEiIGQ9Ik0xNCwzNTBjLTIuOCwwLTUtMi4yLTUtNXMyLjItNSw1LTVzNSwyLjIsNSw1UzE2LjgsMzUwLDE0LDM1MHogTTE0LDM0MmMtMS43LDAtMywxLjMtMywzczEuMywzLDMsMw0KCQkJczMtMS4zLDMtM1MxNS43LDM0MiwxNCwzNDJ6Ii8+DQoJPC9nPg0KCTxnPg0KCQk8cGF0aCBjbGFzcz0ic3QxIiBkPSJNMTQsMzYxYy00LjIsMC02LjYtMi4yLTYuNy0yLjNjLTAuMi0wLjItMC4zLTAuNS0wLjMtMC44YzAuMS0xLjcsMC40LTQuNywxLjMtNS43czMuOS0xLjIsNS43LTEuM2gwLjENCgkJCWMxLjcsMC4xLDQuNywwLjQsNS43LDEuM2MxLDAuOSwxLjIsMy45LDEuMyw1LjdjMCwwLjMtMC4xLDAuNi0wLjMsMC44QzIwLjYsMzU4LjgsMTguMiwzNjEsMTQsMzYxeiBNOSwzNTcuNQ0KCQkJYzAuNywwLjUsMi40LDEuNSw1LDEuNXM0LjMtMSw1LTEuNWMtMC4xLTEuOC0wLjQtMy41LTAuNy0zLjljLTAuMy0wLjItMi40LTAuNi00LjMtMC43Yy0xLjksMC4xLTMuOSwwLjQtNC4zLDAuNw0KCQkJQzkuNSwzNTQsOS4yLDM1NS44LDksMzU3LjV6Ii8+DQoJPC9nPg0KCTxnPg0KCQk8Zz4NCgkJCTxwYXRoIGNsYXNzPSJzdDEiIGQ9Ik04LDM1MWMtMi4yLDAtNC0xLjgtNC00YzAtMS43LDEuMS0zLjIsMi43LTMuOGMwLjUtMC4yLDEuMSwwLjEsMS4zLDAuNmMwLjIsMC41LTAuMSwxLjEtMC42LDEuMw0KCQkJCWMtMC44LDAuMy0xLjMsMS0xLjMsMS45YzAsMS4xLDAuOSwyLDIsMmMwLjYsMCwxLDAuNCwxLDFTOC42LDM1MSw4LDM1MXoiLz4NCgkJPC9nPg0KCQk8Zz4NCgkJCTxwYXRoIGNsYXNzPSJzdDEiIGQ9Ik01LDM1OGMtMC4xLDAtMC4xLDAtMC4yLDBjLTEuMy0wLjMtMi4zLTEuMS0yLjQtMS4yYy0wLjMtMC4yLTAuNC0wLjYtMC4zLTFjMC4zLTEuNCwwLjgtMy45LDEuNi00LjYNCgkJCQljMC40LTAuNCwzLjMtMiw0LjItMi4yYzAuNS0wLjEsMS4xLDAuMywxLjIsMC44cy0wLjMsMS4xLTAuOCwxLjJzLTIuOCwxLjMtMy4yLDEuN2MtMC4yLDAuMi0wLjYsMS41LTAuOSwyLjkNCgkJCQljMC4zLDAuMiwwLjcsMC40LDEuMSwwLjVjMC41LDAuMSwwLjksMC42LDAuOCwxLjJDNS45LDM1Ny43LDUuNSwzNTgsNSwzNTh6Ii8+DQoJCTwvZz4NCgkJPGc+DQoJCQk8cGF0aCBjbGFzcz0ic3QxIiBkPSJNMjAsMzUxYy0wLjYsMC0xLTAuNC0xLTFzMC40LTEsMS0xYzEuMSwwLDItMC45LDItMmMwLTAuOC0wLjUtMS42LTEuMy0xLjljLTAuNS0wLjItMC44LTAuOC0wLjYtMS4zDQoJCQkJYzAuMi0wLjUsMC44LTAuOCwxLjMtMC42YzEuNiwwLjYsMi43LDIuMSwyLjcsMy44QzI0LDM0OS4yLDIyLjIsMzUxLDIwLDM1MXoiLz4NCgkJPC9nPg0KCQk8Zz4NCgkJCTxwYXRoIGNsYXNzPSJzdDEiIGQ9Ik0yMywzNThjLTAuNSwwLTAuOS0wLjMtMS0wLjhzMC4yLTEuMSwwLjgtMS4yYzAuNC0wLjEsMC44LTAuMywxLjEtMC41Yy0wLjMtMS40LTAuNy0yLjctMC45LTMNCgkJCQljLTAuNC0wLjMtMi42LTEuNS0zLjEtMS42cy0wLjktMC42LTAuOC0xLjJjMC4xLTAuNSwwLjYtMC45LDEuMS0wLjhjMC45LDAuMiwzLjgsMS44LDQuMiwyLjJjMC44LDAuOCwxLjMsMy4yLDEuNiw0LjYNCgkJCQljMC4xLDAuNC0wLjEsMC43LTAuMywxYy0wLjEsMC4xLTEuMSwwLjktMi40LDEuMkMyMy4xLDM1OCwyMy4xLDM1OCwyMywzNTh6Ii8+DQoJCTwvZz4NCgk8L2c+DQo8L2c+DQo8ZyBpZD0idHJhZGUtb25fMV8iPg0KCTxnPg0KCQk8cGF0aCBjbGFzcz0ic3QwIiBkPSJNMzQsMzIzYy0wLjIsMC0wLjMsMC0wLjQtMC4xYy0wLjMtMC4yLTAuNi0wLjUtMC42LTAuOXYtNWMwLTAuMywwLjEtMC42LDAuNC0wLjhsNC0zDQoJCQljMC4yLTAuMSwwLjQtMC4yLDAuNi0wLjJoNXYtMmMwLTAuNCwwLjItMC44LDAuNi0wLjljMC40LTAuMiwwLjgtMC4xLDEuMSwwLjJsOSw4YzAuMywwLjMsMC40LDAuNywwLjMsMS4xcy0wLjYsMC42LTEsMC42SDM4LjMNCgkJCWwtMy43LDIuOEMzNC40LDMyMi45LDM0LjIsMzIzLDM0LDMyM3ogTTM1LDMxNy41djIuNWwyLjQtMS44YzAuMi0wLjEsMC40LTAuMiwwLjYtMC4yaDEyLjRsLTUuNC00Ljh2MC44YzAsMC42LTAuNCwxLTEsMWgtNS43DQoJCQlMMzUsMzE3LjV6Ii8+DQoJPC9nPg0KCTxnPg0KCQk8cGF0aCBjbGFzcz0ic3QwIiBkPSJNNDAsMzM0Yy0wLjIsMC0wLjUtMC4xLTAuNy0wLjNsLTktOGMtMC4zLTAuMy0wLjQtMC43LTAuMy0xLjFjMC4xLTAuNCwwLjUtMC42LDAuOS0wLjZoMTQuN2wzLjctMi44DQoJCQljMC4zLTAuMiwwLjctMC4zLDEtMC4xYzAuMywwLjIsMC42LDAuNSwwLjYsMC45djVjMCwwLjMtMC4xLDAuNi0wLjQsMC44bC00LDNjLTAuMiwwLjEtMC40LDAuMi0wLjYsMC4yaC01djINCgkJCWMwLDAuNC0wLjIsMC44LTAuNiwwLjlDNDAuMywzMzQsNDAuMSwzMzQsNDAsMzM0eiBNMzMuNiwzMjZsNS40LDQuOFYzMzBjMC0wLjYsMC40LTEsMS0xaDUuN2wzLjMtMi41VjMyNGwtMi40LDEuOA0KCQkJYy0wLjIsMC4xLTAuNCwwLjItMC42LDAuMkgzMy42eiIvPg0KCTwvZz4NCjwvZz4NCjxnIGlkPSJ0cmFkZV8zXyI+DQoJPGc+DQoJCTxwYXRoIGNsYXNzPSJzdDEiIGQ9Ik02LDMyM2MtMC4yLDAtMC4zLDAtMC40LTAuMUM1LjIsMzIyLjcsNSwzMjIuNCw1LDMyMnYtNWMwLTAuMywwLjEtMC42LDAuNC0wLjhsNC0zYzAuMi0wLjEsMC40LTAuMiwwLjYtMC4yDQoJCQloNXYtMmMwLTAuNCwwLjItMC44LDAuNi0wLjljMC40LTAuMiwwLjgtMC4xLDEuMSwwLjJsOSw4YzAuMywwLjMsMC40LDAuNywwLjMsMS4xcy0wLjYsMC42LTEsMC42SDEwLjNsLTMuNywyLjgNCgkJCUM2LjQsMzIyLjksNi4yLDMyMyw2LDMyM3ogTTcsMzE3LjV2Mi41bDIuNC0xLjhjMC4yLTAuMSwwLjQtMC4yLDAuNi0wLjJoMTIuNGwtNS40LTQuOHYwLjhjMCwwLjYtMC40LDEtMSwxaC01LjdMNywzMTcuNXoiLz4NCgk8L2c+DQoJPGc+DQoJCTxwYXRoIGNsYXNzPSJzdDEiIGQ9Ik0xMiwzMzRjLTAuMiwwLTAuNS0wLjEtMC43LTAuM2wtOS04QzIsMzI1LjQsMS45LDMyNSwyLDMyNC42YzAuMS0wLjQsMC42LTAuNiwxLTAuNmgxNC43bDMuNy0yLjgNCgkJCWMwLjMtMC4yLDAuNy0wLjMsMS0wLjFjMC4zLDAuMiwwLjYsMC41LDAuNiwwLjl2NWMwLDAuMy0wLjEsMC42LTAuNCwwLjhsLTQsM2MtMC4yLDAuMS0wLjQsMC4yLTAuNiwwLjJoLTV2Mg0KCQkJYzAsMC40LTAuMiwwLjgtMC42LDAuOUMxMi4zLDMzNCwxMi4xLDMzNCwxMiwzMzR6IE01LjYsMzI2bDUuNCw0LjhWMzMwYzAtMC42LDAuNC0xLDEtMWg1LjdsMy4zLTIuNVYzMjRsLTIuNCwxLjgNCgkJCWMtMC4yLDAuMS0wLjQsMC4yLTAuNiwwLjJINS42eiIvPg0KCTwvZz4NCjwvZz4NCjxnIGlkPSJpbnZlbnRvcnktb25fMV8iPg0KCTxnPg0KCQk8cGF0aCBjbGFzcz0ic3QyIiBkPSJNNTAsMzA2SDM0Yy0wLjYsMC0xLTAuNC0xLTF2LTE0YzAtMi44LDIuMi01LDUtNWg4YzIuOCwwLDUsMi4yLDUsNXYxNEM1MSwzMDUuNiw1MC42LDMwNiw1MCwzMDZ6IE0zNSwzMDRoMTQNCgkJCXYtMTNjMC0xLjctMS4zLTMtMy0zaC04Yy0xLjcsMC0zLDEuMy0zLDNWMzA0eiIvPg0KCTwvZz4NCgk8Zz4NCgkJPHBhdGggY2xhc3M9InN0MiIgZD0iTTM4LDI5OWMtMC42LDAtMS0wLjQtMS0xdi0yYzAtMC42LDAuNC0xLDEtMXMxLDAuNCwxLDF2MkMzOSwyOTguNiwzOC42LDI5OSwzOCwyOTl6Ii8+DQoJPC9nPg0KCTxnPg0KCQk8cGF0aCBjbGFzcz0ic3QyIiBkPSJNNDYsMjk5Yy0wLjYsMC0xLTAuNC0xLTF2LTJjMC0wLjYsMC40LTEsMS0xczEsMC40LDEsMXYyQzQ3LDI5OC42LDQ2LjYsMjk5LDQ2LDI5OXoiLz4NCgk8L2c+DQoJPGc+DQoJCTxwYXRoIGNsYXNzPSJzdDIiIGQ9Ik00NS41LDI4OGMtMC42LDAtMS0wLjQtMS0xdi0wLjVjMC0xLjQtMS4xLTIuNS0yLjUtMi41cy0yLjUsMS4xLTIuNSwyLjV2MC41YzAsMC42LTAuNCwxLTEsMXMtMS0wLjQtMS0xDQoJCQl2LTAuNWMwLTIuNSwyLTQuNSw0LjUtNC41czQuNSwyLDQuNSw0LjV2MC41QzQ2LjUsMjg3LjYsNDYuMSwyODgsNDUuNSwyODh6Ii8+DQoJPC9nPg0KCTxnPg0KCQk8cGF0aCBjbGFzcz0ic3QyIiBkPSJNNDQuOSwyOTdoLTUuOGMtMi4zLDAtNC4zLTEuMy01LjQtMy4zbC0wLjYtMS4ybDEuOC0wLjlsMC42LDEuMmMwLjcsMS40LDIuMSwyLjIsMy42LDIuMmg1LjgNCgkJCWMxLjUsMCwyLjktMC44LDMuNi0yLjJsMC42LTEuMmwxLjgsMC45bC0wLjYsMS4yQzQ5LjMsMjk1LjcsNDcuMiwyOTcsNDQuOSwyOTd6Ii8+DQoJPC9nPg0KPC9nPg0KPGcgaWQ9ImludmVudG9yeV8xXyI+DQoJPGc+DQoJCTxwYXRoIGNsYXNzPSJzdDEiIGQ9Ik0yMiwzMDZINmMtMC42LDAtMS0wLjQtMS0xdi0xNGMwLTIuOCwyLjItNSw1LTVoOGMyLjgsMCw1LDIuMiw1LDV2MTRDMjMsMzA1LjYsMjIuNiwzMDYsMjIsMzA2eiBNNywzMDRoMTQNCgkJCXYtMTNjMC0xLjctMS4zLTMtMy0zaC04Yy0xLjcsMC0zLDEuMy0zLDNWMzA0eiIvPg0KCTwvZz4NCgk8Zz4NCgkJPHBhdGggY2xhc3M9InN0MSIgZD0iTTEwLDI5OWMtMC42LDAtMS0wLjQtMS0xdi0yYzAtMC42LDAuNC0xLDEtMXMxLDAuNCwxLDF2MkMxMSwyOTguNiwxMC42LDI5OSwxMCwyOTl6Ii8+DQoJPC9nPg0KCTxnPg0KCQk8cGF0aCBjbGFzcz0ic3QxIiBkPSJNMTgsMjk5Yy0wLjYsMC0xLTAuNC0xLTF2LTJjMC0wLjYsMC40LTEsMS0xczEsMC40LDEsMXYyQzE5LDI5OC42LDE4LjYsMjk5LDE4LDI5OXoiLz4NCgk8L2c+DQoJPGc+DQoJCTxwYXRoIGNsYXNzPSJzdDEiIGQ9Ik0xNy41LDI4OGMtMC42LDAtMS0wLjQtMS0xdi0wLjVjMC0xLjQtMS4xLTIuNS0yLjUtMi41cy0yLjUsMS4xLTIuNSwyLjV2MC41YzAsMC42LTAuNCwxLTEsMXMtMS0wLjQtMS0xDQoJCQl2LTAuNWMwLTIuNSwyLTQuNSw0LjUtNC41czQuNSwyLDQuNSw0LjV2MC41QzE4LjUsMjg3LjYsMTguMSwyODgsMTcuNSwyODh6Ii8+DQoJPC9nPg0KCTxnPg0KCQk8cGF0aCBjbGFzcz0ic3QxIiBkPSJNMTYuOSwyOTdoLTUuOGMtMi4zLDAtNC4zLTEuMy01LjQtMy4zbC0wLjYtMS4ybDEuOC0wLjlsMC42LDEuMmMwLjcsMS40LDIuMSwyLjIsMy42LDIuMmg1LjgNCgkJCWMxLjUsMCwyLjktMC44LDMuNi0yLjJsMC42LTEuMmwxLjgsMC45bC0wLjYsMS4yQzIxLjMsMjk1LjcsMTkuMiwyOTcsMTYuOSwyOTd6Ii8+DQoJPC9nPg0KPC9nPg0KPGcgaWQ9ImNoYXJhY3Rlci1vbiI+DQoJPHBhdGggY2xhc3M9InN0MyIgZD0iTTM5LDI2MmMyLjIsMCw0LTEuOCw0LTRjMC0yLjItMS44LTQtNC00cy00LDEuOC00LDRDMzUsMjYwLjIsMzYuOCwyNjIsMzksMjYyeiBNMzksMjU2YzEuMSwwLDIsMC45LDIsMg0KCQlzLTAuOSwyLTIsMmMtMS4xLDAtMi0wLjktMi0yUzM3LjksMjU2LDM5LDI1NnoiLz4NCgk8cGF0aCBjbGFzcz0ic3QzIiBkPSJNMzkuNCwyNzAuMWMtMC41LTAuMi0xLjEsMC0xLjMsMC40bC0yLjcsNS41aC0xLjJsMS43LTcuOGMwLjEtMC41LTAuMi0xLjEtMC43LTEuMmwtMy4yLTAuOFYyNjVoMTANCgkJYzAuNiwwLDEtMC40LDEtMXMtMC40LTEtMS0xSDMxYy0wLjYsMC0xLDAuNC0xLDF2M2MwLDAuNSwwLjMsMC45LDAuOCwxbDMuMSwwLjhsLTEuOCw4Yy0wLjEsMC4zLDAsMC42LDAuMiwwLjgNCgkJYzAuMiwwLjIsMC41LDAuNCwwLjgsMC40aDNjMC40LDAsMC43LTAuMiwwLjktMC42bDMtNkM0MC4xLDI3MSwzOS45LDI3MC40LDM5LjQsMjcwLjF6Ii8+DQoJPHBhdGggY2xhc3M9InN0MyIgZD0iTTUzLjgsMjU3LjRjLTAuMi0wLjMtMC41LTAuNC0wLjgtMC40aC0yYy0wLjMsMC0wLjYsMC4yLTAuOCwwLjRsLTcsMTBjLTAuMiwwLjItMC4yLDAuNi0wLjEsMC45DQoJCWMwLjEsMC4zLDAuMywwLjUsMC42LDAuNmw1LDJjMC4xLDAsMC4yLDAuMSwwLjQsMC4xYzAuMSwwLDAuMywwLDAuNC0wLjFjMC4yLTAuMSwwLjQtMC4zLDAuNS0wLjZsNC0xMg0KCQlDNTQuMSwyNTgsNTQsMjU3LjcsNTMuOCwyNTcuNHogTTQ4LjQsMjY4LjdsLTIuOC0xLjFsNi04LjVoMC4xTDQ4LjQsMjY4Ljd6Ii8+DQoJPHBhdGggY2xhc3M9InN0MyIgZD0iTTQ0LDI3MGMtMi42LDAtMy4yLDEuOS0zLjYsMy41Yy0wLjMsMC45LTAuNiwxLjktMS4yLDNjLTAuMiwwLjMtMC4yLDAuNywwLDFjMC4yLDAuMywwLjUsMC41LDAuOSwwLjUNCgkJYzcsMCw4LTIuNSw4LTRDNDgsMjcxLjQsNDUuNywyNzAsNDQsMjcweiBNNDEuNywyNzUuOWMwLjMtMC43LDAuNS0xLjMsMC42LTEuOWMwLjUtMS43LDAuNy0yLjEsMS43LTIuMWMwLjUsMCwyLDAuNSwyLDINCgkJQzQ2LDI3NSw0NC4zLDI3NS43LDQxLjcsMjc1Ljl6Ii8+DQo8L2c+DQo8ZyBpZD0iY2hhcmFjdGVyXzFfIj4NCgk8cGF0aCBjbGFzcz0ic3QxIiBkPSJNMTEsMjYyYzIuMiwwLDQtMS44LDQtNGMwLTIuMi0xLjgtNC00LTRzLTQsMS44LTQsNEM3LDI2MC4yLDguOCwyNjIsMTEsMjYyeiBNMTEsMjU2YzEuMSwwLDIsMC45LDIsMg0KCQlzLTAuOSwyLTIsMnMtMi0wLjktMi0yUzkuOSwyNTYsMTEsMjU2eiIvPg0KCTxwYXRoIGNsYXNzPSJzdDEiIGQ9Ik0xMS40LDI3MC4xYy0wLjUtMC4yLTEuMSwwLTEuMywwLjRMNy40LDI3Nkg2LjJsMS43LTcuOGMwLjEtMC41LTAuMi0xLjEtMC43LTEuMkw0LDI2Ni4yVjI2NWgxMA0KCQljMC42LDAsMS0wLjQsMS0xcy0wLjQtMS0xLTFIM2MtMC42LDAtMSwwLjQtMSwxdjNjMCwwLjUsMC4zLDAuOSwwLjgsMWwzLjEsMC44bC0xLjgsOGMtMC4xLDAuMywwLDAuNiwwLjIsMC44DQoJCWMwLjIsMC4yLDAuNSwwLjQsMC44LDAuNGgzYzAuNCwwLDAuNy0wLjIsMC45LTAuNmwzLTZDMTIuMSwyNzEsMTEuOSwyNzAuNCwxMS40LDI3MC4xeiIvPg0KCTxwYXRoIGNsYXNzPSJzdDEiIGQ9Ik0yNS44LDI1Ny40Yy0wLjItMC4zLTAuNS0wLjQtMC44LTAuNGgtMmMtMC4zLDAtMC42LDAuMi0wLjgsMC40bC03LDEwYy0wLjIsMC4yLTAuMiwwLjYtMC4xLDAuOQ0KCQljMC4xLDAuMywwLjMsMC41LDAuNiwwLjZsNSwyYzAuMSwwLDAuMiwwLjEsMC40LDAuMWMwLjEsMCwwLjMsMCwwLjQtMC4xYzAuMi0wLjEsMC40LTAuMywwLjUtMC42bDQtMTINCgkJQzI2LjEsMjU4LDI2LDI1Ny43LDI1LjgsMjU3LjR6IE0yMC40LDI2OC43bC0yLjgtMS4xbDYtOC41aDAuMUwyMC40LDI2OC43eiIvPg0KCTxwYXRoIGNsYXNzPSJzdDEiIGQ9Ik0xNiwyNzBjLTIuNiwwLTMuMiwxLjktMy42LDMuNWMtMC4zLDAuOS0wLjYsMS45LTEuMiwzYy0wLjIsMC4zLTAuMiwwLjcsMCwxczAuNSwwLjUsMC45LDAuNWM3LDAsOC0yLjUsOC00DQoJCUMyMCwyNzEuNCwxNy43LDI3MCwxNiwyNzB6IE0xMy43LDI3NS45YzAuMy0wLjcsMC41LTEuMywwLjYtMS45YzAuNS0xLjcsMC43LTIuMSwxLjctMi4xYzAuNSwwLDIsMC41LDIsMg0KCQlDMTgsMjc1LDE2LjMsMjc1LjcsMTMuNywyNzUuOXoiLz4NCjwvZz4NCjxnIGlkPSJmcmllbmRzLW9uXzFfIj4NCgk8Zz4NCgkJPHBhdGggY2xhc3M9InN0MCIgZD0iTTM5LDIzOGMtMy4zLDAtNi0yLjctNi02czIuNy02LDYtNnM2LDIuNyw2LDZTNDIuMywyMzgsMzksMjM4eiBNMzksMjI4Yy0yLjIsMC00LDEuOC00LDRzMS44LDQsNCw0DQoJCQlzNC0xLjgsNC00UzQxLjIsMjI4LDM5LDIyOHoiLz4NCgk8L2c+DQoJPGc+DQoJCTxwYXRoIGNsYXNzPSJzdDAiIGQ9Ik00NywyMzguNmMtMC40LDAtMC44LTAuMi0wLjktMC42Yy0wLjItMC41LDAtMS4xLDAuNS0xLjNjMS41LTAuNiwyLjQtMi4xLDIuNC0zLjdjMC0xLjktMS4zLTMuNS0zLjItMy45DQoJCQljLTAuNS0wLjEtMC45LTAuNi0wLjgtMS4yYzAuMS0wLjUsMC42LTAuOSwxLjItMC44YzIuOCwwLjYsNC44LDMsNC44LDUuOWMwLDIuNC0xLjQsNC41LTMuNiw1LjVDNDcuMywyMzguNiw0Ny4xLDIzOC42LDQ3LDIzOC42eg0KCQkJIi8+DQoJPC9nPg0KCTxnPg0KCQk8cGF0aCBjbGFzcz0ic3QwIiBkPSJNMzksMjUwYy01LjIsMC04LjQtMi4xLTguNS0yLjJjLTAuMy0wLjItMC41LTAuNi0wLjQtMWMwLjItMS4yLDEuMS01LjQsMi4zLTYuNWMxLjItMS4yLDUuMS0xLjMsNi43LTEuMw0KCQkJYzEuNiwwLDUuNSwwLjEsNi43LDEuM2MxLjEsMS4xLDIsNS4zLDIuMyw2LjVjMC4xLDAuNC0wLjEsMC44LTAuNCwxQzQ3LjQsMjQ3LjksNDQuMiwyNTAsMzksMjUweiBNMzIuMSwyNDYuNQ0KCQkJYzEuMSwwLjUsMy41LDEuNSw2LjksMS41czUuOC0xLDYuOS0xLjVjLTAuNS0yLjEtMS4yLTQuMy0xLjYtNC44Yy0wLjQtMC40LTIuOS0wLjctNS4zLTAuN3MtNC45LDAuMy01LjMsMC43DQoJCQlDMzMuMywyNDIuMSwzMi42LDI0NC40LDMyLjEsMjQ2LjV6Ii8+DQoJPC9nPg0KCTxnPg0KCQk8cGF0aCBjbGFzcz0ic3QwIiBkPSJNNTAsMjQ5Yy0wLjQsMC0wLjgtMC4zLTEtMC43Yy0wLjItMC41LDAuMS0xLjEsMC43LTEuMmMxLjEtMC4zLDEuOC0xLDIuMi0xLjNjLTAuNS0yLjItMS4yLTQuNi0xLjYtNQ0KCQkJYy0wLjYtMC42LTIuNi0yLTMuNC0yLjFjLTAuNS0wLjEtMC45LTAuNi0wLjktMS4xYzAuMS0wLjUsMC41LTEsMS4xLTAuOWMxLjcsMC4yLDQuMywyLjQsNC42LDIuN2MxLjEsMS4xLDIsNS4zLDIuMyw2LjUNCgkJCWMwLjEsMC4zLDAsMC42LTAuMiwwLjhjLTAuMSwwLjEtMS4zLDEuNy0zLjUsMi40QzUwLjIsMjQ5LDUwLjEsMjQ5LDUwLDI0OXoiLz4NCgk8L2c+DQo8L2c+DQo8ZyBpZD0iZnJpZW5kc18zXyI+DQoJPGc+DQoJCTxwYXRoIGNsYXNzPSJzdDEiIGQ9Ik0xMSwyMzhjLTMuMywwLTYtMi43LTYtNnMyLjctNiw2LTZzNiwyLjcsNiw2UzE0LjMsMjM4LDExLDIzOHogTTExLDIyOGMtMi4yLDAtNCwxLjgtNCw0czEuOCw0LDQsNA0KCQkJczQtMS44LDQtNFMxMy4yLDIyOCwxMSwyMjh6Ii8+DQoJPC9nPg0KCTxnPg0KCQk8cGF0aCBjbGFzcz0ic3QxIiBkPSJNMTksMjM4LjZjLTAuNCwwLTAuOC0wLjItMC45LTAuNmMtMC4yLTAuNSwwLTEuMSwwLjUtMS4zYzEuNS0wLjYsMi40LTIuMSwyLjQtMy43YzAtMS45LTEuMy0zLjUtMy4yLTMuOQ0KCQkJYy0wLjUtMC4xLTAuOS0wLjYtMC44LTEuMmMwLjEtMC41LDAuNi0wLjksMS4yLTAuOGMyLjgsMC42LDQuOCwzLDQuOCw1LjljMCwyLjQtMS40LDQuNS0zLjYsNS41QzE5LjMsMjM4LjYsMTkuMSwyMzguNiwxOSwyMzguNnoNCgkJCSIvPg0KCTwvZz4NCgk8Zz4NCgkJPHBhdGggY2xhc3M9InN0MSIgZD0iTTExLDI1MGMtNS4yLDAtOC40LTIuMS04LjUtMi4yYy0wLjMtMC4yLTAuNS0wLjYtMC40LTFjMC4yLTEuMiwxLjEtNS40LDIuMy02LjVjMS4yLTEuMiw1LjEtMS4zLDYuNy0xLjMNCgkJCXM1LjUsMC4xLDYuNywxLjNjMS4xLDEuMSwyLDUuMywyLjMsNi41YzAuMSwwLjQtMC4xLDAuOC0wLjQsMUMxOS40LDI0Ny45LDE2LjIsMjUwLDExLDI1MHogTTQuMSwyNDYuNUM1LjIsMjQ3LDcuNiwyNDgsMTEsMjQ4DQoJCQlzNS44LTEsNi45LTEuNWMtMC41LTIuMS0xLjItNC4zLTEuNi00LjhjLTAuNC0wLjQtMi45LTAuNy01LjMtMC43cy00LjksMC4zLTUuMywwLjdDNS4zLDI0Mi4xLDQuNiwyNDQuNCw0LjEsMjQ2LjV6Ii8+DQoJPC9nPg0KCTxnPg0KCQk8cGF0aCBjbGFzcz0ic3QxIiBkPSJNMjIsMjQ5Yy0wLjQsMC0wLjgtMC4zLTEtMC43Yy0wLjItMC41LDAuMS0xLjEsMC43LTEuMmMxLjEtMC4zLDEuOC0xLDIuMi0xLjNjLTAuNS0yLjItMS4yLTQuNi0xLjYtNQ0KCQkJYy0wLjYtMC42LTIuNi0yLTMuNC0yLjFjLTAuNS0wLjEtMC45LTAuNi0wLjktMS4xYzAuMS0wLjUsMC41LTEsMS4xLTAuOWMxLjcsMC4yLDQuMywyLjQsNC42LDIuN2MxLjEsMS4xLDIsNS4zLDIuMyw2LjUNCgkJCWMwLjEsMC4zLDAsMC42LTAuMiwwLjhjLTAuMSwwLjEtMS4zLDEuNy0zLjUsMi40QzIyLjIsMjQ5LDIyLjEsMjQ5LDIyLDI0OXoiLz4NCgk8L2c+DQo8L2c+DQo8ZyBpZD0ibWVzc2FnZS1vbl8xXyI+DQoJPGc+DQoJCTxwYXRoIGNsYXNzPSJzdDAiIGQ9Ik00MiwyMjFjLTAuMywwLTAuNS0wLjEtMC43LTAuM2wtMy43LTMuN0gzMWMtMC42LDAtMS0wLjQtMS0xdi0xNmMwLTAuNiwwLjQtMSwxLTFoMjJjMC42LDAsMSwwLjQsMSwxdjE2DQoJCQljMCwwLjYtMC40LDEtMSwxaC02LjZsLTMuNywzLjdDNDIuNSwyMjAuOSw0Mi4zLDIyMSw0MiwyMjF6IE0zMiwyMTVoNmMwLjMsMCwwLjUsMC4xLDAuNywwLjNsMy4zLDMuM2wzLjMtMy4zDQoJCQljMC4yLTAuMiwwLjQtMC4zLDAuNy0wLjNoNnYtMTRIMzJWMjE1eiIvPg0KCTwvZz4NCgk8Zz4NCgkJPHBhdGggY2xhc3M9InN0MCIgZD0iTTQ4LDIwN0gzNmMtMC42LDAtMS0wLjQtMS0xczAuNC0xLDEtMWgxMmMwLjYsMCwxLDAuNCwxLDFTNDguNiwyMDcsNDgsMjA3eiIvPg0KCTwvZz4NCgk8Zz4NCgkJPHBhdGggY2xhc3M9InN0MCIgZD0iTTQ4LDIxMUgzNmMtMC42LDAtMS0wLjQtMS0xczAuNC0xLDEtMWgxMmMwLjYsMCwxLDAuNCwxLDFTNDguNiwyMTEsNDgsMjExeiIvPg0KCTwvZz4NCjwvZz4NCjxnIGlkPSJtZXNzYWdlXzNfIj4NCgk8Zz4NCgkJPHBhdGggY2xhc3M9InN0MSIgZD0iTTE0LDIyMWMtMC4zLDAtMC41LTAuMS0wLjctMC4zTDkuNiwyMTdIM2MtMC42LDAtMS0wLjQtMS0xdi0xNmMwLTAuNiwwLjQtMSwxLTFoMjJjMC42LDAsMSwwLjQsMSwxdjE2DQoJCQljMCwwLjYtMC40LDEtMSwxaC02LjZsLTMuNywzLjdDMTQuNSwyMjAuOSwxNC4zLDIyMSwxNCwyMjF6IE00LDIxNWg2YzAuMywwLDAuNSwwLjEsMC43LDAuM2wzLjMsMy4zbDMuMy0zLjMNCgkJCWMwLjItMC4yLDAuNC0wLjMsMC43LTAuM2g2di0xNEg0VjIxNXoiLz4NCgk8L2c+DQoJPGc+DQoJCTxwYXRoIGNsYXNzPSJzdDEiIGQ9Ik0yMCwyMDdIOGMtMC42LDAtMS0wLjQtMS0xczAuNC0xLDEtMWgxMmMwLjYsMCwxLDAuNCwxLDFTMjAuNiwyMDcsMjAsMjA3eiIvPg0KCTwvZz4NCgk8Zz4NCgkJPHBhdGggY2xhc3M9InN0MSIgZD0iTTIwLDIxMUg4Yy0wLjYsMC0xLTAuNC0xLTFzMC40LTEsMS0xaDEyYzAuNiwwLDEsMC40LDEsMVMyMC42LDIxMSwyMCwyMTF6Ii8+DQoJPC9nPg0KPC9nPg0KPGcgaWQ9InByb2ZpbGUtb25fMV8iPg0KCTxnPg0KCQk8cGF0aCBjbGFzcz0ic3QzIiBkPSJNNDIsMTgyYy0zLjMsMC02LTIuNy02LTZzMi43LTYsNi02czYsMi43LDYsNlM0NS4zLDE4Miw0MiwxODJ6IE00MiwxNzJjLTIuMiwwLTQsMS44LTQsNHMxLjgsNCw0LDQNCgkJCXM0LTEuOCw0LTRTNDQuMiwxNzIsNDIsMTcyeiIvPg0KCTwvZz4NCgk8Zz4NCgkJPHBhdGggY2xhc3M9InN0MyIgZD0iTTQyLDE5NGMtNS4yLDAtOC40LTIuMS04LjUtMi4yYy0wLjMtMC4yLTAuNS0wLjYtMC40LTFjMC4yLTEuMiwxLjEtNS40LDIuMy02LjVjMS4yLTEuMiw1LjEtMS4zLDYuNy0xLjMNCgkJCWMxLjYsMCw1LjUsMC4xLDYuNywxLjNjMS4xLDEuMSwyLDUuMywyLjMsNi41YzAuMSwwLjQtMC4xLDAuOC0wLjQsMUM1MC40LDE5MS45LDQ3LjIsMTk0LDQyLDE5NHogTTM1LjEsMTkwLjUNCgkJCWMxLjEsMC41LDMuNSwxLjUsNi45LDEuNXM1LjgtMSw2LjktMS41Yy0wLjUtMi4xLTEuMi00LjMtMS42LTQuOGMtMC40LTAuNC0yLjktMC43LTUuMy0wLjdzLTQuOSwwLjMtNS4zLDAuNw0KCQkJQzM2LjMsMTg2LjEsMzUuNiwxODguNCwzNS4xLDE5MC41eiIvPg0KCTwvZz4NCjwvZz4NCjxnIGlkPSJwcm9maWxlXzNfIj4NCgk8Zz4NCgkJPHBhdGggY2xhc3M9InN0MSIgZD0iTTE0LDE4MmMtMy4zLDAtNi0yLjctNi02czIuNy02LDYtNnM2LDIuNyw2LDZTMTcuMywxODIsMTQsMTgyeiBNMTQsMTcyYy0yLjIsMC00LDEuOC00LDRzMS44LDQsNCw0DQoJCQlzNC0xLjgsNC00UzE2LjIsMTcyLDE0LDE3MnoiLz4NCgk8L2c+DQoJPGc+DQoJCTxwYXRoIGNsYXNzPSJzdDEiIGQ9Ik0xNCwxOTRjLTUuMiwwLTguNC0yLjEtOC41LTIuMmMtMC4zLTAuMi0wLjUtMC42LTAuNC0xYzAuMi0xLjIsMS4xLTUuNCwyLjMtNi41YzEuMi0xLjIsNS4xLTEuMyw2LjctMS4zDQoJCQlzNS41LDAuMSw2LjcsMS4zYzEuMSwxLjEsMiw1LjMsMi4zLDYuNWMwLjEsMC40LTAuMSwwLjgtMC40LDFDMjIuNCwxOTEuOSwxOS4yLDE5NCwxNCwxOTR6IE03LjEsMTkwLjVjMS4xLDAuNSwzLjUsMS41LDYuOSwxLjUNCgkJCXM1LjgtMSw2LjktMS41Yy0wLjUtMi4xLTEuMi00LjMtMS42LTQuOGMtMC40LTAuNC0yLjktMC43LTUuMy0wLjdzLTQuOSwwLjMtNS4zLDAuN0M4LjMsMTg2LjEsNy42LDE4OC40LDcuMSwxOTAuNXoiLz4NCgk8L2c+DQo8L2c+DQo8ZyBpZD0iaG9tZS1vbl8xXyI+DQoJPHBhdGggY2xhc3M9InN0MiIgZD0iTTUxLDE2NWgtN2MtMC42LDAtMS0wLjQtMS0xdi02aC0ydjZjMCwwLjYtMC40LDEtMSwxaC03Yy0wLjYsMC0xLTAuNC0xLTF2LTloLTFjLTAuNCwwLTAuOC0wLjMtMC45LTAuNg0KCQljLTAuMS0wLjQsMC0wLjgsMC4zLTEuMWwxMS0xMGMwLjQtMC4zLDEtMC4zLDEuMywwbDExLDEwYzAuMywwLjMsMC40LDAuNywwLjMsMS4xYy0wLjEsMC40LTAuNSwwLjYtMC45LDAuNmgtMXY5DQoJCUM1MiwxNjQuNiw1MS42LDE2NSw1MSwxNjV6IE00NSwxNjNoNXYtOWMwLTAuNCwwLjItMC43LDAuNS0wLjlsLTguNS03LjhsLTguNSw3LjhjMC4zLDAuMiwwLjUsMC41LDAuNSwwLjl2OWg1di02YzAtMC42LDAuNC0xLDEtMQ0KCQloNGMwLjYsMCwxLDAuNCwxLDFWMTYzeiIvPg0KPC9nPg0KPGcgaWQ9ImhvbWVfMV8iPg0KCTxwYXRoIGNsYXNzPSJzdDEiIGQ9Ik0yMywxNjVoLTdjLTAuNiwwLTEtMC40LTEtMXYtNmgtMnY2YzAsMC42LTAuNCwxLTEsMUg1Yy0wLjYsMC0xLTAuNC0xLTF2LTlIM2MtMC40LDAtMC44LTAuMy0wLjktMC42DQoJCWMtMC4xLTAuNCwwLTAuOCwwLjMtMS4xbDExLTEwYzAuNC0wLjMsMS0wLjMsMS4zLDBsMTEsMTBjMC4zLDAuMywwLjQsMC43LDAuMywxLjFjLTAuMSwwLjQtMC41LDAuNi0wLjksMC42aC0xdjkNCgkJQzI0LDE2NC42LDIzLjYsMTY1LDIzLDE2NXogTTE3LDE2M2g1di05YzAtMC40LDAuMi0wLjcsMC41LTAuOWwtOC41LTcuOGwtOC41LDcuOGMwLjMsMC4yLDAuNSwwLjUsMC41LDAuOXY5aDV2LTZjMC0wLjYsMC40LTEsMS0xDQoJCWg0YzAuNiwwLDEsMC40LDEsMVYxNjN6Ii8+DQo8L2c+DQo8ZyBpZD0ic2V0dGluZ3Mtb25fMV8iPg0KCTxwYXRoIGNsYXNzPSJzdDQiIGQ9Ik01Myw5NmgtMS4yYy0wLjMtMS4zLTAuOC0yLjUtMS41LTMuNWwwLjktMC45YzAuNC0wLjQsMC40LTEsMC0xLjRsLTEuNC0xLjRjLTAuNC0wLjQtMS0wLjQtMS40LDBsLTAuOSwwLjkNCgkJYy0xLTAuNy0yLjItMS4yLTMuNS0xLjVWODdjMC0wLjYtMC40LTEtMS0xaC0yYy0wLjYsMC0xLDAuNC0xLDF2MS4yYy0xLjMsMC4zLTIuNSwwLjgtMy41LDEuNWwtMC45LTAuOWMtMC40LTAuNC0xLTAuNC0xLjQsMA0KCQlsLTEuNCwxLjRjLTAuNCwwLjQtMC40LDEsMCwxLjRsMC45LDAuOWMtMC43LDEtMS4yLDIuMi0xLjUsMy41SDMxYy0wLjYsMC0xLDAuNC0xLDF2MmMwLDAuNiwwLjQsMSwxLDFoMS4yDQoJCWMwLjMsMS4zLDAuOCwyLjUsMS41LDMuNWwtMC45LDAuOWMtMC40LDAuNC0wLjQsMSwwLDEuNGwxLjQsMS40YzAuNCwwLjQsMSwwLjQsMS40LDBsMC45LTAuOWMxLDAuNywyLjIsMS4yLDMuNSwxLjV2MS4yDQoJCWMwLDAuNiwwLjQsMSwxLDFoMmMwLjYsMCwxLTAuNCwxLTF2LTEuMmMxLjMtMC4zLDIuNS0wLjgsMy41LTEuNWwwLjksMC45YzAuNCwwLjQsMSwwLjQsMS40LDBsMS40LTEuNGMwLjQtMC40LDAuNC0xLDAtMS40DQoJCWwtMC45LTAuOWMwLjctMSwxLjItMi4yLDEuNS0zLjVINTNjMC42LDAsMS0wLjQsMS0xdi0yQzU0LDk2LjQsNTMuNiw5Niw1Myw5NnogTTQyLDEwNGMtMy4zLDAtNi0yLjctNi02czIuNy02LDYtNnM2LDIuNyw2LDYNCgkJUzQ1LjMsMTA0LDQyLDEwNHoiLz4NCjwvZz4NCjxnIGlkPSJzZXR0aW5nc18xXyI+DQoJPGc+DQoJCTxwYXRoIGNsYXNzPSJzdDQiIGQ9Ik0xNiwxMTBoLTRjLTAuNiwwLTEtMC40LTEtMXYtMS41Yy0wLjYtMC4yLTEuMS0wLjQtMS42LTAuN2wtMC45LDAuOWMtMC40LDAuNC0xLDAuNC0xLjQsMEw0LjIsMTA1DQoJCQljLTAuNC0wLjQtMC40LTEsMC0xLjRsMC45LTAuOWMtMC4zLTAuNS0wLjUtMS4xLTAuNy0xLjZIM2MtMC42LDAtMS0wLjQtMS0xdi00YzAtMC42LDAuNC0xLDEtMWgxLjVjMC4yLTAuNiwwLjQtMS4xLDAuNy0xLjYNCgkJCWwtMC45LTAuOWMtMC40LTAuNC0wLjQtMSwwLTEuNGwyLjctM2MwLjItMC4yLDAuNC0wLjMsMC43LTAuM2wwLDBjMC4zLDAsMC41LDAuMSwwLjcsMC4zbDAuOSwwLjljMC41LTAuMywxLjEtMC41LDEuNi0wLjdWODcNCgkJCWMwLTAuNiwwLjQtMSwxLTFoNGMwLjYsMCwxLDAuNCwxLDF2MS41YzAuNiwwLjIsMS4xLDAuNCwxLjYsMC43bDAuOS0wLjljMC40LTAuNCwxLTAuNCwxLjQsMGwyLjgsMi44YzAuNCwwLjQsMC40LDEsMCwxLjQNCgkJCWwtMC45LDAuOWMwLjMsMC41LDAuNSwxLjEsMC43LDEuNkgyNWMwLjYsMCwxLDAuNCwxLDF2NGMwLDAuNi0wLjQsMS0xLDFoLTEuNWMtMC4yLDAuNi0wLjQsMS4xLTAuNywxLjZsMC45LDAuOQ0KCQkJYzAuNCwwLjQsMC40LDEsMCwxLjRsLTIuOCwyLjhjLTAuMiwwLjItMC40LDAuMy0wLjcsMC4zbDAsMGMtMC4zLDAtMC41LTAuMS0wLjctMC4zbC0wLjktMC45Yy0wLjUsMC4zLTEuMSwwLjUtMS42LDAuN3YxLjUNCgkJCUMxNywxMDkuNiwxNi42LDExMCwxNiwxMTB6IE0xMywxMDhoMnYtMS4yYzAtMC41LDAuMy0wLjksMC44LTFjMC45LTAuMiwxLjctMC41LDIuNS0xYzAuNC0wLjIsMC45LTAuMiwxLjIsMC4xbDAuOCwwLjhsMS40LTEuNA0KCQkJbC0wLjgtMC44Yy0wLjMtMC4zLTAuNC0wLjgtMC4xLTEuMmMwLjUtMC44LDAuOC0xLjYsMS0yLjVjMC4xLTAuNSwwLjUtMC44LDEtMC44SDI0di0yaC0xLjJjLTAuNSwwLTAuOS0wLjMtMS0wLjgNCgkJCWMtMC4yLTAuOS0wLjUtMS43LTEtMi41Yy0wLjItMC40LTAuMi0wLjksMC4xLTEuMmwwLjgtMC44bC0xLjQtMS40bC0wLjgsMC44Yy0wLjMsMC4zLTAuOCwwLjQtMS4yLDAuMWMtMC44LTAuNS0xLjYtMC44LTIuNS0xDQoJCQljLTAuNS0wLjEtMC44LTAuNS0wLjgtMVY4OGgtMnYxLjJjMCwwLjUtMC4zLDAuOS0wLjgsMWMtMC45LDAuMi0xLjcsMC41LTIuNSwxYy0wLjQsMC4yLTAuOSwwLjItMS4yLTAuMWwtMC44LTAuOGwtMS40LDEuNA0KCQkJbDAuOCwwLjhjMC4zLDAuMywwLjQsMC44LDAuMSwxLjJjLTAuNSwwLjgtMC44LDEuNi0xLDIuNWMtMC4xLDAuNS0wLjUsMC44LTEsMC44SDR2MmgxLjJjMC41LDAsMC45LDAuMywxLDAuOA0KCQkJYzAuMiwwLjksMC41LDEuNywxLDIuNWMwLjIsMC40LDAuMiwwLjktMC4xLDEuMmwtMC44LDAuOGwxLjQsMS40bDAuOC0wLjhjMC4zLTAuMywwLjgtMC40LDEuMi0wLjFjMC44LDAuNSwxLjYsMC44LDIuNSwxDQoJCQljMC41LDAuMSwwLjgsMC41LDAuOCwxVjEwOHoiLz4NCgk8L2c+DQoJPGc+DQoJCTxwYXRoIGNsYXNzPSJzdDQiIGQ9Ik0xNCwxMDRjLTMuMywwLTYtMi43LTYtNnMyLjctNiw2LTZzNiwyLjcsNiw2UzE3LjMsMTA0LDE0LDEwNHogTTE0LDk0Yy0yLjIsMC00LDEuOC00LDRzMS44LDQsNCw0czQtMS44LDQtNA0KCQkJUzE2LjIsOTQsMTQsOTR6Ii8+DQoJPC9nPg0KPC9nPg0KPGcgaWQ9InRpeC1vbl8xXyI+DQoJPHBhdGggY2xhc3M9InN0NCIgZD0iTTUxLDY1aC0ybC0yLTJ2LTJsLTMtM0wzMCw3MmwzLDNoMmwyLDJ2MmwzLDNsMTQtMTRMNTEsNjV6IE00NC43LDcyLjdDNDQuNSw3Mi45LDQ0LjMsNzMsNDQsNzMNCgkJcy0wLjUtMC4xLTAuNy0wLjNMNDAsNjkuNGwtMS4zLDEuM0MzOC41LDcwLjksMzguMyw3MSwzOCw3MXMtMC41LTAuMS0wLjctMC4zYy0wLjQtMC40LTAuNC0xLDAtMS40bDQtNGMwLjQtMC40LDEtMC40LDEuNCwwDQoJCXMwLjQsMSwwLDEuNEw0MS40LDY4bDMuMywzLjNDNDUuMSw3MS43LDQ1LjEsNzIuMyw0NC43LDcyLjd6Ii8+DQo8L2c+DQo8ZyBpZD0idGl4XzJfIj4NCgk8Zz4NCgkJPHBhdGggY2xhc3M9InN0NCIgZD0iTTEyLDgyYy0wLjMsMC0wLjUtMC4xLTAuNy0wLjNsLTMtM0M4LjEsNzguNSw4LDc4LjMsOCw3OHYtMS42TDcuNiw3Nkg2Yy0wLjMsMC0wLjUtMC4xLTAuNy0wLjNsLTMtMw0KCQkJYy0wLjQtMC40LTAuNC0xLDAtMS40bDEzLTEzYzAuNC0wLjQsMS0wLjQsMS40LDBsMywzYzAuMiwwLjIsMC4zLDAuNCwwLjMsMC43djEuNmwwLjQsMC40SDIyYzAuMywwLDAuNSwwLjEsMC43LDAuM2wzLDMNCgkJCWMwLjQsMC40LDAuNCwxLDAsMS40bC0xMywxM0MxMi41LDgxLjksMTIuMyw4MiwxMiw4MnogTTEwLDc3LjZsMiwyTDIzLjYsNjhsLTItMkgyMGMtMC4zLDAtMC41LTAuMS0wLjctMC4zbC0xLTENCgkJCUMxOC4xLDY0LjUsMTgsNjQuMywxOCw2NHYtMS42bC0yLTJMNC40LDcybDIsMkg4YzAuMywwLDAuNSwwLjEsMC43LDAuM2wxLDFDOS45LDc1LjUsMTAsNzUuNywxMCw3NlY3Ny42eiIvPg0KCTwvZz4NCgk8Zz4NCgkJPHBhdGggY2xhc3M9InN0NCIgZD0iTTEwLDcxYy0wLjMsMC0wLjUtMC4xLTAuNy0wLjNjLTAuNC0wLjQtMC40LTEsMC0xLjRsNC00YzAuNC0wLjQsMS0wLjQsMS40LDBzMC40LDEsMCwxLjRsLTQsNA0KCQkJQzEwLjUsNzAuOSwxMC4zLDcxLDEwLDcxeiIvPg0KCTwvZz4NCgk8Zz4NCgkJPHBhdGggY2xhc3M9InN0NCIgZD0iTTE2LDczYy0wLjMsMC0wLjUtMC4xLTAuNy0wLjNsLTQtNGMtMC40LTAuNC0wLjQtMSwwLTEuNHMxLTAuNCwxLjQsMGw0LDRjMC40LDAuNCwwLjQsMSwwLDEuNA0KCQkJQzE2LjUsNzIuOSwxNi4zLDczLDE2LDczeiIvPg0KCTwvZz4NCjwvZz4NCjxnIGlkPSJyb2J1eC1vbl8xXyI+DQoJPHBhdGggY2xhc3M9InN0NCIgZD0iTTM3LDM5djJoMi42YzAuMS0wLjUsMC4xLTEuNSwwLTJIMzd6Ii8+DQoJPHBhdGggY2xhc3M9InN0NCIgZD0iTTQyLDMwYy02LjYsMC0xMiw1LjQtMTIsMTJzNS40LDEyLDEyLDEyczEyLTUuNCwxMi0xMlM0OC42LDMwLDQyLDMweiBNNDcsNDd2MWMwLDAuNi0wLjQsMS0xLDFzLTEtMC40LTEtMXYtMQ0KCQloLTNjLTAuMiwwLTAuNC0wLjEtMC42LTAuMkwzNyw0My4zVjQ2YzAsMC42LTAuNCwxLTEsMXMtMS0wLjQtMS0xdi04YzAtMC42LDAuNC0xLDEtMWg0YzEuMSwwLDEuNywxLjEsMS43LDMNCgkJYzAsMC42LTAuMSwxLjItMC4yLDEuN0M0MS4xLDQyLjksNDAuMyw0Myw0MCw0M2gtMC4xbDIuNSwySDQ3YzAuMywwLDAuNS0wLjUsMC41LTFjMC0wLjQtMC4xLTEtMC41LTFoLTJjLTEuNCwwLTIuNS0xLjMtMi41LTMNCgkJYzAtMC43LDAuMi0xLjQsMC41LTEuOWMwLjUtMC43LDEuMi0xLjEsMi0xLjF2LTFjMC0wLjYsMC40LTEsMS0xczEsMC40LDEsMXYxaDFjMC42LDAsMSwwLjQsMSwxcy0wLjQsMS0xLDFoLTMNCgkJYy0wLjEsMC0wLjIsMC0wLjMsMC4ycy0wLjIsMC41LTAuMiwwLjhjMCwwLjQsMC4yLDEsMC41LDFoMmMxLjQsMCwyLjUsMS4zLDIuNSwzUzQ4LjQsNDcsNDcsNDd6Ii8+DQo8L2c+DQo8ZyBpZD0icm9idXhfMl8iPg0KCTxnPg0KCQk8cGF0aCBjbGFzcz0ic3Q0IiBkPSJNMTQsNTRDNy40LDU0LDIsNDguNiwyLDQyczUuNC0xMiwxMi0xMnMxMiw1LjQsMTIsMTJTMjAuNiw1NCwxNCw1NHogTTE0LDMyQzguNSwzMiw0LDM2LjUsNCw0MnM0LjUsMTAsMTAsMTANCgkJCXMxMC00LjUsMTAtMTBTMTkuNSwzMiwxNCwzMnoiLz4NCgk8L2c+DQoJPGc+DQoJCTxnPg0KCQkJPHBhdGggY2xhc3M9InN0NCIgZD0iTTE5LDQ3aC01Yy0wLjIsMC0wLjQtMC4xLTAuNi0wLjJMOSw0My4zVjQ2YzAsMC42LTAuNCwxLTEsMXMtMS0wLjQtMS0xdi04YzAtMC42LDAuNC0xLDEtMWg0DQoJCQkJYzEuMSwwLDEuNywxLjEsMS43LDNjMCwwLjYtMC4xLDEuMi0wLjIsMS43QzEzLjEsNDIuOSwxMi4zLDQzLDEyLDQzaC0wLjFsMi41LDJIMTljMC4zLDAsMC41LTAuNSwwLjUtMWMwLTAuNC0wLjEtMS0wLjUtMWgtMg0KCQkJCWMtMS40LDAtMi41LTEuMy0yLjUtM2MwLTAuNywwLjItMS40LDAuNS0xLjljMC41LTAuNywxLjItMS4xLDItMS4xaDNjMC42LDAsMSwwLjQsMSwxcy0wLjQsMS0xLDFoLTNjLTAuMSwwLTAuMiwwLTAuMywwLjINCgkJCQljLTAuMSwwLjItMC4yLDAuNS0wLjIsMC44YzAsMC40LDAuMiwxLDAuNSwxaDJjMS40LDAsMi41LDEuMywyLjUsM1MyMC40LDQ3LDE5LDQ3eiBNOSw0MWgyLjZjMC4xLTAuNSwwLjEtMS41LDAtMkg5VjQxeiIvPg0KCQk8L2c+DQoJCTxnPg0KCQkJPHBhdGggY2xhc3M9InN0NCIgZD0iTTE4LDM4Yy0wLjYsMC0xLTAuNC0xLTF2LTFjMC0wLjYsMC40LTEsMS0xczEsMC40LDEsMXYxQzE5LDM3LjYsMTguNiwzOCwxOCwzOHoiLz4NCgkJPC9nPg0KCQk8Zz4NCgkJCTxwYXRoIGNsYXNzPSJzdDQiIGQ9Ik0xOCw0OWMtMC42LDAtMS0wLjQtMS0xdi0xYzAtMC42LDAuNC0xLDEtMXMxLDAuNCwxLDF2MUMxOSw0OC42LDE4LjYsNDksMTgsNDl6Ii8+DQoJCTwvZz4NCgk8L2c+DQo8L2c+DQo8ZyBpZD0ibWVudS1vbl8xXyI+DQoJPGc+DQoJCTxwYXRoIGNsYXNzPSJzdDQiIGQ9Ik01MCwxMEgzNGMtMC42LDAtMS0wLjQtMS0xczAuNC0xLDEtMWgxNmMwLjYsMCwxLDAuNCwxLDFTNTAuNiwxMCw1MCwxMHoiLz4NCgk8L2c+DQoJPGc+DQoJCTxwYXRoIGNsYXNzPSJzdDQiIGQ9Ik01MCwxNUgzNGMtMC42LDAtMS0wLjQtMS0xczAuNC0xLDEtMWgxNmMwLjYsMCwxLDAuNCwxLDFTNTAuNiwxNSw1MCwxNXoiLz4NCgk8L2c+DQoJPGc+DQoJCTxwYXRoIGNsYXNzPSJzdDQiIGQ9Ik01MCwyMEgzNGMtMC42LDAtMS0wLjQtMS0xczAuNC0xLDEtMWgxNmMwLjYsMCwxLDAuNCwxLDFTNTAuNiwyMCw1MCwyMHoiLz4NCgk8L2c+DQo8L2c+DQo8ZyBpZD0ibWVudV8yXyI+DQoJPGc+DQoJCTxwYXRoIGNsYXNzPSJzdDQiIGQ9Ik0yMiwxMEg2Yy0wLjYsMC0xLTAuNC0xLTFzMC40LTEsMS0xaDE2YzAuNiwwLDEsMC40LDEsMVMyMi42LDEwLDIyLDEweiIvPg0KCTwvZz4NCgk8Zz4NCgkJPHBhdGggY2xhc3M9InN0NCIgZD0iTTIyLDE1SDZjLTAuNiwwLTEtMC40LTEtMXMwLjQtMSwxLTFoMTZjMC42LDAsMSwwLjQsMSwxUzIyLjYsMTUsMjIsMTV6Ii8+DQoJPC9nPg0KCTxnPg0KCQk8cGF0aCBjbGFzcz0ic3Q0IiBkPSJNMjIsMjBINmMtMC42LDAtMS0wLjQtMS0xczAuNC0xLDEtMWgxNmMwLjYsMCwxLDAuNCwxLDFTMjIuNiwyMCwyMiwyMHoiLz4NCgk8L2c+DQo8L2c+DQo8ZyBpZD0ic2VhcmNoXzFfIj4NCgk8Zz4NCgkJPHBhdGggY2xhc3M9InN0MSIgZD0iTTEyLDEzM2MtNSwwLTktNC05LTlzNC05LDktOXM5LDQsOSw5UzE3LDEzMywxMiwxMzN6IE0xMiwxMTdjLTMuOSwwLTcsMy4xLTcsN3MzLjEsNyw3LDdzNy0zLjEsNy03DQoJCQlTMTUuOSwxMTcsMTIsMTE3eiIvPg0KCTwvZz4NCgk8Zz4NCgkJPHBhdGggY2xhc3M9InN0MSIgZD0iTTI0LDEzN2MtMC4zLDAtMC41LTAuMS0wLjctMC4zbC02LTZjLTAuNC0wLjQtMC40LTEsMC0xLjRjMC40LTAuNCwxLTAuNCwxLjQsMGw2LDZjMC40LDAuNCwwLjQsMSwwLDEuNA0KCQkJQzI0LjUsMTM2LjksMjQuMywxMzcsMjQsMTM3eiIvPg0KCTwvZz4NCgk8Zz4NCgkJPHBhdGggY2xhc3M9InN0MSIgZD0iTTE2LDEyNWMtMC42LDAtMS0wLjQtMS0xYzAtMS43LTEuMy0zLTMtM2MtMC42LDAtMS0wLjQtMS0xczAuNC0xLDEtMWMyLjgsMCw1LDIuMiw1LDUNCgkJCUMxNywxMjQuNiwxNi42LDEyNSwxNiwxMjV6Ii8+DQoJPC9nPg0KPC9nPg0KPGcgaWQ9InNlYXJjaF8yXyI+DQoJPGc+DQoJCTxwYXRoIGNsYXNzPSJzdDAiIGQ9Ik00MCwxMzNjLTUsMC05LTQtOS05czQtOSw5LTlzOSw0LDksOVM0NSwxMzMsNDAsMTMzeiBNNDAsMTE3Yy0zLjksMC03LDMuMS03LDdzMy4xLDcsNyw3czctMy4xLDctNw0KCQkJUzQzLjksMTE3LDQwLDExN3oiLz4NCgk8L2c+DQoJPGc+DQoJCTxwYXRoIGNsYXNzPSJzdDAiIGQ9Ik01MiwxMzdjLTAuMywwLTAuNS0wLjEtMC43LTAuM2wtNi02Yy0wLjQtMC40LTAuNC0xLDAtMS40YzAuNC0wLjQsMS0wLjQsMS40LDBsNiw2YzAuNCwwLjQsMC40LDEsMCwxLjQNCgkJCUM1Mi41LDEzNi45LDUyLjMsMTM3LDUyLDEzN3oiLz4NCgk8L2c+DQoJPGc+DQoJCTxwYXRoIGNsYXNzPSJzdDAiIGQ9Ik00NCwxMjVjLTAuNiwwLTEtMC40LTEtMWMwLTEuNy0xLjMtMy0zLTNjLTAuNiwwLTEtMC40LTEtMXMwLjQtMSwxLTFjMi44LDAsNSwyLjIsNSw1DQoJCQlDNDUsMTI0LjYsNDQuNiwxMjUsNDQsMTI1eiIvPg0KCTwvZz4NCjwvZz4NCjxnIGlkPSJzZWFyY2hfNF8iPg0KCTxnPg0KCQk8cGF0aCBjbGFzcz0ic3Q0IiBkPSJNMTIsNDQxYy01LDAtOS00LTktOXM0LTksOS05czksNCw5LDlTMTcsNDQxLDEyLDQ0MXogTTEyLDQyNWMtMy45LDAtNywzLjEtNyw3czMuMSw3LDcsN3M3LTMuMSw3LTcNCgkJCVMxNS45LDQyNSwxMiw0MjV6Ii8+DQoJPC9nPg0KCTxnPg0KCQk8cGF0aCBjbGFzcz0ic3Q0IiBkPSJNMjQsNDQ1Yy0wLjMsMC0wLjUtMC4xLTAuNy0wLjNsLTYtNmMtMC40LTAuNC0wLjQtMSwwLTEuNGMwLjQtMC40LDEtMC40LDEuNCwwbDYsNmMwLjQsMC40LDAuNCwxLDAsMS40DQoJCQlDMjQuNSw0NDQuOSwyNC4zLDQ0NSwyNCw0NDV6Ii8+DQoJPC9nPg0KCTxnPg0KCQk8cGF0aCBjbGFzcz0ic3Q0IiBkPSJNMTYsNDMzYy0wLjYsMC0xLTAuNC0xLTFjMC0xLjctMS4zLTMtMy0zYy0wLjYsMC0xLTAuNC0xLTFzMC40LTEsMS0xYzIuOCwwLDUsMi4yLDUsNQ0KCQkJQzE3LDQzMi42LDE2LjYsNDMzLDE2LDQzM3oiLz4NCgk8L2c+DQo8L2c+DQo8ZyBpZD0ic2VhcmNoXzNfIj4NCgk8Zz4NCgkJPHBhdGggY2xhc3M9InN0MCIgZD0iTTQwLDQ0MWMtNSwwLTktNC05LTlzNC05LDktOXM5LDQsOSw5UzQ1LDQ0MSw0MCw0NDF6IE00MCw0MjVjLTMuOSwwLTcsMy4xLTcsN3MzLjEsNyw3LDdzNy0zLjEsNy03DQoJCQlTNDMuOSw0MjUsNDAsNDI1eiIvPg0KCTwvZz4NCgk8Zz4NCgkJPHBhdGggY2xhc3M9InN0MCIgZD0iTTUyLDQ0NWMtMC4zLDAtMC41LTAuMS0wLjctMC4zbC02LTZjLTAuNC0wLjQtMC40LTEsMC0xLjRjMC40LTAuNCwxLTAuNCwxLjQsMGw2LDZjMC40LDAuNCwwLjQsMSwwLDEuNA0KCQkJQzUyLjUsNDQ0LjksNTIuMyw0NDUsNTIsNDQ1eiIvPg0KCTwvZz4NCgk8Zz4NCgkJPHBhdGggY2xhc3M9InN0MCIgZD0iTTQ0LDQzM2MtMC42LDAtMS0wLjQtMS0xYzAtMS43LTEuMy0zLTMtM2MtMC42LDAtMS0wLjQtMS0xczAuNC0xLDEtMWMyLjgsMCw1LDIuMiw1LDUNCgkJCUM0NSw0MzIuNiw0NC42LDQzMyw0NCw0MzN6Ii8+DQoJPC9nPg0KPC9nPg0KPC9zdmc+DQo=);
    background-repeat: no-repeat;
    background-size: auto auto;
    width: 28px;
    height: 28px;
    display: inline-block;
    vertical-align: middle;
}
.light-theme .icon-nav-forum {
    background-image: url(data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4NCjwhLS0gR2VuZXJhdG9yOiBBZG9iZSBJbGx1c3RyYXRvciAxOS4xLjAsIFNWRyBFeHBvcnQgUGx1Zy1JbiAuIFNWRyBWZXJzaW9uOiA2LjAwIEJ1aWxkIDApICAtLT4NCjwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCI+DQo8c3ZnIHZlcnNpb249IjEuMSIgaWQ9Im5hdmlnYXRpb24iIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHg9IjBweCIgeT0iMHB4IiB3aWR0aD0iNTZweCIgaGVpZ2h0PSI0NzZweCIgdmlld0JveD0iMCAwIDU2IDQ3NiIgc3R5bGU9ImVuYWJsZS1iYWNrZ3JvdW5kOm5ldyAwIDAgNTYgNDc2OyIgeG1sOnNwYWNlPSJwcmVzZXJ2ZSI+DQo8c3R5bGUgdHlwZT0idGV4dC9jc3MiPg0KCS5zdDB7ZmlsbDojMzkzQjNEO30NCgkuc3Qxe2ZpbGw6IzdCN0M3RDt9DQoJLnN0MntmaWxsOiM3Njc4Nzk7fQ0KPC9zdHlsZT4NCjxwYXRoIGlkPSJzaG9wLW9uIiBjbGFzcz0ic3QwIiBkPSJNNTAsNDU3LjljMC0wLjUtMC41LTAuOS0xLTAuOWgtMnYtMmMwLTIuOC0yLjItNS01LTVzLTUsMi4yLTUsNXYyaC0yYy0wLjUsMC0xLDAuNC0xLDAuOWwtMSwxNSAgYzAsMC4zLDAuMSwwLjUsMC4zLDAuOGMwLjIsMC4yLDAuNSwwLjMsMC43LDAuM2gxNmMwLjMsMCwwLjUtMC4xLDAuNy0wLjNjMC4yLTAuMiwwLjMtMC41LDAuMy0wLjhMNTAsNDU3Ljl6IE0zOSw0NTUgIGMwLTEuNywxLjMtMywzLTNzMywxLjMsMywzdjJoLTZWNDU1eiBNMzUuMSw0NzJsMC45LTEzaDF2MmMwLDAuNiwwLjQsMSwxLDFzMS0wLjQsMS0xdi0yaDZ2MmMwLDAuNiwwLjQsMSwxLDFzMS0wLjQsMS0xdi0yaDEuMSAgbDAuOSwxM0gzNS4xeiIvPg0KPHBhdGggaWQ9InNob3AiIGNsYXNzPSJzdDIiIGQ9Ik0yMiw0NTcuOWMwLTAuNS0wLjUtMC45LTEtMC45aC0ydi0yYzAtMi44LTIuMi01LTUtNXMtNSwyLjItNSw1djJIN2MtMC41LDAtMSwwLjQtMSwwLjlsLTEsMTUgIGMwLDAuMywwLjEsMC41LDAuMywwLjhjMC4yLDAuMiwwLjUsMC4zLDAuNywwLjNoMTZjMC4zLDAsMC41LTAuMSwwLjctMC4zYzAuMi0wLjIsMC4zLTAuNSwwLjMtMC44TDIyLDQ1Ny45eiBNMTEsNDU1ICBjMC0xLjcsMS4zLTMsMy0zczMsMS4zLDMsM3YyaC02VjQ1NXogTTcuMSw0NzJMOCw0NTloMXYyYzAsMC42LDAuNCwxLDEsMXMxLTAuNCwxLTF2LTJoNnYyYzAsMC42LDAuNCwxLDEsMXMxLTAuNCwxLTF2LTJoMS4xICBsMC45LDEzSDcuMXoiLz4NCjxnIGlkPSJibG9nLW9uXzFfIj4NCgk8Zz4NCgkJPHBhdGggY2xhc3M9InN0MCIgZD0iTTUxLDQxNmMtMC4xLDAtMC4zLDAtMC40LTAuMUwzNi44LDQxMGgtMS42bC0xLjgsMC45Yy0wLjMsMC4yLTAuNywwLjEtMSwwYy0wLjMtMC4yLTAuNS0wLjUtMC41LTAuOXYtNyAgICBjMC0wLjMsMC4yLTAuNywwLjUtMC45czAuNy0wLjIsMSwwbDEuOCwwLjloMS41bDEzLjgtNi45YzAuMy0wLjIsMC43LTAuMSwxLDBjMC4zLDAuMiwwLjUsMC41LDAuNSwwLjl2MThjMCwwLjMtMC4yLDAuNi0wLjQsMC44ICAgIEM1MS40LDQxNS45LDUxLjIsNDE2LDUxLDQxNnogTTM1LDQwOGgyYzAuMSwwLDAuMywwLDAuNCwwLjFsMTIuNiw1LjR2LTE0LjlsLTEyLjYsNi4zYy0wLjEsMC4xLTAuMywwLjEtMC40LDAuMWgtMiAgICBjLTAuMiwwLTAuMywwLTAuNC0wLjFsLTAuNi0wLjN2My44bDAuNi0wLjNDMzQuNyw0MDgsMzQuOCw0MDgsMzUsNDA4eiIvPg0KCTwvZz4NCgk8Zz4NCgkJPHBhdGggY2xhc3M9InN0MCIgZD0iTTQyLDQxN2MtMC4xLDAtMC4zLDAtMC40LTAuMWwtNi0zYy0wLjMtMC4yLTAuNi0wLjUtMC42LTAuOXYtM2MwLTAuNiwwLjQtMSwxLTFzMSwwLjQsMSwxdjIuNGw0LjYsMi4zICAgIGwxLjYtMy4xYzAuMi0wLjUsMC44LTAuNywxLjMtMC40YzAuNSwwLjIsMC43LDAuOCwwLjQsMS4zbC0yLDRDNDIuNyw0MTYuOCw0Mi40LDQxNyw0Miw0MTd6Ii8+DQoJPC9nPg0KPC9nPg0KPGcgaWQ9ImJsb2dfM18iPg0KCTxnPg0KCQk8cGF0aCBjbGFzcz0ic3QyIiBkPSJNMjMsNDE2Yy0wLjEsMC0wLjMsMC0wLjQtMC4xTDguOCw0MTBINy4ybC0xLjgsMC45Yy0wLjMsMC4yLTAuNywwLjEtMSwwQzQuMiw0MTAuNyw0LDQxMC4zLDQsNDEwdi03ICAgIGMwLTAuMywwLjItMC43LDAuNS0wLjlzMC43LTAuMiwxLDBsMS44LDAuOWgxLjVsMTMuOC02LjljMC4zLTAuMiwwLjctMC4xLDEsMGMwLjMsMC4yLDAuNSwwLjUsMC41LDAuOXYxOGMwLDAuMy0wLjIsMC42LTAuNCwwLjggICAgQzIzLjQsNDE1LjksMjMuMiw0MTYsMjMsNDE2eiBNNyw0MDhoMmMwLjEsMCwwLjMsMCwwLjQsMC4xbDEyLjYsNS40di0xNC45bC0xMi42LDYuM0M5LjMsNDA1LDkuMiw0MDUsOSw0MDVINyAgICBjLTAuMiwwLTAuMywwLTAuNC0wLjFMNiw0MDQuNnYzLjhsMC42LTAuM0M2LjcsNDA4LDYuOCw0MDgsNyw0MDh6Ii8+DQoJPC9nPg0KCTxnPg0KCQk8cGF0aCBjbGFzcz0ic3QyIiBkPSJNMTQsNDE3Yy0wLjEsMC0wLjMsMC0wLjQtMC4xbC02LTNDNy4yLDQxMy43LDcsNDEzLjQsNyw0MTN2LTNjMC0wLjYsMC40LTEsMS0xczEsMC40LDEsMXYyLjRsNC42LDIuMyAgICBsMS42LTMuMWMwLjItMC41LDAuOC0wLjcsMS4zLTAuNGMwLjUsMC4yLDAuNywwLjgsMC40LDEuM2wtMiw0QzE0LjcsNDE2LjgsMTQuNCw0MTcsMTQsNDE3eiIvPg0KCTwvZz4NCjwvZz4NCjxnIGlkPSJmb3J1bS1vbl8xXyI+DQoJPGc+DQoJCTxwYXRoIGNsYXNzPSJzdDAiIGQ9Ik00NiwzODhjLTAuMSwwLTAuMywwLTAuNC0wLjFjLTAuNC0wLjItMC42LTAuNS0wLjYtMC45di0yaC0yYy0wLjYsMC0xLTAuNC0xLTFzMC40LTEsMS0xaDNjMC42LDAsMSwwLjQsMSwxICAgIHYwLjlsMi0xLjZjMC4yLTAuMSwwLjQtMC4yLDAuNi0wLjJINTJ2LTVoLTFjLTAuNiwwLTEtMC40LTEtMWMwLTAuNiwwLjQtMSwxLTFoMmMwLjYsMCwxLDAuNCwxLDF2N2MwLDAuNi0wLjQsMS0xLDFoLTNsLTMuMywyLjggICAgQzQ2LjUsMzg3LjksNDYuMiwzODgsNDYsMzg4eiIvPg0KCTwvZz4NCgk8Zz4NCgkJPHBhdGggY2xhc3M9InN0MCIgZD0iTTM5LDM4N2MtMC4zLDAtMC41LTAuMS0wLjctMC4zbC00LjctNC43SDMxYy0wLjYsMC0xLTAuNC0xLTF2LTEyYzAtMC42LDAuNC0xLDEtMWgxN2MwLjYsMCwxLDAuNCwxLDF2MTIgICAgYzAsMC42LTAuNCwxLTEsMWgtOHY0YzAsMC40LTAuMiwwLjgtMC42LDAuOUMzOS4zLDM4NywzOS4xLDM4NywzOSwzODd6IE0zMiwzODBoMmMwLjMsMCwwLjUsMC4xLDAuNywwLjNsMy4zLDMuM1YzODEgICAgYzAtMC42LDAuNC0xLDEtMWg4di0xMEgzMlYzODB6Ii8+DQoJPC9nPg0KPC9nPg0KPGcgaWQ9ImZvcnVtXzNfIj4NCgk8Zz4NCgkJPHBhdGggY2xhc3M9InN0MiIgZD0iTTE4LDM4OGMtMC4xLDAtMC4zLDAtMC40LTAuMWMtMC40LTAuMi0wLjYtMC41LTAuNi0wLjl2LTJoLTJjLTAuNiwwLTEtMC40LTEtMXMwLjQtMSwxLTFoM2MwLjYsMCwxLDAuNCwxLDEgICAgdjAuOWwyLTEuNmMwLjItMC4xLDAuNC0wLjIsMC42LTAuMkgyNHYtNWgtMWMtMC42LDAtMS0wLjQtMS0xYzAtMC42LDAuNC0xLDEtMWgyYzAuNiwwLDEsMC40LDEsMXY3YzAsMC42LTAuNCwxLTEsMWgtM2wtMy4zLDIuOCAgICBDMTguNSwzODcuOSwxOC4yLDM4OCwxOCwzODh6Ii8+DQoJPC9nPg0KCTxnPg0KCQk8cGF0aCBjbGFzcz0ic3QyIiBkPSJNMTEsMzg3Yy0wLjMsMC0wLjUtMC4xLTAuNy0wLjNMNS42LDM4MkgzYy0wLjYsMC0xLTAuNC0xLTF2LTEyYzAtMC42LDAuNC0xLDEtMWgxN2MwLjYsMCwxLDAuNCwxLDF2MTIgICAgYzAsMC42LTAuNCwxLTEsMWgtOHY0YzAsMC40LTAuMiwwLjgtMC42LDAuOUMxMS4zLDM4NywxMS4xLDM4NywxMSwzODd6IE00LDM4MGgyYzAuMywwLDAuNSwwLjEsMC43LDAuM2wzLjMsMy4zVjM4MSAgICBjMC0wLjYsMC40LTEsMS0xaDh2LTEwSDRWMzgweiIvPg0KCTwvZz4NCjwvZz4NCjxnIGlkPSJncm91cC1vbl8xXyI+DQoJPGc+DQoJCTxwYXRoIGNsYXNzPSJzdDAiIGQ9Ik00MiwzNTBjLTIuOCwwLTUtMi4yLTUtNXMyLjItNSw1LTVzNSwyLjIsNSw1UzQ0LjgsMzUwLDQyLDM1MHogTTQyLDM0MmMtMS43LDAtMywxLjMtMywzczEuMywzLDMsMyAgICBzMy0xLjMsMy0zUzQzLjcsMzQyLDQyLDM0MnoiLz4NCgk8L2c+DQoJPGc+DQoJCTxwYXRoIGNsYXNzPSJzdDAiIGQ9Ik00MiwzNjFjLTQuMiwwLTYuNi0yLjItNi43LTIuM2MtMC4yLTAuMi0wLjMtMC41LTAuMy0wLjhjMC4xLTEuNywwLjQtNC43LDEuMy01LjdzMy45LTEuMiw1LjctMS4zaDAuMSAgICBjMS43LDAuMSw0LjcsMC40LDUuNywxLjNjMSwwLjksMS4yLDMuOSwxLjMsNS43YzAsMC4zLTAuMSwwLjYtMC4zLDAuOEM0OC42LDM1OC44LDQ2LjIsMzYxLDQyLDM2MXogTTM3LDM1Ny41ICAgIGMwLjcsMC41LDIuNCwxLjUsNSwxLjVzNC4zLTEsNS0xLjVjLTAuMS0xLjgtMC40LTMuNS0wLjctMy45Yy0wLjMtMC4yLTIuNC0wLjYtNC4zLTAuN2MtMS45LDAuMS0zLjksMC40LTQuMywwLjcgICAgQzM3LjUsMzU0LDM3LjIsMzU1LjgsMzcsMzU3LjV6Ii8+DQoJPC9nPg0KCTxnPg0KCQk8Zz4NCgkJCTxwYXRoIGNsYXNzPSJzdDAiIGQ9Ik0zNiwzNTFjLTIuMiwwLTQtMS44LTQtNGMwLTEuNywxLjEtMy4yLDIuNy0zLjhjMC41LTAuMiwxLjEsMC4xLDEuMywwLjZzLTAuMSwxLjEtMC42LDEuMyAgICAgYy0wLjgsMC4zLTEuMywxLTEuMywxLjljMCwxLjEsMC45LDIsMiwyYzAuNiwwLDEsMC40LDEsMVMzNi42LDM1MSwzNiwzNTF6Ii8+DQoJCTwvZz4NCgkJPGc+DQoJCQk8cGF0aCBjbGFzcz0ic3QwIiBkPSJNMzMsMzU4Yy0wLjEsMC0wLjEsMC0wLjIsMGMtMS4zLTAuMy0yLjMtMS4xLTIuNC0xLjJjLTAuMy0wLjItMC40LTAuNi0wLjMtMWMwLjMtMS40LDAuOC0zLjksMS42LTQuNiAgICAgYzAuNC0wLjQsMy4zLTIsNC4yLTIuMmMwLjUtMC4xLDEuMSwwLjMsMS4yLDAuOHMtMC4zLDEuMS0wLjgsMS4ycy0yLjgsMS4zLTMuMiwxLjdjLTAuMiwwLjItMC42LDEuNS0wLjksMi45ICAgICBjMC4zLDAuMiwwLjcsMC40LDEuMSwwLjVjMC41LDAuMSwwLjksMC42LDAuOCwxLjJDMzMuOSwzNTcuNywzMy41LDM1OCwzMywzNTh6Ii8+DQoJCTwvZz4NCgkJPGc+DQoJCQk8cGF0aCBjbGFzcz0ic3QwIiBkPSJNNDgsMzUxYy0wLjYsMC0xLTAuNC0xLTFzMC40LTEsMS0xYzEuMSwwLDItMC45LDItMmMwLTAuOC0wLjUtMS42LTEuMy0xLjljLTAuNS0wLjItMC44LTAuOC0wLjYtMS4zICAgICBzMC44LTAuOCwxLjMtMC42YzEuNiwwLjYsMi43LDIuMSwyLjcsMy44QzUyLDM0OS4yLDUwLjIsMzUxLDQ4LDM1MXoiLz4NCgkJPC9nPg0KCQk8Zz4NCgkJCTxwYXRoIGNsYXNzPSJzdDAiIGQ9Ik01MSwzNThjLTAuNSwwLTAuOS0wLjMtMS0wLjhzMC4yLTEuMSwwLjgtMS4yYzAuNC0wLjEsMC44LTAuMywxLjEtMC41Yy0wLjMtMS40LTAuNy0yLjctMC45LTMgICAgIGMtMC40LTAuMy0yLjYtMS41LTMuMS0xLjZzLTAuOS0wLjYtMC44LTEuMmMwLjEtMC41LDAuNi0wLjksMS4xLTAuOGMwLjksMC4yLDMuOCwxLjgsNC4yLDIuMmMwLjgsMC44LDEuMywzLjIsMS42LDQuNiAgICAgYzAuMSwwLjQtMC4xLDAuNy0wLjMsMWMtMC4xLDAuMS0xLjEsMC45LTIuNCwxLjJDNTEuMSwzNTgsNTEuMSwzNTgsNTEsMzU4eiIvPg0KCQk8L2c+DQoJPC9nPg0KPC9nPg0KPGcgaWQ9Imdyb3VwXzNfIj4NCgk8Zz4NCgkJPHBhdGggY2xhc3M9InN0MiIgZD0iTTE0LDM1MGMtMi44LDAtNS0yLjItNS01czIuMi01LDUtNXM1LDIuMiw1LDVTMTYuOCwzNTAsMTQsMzUweiBNMTQsMzQyYy0xLjcsMC0zLDEuMy0zLDNzMS4zLDMsMywzICAgIHMzLTEuMywzLTNTMTUuNywzNDIsMTQsMzQyeiIvPg0KCTwvZz4NCgk8Zz4NCgkJPHBhdGggY2xhc3M9InN0MiIgZD0iTTE0LDM2MWMtNC4yLDAtNi42LTIuMi02LjctMi4zYy0wLjItMC4yLTAuMy0wLjUtMC4zLTAuOGMwLjEtMS43LDAuNC00LjcsMS4zLTUuN3MzLjktMS4yLDUuNy0xLjNoMC4xICAgIGMxLjcsMC4xLDQuNywwLjQsNS43LDEuM2MxLDAuOSwxLjIsMy45LDEuMyw1LjdjMCwwLjMtMC4xLDAuNi0wLjMsMC44QzIwLjYsMzU4LjgsMTguMiwzNjEsMTQsMzYxeiBNOSwzNTcuNSAgICBjMC43LDAuNSwyLjQsMS41LDUsMS41czQuMy0xLDUtMS41Yy0wLjEtMS44LTAuNC0zLjUtMC43LTMuOWMtMC4zLTAuMi0yLjQtMC42LTQuMy0wLjdjLTEuOSwwLjEtMy45LDAuNC00LjMsMC43ICAgIEM5LjUsMzU0LDkuMiwzNTUuOCw5LDM1Ny41eiIvPg0KCTwvZz4NCgk8Zz4NCgkJPGc+DQoJCQk8cGF0aCBjbGFzcz0ic3QyIiBkPSJNOCwzNTFjLTIuMiwwLTQtMS44LTQtNGMwLTEuNywxLjEtMy4yLDIuNy0zLjhjMC41LTAuMiwxLjEsMC4xLDEuMywwLjZjMC4yLDAuNS0wLjEsMS4xLTAuNiwxLjMgICAgIGMtMC44LDAuMy0xLjMsMS0xLjMsMS45YzAsMS4xLDAuOSwyLDIsMmMwLjYsMCwxLDAuNCwxLDFTOC42LDM1MSw4LDM1MXoiLz4NCgkJPC9nPg0KCQk8Zz4NCgkJCTxwYXRoIGNsYXNzPSJzdDIiIGQ9Ik01LDM1OGMtMC4xLDAtMC4xLDAtMC4yLDBjLTEuMy0wLjMtMi4zLTEuMS0yLjQtMS4yYy0wLjMtMC4yLTAuNC0wLjYtMC4zLTFjMC4zLTEuNCwwLjgtMy45LDEuNi00LjYgICAgIGMwLjQtMC40LDMuMy0yLDQuMi0yLjJjMC41LTAuMSwxLjEsMC4zLDEuMiwwLjhzLTAuMywxLjEtMC44LDEuMnMtMi44LDEuMy0zLjIsMS43Yy0wLjIsMC4yLTAuNiwxLjUtMC45LDIuOSAgICAgYzAuMywwLjIsMC43LDAuNCwxLjEsMC41YzAuNSwwLjEsMC45LDAuNiwwLjgsMS4yQzUuOSwzNTcuNyw1LjUsMzU4LDUsMzU4eiIvPg0KCQk8L2c+DQoJCTxnPg0KCQkJPHBhdGggY2xhc3M9InN0MiIgZD0iTTIwLDM1MWMtMC42LDAtMS0wLjQtMS0xczAuNC0xLDEtMWMxLjEsMCwyLTAuOSwyLTJjMC0wLjgtMC41LTEuNi0xLjMtMS45Yy0wLjUtMC4yLTAuOC0wLjgtMC42LTEuMyAgICAgYzAuMi0wLjUsMC44LTAuOCwxLjMtMC42YzEuNiwwLjYsMi43LDIuMSwyLjcsMy44QzI0LDM0OS4yLDIyLjIsMzUxLDIwLDM1MXoiLz4NCgkJPC9nPg0KCQk8Zz4NCgkJCTxwYXRoIGNsYXNzPSJzdDIiIGQ9Ik0yMywzNThjLTAuNSwwLTAuOS0wLjMtMS0wLjhzMC4yLTEuMSwwLjgtMS4yYzAuNC0wLjEsMC44LTAuMywxLjEtMC41Yy0wLjMtMS40LTAuNy0yLjctMC45LTMgICAgIGMtMC40LTAuMy0yLjYtMS41LTMuMS0xLjZzLTAuOS0wLjYtMC44LTEuMmMwLjEtMC41LDAuNi0wLjksMS4xLTAuOGMwLjksMC4yLDMuOCwxLjgsNC4yLDIuMmMwLjgsMC44LDEuMywzLjIsMS42LDQuNiAgICAgYzAuMSwwLjQtMC4xLDAuNy0wLjMsMWMtMC4xLDAuMS0xLjEsMC45LTIuNCwxLjJDMjMuMSwzNTgsMjMuMSwzNTgsMjMsMzU4eiIvPg0KCQk8L2c+DQoJPC9nPg0KPC9nPg0KPGcgaWQ9InRyYWRlLW9uXzFfIj4NCgk8Zz4NCgkJPHBhdGggY2xhc3M9InN0MCIgZD0iTTM0LDMyM2MtMC4yLDAtMC4zLDAtMC40LTAuMWMtMC4zLTAuMi0wLjYtMC41LTAuNi0wLjl2LTVjMC0wLjMsMC4xLTAuNiwwLjQtMC44bDQtMyAgICBjMC4yLTAuMSwwLjQtMC4yLDAuNi0wLjJoNXYtMmMwLTAuNCwwLjItMC44LDAuNi0wLjljMC40LTAuMiwwLjgtMC4xLDEuMSwwLjJsOSw4YzAuMywwLjMsMC40LDAuNywwLjMsMS4xcy0wLjYsMC42LTEsMC42SDM4LjMgICAgbC0zLjcsMi44QzM0LjQsMzIyLjksMzQuMiwzMjMsMzQsMzIzeiBNMzUsMzE3LjV2Mi41bDIuNC0xLjhjMC4yLTAuMSwwLjQtMC4yLDAuNi0wLjJoMTIuNGwtNS40LTQuOHYwLjhjMCwwLjYtMC40LDEtMSwxaC01LjcgICAgTDM1LDMxNy41eiIvPg0KCTwvZz4NCgk8Zz4NCgkJPHBhdGggY2xhc3M9InN0MCIgZD0iTTQwLDMzNGMtMC4yLDAtMC41LTAuMS0wLjctMC4zbC05LThjLTAuMy0wLjMtMC40LTAuNy0wLjMtMS4xYzAuMS0wLjQsMC41LTAuNiwwLjktMC42aDE0LjdsMy43LTIuOCAgICBjMC4zLTAuMiwwLjctMC4zLDEtMC4xYzAuMywwLjIsMC42LDAuNSwwLjYsMC45djVjMCwwLjMtMC4xLDAuNi0wLjQsMC44bC00LDNjLTAuMiwwLjEtMC40LDAuMi0wLjYsMC4yaC01djIgICAgYzAsMC40LTAuMiwwLjgtMC42LDAuOUM0MC4zLDMzNCw0MC4xLDMzNCw0MCwzMzR6IE0zMy42LDMyNmw1LjQsNC44VjMzMGMwLTAuNiwwLjQtMSwxLTFoNS43bDMuMy0yLjVWMzI0bC0yLjQsMS44ICAgIGMtMC4yLDAuMS0wLjQsMC4yLTAuNiwwLjJIMzMuNnoiLz4NCgk8L2c+DQo8L2c+DQo8ZyBpZD0idHJhZGVfM18iPg0KCTxnPg0KCQk8cGF0aCBjbGFzcz0ic3QyIiBkPSJNNiwzMjNjLTAuMiwwLTAuMywwLTAuNC0wLjFDNS4yLDMyMi43LDUsMzIyLjQsNSwzMjJ2LTVjMC0wLjMsMC4xLTAuNiwwLjQtMC44bDQtM2MwLjItMC4xLDAuNC0wLjIsMC42LTAuMiAgICBoNXYtMmMwLTAuNCwwLjItMC44LDAuNi0wLjljMC40LTAuMiwwLjgtMC4xLDEuMSwwLjJsOSw4YzAuMywwLjMsMC40LDAuNywwLjMsMS4xcy0wLjYsMC42LTEsMC42SDEwLjNsLTMuNywyLjggICAgQzYuNCwzMjIuOSw2LjIsMzIzLDYsMzIzeiBNNywzMTcuNXYyLjVsMi40LTEuOGMwLjItMC4xLDAuNC0wLjIsMC42LTAuMmgxMi40bC01LjQtNC44djAuOGMwLDAuNi0wLjQsMS0xLDFoLTUuN0w3LDMxNy41eiIvPg0KCTwvZz4NCgk8Zz4NCgkJPHBhdGggY2xhc3M9InN0MiIgZD0iTTEyLDMzNGMtMC4yLDAtMC41LTAuMS0wLjctMC4zbC05LThDMiwzMjUuNCwxLjksMzI1LDIsMzI0LjZjMC4xLTAuNCwwLjYtMC42LDEtMC42aDE0LjdsMy43LTIuOCAgICBjMC4zLTAuMiwwLjctMC4zLDEtMC4xYzAuMywwLjIsMC42LDAuNSwwLjYsMC45djVjMCwwLjMtMC4xLDAuNi0wLjQsMC44bC00LDNjLTAuMiwwLjEtMC40LDAuMi0wLjYsMC4yaC01djIgICAgYzAsMC40LTAuMiwwLjgtMC42LDAuOUMxMi4zLDMzNCwxMi4xLDMzNCwxMiwzMzR6IE01LjYsMzI2bDUuNCw0LjhWMzMwYzAtMC42LDAuNC0xLDEtMWg1LjdsMy4zLTIuNVYzMjRsLTIuNCwxLjggICAgYy0wLjIsMC4xLTAuNCwwLjItMC42LDAuMkg1LjZ6Ii8+DQoJPC9nPg0KPC9nPg0KPGcgaWQ9ImludmVudG9yeS1vbl8xXyI+DQoJPGc+DQoJCTxwYXRoIGQ9Ik01MCwzMDZIMzRjLTAuNiwwLTEtMC40LTEtMXYtMTRjMC0yLjgsMi4yLTUsNS01aDhjMi44LDAsNSwyLjIsNSw1djE0QzUxLDMwNS42LDUwLjYsMzA2LDUwLDMwNnogTTM1LDMwNGgxNCAgICB2LTEzYzAtMS43LTEuMy0zLTMtM2gtOGMtMS43LDAtMywxLjMtMywzVjMwNHoiIGNsYXNzPSJzdDAiLz4NCgk8L2c+DQoJPGc+DQoJCTxwYXRoIGQ9Ik0zOCwyOTljLTAuNiwwLTEtMC40LTEtMXYtMmMwLTAuNiwwLjQtMSwxLTFzMSwwLjQsMSwxdjJDMzksMjk4LjYsMzguNiwyOTksMzgsMjk5eiIgY2xhc3M9InN0MCIvPg0KCTwvZz4NCgk8Zz4NCgkJPHBhdGggZD0iTTQ2LDI5OWMtMC42LDAtMS0wLjQtMS0xdi0yYzAtMC42LDAuNC0xLDEtMXMxLDAuNCwxLDF2MkM0NywyOTguNiw0Ni42LDI5OSw0NiwyOTl6IiBjbGFzcz0ic3QwIi8+DQoJPC9nPg0KCTxnPg0KCQk8cGF0aCBkPSJNNDUuNSwyODhjLTAuNiwwLTEtMC40LTEtMXYtMC41YzAtMS40LTEuMS0yLjUtMi41LTIuNXMtMi41LDEuMS0yLjUsMi41djAuNWMwLDAuNi0wLjQsMS0xLDFzLTEtMC40LTEtMSAgICB2LTAuNWMwLTIuNSwyLTQuNSw0LjUtNC41czQuNSwyLDQuNSw0LjV2MC41QzQ2LjUsMjg3LjYsNDYuMSwyODgsNDUuNSwyODh6IiBjbGFzcz0ic3QwIi8+DQoJPC9nPg0KCTxnPg0KCQk8cGF0aCBkPSJNNDQuOSwyOTdoLTUuOGMtMi4zLDAtNC4zLTEuMy01LjQtMy4zbC0wLjYtMS4ybDEuOC0wLjlsMC42LDEuMmMwLjcsMS40LDIuMSwyLjIsMy42LDIuMmg1LjggICAgYzEuNSwwLDIuOS0wLjgsMy42LTIuMmwwLjYtMS4ybDEuOCwwLjlsLTAuNiwxLjJDNDkuMywyOTUuNyw0Ny4yLDI5Nyw0NC45LDI5N3oiIGNsYXNzPSJzdDAiLz4NCgk8L2c+DQo8L2c+DQo8ZyBpZD0iaW52ZW50b3J5XzFfIj4NCgk8Zz4NCgkJPHBhdGggY2xhc3M9InN0MiIgZD0iTTIyLDMwNkg2Yy0wLjYsMC0xLTAuNC0xLTF2LTE0YzAtMi44LDIuMi01LDUtNWg4YzIuOCwwLDUsMi4yLDUsNXYxNEMyMywzMDUuNiwyMi42LDMwNiwyMiwzMDZ6IE03LDMwNGgxNCAgICB2LTEzYzAtMS43LTEuMy0zLTMtM2gtOGMtMS43LDAtMywxLjMtMywzVjMwNHoiLz4NCgk8L2c+DQoJPGc+DQoJCTxwYXRoIGNsYXNzPSJzdDIiIGQ9Ik0xMCwyOTljLTAuNiwwLTEtMC40LTEtMXYtMmMwLTAuNiwwLjQtMSwxLTFzMSwwLjQsMSwxdjJDMTEsMjk4LjYsMTAuNiwyOTksMTAsMjk5eiIvPg0KCTwvZz4NCgk8Zz4NCgkJPHBhdGggY2xhc3M9InN0MiIgZD0iTTE4LDI5OWMtMC42LDAtMS0wLjQtMS0xdi0yYzAtMC42LDAuNC0xLDEtMXMxLDAuNCwxLDF2MkMxOSwyOTguNiwxOC42LDI5OSwxOCwyOTl6Ii8+DQoJPC9nPg0KCTxnPg0KCQk8cGF0aCBjbGFzcz0ic3QyIiBkPSJNMTcuNSwyODhjLTAuNiwwLTEtMC40LTEtMXYtMC41YzAtMS40LTEuMS0yLjUtMi41LTIuNXMtMi41LDEuMS0yLjUsMi41djAuNWMwLDAuNi0wLjQsMS0xLDFzLTEtMC40LTEtMSAgICB2LTAuNWMwLTIuNSwyLTQuNSw0LjUtNC41czQuNSwyLDQuNSw0LjV2MC41QzE4LjUsMjg3LjYsMTguMSwyODgsMTcuNSwyODh6Ii8+DQoJPC9nPg0KCTxnPg0KCQk8cGF0aCBjbGFzcz0ic3QyIiBkPSJNMTYuOSwyOTdoLTUuOGMtMi4zLDAtNC4zLTEuMy01LjQtMy4zbC0wLjYtMS4ybDEuOC0wLjlsMC42LDEuMmMwLjcsMS40LDIuMSwyLjIsMy42LDIuMmg1LjggICAgYzEuNSwwLDIuOS0wLjgsMy42LTIuMmwwLjYtMS4ybDEuOCwwLjlsLTAuNiwxLjJDMjEuMywyOTUuNywxOS4yLDI5NywxNi45LDI5N3oiLz4NCgk8L2c+DQo8L2c+DQo8ZyBpZD0iY2hhcmFjdGVyLW9uIj4NCgk8cGF0aCBkPSJNMzksMjYyYzIuMiwwLDQtMS44LDQtNGMwLTIuMi0xLjgtNC00LTRzLTQsMS44LTQsNEMzNSwyNjAuMiwzNi44LDI2MiwzOSwyNjJ6IE0zOSwyNTZjMS4xLDAsMiwwLjksMiwyICAgcy0wLjksMi0yLDJjLTEuMSwwLTItMC45LTItMlMzNy45LDI1NiwzOSwyNTZ6IiBjbGFzcz0ic3QwIi8+DQoJPHBhdGggZD0iTTM5LjQsMjcwLjFjLTAuNS0wLjItMS4xLDAtMS4zLDAuNGwtMi43LDUuNWgtMS4ybDEuNy03LjhjMC4xLTAuNS0wLjItMS4xLTAuNy0xLjJsLTMuMi0wLjhWMjY1aDEwICAgYzAuNiwwLDEtMC40LDEtMXMtMC40LTEtMS0xSDMxYy0wLjYsMC0xLDAuNC0xLDF2M2MwLDAuNSwwLjMsMC45LDAuOCwxbDMuMSwwLjhsLTEuOCw4Yy0wLjEsMC4zLDAsMC42LDAuMiwwLjggICBjMC4yLDAuMiwwLjUsMC40LDAuOCwwLjRoM2MwLjQsMCwwLjctMC4yLDAuOS0wLjZsMy02QzQwLjEsMjcxLDM5LjksMjcwLjQsMzkuNCwyNzAuMXoiIGNsYXNzPSJzdDAiLz4NCgk8cGF0aCBkPSJNNTMuOCwyNTcuNGMtMC4yLTAuMy0wLjUtMC40LTAuOC0wLjRoLTJjLTAuMywwLTAuNiwwLjItMC44LDAuNGwtNywxMGMtMC4yLDAuMi0wLjIsMC42LTAuMSwwLjkgICBjMC4xLDAuMywwLjMsMC41LDAuNiwwLjZsNSwyYzAuMSwwLDAuMiwwLjEsMC40LDAuMWMwLjEsMCwwLjMsMCwwLjQtMC4xYzAuMi0wLjEsMC40LTAuMywwLjUtMC42bDQtMTIgICBDNTQuMSwyNTgsNTQsMjU3LjcsNTMuOCwyNTcuNHogTTQ4LjQsMjY4LjdsLTIuOC0xLjFsNi04LjVoMC4xTDQ4LjQsMjY4Ljd6IiBjbGFzcz0ic3QwIi8+DQoJPHBhdGggZD0iTTQ0LDI3MGMtMi42LDAtMy4yLDEuOS0zLjYsMy41Yy0wLjMsMC45LTAuNiwxLjktMS4yLDNjLTAuMiwwLjMtMC4yLDAuNywwLDFjMC4yLDAuMywwLjUsMC41LDAuOSwwLjUgICBjNywwLDgtMi41LDgtNEM0OCwyNzEuNCw0NS43LDI3MCw0NCwyNzB6IE00MS43LDI3NS45YzAuMy0wLjcsMC41LTEuMywwLjYtMS45YzAuNS0xLjcsMC43LTIuMSwxLjctMi4xYzAuNSwwLDIsMC41LDIsMiAgIEM0NiwyNzUsNDQuMywyNzUuNyw0MS43LDI3NS45eiIgY2xhc3M9InN0MCIvPg0KPC9nPg0KPGcgaWQ9ImNoYXJhY3Rlcl8xXyI+DQoJPHBhdGggY2xhc3M9InN0MiIgZD0iTTExLDI2MmMyLjIsMCw0LTEuOCw0LTRjMC0yLjItMS44LTQtNC00cy00LDEuOC00LDRDNywyNjAuMiw4LjgsMjYyLDExLDI2MnogTTExLDI1NmMxLjEsMCwyLDAuOSwyLDIgICBzLTAuOSwyLTIsMnMtMi0wLjktMi0yUzkuOSwyNTYsMTEsMjU2eiIvPg0KCTxwYXRoIGNsYXNzPSJzdDIiIGQ9Ik0xMS40LDI3MC4xYy0wLjUtMC4yLTEuMSwwLTEuMywwLjRMNy40LDI3Nkg2LjJsMS43LTcuOGMwLjEtMC41LTAuMi0xLjEtMC43LTEuMkw0LDI2Ni4yVjI2NWgxMCAgIGMwLjYsMCwxLTAuNCwxLTFzLTAuNC0xLTEtMUgzYy0wLjYsMC0xLDAuNC0xLDF2M2MwLDAuNSwwLjMsMC45LDAuOCwxbDMuMSwwLjhsLTEuOCw4Yy0wLjEsMC4zLDAsMC42LDAuMiwwLjggICBjMC4yLDAuMiwwLjUsMC40LDAuOCwwLjRoM2MwLjQsMCwwLjctMC4yLDAuOS0wLjZsMy02QzEyLjEsMjcxLDExLjksMjcwLjQsMTEuNCwyNzAuMXoiLz4NCgk8cGF0aCBjbGFzcz0ic3QyIiBkPSJNMjUuOCwyNTcuNGMtMC4yLTAuMy0wLjUtMC40LTAuOC0wLjRoLTJjLTAuMywwLTAuNiwwLjItMC44LDAuNGwtNywxMGMtMC4yLDAuMi0wLjIsMC42LTAuMSwwLjkgICBjMC4xLDAuMywwLjMsMC41LDAuNiwwLjZsNSwyYzAuMSwwLDAuMiwwLjEsMC40LDAuMWMwLjEsMCwwLjMsMCwwLjQtMC4xYzAuMi0wLjEsMC40LTAuMywwLjUtMC42bDQtMTIgICBDMjYuMSwyNTgsMjYsMjU3LjcsMjUuOCwyNTcuNHogTTIwLjQsMjY4LjdsLTIuOC0xLjFsNi04LjVoMC4xTDIwLjQsMjY4Ljd6Ii8+DQoJPHBhdGggY2xhc3M9InN0MiIgZD0iTTE2LDI3MGMtMi42LDAtMy4yLDEuOS0zLjYsMy41Yy0wLjMsMC45LTAuNiwxLjktMS4yLDNjLTAuMiwwLjMtMC4yLDAuNywwLDFzMC41LDAuNSwwLjksMC41YzcsMCw4LTIuNSw4LTQgICBDMjAsMjcxLjQsMTcuNywyNzAsMTYsMjcweiBNMTMuNywyNzUuOWMwLjMtMC43LDAuNS0xLjMsMC42LTEuOWMwLjUtMS43LDAuNy0yLjEsMS43LTIuMWMwLjUsMCwyLDAuNSwyLDIgICBDMTgsMjc1LDE2LjMsMjc1LjcsMTMuNywyNzUuOXoiLz4NCjwvZz4NCjxnIGlkPSJmcmllbmRzLW9uXzFfIj4NCgk8Zz4NCgkJPHBhdGggY2xhc3M9InN0MCIgZD0iTTM5LDIzOGMtMy4zLDAtNi0yLjctNi02czIuNy02LDYtNnM2LDIuNyw2LDZTNDIuMywyMzgsMzksMjM4eiBNMzksMjI4Yy0yLjIsMC00LDEuOC00LDRzMS44LDQsNCw0ICAgIHM0LTEuOCw0LTRTNDEuMiwyMjgsMzksMjI4eiIvPg0KCTwvZz4NCgk8Zz4NCgkJPHBhdGggY2xhc3M9InN0MCIgZD0iTTQ3LDIzOC42Yy0wLjQsMC0wLjgtMC4yLTAuOS0wLjZjLTAuMi0wLjUsMC0xLjEsMC41LTEuM2MxLjUtMC42LDIuNC0yLjEsMi40LTMuN2MwLTEuOS0xLjMtMy41LTMuMi0zLjkgICAgYy0wLjUtMC4xLTAuOS0wLjYtMC44LTEuMmMwLjEtMC41LDAuNi0wLjksMS4yLTAuOGMyLjgsMC42LDQuOCwzLDQuOCw1LjljMCwyLjQtMS40LDQuNS0zLjYsNS41QzQ3LjMsMjM4LjYsNDcuMSwyMzguNiw0NywyMzguNnogICAgIi8+DQoJPC9nPg0KCTxnPg0KCQk8cGF0aCBjbGFzcz0ic3QwIiBkPSJNMzksMjUwYy01LjIsMC04LjQtMi4xLTguNS0yLjJjLTAuMy0wLjItMC41LTAuNi0wLjQtMWMwLjItMS4yLDEuMS01LjQsMi4zLTYuNWMxLjItMS4yLDUuMS0xLjMsNi43LTEuMyAgICBjMS42LDAsNS41LDAuMSw2LjcsMS4zYzEuMSwxLjEsMiw1LjMsMi4zLDYuNWMwLjEsMC40LTAuMSwwLjgtMC40LDFDNDcuNCwyNDcuOSw0NC4yLDI1MCwzOSwyNTB6IE0zMi4xLDI0Ni41ICAgIGMxLjEsMC41LDMuNSwxLjUsNi45LDEuNXM1LjgtMSw2LjktMS41Yy0wLjUtMi4xLTEuMi00LjMtMS42LTQuOGMtMC40LTAuNC0yLjktMC43LTUuMy0wLjdzLTQuOSwwLjMtNS4zLDAuNyAgICBDMzMuMywyNDIuMSwzMi42LDI0NC40LDMyLjEsMjQ2LjV6Ii8+DQoJPC9nPg0KCTxnPg0KCQk8cGF0aCBjbGFzcz0ic3QwIiBkPSJNNTAsMjQ5Yy0wLjQsMC0wLjgtMC4zLTEtMC43Yy0wLjItMC41LDAuMS0xLjEsMC43LTEuMmMxLjEtMC4zLDEuOC0xLDIuMi0xLjNjLTAuNS0yLjItMS4yLTQuNi0xLjYtNSAgICBjLTAuNi0wLjYtMi42LTItMy40LTIuMWMtMC41LTAuMS0wLjktMC42LTAuOS0xLjFjMC4xLTAuNSwwLjUtMSwxLjEtMC45YzEuNywwLjIsNC4zLDIuNCw0LjYsMi43YzEuMSwxLjEsMiw1LjMsMi4zLDYuNSAgICBjMC4xLDAuMywwLDAuNi0wLjIsMC44Yy0wLjEsMC4xLTEuMywxLjctMy41LDIuNEM1MC4yLDI0OSw1MC4xLDI0OSw1MCwyNDl6Ii8+DQoJPC9nPg0KPC9nPg0KPGcgaWQ9ImZyaWVuZHNfM18iPg0KCTxnPg0KCQk8cGF0aCBjbGFzcz0ic3QyIiBkPSJNMTEsMjM4Yy0zLjMsMC02LTIuNy02LTZzMi43LTYsNi02czYsMi43LDYsNlMxNC4zLDIzOCwxMSwyMzh6IE0xMSwyMjhjLTIuMiwwLTQsMS44LTQsNHMxLjgsNCw0LDQgICAgczQtMS44LDQtNFMxMy4yLDIyOCwxMSwyMjh6Ii8+DQoJPC9nPg0KCTxnPg0KCQk8cGF0aCBjbGFzcz0ic3QyIiBkPSJNMTksMjM4LjZjLTAuNCwwLTAuOC0wLjItMC45LTAuNmMtMC4yLTAuNSwwLTEuMSwwLjUtMS4zYzEuNS0wLjYsMi40LTIuMSwyLjQtMy43YzAtMS45LTEuMy0zLjUtMy4yLTMuOSAgICBjLTAuNS0wLjEtMC45LTAuNi0wLjgtMS4yYzAuMS0wLjUsMC42LTAuOSwxLjItMC44YzIuOCwwLjYsNC44LDMsNC44LDUuOWMwLDIuNC0xLjQsNC41LTMuNiw1LjVDMTkuMywyMzguNiwxOS4xLDIzOC42LDE5LDIzOC42eiAgICAiLz4NCgk8L2c+DQoJPGc+DQoJCTxwYXRoIGNsYXNzPSJzdDIiIGQ9Ik0xMSwyNTBjLTUuMiwwLTguNC0yLjEtOC41LTIuMmMtMC4zLTAuMi0wLjUtMC42LTAuNC0xYzAuMi0xLjIsMS4xLTUuNCwyLjMtNi41YzEuMi0xLjIsNS4xLTEuMyw2LjctMS4zICAgIHM1LjUsMC4xLDYuNywxLjNjMS4xLDEuMSwyLDUuMywyLjMsNi41YzAuMSwwLjQtMC4xLDAuOC0wLjQsMUMxOS40LDI0Ny45LDE2LjIsMjUwLDExLDI1MHogTTQuMSwyNDYuNUM1LjIsMjQ3LDcuNiwyNDgsMTEsMjQ4ICAgIHM1LjgtMSw2LjktMS41Yy0wLjUtMi4xLTEuMi00LjMtMS42LTQuOGMtMC40LTAuNC0yLjktMC43LTUuMy0wLjdzLTQuOSwwLjMtNS4zLDAuN0M1LjMsMjQyLjEsNC42LDI0NC40LDQuMSwyNDYuNXoiLz4NCgk8L2c+DQoJPGc+DQoJCTxwYXRoIGNsYXNzPSJzdDIiIGQ9Ik0yMiwyNDljLTAuNCwwLTAuOC0wLjMtMS0wLjdjLTAuMi0wLjUsMC4xLTEuMSwwLjctMS4yYzEuMS0wLjMsMS44LTEsMi4yLTEuM2MtMC41LTIuMi0xLjItNC42LTEuNi01ICAgIGMtMC42LTAuNi0yLjYtMi0zLjQtMi4xYy0wLjUtMC4xLTAuOS0wLjYtMC45LTEuMWMwLjEtMC41LDAuNS0xLDEuMS0wLjljMS43LDAuMiw0LjMsMi40LDQuNiwyLjdjMS4xLDEuMSwyLDUuMywyLjMsNi41ICAgIGMwLjEsMC4zLDAsMC42LTAuMiwwLjhjLTAuMSwwLjEtMS4zLDEuNy0zLjUsMi40QzIyLjIsMjQ5LDIyLjEsMjQ5LDIyLDI0OXoiLz4NCgk8L2c+DQo8L2c+DQo8ZyBpZD0ibWVzc2FnZS1vbl8xXyI+DQoJPGc+DQoJCTxwYXRoIGNsYXNzPSJzdDAiIGQ9Ik00MiwyMjFjLTAuMywwLTAuNS0wLjEtMC43LTAuM2wtMy43LTMuN0gzMWMtMC42LDAtMS0wLjQtMS0xdi0xNmMwLTAuNiwwLjQtMSwxLTFoMjJjMC42LDAsMSwwLjQsMSwxdjE2ICAgIGMwLDAuNi0wLjQsMS0xLDFoLTYuNmwtMy43LDMuN0M0Mi41LDIyMC45LDQyLjMsMjIxLDQyLDIyMXogTTMyLDIxNWg2YzAuMywwLDAuNSwwLjEsMC43LDAuM2wzLjMsMy4zbDMuMy0zLjMgICAgYzAuMi0wLjIsMC40LTAuMywwLjctMC4zaDZ2LTE0SDMyVjIxNXoiLz4NCgk8L2c+DQoJPGc+DQoJCTxwYXRoIGNsYXNzPSJzdDAiIGQ9Ik00OCwyMDdIMzZjLTAuNiwwLTEtMC40LTEtMXMwLjQtMSwxLTFoMTJjMC42LDAsMSwwLjQsMSwxUzQ4LjYsMjA3LDQ4LDIwN3oiLz4NCgk8L2c+DQoJPGc+DQoJCTxwYXRoIGNsYXNzPSJzdDAiIGQ9Ik00OCwyMTFIMzZjLTAuNiwwLTEtMC40LTEtMXMwLjQtMSwxLTFoMTJjMC42LDAsMSwwLjQsMSwxUzQ4LjYsMjExLDQ4LDIxMXoiLz4NCgk8L2c+DQo8L2c+DQo8ZyBpZD0ibWVzc2FnZV8zXyI+DQoJPGc+DQoJCTxwYXRoIGNsYXNzPSJzdDIiIGQ9Ik0xNCwyMjFjLTAuMywwLTAuNS0wLjEtMC43LTAuM0w5LjYsMjE3SDNjLTAuNiwwLTEtMC40LTEtMXYtMTZjMC0wLjYsMC40LTEsMS0xaDIyYzAuNiwwLDEsMC40LDEsMXYxNiAgICBjMCwwLjYtMC40LDEtMSwxaC02LjZsLTMuNywzLjdDMTQuNSwyMjAuOSwxNC4zLDIyMSwxNCwyMjF6IE00LDIxNWg2YzAuMywwLDAuNSwwLjEsMC43LDAuM2wzLjMsMy4zbDMuMy0zLjMgICAgYzAuMi0wLjIsMC40LTAuMywwLjctMC4zaDZ2LTE0SDRWMjE1eiIvPg0KCTwvZz4NCgk8Zz4NCgkJPHBhdGggY2xhc3M9InN0MiIgZD0iTTIwLDIwN0g4Yy0wLjYsMC0xLTAuNC0xLTFzMC40LTEsMS0xaDEyYzAuNiwwLDEsMC40LDEsMVMyMC42LDIwNywyMCwyMDd6Ii8+DQoJPC9nPg0KCTxnPg0KCQk8cGF0aCBjbGFzcz0ic3QyIiBkPSJNMjAsMjExSDhjLTAuNiwwLTEtMC40LTEtMXMwLjQtMSwxLTFoMTJjMC42LDAsMSwwLjQsMSwxUzIwLjYsMjExLDIwLDIxMXoiLz4NCgk8L2c+DQo8L2c+DQo8ZyBpZD0icHJvZmlsZS1vbl8xXyI+DQoJPGc+DQoJCTxwYXRoIGQ9Ik00MiwxODJjLTMuMywwLTYtMi43LTYtNnMyLjctNiw2LTZzNiwyLjcsNiw2UzQ1LjMsMTgyLDQyLDE4MnogTTQyLDE3MmMtMi4yLDAtNCwxLjgtNCw0czEuOCw0LDQsNCAgICBzNC0xLjgsNC00UzQ0LjIsMTcyLDQyLDE3MnoiIGNsYXNzPSJzdDAiLz4NCgk8L2c+DQoJPGc+DQoJCTxwYXRoIGQ9Ik00MiwxOTRjLTUuMiwwLTguNC0yLjEtOC41LTIuMmMtMC4zLTAuMi0wLjUtMC42LTAuNC0xYzAuMi0xLjIsMS4xLTUuNCwyLjMtNi41YzEuMi0xLjIsNS4xLTEuMyw2LjctMS4zICAgIGMxLjYsMCw1LjUsMC4xLDYuNywxLjNjMS4xLDEuMSwyLDUuMywyLjMsNi41YzAuMSwwLjQtMC4xLDAuOC0wLjQsMUM1MC40LDE5MS45LDQ3LjIsMTk0LDQyLDE5NHogTTM1LjEsMTkwLjUgICAgYzEuMSwwLjUsMy41LDEuNSw2LjksMS41czUuOC0xLDYuOS0xLjVjLTAuNS0yLjEtMS4yLTQuMy0xLjYtNC44Yy0wLjQtMC40LTIuOS0wLjctNS4zLTAuN3MtNC45LDAuMy01LjMsMC43ICAgIEMzNi4zLDE4Ni4xLDM1LjYsMTg4LjQsMzUuMSwxOTAuNXoiIGNsYXNzPSJzdDAiLz4NCgk8L2c+DQo8L2c+DQo8ZyBpZD0icHJvZmlsZV8zXyI+DQoJPGc+DQoJCTxwYXRoIGNsYXNzPSJzdDIiIGQ9Ik0xNCwxODJjLTMuMywwLTYtMi43LTYtNnMyLjctNiw2LTZzNiwyLjcsNiw2UzE3LjMsMTgyLDE0LDE4MnogTTE0LDE3MmMtMi4yLDAtNCwxLjgtNCw0czEuOCw0LDQsNCAgICBzNC0xLjgsNC00UzE2LjIsMTcyLDE0LDE3MnoiLz4NCgk8L2c+DQoJPGc+DQoJCTxwYXRoIGNsYXNzPSJzdDIiIGQ9Ik0xNCwxOTRjLTUuMiwwLTguNC0yLjEtOC41LTIuMmMtMC4zLTAuMi0wLjUtMC42LTAuNC0xYzAuMi0xLjIsMS4xLTUuNCwyLjMtNi41YzEuMi0xLjIsNS4xLTEuMyw2LjctMS4zICAgIHM1LjUsMC4xLDYuNywxLjNjMS4xLDEuMSwyLDUuMywyLjMsNi41YzAuMSwwLjQtMC4xLDAuOC0wLjQsMUMyMi40LDE5MS45LDE5LjIsMTk0LDE0LDE5NHogTTcuMSwxOTAuNWMxLjEsMC41LDMuNSwxLjUsNi45LDEuNSAgICBzNS44LTEsNi45LTEuNWMtMC41LTIuMS0xLjItNC4zLTEuNi00LjhjLTAuNC0wLjQtMi45LTAuNy01LjMtMC43cy00LjksMC4zLTUuMywwLjdDOC4zLDE4Ni4xLDcuNiwxODguNCw3LjEsMTkwLjV6Ii8+DQoJPC9nPg0KPC9nPg0KPGcgaWQ9ImhvbWUtb25fMV8iPg0KCTxwYXRoIGQ9Ik01MSwxNjVoLTdjLTAuNiwwLTEtMC40LTEtMXYtNmgtMnY2YzAsMC42LTAuNCwxLTEsMWgtN2MtMC42LDAtMS0wLjQtMS0xdi05aC0xYy0wLjQsMC0wLjgtMC4zLTAuOS0wLjYgICBjLTAuMS0wLjQsMC0wLjgsMC4zLTEuMWwxMS0xMGMwLjQtMC4zLDEtMC4zLDEuMywwbDExLDEwYzAuMywwLjMsMC40LDAuNywwLjMsMS4xYy0wLjEsMC40LTAuNSwwLjYtMC45LDAuNmgtMXY5ICAgQzUyLDE2NC42LDUxLjYsMTY1LDUxLDE2NXogTTQ1LDE2M2g1di05YzAtMC40LDAuMi0wLjcsMC41LTAuOWwtOC41LTcuOGwtOC41LDcuOGMwLjMsMC4yLDAuNSwwLjUsMC41LDAuOXY5aDV2LTZjMC0wLjYsMC40LTEsMS0xICAgaDRjMC42LDAsMSwwLjQsMSwxVjE2M3oiIGNsYXNzPSJzdDAiLz4NCjwvZz4NCjxnIGlkPSJob21lXzFfIj4NCgk8cGF0aCBkPSJNMjMsMTY1aC03Yy0wLjYsMC0xLTAuNC0xLTF2LTZoLTJ2NmMwLDAuNi0wLjQsMS0xLDFINWMtMC42LDAtMS0wLjQtMS0xdi05SDNjLTAuNCwwLTAuOC0wLjMtMC45LTAuNiAgIGMtMC4xLTAuNCwwLTAuOCwwLjMtMS4xbDExLTEwYzAuNC0wLjMsMS0wLjMsMS4zLDBsMTEsMTBjMC4zLDAuMywwLjQsMC43LDAuMywxLjFjLTAuMSwwLjQtMC41LDAuNi0wLjksMC42aC0xdjkgICBDMjQsMTY0LjYsMjMuNiwxNjUsMjMsMTY1eiBNMTcsMTYzaDV2LTljMC0wLjQsMC4yLTAuNywwLjUtMC45bC04LjUtNy44bC04LjUsNy44YzAuMywwLjIsMC41LDAuNSwwLjUsMC45djloNXYtNmMwLTAuNiwwLjQtMSwxLTEgICBoNGMwLjYsMCwxLDAuNCwxLDFWMTYzeiIgY2xhc3M9InN0MiIvPg0KPC9nPg0KPGcgaWQ9InNldHRpbmdzLW9uXzFfIj4NCgk8cGF0aCBkPSJNNTMsOTZoLTEuMmMtMC4zLTEuMy0wLjgtMi41LTEuNS0zLjVsMC45LTAuOWMwLjQtMC40LDAuNC0xLDAtMS40bC0xLjQtMS40Yy0wLjQtMC40LTEtMC40LTEuNCwwbC0wLjksMC45ICAgYy0xLTAuNy0yLjItMS4yLTMuNS0xLjVWODdjMC0wLjYtMC40LTEtMS0xaC0yYy0wLjYsMC0xLDAuNC0xLDF2MS4yYy0xLjMsMC4zLTIuNSwwLjgtMy41LDEuNWwtMC45LTAuOWMtMC40LTAuNC0xLTAuNC0xLjQsMCAgIGwtMS40LDEuNGMtMC40LDAuNC0wLjQsMSwwLDEuNGwwLjksMC45Yy0wLjcsMS0xLjIsMi4yLTEuNSwzLjVIMzFjLTAuNiwwLTEsMC40LTEsMXYyYzAsMC42LDAuNCwxLDEsMWgxLjIgICBjMC4zLDEuMywwLjgsMi41LDEuNSwzLjVsLTAuOSwwLjljLTAuNCwwLjQtMC40LDEsMCwxLjRsMS40LDEuNGMwLjQsMC40LDEsMC40LDEuNCwwbDAuOS0wLjljMSwwLjcsMi4yLDEuMiwzLjUsMS41djEuMiAgIGMwLDAuNiwwLjQsMSwxLDFoMmMwLjYsMCwxLTAuNCwxLTF2LTEuMmMxLjMtMC4zLDIuNS0wLjgsMy41LTEuNWwwLjksMC45YzAuNCwwLjQsMSwwLjQsMS40LDBsMS40LTEuNGMwLjQtMC40LDAuNC0xLDAtMS40ICAgbC0wLjktMC45YzAuNy0xLDEuMi0yLjIsMS41LTMuNUg1M2MwLjYsMCwxLTAuNCwxLTF2LTJDNTQsOTYuNCw1My42LDk2LDUzLDk2eiBNNDIsMTA0Yy0zLjMsMC02LTIuNy02LTZzMi43LTYsNi02czYsMi43LDYsNiAgIFM0NS4zLDEwNCw0MiwxMDR6IiBjbGFzcz0ic3QwIi8+DQo8L2c+DQo8ZyBpZD0ic2V0dGluZ3NfMV8iPg0KCTxnPg0KCQk8cGF0aCBkPSJNMTYsMTEwaC00Yy0wLjYsMC0xLTAuNC0xLTF2LTEuNWMtMC42LTAuMi0xLjEtMC40LTEuNi0wLjdsLTAuOSwwLjljLTAuNCwwLjQtMSwwLjQtMS40LDBMNC4yLDEwNSAgICBjLTAuNC0wLjQtMC40LTEsMC0xLjRsMC45LTAuOWMtMC4zLTAuNS0wLjUtMS4xLTAuNy0xLjZIM2MtMC42LDAtMS0wLjQtMS0xdi00YzAtMC42LDAuNC0xLDEtMWgxLjVjMC4yLTAuNiwwLjQtMS4xLDAuNy0xLjYgICAgbC0wLjktMC45Yy0wLjQtMC40LTAuNC0xLDAtMS40bDIuNy0zYzAuMi0wLjIsMC40LTAuMywwLjctMC4zbDAsMGMwLjMsMCwwLjUsMC4xLDAuNywwLjNsMC45LDAuOWMwLjUtMC4zLDEuMS0wLjUsMS42LTAuN1Y4NyAgICBjMC0wLjYsMC40LTEsMS0xaDRjMC42LDAsMSwwLjQsMSwxdjEuNWMwLjYsMC4yLDEuMSwwLjQsMS42LDAuN2wwLjktMC45YzAuNC0wLjQsMS0wLjQsMS40LDBsMi44LDIuOGMwLjQsMC40LDAuNCwxLDAsMS40ICAgIGwtMC45LDAuOWMwLjMsMC41LDAuNSwxLjEsMC43LDEuNkgyNWMwLjYsMCwxLDAuNCwxLDF2NGMwLDAuNi0wLjQsMS0xLDFoLTEuNWMtMC4yLDAuNi0wLjQsMS4xLTAuNywxLjZsMC45LDAuOSAgICBjMC40LDAuNCwwLjQsMSwwLDEuNGwtMi44LDIuOGMtMC4yLDAuMi0wLjQsMC4zLTAuNywwLjNsMCwwYy0wLjMsMC0wLjUtMC4xLTAuNy0wLjNsLTAuOS0wLjljLTAuNSwwLjMtMS4xLDAuNS0xLjYsMC43djEuNSAgICBDMTcsMTA5LjYsMTYuNiwxMTAsMTYsMTEweiBNMTMsMTA4aDJ2LTEuMmMwLTAuNSwwLjMtMC45LDAuOC0xYzAuOS0wLjIsMS43LTAuNSwyLjUtMWMwLjQtMC4yLDAuOS0wLjIsMS4yLDAuMWwwLjgsMC44bDEuNC0xLjQgICAgbC0wLjgtMC44Yy0wLjMtMC4zLTAuNC0wLjgtMC4xLTEuMmMwLjUtMC44LDAuOC0xLjYsMS0yLjVjMC4xLTAuNSwwLjUtMC44LDEtMC44SDI0di0yaC0xLjJjLTAuNSwwLTAuOS0wLjMtMS0wLjggICAgYy0wLjItMC45LTAuNS0xLjctMS0yLjVjLTAuMi0wLjQtMC4yLTAuOSwwLjEtMS4ybDAuOC0wLjhsLTEuNC0xLjRsLTAuOCwwLjhjLTAuMywwLjMtMC44LDAuNC0xLjIsMC4xYy0wLjgtMC41LTEuNi0wLjgtMi41LTEgICAgYy0wLjUtMC4xLTAuOC0wLjUtMC44LTFWODhoLTJ2MS4yYzAsMC41LTAuMywwLjktMC44LDFjLTAuOSwwLjItMS43LDAuNS0yLjUsMWMtMC40LDAuMi0wLjksMC4yLTEuMi0wLjFsLTAuOC0wLjhsLTEuNCwxLjQgICAgbDAuOCwwLjhjMC4zLDAuMywwLjQsMC44LDAuMSwxLjJjLTAuNSwwLjgtMC44LDEuNi0xLDIuNWMtMC4xLDAuNS0wLjUsMC44LTEsMC44SDR2MmgxLjJjMC41LDAsMC45LDAuMywxLDAuOCAgICBjMC4yLDAuOSwwLjUsMS43LDEsMi41YzAuMiwwLjQsMC4yLDAuOS0wLjEsMS4ybC0wLjgsMC44bDEuNCwxLjRsMC44LTAuOGMwLjMtMC4zLDAuOC0wLjQsMS4yLTAuMWMwLjgsMC41LDEuNiwwLjgsMi41LDEgICAgYzAuNSwwLjEsMC44LDAuNSwwLjgsMVYxMDh6IiBjbGFzcz0ic3QwIi8+DQoJPC9nPg0KCTxnPg0KCQk8cGF0aCBkPSJNMTQsMTA0Yy0zLjMsMC02LTIuNy02LTZzMi43LTYsNi02czYsMi43LDYsNlMxNy4zLDEwNCwxNCwxMDR6IE0xNCw5NGMtMi4yLDAtNCwxLjgtNCw0czEuOCw0LDQsNHM0LTEuOCw0LTQgICAgUzE2LjIsOTQsMTQsOTR6IiBjbGFzcz0ic3QwIi8+DQoJPC9nPg0KPC9nPg0KPGcgaWQ9InRpeC1vbl8xXyI+DQoJPHBhdGggZD0iTTUxLDY1aC0ybC0yLTJ2LTJsLTMtM0wzMCw3MmwzLDNoMmwyLDJ2MmwzLDNsMTQtMTRMNTEsNjV6IE00NC43LDcyLjdDNDQuNSw3Mi45LDQ0LjMsNzMsNDQsNzMgICBzLTAuNS0wLjEtMC43LTAuM0w0MCw2OS40bC0xLjMsMS4zQzM4LjUsNzAuOSwzOC4zLDcxLDM4LDcxcy0wLjUtMC4xLTAuNy0wLjNjLTAuNC0wLjQtMC40LTEsMC0xLjRsNC00YzAuNC0wLjQsMS0wLjQsMS40LDAgICBzMC40LDEsMCwxLjRMNDEuNCw2OGwzLjMsMy4zQzQ1LjEsNzEuNyw0NS4xLDcyLjMsNDQuNyw3Mi43eiIgY2xhc3M9InN0MCIvPg0KPC9nPg0KPGcgaWQ9InRpeF8yXyI+DQoJPGc+DQoJCTxwYXRoIGQ9Ik0xMiw4MmMtMC4zLDAtMC41LTAuMS0wLjctMC4zbC0zLTNDOC4xLDc4LjUsOCw3OC4zLDgsNzh2LTEuNkw3LjYsNzZINmMtMC4zLDAtMC41LTAuMS0wLjctMC4zbC0zLTMgICAgYy0wLjQtMC40LTAuNC0xLDAtMS40bDEzLTEzYzAuNC0wLjQsMS0wLjQsMS40LDBsMywzYzAuMiwwLjIsMC4zLDAuNCwwLjMsMC43djEuNmwwLjQsMC40SDIyYzAuMywwLDAuNSwwLjEsMC43LDAuM2wzLDMgICAgYzAuNCwwLjQsMC40LDEsMCwxLjRsLTEzLDEzQzEyLjUsODEuOSwxMi4zLDgyLDEyLDgyeiBNMTAsNzcuNmwyLDJMMjMuNiw2OGwtMi0ySDIwYy0wLjMsMC0wLjUtMC4xLTAuNy0wLjNsLTEtMSAgICBDMTguMSw2NC41LDE4LDY0LjMsMTgsNjR2LTEuNmwtMi0yTDQuNCw3MmwyLDJIOGMwLjMsMCwwLjUsMC4xLDAuNywwLjNsMSwxQzkuOSw3NS41LDEwLDc1LjcsMTAsNzZWNzcuNnoiIGNsYXNzPSJzdDAiLz4NCgk8L2c+DQoJPGc+DQoJCTxwYXRoIGQ9Ik0xMCw3MWMtMC4zLDAtMC41LTAuMS0wLjctMC4zYy0wLjQtMC40LTAuNC0xLDAtMS40bDQtNGMwLjQtMC40LDEtMC40LDEuNCwwczAuNCwxLDAsMS40bC00LDQgICAgQzEwLjUsNzAuOSwxMC4zLDcxLDEwLDcxeiIgY2xhc3M9InN0MCIvPg0KCTwvZz4NCgk8Zz4NCgkJPHBhdGggZD0iTTE2LDczYy0wLjMsMC0wLjUtMC4xLTAuNy0wLjNsLTQtNGMtMC40LTAuNC0wLjQtMSwwLTEuNHMxLTAuNCwxLjQsMGw0LDRjMC40LDAuNCwwLjQsMSwwLDEuNCAgICBDMTYuNSw3Mi45LDE2LjMsNzMsMTYsNzN6IiBjbGFzcz0ic3QwIi8+DQoJPC9nPg0KPC9nPg0KPGcgaWQ9InJvYnV4LW9uXzFfIj4NCgk8cGF0aCBkPSJNMzcsMzl2MmgyLjZjMC4xLTAuNSwwLjEtMS41LDAtMkgzN3oiIGNsYXNzPSJzdDAiLz4NCgk8cGF0aCBkPSJNNDIsMzBjLTYuNiwwLTEyLDUuNC0xMiwxMnM1LjQsMTIsMTIsMTJzMTItNS40LDEyLTEyUzQ4LjYsMzAsNDIsMzB6IE00Nyw0N3YxYzAsMC42LTAuNCwxLTEsMXMtMS0wLjQtMS0xdi0xICAgaC0zYy0wLjIsMC0wLjQtMC4xLTAuNi0wLjJMMzcsNDMuM1Y0NmMwLDAuNi0wLjQsMS0xLDFzLTEtMC40LTEtMXYtOGMwLTAuNiwwLjQtMSwxLTFoNGMxLjEsMCwxLjcsMS4xLDEuNywzICAgYzAsMC42LTAuMSwxLjItMC4yLDEuN0M0MS4xLDQyLjksNDAuMyw0Myw0MCw0M2gtMC4xbDIuNSwySDQ3YzAuMywwLDAuNS0wLjUsMC41LTFjMC0wLjQtMC4xLTEtMC41LTFoLTJjLTEuNCwwLTIuNS0xLjMtMi41LTMgICBjMC0wLjcsMC4yLTEuNCwwLjUtMS45YzAuNS0wLjcsMS4yLTEuMSwyLTEuMXYtMWMwLTAuNiwwLjQtMSwxLTFzMSwwLjQsMSwxdjFoMWMwLjYsMCwxLDAuNCwxLDFzLTAuNCwxLTEsMWgtMyAgIGMtMC4xLDAtMC4yLDAtMC4zLDAuMnMtMC4yLDAuNS0wLjIsMC44YzAsMC40LDAuMiwxLDAuNSwxaDJjMS40LDAsMi41LDEuMywyLjUsM1M0OC40LDQ3LDQ3LDQ3eiIgY2xhc3M9InN0MCIvPg0KPC9nPg0KPGcgaWQ9InJvYnV4XzJfIj4NCgk8Zz4NCgkJPHBhdGggZD0iTTE0LDU0QzcuNCw1NCwyLDQ4LjYsMiw0MnM1LjQtMTIsMTItMTJzMTIsNS40LDEyLDEyUzIwLjYsNTQsMTQsNTR6IE0xNCwzMkM4LjUsMzIsNCwzNi41LDQsNDJzNC41LDEwLDEwLDEwICAgIHMxMC00LjUsMTAtMTBTMTkuNSwzMiwxNCwzMnoiIGNsYXNzPSJzdDAiLz4NCgk8L2c+DQoJPGc+DQoJCTxnPg0KCQkJPHBhdGggZD0iTTE5LDQ3aC01Yy0wLjIsMC0wLjQtMC4xLTAuNi0wLjJMOSw0My4zVjQ2YzAsMC42LTAuNCwxLTEsMXMtMS0wLjQtMS0xdi04YzAtMC42LDAuNC0xLDEtMWg0ICAgICBjMS4xLDAsMS43LDEuMSwxLjcsM2MwLDAuNi0wLjEsMS4yLTAuMiwxLjdDMTMuMSw0Mi45LDEyLjMsNDMsMTIsNDNoLTAuMWwyLjUsMkgxOWMwLjMsMCwwLjUtMC41LDAuNS0xYzAtMC40LTAuMS0xLTAuNS0xaC0yICAgICBjLTEuNCwwLTIuNS0xLjMtMi41LTNjMC0wLjcsMC4yLTEuNCwwLjUtMS45YzAuNS0wLjcsMS4yLTEuMSwyLTEuMWgzYzAuNiwwLDEsMC40LDEsMXMtMC40LDEtMSwxaC0zYy0wLjEsMC0wLjIsMC0wLjMsMC4yICAgICBjLTAuMSwwLjItMC4yLDAuNS0wLjIsMC44YzAsMC40LDAuMiwxLDAuNSwxaDJjMS40LDAsMi41LDEuMywyLjUsM1MyMC40LDQ3LDE5LDQ3eiBNOSw0MWgyLjZjMC4xLTAuNSwwLjEtMS41LDAtMkg5VjQxeiIgY2xhc3M9InN0MCIvPg0KCQk8L2c+DQoJCTxnPg0KCQkJPHBhdGggZD0iTTE4LDM4Yy0wLjYsMC0xLTAuNC0xLTF2LTFjMC0wLjYsMC40LTEsMS0xczEsMC40LDEsMXYxQzE5LDM3LjYsMTguNiwzOCwxOCwzOHoiIGNsYXNzPSJzdDAiLz4NCgkJPC9nPg0KCQk8Zz4NCgkJCTxwYXRoIGQ9Ik0xOCw0OWMtMC42LDAtMS0wLjQtMS0xdi0xYzAtMC42LDAuNC0xLDEtMXMxLDAuNCwxLDF2MUMxOSw0OC42LDE4LjYsNDksMTgsNDl6IiBjbGFzcz0ic3QwIi8+DQoJCTwvZz4NCgk8L2c+DQo8L2c+DQo8ZyBpZD0ibWVudS1vbl8xXyI+DQoJPGc+DQoJCTxwYXRoIGQ9Ik01MCwxMEgzNGMtMC42LDAtMS0wLjQtMS0xczAuNC0xLDEtMWgxNmMwLjYsMCwxLDAuNCwxLDFTNTAuNiwxMCw1MCwxMHoiIGNsYXNzPSJzdDAiLz4NCgk8L2c+DQoJPGc+DQoJCTxwYXRoIGQ9Ik01MCwxNUgzNGMtMC42LDAtMS0wLjQtMS0xczAuNC0xLDEtMWgxNmMwLjYsMCwxLDAuNCwxLDFTNTAuNiwxNSw1MCwxNXoiIGNsYXNzPSJzdDAiLz4NCgk8L2c+DQoJPGc+DQoJCTxwYXRoIGQ9Ik01MCwyMEgzNGMtMC42LDAtMS0wLjQtMS0xczAuNC0xLDEtMWgxNmMwLjYsMCwxLDAuNCwxLDFTNTAuNiwyMCw1MCwyMHoiIGNsYXNzPSJzdDAiLz4NCgk8L2c+DQo8L2c+DQo8ZyBpZD0ibWVudV8yXyI+DQoJPGc+DQoJCTxwYXRoIGQ9Ik0yMiwxMEg2Yy0wLjYsMC0xLTAuNC0xLTFzMC40LTEsMS0xaDE2YzAuNiwwLDEsMC40LDEsMVMyMi42LDEwLDIyLDEweiIgY2xhc3M9InN0MCIvPg0KCTwvZz4NCgk8Zz4NCgkJPHBhdGggZD0iTTIyLDE1SDZjLTAuNiwwLTEtMC40LTEtMXMwLjQtMSwxLTFoMTZjMC42LDAsMSwwLjQsMSwxUzIyLjYsMTUsMjIsMTV6IiBjbGFzcz0ic3QwIi8+DQoJPC9nPg0KCTxnPg0KCQk8cGF0aCBkPSJNMjIsMjBINmMtMC42LDAtMS0wLjQtMS0xczAuNC0xLDEtMWgxNmMwLjYsMCwxLDAuNCwxLDFTMjIuNiwyMCwyMiwyMHoiIGNsYXNzPSJzdDAiLz4NCgk8L2c+DQo8L2c+DQo8ZyBpZD0ic2VhcmNoXzFfIj4NCgk8Zz4NCgkJPHBhdGggY2xhc3M9InN0MiIgZD0iTTEyLDEzM2MtNSwwLTktNC05LTlzNC05LDktOXM5LDQsOSw5UzE3LDEzMywxMiwxMzN6IE0xMiwxMTdjLTMuOSwwLTcsMy4xLTcsN3MzLjEsNyw3LDdzNy0zLjEsNy03ICAgIFMxNS45LDExNywxMiwxMTd6Ii8+DQoJPC9nPg0KCTxnPg0KCQk8cGF0aCBjbGFzcz0ic3QyIiBkPSJNMjQsMTM3Yy0wLjMsMC0wLjUtMC4xLTAuNy0wLjNsLTYtNmMtMC40LTAuNC0wLjQtMSwwLTEuNGMwLjQtMC40LDEtMC40LDEuNCwwbDYsNmMwLjQsMC40LDAuNCwxLDAsMS40ICAgIEMyNC41LDEzNi45LDI0LjMsMTM3LDI0LDEzN3oiLz4NCgk8L2c+DQoJPGc+DQoJCTxwYXRoIGNsYXNzPSJzdDIiIGQ9Ik0xNiwxMjVjLTAuNiwwLTEtMC40LTEtMWMwLTEuNy0xLjMtMy0zLTNjLTAuNiwwLTEtMC40LTEtMXMwLjQtMSwxLTFjMi44LDAsNSwyLjIsNSw1ICAgIEMxNywxMjQuNiwxNi42LDEyNSwxNiwxMjV6Ii8+DQoJPC9nPg0KPC9nPg0KPGcgaWQ9InNlYXJjaF8yXyI+DQoJPGc+DQoJCTxwYXRoIGNsYXNzPSJzdDAiIGQ9Ik00MCwxMzNjLTUsMC05LTQtOS05czQtOSw5LTlzOSw0LDksOVM0NSwxMzMsNDAsMTMzeiBNNDAsMTE3Yy0zLjksMC03LDMuMS03LDdzMy4xLDcsNyw3czctMy4xLDctNyAgICBTNDMuOSwxMTcsNDAsMTE3eiIvPg0KCTwvZz4NCgk8Zz4NCgkJPHBhdGggY2xhc3M9InN0MCIgZD0iTTUyLDEzN2MtMC4zLDAtMC41LTAuMS0wLjctMC4zbC02LTZjLTAuNC0wLjQtMC40LTEsMC0xLjRjMC40LTAuNCwxLTAuNCwxLjQsMGw2LDZjMC40LDAuNCwwLjQsMSwwLDEuNCAgICBDNTIuNSwxMzYuOSw1Mi4zLDEzNyw1MiwxMzd6Ii8+DQoJPC9nPg0KCTxnPg0KCQk8cGF0aCBjbGFzcz0ic3QwIiBkPSJNNDQsMTI1Yy0wLjYsMC0xLTAuNC0xLTFjMC0xLjctMS4zLTMtMy0zYy0wLjYsMC0xLTAuNC0xLTFzMC40LTEsMS0xYzIuOCwwLDUsMi4yLDUsNSAgICBDNDUsMTI0LjYsNDQuNiwxMjUsNDQsMTI1eiIvPg0KCTwvZz4NCjwvZz4NCjxnIGlkPSJzZWFyY2hfNF8iPg0KCTxnPg0KCQk8cGF0aCBkPSJNMTIsNDQxYy01LDAtOS00LTktOXM0LTksOS05czksNCw5LDlTMTcsNDQxLDEyLDQ0MXogTTEyLDQyNWMtMy45LDAtNywzLjEtNyw3czMuMSw3LDcsN3M3LTMuMSw3LTcgICAgUzE1LjksNDI1LDEyLDQyNXoiIGNsYXNzPSJzdDIiLz4NCgk8L2c+DQoJPGc+DQoJCTxwYXRoIGQ9Ik0yNCw0NDVjLTAuMywwLTAuNS0wLjEtMC43LTAuM2wtNi02Yy0wLjQtMC40LTAuNC0xLDAtMS40YzAuNC0wLjQsMS0wLjQsMS40LDBsNiw2YzAuNCwwLjQsMC40LDEsMCwxLjQgICAgQzI0LjUsNDQ0LjksMjQuMyw0NDUsMjQsNDQ1eiIgY2xhc3M9InN0MiIvPg0KCTwvZz4NCgk8Zz4NCgkJPHBhdGggZD0iTTE2LDQzM2MtMC42LDAtMS0wLjQtMS0xYzAtMS43LTEuMy0zLTMtM2MtMC42LDAtMS0wLjQtMS0xczAuNC0xLDEtMWMyLjgsMCw1LDIuMiw1LDUgICAgQzE3LDQzMi42LDE2LjYsNDMzLDE2LDQzM3oiIGNsYXNzPSJzdDIiLz4NCgk8L2c+DQo8L2c+DQo8ZyBpZD0ic2VhcmNoXzNfIj4NCgk8Zz4NCgkJPHBhdGggY2xhc3M9InN0MCIgZD0iTTQwLDQ0MWMtNSwwLTktNC05LTlzNC05LDktOXM5LDQsOSw5UzQ1LDQ0MSw0MCw0NDF6IE00MCw0MjVjLTMuOSwwLTcsMy4xLTcsN3MzLjEsNyw3LDdzNy0zLjEsNy03ICAgIFM0My45LDQyNSw0MCw0MjV6Ii8+DQoJPC9nPg0KCTxnPg0KCQk8cGF0aCBjbGFzcz0ic3QwIiBkPSJNNTIsNDQ1Yy0wLjMsMC0wLjUtMC4xLTAuNy0wLjNsLTYtNmMtMC40LTAuNC0wLjQtMSwwLTEuNGMwLjQtMC40LDEtMC40LDEuNCwwbDYsNmMwLjQsMC40LDAuNCwxLDAsMS40ICAgIEM1Mi41LDQ0NC45LDUyLjMsNDQ1LDUyLDQ0NXoiLz4NCgk8L2c+DQoJPGc+DQoJCTxwYXRoIGNsYXNzPSJzdDAiIGQ9Ik00NCw0MzNjLTAuNiwwLTEtMC40LTEtMWMwLTEuNy0xLjMtMy0zLTNjLTAuNiwwLTEtMC40LTEtMXMwLjQtMSwxLTFjMi44LDAsNSwyLjIsNSw1ICAgIEM0NSw0MzIuNiw0NC42LDQzMyw0NCw0MzN6Ii8+DQoJPC9nPg0KPC9nPg0KPC9zdmc+DQo=);
}
.dark-theme .icon-nav-forum {
    background-image: url(data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4NCjwhLS0gR2VuZXJhdG9yOiBBZG9iZSBJbGx1c3RyYXRvciAxOS4xLjAsIFNWRyBFeHBvcnQgUGx1Zy1JbiAuIFNWRyBWZXJzaW9uOiA2LjAwIEJ1aWxkIDApICAtLT4NCjwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCI+DQo8c3ZnIHZlcnNpb249IjEuMSIgaWQ9Im5hdmlnYXRpb24iIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHg9IjBweCIgeT0iMHB4IiB3aWR0aD0iNTZweCIgaGVpZ2h0PSI0NzZweCIgdmlld0JveD0iMCAwIDU2IDQ3NiIgc3R5bGU9ImVuYWJsZS1iYWNrZ3JvdW5kOm5ldyAwIDAgNTYgNDc2OyIgeG1sOnNwYWNlPSJwcmVzZXJ2ZSI+DQo8c3R5bGUgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB0eXBlPSJ0ZXh0L2NzcyI+DQoJLnN0MHtmaWxsOiNGRkZGRkY7fQ0KCS5zdDF7ZmlsbDojQkRCRUJFO30NCjwvc3R5bGU+DQo8cGF0aCBpZD0ic2hvcC1vbiIgY2xhc3M9InN0MCIgZD0iTTUwLDQ1Ny45YzAtMC41LTAuNS0wLjktMS0wLjloLTJ2LTJjMC0yLjgtMi4yLTUtNS01cy01LDIuMi01LDV2MmgtMmMtMC41LDAtMSwwLjQtMSwwLjlsLTEsMTUgIGMwLDAuMywwLjEsMC41LDAuMywwLjhjMC4yLDAuMiwwLjUsMC4zLDAuNywwLjNoMTZjMC4zLDAsMC41LTAuMSwwLjctMC4zYzAuMi0wLjIsMC4zLTAuNSwwLjMtMC44TDUwLDQ1Ny45eiBNMzksNDU1ICBjMC0xLjcsMS4zLTMsMy0zczMsMS4zLDMsM3YyaC02VjQ1NXogTTM1LjEsNDcybDAuOS0xM2gxdjJjMCwwLjYsMC40LDEsMSwxczEtMC40LDEtMXYtMmg2djJjMCwwLjYsMC40LDEsMSwxczEtMC40LDEtMXYtMmgxLjEgIGwwLjksMTNIMzUuMXoiLz4NCjxwYXRoIGlkPSJzaG9wIiBjbGFzcz0ic3QxIiBkPSJNMjIsNDU3LjljMC0wLjUtMC41LTAuOS0xLTAuOWgtMnYtMmMwLTIuOC0yLjItNS01LTVzLTUsMi4yLTUsNXYySDdjLTAuNSwwLTEsMC40LTEsMC45bC0xLDE1ICBjMCwwLjMsMC4xLDAuNSwwLjMsMC44YzAuMiwwLjIsMC41LDAuMywwLjcsMC4zaDE2YzAuMywwLDAuNS0wLjEsMC43LTAuM2MwLjItMC4yLDAuMy0wLjUsMC4zLTAuOEwyMiw0NTcuOXogTTExLDQ1NSAgYzAtMS43LDEuMy0zLDMtM3MzLDEuMywzLDN2MmgtNlY0NTV6IE03LjEsNDcyTDgsNDU5aDF2MmMwLDAuNiwwLjQsMSwxLDFzMS0wLjQsMS0xdi0yaDZ2MmMwLDAuNiwwLjQsMSwxLDFzMS0wLjQsMS0xdi0yaDEuMSAgbDAuOSwxM0g3LjF6Ii8+DQo8ZyBpZD0iYmxvZy1vbl8xXyI+DQoJPGc+DQoJCTxwYXRoIGNsYXNzPSJzdDAiIGQ9Ik01MSw0MTZjLTAuMSwwLTAuMywwLTAuNC0wLjFMMzYuOCw0MTBoLTEuNmwtMS44LDAuOWMtMC4zLDAuMi0wLjcsMC4xLTEsMGMtMC4zLTAuMi0wLjUtMC41LTAuNS0wLjl2LTcgICAgYzAtMC4zLDAuMi0wLjcsMC41LTAuOXMwLjctMC4yLDEsMGwxLjgsMC45aDEuNWwxMy44LTYuOWMwLjMtMC4yLDAuNy0wLjEsMSwwYzAuMywwLjIsMC41LDAuNSwwLjUsMC45djE4YzAsMC4zLTAuMiwwLjYtMC40LDAuOCAgICBDNTEuNCw0MTUuOSw1MS4yLDQxNiw1MSw0MTZ6IE0zNSw0MDhoMmMwLjEsMCwwLjMsMCwwLjQsMC4xbDEyLjYsNS40di0xNC45bC0xMi42LDYuM2MtMC4xLDAuMS0wLjMsMC4xLTAuNCwwLjFoLTIgICAgYy0wLjIsMC0wLjMsMC0wLjQtMC4xbC0wLjYtMC4zdjMuOGwwLjYtMC4zQzM0LjcsNDA4LDM0LjgsNDA4LDM1LDQwOHoiLz4NCgk8L2c+DQoJPGc+DQoJCTxwYXRoIGNsYXNzPSJzdDAiIGQ9Ik00Miw0MTdjLTAuMSwwLTAuMywwLTAuNC0wLjFsLTYtM2MtMC4zLTAuMi0wLjYtMC41LTAuNi0wLjl2LTNjMC0wLjYsMC40LTEsMS0xczEsMC40LDEsMXYyLjRsNC42LDIuMyAgICBsMS42LTMuMWMwLjItMC41LDAuOC0wLjcsMS4zLTAuNGMwLjUsMC4yLDAuNywwLjgsMC40LDEuM2wtMiw0QzQyLjcsNDE2LjgsNDIuNCw0MTcsNDIsNDE3eiIvPg0KCTwvZz4NCjwvZz4NCjxnIGlkPSJibG9nXzNfIj4NCgk8Zz4NCgkJPHBhdGggY2xhc3M9InN0MSIgZD0iTTIzLDQxNmMtMC4xLDAtMC4zLDAtMC40LTAuMUw4LjgsNDEwSDcuMmwtMS44LDAuOWMtMC4zLDAuMi0wLjcsMC4xLTEsMEM0LjIsNDEwLjcsNCw0MTAuMyw0LDQxMHYtNyAgICBjMC0wLjMsMC4yLTAuNywwLjUtMC45czAuNy0wLjIsMSwwbDEuOCwwLjloMS41bDEzLjgtNi45YzAuMy0wLjIsMC43LTAuMSwxLDBjMC4zLDAuMiwwLjUsMC41LDAuNSwwLjl2MThjMCwwLjMtMC4yLDAuNi0wLjQsMC44ICAgIEMyMy40LDQxNS45LDIzLjIsNDE2LDIzLDQxNnogTTcsNDA4aDJjMC4xLDAsMC4zLDAsMC40LDAuMWwxMi42LDUuNHYtMTQuOWwtMTIuNiw2LjNDOS4zLDQwNSw5LjIsNDA1LDksNDA1SDcgICAgYy0wLjIsMC0wLjMsMC0wLjQtMC4xTDYsNDA0LjZ2My44bDAuNi0wLjNDNi43LDQwOCw2LjgsNDA4LDcsNDA4eiIvPg0KCTwvZz4NCgk8Zz4NCgkJPHBhdGggY2xhc3M9InN0MSIgZD0iTTE0LDQxN2MtMC4xLDAtMC4zLDAtMC40LTAuMWwtNi0zQzcuMiw0MTMuNyw3LDQxMy40LDcsNDEzdi0zYzAtMC42LDAuNC0xLDEtMXMxLDAuNCwxLDF2Mi40bDQuNiwyLjMgICAgbDEuNi0zLjFjMC4yLTAuNSwwLjgtMC43LDEuMy0wLjRjMC41LDAuMiwwLjcsMC44LDAuNCwxLjNsLTIsNEMxNC43LDQxNi44LDE0LjQsNDE3LDE0LDQxN3oiLz4NCgk8L2c+DQo8L2c+DQo8ZyBpZD0iZm9ydW0tb25fMV8iPg0KCTxnPg0KCQk8cGF0aCBjbGFzcz0ic3QwIiBkPSJNNDYsMzg4Yy0wLjEsMC0wLjMsMC0wLjQtMC4xYy0wLjQtMC4yLTAuNi0wLjUtMC42LTAuOXYtMmgtMmMtMC42LDAtMS0wLjQtMS0xczAuNC0xLDEtMWgzYzAuNiwwLDEsMC40LDEsMSAgICB2MC45bDItMS42YzAuMi0wLjEsMC40LTAuMiwwLjYtMC4ySDUydi01aC0xYy0wLjYsMC0xLTAuNC0xLTFjMC0wLjYsMC40LTEsMS0xaDJjMC42LDAsMSwwLjQsMSwxdjdjMCwwLjYtMC40LDEtMSwxaC0zbC0zLjMsMi44ICAgIEM0Ni41LDM4Ny45LDQ2LjIsMzg4LDQ2LDM4OHoiLz4NCgk8L2c+DQoJPGc+DQoJCTxwYXRoIGNsYXNzPSJzdDAiIGQ9Ik0zOSwzODdjLTAuMywwLTAuNS0wLjEtMC43LTAuM2wtNC43LTQuN0gzMWMtMC42LDAtMS0wLjQtMS0xdi0xMmMwLTAuNiwwLjQtMSwxLTFoMTdjMC42LDAsMSwwLjQsMSwxdjEyICAgIGMwLDAuNi0wLjQsMS0xLDFoLTh2NGMwLDAuNC0wLjIsMC44LTAuNiwwLjlDMzkuMywzODcsMzkuMSwzODcsMzksMzg3eiBNMzIsMzgwaDJjMC4zLDAsMC41LDAuMSwwLjcsMC4zbDMuMywzLjNWMzgxICAgIGMwLTAuNiwwLjQtMSwxLTFoOHYtMTBIMzJWMzgweiIvPg0KCTwvZz4NCjwvZz4NCjxnIGlkPSJmb3J1bV8zXyI+DQoJPGc+DQoJCTxwYXRoIGNsYXNzPSJzdDEiIGQ9Ik0xOCwzODhjLTAuMSwwLTAuMywwLTAuNC0wLjFjLTAuNC0wLjItMC42LTAuNS0wLjYtMC45di0yaC0yYy0wLjYsMC0xLTAuNC0xLTFzMC40LTEsMS0xaDNjMC42LDAsMSwwLjQsMSwxICAgIHYwLjlsMi0xLjZjMC4yLTAuMSwwLjQtMC4yLDAuNi0wLjJIMjR2LTVoLTFjLTAuNiwwLTEtMC40LTEtMWMwLTAuNiwwLjQtMSwxLTFoMmMwLjYsMCwxLDAuNCwxLDF2N2MwLDAuNi0wLjQsMS0xLDFoLTNsLTMuMywyLjggICAgQzE4LjUsMzg3LjksMTguMiwzODgsMTgsMzg4eiIvPg0KCTwvZz4NCgk8Zz4NCgkJPHBhdGggY2xhc3M9InN0MSIgZD0iTTExLDM4N2MtMC4zLDAtMC41LTAuMS0wLjctMC4zTDUuNiwzODJIM2MtMC42LDAtMS0wLjQtMS0xdi0xMmMwLTAuNiwwLjQtMSwxLTFoMTdjMC42LDAsMSwwLjQsMSwxdjEyICAgIGMwLDAuNi0wLjQsMS0xLDFoLTh2NGMwLDAuNC0wLjIsMC44LTAuNiwwLjlDMTEuMywzODcsMTEuMSwzODcsMTEsMzg3eiBNNCwzODBoMmMwLjMsMCwwLjUsMC4xLDAuNywwLjNsMy4zLDMuM1YzODEgICAgYzAtMC42LDAuNC0xLDEtMWg4di0xMEg0VjM4MHoiLz4NCgk8L2c+DQo8L2c+DQo8ZyBpZD0iZ3JvdXAtb25fMV8iPg0KCTxnPg0KCQk8cGF0aCBjbGFzcz0ic3QwIiBkPSJNNDIsMzUwYy0yLjgsMC01LTIuMi01LTVzMi4yLTUsNS01czUsMi4yLDUsNVM0NC44LDM1MCw0MiwzNTB6IE00MiwzNDJjLTEuNywwLTMsMS4zLTMsM3MxLjMsMywzLDMgICAgczMtMS4zLDMtM1M0My43LDM0Miw0MiwzNDJ6Ii8+DQoJPC9nPg0KCTxnPg0KCQk8cGF0aCBjbGFzcz0ic3QwIiBkPSJNNDIsMzYxYy00LjIsMC02LjYtMi4yLTYuNy0yLjNjLTAuMi0wLjItMC4zLTAuNS0wLjMtMC44YzAuMS0xLjcsMC40LTQuNywxLjMtNS43czMuOS0xLjIsNS43LTEuM2gwLjEgICAgYzEuNywwLjEsNC43LDAuNCw1LjcsMS4zYzEsMC45LDEuMiwzLjksMS4zLDUuN2MwLDAuMy0wLjEsMC42LTAuMywwLjhDNDguNiwzNTguOCw0Ni4yLDM2MSw0MiwzNjF6IE0zNywzNTcuNSAgICBjMC43LDAuNSwyLjQsMS41LDUsMS41czQuMy0xLDUtMS41Yy0wLjEtMS44LTAuNC0zLjUtMC43LTMuOWMtMC4zLTAuMi0yLjQtMC42LTQuMy0wLjdjLTEuOSwwLjEtMy45LDAuNC00LjMsMC43ICAgIEMzNy41LDM1NCwzNy4yLDM1NS44LDM3LDM1Ny41eiIvPg0KCTwvZz4NCgk8Zz4NCgkJPGc+DQoJCQk8cGF0aCBjbGFzcz0ic3QwIiBkPSJNMzYsMzUxYy0yLjIsMC00LTEuOC00LTRjMC0xLjcsMS4xLTMuMiwyLjctMy44YzAuNS0wLjIsMS4xLDAuMSwxLjMsMC42cy0wLjEsMS4xLTAuNiwxLjMgICAgIGMtMC44LDAuMy0xLjMsMS0xLjMsMS45YzAsMS4xLDAuOSwyLDIsMmMwLjYsMCwxLDAuNCwxLDFTMzYuNiwzNTEsMzYsMzUxeiIvPg0KCQk8L2c+DQoJCTxnPg0KCQkJPHBhdGggY2xhc3M9InN0MCIgZD0iTTMzLDM1OGMtMC4xLDAtMC4xLDAtMC4yLDBjLTEuMy0wLjMtMi4zLTEuMS0yLjQtMS4yYy0wLjMtMC4yLTAuNC0wLjYtMC4zLTFjMC4zLTEuNCwwLjgtMy45LDEuNi00LjYgICAgIGMwLjQtMC40LDMuMy0yLDQuMi0yLjJjMC41LTAuMSwxLjEsMC4zLDEuMiwwLjhzLTAuMywxLjEtMC44LDEuMnMtMi44LDEuMy0zLjIsMS43Yy0wLjIsMC4yLTAuNiwxLjUtMC45LDIuOSAgICAgYzAuMywwLjIsMC43LDAuNCwxLjEsMC41YzAuNSwwLjEsMC45LDAuNiwwLjgsMS4yQzMzLjksMzU3LjcsMzMuNSwzNTgsMzMsMzU4eiIvPg0KCQk8L2c+DQoJCTxnPg0KCQkJPHBhdGggY2xhc3M9InN0MCIgZD0iTTQ4LDM1MWMtMC42LDAtMS0wLjQtMS0xczAuNC0xLDEtMWMxLjEsMCwyLTAuOSwyLTJjMC0wLjgtMC41LTEuNi0xLjMtMS45Yy0wLjUtMC4yLTAuOC0wLjgtMC42LTEuMyAgICAgczAuOC0wLjgsMS4zLTAuNmMxLjYsMC42LDIuNywyLjEsMi43LDMuOEM1MiwzNDkuMiw1MC4yLDM1MSw0OCwzNTF6Ii8+DQoJCTwvZz4NCgkJPGc+DQoJCQk8cGF0aCBjbGFzcz0ic3QwIiBkPSJNNTEsMzU4Yy0wLjUsMC0wLjktMC4zLTEtMC44czAuMi0xLjEsMC44LTEuMmMwLjQtMC4xLDAuOC0wLjMsMS4xLTAuNWMtMC4zLTEuNC0wLjctMi43LTAuOS0zICAgICBjLTAuNC0wLjMtMi42LTEuNS0zLjEtMS42cy0wLjktMC42LTAuOC0xLjJjMC4xLTAuNSwwLjYtMC45LDEuMS0wLjhjMC45LDAuMiwzLjgsMS44LDQuMiwyLjJjMC44LDAuOCwxLjMsMy4yLDEuNiw0LjYgICAgIGMwLjEsMC40LTAuMSwwLjctMC4zLDFjLTAuMSwwLjEtMS4xLDAuOS0yLjQsMS4yQzUxLjEsMzU4LDUxLjEsMzU4LDUxLDM1OHoiLz4NCgkJPC9nPg0KCTwvZz4NCjwvZz4NCjxnIGlkPSJncm91cF8zXyI+DQoJPGc+DQoJCTxwYXRoIGNsYXNzPSJzdDEiIGQ9Ik0xNCwzNTBjLTIuOCwwLTUtMi4yLTUtNXMyLjItNSw1LTVzNSwyLjIsNSw1UzE2LjgsMzUwLDE0LDM1MHogTTE0LDM0MmMtMS43LDAtMywxLjMtMywzczEuMywzLDMsMyAgICBzMy0xLjMsMy0zUzE1LjcsMzQyLDE0LDM0MnoiLz4NCgk8L2c+DQoJPGc+DQoJCTxwYXRoIGNsYXNzPSJzdDEiIGQ9Ik0xNCwzNjFjLTQuMiwwLTYuNi0yLjItNi43LTIuM2MtMC4yLTAuMi0wLjMtMC41LTAuMy0wLjhjMC4xLTEuNywwLjQtNC43LDEuMy01LjdzMy45LTEuMiw1LjctMS4zaDAuMSAgICBjMS43LDAuMSw0LjcsMC40LDUuNywxLjNjMSwwLjksMS4yLDMuOSwxLjMsNS43YzAsMC4zLTAuMSwwLjYtMC4zLDAuOEMyMC42LDM1OC44LDE4LjIsMzYxLDE0LDM2MXogTTksMzU3LjUgICAgYzAuNywwLjUsMi40LDEuNSw1LDEuNXM0LjMtMSw1LTEuNWMtMC4xLTEuOC0wLjQtMy41LTAuNy0zLjljLTAuMy0wLjItMi40LTAuNi00LjMtMC43Yy0xLjksMC4xLTMuOSwwLjQtNC4zLDAuNyAgICBDOS41LDM1NCw5LjIsMzU1LjgsOSwzNTcuNXoiLz4NCgk8L2c+DQoJPGc+DQoJCTxnPg0KCQkJPHBhdGggY2xhc3M9InN0MSIgZD0iTTgsMzUxYy0yLjIsMC00LTEuOC00LTRjMC0xLjcsMS4xLTMuMiwyLjctMy44YzAuNS0wLjIsMS4xLDAuMSwxLjMsMC42YzAuMiwwLjUtMC4xLDEuMS0wLjYsMS4zICAgICBjLTAuOCwwLjMtMS4zLDEtMS4zLDEuOWMwLDEuMSwwLjksMiwyLDJjMC42LDAsMSwwLjQsMSwxUzguNiwzNTEsOCwzNTF6Ii8+DQoJCTwvZz4NCgkJPGc+DQoJCQk8cGF0aCBjbGFzcz0ic3QxIiBkPSJNNSwzNThjLTAuMSwwLTAuMSwwLTAuMiwwYy0xLjMtMC4zLTIuMy0xLjEtMi40LTEuMmMtMC4zLTAuMi0wLjQtMC42LTAuMy0xYzAuMy0xLjQsMC44LTMuOSwxLjYtNC42ICAgICBjMC40LTAuNCwzLjMtMiw0LjItMi4yYzAuNS0wLjEsMS4xLDAuMywxLjIsMC44cy0wLjMsMS4xLTAuOCwxLjJzLTIuOCwxLjMtMy4yLDEuN2MtMC4yLDAuMi0wLjYsMS41LTAuOSwyLjkgICAgIGMwLjMsMC4yLDAuNywwLjQsMS4xLDAuNWMwLjUsMC4xLDAuOSwwLjYsMC44LDEuMkM1LjksMzU3LjcsNS41LDM1OCw1LDM1OHoiLz4NCgkJPC9nPg0KCQk8Zz4NCgkJCTxwYXRoIGNsYXNzPSJzdDEiIGQ9Ik0yMCwzNTFjLTAuNiwwLTEtMC40LTEtMXMwLjQtMSwxLTFjMS4xLDAsMi0wLjksMi0yYzAtMC44LTAuNS0xLjYtMS4zLTEuOWMtMC41LTAuMi0wLjgtMC44LTAuNi0xLjMgICAgIGMwLjItMC41LDAuOC0wLjgsMS4zLTAuNmMxLjYsMC42LDIuNywyLjEsMi43LDMuOEMyNCwzNDkuMiwyMi4yLDM1MSwyMCwzNTF6Ii8+DQoJCTwvZz4NCgkJPGc+DQoJCQk8cGF0aCBjbGFzcz0ic3QxIiBkPSJNMjMsMzU4Yy0wLjUsMC0wLjktMC4zLTEtMC44czAuMi0xLjEsMC44LTEuMmMwLjQtMC4xLDAuOC0wLjMsMS4xLTAuNWMtMC4zLTEuNC0wLjctMi43LTAuOS0zICAgICBjLTAuNC0wLjMtMi42LTEuNS0zLjEtMS42cy0wLjktMC42LTAuOC0xLjJjMC4xLTAuNSwwLjYtMC45LDEuMS0wLjhjMC45LDAuMiwzLjgsMS44LDQuMiwyLjJjMC44LDAuOCwxLjMsMy4yLDEuNiw0LjYgICAgIGMwLjEsMC40LTAuMSwwLjctMC4zLDFjLTAuMSwwLjEtMS4xLDAuOS0yLjQsMS4yQzIzLjEsMzU4LDIzLjEsMzU4LDIzLDM1OHoiLz4NCgkJPC9nPg0KCTwvZz4NCjwvZz4NCjxnIGlkPSJ0cmFkZS1vbl8xXyI+DQoJPGc+DQoJCTxwYXRoIGNsYXNzPSJzdDAiIGQ9Ik0zNCwzMjNjLTAuMiwwLTAuMywwLTAuNC0wLjFjLTAuMy0wLjItMC42LTAuNS0wLjYtMC45di01YzAtMC4zLDAuMS0wLjYsMC40LTAuOGw0LTMgICAgYzAuMi0wLjEsMC40LTAuMiwwLjYtMC4yaDV2LTJjMC0wLjQsMC4yLTAuOCwwLjYtMC45YzAuNC0wLjIsMC44LTAuMSwxLjEsMC4ybDksOGMwLjMsMC4zLDAuNCwwLjcsMC4zLDEuMXMtMC42LDAuNi0xLDAuNkgzOC4zICAgIGwtMy43LDIuOEMzNC40LDMyMi45LDM0LjIsMzIzLDM0LDMyM3ogTTM1LDMxNy41djIuNWwyLjQtMS44YzAuMi0wLjEsMC40LTAuMiwwLjYtMC4yaDEyLjRsLTUuNC00Ljh2MC44YzAsMC42LTAuNCwxLTEsMWgtNS43ICAgIEwzNSwzMTcuNXoiLz4NCgk8L2c+DQoJPGc+DQoJCTxwYXRoIGNsYXNzPSJzdDAiIGQ9Ik00MCwzMzRjLTAuMiwwLTAuNS0wLjEtMC43LTAuM2wtOS04Yy0wLjMtMC4zLTAuNC0wLjctMC4zLTEuMWMwLjEtMC40LDAuNS0wLjYsMC45LTAuNmgxNC43bDMuNy0yLjggICAgYzAuMy0wLjIsMC43LTAuMywxLTAuMWMwLjMsMC4yLDAuNiwwLjUsMC42LDAuOXY1YzAsMC4zLTAuMSwwLjYtMC40LDAuOGwtNCwzYy0wLjIsMC4xLTAuNCwwLjItMC42LDAuMmgtNXYyICAgIGMwLDAuNC0wLjIsMC44LTAuNiwwLjlDNDAuMywzMzQsNDAuMSwzMzQsNDAsMzM0eiBNMzMuNiwzMjZsNS40LDQuOFYzMzBjMC0wLjYsMC40LTEsMS0xaDUuN2wzLjMtMi41VjMyNGwtMi40LDEuOCAgICBjLTAuMiwwLjEtMC40LDAuMi0wLjYsMC4ySDMzLjZ6Ii8+DQoJPC9nPg0KPC9nPg0KPGcgaWQ9InRyYWRlXzNfIj4NCgk8Zz4NCgkJPHBhdGggY2xhc3M9InN0MSIgZD0iTTYsMzIzYy0wLjIsMC0wLjMsMC0wLjQtMC4xQzUuMiwzMjIuNyw1LDMyMi40LDUsMzIydi01YzAtMC4zLDAuMS0wLjYsMC40LTAuOGw0LTNjMC4yLTAuMSwwLjQtMC4yLDAuNi0wLjIgICAgaDV2LTJjMC0wLjQsMC4yLTAuOCwwLjYtMC45YzAuNC0wLjIsMC44LTAuMSwxLjEsMC4ybDksOGMwLjMsMC4zLDAuNCwwLjcsMC4zLDEuMXMtMC42LDAuNi0xLDAuNkgxMC4zbC0zLjcsMi44ICAgIEM2LjQsMzIyLjksNi4yLDMyMyw2LDMyM3ogTTcsMzE3LjV2Mi41bDIuNC0xLjhjMC4yLTAuMSwwLjQtMC4yLDAuNi0wLjJoMTIuNGwtNS40LTQuOHYwLjhjMCwwLjYtMC40LDEtMSwxaC01LjdMNywzMTcuNXoiLz4NCgk8L2c+DQoJPGc+DQoJCTxwYXRoIGNsYXNzPSJzdDEiIGQ9Ik0xMiwzMzRjLTAuMiwwLTAuNS0wLjEtMC43LTAuM2wtOS04QzIsMzI1LjQsMS45LDMyNSwyLDMyNC42YzAuMS0wLjQsMC42LTAuNiwxLTAuNmgxNC43bDMuNy0yLjggICAgYzAuMy0wLjIsMC43LTAuMywxLTAuMWMwLjMsMC4yLDAuNiwwLjUsMC42LDAuOXY1YzAsMC4zLTAuMSwwLjYtMC40LDAuOGwtNCwzYy0wLjIsMC4xLTAuNCwwLjItMC42LDAuMmgtNXYyICAgIGMwLDAuNC0wLjIsMC44LTAuNiwwLjlDMTIuMywzMzQsMTIuMSwzMzQsMTIsMzM0eiBNNS42LDMyNmw1LjQsNC44VjMzMGMwLTAuNiwwLjQtMSwxLTFoNS43bDMuMy0yLjVWMzI0bC0yLjQsMS44ICAgIGMtMC4yLDAuMS0wLjQsMC4yLTAuNiwwLjJINS42eiIvPg0KCTwvZz4NCjwvZz4NCjxnIGlkPSJpbnZlbnRvcnktb25fMV8iPg0KCTxnPg0KCQk8cGF0aCBkPSJNNTAsMzA2SDM0Yy0wLjYsMC0xLTAuNC0xLTF2LTE0YzAtMi44LDIuMi01LDUtNWg4YzIuOCwwLDUsMi4yLDUsNXYxNEM1MSwzMDUuNiw1MC42LDMwNiw1MCwzMDZ6IE0zNSwzMDRoMTQgICAgdi0xM2MwLTEuNy0xLjMtMy0zLTNoLThjLTEuNywwLTMsMS4zLTMsM1YzMDR6IiBjbGFzcz0ic3QwIi8+DQoJPC9nPg0KCTxnPg0KCQk8cGF0aCBkPSJNMzgsMjk5Yy0wLjYsMC0xLTAuNC0xLTF2LTJjMC0wLjYsMC40LTEsMS0xczEsMC40LDEsMXYyQzM5LDI5OC42LDM4LjYsMjk5LDM4LDI5OXoiIGNsYXNzPSJzdDAiLz4NCgk8L2c+DQoJPGc+DQoJCTxwYXRoIGQ9Ik00NiwyOTljLTAuNiwwLTEtMC40LTEtMXYtMmMwLTAuNiwwLjQtMSwxLTFzMSwwLjQsMSwxdjJDNDcsMjk4LjYsNDYuNiwyOTksNDYsMjk5eiIgY2xhc3M9InN0MCIvPg0KCTwvZz4NCgk8Zz4NCgkJPHBhdGggZD0iTTQ1LjUsMjg4Yy0wLjYsMC0xLTAuNC0xLTF2LTAuNWMwLTEuNC0xLjEtMi41LTIuNS0yLjVzLTIuNSwxLjEtMi41LDIuNXYwLjVjMCwwLjYtMC40LDEtMSwxcy0xLTAuNC0xLTEgICAgdi0wLjVjMC0yLjUsMi00LjUsNC41LTQuNXM0LjUsMiw0LjUsNC41djAuNUM0Ni41LDI4Ny42LDQ2LjEsMjg4LDQ1LjUsMjg4eiIgY2xhc3M9InN0MCIvPg0KCTwvZz4NCgk8Zz4NCgkJPHBhdGggZD0iTTQ0LjksMjk3aC01LjhjLTIuMywwLTQuMy0xLjMtNS40LTMuM2wtMC42LTEuMmwxLjgtMC45bDAuNiwxLjJjMC43LDEuNCwyLjEsMi4yLDMuNiwyLjJoNS44ICAgIGMxLjUsMCwyLjktMC44LDMuNi0yLjJsMC42LTEuMmwxLjgsMC45bC0wLjYsMS4yQzQ5LjMsMjk1LjcsNDcuMiwyOTcsNDQuOSwyOTd6IiBjbGFzcz0ic3QwIi8+DQoJPC9nPg0KPC9nPg0KPGcgaWQ9ImludmVudG9yeV8xXyI+DQoJPGc+DQoJCTxwYXRoIGNsYXNzPSJzdDEiIGQ9Ik0yMiwzMDZINmMtMC42LDAtMS0wLjQtMS0xdi0xNGMwLTIuOCwyLjItNSw1LTVoOGMyLjgsMCw1LDIuMiw1LDV2MTRDMjMsMzA1LjYsMjIuNiwzMDYsMjIsMzA2eiBNNywzMDRoMTQgICAgdi0xM2MwLTEuNy0xLjMtMy0zLTNoLThjLTEuNywwLTMsMS4zLTMsM1YzMDR6Ii8+DQoJPC9nPg0KCTxnPg0KCQk8cGF0aCBjbGFzcz0ic3QxIiBkPSJNMTAsMjk5Yy0wLjYsMC0xLTAuNC0xLTF2LTJjMC0wLjYsMC40LTEsMS0xczEsMC40LDEsMXYyQzExLDI5OC42LDEwLjYsMjk5LDEwLDI5OXoiLz4NCgk8L2c+DQoJPGc+DQoJCTxwYXRoIGNsYXNzPSJzdDEiIGQ9Ik0xOCwyOTljLTAuNiwwLTEtMC40LTEtMXYtMmMwLTAuNiwwLjQtMSwxLTFzMSwwLjQsMSwxdjJDMTksMjk4LjYsMTguNiwyOTksMTgsMjk5eiIvPg0KCTwvZz4NCgk8Zz4NCgkJPHBhdGggY2xhc3M9InN0MSIgZD0iTTE3LjUsMjg4Yy0wLjYsMC0xLTAuNC0xLTF2LTAuNWMwLTEuNC0xLjEtMi41LTIuNS0yLjVzLTIuNSwxLjEtMi41LDIuNXYwLjVjMCwwLjYtMC40LDEtMSwxcy0xLTAuNC0xLTEgICAgdi0wLjVjMC0yLjUsMi00LjUsNC41LTQuNXM0LjUsMiw0LjUsNC41djAuNUMxOC41LDI4Ny42LDE4LjEsMjg4LDE3LjUsMjg4eiIvPg0KCTwvZz4NCgk8Zz4NCgkJPHBhdGggY2xhc3M9InN0MSIgZD0iTTE2LjksMjk3aC01LjhjLTIuMywwLTQuMy0xLjMtNS40LTMuM2wtMC42LTEuMmwxLjgtMC45bDAuNiwxLjJjMC43LDEuNCwyLjEsMi4yLDMuNiwyLjJoNS44ICAgIGMxLjUsMCwyLjktMC44LDMuNi0yLjJsMC42LTEuMmwxLjgsMC45bC0wLjYsMS4yQzIxLjMsMjk1LjcsMTkuMiwyOTcsMTYuOSwyOTd6Ii8+DQoJPC9nPg0KPC9nPg0KPGcgaWQ9ImNoYXJhY3Rlci1vbiI+DQoJPHBhdGggZD0iTTM5LDI2MmMyLjIsMCw0LTEuOCw0LTRjMC0yLjItMS44LTQtNC00cy00LDEuOC00LDRDMzUsMjYwLjIsMzYuOCwyNjIsMzksMjYyeiBNMzksMjU2YzEuMSwwLDIsMC45LDIsMiAgIHMtMC45LDItMiwyYy0xLjEsMC0yLTAuOS0yLTJTMzcuOSwyNTYsMzksMjU2eiIgY2xhc3M9InN0MCIvPg0KCTxwYXRoIGQ9Ik0zOS40LDI3MC4xYy0wLjUtMC4yLTEuMSwwLTEuMywwLjRsLTIuNyw1LjVoLTEuMmwxLjctNy44YzAuMS0wLjUtMC4yLTEuMS0wLjctMS4ybC0zLjItMC44VjI2NWgxMCAgIGMwLjYsMCwxLTAuNCwxLTFzLTAuNC0xLTEtMUgzMWMtMC42LDAtMSwwLjQtMSwxdjNjMCwwLjUsMC4zLDAuOSwwLjgsMWwzLjEsMC44bC0xLjgsOGMtMC4xLDAuMywwLDAuNiwwLjIsMC44ICAgYzAuMiwwLjIsMC41LDAuNCwwLjgsMC40aDNjMC40LDAsMC43LTAuMiwwLjktMC42bDMtNkM0MC4xLDI3MSwzOS45LDI3MC40LDM5LjQsMjcwLjF6IiBjbGFzcz0ic3QwIi8+DQoJPHBhdGggZD0iTTUzLjgsMjU3LjRjLTAuMi0wLjMtMC41LTAuNC0wLjgtMC40aC0yYy0wLjMsMC0wLjYsMC4yLTAuOCwwLjRsLTcsMTBjLTAuMiwwLjItMC4yLDAuNi0wLjEsMC45ICAgYzAuMSwwLjMsMC4zLDAuNSwwLjYsMC42bDUsMmMwLjEsMCwwLjIsMC4xLDAuNCwwLjFjMC4xLDAsMC4zLDAsMC40LTAuMWMwLjItMC4xLDAuNC0wLjMsMC41LTAuNmw0LTEyICAgQzU0LjEsMjU4LDU0LDI1Ny43LDUzLjgsMjU3LjR6IE00OC40LDI2OC43bC0yLjgtMS4xbDYtOC41aDAuMUw0OC40LDI2OC43eiIgY2xhc3M9InN0MCIvPg0KCTxwYXRoIGQ9Ik00NCwyNzBjLTIuNiwwLTMuMiwxLjktMy42LDMuNWMtMC4zLDAuOS0wLjYsMS45LTEuMiwzYy0wLjIsMC4zLTAuMiwwLjcsMCwxYzAuMiwwLjMsMC41LDAuNSwwLjksMC41ICAgYzcsMCw4LTIuNSw4LTRDNDgsMjcxLjQsNDUuNywyNzAsNDQsMjcweiBNNDEuNywyNzUuOWMwLjMtMC43LDAuNS0xLjMsMC42LTEuOWMwLjUtMS43LDAuNy0yLjEsMS43LTIuMWMwLjUsMCwyLDAuNSwyLDIgICBDNDYsMjc1LDQ0LjMsMjc1LjcsNDEuNywyNzUuOXoiIGNsYXNzPSJzdDAiLz4NCjwvZz4NCjxnIGlkPSJjaGFyYWN0ZXJfMV8iPg0KCTxwYXRoIGNsYXNzPSJzdDEiIGQ9Ik0xMSwyNjJjMi4yLDAsNC0xLjgsNC00YzAtMi4yLTEuOC00LTQtNHMtNCwxLjgtNCw0QzcsMjYwLjIsOC44LDI2MiwxMSwyNjJ6IE0xMSwyNTZjMS4xLDAsMiwwLjksMiwyICAgcy0wLjksMi0yLDJzLTItMC45LTItMlM5LjksMjU2LDExLDI1NnoiLz4NCgk8cGF0aCBjbGFzcz0ic3QxIiBkPSJNMTEuNCwyNzAuMWMtMC41LTAuMi0xLjEsMC0xLjMsMC40TDcuNCwyNzZINi4ybDEuNy03LjhjMC4xLTAuNS0wLjItMS4xLTAuNy0xLjJMNCwyNjYuMlYyNjVoMTAgICBjMC42LDAsMS0wLjQsMS0xcy0wLjQtMS0xLTFIM2MtMC42LDAtMSwwLjQtMSwxdjNjMCwwLjUsMC4zLDAuOSwwLjgsMWwzLjEsMC44bC0xLjgsOGMtMC4xLDAuMywwLDAuNiwwLjIsMC44ICAgYzAuMiwwLjIsMC41LDAuNCwwLjgsMC40aDNjMC40LDAsMC43LTAuMiwwLjktMC42bDMtNkMxMi4xLDI3MSwxMS45LDI3MC40LDExLjQsMjcwLjF6Ii8+DQoJPHBhdGggY2xhc3M9InN0MSIgZD0iTTI1LjgsMjU3LjRjLTAuMi0wLjMtMC41LTAuNC0wLjgtMC40aC0yYy0wLjMsMC0wLjYsMC4yLTAuOCwwLjRsLTcsMTBjLTAuMiwwLjItMC4yLDAuNi0wLjEsMC45ICAgYzAuMSwwLjMsMC4zLDAuNSwwLjYsMC42bDUsMmMwLjEsMCwwLjIsMC4xLDAuNCwwLjFjMC4xLDAsMC4zLDAsMC40LTAuMWMwLjItMC4xLDAuNC0wLjMsMC41LTAuNmw0LTEyICAgQzI2LjEsMjU4LDI2LDI1Ny43LDI1LjgsMjU3LjR6IE0yMC40LDI2OC43bC0yLjgtMS4xbDYtOC41aDAuMUwyMC40LDI2OC43eiIvPg0KCTxwYXRoIGNsYXNzPSJzdDEiIGQ9Ik0xNiwyNzBjLTIuNiwwLTMuMiwxLjktMy42LDMuNWMtMC4zLDAuOS0wLjYsMS45LTEuMiwzYy0wLjIsMC4zLTAuMiwwLjcsMCwxczAuNSwwLjUsMC45LDAuNWM3LDAsOC0yLjUsOC00ICAgQzIwLDI3MS40LDE3LjcsMjcwLDE2LDI3MHogTTEzLjcsMjc1LjljMC4zLTAuNywwLjUtMS4zLDAuNi0xLjljMC41LTEuNywwLjctMi4xLDEuNy0yLjFjMC41LDAsMiwwLjUsMiwyICAgQzE4LDI3NSwxNi4zLDI3NS43LDEzLjcsMjc1Ljl6Ii8+DQo8L2c+DQo8ZyBpZD0iZnJpZW5kcy1vbl8xXyI+DQoJPGc+DQoJCTxwYXRoIGNsYXNzPSJzdDAiIGQ9Ik0zOSwyMzhjLTMuMywwLTYtMi43LTYtNnMyLjctNiw2LTZzNiwyLjcsNiw2UzQyLjMsMjM4LDM5LDIzOHogTTM5LDIyOGMtMi4yLDAtNCwxLjgtNCw0czEuOCw0LDQsNCAgICBzNC0xLjgsNC00UzQxLjIsMjI4LDM5LDIyOHoiLz4NCgk8L2c+DQoJPGc+DQoJCTxwYXRoIGNsYXNzPSJzdDAiIGQ9Ik00NywyMzguNmMtMC40LDAtMC44LTAuMi0wLjktMC42Yy0wLjItMC41LDAtMS4xLDAuNS0xLjNjMS41LTAuNiwyLjQtMi4xLDIuNC0zLjdjMC0xLjktMS4zLTMuNS0zLjItMy45ICAgIGMtMC41LTAuMS0wLjktMC42LTAuOC0xLjJjMC4xLTAuNSwwLjYtMC45LDEuMi0wLjhjMi44LDAuNiw0LjgsMyw0LjgsNS45YzAsMi40LTEuNCw0LjUtMy42LDUuNUM0Ny4zLDIzOC42LDQ3LjEsMjM4LjYsNDcsMjM4LjZ6ICAgICIvPg0KCTwvZz4NCgk8Zz4NCgkJPHBhdGggY2xhc3M9InN0MCIgZD0iTTM5LDI1MGMtNS4yLDAtOC40LTIuMS04LjUtMi4yYy0wLjMtMC4yLTAuNS0wLjYtMC40LTFjMC4yLTEuMiwxLjEtNS40LDIuMy02LjVjMS4yLTEuMiw1LjEtMS4zLDYuNy0xLjMgICAgYzEuNiwwLDUuNSwwLjEsNi43LDEuM2MxLjEsMS4xLDIsNS4zLDIuMyw2LjVjMC4xLDAuNC0wLjEsMC44LTAuNCwxQzQ3LjQsMjQ3LjksNDQuMiwyNTAsMzksMjUweiBNMzIuMSwyNDYuNSAgICBjMS4xLDAuNSwzLjUsMS41LDYuOSwxLjVzNS44LTEsNi45LTEuNWMtMC41LTIuMS0xLjItNC4zLTEuNi00LjhjLTAuNC0wLjQtMi45LTAuNy01LjMtMC43cy00LjksMC4zLTUuMywwLjcgICAgQzMzLjMsMjQyLjEsMzIuNiwyNDQuNCwzMi4xLDI0Ni41eiIvPg0KCTwvZz4NCgk8Zz4NCgkJPHBhdGggY2xhc3M9InN0MCIgZD0iTTUwLDI0OWMtMC40LDAtMC44LTAuMy0xLTAuN2MtMC4yLTAuNSwwLjEtMS4xLDAuNy0xLjJjMS4xLTAuMywxLjgtMSwyLjItMS4zYy0wLjUtMi4yLTEuMi00LjYtMS42LTUgICAgYy0wLjYtMC42LTIuNi0yLTMuNC0yLjFjLTAuNS0wLjEtMC45LTAuNi0wLjktMS4xYzAuMS0wLjUsMC41LTEsMS4xLTAuOWMxLjcsMC4yLDQuMywyLjQsNC42LDIuN2MxLjEsMS4xLDIsNS4zLDIuMyw2LjUgICAgYzAuMSwwLjMsMCwwLjYtMC4yLDAuOGMtMC4xLDAuMS0xLjMsMS43LTMuNSwyLjRDNTAuMiwyNDksNTAuMSwyNDksNTAsMjQ5eiIvPg0KCTwvZz4NCjwvZz4NCjxnIGlkPSJmcmllbmRzXzNfIj4NCgk8Zz4NCgkJPHBhdGggY2xhc3M9InN0MSIgZD0iTTExLDIzOGMtMy4zLDAtNi0yLjctNi02czIuNy02LDYtNnM2LDIuNyw2LDZTMTQuMywyMzgsMTEsMjM4eiBNMTEsMjI4Yy0yLjIsMC00LDEuOC00LDRzMS44LDQsNCw0ICAgIHM0LTEuOCw0LTRTMTMuMiwyMjgsMTEsMjI4eiIvPg0KCTwvZz4NCgk8Zz4NCgkJPHBhdGggY2xhc3M9InN0MSIgZD0iTTE5LDIzOC42Yy0wLjQsMC0wLjgtMC4yLTAuOS0wLjZjLTAuMi0wLjUsMC0xLjEsMC41LTEuM2MxLjUtMC42LDIuNC0yLjEsMi40LTMuN2MwLTEuOS0xLjMtMy41LTMuMi0zLjkgICAgYy0wLjUtMC4xLTAuOS0wLjYtMC44LTEuMmMwLjEtMC41LDAuNi0wLjksMS4yLTAuOGMyLjgsMC42LDQuOCwzLDQuOCw1LjljMCwyLjQtMS40LDQuNS0zLjYsNS41QzE5LjMsMjM4LjYsMTkuMSwyMzguNiwxOSwyMzguNnogICAgIi8+DQoJPC9nPg0KCTxnPg0KCQk8cGF0aCBjbGFzcz0ic3QxIiBkPSJNMTEsMjUwYy01LjIsMC04LjQtMi4xLTguNS0yLjJjLTAuMy0wLjItMC41LTAuNi0wLjQtMWMwLjItMS4yLDEuMS01LjQsMi4zLTYuNWMxLjItMS4yLDUuMS0xLjMsNi43LTEuMyAgICBzNS41LDAuMSw2LjcsMS4zYzEuMSwxLjEsMiw1LjMsMi4zLDYuNWMwLjEsMC40LTAuMSwwLjgtMC40LDFDMTkuNCwyNDcuOSwxNi4yLDI1MCwxMSwyNTB6IE00LjEsMjQ2LjVDNS4yLDI0Nyw3LjYsMjQ4LDExLDI0OCAgICBzNS44LTEsNi45LTEuNWMtMC41LTIuMS0xLjItNC4zLTEuNi00LjhjLTAuNC0wLjQtMi45LTAuNy01LjMtMC43cy00LjksMC4zLTUuMywwLjdDNS4zLDI0Mi4xLDQuNiwyNDQuNCw0LjEsMjQ2LjV6Ii8+DQoJPC9nPg0KCTxnPg0KCQk8cGF0aCBjbGFzcz0ic3QxIiBkPSJNMjIsMjQ5Yy0wLjQsMC0wLjgtMC4zLTEtMC43Yy0wLjItMC41LDAuMS0xLjEsMC43LTEuMmMxLjEtMC4zLDEuOC0xLDIuMi0xLjNjLTAuNS0yLjItMS4yLTQuNi0xLjYtNSAgICBjLTAuNi0wLjYtMi42LTItMy40LTIuMWMtMC41LTAuMS0wLjktMC42LTAuOS0xLjFjMC4xLTAuNSwwLjUtMSwxLjEtMC45YzEuNywwLjIsNC4zLDIuNCw0LjYsMi43YzEuMSwxLjEsMiw1LjMsMi4zLDYuNSAgICBjMC4xLDAuMywwLDAuNi0wLjIsMC44Yy0wLjEsMC4xLTEuMywxLjctMy41LDIuNEMyMi4yLDI0OSwyMi4xLDI0OSwyMiwyNDl6Ii8+DQoJPC9nPg0KPC9nPg0KPGcgaWQ9Im1lc3NhZ2Utb25fMV8iPg0KCTxnPg0KCQk8cGF0aCBjbGFzcz0ic3QwIiBkPSJNNDIsMjIxYy0wLjMsMC0wLjUtMC4xLTAuNy0wLjNsLTMuNy0zLjdIMzFjLTAuNiwwLTEtMC40LTEtMXYtMTZjMC0wLjYsMC40LTEsMS0xaDIyYzAuNiwwLDEsMC40LDEsMXYxNiAgICBjMCwwLjYtMC40LDEtMSwxaC02LjZsLTMuNywzLjdDNDIuNSwyMjAuOSw0Mi4zLDIyMSw0MiwyMjF6IE0zMiwyMTVoNmMwLjMsMCwwLjUsMC4xLDAuNywwLjNsMy4zLDMuM2wzLjMtMy4zICAgIGMwLjItMC4yLDAuNC0wLjMsMC43LTAuM2g2di0xNEgzMlYyMTV6Ii8+DQoJPC9nPg0KCTxnPg0KCQk8cGF0aCBjbGFzcz0ic3QwIiBkPSJNNDgsMjA3SDM2Yy0wLjYsMC0xLTAuNC0xLTFzMC40LTEsMS0xaDEyYzAuNiwwLDEsMC40LDEsMVM0OC42LDIwNyw0OCwyMDd6Ii8+DQoJPC9nPg0KCTxnPg0KCQk8cGF0aCBjbGFzcz0ic3QwIiBkPSJNNDgsMjExSDM2Yy0wLjYsMC0xLTAuNC0xLTFzMC40LTEsMS0xaDEyYzAuNiwwLDEsMC40LDEsMVM0OC42LDIxMSw0OCwyMTF6Ii8+DQoJPC9nPg0KPC9nPg0KPGcgaWQ9Im1lc3NhZ2VfM18iPg0KCTxnPg0KCQk8cGF0aCBjbGFzcz0ic3QxIiBkPSJNMTQsMjIxYy0wLjMsMC0wLjUtMC4xLTAuNy0wLjNMOS42LDIxN0gzYy0wLjYsMC0xLTAuNC0xLTF2LTE2YzAtMC42LDAuNC0xLDEtMWgyMmMwLjYsMCwxLDAuNCwxLDF2MTYgICAgYzAsMC42LTAuNCwxLTEsMWgtNi42bC0zLjcsMy43QzE0LjUsMjIwLjksMTQuMywyMjEsMTQsMjIxeiBNNCwyMTVoNmMwLjMsMCwwLjUsMC4xLDAuNywwLjNsMy4zLDMuM2wzLjMtMy4zICAgIGMwLjItMC4yLDAuNC0wLjMsMC43LTAuM2g2di0xNEg0VjIxNXoiLz4NCgk8L2c+DQoJPGc+DQoJCTxwYXRoIGNsYXNzPSJzdDEiIGQ9Ik0yMCwyMDdIOGMtMC42LDAtMS0wLjQtMS0xczAuNC0xLDEtMWgxMmMwLjYsMCwxLDAuNCwxLDFTMjAuNiwyMDcsMjAsMjA3eiIvPg0KCTwvZz4NCgk8Zz4NCgkJPHBhdGggY2xhc3M9InN0MSIgZD0iTTIwLDIxMUg4Yy0wLjYsMC0xLTAuNC0xLTFzMC40LTEsMS0xaDEyYzAuNiwwLDEsMC40LDEsMVMyMC42LDIxMSwyMCwyMTF6Ii8+DQoJPC9nPg0KPC9nPg0KPGcgaWQ9InByb2ZpbGUtb25fMV8iPg0KCTxnPg0KCQk8cGF0aCBkPSJNNDIsMTgyYy0zLjMsMC02LTIuNy02LTZzMi43LTYsNi02czYsMi43LDYsNlM0NS4zLDE4Miw0MiwxODJ6IE00MiwxNzJjLTIuMiwwLTQsMS44LTQsNHMxLjgsNCw0LDQgICAgczQtMS44LDQtNFM0NC4yLDE3Miw0MiwxNzJ6IiBjbGFzcz0ic3QwIi8+DQoJPC9nPg0KCTxnPg0KCQk8cGF0aCBkPSJNNDIsMTk0Yy01LjIsMC04LjQtMi4xLTguNS0yLjJjLTAuMy0wLjItMC41LTAuNi0wLjQtMWMwLjItMS4yLDEuMS01LjQsMi4zLTYuNWMxLjItMS4yLDUuMS0xLjMsNi43LTEuMyAgICBjMS42LDAsNS41LDAuMSw2LjcsMS4zYzEuMSwxLjEsMiw1LjMsMi4zLDYuNWMwLjEsMC40LTAuMSwwLjgtMC40LDFDNTAuNCwxOTEuOSw0Ny4yLDE5NCw0MiwxOTR6IE0zNS4xLDE5MC41ICAgIGMxLjEsMC41LDMuNSwxLjUsNi45LDEuNXM1LjgtMSw2LjktMS41Yy0wLjUtMi4xLTEuMi00LjMtMS42LTQuOGMtMC40LTAuNC0yLjktMC43LTUuMy0wLjdzLTQuOSwwLjMtNS4zLDAuNyAgICBDMzYuMywxODYuMSwzNS42LDE4OC40LDM1LjEsMTkwLjV6IiBjbGFzcz0ic3QwIi8+DQoJPC9nPg0KPC9nPg0KPGcgaWQ9InByb2ZpbGVfM18iPg0KCTxnPg0KCQk8cGF0aCBjbGFzcz0ic3QxIiBkPSJNMTQsMTgyYy0zLjMsMC02LTIuNy02LTZzMi43LTYsNi02czYsMi43LDYsNlMxNy4zLDE4MiwxNCwxODJ6IE0xNCwxNzJjLTIuMiwwLTQsMS44LTQsNHMxLjgsNCw0LDQgICAgczQtMS44LDQtNFMxNi4yLDE3MiwxNCwxNzJ6Ii8+DQoJPC9nPg0KCTxnPg0KCQk8cGF0aCBjbGFzcz0ic3QxIiBkPSJNMTQsMTk0Yy01LjIsMC04LjQtMi4xLTguNS0yLjJjLTAuMy0wLjItMC41LTAuNi0wLjQtMWMwLjItMS4yLDEuMS01LjQsMi4zLTYuNWMxLjItMS4yLDUuMS0xLjMsNi43LTEuMyAgICBzNS41LDAuMSw2LjcsMS4zYzEuMSwxLjEsMiw1LjMsMi4zLDYuNWMwLjEsMC40LTAuMSwwLjgtMC40LDFDMjIuNCwxOTEuOSwxOS4yLDE5NCwxNCwxOTR6IE03LjEsMTkwLjVjMS4xLDAuNSwzLjUsMS41LDYuOSwxLjUgICAgczUuOC0xLDYuOS0xLjVjLTAuNS0yLjEtMS4yLTQuMy0xLjYtNC44Yy0wLjQtMC40LTIuOS0wLjctNS4zLTAuN3MtNC45LDAuMy01LjMsMC43QzguMywxODYuMSw3LjYsMTg4LjQsNy4xLDE5MC41eiIvPg0KCTwvZz4NCjwvZz4NCjxnIGlkPSJob21lLW9uXzFfIj4NCgk8cGF0aCBkPSJNNTEsMTY1aC03Yy0wLjYsMC0xLTAuNC0xLTF2LTZoLTJ2NmMwLDAuNi0wLjQsMS0xLDFoLTdjLTAuNiwwLTEtMC40LTEtMXYtOWgtMWMtMC40LDAtMC44LTAuMy0wLjktMC42ICAgYy0wLjEtMC40LDAtMC44LDAuMy0xLjFsMTEtMTBjMC40LTAuMywxLTAuMywxLjMsMGwxMSwxMGMwLjMsMC4zLDAuNCwwLjcsMC4zLDEuMWMtMC4xLDAuNC0wLjUsMC42LTAuOSwwLjZoLTF2OSAgIEM1MiwxNjQuNiw1MS42LDE2NSw1MSwxNjV6IE00NSwxNjNoNXYtOWMwLTAuNCwwLjItMC43LDAuNS0wLjlsLTguNS03LjhsLTguNSw3LjhjMC4zLDAuMiwwLjUsMC41LDAuNSwwLjl2OWg1di02YzAtMC42LDAuNC0xLDEtMSAgIGg0YzAuNiwwLDEsMC40LDEsMVYxNjN6IiBjbGFzcz0ic3QwIi8+DQo8L2c+DQo8ZyBpZD0iaG9tZV8xXyI+DQoJPHBhdGggZD0iTTIzLDE2NWgtN2MtMC42LDAtMS0wLjQtMS0xdi02aC0ydjZjMCwwLjYtMC40LDEtMSwxSDVjLTAuNiwwLTEtMC40LTEtMXYtOUgzYy0wLjQsMC0wLjgtMC4zLTAuOS0wLjYgICBjLTAuMS0wLjQsMC0wLjgsMC4zLTEuMWwxMS0xMGMwLjQtMC4zLDEtMC4zLDEuMywwbDExLDEwYzAuMywwLjMsMC40LDAuNywwLjMsMS4xYy0wLjEsMC40LTAuNSwwLjYtMC45LDAuNmgtMXY5ICAgQzI0LDE2NC42LDIzLjYsMTY1LDIzLDE2NXogTTE3LDE2M2g1di05YzAtMC40LDAuMi0wLjcsMC41LTAuOWwtOC41LTcuOGwtOC41LDcuOGMwLjMsMC4yLDAuNSwwLjUsMC41LDAuOXY5aDV2LTZjMC0wLjYsMC40LTEsMS0xICAgaDRjMC42LDAsMSwwLjQsMSwxVjE2M3oiIGNsYXNzPSJzdDEiLz4NCjwvZz4NCjxnIGlkPSJzZXR0aW5ncy1vbl8xXyI+DQoJPHBhdGggZD0iTTUzLDk2aC0xLjJjLTAuMy0xLjMtMC44LTIuNS0xLjUtMy41bDAuOS0wLjljMC40LTAuNCwwLjQtMSwwLTEuNGwtMS40LTEuNGMtMC40LTAuNC0xLTAuNC0xLjQsMGwtMC45LDAuOSAgIGMtMS0wLjctMi4yLTEuMi0zLjUtMS41Vjg3YzAtMC42LTAuNC0xLTEtMWgtMmMtMC42LDAtMSwwLjQtMSwxdjEuMmMtMS4zLDAuMy0yLjUsMC44LTMuNSwxLjVsLTAuOS0wLjljLTAuNC0wLjQtMS0wLjQtMS40LDAgICBsLTEuNCwxLjRjLTAuNCwwLjQtMC40LDEsMCwxLjRsMC45LDAuOWMtMC43LDEtMS4yLDIuMi0xLjUsMy41SDMxYy0wLjYsMC0xLDAuNC0xLDF2MmMwLDAuNiwwLjQsMSwxLDFoMS4yICAgYzAuMywxLjMsMC44LDIuNSwxLjUsMy41bC0wLjksMC45Yy0wLjQsMC40LTAuNCwxLDAsMS40bDEuNCwxLjRjMC40LDAuNCwxLDAuNCwxLjQsMGwwLjktMC45YzEsMC43LDIuMiwxLjIsMy41LDEuNXYxLjIgICBjMCwwLjYsMC40LDEsMSwxaDJjMC42LDAsMS0wLjQsMS0xdi0xLjJjMS4zLTAuMywyLjUtMC44LDMuNS0xLjVsMC45LDAuOWMwLjQsMC40LDEsMC40LDEuNCwwbDEuNC0xLjRjMC40LTAuNCwwLjQtMSwwLTEuNCAgIGwtMC45LTAuOWMwLjctMSwxLjItMi4yLDEuNS0zLjVINTNjMC42LDAsMS0wLjQsMS0xdi0yQzU0LDk2LjQsNTMuNiw5Niw1Myw5NnogTTQyLDEwNGMtMy4zLDAtNi0yLjctNi02czIuNy02LDYtNnM2LDIuNyw2LDYgICBTNDUuMywxMDQsNDIsMTA0eiIgY2xhc3M9InN0MCIvPg0KPC9nPg0KPGcgaWQ9InNldHRpbmdzXzFfIj4NCgk8Zz4NCgkJPHBhdGggZD0iTTE2LDExMGgtNGMtMC42LDAtMS0wLjQtMS0xdi0xLjVjLTAuNi0wLjItMS4xLTAuNC0xLjYtMC43bC0wLjksMC45Yy0wLjQsMC40LTEsMC40LTEuNCwwTDQuMiwxMDUgICAgYy0wLjQtMC40LTAuNC0xLDAtMS40bDAuOS0wLjljLTAuMy0wLjUtMC41LTEuMS0wLjctMS42SDNjLTAuNiwwLTEtMC40LTEtMXYtNGMwLTAuNiwwLjQtMSwxLTFoMS41YzAuMi0wLjYsMC40LTEuMSwwLjctMS42ICAgIGwtMC45LTAuOWMtMC40LTAuNC0wLjQtMSwwLTEuNGwyLjctM2MwLjItMC4yLDAuNC0wLjMsMC43LTAuM2wwLDBjMC4zLDAsMC41LDAuMSwwLjcsMC4zbDAuOSwwLjljMC41LTAuMywxLjEtMC41LDEuNi0wLjdWODcgICAgYzAtMC42LDAuNC0xLDEtMWg0YzAuNiwwLDEsMC40LDEsMXYxLjVjMC42LDAuMiwxLjEsMC40LDEuNiwwLjdsMC45LTAuOWMwLjQtMC40LDEtMC40LDEuNCwwbDIuOCwyLjhjMC40LDAuNCwwLjQsMSwwLDEuNCAgICBsLTAuOSwwLjljMC4zLDAuNSwwLjUsMS4xLDAuNywxLjZIMjVjMC42LDAsMSwwLjQsMSwxdjRjMCwwLjYtMC40LDEtMSwxaC0xLjVjLTAuMiwwLjYtMC40LDEuMS0wLjcsMS42bDAuOSwwLjkgICAgYzAuNCwwLjQsMC40LDEsMCwxLjRsLTIuOCwyLjhjLTAuMiwwLjItMC40LDAuMy0wLjcsMC4zbDAsMGMtMC4zLDAtMC41LTAuMS0wLjctMC4zbC0wLjktMC45Yy0wLjUsMC4zLTEuMSwwLjUtMS42LDAuN3YxLjUgICAgQzE3LDEwOS42LDE2LjYsMTEwLDE2LDExMHogTTEzLDEwOGgydi0xLjJjMC0wLjUsMC4zLTAuOSwwLjgtMWMwLjktMC4yLDEuNy0wLjUsMi41LTFjMC40LTAuMiwwLjktMC4yLDEuMiwwLjFsMC44LDAuOGwxLjQtMS40ICAgIGwtMC44LTAuOGMtMC4zLTAuMy0wLjQtMC44LTAuMS0xLjJjMC41LTAuOCwwLjgtMS42LDEtMi41YzAuMS0wLjUsMC41LTAuOCwxLTAuOEgyNHYtMmgtMS4yYy0wLjUsMC0wLjktMC4zLTEtMC44ICAgIGMtMC4yLTAuOS0wLjUtMS43LTEtMi41Yy0wLjItMC40LTAuMi0wLjksMC4xLTEuMmwwLjgtMC44bC0xLjQtMS40bC0wLjgsMC44Yy0wLjMsMC4zLTAuOCwwLjQtMS4yLDAuMWMtMC44LTAuNS0xLjYtMC44LTIuNS0xICAgIGMtMC41LTAuMS0wLjgtMC41LTAuOC0xVjg4aC0ydjEuMmMwLDAuNS0wLjMsMC45LTAuOCwxYy0wLjksMC4yLTEuNywwLjUtMi41LDFjLTAuNCwwLjItMC45LDAuMi0xLjItMC4xbC0wLjgtMC44bC0xLjQsMS40ICAgIGwwLjgsMC44YzAuMywwLjMsMC40LDAuOCwwLjEsMS4yYy0wLjUsMC44LTAuOCwxLjYtMSwyLjVjLTAuMSwwLjUtMC41LDAuOC0xLDAuOEg0djJoMS4yYzAuNSwwLDAuOSwwLjMsMSwwLjggICAgYzAuMiwwLjksMC41LDEuNywxLDIuNWMwLjIsMC40LDAuMiwwLjktMC4xLDEuMmwtMC44LDAuOGwxLjQsMS40bDAuOC0wLjhjMC4zLTAuMywwLjgtMC40LDEuMi0wLjFjMC44LDAuNSwxLjYsMC44LDIuNSwxICAgIGMwLjUsMC4xLDAuOCwwLjUsMC44LDFWMTA4eiIgY2xhc3M9InN0MCIvPg0KCTwvZz4NCgk8Zz4NCgkJPHBhdGggZD0iTTE0LDEwNGMtMy4zLDAtNi0yLjctNi02czIuNy02LDYtNnM2LDIuNyw2LDZTMTcuMywxMDQsMTQsMTA0eiBNMTQsOTRjLTIuMiwwLTQsMS44LTQsNHMxLjgsNCw0LDRzNC0xLjgsNC00ICAgIFMxNi4yLDk0LDE0LDk0eiIgY2xhc3M9InN0MCIvPg0KCTwvZz4NCjwvZz4NCjxnIGlkPSJ0aXgtb25fMV8iPg0KCTxwYXRoIGQ9Ik01MSw2NWgtMmwtMi0ydi0ybC0zLTNMMzAsNzJsMywzaDJsMiwydjJsMywzbDE0LTE0TDUxLDY1eiBNNDQuNyw3Mi43QzQ0LjUsNzIuOSw0NC4zLDczLDQ0LDczICAgcy0wLjUtMC4xLTAuNy0wLjNMNDAsNjkuNGwtMS4zLDEuM0MzOC41LDcwLjksMzguMyw3MSwzOCw3MXMtMC41LTAuMS0wLjctMC4zYy0wLjQtMC40LTAuNC0xLDAtMS40bDQtNGMwLjQtMC40LDEtMC40LDEuNCwwICAgczAuNCwxLDAsMS40TDQxLjQsNjhsMy4zLDMuM0M0NS4xLDcxLjcsNDUuMSw3Mi4zLDQ0LjcsNzIuN3oiIGNsYXNzPSJzdDAiLz4NCjwvZz4NCjxnIGlkPSJ0aXhfMl8iPg0KCTxnPg0KCQk8cGF0aCBkPSJNMTIsODJjLTAuMywwLTAuNS0wLjEtMC43LTAuM2wtMy0zQzguMSw3OC41LDgsNzguMyw4LDc4di0xLjZMNy42LDc2SDZjLTAuMywwLTAuNS0wLjEtMC43LTAuM2wtMy0zICAgIGMtMC40LTAuNC0wLjQtMSwwLTEuNGwxMy0xM2MwLjQtMC40LDEtMC40LDEuNCwwbDMsM2MwLjIsMC4yLDAuMywwLjQsMC4zLDAuN3YxLjZsMC40LDAuNEgyMmMwLjMsMCwwLjUsMC4xLDAuNywwLjNsMywzICAgIGMwLjQsMC40LDAuNCwxLDAsMS40bC0xMywxM0MxMi41LDgxLjksMTIuMyw4MiwxMiw4MnogTTEwLDc3LjZsMiwyTDIzLjYsNjhsLTItMkgyMGMtMC4zLDAtMC41LTAuMS0wLjctMC4zbC0xLTEgICAgQzE4LjEsNjQuNSwxOCw2NC4zLDE4LDY0di0xLjZsLTItMkw0LjQsNzJsMiwySDhjMC4zLDAsMC41LDAuMSwwLjcsMC4zbDEsMUM5LjksNzUuNSwxMCw3NS43LDEwLDc2Vjc3LjZ6IiBjbGFzcz0ic3QwIi8+DQoJPC9nPg0KCTxnPg0KCQk8cGF0aCBkPSJNMTAsNzFjLTAuMywwLTAuNS0wLjEtMC43LTAuM2MtMC40LTAuNC0wLjQtMSwwLTEuNGw0LTRjMC40LTAuNCwxLTAuNCwxLjQsMHMwLjQsMSwwLDEuNGwtNCw0ICAgIEMxMC41LDcwLjksMTAuMyw3MSwxMCw3MXoiIGNsYXNzPSJzdDAiLz4NCgk8L2c+DQoJPGc+DQoJCTxwYXRoIGQ9Ik0xNiw3M2MtMC4zLDAtMC41LTAuMS0wLjctMC4zbC00LTRjLTAuNC0wLjQtMC40LTEsMC0xLjRzMS0wLjQsMS40LDBsNCw0YzAuNCwwLjQsMC40LDEsMCwxLjQgICAgQzE2LjUsNzIuOSwxNi4zLDczLDE2LDczeiIgY2xhc3M9InN0MCIvPg0KCTwvZz4NCjwvZz4NCjxnIGlkPSJyb2J1eC1vbl8xXyI+DQoJPHBhdGggZD0iTTM3LDM5djJoMi42YzAuMS0wLjUsMC4xLTEuNSwwLTJIMzd6IiBjbGFzcz0ic3QwIi8+DQoJPHBhdGggZD0iTTQyLDMwYy02LjYsMC0xMiw1LjQtMTIsMTJzNS40LDEyLDEyLDEyczEyLTUuNCwxMi0xMlM0OC42LDMwLDQyLDMweiBNNDcsNDd2MWMwLDAuNi0wLjQsMS0xLDFzLTEtMC40LTEtMXYtMSAgIGgtM2MtMC4yLDAtMC40LTAuMS0wLjYtMC4yTDM3LDQzLjNWNDZjMCwwLjYtMC40LDEtMSwxcy0xLTAuNC0xLTF2LThjMC0wLjYsMC40LTEsMS0xaDRjMS4xLDAsMS43LDEuMSwxLjcsMyAgIGMwLDAuNi0wLjEsMS4yLTAuMiwxLjdDNDEuMSw0Mi45LDQwLjMsNDMsNDAsNDNoLTAuMWwyLjUsMkg0N2MwLjMsMCwwLjUtMC41LDAuNS0xYzAtMC40LTAuMS0xLTAuNS0xaC0yYy0xLjQsMC0yLjUtMS4zLTIuNS0zICAgYzAtMC43LDAuMi0xLjQsMC41LTEuOWMwLjUtMC43LDEuMi0xLjEsMi0xLjF2LTFjMC0wLjYsMC40LTEsMS0xczEsMC40LDEsMXYxaDFjMC42LDAsMSwwLjQsMSwxcy0wLjQsMS0xLDFoLTMgICBjLTAuMSwwLTAuMiwwLTAuMywwLjJzLTAuMiwwLjUtMC4yLDAuOGMwLDAuNCwwLjIsMSwwLjUsMWgyYzEuNCwwLDIuNSwxLjMsMi41LDNTNDguNCw0Nyw0Nyw0N3oiIGNsYXNzPSJzdDAiLz4NCjwvZz4NCjxnIGlkPSJyb2J1eF8yXyI+DQoJPGc+DQoJCTxwYXRoIGQ9Ik0xNCw1NEM3LjQsNTQsMiw0OC42LDIsNDJzNS40LTEyLDEyLTEyczEyLDUuNCwxMiwxMlMyMC42LDU0LDE0LDU0eiBNMTQsMzJDOC41LDMyLDQsMzYuNSw0LDQyczQuNSwxMCwxMCwxMCAgICBzMTAtNC41LDEwLTEwUzE5LjUsMzIsMTQsMzJ6IiBjbGFzcz0ic3QwIi8+DQoJPC9nPg0KCTxnPg0KCQk8Zz4NCgkJCTxwYXRoIGQ9Ik0xOSw0N2gtNWMtMC4yLDAtMC40LTAuMS0wLjYtMC4yTDksNDMuM1Y0NmMwLDAuNi0wLjQsMS0xLDFzLTEtMC40LTEtMXYtOGMwLTAuNiwwLjQtMSwxLTFoNCAgICAgYzEuMSwwLDEuNywxLjEsMS43LDNjMCwwLjYtMC4xLDEuMi0wLjIsMS43QzEzLjEsNDIuOSwxMi4zLDQzLDEyLDQzaC0wLjFsMi41LDJIMTljMC4zLDAsMC41LTAuNSwwLjUtMWMwLTAuNC0wLjEtMS0wLjUtMWgtMiAgICAgYy0xLjQsMC0yLjUtMS4zLTIuNS0zYzAtMC43LDAuMi0xLjQsMC41LTEuOWMwLjUtMC43LDEuMi0xLjEsMi0xLjFoM2MwLjYsMCwxLDAuNCwxLDFzLTAuNCwxLTEsMWgtM2MtMC4xLDAtMC4yLDAtMC4zLDAuMiAgICAgYy0wLjEsMC4yLTAuMiwwLjUtMC4yLDAuOGMwLDAuNCwwLjIsMSwwLjUsMWgyYzEuNCwwLDIuNSwxLjMsMi41LDNTMjAuNCw0NywxOSw0N3ogTTksNDFoMi42YzAuMS0wLjUsMC4xLTEuNSwwLTJIOVY0MXoiIGNsYXNzPSJzdDAiLz4NCgkJPC9nPg0KCQk8Zz4NCgkJCTxwYXRoIGQ9Ik0xOCwzOGMtMC42LDAtMS0wLjQtMS0xdi0xYzAtMC42LDAuNC0xLDEtMXMxLDAuNCwxLDF2MUMxOSwzNy42LDE4LjYsMzgsMTgsMzh6IiBjbGFzcz0ic3QwIi8+DQoJCTwvZz4NCgkJPGc+DQoJCQk8cGF0aCBkPSJNMTgsNDljLTAuNiwwLTEtMC40LTEtMXYtMWMwLTAuNiwwLjQtMSwxLTFzMSwwLjQsMSwxdjFDMTksNDguNiwxOC42LDQ5LDE4LDQ5eiIgY2xhc3M9InN0MCIvPg0KCQk8L2c+DQoJPC9nPg0KPC9nPg0KPGcgaWQ9Im1lbnUtb25fMV8iPg0KCTxnPg0KCQk8cGF0aCBkPSJNNTAsMTBIMzRjLTAuNiwwLTEtMC40LTEtMXMwLjQtMSwxLTFoMTZjMC42LDAsMSwwLjQsMSwxUzUwLjYsMTAsNTAsMTB6IiBjbGFzcz0ic3QwIi8+DQoJPC9nPg0KCTxnPg0KCQk8cGF0aCBkPSJNNTAsMTVIMzRjLTAuNiwwLTEtMC40LTEtMXMwLjQtMSwxLTFoMTZjMC42LDAsMSwwLjQsMSwxUzUwLjYsMTUsNTAsMTV6IiBjbGFzcz0ic3QwIi8+DQoJPC9nPg0KCTxnPg0KCQk8cGF0aCBkPSJNNTAsMjBIMzRjLTAuNiwwLTEtMC40LTEtMXMwLjQtMSwxLTFoMTZjMC42LDAsMSwwLjQsMSwxUzUwLjYsMjAsNTAsMjB6IiBjbGFzcz0ic3QwIi8+DQoJPC9nPg0KPC9nPg0KPGcgaWQ9Im1lbnVfMl8iPg0KCTxnPg0KCQk8cGF0aCBkPSJNMjIsMTBINmMtMC42LDAtMS0wLjQtMS0xczAuNC0xLDEtMWgxNmMwLjYsMCwxLDAuNCwxLDFTMjIuNiwxMCwyMiwxMHoiIGNsYXNzPSJzdDAiLz4NCgk8L2c+DQoJPGc+DQoJCTxwYXRoIGQ9Ik0yMiwxNUg2Yy0wLjYsMC0xLTAuNC0xLTFzMC40LTEsMS0xaDE2YzAuNiwwLDEsMC40LDEsMVMyMi42LDE1LDIyLDE1eiIgY2xhc3M9InN0MCIvPg0KCTwvZz4NCgk8Zz4NCgkJPHBhdGggZD0iTTIyLDIwSDZjLTAuNiwwLTEtMC40LTEtMXMwLjQtMSwxLTFoMTZjMC42LDAsMSwwLjQsMSwxUzIyLjYsMjAsMjIsMjB6IiBjbGFzcz0ic3QwIi8+DQoJPC9nPg0KPC9nPg0KPGcgaWQ9InNlYXJjaF8xXyI+DQoJPGc+DQoJCTxwYXRoIGNsYXNzPSJzdDEiIGQ9Ik0xMiwxMzNjLTUsMC05LTQtOS05czQtOSw5LTlzOSw0LDksOVMxNywxMzMsMTIsMTMzeiBNMTIsMTE3Yy0zLjksMC03LDMuMS03LDdzMy4xLDcsNyw3czctMy4xLDctNyAgICBTMTUuOSwxMTcsMTIsMTE3eiIvPg0KCTwvZz4NCgk8Zz4NCgkJPHBhdGggY2xhc3M9InN0MSIgZD0iTTI0LDEzN2MtMC4zLDAtMC41LTAuMS0wLjctMC4zbC02LTZjLTAuNC0wLjQtMC40LTEsMC0xLjRjMC40LTAuNCwxLTAuNCwxLjQsMGw2LDZjMC40LDAuNCwwLjQsMSwwLDEuNCAgICBDMjQuNSwxMzYuOSwyNC4zLDEzNywyNCwxMzd6Ii8+DQoJPC9nPg0KCTxnPg0KCQk8cGF0aCBjbGFzcz0ic3QxIiBkPSJNMTYsMTI1Yy0wLjYsMC0xLTAuNC0xLTFjMC0xLjctMS4zLTMtMy0zYy0wLjYsMC0xLTAuNC0xLTFzMC40LTEsMS0xYzIuOCwwLDUsMi4yLDUsNSAgICBDMTcsMTI0LjYsMTYuNiwxMjUsMTYsMTI1eiIvPg0KCTwvZz4NCjwvZz4NCjxnIGlkPSJzZWFyY2hfMl8iPg0KCTxnPg0KCQk8cGF0aCBjbGFzcz0ic3QwIiBkPSJNNDAsMTMzYy01LDAtOS00LTktOXM0LTksOS05czksNCw5LDlTNDUsMTMzLDQwLDEzM3ogTTQwLDExN2MtMy45LDAtNywzLjEtNyw3czMuMSw3LDcsN3M3LTMuMSw3LTcgICAgUzQzLjksMTE3LDQwLDExN3oiLz4NCgk8L2c+DQoJPGc+DQoJCTxwYXRoIGNsYXNzPSJzdDAiIGQ9Ik01MiwxMzdjLTAuMywwLTAuNS0wLjEtMC43LTAuM2wtNi02Yy0wLjQtMC40LTAuNC0xLDAtMS40YzAuNC0wLjQsMS0wLjQsMS40LDBsNiw2YzAuNCwwLjQsMC40LDEsMCwxLjQgICAgQzUyLjUsMTM2LjksNTIuMywxMzcsNTIsMTM3eiIvPg0KCTwvZz4NCgk8Zz4NCgkJPHBhdGggY2xhc3M9InN0MCIgZD0iTTQ0LDEyNWMtMC42LDAtMS0wLjQtMS0xYzAtMS43LTEuMy0zLTMtM2MtMC42LDAtMS0wLjQtMS0xczAuNC0xLDEtMWMyLjgsMCw1LDIuMiw1LDUgICAgQzQ1LDEyNC42LDQ0LjYsMTI1LDQ0LDEyNXoiLz4NCgk8L2c+DQo8L2c+DQo8ZyBpZD0ic2VhcmNoXzRfIj4NCgk8Zz4NCgkJPHBhdGggZD0iTTEyLDQ0MWMtNSwwLTktNC05LTlzNC05LDktOXM5LDQsOSw5UzE3LDQ0MSwxMiw0NDF6IE0xMiw0MjVjLTMuOSwwLTcsMy4xLTcsN3MzLjEsNyw3LDdzNy0zLjEsNy03ICAgIFMxNS45LDQyNSwxMiw0MjV6IiBjbGFzcz0ic3QxIi8+DQoJPC9nPg0KCTxnPg0KCQk8cGF0aCBkPSJNMjQsNDQ1Yy0wLjMsMC0wLjUtMC4xLTAuNy0wLjNsLTYtNmMtMC40LTAuNC0wLjQtMSwwLTEuNGMwLjQtMC40LDEtMC40LDEuNCwwbDYsNmMwLjQsMC40LDAuNCwxLDAsMS40ICAgIEMyNC41LDQ0NC45LDI0LjMsNDQ1LDI0LDQ0NXoiIGNsYXNzPSJzdDEiLz4NCgk8L2c+DQoJPGc+DQoJCTxwYXRoIGQ9Ik0xNiw0MzNjLTAuNiwwLTEtMC40LTEtMWMwLTEuNy0xLjMtMy0zLTNjLTAuNiwwLTEtMC40LTEtMXMwLjQtMSwxLTFjMi44LDAsNSwyLjIsNSw1ICAgIEMxNyw0MzIuNiwxNi42LDQzMywxNiw0MzN6IiBjbGFzcz0ic3QxIi8+DQoJPC9nPg0KPC9nPg0KPGcgaWQ9InNlYXJjaF8zXyI+DQoJPGc+DQoJCTxwYXRoIGNsYXNzPSJzdDAiIGQ9Ik00MCw0NDFjLTUsMC05LTQtOS05czQtOSw5LTlzOSw0LDksOVM0NSw0NDEsNDAsNDQxeiBNNDAsNDI1Yy0zLjksMC03LDMuMS03LDdzMy4xLDcsNyw3czctMy4xLDctNyAgICBTNDMuOSw0MjUsNDAsNDI1eiIvPg0KCTwvZz4NCgk8Zz4NCgkJPHBhdGggY2xhc3M9InN0MCIgZD0iTTUyLDQ0NWMtMC4zLDAtMC41LTAuMS0wLjctMC4zbC02LTZjLTAuNC0wLjQtMC40LTEsMC0xLjRjMC40LTAuNCwxLTAuNCwxLjQsMGw2LDZjMC40LDAuNCwwLjQsMSwwLDEuNCAgICBDNTIuNSw0NDQuOSw1Mi4zLDQ0NSw1Miw0NDV6Ii8+DQoJPC9nPg0KCTxnPg0KCQk8cGF0aCBjbGFzcz0ic3QwIiBkPSJNNDQsNDMzYy0wLjYsMC0xLTAuNC0xLTFjMC0xLjctMS4zLTMtMy0zYy0wLjYsMC0xLTAuNC0xLTFzMC40LTEsMS0xYzIuOCwwLDUsMi4yLDUsNSAgICBDNDUsNDMyLjYsNDQuNiw0MzMsNDQsNDMzeiIvPg0KCTwvZz4NCjwvZz4NCjwvc3ZnPg0K);
}

.icon-nav-forum {
    background-position: 0 -364px;
}
button:hover .icon-nav-forum, a:hover .icon-nav-forum {
    background-position: -28px -364px;
}

#nav-forum:hover, #nav-blog:hover, #nav-shop:hover {
    color: #00a2ff;
}
.light-theme #nav-forum:hover {
    color: #393b3d;
}
.dark-theme #nav-forum:hover {
    color: #fff;
}
        `
        }
        if (Settings.Global.JSClasses) {
            document.body.classList.add("ForumsEnabled")
        }
        const NavFixStyle = document.createElement("style")
        NavFixStyle.innerHTML = StyleFix()
        document.head.appendChild(NavFixStyle)
        SideBarItem("https://forum.roblox.com/forum/", "nav-forum", "icon-nav-forum", "Forum", navgroup.parentElement, true)
    }
    if (Settings.Global.RestoreUpgradeNow) {
        if (Settings.Global.JSClasses) {
            document.body.classList.add("UNRenamedEnabled")
        }
        document.getElementById("upgrade-now-button").innerHTML = document.getElementById("upgrade-now-button").innerHTML.replace(/Get Premium/g, "Upgrade Now");
    }
    if (Settings.Global.RestoreEvents) {
        if (Settings.Global.JSClasses) {
            document.body.classList.add("EventsEnabled")
        }
        const EventsLbl = document.createElement("li")
        EventsLbl.classList.add("font-bold", "text-nav")
        EventsLbl.textContent = "Events"
        hdrSec.appendChild(EventsLbl)
        if (Settings.Global.CustomEvents) {
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

if (Settings.Global.RestoreForums) {
    if (window.location.href == "https://forum.roblox.com/forum/" || window.location.href == url+"/forum/") {
        window.location.href = "https://bit.ly/45oTkkg";
    }
}

if (window.location.href == url+"/feeds" || window.location.href == url+"/feeds/") {
    waitForElm(".content").then(async (hdrSec) => {
        if (Settings.Global.RestoreMyFeed) {
            waitForElm(".request-error-page-content").then(async (hdrSec) => {
                document.querySelector(".content").removeChild(hdrSec)
            })
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
                if (Settings.Pages.MyFeeds.ModernFormat) {
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
                    var itemplace, itemcard, itemplaceimage, itemplacename, getItemParent
                    var InfoLoaded, ThumbnailLoaded = false
                    var GamesInfo, GamesThumbnail = null
                    function placeItemTemplate(name, url, thumbnail, Id, parentElement) {
                        getItemParent = parentElement
                        itemplace = document.createElement("li")
                        itemplace.classList.add("item-place", "item"+Id)
                        parentElement.appendChild(itemplace)
                        if (Settings.Pages.MyFeeds.entirecardislink) {
                            itemcard = document.createElement("a")
                            itemcard.setAttribute("href", url)
                            itemplace.appendChild(itemcard)
                        }
                        itemplaceimage = document.createElement("img")
                        itemplaceimage.setAttribute("src", thumbnail)
                        if (Settings.Pages.MyFeeds.entirecardislink) {
                            itemcard.appendChild(itemplaceimage)
                            itemplacename = document.createElement("div")
                        } else {
                            itemplace.appendChild(itemplaceimage)
                            itemplacename = document.createElement("a")
                        }
                        itemplacename.classList.add("font-bold")
                        if (!Settings.Pages.MyFeeds.entirecardislink) {
                            itemplacename.setAttribute("href", url)
                        }
                        itemplacename.textContent = name
                        if (Settings.Pages.MyFeeds.entirecardislink) {
                            itemcard.appendChild(itemplacename)
                        } else {
                            itemplace.appendChild(itemplacename)
                        }
                    }
                    function GetGamesInfo(Id, parentElement) {
                        GM_xmlhttpRequest({
                            method: "GET",
                            url: "https://www.roblox.com/item-thumbnails?params=%5B%7BassetId:"+Id+"%7D%5D",
                            onload: function(response) {
                                var InfoLoaded = JSON.parse(response.responseText)[0]
                                placeItemTemplate(InfoLoaded.name, InfoLoaded.url, InfoLoaded.thumbnailUrl, Id, parentElement)
                            },
                        });
                    }
                    var FeaturedGamesContainer = document.createElement("div")
                    FeaturedGamesContainer.setAttribute("id", "FeaturedGamesContainer")
                    FeaturedGamesContainer.classList.add("list-gallery")
                    listBody.appendChild(FeaturedGamesContainer)
                    GetGamesInfo(69184822, FeaturedGamesContainer)
                    GetGamesInfo(3527629287, FeaturedGamesContainer)
                    GetGamesInfo(13822889, FeaturedGamesContainer)
                    GetGamesInfo(139613645, FeaturedGamesContainer)
                    waitForElm(".item69184822").then(async (hdrSec) => {
                        getItemParent.appendChild(hdrSec)
                        hdrSec.classList.remove("item69184822")
                    })
                    waitForElm(".item3527629287").then(async (hdrSec) => {
                        getItemParent.appendChild(hdrSec)
                        hdrSec.classList.remove("item3527629287")
                    })
                    waitForElm(".item13822889").then(async (hdrSec) => {
                        getItemParent.appendChild(hdrSec)
                        hdrSec.classList.remove("item13822889")
                    })
                    waitForElm(".item139613645").then(async (hdrSec) => {
                        getItemParent.appendChild(hdrSec)
                        hdrSec.classList.remove("item139613645")
                    })
                }
                if (secClassName == "feed-creation" && iconName == "icon-charactercustomizer") {
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
    height: 150px;
}

${ (!Settings.Pages.MyFeeds.ModernFormat) && `
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
            if (Settings.Pages.MyFeeds.enablePosting) {
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
            listItemTemplate("gameFeed", "feed-game", "icon-games", url+((Settings.Pages.MyFeeds.GamestoExperience) && "/discover" || "/games"), (Settings.Pages.MyFeeds.GamestoExperience) && "Play Experiences" || "Play Games", (Settings.Pages.MyFeeds.GamestoExperience) && "Nearly all Roblox experiences are built by players like you. Here are some of our favorites:" || "Nearly all Roblox games are built by players like you. Here are some of our favorites:", feedvlist, false)
            listItemTemplate("None", "feed-creation", "icon-charactercustomizer", url+"/catalog/browse.aspx?CatalogContext=1&Subcategory=1&CreatorID=1&CurrencyType=0&pxMin=0&pxMax=0&SortType=4&SortAggregation=3&SortCurrency=0&IncludeNotForSale=false&LegendExpanded=true&Category=1", "Customize Your Avatar", `Visit the <a href="${ url }/my/avatar"> Avatar ${ Settings.Pages.MyFeeds.ModernFormat && "Editor" || "page" } </a> to customize your ${ Settings.Pages.MyFeeds.ModernFormat && "character" || "avatar" }. ${ Settings.Pages.MyFeeds.ModernFormat && "Shop for clothing in the" || "Get new clothing in the" } <a href="${ url }/catalog/browse.aspx?CatalogContext=1&amp;Subcategory=1&amp;CreatorID=1&amp;CurrencyType=0&amp;pxMin=0&amp;pxMax=0&amp;SortType=4&amp;SortAggregation=3&amp;SortCurrency=0&amp;IncludeNotForSale=false&amp;LegendExpanded=true&amp;Category=1">${ (Settings.Pages.MyFeeds.ModernFormat) && (Settings.Pages.MyFeeds.CatalogtoAvatarShop && "Avatar Shop" || "Catalog") || Settings.Pages.MyFeeds.CatalogtoAvatarShop && "avatar shop" || "catalog" }</a>`, feedvlist, true)
            listItemTemplate("None", "feed-creation", "icon-develop", url+"/develop", "Build Something", `Builders will enjoy playing our multiplayer building ${ Settings.Pages.MyFeeds.GamestoExperience && "experience" || "game" }. Professional builders will want to check out Roblox Studio, our ${ (!Settings.Pages.MyFeeds.ModernFormat && (Settings.Pages.MyFeeds.GamestoExperience && "experience" || "game") || "") } development environment on your <a href="${ url }/develop">Develop page</a>.`, feedvlist, true)
            listItemTemplate("None", "feed-social", "icon-friends", url+"/search/users", "Make Friends", `Meet other players in-${ Settings.Pages.MyFeeds.GamestoExperience && "experience" || "game" } and send them a friend request. If you miss your opportunity you can always send a request later by <a href="${ url }/search/users">searching</a> for their user profile.`, feedvlist, true)
            if (Settings.Pages.MyFeeds.enableforumlistItem) {
                listItemTemplate("None", "feed-social", "icon-forum", url+"/forum", "Roblox forums for help", `No matter what you're looking for, if it's Roblox related, there are people talking about it <a href="${ url }/forum">here</a>.`, feedvlist, true)
            }
        }
    })
}

if (Settings.Pages.RestoreHomePage && window.location.href == url+"/home") {
    var Style = document.createElement("style")
    Style.innerHTML = StyleSheet()
    document.head.appendChild(Style)
    var avatarLoadingHeadshot, avatarLoadingThumb, headerLoadingcontent, homeLoadingheader, headerLoadingLbl
    var homecontainer, hcfirstsection, homeheaderBase, homeheaderBaseSub, homeheaderSubBase, avatarHeadshot, thumbnail2dcontainer, avatarThumb, headeruserinfo, headercontent, homeheader, headerLbl
    var PresenceDiv, PresenceLink, PresenceSpan, PresenceStatus
    var initialSetup = setInterval(function() {
        try {
            homecontainer = document.getElementById("HomeContainer")
            hcfirstsection = homecontainer.querySelector(".section:first-child")
            /*/ Swap "home" section element to our home template /*/
            if (homecontainer && hcfirstsection) {
                if (Settings.Global.JSClasses) {
                    switch(Settings.Pages.home.Format) {
                        case "2017":
                            document.body.classList.add("HP2017", "HPNoORHActive")
                            break
                        case "2020":
                            document.body.classList.add("HP2020", "HPNoORHActive")
                            break
                        case "2021":
                            if (Settings.Pages.ORHCompatible) {
                                document.body.classList.add("HP2021")
                            } else {
                                document.body.classList.add("HP2021", "HPNoORHActive")
                            }
                            break
                        case "2022":
                            document.body.classList.add("HP2022", "HPNoORHActive")
                            break
                    }
                }
                switch(Settings.Pages.home.Format) {
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
                        if (Settings.Pages.DeveloperOptions.fix2020homeFormat && Settings.Pages.home.Format == "2020") {
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
        if (document.getElementById("mostPlayedContainer") && (Settings.Pages.home.Format == "2017" || Settings.Pages.home.Format == "2020")) {
            homeheaderBase.classList.add("ropro-enabled")
            if (homeLoadingheader.classList.contains("col-xs-3", "shimmer-lines")) {
                homeLoadingheader.classList.remove("col-xs-3", "shimmer-lines")
                homeLoadingheader.classList.add("col-xs-6", "shimmer-lines")
            }
        }
        if (!Settings.Pages.DeveloperOptions.forceinfLoading.Enabled) {
            if (!userData.Status.InfoDataLoaded && !Settings.Pages.DeveloperOptions.forceinfLoading.info) {
                if (Settings.Pages.DeveloperOptions.demoMode) {
                    if (Settings.Pages.DeveloperOptions.demoPreference == 1) {
                        userData.Response = {id: 1, name: "Roblox", displayName: "Roblox"}
                    } else if (Settings.Pages.DeveloperOptions.demoPreference == 2) {
                        userData.Response = {id: 28969907, name: "OnlyTwentyCharacters", displayName: "OnlyTwentyCharacters"}
                    }
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
            if (!userData.Status.MembershipDataLoaded && !Settings.Pages.DeveloperOptions.forceinfLoading.membership) {
                if (Settings.Pages.DeveloperOptions.forceMembership) {
                    userData.Membership = true
                    userData.Status.MembershipDataLoaded = true
                } else {
                    GM_xmlhttpRequest({
                        method: "GET",
                        url: "https://premiumfeatures.roblox.com/v1/users/"+userData.id+"/validate-membership",
                        onload: function(response) {
                            if (userData.Membership.errors) {
                                /*/ Return false if the API returns an error /*/
                                userData.Membership = false
                            } else {
                                userData.Membership = JSON.parse(response.responseText)
                            }
                            userData.Status.MembershipDataLoaded = true
                        },
                        onerror: function(error) {
                            userData.Status.MembershipDataErrored = true
                        }
                    });
                }
            }
            if (!userData.Status.AvatarDataLoaded && !Settings.Pages.DeveloperOptions.forceinfLoading.thumbnail) {
                GM_xmlhttpRequest({
                    method: "POST",
                    url: "https://thumbnails.roblox.com/v1/batch",
                    headers: {
                        "accept": "application/json",
                        "Content-Type": "text/json"
                    },
                    data: JSON.stringify(
                        [{
                            targetId: userData.id,
                            type: "AvatarHeadshot",
                            size: "150x150",
                            format: "png",
                        }]
                    ),
                    onload: function(response) {
                        if (!JSON.parse(response.responseText).data[0].errorCode > 0) {
                            try {
                                userData.avatar.data.Response = JSON.parse(response.responseText).data[0]
                                userData.avatar.data.imageUrl = userData.avatar.data.Response.imageUrl
                                userData.Status.AvatarDataLoaded = true
                            } catch {
                            }
                        }
                    },
                    onerror: function(error) {
                        userData.Status.AvatarDataErrored = true
                    }
                })
            }
            if (Settings.Pages.home.BulkLoading && userData.Status.InfoDataLoaded && userData.Status.MembershipDataLoaded && userData.Status.AvatarDataLoaded) {
                userData.Status.FullyLoaded = true
                if (!userData.Status.FullyLoadedPaused && Settings.Pages.home.BulkLoading) {
                    userData.Status.FullyLoadedPaused = true
                    switch(Settings.Pages.home.Format) {
                        case "2017":
                        case "2020":
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
                            if (userData.Membership || Settings.Pages.home.Format == "2020") {
                                headercontent.classList.add("home-header-content")
                            } else {
                                headercontent.classList.add("home-header-content", "non-bc")
                            }
                            if (Settings.Pages.DeveloperOptions.fix2020homeFormat && Settings.Pages.home.Format == "2020") {
                                headercontent.classList.add("hF2020PositionFix")
                            }
                            homeheaderBase.appendChild(headercontent)
                            homeheader = document.createElement("h1")
                            headercontent.appendChild(homeheader)
                            if (userData.Membership && Settings.Pages.home.Format == "2017") {
                                MembershipTemplate(headercontent)
                            }
                            headerLbl = document.createElement("a")
                            headerLbl.setAttribute("href", url+"/users/"+userData.id+"/profile")
                            headerLbl.textContent = " " + homeGreeting() + ((Settings.Pages.home.DisplayNames) && userData.displayName || userData.name) + (homeGreeting() && "!") + " "
                            homeheader.appendChild(headerLbl)
                            if (userData.Membership && Settings.Pages.home.Format == "2020") {
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
                            if (userData.Membership && !Settings.Pages.home.ORHCompatible) {
                                MembershipTemplate(homeheader)
                            }
                            headerLbl = document.createElement("a")
                            headerLbl.setAttribute("href", url+"/users/"+userData.id+"/profile")
                            headerLbl.textContent = " " + homeGreeting() + ((Settings.Pages.home.DisplayNames) && userData.displayName || userData.name) + (homeGreeting() && "!") + " "
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
                            headerLbl.textContent = " " + homeGreeting() + ((Settings.Pages.home.DisplayNames) && userData.displayName || userData.name) + (homeGreeting() && "!") + " "
                            homeheader.appendChild(headerLbl)
                            break
                    }
                }
            } else if (!Settings.Pages.home.BulkLoading) {
                if (userData.Status.AvatarDataLoaded && !userData.Status.AvatarDataPaused) {
                    userData.Status.AvatarDataPaused = true
                    switch(Settings.Pages.home.Format) {
                        case "2017":
                        case "2020":
                            homeheaderBase.removeChild(avatarLoadingHeadshot)
                            avatarHeadshot = document.createElement("a")
                            avatarHeadshot.setAttribute("href", url+"/users/"+userData.id+"/profile")
                            avatarHeadshot.classList.add("avatar", "avatar-headshot-lg")
                            homeheaderBase.appendChild(avatarHeadshot)
                            if (userData.Status.InfoDataPaused) {
                                homeheaderBase.appendChild(headercontent)
                            } else {
                                homeheaderBase.appendChild(headerLoadingcontent)
                            }
                            avatarThumb = document.createElement("img")
                            avatarThumb.setAttribute("alt", "avatar")
                            avatarThumb.setAttribute("src", userData.avatar.data.imageUrl)
                            avatarThumb.setAttribute("id", "home-avatar-thumb")
                            avatarThumb.classList.add("avatar-card-image")
                            avatarHeadshot.appendChild(avatarThumb)
                            break
                        case "2021":
                            homeheaderBaseSub.removeChild(avatarLoadingHeadshot)
                            avatarHeadshot = document.createElement("a")
                            avatarHeadshot.setAttribute("href", url+"/users/"+userData.id+"/profile")
                            avatarHeadshot.classList.add("thumbnail-2d-container", "avatar", "avatar-headshot-lg")
                            homeheaderBaseSub.appendChild(avatarHeadshot)
                            if (userData.Status.InfoDataPaused) {
                                homeheaderBaseSub.appendChild(headercontent)
                            } else {
                                homeheaderBaseSub.classList.add("home-header-shimmer")
                                homeheaderBaseSub.appendChild(headerLoadingcontent)
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
                            homeheaderBaseSub.removeChild(avatarLoadingHeadshot)
                            avatarHeadshot = document.createElement("a")
                            avatarHeadshot.setAttribute("href", url+"/users/"+userData.id+"/profile")
                            avatarHeadshot.classList.add("user-avatar-container", "avatar", "avatar-headshot-lg")
                            homeheaderBaseSub.appendChild(avatarHeadshot)
                            if (userData.Status.InfoDataPaused) {
                                homeheaderBaseSub.appendChild(headeruserinfo)
                            } else {
                                homeheaderBaseSub.classList.add("home-header-shimmer")
                                homeheaderBaseSub.appendChild(headerLoadingcontent)
                            }
                            thumbnail2dcontainer = document.createElement("span")
                            thumbnail2dcontainer.classList.add("thumbnail-2d-container", "avatar-card-image")
                            avatarHeadshot.appendChild(thumbnail2dcontainer)
                            avatarThumb = document.createElement("img")
                            avatarThumb.setAttribute("src", userData.avatar.data.imageUrl)
                            avatarThumb.classList.add("avatar-card-image")
                            thumbnail2dcontainer.appendChild(avatarThumb)
                            break
                    }
                }
                if (userData.Status.InfoDataLoaded && userData.Status.MembershipDataLoaded && !userData.Status.InfoDataPaused && !userData.Status.MembershipDataPaused) {
                    userData.Status.InfoDataPaused = true
                    userData.Status.MembershipDataPaused = true
                    switch(Settings.Pages.home.Format) {
                        case "2017":
                        case "2020":
                            homeheaderBase.removeChild(headerLoadingcontent)
                            headercontent = document.createElement("div")
                            if (userData.Membership || Settings.Pages.home.Format == "2020") {
                                headercontent.classList.add("home-header-content")
                            } else {
                                headercontent.classList.add("home-header-content", "non-bc")
                            }
                            if (Settings.Pages.DeveloperOptions.fix2020homeFormat && Settings.Pages.home.Format == "2020") {
                                headercontent.classList.add("hF2020PositionFix")
                            }
                            homeheaderBase.appendChild(headercontent)
                            homeheader = document.createElement("h1")
                            headercontent.appendChild(homeheader)
                            if (userData.Membership && Settings.Pages.home.Format == "2017") {
                                MembershipTemplate(headercontent)
                            }
                            headerLbl = document.createElement("a")
                            headerLbl.setAttribute("href", url+"/users/"+userData.id+"/profile")
                            headerLbl.textContent = " " + homeGreeting() + ((Settings.Pages.home.DisplayNames) && userData.displayName || userData.name) + (homeGreeting() && "!") + " "
                            homeheader.appendChild(headerLbl)
                            if (userData.Membership && Settings.Pages.home.Format == "2020") {
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
                            if (userData.Membership && !Settings.Pages.home.ORHCompatible) {
                                MembershipTemplate(homeheader)
                            }
                            headerLbl = document.createElement("a")
                            headerLbl.setAttribute("href", url+"/users/"+userData.id+"/profile")
                            headerLbl.textContent = " " + homeGreeting() + ((Settings.Pages.home.DisplayNames) && userData.displayName || userData.name) + (homeGreeting() && "!") + " "
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
                            headerLbl.textContent = " " + homeGreeting() + ((Settings.Pages.home.DisplayNames) && userData.displayName || userData.name) + (homeGreeting() && "!") + " "
                            homeheader.appendChild(headerLbl)
                            break
                    }
                }
                if (headercontent && avatarHeadshot) {
                    switch(Settings.Pages.home.Format) {
                        case "2021":
                        case "2022":
                            homeheaderBaseSub.removeAttribute("id")
                            homeheaderBaseSub.classList.remove("home-header-shimmer")
                            homeheaderBaseSub.classList.add("home-header")
                    }
                } else if (headercontent && !avatarHeadshot || !headercontent && avatarHeadshot) {
                    switch(Settings.Pages.home.Format) {
                        case "2021":
                        case "2022":
                            homeheaderBaseSub.classList.add("home-header")
                    }
                }
            }
        }
        if (Settings.Pages.home.avatarPresences && userData.Status.InfoDataLoaded) {
            function userPresenceTemplate(parentElement) {
                if (PresenceDiv) {
                    PresenceSpan.classList.remove(PresenceStatus)
                    PresenceStatus = userData.userPresences.userPresenceType === 1 && "icon-online" || userData.userPresences.userPresenceType === 2 && "icon-game" || userData.userPresences.userPresenceType === 3 && "icon-studio" || userData.userPresences.userPresenceType === 4 && "icon-invisible-mode"
                    PresenceSpan.classList.add(PresenceStatus)
                    PresenceSpan.setAttribute("title", userData.userPresences.lastLocation)
                } else {
                    PresenceDiv = document.createElement("div")
                    PresenceDiv.setAttribute("ng-non-bindable", "")
                    parentElement.appendChild(PresenceDiv)
                    PresenceSpan = document.createElement("span")
                    PresenceDiv.appendChild(PresenceSpan)
                    PresenceStatus = userData.userPresences.userPresenceType === 1 && "icon-online" || userData.userPresences.userPresenceType === 2 && "icon-game" || userData.userPresences.userPresenceType === 3 && "icon-studio" || userData.userPresences.userPresenceType === 4 && "icon-invisible-mode"
                    PresenceSpan.classList.add("avatar-status", PresenceStatus)
                    PresenceSpan.setAttribute("title", userData.userPresences.lastLocation)
                }
            }
            GM_xmlhttpRequest({
                method: "POST",
                url: "https://Presence.roblox.com/v1/Presence/users",
                headers: {
                    "accept": "application/json",
                    "Content-Type": "application/json"
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
    if (!Settings.Pages.DeveloperOptions.disablebrokenicon) {
        setTimeout(function() {
            if (!userData.Status.AvatarDataLoaded) {
                avatarLoadingHeadshot.classList.remove("shimmer")
                var avatariconbroken = document.createElement("thumbnail-2d")
                avatariconbroken.classList.add("avatar-headshot-lg", "icon-broken")
                avatarLoadingHeadshot.appendChild(avatariconbroken)
            }
        }, 8000)
    }
}