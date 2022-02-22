/*:
* @plugindesc remove some item from menu
*
*/
'use strict';

Window_MenuCommand.prototype.makeCommandList = function() {
    // this.addMainCommands();
    var enabled = this.areMainCommandsEnabled();
    if (this.needsCommand('item')) {
        this.addCommand(TextManager.item, 'item', enabled);
    }
    if (this.needsCommand('skill')) {
        this.addCommand(TextManager.skill, 'skill', enabled);
    }
    if (this.needsCommand('equip')) {
        this.addCommand(TextManager.equip, 'equip', enabled);
    }
    if (this.needsCommand('status')) {
        this.addCommand(TextManager.status, 'status', enabled);
    }
    // this.addFormationCommand();
    this.addOriginalCommands();
    this.addOptionsCommand();
    this.addSaveCommand();
    this.addGameEndCommand();
};

// addOriginalCommands