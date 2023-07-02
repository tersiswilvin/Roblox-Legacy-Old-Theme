// ==UserScript==
// @name         Legacy Site Restoration
// @namespace    TersisWilvin
// @version      1.0.1
// @description  Restores the missing items back to the Roblox Site.
// @author       TersisWilvin
// @match        *.roblox.com/*
// @icon         https://images.rbxcdn.com/23421382939a9f4ae8bbe60dbe2a3e7e.ico.gzip
// @grant        GM_xmlhttpRequest
// @run-at       document-idle
// ==/UserScript==

// Cringe JS ahead //

document.body.classList.add("LSRJSActive")

var Settings = {
    emptyResponse: true,
    CustomEvents: false,
    homeGreeting: true,
    RenamePremiumBtn: true,
    RestoreEvents: true,
    RestoreHomepage: true,
    modernHTMLFormat: false,
    RestoreMyFeed: true,
    ORHThemeCompatible: false, // if true forces the JS to use aubymori's home header version for theme compatibility.
    isMembership: false,
    MembershipType: "obc", // bc, tbc, obc, premium
};

var userData, userID;

(function() {

    'use strict';

    GM_xmlhttpRequest({
        method: "GET",
        url: "https://users.roblox.com/v1/users/authenticated",
        headers: {
            "Content-Type": "application/json"
        },
        onload: function(response) {
            userData = JSON.parse(response.responseText);
            userID = userData.id;
        },
    });
    GM_xmlhttpRequest({
        method: "GET",
        url: "https://premiumfeatures.roblox.com/v1/users/"+userID+"/validate-membership",
        onload: function(response) {
            Settings.isMembership = JSON.parse(response.responseText);
        },
    });
})();
function premiumLabel() {
    switch(Settings.MembershipType){
        case "bc":
            return '<div class="user-icon-container"><span class="icon-bc"></span></div>';
            break;
        case "tbc":
            return '<div class="user-icon-container"><span class="icon-tbc"></span></div>';
            break;
        case "obc":
            return '<div class="user-icon-container"><span class="icon-obc"></span></div>';
            break;
        case "premium":
            return '<div class="user-icon-container"><span class="medium-icon icon-premium-medium"></span><span class="small-icon icon-premium-small"></span></div>';
            break;
        default:
            return '<div class="user-icon-container"><span class="icon-warning"></span></div>';
    }
}

function getBC() {
    if (Settings.isMembership) {
        if (Settings.emptyResponse) {
            return ''
        } else {
            return ' bc'
        }
    } else {
        return ' non-bc'
    }
}

function homeheader(link, avatar, name) {
    if (Settings.modernHTMLFormat) {
        if (Settings.ORHThemeCompatible) {
            return `
            <div id="home-header" class="col-xs-12 home-header-container">
                <div class="home-header">
                    <a href="${ link ?? "/users/1/profile" }" class="user-avatar-container avatar avatar-headshot-lg">
                        <span class="thumbnail-2d-container avatar-card-image">
                            <img src="${ avatar ?? "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAAAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==" }" alt="" class="avatar-card-image">
                         </span>
                     </a>
                     <div class="user-info-container">
                         <h1 class="user-name-container">
                             <a href="${ link ?? "/users/1/profile" }">${ name ?? "Roblox" }</a>
                         </h1>
                     </div>
                 </div>
            </div>
            `
        } else {
            return `
            <div id="home-header" class="col-xs-12 home-header-container">
                <div class="home-header">
                    <a href="${ link ?? "/users/1/profile" }" class="user-avatar-container avatar avatar-headshot-lg">
                        <span class="thumbnail-2d-container avatar-card-image">
                            <img src="${ avatar ?? "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAAAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==" }" alt="" class="avatar-card-image">
                        </span>
                    </a>
                    <div class="user-info-container">
                        <h1 class="user-name-container">
                            <a href="${ link ?? "/users/1/profile" }">${ name ?? "Roblox" }</a>
                        </h1>
                    </div>
                </div>
            </div>
            `
        }
    } else {
        return `
        <div class="col-xs-12 home-header">
            <a href="${ link ?? "/users/1/profile" }" class="avatar avatar-headshot-lg">
                <img alt="avatar" src="${ avatar ?? "" }" id="home-avatar-thumb" class="avatar-card-image">
            </a>
            <div class="home-header-content${getBC()}">
                <h1>
                    <a href="${ link ?? "" }"> ${ name ?? "" } </a>
                </h1>
                ${ (Settings.isMembership && premiumLabel()) || "" }
            </div>
        </div>
        `
    };
}
function myFeeds() {
    if (Settings.modernHTMLFormat) {
        return `
        <li>
            <a class="dynamic-overflow-container text-nav" href="${window.location.protocol + "//" + window.location.hostname}/my/groups" id="nav-group" target="_self">
                <div>
                    <span class="icon-nav-group"></span>
                </div>
                <span class="font-header-2 dynamic-ellipsis-item">Groups</span>
            </a>
        </li>
        <li>
            <a class="dynamic-overflow-container text-nav" href="${window.location.protocol + "//" + window.location.hostname}/feeds/" id="nav-my-feed" target="_self">
                <div>
                    <span class="icon-nav-my-feed"></span>
                </div>
                <span class="font-header-2 dynamic-ellipsis-item">My Feed</span>
            </a>
        </li>
        `;
    } else {
        return `
        <li>
            <a href="${window.location.protocol + "//" + window.location.hostname}/my/groups" id="nav-group" class="dynamic-overflow-container text-nav">
                <div>
                    <span class="icon-nav-group"></span>
                </div>
                <span class="font-header-2 dynamic-ellipsis-item">Groups</span>
            </a>
        </li>
        <li>
            <a href="${window.location.protocol + "//" + window.location.hostname}/feeds/" id="nav-my-feed" class="dynamic-overflow-container text-nav">
                <div>
                    <span class="icon-nav-my-feed"></span>
                </div>
                <span class="font-header-2 dynamic-ellipsis-item">My Feed</span>
            </a>
        </li>
        `;
    }
}

var Style = document.createElement("style");
function getHomeStyle() {
    if (Settings.modernHTMLFormat) {
        if (Settings.ORHThemeCompatible) {
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
            .home-container {
                float: left;
                max-width: 970px;
                width: 100%;
            }

            .content-no-ads .content {
                max-width: 970px;
            }

            @media(max-width: 1174px) {
                .home-container {
                    float:none;
                    margin: 0 auto;
                }
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

            .home-friends-list-container {
                height: 206px;
            }

            @media(max-width: 991px) {
                .home-friends-list-container {
                    height:196px;
                }
            }

            .home-friends-list-container .container-header h3 {
                min-width: 110px;
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

        .home-header-content {
            width: 75%;
            width: calc(100% - 180px - 36px);
            position: relative;
        }

        .home-header-content .icon-premium-medium {
            display: inline-block;
            margin-bottom: 5px;
        }

        .home-header-content .icon-premium-small {
            display: none;
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

            .home-header-content h1 {
                margin: 12px 0 6px;
            }

            .non-bc h1 {
                margin-top: 36px;
            }

            .home-header-content .icon-premium-medium {
                display: inline-block;
                margin-bottom: 5px;
            }

            .home-header-content .icon-premium-small {
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

            .home-header-content .icon-premium-medium {
                display: none;
            }

            .home-header-content .icon-premium-small {
                display: inline-block;
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
    }
}
Style.innerHTML = getHomeStyle();
document.getElementsByTagName("head")[0].appendChild(Style);

async function waitForElm(q) {
    while (document.querySelector(q) == null) {
        await new Promise(r => requestAnimationFrame(r));
    };
    return document.querySelector(q);
};

if (Settings.ORHThemeCompatible) {
    document.body.classList.add("ORHThemeCompatible")
}
if (Settings.RestoreEvents) {
    document.body.classList.add("RestoreEvents")
    const upgradenowBtn = document.querySelector('.rbx-upgrade-now');
    const eventsItem = document.createElement('li');
    eventsItem.textContent = 'Events';
    eventsItem.classList.add("font-bold", "small", "text-nav");
    upgradenowBtn.parentElement.appendChild(eventsItem);
    if (Settings.CustomEvents) {
        var eventLink = "";
        var eventImage = "";
        var eventName = "";
        const eventBase = document.createElement('li');
        upgradenowBtn.parentElement.appendChild(eventBase);
        eventBase.classList.add("rbx-nav-sponsor");
        eventBase.setAttribute("ng-non-bindable", "")
        const eventHyperLink = document.createElement('a');
        eventBase.appendChild(eventHyperLink);
        eventHyperLink.classList.add("text-nav", "menu-item");
        eventHyperLink.href = eventLink;
        eventHyperLink.setAttribute("title", eventName);
        const eventImg = document.createElement('img');
        eventHyperLink.appendChild(eventImg);
        eventImg.setAttribute("src", eventImage);
        eventImg.classList.add("mCS_img_loaded");
    }
}
if (Settings.RenamePremiumBtn) {
    document.body.classList.add("RenamePremiumBtn")
    document.getElementById('upgrade-now-button').innerHTML = document.getElementById('upgrade-now-button').innerHTML.replace(/Get Premium/g, "Upgrade Now");
}
if (Settings.RestoreMyFeed) {
    waitForElm(".rbx-left-col .rbx-scrollbar .left-col-list li #nav-group").then(async (hdrSec) => {
        hdrSec.parentElement.outerHTML = myFeeds()
    });
}
if (Settings.RestoreHomepage) {
    document.body.classList.add("RestoreHomepage")
    function timeout() {
        waitForElm("#HomeContainer .section:first-child").then(async (hdrSec) => {
            let sidebarUser = await waitForElm("#navigation.rbx-left-col > ul > li > a") ?? null;
            let link = sidebarUser.getAttribute("href") ?? null;
            let avatar = (await waitForElm("#navigation.rbx-left-col > ul > li > a img")).getAttribute("src") ?? null;
            let name = (await waitForElm("#navigation.rbx-left-col > ul > li > a .font-header-2")).innerText ?? null;
            if (Settings.homeGreeting) name = "Hello, " + name + "!";
            hdrSec.outerHTML = homeheader(link, avatar, name)
        });
    }

    setTimeout(timeout, 600)
}