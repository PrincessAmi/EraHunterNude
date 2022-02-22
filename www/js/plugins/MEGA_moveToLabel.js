/*:
 * @plugindesc move to eventId
 * 
 */
"use strict";

var Imported = Imported || {};
var MEGA_moveToLabel = MEGA_moveToLabel || {};

var Game_Event_updateSelfMovement_Temp = Game_Event.prototype.updateSelfMovement
Game_Event.prototype.updateSelfMovement = function () {
    Game_Event_updateSelfMovement_Temp.call(this)

    // $gameMap.event(1).moveTowardCharacter($gameMap.event(2))
    // console.log(2)
}

    ;
(function ($) {
    $.moveToEventId = function (eventId) {
        console.log(eventId, $gameMap.event(eventId))
        // $gameMap.event(1).moveTowardCharacter($gameMap.event(eventId))
        $gamePlayer.moveTowardCharacter($gameMap.event(eventId))
    }

    $.jumpToEventId = function (eventId, who) {
        var whoGo = who ? $gameMap.event(who) : $gamePlayer

        var plusX = $gameMap.event(eventId).x - whoGo.x
        var plusY = $gameMap.event(eventId).y - whoGo.y
        whoGo.jump(plusX, plusY)
    }

    $.moveAwayFromEventId = function (eventId) {
        this.moveAwayFromCharacter($gameMap.event(eventId))
    }

})(MEGA_moveToLabel);

Imported["MEGA_moveToLabel"] = 1.0