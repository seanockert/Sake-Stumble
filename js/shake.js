// Updated Version for Phaser 1.3
// By Deesr

var __extends = this.__extends || function(d, b) {
        for (var p in b)
            if (b.hasOwnProperty(p)) d[p] = b[p];

        function __() {
            this.constructor = d;
        }
        __.prototype = b.prototype;
        d.prototype = new __();
    };
var Phaser;
(function(Phaser) {
    (function(Plugins) {
        /**
         * Phaser - Plugins - Camera FX - Shake
         *
         * A simple camera shake effect.
         */
        (function(CameraFX) {
            var Shake = (function(_super) {
                __extends(Shake, _super);

                function Shake(game, parent) {
                    _super.call(this, game, parent);
                    this._fxShakeIntensity = 0;
                    this._fxShakeDuration = 0;
                    this._fxShakeComplete = null;
                    this._fxShakeOffset = new Phaser.Point(0, 0);
                    this._fxShakeDirection = 0;
                    this._fxShakePrevX = 0;
                    this._fxShakePrevY = 0;
                    this.camera = game.camera;
                }
                /**
                 * A simple camera shake effect.
                 *
                 * @param    Intensity   Percentage of screen size representing the maximum distance that the screen can move while shaking.
                 * @param    Duration    The length in seconds that the shaking effect should last.
                 * @param    OnComplete  A function you want to run when the shake effect finishes.
                 * @param    Force       Force the effect to reset (default = true, unlike flash() and fade()!).
                 * @param    Direction   Whether to shake on both axes, just up and down, or just side to side (use class constants SHAKE_BOTH_AXES, SHAKE_VERTICAL_ONLY, or SHAKE_HORIZONTAL_ONLY).
                 */
                Shake.prototype.start = function(intensity, duration, onComplete, force, direction) {
                    if (typeof intensity === "undefined") {
                        intensity = 0.05;
                    }
                    if (typeof duration === "undefined") {
                        duration = 0.5;
                    }
                    if (typeof onComplete === "undefined") {
                        onComplete = null;
                    }
                    if (typeof force === "undefined") {
                        force = true;
                    }
                    if (typeof direction === "undefined") {
                        direction = Shake.SHAKE_BOTH_AXES;
                    }
                    if (!force && ((this._fxShakeOffset.x !== 0) || (this._fxShakeOffset.y !== 0))) {
                        return;
                    }


                    //  If a shake is not already running we need to store the offsets here
                    if (this._fxShakeOffset.x === 0 && this._fxShakeOffset.y === 0) {
                        this._fxShakePrevX = game.camera.x;
                        this._fxShakePrevY = game.camera.y;
                    }


                    this._fxShakeIntensity = intensity;
                    this._fxShakeDuration = duration;
                    this._fxShakeComplete = onComplete;
                    this._fxShakeDirection = direction;
                    this._fxShakeOffset.setTo(0, 0);
                };

                Shake.prototype.postUpdate = function() {
                    //  Update the "shake" special effect
                    if (this._fxShakeDuration > 0) {
                        
                        this._fxShakeDuration -= this.game.time.elapsed / 100;

                        if (this.game.math.roundTo(this._fxShakeDuration, -2) <= 0) {
                            this._fxShakeDuration = 0;
                            this._fxShakeOffset.setTo(0, 0);
                            game.camera.x = this._fxShakePrevX;
                            game.camera.y = this._fxShakePrevY;
                            if (this._fxShakeComplete !== null) {
                                this._fxShakeComplete();
                            }
                        } else {
                            if ((this._fxShakeDirection == Shake.SHAKE_BOTH_AXES) || (this._fxShakeDirection == Shake.SHAKE_HORIZONTAL_ONLY)) {
                                //this._fxShakeOffset.x = (this.game.rnd.integerInRange(0, 2) * this._fxShakeIntensity * game.camera.view.width * 2 - this._fxShakeIntensity * game.camera.view.width);
                                this._fxShakeOffset.x = (this.game.rnd.integerInRange(0, this._fxShakeIntensity) );
                            }

                            if ((this._fxShakeDirection == Shake.SHAKE_BOTH_AXES) || (this._fxShakeDirection == Shake.SHAKE_VERTICAL_ONLY)) {
                                this._fxShakeOffset.y = (this.game.rnd.integerInRange(0, this._fxShakeIntensity) );
                                //this._fxShakeOffset.y = (this.game.rnd.integerInRange(0, 2) * this._fxShakeIntensity * game.camera.view.height * 2 - this._fxShakeIntensity * game.camera.view.height);
                            }
                        }

                    }


                };

                Shake.prototype.render = function() {
                    if ((this._fxShakeOffset.x !== 0) || (this._fxShakeOffset.y !== 0)) {
                        game.camera.x = this._fxShakePrevX + this._fxShakeOffset.x;
                        game.camera.y = this._fxShakePrevY + this._fxShakeOffset.y;
                    }
                };
                Shake.SHAKE_BOTH_AXES = 0;
                Shake.SHAKE_HORIZONTAL_ONLY = 1;
                Shake.SHAKE_VERTICAL_ONLY = 2;

                return Shake;
            })(Phaser.Plugin);

            CameraFX.Shake = Shake;
        })(Plugins.CameraFX || (Plugins.CameraFX = {}));
        var CameraFX = Plugins.CameraFX;
    })(Phaser.Plugins || (Phaser.Plugins = {}));
    var Plugins = Phaser.Plugins;
})(Phaser || (Phaser = {}));