/*:
 * @plugindesc set day or night or morning or midday
 *
 * @param morningTint
 * @default -34, -17, 10, 68
 *
 * @param middayTint
 * @default 0, 0, 0, 0
 *
 * @param eveningTint
 * @default 17, -34, -68, 17
 *
 * @param nightTint
 * @default -102, -85, 0, 170
 *
 * @param tintSpeed
 * @default 100
 *
 * @help
 * Use the following plugin command to update the screen tint immediatelly:
 *
 *   update screen tint
 * 
 * You can specify the duration of the tint effect this way:
 * 
 *   update screen tint in 20 frames
 *
 * 
 */

var Imported = Imported || {};

var changeDayAndNight = changeDayAndNight || {};

(function($) {
  "use strict";

  $.Parameters = PluginManager.parameters('changeDayAndNight');

  var p = {};
  p['morningTint'] = $.Parameters['morningTint'] || "-34, -17, 10, 68";
  p['middayTint'] = $.Parameters['middayTint'] || "0, 0, 0, 0";
  p['eveningTint'] = $.Parameters['eveningTint'] || "17, -34, -68, 17";
  p['nightTint'] = $.Parameters['nightTint'] || "-102, -85, 0, 170";
  p['tintSpeed'] = Number($.Parameters['tintSpeed'] || 0);

  $.setPeriod = function(period) {
    period = period === 'day' ? 'midday' : period;
    var data = p[period + 'Tint'];
    var tintMas = data.split(',').map(function(item) {
      return item.trim() | 0;
    })
    $gameScreen.startTint(tintMas, p['tintSpeed']);
  }
})(changeDayAndNight);

Imported["changeDayAndNight"] = 1.0;