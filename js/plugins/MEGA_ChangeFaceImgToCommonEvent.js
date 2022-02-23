/*:
 * @plugindesc MEGA_ChangeFaceImgToCommonEvent
 *
 * @param emotionsListFromThisId
 * @desc emotions list from this id in common events list
 * @default 1
 * @param commonEventIdAfterText
 * @desc 
 * @default 
 * @param emotionsFileName1
 * @desc filename img from ./faces
 * @default 
 * @param commonEvent1
 * @desc call Common Event by this ID if emotion from this filename
 * @default
 * @param emotionsFileName2
 * @desc filename img from ./faces
 * @default 
 * @param commonEvent2
 * @desc call Common Event by this ID if emotion from this filename
 * @default
 * @param emotionsFileName3
 * @desc filename img from ./faces
 * @default 
 * @param commonEvent3
 * @desc call Common Event by this ID if emotion from this filename
 * @default
 * @param emotionsFileName4
 * @desc filename img from ./faces
 * @default 
 * @param commonEvent4
 * @desc call Common Event by this ID if emotion from this filename
 * @default
 * @param emotionsFileName5
 * @desc filename img from ./faces
 * @default 
 * @param commonEvent5
 * @desc call Common Event by this ID if emotion from this filename
 * @default
 * @param emotionsFileName6
 * @desc filename img from ./faces
 * @default 
 * @param commonEvent6
 * @desc call Common Event by this ID if emotion from this filename
 * @default
 * @param emotionsFileName7
 * @desc filename img from ./faces
 * @default 
 * @param commonEvent7
 * @desc call Common Event by this ID if emotion from this filename
 * @default
 * @param emotionsFileName8
 * @desc filename img from ./faces
 * @default 
 * @param commonEvent8
 * @desc call Common Event by this ID if emotion from this filename
 * @default
 */

var FaceToEvent = {}
FaceToEvent.parameters = PluginManager.parameters('MEGA_ChangeFaceImgToCommonEvent');
FaceToEvent.emotionsFileName = []
FaceToEvent.emotionsFileName.push(FaceToEvent.parameters['emotionsFileName1'] || '__error')
FaceToEvent.emotionsFileName.push(FaceToEvent.parameters['emotionsFileName2'] || '__error')
FaceToEvent.emotionsFileName.push(FaceToEvent.parameters['emotionsFileName3'] || '__error')
FaceToEvent.emotionsFileName.push(FaceToEvent.parameters['emotionsFileName4'] || '__error')
FaceToEvent.emotionsFileName.push(FaceToEvent.parameters['emotionsFileName5'] || '__error')
FaceToEvent.emotionsFileName.push(FaceToEvent.parameters['emotionsFileName6'] || '__error')
FaceToEvent.emotionsFileName.push(FaceToEvent.parameters['emotionsFileName7'] || '__error')
FaceToEvent.emotionsFileName.push(FaceToEvent.parameters['emotionsFileName8'] || '__error')

FaceToEvent.emotionsListFromThisId = FaceToEvent.parameters['emotionsListFromThisId'] | 0 || 1

FaceToEvent.commonEvent = []
FaceToEvent.commonEvent.push(Number(FaceToEvent.parameters['commonEvent1']))
FaceToEvent.commonEvent.push(Number(FaceToEvent.parameters['commonEvent2']))
FaceToEvent.commonEvent.push(Number(FaceToEvent.parameters['commonEvent3']))
FaceToEvent.commonEvent.push(Number(FaceToEvent.parameters['commonEvent4']))
FaceToEvent.commonEvent.push(Number(FaceToEvent.parameters['commonEvent5']))
FaceToEvent.commonEvent.push(Number(FaceToEvent.parameters['commonEvent6']))
FaceToEvent.commonEvent.push(Number(FaceToEvent.parameters['commonEvent7']))
FaceToEvent.commonEvent.push(Number(FaceToEvent.parameters['commonEvent8']))

FaceToEvent.commonEventIdAfterText = Number(FaceToEvent.parameters['commonEventIdAfterText'])

FaceToEvent.isEventCall = false
FaceToEvent.faceName = ''

FaceToEvent.removeEmotion = function () {
    var commonEvent = $dataCommonEvents[FaceToEvent.commonEventIdAfterText];
    if (commonEvent) {
        var eventId = $gameMap._interpreter.isOnCurrentMap() ? $gameMap._interpreter._eventId : 0;
        $gameMap._interpreter.setupChild(commonEvent.list, eventId);
    }
}

FaceToEvent.back_command117 = Game_Interpreter.prototype.command117
Game_Interpreter.prototype.command117 = function () {
    var commonEvent = $dataCommonEvents[this._params[0]];

    if (commonEvent) {
        var newList = []
        var endTextBlock = false
        var commonEventBeforeId = null
        var commonEventCenterId = null
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
                    var idx = FaceToEvent.emotionsFileName.indexOf(faceName)
                    if (idx >= 0) {
                        commonEventBeforeId = $dataCommonEvents[FaceToEvent.commonEvent[idx]].id
                        commonEventCenterId = $dataCommonEvents[faceIndex + FaceToEvent.emotionsListFromThisId].id
                        commonEventAfterId = $dataCommonEvents[FaceToEvent.commonEventIdAfterText].id

                        newList.push({ code: 117, indent: commonEvent.list[i].indent, parameters: [commonEventBeforeId] })
                        newList.push({ code: 117, indent: commonEvent.list[i].indent, parameters: [commonEventCenterId] })

                        commonEvent.list[i].parameters[0] = ''
                    }
                }
            }

            if (endTextBlock && commonEventAfterId) {
                newList.push({ code: 117, indent: commonEvent.list[i].indent, parameters: [commonEventAfterId] })
                commonEventBeforeId = null
                commonEventCenterId = null
                commonEventAfterId = null
            }

            newList.push(commonEvent.list[i])
        }

        commonEvent.list = newList
    }

    return FaceToEvent.back_command117.call(this);
}

FaceToEvent.Window_Message_startMessage = Window_Message.prototype.startMessage;
Window_Message.prototype.startMessage = function () {
    if (~FaceToEvent.emotionsFileName.indexOf(FaceToEvent.faceName)) {
        var idx = FaceToEvent.emotionsFileName.indexOf(FaceToEvent.faceName)
        if (idx >= 0) {
            var commondEventId = FaceToEvent.commonEvent[idx]

            var commonEvent = $dataCommonEvents[commondEventId];
            var firstList = []
            if (commonEvent) {
                firstList = commonEvent.list
            }

            var commonEvent = $dataCommonEvents[$gameMessage.faceIndex() + FaceToEvent.emotionsListFromThisId];
            if (commonEvent) {
                var resultList = firstList.concat(commonEvent.list)
                var eventId = $gameMap._interpreter.isOnCurrentMap() ? $gameMap._interpreter._eventId : 0;
                $gameMap._interpreter.setupChild(resultList, eventId);
                FaceToEvent.isEventCall = true
            }
        }
    }
    FaceToEvent.Window_Message_startMessage.call(this);
};

FaceToEvent.Window_Message_terminateMessage = Window_Message.prototype.terminateMessage
Window_Message.prototype.terminateMessage = function () {
    if (FaceToEvent.isEventCall) {
        FaceToEvent.removeEmotion()
        FaceToEvent.isEventCall = false
    }
    FaceToEvent.Window_Message_terminateMessage.call(this)
}

FaceToEvent.Game_Message_setFaceImage = Game_Message.prototype.setFaceImage;
Game_Message.prototype.setFaceImage = function (faceName, faceIndex) {
    FaceToEvent.faceName = faceName
    if (~FaceToEvent.emotionsFileName.indexOf(faceName)) {
        // if (faceName === FaceToEvent.emotionsFileName) {
        faceName = "";
    }
    FaceToEvent.Game_Message_setFaceImage.call(this, faceName, faceIndex);
};