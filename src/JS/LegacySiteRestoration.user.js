// ==UserScript==
// @name         Legacy Site Restoration Experimental
// @namespace    https://github.com/tersiswilvin
// @version      1.3
// @description  Restores the Roblox Site back to a familiar state.
// @author       TersisWilvin
// @license      CC-BY-SA-4.0
// @match        *.roblox.com*
// @match        *.roblox.com/*
// @icon         https://images.rbxcdn.com/23421382939a9f4ae8bbe60dbe2a3e7e.ico.gzip
// @updateURL    https://github.com/tersiswilvin/Roblox-Legacy-Old-Theme/raw/refs/heads/Experimental/src/JS/LegacySiteRestoration.user.js
// @downloadURL  https://github.com/tersiswilvin/Roblox-Legacy-Old-Theme/raw/refs/heads/Experimental/src/JS/LegacySiteRestoration.user.js
// @grant        GM_xmlhttpRequest
// @run-at       document-start
// @connect      premiumfeatures.roblox.com
// @connect      thumbnails.roblox.com
// @connect      users.roblox.com
// ==/UserScript==

alert("LSR Version 1.3 is in early development. LocalStorage may change during development builds, potentially causing issues. Use at your own risk!");

var location = window.location;
location.href_origin = location.protocol + "//" + location.hostname + location.pathname;
location.pathname_origin = location.pathname.replace(/^\/|\/$/g, '');

// Initial Setup //
const Default_Settings = {
    AddJSClasses: true,
    CustomEvents: false,
    DEV: {
        DemoMode: false,
        DisableBrokeIcon: false,
        ForceMembership: false,
        Fix2020HomeFormat: false,
        SupportHigherDPI: true,
        RoProFix: true
    },
    Events: {
        Custom: {},
        Roblox: {}
    },
    Home: {
        DisplayNameSupport: false,
        PresencesSupport: false,
        Layout: 2017,
        GreetingEnabled: true,
        GreetingUsesComma: true,
        GreetingUsesExclamationMark: true,
        MembershipTier: "OBC",
        LegacyColumns: false
    },
    LegacyEditDescription: {
        Enabled: true,
        ModernLayout: false,
    },
    LSRStatus: {
        membershipDataLoaded: false,
        thumbnailDataLoaded: false,
        userDataLoaded: false,
    },
    MyFeeds: {
        AvatarShopBranding: false,
        ExperienceBranding: false,
        ModernLayout: true,
        PostData: "",
        PostingEnabled: true,
    },
    PresencesData: {},
    RestoreEvents: true,
    RestoreForums: false,
    RestoreHomePage: true,
    RestoreLegacyLogin: true,
    RestoreMyFeeds: true,
    RestoreUpgradeNow: true,
    userData: {
        id: 0,
        name: "OnlyTwentyCharacters",
        displayName: "OnlyTwentyCharacters",
        activeMembership: false,
        thumbnail: {
            errorCode: 0,
            errorMessage: "string",
            imageUrl: "string",
            requestId: "string",
            state: "string",
            targetId: 0,
            version: "string"
        }
    },
    Version: 1.3
}
const Default_Properties = {
    method: "POST",
    url: "https://www.example.com/",
    headers: {},
    data: {},
    redirect : null,
    cookie: null,
    binary: null,
    nocache: null,
    revalidate: null,
    timeout: 0,
    context: null,
    responseType: null,
    overrideMimeType: null,
    anonymous: null,
    user: null,
    password: null
}

var LSR = {
    httpRequest: async function(Properties, callback) {
        var MergeProperties = Object.assign({}, Default_Properties, Properties);
        GM_xmlhttpRequest({
            method: MergeProperties.method,
            url: MergeProperties.url,
            headers: MergeProperties.headers,
            data: MergeProperties.data,
            redirect : MergeProperties.redirect,
            cookie: MergeProperties.cookie,
            binary: MergeProperties.binary,
            nocache: MergeProperties.nocache,
            revalidate: MergeProperties.revalidate,
            timeout: MergeProperties.timeout,
            context: MergeProperties.context,
            responseType: MergeProperties.responseType,
            overrideMimeType: MergeProperties.overrideMimeType,
            anonymous: MergeProperties.anonymous,
            user: MergeProperties.user,
            password: MergeProperties.password,
            onabort: function(abort) {
                callback(abort);
            },
            onerror: function(error) {
                callback(error);
            },
            ontimeout: function(timeout) {
                callback(timeout);
            },
            onload: function(load) {
                callback(load);
            }
        })
    },
    localStorage: {},
    updateLocalStorage: function() {
        localStorage.setItem("LSRSettings", JSON.stringify(LSR.localStorage));
        LSR.localStorage = JSON.parse(localStorage.getItem("LSRSettings"));
    },
    waitForQuerySelector: async function(selector) {
        while (document.querySelector(selector) == null) {
            await new Promise(r => requestAnimationFrame(r));
        };
        return document.querySelector(selector);
    },
    waitForQueryAllSelector: async function(selector) {
        while (document.querySelectorAll(selector) == null) {
            await new Promise(r => requestAnimationFrame(r));
        };
        return document.querySelectorAll(selector);
    }
};

if (!localStorage.getItem("LSRSettings")) {
    localStorage.setItem("LSRSettings", JSON.stringify(Default_Settings));
};
LSR.localStorage = JSON.parse(await localStorage.getItem("LSRSettings"));
if (Default_Settings.Version > LSR.localStorage.Version) {
    LSR.localStorage = Default_Settings;
    Object.assign(LSR.localStorage, localStorage.getItem("LSRSettings"));
    LSR.localStorage.Version = Default_Settings.Version;
    LSR.UpdateLocalStorage();
}

(function() {
    const AuthReqTimer = setInterval(function() {
        LSR.httpRequest({
            method: "GET",
            url: "https://users.roblox.com/v1/users/authenticated",
            headers: {
                "accept": "application/json",
                "Content-Type": "application/json"
            }
        }, function(request) {
            if (request.status == 200 && (JSON.parse(request.responseText).displayname != LSR.localStorage.userData.displayname || JSON.parse(request.responseText).id != LSR.localStorage.userData.id || JSON.parse(request.responseText).name != LSR.localStorage.userData.name)) {
                LSR.localStorage.userData = Object.assign(LSR.localStorage.userData, JSON.parse(request.responseText));
                LSR.localStorage.LSRStatus.userDataLoaded = true;
                LSR.updateLocalStorage();
                clearInterval(AuthReqTimer);
            }
        });
    }, 50)
    const ValidateMembershipReqTimer = setInterval(function() {
        LSR.httpRequest({
            method: "GET",
            url: "https://premiumfeatures.roblox.com/v1/users/"+LSR.localStorage.userData.id+"/validate-membership",
            headers: {
                "accept": "application/json"
            }
        }, function(request) {
            if (request.status == 200 && !JSON.parse(request.responseText).errors) {
                LSR.localStorage.LSRStatus.membershipDataLoaded = true;
                if (JSON.parse(request.responseText) != LSR.localStorage.userData.activeMembership) {
                    LSR.localStorage.userData.activeMembership = JSON.parse(request.responseText);
                    LSR.updateLocalStorage();
                    clearInterval(ValidateMembershipReqTimer);
                }
            }
        });
    }, 50)
    const ThumbnailReqTimer = setInterval(function() {
        LSR.httpRequest({
            method: "POST",
            url: "https://thumbnails.roblox.com/v1/batch",
            data: JSON.stringify([{
                "requestId": LSR.localStorage.userData.id+":AvatarHeadshot:150x150:png:regular",
                "targetId": LSR.localStorage.userData.id,
                "type": "AvatarHeadshot",
                "size": "150x150",
                "format": "png",
            }]),
            headers: {
                "Content-Type": "application/json"
            }
        }, function(request) {
            if (request.status == 200 && JSON.parse(request.responseText).data[0].errorCode == 0 && (JSON.parse(request.responseText).data[0].imageUrl != LSR.localStorage.userData.thumbnail.imageUrl || JSON.parse(request.responseText).data[0].targetId != LSR.localStorage.userData.thumbnail.targetId)) {
                LSR.localStorage.userData.thumbnail = Object.assign(LSR.localStorage.userData.thumbnail, JSON.parse(request.responseText).data[0]);
                LSR.localStorage.LSRStatus.thumbnailDataLoaded = true;
                LSR.updateLocalStorage();
                clearInterval(ThumbnailReqTimer);
            }
        });
    }, 50)
    LSR.waitForQuerySelector(".home-container").then(async (element) => {
        console.log(LSR.localStorage.userData);
        alert("Dumped userData in console.");
    })
})();