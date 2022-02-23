//=============================================================================
// MEGA_Tamura_Area_Touch.js
// イベントの接触エリアを拡大
// イベントの接触エリアを拡大・視野
//=============================================================================

/*:
* @plugindesc Tamura_Area_Touch
*
*/

var Tamura_Area_Touch = {}
Tamura_Area_Touch.IS_MOVE = true

Tamura_Area_Touch.refresh_area_touch_default = Game_Map.prototype.refresh
Game_Map.prototype.refresh = function () {
    Tamura_Area_Touch.refresh_area_touch_default.call(this)
    $gamePlayer.area_touch_reset()
}

var temp = {}
temp.event_touch_area = []
Game_Player.prototype.area_touch_reset = function () {
    temp.event_touch_area = []
    for (var i = 0; i < $gameMap.width().length; i++) {
        var retu = []
        for (var j = 0; j < $gameMap.height().length; j++) {
            retu.push([null, null])
        }
        temp.event_touch_area.push(retu)
    }

    for (var i = 1; i <= $gameMap._events.length; i++) {
        var event = $gameMap._events[i]
        if (!event) {
            continue
        }

        if (!$gameMap._events[i].page()) {
            continue
        }

        var list = $gameMap._events[i].list()
        if (!list) {
            continue
        }

        for (var j = 0; j < list.length; j++) {
            if (list[j].code === 108) { // code of comments
                var tyuusyaku = list[j].parameters[0]
                this.touch_area_rewrite(tyuusyaku, event)
            }
        }
    }
}

Tamura_Area_Touch.check_action_event_touch_area_default = Game_Player.prototype.triggerButtonAction
Game_Player.prototype.triggerButtonAction = function () {
    Tamura_Area_Touch.check_action_event_touch_area_default.call(this)
    if (temp.event_touch_area[$gamePlayer.x] && temp.event_touch_area[$gamePlayer.x][$gamePlayer.y] && temp.event_touch_area[$gamePlayer.x][$gamePlayer.y][0] != null) {
        if (temp.event_touch_area[$gamePlayer.x][$gamePlayer.y][2] == 0) {
            var ex = temp.event_touch_area[$gamePlayer.x][$gamePlayer.y][0]
            var ey = temp.event_touch_area[$gamePlayer.x][$gamePlayer.y][1]
            $gamePlayer.start_map_event_all_pri(ex, ey, [0])
        }
    }
}

Game_Player.prototype.start_map_event_all_pri = function (x, y, triggers) {
    $gameMap.eventsXy(x, y).forEach(function (event) {
        if (event.isTriggerIn(triggers)) {
            event.start()
        }
    })
}

Game_Player.prototype.perform_transfer_event_area = function () {
    Tamura_Area_Touch.perform_transfer_event_area_default.call(this)
    $gamePlayer.area_touch_reset()
}
Tamura_Area_Touch.perform_transfer_event_area_default = Game_Player.prototype.performTransfer
Game_Player.prototype.performTransfer = Game_Player.prototype.perform_transfer_event_area

Scene_Map.prototype.update_touch_area_sce_map = function () {
    Tamura_Area_Touch.update_touch_area_sce_map_default.call(this)
    try {
        if (temp.event_touch_area && temp.event_touch_area[$gamePlayer.x] && temp.event_touch_area[$gamePlayer.x][$gamePlayer.y] && temp.event_touch_area[$gamePlayer.x][$gamePlayer.y][0] != null) {
            if (temp.event_touch_area[$gamePlayer.x][$gamePlayer.y][2] == 1 || 2) {
                var ex = temp.event_touch_area[$gamePlayer.x][$gamePlayer.y][0]
                var ey = temp.event_touch_area[$gamePlayer.x][$gamePlayer.y][1]
                $gamePlayer.start_map_event_all_pri(ex, ey, [1, 2])
            }
        }

    }
    catch (err) {
        console.log(23, err)
        $gamePlayer.area_touch_reset()
    }
    if (Tamura_Area_Touch.IS_MOVE) {
        $gamePlayer.area_touch_reset()
    }
}
Tamura_Area_Touch.update_touch_area_sce_map_default = Scene_Map.prototype.update
Scene_Map.prototype.update = Scene_Map.prototype.update_touch_area_sce_map









Game_Player.prototype.touch_area_rewrite = function (tyuusyaku, event) {
    if (~tyuusyaku.indexOf('接触エリア')) {
        var str1 = tyuusyaku.match(/接触エリア(\S+)/)
        var str = str1[1].split(';').slice(1, -1)
        if (str[1] == null) {
            str.push([0])
        }
        var w = str[0] | 0

        if (!str[2]) {
            this.touch_area_normal(event, w, str[1] | 0)
        }
        else {
            if (!str[3]) {
                this.touch_area(event, w, 0)
            }
            else {
                if (str[4]) {
                    this.touch_area(event, w, str[3] | 0, str[4] | 0)
                }
                else {
                    this.touch_area(event, w, str[3] | 0)
                }
            }
        }
    }
}

Game_Player.prototype.touch_area_normal = function (event, w, type) {
    if (type == 1) {
        for (var x = (event.x - w); x <= (event.x + w); x++) {
            for (var y = (event.y - w); y <= (event.y + w); y++) {
                if (x < $gameMap.width() && y < $gameMap.height()) {
                    temp.event_touch_area[x] = temp.event_touch_area[x] || []
                    temp.event_touch_area[x][y] = [event.x, event.y, event._trigger]
                }
            }
        }
    }
    else {
        for (var x = (event.x - w); x <= (event.x + w); x++) {
            var d = Math.abs(event.x - x)
            for (var y = (event.y - w + d); y <= (event.y + w - d); y++) {
                if (x < $gameMap.width() && y < $gameMap.height()) {
                    temp.event_touch_area[x] = temp.event_touch_area[x] || []
                    temp.event_touch_area[x][y] = [event.x, event.y, event._trigger]
                }
            }
        }
    }
}

Game_Player.prototype.touch_area = function (event, w, behind, side) {
    side = side || 0
    var d = event.direction()
    switch (d) {
        case 2:
            this.touch_area_2(event, w, behind, side)
            break
        case 4:
            this.touch_area_4(event, w, behind, side)
            break
        case 6:
            this.touch_area_6(event, w, behind, side)
            break
        case 8:
            this.touch_area_8(event, w, behind, side)
            break
    }
}

Game_Player.prototype.touch_area_2 = function (event, w, behind, side) {
    var t = w
    for (var y = event.y; y <= (event.y + w); y++) {
        for (var x = (event.x - w + t); x <= (event.x + w - t); x++) {
            if (x < $gameMap.width() && y < $gameMap.height()) {
                if (behind > 0) {
                    for (var b = 0; b <= behind; b++) {
                        var break_flag = false
                        if (side > 0 && x > event.x) {
                            for (var s = 1; s <= side; s++) {
                                if ((x - s) <= event.x) {
                                    continue
                                }
                                if (!$gameMap.isPassable(x - s, y - b, 6)) {
                                    break_flag = true
                                }
                            }
                        }
                        else if (side > 0 && x < event.x) {
                            for (var s = 1; s <= side; s++) {
                                if ((x + s) >= event.x) {
                                    continue
                                }
                                if (!$gameMap.isPassable(x + s, y - b, 6)) {
                                    break_flag = true
                                }
                            }
                        }
                        if (break_flag) {
                            break
                        }
                        if (!$gameMap.isPassable(x, y - b, 2)) {
                            break
                        }
                        if (b == behind) {
                            temp.event_touch_area[x] = temp.event_touch_area[x] || []
                            temp.event_touch_area[x][y] = [event.x, event.y, event._trigger]
                        }
                    }
                }
                else {
                    temp.event_touch_area[x] = temp.event_touch_area[x] || []
                    temp.event_touch_area[x][y] = [event.x, event.y, event._trigger]
                }
            }
        }
        t -= 1
    }
}

Game_Player.prototype.touch_area_4 = function (event, w, behind, side) {
    var t = 0
    for (var x = (event.x - w); x <= event.x; x++) {
        for (var y = (event.y - w + t); y <= (event.y + w - t); y++) {
            if (x < $gameMap.width() && y < $gameMap.height()) {
                if (behind > 0) {
                    for (var b = 0; b <= behind; b++) {
                        var break_flag = false
                        if (side > 0 && y > event.y) {
                            for (var s = 1; s <= side; s++) {
                                if ((y - s) <= event.y) {
                                    continue
                                }
                                if (!$gameMap.isPassable(x + b, y - s, 6)) {
                                    break_flag = true
                                }
                            }
                        }
                        else if (side > 0 && y < event.y) {
                            for (var s = 1; s <= side; s++) {
                                if ((y + s) >= event.y) {
                                    continue
                                }
                                if (!$gameMap.isPassable(x + b, y + s, 6)) {
                                    break_flag = true
                                }
                            }
                        }
                        if (break_flag) {
                            break
                        }
                        if (!$gameMap.isPassable(x + b, y, 4)) {
                            break
                        }
                        if (b == behind) {
                            temp.event_touch_area[x] = temp.event_touch_area[x] || []
                            temp.event_touch_area[x][y] = [event.x, event.y, event._trigger]
                        }
                    }
                }
                else {
                    temp.event_touch_area[x] = temp.event_touch_area[x] || []
                    temp.event_touch_area[x][y] = [event.x, event.y, event._trigger]
                }
            }
        }
        t += 1
    }
}

Game_Player.prototype.touch_area_6 = function (event, w, behind, side) {
    var t = w
    for (var x = event.x; x <= (event.x + w); x++) {
        for (var y = (event.y - w + t); y <= (event.y + w - t); y++) {
            if (x < $gameMap.width() && y < $gameMap.height()) {
                if (behind > 0) {
                    for (var b = 0; b <= behind; b++) {
                        var break_flag = false
                        if (side > 0 && y > event.y) {
                            for (var s = 1; s <= side; s++) {
                                if ((y - s) <= event.y) {
                                    continue
                                }
                                if (!$gameMap.isPassable(x - b, y - s, 6)) {
                                    break_flag = true
                                }
                            }
                        }
                        else if (side > 0 && y < event.y) {
                            for (var s = 1; s <= side; s++) {
                                if ((y + s) >= event.y) {
                                    continue
                                }
                                if (!$gameMap.isPassable(x - b, y + s, 6)) {
                                    break_flag = true
                                }
                            }
                        }
                        if (break_flag) {
                            break
                        }
                        if (!$gameMap.isPassable(x - b, y, 6)) {
                            break
                        }
                        if (b == behind) {
                            temp.event_touch_area[x] = temp.event_touch_area[x] || []
                            temp.event_touch_area[x][y] = [event.x, event.y, event._trigger]
                        }
                    }
                }
                else {
                    temp.event_touch_area[x] = temp.event_touch_area[x] || []
                    temp.event_touch_area[x][y] = [event.x, event.y, event._trigger]
                }
            }
        }
        t -= 1
    }
}

Game_Player.prototype.touch_area_8 = function (event, w, behind, side) {
    var t = 0
    for (var y = (event.y - w); y <= event.y; y++) {
        for (var x = (event.x - w + t); x <= (event.x + w - t); x++) {
            if (x < $gameMap.width() && y < $gameMap.height()) {
                if (behind > 0) {
                    for (var b = 0; b <= behind; b++) {
                        var break_flag = false
                        if (side > 0 && x > event.x) {
                            for (var s = 1; s <= side; s++) {
                                if ((x - s) <= event.x) {
                                    continue
                                }
                                if (!$gameMap.isPassable(x - s, y + b, 6)) {
                                    break_flag = true
                                }
                            }
                        }
                        else if (side > 0 && x < event.x) {
                            for (var s = 1; s <= side; s++) {
                                if ((x + s) >= event.x) {
                                    continue
                                }
                                if (!$gameMap.isPassable(x + s, y + b, 6)) {
                                    break_flag = true
                                }
                            }
                        }
                        if (break_flag) {
                            break
                        }
                        if (!$gameMap.isPassable(x, y + b, 8)) {
                            break
                        }
                        if (b == behind) {
                            temp.event_touch_area[x] = temp.event_touch_area[x] || []
                            temp.event_touch_area[x][y] = [event.x, event.y, event._trigger]
                        }
                    }
                }
                else {
                    temp.event_touch_area[x] = temp.event_touch_area[x] || []
                    temp.event_touch_area[x][y] = [event.x, event.y, event._trigger]
                }
            }
        }
        t += 1
    }
}