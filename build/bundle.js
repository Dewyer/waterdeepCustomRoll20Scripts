(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
(function (__dirname){
module.exports =
/******/ (function(modules, runtime) { // webpackBootstrap
/******/ 	"use strict";
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	__webpack_require__.ab = __dirname + "/";
/******/
/******/ 	// the startup function
/******/ 	function startup() {
/******/ 		// Load entry module and return exports
/******/ 		return __webpack_require__(325);
/******/ 	};
/******/ 	// initialize runtime
/******/ 	runtime(__webpack_require__);
/******/
/******/ 	// run startup
/******/ 	return startup();
/******/ })
/************************************************************************/
/******/ ({

/***/ 325:
/***/ (function(__unusedmodule, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const rollfx = __webpack_require__(578);
const tavern = __webpack_require__(663);
const utility = __webpack_require__(783);
//Message handler
on("chat:message", function (msg) {
    tavern.handleTavernCommands(msg);
    utility.handleUtilityCommands(msg);
    rollfx.handleCustomFx(msg);
});


/***/ }),

/***/ 578:
/***/ (function(__unusedmodule, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "handleCustomFx", function() { return handleCustomFx; });
var CustomEffects = {
    "thunderwave": {
        maxParticles: 1000,
        size: 5,
        sizeRandom: 20,
        lifeSpan: 50,
        lifeSpanRandom: 0,
        emissionRate: 20000,
        speed: 4,
        speedRandom: 0,
        gravity: {x:0.01, y:0.01},
        angle: 90.0,
        angleRandom: 360,
        startColour: [90, 90, 175, 1],
        startColourRandom: [0, 0, 0, 0.25],
        endColour: [125, 125, 255, 0],
        endColourRandom: [0, 0, 0, 0]
    },
    "acid": {
        maxParticles: 200,
        size: 15,
        sizeRandom: 3,
        lifeSpan: 20,
        lifeSpanRandom: 5,
        speed: 7,
        speedRandom: 2,
        gravity: { x: 0.01, y: 0.65 },
        angle: 270,
        angleRandom: 35,
        emissionRate: 1,
        startColour: [0, 35, 10, 1],
        startColourRandom: [0, 10, 10, 0.25],
        endColour: [0, 75, 30, 0],
        endColourRandom: [0, 20, 20, 0]
    },
    "orb": {
        maxParticles: 200,
        size: 260,
        sizeRandom: 0,
        lifeSpan: 60,
        lifeSpanRandom: 0,
        emissionRate: 2,
        speed: 0,
        speedRandom: 0,
        gravity: {x:0.0001, y:0.0001},
        angle: 0.0,
        angleRandom: 360,
        startColour: [10, 10, 50, 0],
        startColourRandom: [10, 10, 10, 0],
        endColour: [0, 0, 0, 1],
        endColourRandom: [10, 10, 5, 0],
        sharpness: 55,
        sharpnessRandom: 40
    }
};


function handleCustomFx(msg)
{
    if ((msg.rolltemplate === "dmg") && msg.inlinerolls)
    {
        log("will do fx")
        //we need an fx
        let token = getSenderToken(msg);
        if (token)
        {
            let description = msg.content.split("{{desc=")[1].split("}}")[0];
            if (description.includes("#"))
            {
                let effect = description.split("#")[1].toLowerCase()
                log(effect);
                let x = token.get("left");
                let y = token.get("top");
                if (CustomEffects.hasOwnProperty(effect))
                {
                    log("custom effect");
                    log(CustomEffects[effect]);
                    log(x);
                    log(y);
                    spawnFxWithDefinition(x, y, CustomEffects[effect])
                }
                else
                {
                    //spawnFx(token.left+(token.width/2),token.top+(token.height/2),effect);
                    log("Rolling normal effect")
                    spawnFx(x, y, effect);
                }
            }
        }
    }
}

function getCharacterIdFromName(name)
{
    let chars = filterObjs((obj)=>obj.get("_type") === "character" && obj.get("name") === name);
    if (chars.length >0)
    {
        return chars[0].get("_id");
    }
    else
    {
        return undefined;
    }
}

function getSenderToken(msg)
{
    let playerPageId = Campaign().get('playerpageid');
    let representerName = msg.content.split("charname=")[1].trim();
    let representerId = getCharacterIdFromName(representerName);

    let playerTokens = filterObjs((obj) => 
    {
        if (obj.get("_type") === "graphic" && obj.get("_subtype") === "token" && obj.get("_pageid") === playerPageId)
        {
            //all tokens on this page
            if (obj.get("represents") === representerId)
            {
                return true;
            }
        } 
        return false;
    });
    
    if (playerTokens.length > 0)
    {
        return playerTokens[0];
    }
    return undefined;
}

/***/ }),

/***/ 663:
/***/ (function(__unusedmodule, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const utility_1 = __webpack_require__(783);
const TAVERN_NAME = "Egészséges Kecske Kocsma";
function handleTavernCommands(msg) {
    if (msg.content.startsWith("!")) {
        let cmd = utility_1.getMessageCommand(msg.content);
        if (msg.content === "!ujkocsma") {
            getTavernCharacter();
        }
        if (msg.content === "!kocsma") {
            sendChat(TAVERN_NAME, "Hello ! :D");
            let state = getTavernState();
        }
        if (msg.content === "!kocsma-raktar") {
            displayInventory();
        }
        if (cmd.command === "!kocsma-dolgozok") {
            setDolgozok(cmd);
        }
        if (cmd.command === "!kocsma-vetel") {
            handleBuyingStock(cmd);
        }
    }
}
exports.handleTavernCommands = handleTavernCommands;
function handleBuyingStock(cmd) {
    if (cmd.args.length >= 3) {
        let who = cmd.args[0];
        let what = cmd.args[1];
        let howMuch = parseInt(cmd.args[2]);
        let oldState = getTavernState();
        if (oldState.inv[what]) {
            let buy = oldState.defs[what];
            sendChat(TAVERN_NAME, "asd");
        }
    }
}
function setDolgozok(cmd) {
    if (cmd.args.length >= 3) {
        let ink = parseInt(cmd.args[0]);
        let serv = parseInt(cmd.args[1]);
        let guard = parseInt(cmd.args[2]);
        let oldState = getTavernState();
        let news = Object.assign({}, oldState);
        news.innkeeperModifier = ink;
        news.serverModifier = serv;
        news.guardModifier = guard;
        setTavernState(news);
        sendChat(TAVERN_NAME, "Dolgozok beallitva : " + cmd.args.join(" "));
    }
}
function displayInventory() {
    let state = getTavernState();
    let items = [];
    for (let kk in state.inv) {
        items.push(`{{${kk}=${state.inv[kk]}}}`);
    }
    let body = `&{template:simple} {{name=Kocsma}} ${items.join(" ")}`;
    sendChat(TAVERN_NAME, body);
}
function getStateAtrib() {
    let tavern = getTavernCharacter();
    let tid = tavern.id;
    let atrib = filterObjs((obj) => obj.get("_type") === "attribute" && obj.get("_characterid") === tid && obj.get("name") === "state");
    return atrib[0];
}
function getTavernState() {
    let atrib = getStateAtrib();
    log(atrib);
    let ss = atrib.get("current");
    if (ss !== undefined) {
        return JSON.parse(ss);
    }
    return {};
}
function setTavernState(news) {
    let atrib = getStateAtrib();
    atrib.set("current", JSON.stringify(news));
}
function getDefaultTavernState() {
    return {
        reputation: 0,
        innkeeperModifier: 0,
        serverModifier: 0,
        guardModifier: 0,
        inv: {
            "root-beer": 0,
            "shadow-ale": 0,
            "basic-wine": 0,
            "good-wine": 0
        },
        defs: {
            "root-beer": {
                chance: 0.20,
                sellPrice: 3,
                buyPrice: { price: 632, for: 316 }
            },
            "shadow-ale": {
                chance: 0.30,
                sellPrice: 2,
                buyPrice: { price: 316, for: 316 }
            },
            "basic-wine": {
                chance: 0.40,
                sellPrice: 2,
                buyPrice: { price: 90, for: 100 }
            },
            "good-wine": {
                chance: 0.1,
                sellPrice: 4,
                buyPrice: { price: 180, for: 100 }
            }
        }
    };
}
function getTavernCharacter() {
    let existingTavern = findTavernCharacter();
    if (!existingTavern) {
        return createTavernCharacter();
    }
    return existingTavern;
}
function createTavernCharacter() {
    let tavern = createObj("character", {
        name: "tavern",
        bio: "Autogenerated Trollskull tavern",
        inplayerjournals: "all"
    });
    createObj("attribute", { name: "state", current: JSON.stringify(getDefaultTavernState()), max: "", _characterid: tavern.get("_id") });
    return tavern;
}
function findTavernCharacter() {
    let taverns = filterObjs(function (obj) {
        if (obj.get("_type") === "character" && obj.get("name") === "tavern") {
            return true;
        }
        return false;
    });
    if (taverns.length > 0) {
        return taverns[0];
    }
    else {
        return undefined;
    }
}


/***/ }),

/***/ 783:
/***/ (function(__unusedmodule, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "handleUtilityCommands", function() { return handleUtilityCommands; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getMessageCommand", function() { return getMessageCommand; });
var capturedLastRollTotal = 0; 

function handleUtilityCommands(msg)
{
    //log(msg);
    if (msg.content.startsWith("!"))
    {
        let cmd = getMessageCommand(msg.content);
        //log(cmd);

        if (cmd.command === "!cr")
        {
            doCrCommand(cmd);
        }
    
        if (cmd.command === "!kicsigyogy")
        {
            doLesserHealing(cmd);
        }
    }
    tryCaptureRollResult(msg);

};

function tryCaptureRollResult(msg)
{
    if (msg.inlinerolls !== undefined)
    {
        if (msg.inlinerolls.length > 1)
        {
            let last = msg.inlinerolls[msg.inlinerolls.length-1];
            if (last.results)
            {
                let total = last.results.total;
                if (total !== undefined)
                {
                    capturedLastRollTotal = total;
                    log("new captured result :"+capturedLastRollTotal);
                }
            }
        }
    }
}

function doLesserHealing(cmd)
{
    let charName = cmd.args[0];
    let charId  = getCharacterIdFromName(charName);
    let hp = randomInteger(4) + randomInteger(4)+4;
    let ct = "Megiszik egy kicsi gyógyitalt és visszatölt 2d4+4 életerőt ami [["+hp+"]].";
    sendChat("character|"+charId,"/me "+ct);
    changeCharacterAttributeBy(charId,"hp",hp);
}


function getMessageCommand(content)
{
    let args = [];
    let command = "";
    let buffer = "";
    let lastChar = "";
    for (let ii = 0; ii < content.length; ii++)
    {
        let atChar = content[ii];
        if (command === "" && atChar === " ")
        {
            command = buffer;
        }
        else if (atChar === "{")
        {
            buffer = "";
        }
        else if (atChar === "}")
        {
            args.push(buffer);
            buffer = "";

        }
        else if (!(lastChar === "}" && atChar === " "))
        {
            buffer += atChar;
        }
        lastChar = atChar;
    }
    if (command === "")
    {
        command = buffer;
    }

    return { command: command, args: args };
}

function doCrCommand(cmd)
{
    let charName = cmd.args[0];
    let toEdit = cmd.args[1];
    let by = -1;

    if (cmd.args.length > 2)
    {
        if (cmd.args[2] === "roll")
        {
            log("roll by : "+capturedLastRollTotal);
            by = capturedLastRollTotal;
        }
        else{by = parseInt(cmd.args[2]);}
    }

    //log(charName);
    //llog(toEdit);
    let charId = getCharacterIdFromName(charName);
    //class_resource
    changeCharacterAttributeBy(charId,toEdit,by);
}

function changeCharacterAttributeBy(charId,atribStr,by)
{
    let atribs = filterObjs((obj) => obj.get("_type") === "attribute" && obj.get("_characterid") === charId && obj.get("name") === atribStr);
    if (atribs.length > 0)
    {
        try{
            let atrib = atribs[0];
            //log(atrib);
            let mx = parseInt(atrib.get("max"));
            let cur = parseInt(atrib.get("current"))
            let newVal = min(cur + by, mx);
            atrib.set("current", newVal+"");
        }
        catch (ex)
        {
            sendChat("UtilityApi","Coudn't change attrib value!");
        }
    }

}

function getCharacterIdFromName(name)
{
    let chars = filterObjs((obj) => obj.get("_type") === "character" && obj.get("name") === name);
    if (chars.length > 0)
    {
        return chars[0].get("_id");
    }
    else
    {
        return undefined;
    }
}

function min(a,b)
{
    return a >= b ? b : a;
}

/***/ })

/******/ },
/******/ function(__webpack_require__) { // webpackRuntimeModules
/******/ 	"use strict";
/******/ 
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	!function() {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = function(exports) {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	}();
/******/ 	
/******/ 	/* webpack/runtime/define property getter */
/******/ 	!function() {
/******/ 		// define getter function for harmony exports
/******/ 		var hasOwnProperty = Object.prototype.hasOwnProperty;
/******/ 		__webpack_require__.d = function(exports, name, getter) {
/******/ 			if(!hasOwnProperty.call(exports, name)) {
/******/ 				Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 			}
/******/ 		};
/******/ 	}();
/******/ 	
/******/ }
);
}).call(this,"/build")
},{}]},{},[1]);
