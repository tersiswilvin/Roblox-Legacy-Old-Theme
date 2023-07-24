// ==UserScript==
// @name         Roblox Icon replacer
// @namespace    TersisWilvin
// @version      1.0
// @description  Replaces the favicon to the one added in 201701
// @author       TersisWilvin
// @match        https://www.roblox.com/*
// @match        https://blog.roblox.com/*
// @match        https://en.help.roblox.com/*
// @icon         https://images.rbxcdn.com/1387da00c070fd34110985aee87f3155.ico.gzip
// @grant        none
// ==/UserScript==

(function() {
    var link = document.querySelector("link[rel*='icon']") || document.createElement('link');
    link.type = 'image/x-icon';
    link.rel = 'shortcut icon';
    link.href = 'https://images.rbxcdn.com/1387da00c070fd34110985aee87f3155.ico.gzip;
    document.getElementsByTagName('head')[0].appendChild(link);
})();
