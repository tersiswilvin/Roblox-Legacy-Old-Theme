// ==UserScript==
// @name         Legacy Site Restoration
// @namespace    userstyles.world/user/tersiswilvin
// @version      1.1.0
// @description  Restores Legacy Site elements back on Roblox.
// @author       TersisWilvin
// @match        *.roblox.com/*
// @icon         https://images.rbxcdn.com/23421382939a9f4ae8bbe60dbe2a3e7e.ico.gzip
// @grant        GM_xmlhttpRequest
// ==/UserScript==

/*/== Variables ==/*/

const CustomEvents = {
    Event1: false,
    Event1Link: "",
    Event1Source: "",
    Event1Title: "",
    Event2: false,
    Event2Link: "",
    Event2Source: "",
    Event2Title: "",
    Event3: false,
    Event3Link: "",
    Event3Source: "",
    Event3Title: "",
}

var Data = {
    loaded: false,
    loadedstop: false,
    P1: false,
    P1Error: false,
    P2: false,
    P2Error: false,
    P3: false,
    P3Error: false,
}

var userData = {
    avatardataP1: '',
    avatardataP2: '',
    data: '',
    displayName: '',
    id: 0,
    imageUrl: '',
    name: '',
    hasMembership: '',
};

var Settings = {
    AddJSClasses: false, /*/ Adds classes for options for those working with themes or extentions. /*/
    debugMode: true,
    demoMode: false,
    homeGreeting: true,
    homeFormat: "2022", /*/ {"2018", "2020", "2022"} /*/
    MembershipType: "Premium", /*/ 'Default/Legacy Types' > {"BC", "TBC", "OBC"}, 'Extra/Modern Types' > {"Premium"} /*/
    ORHCompatible: false, // if true will use aubymori Old Roblox Header for legacy theme compatibility, requires homeFormat to be 2020.
    useCustomEvents: true,
    useDisplayNames: false,
    RestoreEvents: true,
    RestoreHomePage: true,
    RestoreMyFeed: true,
    RestoreUpgradeNowLbl: true,
}

/*/== Functions ==/*/

function GetHeaderStyle() {
    if (Settings.homeFormat === "2018") {
        return `
.home-container {
	float: left;
	max-width: 970px;
	width: 100%;
}

@media(max-width:1174px) {
	.home-container {
		float: none;
		margin: 0 auto;
	}
}

.home-header {
	margin-bottom: 12px;
}

.home-header:before, .home-header:after {
	content: " ";
	display: table;
}

.home-header:after {
	clear: both;
}

.home-header .avatar, .home-header .home-header-content {
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

@media(max-width:991px) {
	.home-header-content {
		padding: 0 15px;
	}
}

.home-header-content h1 {
	margin: 36px 0 12px;
}

.non-bc h1 {
	margin-top: 60px;
}

@media(max-width:991px) {
	.home-header .avatar {
		height: 120px;
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

	.non-bc h1 {
		margin-top: 36px;
	}
}

@media(max-width:767px) {
	.home-header .avatar {
		display: none;
	}

	.home-header-content {
		width: 100%;
	}

	.home-header-content:before, .home-header-content:after {
		content: " ";
		display: table;
	}

	.home-header-content:after {
		clear: both;
	}

	.home-header-content h1, .home-header-content span[class^="icon"] {
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

@media(max-width:543px) {
	.home-header-content {
		width: 100%;
	}

	.home-header-content h1, .home-header-content span[class^="icon"] {
		float: none;
		margin: 6px 0;
	}

	.home-header-content span[class^="icon"] {
		float: left;
	}
}
        `
    } else if (Settings.homeFormat === "2020") {
        if (Settings.ORHCompatible) {
            return `
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
    } else if (Settings.homeFormat === "2022") {
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

.home-userinfo-upsell-container {
    display: flex;
    flex-direction: column;
    justify-content: center
}
        `
    }
}

/*/== RunTime ==/*/

if (Settings.MembershipType === "Premium" && Settings.homeFormat === "2018") {
    Settings.homeFormat = "2020"
} else if (Settings.MembershipType !== "Premium" && Settings.homeFormat !== "2018") {
    Settings.homeFormat = "2018"
}

if (Settings.RestoreMyFeed) {
    if (Settings.AddJSClasses) {
        document.body.classList.add("MyFeedEnabled")
    }
    const NavGroup = document.getElementById('nav-group');
    const feedlistorder = document.createElement('li');
    NavGroup.parentElement.parentNode.insertBefore(feedlistorder, NavGroup.parentElement.nextSibling);
    const feedlink = document.createElement("a");
    feedlink.classList.add("dynamic-overflow-container", "text-nav");
    feedlistorder.appendChild(feedlink);
    feedlink.setAttribute("href", window.location.protocol+"//"+window.location.hostname+"/feeds/");
    feedlink.setAttribute("id", "nav-my-feed");
    feedlink.setAttribute("target", "_self");
    const feeddiv = document.createElement("div");
    feedlink.appendChild(feeddiv);
    const feedicon = document.createElement("span");
    feedicon.classList.add("icon-nav-my-feed");
    feeddiv.appendChild(feedicon);
    const feedfontheader = document.createElement("span")
    feedlink.appendChild(feedfontheader);
    feedfontheader.classList.add("font-header-2", "dynamic-ellipsis-item");
    feedfontheader.textContent = "My Feed";
}

if (Settings.RestoreEvents) {
    if (Settings.AddJSClasses) {
        document.body.classList.add("EventsEnabled")
    }
    function SponsorTemplate(parentChild, link, title, source, useAfter) {
        const rbxnavsponsor = document.createElement("li");
        if (useAfter) {
            parentChild.insertBefore(rbxnavsponsor, parentChild.nextSibling);
        } else {
            parentChild.appendChild(rbxnavsponsor);
        }
        rbxnavsponsor.classList.add("rbx-nav-sponsor");
        rbxnavsponsor.setAttribute("ng-non-bindable", true);
        const sponsormenuitem = document.createElement("a");
        rbxnavsponsor.appendChild(sponsormenuitem)
        sponsormenuitem.classList.add("text-nav", "menu-item");
        sponsormenuitem.setAttribute("href", link);
        sponsormenuitem.setAttribute("title", title);
        const sponsorimage = document.createElement("img");
        sponsormenuitem.appendChild(sponsorimage);
        sponsorimage.setAttribute("src", source)
    }
    const LeftColList = document.querySelector('.left-col-list');
    const EventsText = document.createElement("li");
    EventsText.classList.add("font-bold", "small", "text-nav");
    EventsText.textContent = " Events";
    LeftColList.appendChild(EventsText);
    if (Settings.useCustomEvents) {
        if (CustomEvents.Event1) {
            SponsorTemplate(LeftColList, CustomEvents.Event1Link, CustomEvents.Event1Title, CustomEvents.Event1Source, false)
        }
        if (CustomEvents.Event2) {
            SponsorTemplate(LeftColList, CustomEvents.Event2Link, CustomEvents.Event2Title, CustomEvents.Event2Source, CustomEvents.Event1 && true || false)
        }
        if (CustomEvents.Event3) {
            SponsorTemplate(LeftColList, CustomEvents.Event3Link, CustomEvents.Event3Title, CustomEvents.Event3Source, CustomEvents.Event2 && true || false)
        }
    }
}

if (Settings.RestoreUpgradeNowLbl) {
    if (Settings.AddJSClasses) {
        document.body.classList.add("UNRenamedEnabled")
    }
    document.getElementById("upgrade-now-button").innerHTML = document.getElementById("upgrade-now-button").innerHTML.replace(/Get Premium/g, "Upgrade Now");
}

if (Settings.RestoreHomePage) {
    var Style = document.createElement("style");
    Style.innerHTML = GetHeaderStyle()
    document.getElementsByTagName("head")[0].appendChild(Style);
    const HomeContainer = document.getElementById('HomeContainer');
    const HomeContainerFS = HomeContainer.querySelector('.section:first-child');
    const homeheader = document.createElement('div');
    var homeheaderalt, headeravatarframe, headerloaderavatarthumb, headeravatarthumb, homeuserinfocontainer, homeheadercontent, homeheaderloadercontenth1, homeheadercontenth1, homeheaderloadercontentlink, homeheadercontentlink, usericoncontainer, iconcontainerlabel, iconcontainerextralabel;
    HomeContainer.insertBefore(homeheader, HomeContainerFS);
    HomeContainer.removeChild(HomeContainerFS);
    function GetMembership(prodparent) {
        usericoncontainer = document.createElement('div');
        usericoncontainer.classList.add("user-icon-container");
        if (Settings.homeFormat === "2018") {
            prodparent.appendChild(usericoncontainer);
        } else {
            prodparent.parentNode.insertBefore(usericoncontainer, prodparent)
        }
        switch(Settings.MembershipType) {
            case "BC":
                iconcontainerlabel = document.createElement('span');
                iconcontainerlabel.classList.add("icon-bc");
                usericoncontainer.appendChild(iconcontainerlabel);
                break;
            case "TBC":
                iconcontainerlabel = document.createElement('span');
                iconcontainerlabel.classList.add("icon-tbc");
                usericoncontainer.appendChild(iconcontainerlabel);
                break;
            case "OBC":
                iconcontainerlabel = document.createElement('span');
                iconcontainerlabel.classList.add("icon-obc");
                usericoncontainer.appendChild(iconcontainerlabel);
                break;
            case "Premium":
                iconcontainerlabel = document.createElement('span');
                iconcontainerlabel.classList.add("medium-icon", "icon-premium-medium");
                usericoncontainer.appendChild(iconcontainerlabel);
                iconcontainerextralabel = document.createElement('span');
                iconcontainerextralabel.classList.add("small-icon", "icon-premium-small");
                usericoncontainer.appendChild(iconcontainerextralabel);
                break;
            default:
                iconcontainerlabel = document.createElement('span');
                iconcontainerlabel.classList.add("icon-warning");
                usericoncontainer.appendChild(iconcontainerlabel);
        }
    }
    switch(Settings.homeFormat) {
        case "2018":
            if (Settings.AddJSClasses) {
                document.body.classList.add("HP2018")
            }
            homeheader.classList.add("col-xs-12", "home-header");
            headeravatarframe = document.createElement('a');
            homeheader.appendChild(headeravatarframe);
            headeravatarframe.classList.add("avatar", "avatar-headshot-lg");
            headerloaderavatarthumb = document.createElement('span');
            headeravatarframe.appendChild(headerloaderavatarthumb);
            headerloaderavatarthumb.setAttribute('id','home-avatar-thumb');
            headerloaderavatarthumb.classList.add("avatar-card-image", "shimmer");
            homeheadercontent = document.createElement('div');
            homeheadercontent.classList.add("home-header-content", "non-bc");
            homeheader.appendChild(homeheadercontent);
            homeheaderloadercontenth1 = document.createElement('h1');
            homeheaderloadercontenth1.classList.add("shimmer-lines", "col-xs-3");
            homeheadercontent.appendChild(homeheaderloadercontenth1);
            homeheaderloadercontentlink = document.createElement('a');
            homeheaderloadercontentlink.classList.add("placeholder", "shimmer", "shimmer-line");
            homeheaderloadercontenth1.appendChild(homeheaderloadercontentlink);
            break;
        case "2020":
            if (Settings.AddJSClasses) {
                document.body.classList.add("HP2020")
            }
            homeheader.classList.add("col-xs-12", "home-header-container");
            homeheaderalt = document.createElement('div');
            homeheader.appendChild(homeheaderalt);
            homeheaderalt.classList.add("home-header");
            headeravatarframe = document.createElement('a');
            homeheaderalt.appendChild(headeravatarframe);
            headeravatarframe.classList.add("user-avatar-container", "avatar", "avatar-headshot-lg");
            headerloaderavatarthumb = document.createElement('span');
            headeravatarframe.appendChild(headerloaderavatarthumb);
            headerloaderavatarthumb.classList.add("thumbnail-2d-container", "avatar-card-image", "shimmer");
            homeheadercontent = document.createElement('div');
            if (Settings.ORHCompatible) {
                homeheadercontent.classList.add("user-info-container", "col-xs-12");
            } else {
                homeheadercontent.classList.add("user-info-container", "col-xs-10");
            }
            homeheaderalt.appendChild(homeheadercontent);
            homeheaderloadercontenth1 = document.createElement('h1');
            homeheaderloadercontenth1.classList.add("user-name-container", "shimmer-lines", "col-xs-3");
            homeheadercontent.appendChild(homeheaderloadercontenth1);
            homeheaderloadercontentlink = document.createElement('a');
            homeheaderloadercontentlink.classList.add("placeholder", "shimmer", "shimmer-line");
            homeheaderloadercontenth1.appendChild(homeheaderloadercontentlink);
            break;
        case "2022":
            if (Settings.AddJSClasses) {
                document.body.classList.add("HP2022")
            }
            homeheader.setAttribute("id", "home-header")
            homeheader.classList.add("col-xs-12", "home-header-container");
            homeheaderalt = document.createElement('div');
            homeheader.appendChild(homeheaderalt);
            homeheaderalt.classList.add("home-header-shimmer");
            headeravatarframe = document.createElement('a');
            homeheaderalt.appendChild(headeravatarframe);
            headeravatarframe.classList.add("user-avatar-container", "avatar", "shimmer-home-avatar");
            headerloaderavatarthumb = document.createElement('span');
            headeravatarframe.appendChild(headerloaderavatarthumb);
            headerloaderavatarthumb.classList.add("thumbnail-2d-container", "shimmer", "avatar-card-image");
            homeuserinfocontainer = document.createElement('div');
            homeheaderalt.appendChild(homeuserinfocontainer);
            homeuserinfocontainer.classList.add("shimmer-home-user-info")
            homeheadercontent = document.createElement('div');
            homeheadercontent.classList.add("shimmer-lines");
            homeuserinfocontainer.appendChild(homeheadercontent);
            homeheaderloadercontenth1 = document.createElement('h1');
            homeheaderloadercontenth1.classList.add("placeholder", "shimmer-line");
            homeheadercontent.appendChild(homeheaderloadercontenth1);
    }
    (function() {
        setInterval(function() {
            if (!Data.P1) {
                if (Settings.demoMode) {
                    userData.data = {id: 1, name: "Roblox", displayName: "Roblox"};
                    userData.id = userData.data.id;
                    userData.name = userData.data.name;
                    userData.displayName = userData.data.displayName;
                    Data.P1 = true;
                } else {
                    GM_xmlhttpRequest({
                        method: "GET",
                        url: "https://users.roblox.com/v1/users/authenticated",
                        headers: {
                            "Content-Type": "application/json"
                        },
                        onload: function(response) {
                            userData.data = JSON.parse(response.responseText);
                            userData.id = userData.data.id;
                            userData.name = userData.data.name;
                            userData.displayName = userData.data.displayName;
                            Data.P1 = true;
                        },
                        onerror: function(error) {
                            Data.P1Error = true;
                            if (Settings.debugMode) {
                                console.error(error)
                            }
                        }
                    });
                }
            }
            if (!Data.P2) {
                GM_xmlhttpRequest({
                    method: "GET",
                    url: "https://premiumfeatures.roblox.com/v1/users/"+userData.id+"/validate-membership",
                    onload: function(response) {
                        if (Settings.demoMode) {
                            userData.hasMembership = true;
                        } else {
                            userData.hasMembership = JSON.parse(response.responseText);
                        }
                        Data.P2 = true;
                        if (Settings.debugMode) {
                            console.log(userData.hasMembership)
                        }
                    },
                    onerror: function(error) {
                        Data.P2Error = true
                        if (Settings.debugMode) {
                            console.error(error)
                        }
                    }
                });
            }
            if (!Data.P3) {
                GM_xmlhttpRequest({
                    method: "GET",
                    url: "https://thumbnails.roblox.com/v1/users/avatar-headshot?userIds="+userData.id+"&size=150x150&format=Png",
                    onload: function(response) {
                        userData.avatardataP1 = JSON.parse(response.responseText)
                        userData.avatardataP2 = userData.avatardataP1.data[0];
                        userData.imageUrl = userData.avatardataP2.imageUrl;
                        Data.P3 = true
                    },
                    onerror: function(error) {
                        Data.P3Error = true
                        if (Settings.debugMode) {
                            console.error(error)
                        }
                    }
                });
            }
            if (Data.P1 && Data.P2 && Data.P3) {
                Data.loaded = true
            } else {
                Data.loaded = false
            }
            if (Data.loaded && !Data.loadedstop) {
                Data.loadedstop = true
                if (Settings.debugMode) {
                    console.log("All neccessary data has loaded.\n\nAccount Name : "+userData.name+"\nDisplay Name : "+userData.displayName+"\nId : "+userData.id+"\nMembership : "+userData.hasMembership+"\nimageUrl : "+userData.imageUrl)
                }
                switch(Settings.homeFormat) {
                    case "2018":
                        homeheader.removeChild(headeravatarframe);
                        headeravatarframe = document.createElement('a');
                        homeheader.appendChild(headeravatarframe);
                        headeravatarframe.setAttribute('href', window.location.protocol+"//"+window.location.hostname+"/users/"+userData.id+"/profile");
                        headeravatarframe.classList.add("avatar", "avatar-headshot-lg");
                        homeheader.appendChild(homeheadercontent);
                        headeravatarthumb = document.createElement('img');
                        headeravatarframe.appendChild(headeravatarthumb);
                        headeravatarthumb.setAttribute('alt','avatar');
                        headeravatarthumb.setAttribute('src', userData.imageUrl);
                        headeravatarthumb.setAttribute('id','home-avatar-thumb');
                        headeravatarthumb.classList.add("avatar-card-image");
                        headeravatarframe.setAttribute('href', window.location.protocol+"//"+window.location.hostname+"/users/"+userData.id+"/profile");
                        //======//
                        homeheadercontent.removeChild(homeheaderloadercontenth1);
                        homeheadercontenth1 = document.createElement('h1');
                        homeheadercontent.appendChild(homeheadercontenth1);
                        homeheadercontentlink = document.createElement('a');
                        homeheadercontenth1.appendChild(homeheadercontentlink);
                        homeheadercontentlink.setAttribute('href', window.location.protocol+"//"+window.location.hostname+"/users/"+userData.id+"/profile");
                        homeheadercontentlink.textContent = (Settings.homeGreeting) && " Hello, " + ((Settings.useDisplayNames) && userData.displayName || userData.name) + "! " || " " + ((Settings.useDisplayNames) && userData.displayName || userData.name) + " ";
                        if (userData.hasMembership) {
                            homeheadercontent.classList.remove("non-bc");
                            GetMembership(homeheadercontent)
                        }
                        break;
                    case "2020":
                        homeheaderalt.removeChild(headeravatarframe);
                        headeravatarframe = document.createElement('a');
                        homeheaderalt.appendChild(headeravatarframe);
                        homeheaderalt.appendChild(homeheadercontent);
                        headeravatarframe.setAttribute('href', window.location.protocol+"//"+window.location.hostname+"/users/"+userData.id+"/profile");
                        headeravatarframe.classList.add("user-avatar-container", "avatar", "avatar-headshot-lg");
                        headerloaderavatarthumb = document.createElement('span');
                        headeravatarframe.appendChild(headerloaderavatarthumb);
                        headerloaderavatarthumb.classList.add("thumbnail-2d-container", "avatar-card-image");
                        if (Settings.ORHCompatible) {
                            homeheadercontent.classList.remove("col-xs-12");
                        } else {
                            homeheadercontent.classList.remove("col-xs-10");
                        }
                        headeravatarthumb = document.createElement('img');
                        headerloaderavatarthumb.appendChild(headeravatarthumb);
                        headeravatarthumb.setAttribute('src', userData.imageUrl);
                        headeravatarthumb.classList.add("avatar-card-image");
                        //======//
                        homeheaderloadercontenth1.classList.remove("shimmer-lines", "col-xs-3");
                        homeheaderloadercontenth1.removeChild(homeheaderloadercontentlink);
                        if (userData.hasMembership && !Settings.ORHCompatible) {
                            GetMembership(homeheaderloadercontenth1)
                        }
                        homeheadercontentlink = document.createElement('a');
                        homeheaderloadercontenth1.appendChild(homeheadercontentlink);
                        homeheadercontentlink.setAttribute('href', window.location.protocol+"//"+window.location.hostname+"/users/"+userData.id+"/profile");
                        homeheadercontentlink.textContent = (Settings.homeGreeting) && " Hello, " + ((Settings.useDisplayNames) && userData.displayName || userData.name) + "! " || " " + ((Settings.useDisplayNames) && userData.displayName || userData.name) + " ";
                        break;
                    case "2022":
                        homeheaderalt.classList.remove("home-header-shimmer");
                        homeheaderalt.classList.add("home-header");
                        homeheaderalt.removeChild(headeravatarframe);
                        headeravatarframe = document.createElement('a');
                        homeheaderalt.appendChild(headeravatarframe);
                        homeheaderalt.appendChild(homeheadercontent);
                        headeravatarframe.setAttribute('href', window.location.protocol+"//"+window.location.hostname+"/users/"+userData.id+"/profile");
                        headeravatarframe.classList.add("user-avatar-container", "avatar", "avatar-headshot-lg");
                        headerloaderavatarthumb = document.createElement('span');
                        headeravatarframe.appendChild(headerloaderavatarthumb);
                        headerloaderavatarthumb.classList.add("thumbnail-2d-container", "avatar-card-image");
                        headeravatarthumb = document.createElement('img');
                        headerloaderavatarthumb.appendChild(headeravatarthumb);
                        headeravatarthumb.setAttribute('src', userData.imageUrl);
                        headeravatarthumb.classList.add("avatar-card-image");
                        //======//
                        homeuserinfocontainer.classList.add("home-userinfo-upsell-container")
                        homeuserinfocontainer.classList.remove("shimmer-home-user-info")
                        homeheadercontent.classList.remove("shimmer-lines");
                        homeheadercontent.classList.add("user-info-container");
                        if (userData.hasMembership && !Settings.ORHCompatible) {
                            GetMembership(homeheaderloadercontenth1)
                        }
                        homeheaderloadercontenth1.classList.remove("placeholder", "shimmer-line");
                        homeheaderloadercontenth1.classList.add("user-name-container");
                        homeheadercontentlink = document.createElement('a');
                        homeheaderloadercontenth1.appendChild(homeheadercontentlink);
                        homeheadercontentlink.setAttribute('href', window.location.protocol+"//"+window.location.hostname+"/users/"+userData.id+"/profile");
                        homeheadercontentlink.textContent = (Settings.homeGreeting) && " Hello, " + ((Settings.useDisplayNames) && userData.displayName || userData.name) + "! " || " " + ((Settings.useDisplayNames) && userData.displayName || userData.name) + " ";
                        break;

                }
            } else if (!Data.loaded && !Data.loadedstop) {
                if (Settings.debugMode) {
                    console.log("Not all data has loaded.\n======\nP1 : "+Data.P1+"\nP2 : "+Data.P2+"\nP3 : "+Data.P3+"\n======\nP1Error : "+Data.P1Error+"\nP2Error : "+Data.P2Error+"\nP3Error : "+Data.P3Error)
                }
            }
        }, 125);
        setTimeout(function() {
            if (!Data.loaded) {
                if (headerloaderavatarthumb) {
                    headerloaderavatarthumb.classList.remove("shimmer");
                    headerloaderavatarthumb.classList.add("thumbnail-2d-container", "icon-broken");
                }
            }
        }, 8000);
    })();
}