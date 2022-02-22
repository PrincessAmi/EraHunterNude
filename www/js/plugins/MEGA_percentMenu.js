/*:
* @plugindesc percent menu
* 
* @param label
*
*/
'use strict';

var Imported = Imported || {};
var MEGA_percentMenu = MEGA_percentMenu || {};

(function ($) {
    var oldPercent = 0
    var megaParams = megaParams || {}
    megaParams['MEGA_percentMenu'] = {}
    var tempParameters = PluginManager.parameters('MEGA_percentMenu')
    megaParams['MEGA_percentMenu'].label = tempParameters['label']

    var body = document.querySelector('body')
    var itemMenu = document.createElement('div')
    var percentMenuIsShow = true

    function hideStatusMenu() {
        itemMenu.innerHTML = ''
        percentMenuIsShow = true
    }

    function showStatusMenu(percent) {
        percent = percent || 0
        // if (megaParams['MEGA_percentMenu'].showId && !$gameSwitches.value(megaParams['MEGA_percentMenu'].showId)) {
        //     hideStatusMenu()
        //     return
        // }

        var label = megaParams['MEGA_percentMenu'].label

        itemMenu.innerHTML = `
            <style>
                .percentMenu {
                    position: absolute;
                    top: 15px;
                    left: 50%;
                    z-index: 501;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
            
                .percentMenu__box {
                    position: relative;
                    left: -50%;
                }
            
                .progressBar {}
            
                .progressBar__block {
                    background: rgba(21, 18, 22, 0.6);
                    border: 2px solid white;
                    border-radius: 4px;
                    width: 200px;
                }
            
                .progressBar__bar {
                    background: #18cde0;
                    height: 36px;
                    width: ${percent}%;
                }
            
                .progressBar__label {
                    float: left;
                    padding: 6px 10px;
                    font-size: 20px;
                    font-family: Arial;
                    color: white;
                }
            </style>

            <div class="percentMenu">
                <div class="percentMenu__box">
                    <div class='progressBar'>
                        <div class='progressBar__block'>
                            <div class='progressBar__label'>${label}</div>
                            <div class='progressBar__bar'>&nbsp;</div>
                        </div>
                    </div>
                </div>
            </div>
        `

        percentMenuIsShow = true
    }

    setTimeout(function () {
        body.appendChild(itemMenu)
    }, 150)

    var temp_Scene_Map_callMenu = Scene_Map.prototype.callMenu
    Scene_Map.prototype.callMenu = function () {
        hideStatusMenu()
        temp_Scene_Map_callMenu.call(this)
    }

    // var temp_Scene_Map_update = Scene_Map.prototype.update
    // Scene_Map.prototype.update = function() {
    //     temp_Scene_Map_update.call(this)
    //     if(!statusMenuIsShow) {
    //         showStatusMenu()
    //     }    
    // }

    // Window_Command.prototype.refresh = function() {
    // addOriginalCommands

    // $.setPercent = function (percent) {
    //     oldPercent = percent | 0

    //     if (Math.abs(percent - oldPercent) > 0) {
    //         for (var i = 0; i < Math.abs(percent - oldPercent); i++) {
    //             showStatusMenu(oldPercent + i)
    //         }
    //     }
    //     else {
    //         showStatusMenu(percent | 0)
    //     }
    // }

    $.setPercent = function (from, to) {
        if (!to) {
            showStatusMenu()
            percentFromTo(oldPercent, percent)

            oldPercent = percent | 0
        }
        else {
            showStatusMenu()
            percentFromTo(from, to)
        }
    }

    $.show = function (eventId) {
        showStatusMenu()
    }

    $.hide = function (eventId) {
        hideStatusMenu()
    }

    $.percentDown = function () {
        percentFromTo(100, 0)
    }

    var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
        return new (P || (P = Promise))(function (resolve, reject) {
            function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
            function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
            function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
            step((generator = generator.apply(thisArg, _arguments || [])).next());
        });
    };
    var __generator = (this && this.__generator) || function (thisArg, body) {
        var _ = { label: 0, sent: function () { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
        return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function () { return this; }), g;
        function verb(n) { return function (v) { return step([n, v]); }; }
        function step(op) {
            if (f) throw new TypeError("Generator is already executing.");
            while (_) try {
                if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
                if (y = 0, t) op = [0, t.value];
                switch (op[0]) {
                    case 0: case 1: t = op; break;
                    case 4: _.label++; return { value: op[1], done: false };
                    case 5: _.label++; y = op[1]; op = [0]; continue;
                    case 7: op = _.ops.pop(); _.trys.pop(); continue;
                    default:
                        if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                        if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                        if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                        if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                        if (t[2]) _.ops.pop();
                        _.trys.pop(); continue;
                }
                op = body.call(thisArg, _);
            } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
            if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
        }
    };
    function percentFromTo(from, to) {
        return __awaiter(this, void 0, void 0, function () {
            var delay, i, progressBar__bar, progressBar__percent, i, progressBar__bar, progressBar__percent;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        delay = function (time) { return new Promise(function (resolve) { return setTimeout(resolve, time); }); };
                        if (!(from > to)) return [3 /*break*/, 5];
                        i = from;
                        _a.label = 1;
                    case 1:
                        if (!(i >= to)) return [3 /*break*/, 4];
                        progressBar__bar = document.querySelector('.progressBar__bar');
                        progressBar__bar.style.width = i + '%';
                        progressBar__percent = document.querySelector('.progressBar__percent');
                        if (progressBar__percent) {
                            progressBar__percent.innerHTML = i + '%';
                        }
                        return [4 /*yield*/, delay(10)];
                    case 2:
                        _a.sent();
                        _a.label = 3;
                    case 3:
                        i--;
                        return [3 /*break*/, 1];
                    case 4: return [3 /*break*/, 9];
                    case 5:
                        i = from;
                        _a.label = 6;
                    case 6:
                        if (!(i <= to)) return [3 /*break*/, 9];
                        progressBar__bar = document.querySelector('.progressBar__bar');
                        progressBar__bar.style.width = i + '%';
                        progressBar__percent = document.querySelector('.progressBar__percent');
                        if (progressBar__percent) {
                            progressBar__percent.innerHTML = i + '%';
                        }
                        return [4 /*yield*/, delay(30)];
                    case 7:
                        _a.sent();
                        _a.label = 8;
                    case 8:
                        i++;
                        return [3 /*break*/, 6];
                    case 9: return [2 /*return*/];
                }
            });
        });
    }

})(MEGA_percentMenu);

Imported["MEGA_percentMenu"] = 1.0