/*:
* @plugindesc MEGA_setVariablesOnLoadGame
* 
* @param var1
* @param var2
* @param var3
* @param var4
* @param var5
* @param var6
* @param var7
* @param var8
* @param var9
* @param var10
* @param var11
* @param var12
*
*/
'use strict';

var megaParams = megaParams || {}
var plugName = 'MEGA_setVariablesOnLoadGame'
megaParams[plugName] = {}
megaParams[plugName].parameters = PluginManager.parameters(plugName)

const tempOrigFunc = Game_Map.prototype.setupEvents
Game_Map.prototype.setupEvents = function () {
    tempOrigFunc.call(this)

    setTimeout(function () {
        for (var i = 0; i < Object.keys(megaParams[plugName].parameters).length; i++) {
            if (megaParams[plugName].parameters['var' + i]) {
                let json = JSON.parse(megaParams[plugName].parameters['var' + i])
                let varId = json['varId']
                let value = json['value']

                $gameVariables.setValue(varId, value)
            }
        }
    }, 200)
}
