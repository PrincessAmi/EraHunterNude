/*:
* @plugindesc status menu
* 
* @param showId
*
* @param value1
*
* @param value1_label
*
* @param value2
*
* @param value2_label
*
* @param value3
*
* @param value3_label
*
* @param value4
*
* @param value4_label
*
*/
'use strict';

var megaParams = megaParams || {}
megaParams['statusMenu'] = {}
var tempParameters = PluginManager.parameters('MEGA_StatusMenu')
megaParams['statusMenu'].showId = Number(tempParameters['showId']) || 0
megaParams['statusMenu'].values = []
megaParams['statusMenu'].labels = []
if (Number(tempParameters['value1'])) {
    megaParams['statusMenu'].values.push(Number(tempParameters['value1']))
    megaParams['statusMenu'].labels.push(tempParameters['value1_label'])
}
if (Number(tempParameters['value2'])) {
    megaParams['statusMenu'].values.push(Number(tempParameters['value2']))
    megaParams['statusMenu'].labels.push(tempParameters['value2_label'])
}
if (Number(tempParameters['value3'])) {
    megaParams['statusMenu'].values.push(Number(tempParameters['value3']))
    megaParams['statusMenu'].labels.push(tempParameters['value3_label'])
}
if (Number(tempParameters['value4'])) {
    megaParams['statusMenu'].values.push(Number(tempParameters['value4']))
    megaParams['statusMenu'].labels.push(tempParameters['value4_label'])
}

var body = document.querySelector('body')
var itemMenu = document.createElement('div')
var statusMenuIsShow = false

function hideStatusMenu() {
    itemMenu.innerHTML = ''
    statusMenuIsShow = false
}

function showStatusMenu() {
    if (megaParams['statusMenu'].showId && !$gameSwitches.value(megaParams['statusMenu'].showId)) {
        hideStatusMenu()
        return
    }

    var items = ''

    for (var i = 0; i < megaParams['statusMenu'].values.length; i++) {
        var value = megaParams['statusMenu'].values[i]
        var data = $gameVariables.value(value)
        var label = megaParams['statusMenu'].labels[i]
        items += `<div class="statusMenu__text">${label} ${data}</div>`
    }

    itemMenu.innerHTML = `
        <style>
            .statusMenu {
                position: absolute;
                top: 15px;
                right: 20px;
                background: rgba(21, 18, 22, 0.6);
                border: 2px solid white;
                border-radius: 4px;
                z-index: 501;
                display: flex;
                align-items: center;
                justify-content: center;
            }
            .statusMenu__text {
                padding: 6px 10px;
                font-size: 20px;
                font-family: Arial;
                color: white;
            }
        </style>
        <div class="statusMenu">
            ${items}
        </div>
    `

    statusMenuIsShow = true
}

var tempOnMouseDown = TouchInput._onMouseDown
var noNeedNext = false

TouchInput._onMouseDown = function (event) {
    if (!noNeedNext) {
        tempOnMouseDown.call(this, event)
    }
    else {
        noNeedNext = false
    }
}

itemMenu.addEventListener('mousedown', function (e) {
    e.preventDefault()
    noNeedNext = true
})

setTimeout(function () {
    body.appendChild(itemMenu)
}, 150)

var tempGameVarOnChange = Game_Variables.prototype.onChange
Game_Variables.prototype.onChange = function () {
    showStatusMenu()
    tempGameVarOnChange.call(this)
}

var tempGameSwitchesOnChange = Game_Switches.prototype.onChange
Game_Switches.prototype.onChange = function () {
    showStatusMenu()
    tempGameSwitchesOnChange.call(this)
}

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