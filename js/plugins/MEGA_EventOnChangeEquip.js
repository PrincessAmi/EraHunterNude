/*:
 * @plugindesc Call Common Event on Change Equipment
 *
 * @param commonEventID
 * @desc call Common Event by this ID
 * @default 
 */

var cEvent = {}
cEvent.openEquipWindow = false
cEvent.parameters = PluginManager.parameters('MEGA_EventOnChangeEquip');
cEvent.commonEventID = Number(cEvent.parameters['commonEventID']) || 0;
cEvent.default_changeEquip = Game_Actor.prototype.changeEquip;

Game_Actor.prototype.changeEquip = function (slotId, item) {
    cEvent.default_changeEquip.call(this, slotId, item)

    if (cEvent.commonEventID && cEvent.openEquipWindow) {
        console.log(22, cEvent.openEquipWindow)
        $gameTemp.reserveCommonEvent(cEvent.commonEventID)
        cEvent.openEquipWindow = false
    }
}


// cEvent.default_addMainCommands = Window_MenuCommand.prototype.addMainCommands
// Window_MenuCommand.prototype.addMainCommands = function() {
//     cEvent.default_addMainCommands.call(this)
//     this.addCommand('FastRoom', 'fastroom', true)
// }

cEvent.default_onPersonalOk = Scene_Menu.prototype.onPersonalOk
Scene_Menu.prototype.onPersonalOk = function () {
    cEvent.default_onPersonalOk.call(this)

    switch (this._commandWindow.currentSymbol()) {
        case 'equip':
            cEvent.openEquipWindow = true
            break
    }
}