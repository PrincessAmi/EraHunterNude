//=============================================================================
// MEGA_fix_null_bitmap.js
//=============================================================================

/*:
* @plugindesc Fix crash with null bitmap
*
*/

(function() {
    var tempOnBitMapLoad = Sprite.prototype._onBitmapLoad
    Sprite.prototype._onBitmapLoad = function () {
        if(!this._bitmap) {
            return this._refresh()
        }
        tempOnBitMapLoad.call(this)
    }
  
})()