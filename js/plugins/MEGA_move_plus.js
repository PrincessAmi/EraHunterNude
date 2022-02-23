//=============================================================================
// MEGA_move_plus.js
// 移動ルートの拡張
//=============================================================================

/*:
* @plugindesc move plus
*
*/

// var cEvent = {}
// cEvent.parameters = PluginManager.parameters('MEGA_EventOnChangeEquip');
// cEvent.commonEventID = Number(cEvent.parameters['commonEventID']) || 0;
// cEvent.defaultChangeEquip = Game_Actor.prototype.changeEquip;

// Game_Actor.prototype.changeEquip = function (slotId, item) {
//     cEvent.defaultChangeEquip.call(this, slotId, item);
//     if (cEvent.commonEventID) {
//         $gameTemp.reserveCommonEvent(cEvent.commonEventID);
//     }
// };

// NOT FULL

var movePlusMV = {}

Game_Event.prototype.reset_move2pos_params = function () {
    this.tkgc_reserved_move = null
}

movePlusMV._hn_mplus__setup_page = Game_Event.prototype.setupPage
Game_Event.prototype.setupPage = function () {
    this.reset_move2pos_params()
    movePlusMV._hn_mplus__setup_page.call(this)
}


Game_Event.prototype.move2pos_wait = function (tx, ty, option) {
    option = option || {}
    var distance = 0
    if (option.distance) {
        distance = option.distance | 0
    }

    this.move2pos(tx, ty, option)
    var sx = this.distance_x_from_target(tx)
    var sy = this.distance_x_from_target(ty)

    if (this.steps_from_pos(tx, ty) <= distance) {
        this.hn_reserved_mov = null
        this._movementSuccess = true
    }
    else {
        if (this.move_route && this.move_route.skippable) {
            this.move_route_index -= 1
        }
        this._movementSuccess = false
    }
}

Game_Event.prototype.move2pos = function (tx, ty, option) {
    option = option || {}
    var sx = this.distance_x_from_target(tx)
    var sy = this.distance_y_from_target(ty)

    if (sx != 0 || sy != 0) {
        var circumvent = false
        if (option.circumvent) {
            circumvent = true
        }

        if (this.tkgc_reserved_move) {
            switch (this.tkgc_reserved_move) {
                case 2:
                case 4:
                case 6:
                case 8:
                    this.moveStraight(this.tkgc_reserved_move)
                    break
                default:
                    this._movementSuccess = false
            }
            this.tkgc_reserved_move = null
            if (this._movementSuccess) {
                return
            }
        }

        if (option['random_rate']) {
            if (Math.random() * 100 < option['random_rate']) {
                return this.moveRandom()
            }
        }

        if (Math.abs(sx) > Math.abs(sy)) {
            this.moveStraight(sx > 0 ? 4 : 6)
            if (!this._movementSuccess) {
                if (sy != 0) {
                    this.moveStraight(sy > 0 ? 8 : 2)
                }
                if (!this._movementSuccess && circumvent) {
                    if (sx < 0) {
                        var next_x = this.x + 1
                        var next_move = 6
                    }
                    else {
                        var next_x = this.x - 1
                        var next_move = 4
                    }
                    if (Math.random() * 2 | 0 == 0) {
                        if ($gameMap.isPassable(this.x, this.y, 8) && $gameMap.isPassable(this.x, this.y - 1, next_move))
                            this.moveStraight(8)
                        if (!this._movementSuccess && $gameMap.isPassable(this.x, this.y, 2) && $gameMap.isPassable(this.x, this.y + 1, next_move))
                            this.moveStraight(2)
                    }
                    else {
                        if ($gameMap.isPassable(this.x, this.y, 2) && $gameMap.isPassable(this.x, this.y + 1, next_move))
                            this.moveStraight(2)
                        if (!this._movementSuccess && $gameMap.isPassable(this.x, this.y, 8) && $gameMap.isPassable(this.x, this.y - 1, next_move))
                            this.moveStraight(8)
                    }
                    if (this._movementSuccess) {
                        this.tkgc_reserved_move = next_move
                    }
                }
            }
        }
        else {
            this.moveStraight(sy > 0 ? 8 : 2)
            if (!this._movementSuccess) {
                if (sx != 0) {
                    this.moveStraight(sx > 0 ? 4 : 6)
                }
                if (!this._movementSuccess && circumvent) {
                    if (sy < 0) {
                        var next_y = this.y + 1
                        var next_move = 2
                    }
                    else {
                        var next_y = this.y - 1
                        var next_move = 8
                    }

                    if (Math.random() * 2 | 0 == 0) {
                        if ($gameMap.isPassable(this.x, this.y, 4) && $gameMap.isPassable(this.x - 1, this.y, next_move))
                            this.moveStraight(4)
                        if (!this._movementSuccess && $gameMap.isPassable(this.x, this.y, 6) && $gameMap.isPassable(this.x + 1, this.y, next_move))
                            this.moveStraight(6)
                    }
                    else {
                        if ($gameMap.isPassable(this.x, this.y, 6) && $gameMap.isPassable(this.x + 1, this.y, next_move))
                            this.moveStraight(6)
                        if (!this._movementSuccess && $gameMap.isPassable(this.x, this.y, 4) && $gameMap.isPassable(this.x - 1, this.y, next_move))
                            this.moveStraight(4)
                    }
                    if (!!this._movementSuccess) {
                        this.tkgc_reserved_move = next_move
                    }
                }
            }
        }
    }
}

Game_Event.prototype.distance_x_from_target = function (tx) {
    var sx = this.x - tx
    if ($gameMap.isLoopHorizontal()) {
        if (Math.abs(sx) > $gameMap.width / 2) {
            if (sx > 0) {
                sx -= $gameMap.width
            }
            else {
                sx += $gameMap.width
            }
        }
    }
    return sx
}

Game_Event.prototype.distance_y_from_target = function (ty) {
    var sy = this.y - ty
    if ($gameMap.isLoopVertical()) {
        if (Math.abs(sy) > $gameMap.height / 2) {
            if (sy > 0) {
                sy -= $gameMap.height
            }
            else {
                sy += $gameMap.height
            }
        }
    }
    return sy
}

Game_Event.prototype.steps_from_pos = function (tx, ty) {
    var sx = this.x - tx
    var sy = this.y - ty
    if ($gameMap.isLoopHorizontal) {
        if (Math.abs(sx) > $gameMap.width / 2) {
            if (sx > 0) {
                sx -= $gameMap.width
            }
            else {
                sx += $gameMap.width
            }
        }
    }
    if ($gameMap.isLoopVertical) {
        if (Math.abs(sy) > $gameMap.height / 2) {
            if (sy > 0) {
                sy -= $gameMap.height
            }
            else {
                sy += $gameMap.height
            }
        }
    }
    return Math.abs(sx) + Math.abs(sy)
}

// Game_Event.prototype.turn_toward_pos = function(tx, ty) {
//     var sx = this.distance_x_from_target(tx)
//     var sy = this.distance_y_from_target(ty)
//     if(Math.abs(sx) > Math.abs(sy)) {
//         sx > 0 ? this.turn_left : turn_right
//     }
//     else if (Math.abs(sx) < Math.abs(sy)) {
//         sy > 0 ? this.turn_up : this.turn_down
//     }
// }

