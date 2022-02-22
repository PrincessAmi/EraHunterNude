//=============================================================================
// MEGA_SDS.js
// 距離によるセルフスイッチ自動切り替え
//=============================================================================

/*:
* @plugindesc SDS detect
*
*/

var sdsMV = {}

Game_Event.prototype.get_distance_switches_conf = function () {
    var match = $dataMap.events[this._eventId].name.match(/SDS:<(.*)>/)
    var result = []
    if (match) {
        var _this = this
        match[1].split(',').forEach(function (split_data) {
            result.push(_this.get_distance_switch_data(split_data))
        })
    }
    return result
}

Game_Event.prototype.get_distance_switch_data = function (split_data) {
    var option = 0
    if (~split_data.indexOf('-r')) {
        option += 1
        split_data = split_data.replace('-r', '')
    }
    if (~split_data.indexOf('-o')) {
        option += 2
        split_data = split_data.replace('-o', '')
    }
    return [split_data | 0, option]
}

Game_Event.prototype.SELF_KEY = ['A', 'B', 'C', 'D']

sdsMV.refresh = Game_Event.prototype.refresh
Game_Event.prototype.refresh = function () {
    if (!this.switch_distances) {
        this.set_distance_switch()
    }
    sdsMV.refresh.call(this)
}

Game_Event.prototype.set_distance_switch = function () {
    this.switch_distances = this.get_distance_switches_conf()
}

sdsMV._update_distance_switch = Game_Event.prototype.update
Game_Event.prototype.update = function () {
    if (this.switch_distances.length) {
        this.update_switch()
    }
    sdsMV._update_distance_switch.call(this)
}

Game_Event.prototype.update_switch = function () {
    var distance = this.distance_from_player()
    for (var index in this.switch_distances) {
        var conf_data = this.switch_distances[index]
        if (conf_data[0] !== 0) {
            switch (conf_data[1]) {
                case 0:
                    var result = distance <= conf_data[0]
                    break;
                case 1:
                    var result = distance > conf_data[0]
                    break;
                case 2:
                    var result = distance <= conf_data[0]
                    if (!result) {
                    }
                    else {
                        break;
                    }
                case 3:
                    var result = distance > conf_data[0]
                    if (!result) {
                    }
                    else {
                        break;
                    }
            }
            $gameSelfSwitches.setValue([this._mapId, this._eventId, this.SELF_KEY[index]], result)
        }
    }
}

Game_Event.prototype.distance_from_player = function () {
    return $gameMap.distance(this.x, this.y, $gamePlayer.x, $gamePlayer.y)
}