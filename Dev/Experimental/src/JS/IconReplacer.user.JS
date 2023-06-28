// ==UserScript==
// @name         Roblox Icon replacer
// @namespace    TersisWilvin
// @version      1.0
// @description  Replaces the favicon
// @author       TersisWilvin
// @match        https://www.roblox.com/*
// @match        https://blog.roblox.com/*
// @match        https://en.help.roblox.com/*
// @icon         https://images.rbxcdn.com/23421382939a9f4ae8bbe60dbe2a3e7e.ico.gzip
// @grant        none
// ==/UserScript==

(function() {
    var link = document.querySelector("link[rel*='icon']") || document.createElement('link');
    link.type = 'image/x-icon';
    link.rel = 'shortcut icon';
    link.href = 'https://images.rbxcdn.com/23421382939a9f4ae8bbe60dbe2a3e7e.ico.gzip';
    document.getElementsByTagName('head')[0].appendChild(link);
})();