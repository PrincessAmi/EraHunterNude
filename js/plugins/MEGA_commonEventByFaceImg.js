/*:
 * @plugindesc MEGA_commonEventByFaceImg
 *
 * @param faceFile1
 * @param params1
 * @param faceFile2
 * @param params2
 * @param faceFile3
 * @param params3
 * @param faceFile4
 * @param params4
 * @param faceFile5
 * @param params5
 * @param faceFile6
 * @param params6
 * @param faceFile7
 * @param params7
 * @param faceFile8
 * @param params8
 * @param faceFile9
 * @param params9
 * @param faceFile10
 * @param params10
 * @param faceFile11
 * @param params11
 * @param faceFile12
 * @param params12
 */
'use strict'

var module2 = {}
module2.parameters = PluginManager.parameters('MEGA_commonEventByFaceImg')
module2.faceFiles = {}

for (let i = 0; i < Object.keys(module2.parameters).length; i++) {
    if (module2.parameters['faceFile' + i]) {
        module2.faceFiles[module2.parameters['faceFile' + i]] = module2.parameters['params' + i]
    }
}

module2.isEventCall = false
module2.faceName = ''

module2.removeEmotion = function () {
    var commonEvent = $dataCommonEvents[module2.afterId]
    if (commonEvent) {
        var eventId = $gameMap._interpreter.isOnCurrentMap() ? $gameMap._interpreter._eventId : 0
        $gameMap._interpreter.setupChild(commonEvent.list, eventId)
    }
}

module2.back_command117 = Game_Interpreter.prototype.command117
Game_Interpreter.prototype.command117 = function () {
    var commonEvent = $dataCommonEvents[this._params[0]]

    if (commonEvent) {
        var newList = []
        var endTextBlock = false
        var commonEventBeforeId = null
        var commonEventId = null
        var commonEventAfterId = null

        for (var i = 0; i < commonEvent.list.length; i++) {
            if (commonEvent.list[i].code !== 401) {
                endTextBlock = true
            }
            if (commonEvent.list[i].code === 101) {
                endTextBlock = false

                var faceName = commonEvent.list[i].parameters[0]
                var faceIndex = commonEvent.list[i].parameters[1]

                if (faceName) {

                    let json = JSON.parse(module2.faceFiles[faceName])
                    let preId = json['preId'] || 0
                    let emotionIdFrom = json['emotionIdFrom'] || 0
                    let afterId = json['afterId'] || 0

                    if (preId >= 0) {
                        commonEventBeforeId = $dataCommonEvents[preId].id
                        commonEventId = $dataCommonEvents[emotionIdFrom + faceIndex].id
                        commonEventAfterId = $dataCommonEvents[afterId].id

                        newList.push({ code: 117, indent: commonEvent.list[i].indent, parameters: [commonEventBeforeId] })
                        newList.push({ code: 117, indent: commonEvent.list[i].indent, parameters: [commonEventId] })

                        commonEvent.list[i].parameters[0] = ''
                    }
                }
            }

            if (endTextBlock && commonEventAfterId) {
                newList.push({ code: 117, indent: commonEvent.list[i].indent, parameters: [commonEventAfterId] })
                commonEventBeforeId = null
                commonEventId = null
                commonEventAfterId = null
            }

            newList.push(commonEvent.list[i])
        }

        commonEvent.list = newList
    }

    return module2.back_command117.call(this)
}

module2.Window_Message_startMessage = Window_Message.prototype.startMessage;
Window_Message.prototype.startMessage = function () {
    if (module2.faceFiles[module2.faceName]) {
        let eventList = []

        let json = JSON.parse(module2.faceFiles[module2.faceName])
        let preId = json['preId'] || 0
        let emotionIdFrom = json['emotionIdFrom'] || 0

        module2.afterId = json['afterId'] || 0

        if (preId) {
            let commonEvent = $dataCommonEvents[preId]
            if (commonEvent) {
                eventList = eventList.concat(commonEvent.list)
            }
        }

        if (emotionIdFrom) {
            let commonEvent = $dataCommonEvents[$gameMessage.faceIndex() + emotionIdFrom]
            if (commonEvent) {
                eventList = eventList.concat(commonEvent.list)
            }
        }

        if (eventList.length) {
            let eventId = $gameMap._interpreter.isOnCurrentMap() ? $gameMap._interpreter._eventId : 0
            $gameMap._interpreter.setupChild(eventList, eventId)
            module2.isEventCall = true
        }
    }

    module2.Window_Message_startMessage.call(this)
}

module2.Window_Message_terminateMessage = Window_Message.prototype.terminateMessage
Window_Message.prototype.terminateMessage = function () {
    if (module2.isEventCall) {
        module2.removeEmotion()
        module2.isEventCall = false
    }
    module2.Window_Message_terminateMessage.call(this)
}

module2.Game_Message_setFaceImage = Game_Message.prototype.setFaceImage
Game_Message.prototype.setFaceImage = function (faceName, faceIndex) {
    module2.faceName = faceName

    if (module2.faceFiles[faceName]) {
        faceName = "";
    }

    module2.Game_Message_setFaceImage.call(this, faceName, faceIndex)
}