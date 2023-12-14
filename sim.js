/// <reference path="../node_modules/pxt-core/built/pxtsim.d.ts"/>
/// <reference path="../libs/core/dal.d.ts"/>
/// <reference path="../libs/core/enums.d.ts"/>
var pxsim;
(function (pxsim) {
    class DalBoard extends pxsim.CoreBoard {
        constructor() {
            super();
            this.speakerEnabled = true;
            // board hardware version
            this.hardwareVersion = 1;
            // components
            this.lightState = {};
            this.fileSystem = new pxsim.FileSystemState();
            this.controlMessageState = new pxsim.ControlMessageState(this);
            this.builtinParts["ledmatrix"] = this.ledMatrixState = new pxsim.LedMatrixState(pxsim.runtime);
            this.builtinParts["buttonpair"] = this.buttonPairState = new pxsim.ButtonPairState({
                ID_BUTTON_A: 1 /* MICROBIT_ID_BUTTON_A */,
                ID_BUTTON_B: 2 /* MICROBIT_ID_BUTTON_B */,
                ID_BUTTON_AB: 3 /* MICROBIT_ID_BUTTON_AB */,
                BUTTON_EVT_UP: 2 /* MICROBIT_BUTTON_EVT_UP */,
                BUTTON_EVT_CLICK: 3 /* MICROBIT_BUTTON_EVT_CLICK */
            });
            this.builtinParts["edgeconnector"] = this.edgeConnectorState = new pxsim.EdgeConnectorState({
                pins: [
                    100 /* MICROBIT_ID_IO_P0 */,
                    101 /* MICROBIT_ID_IO_P1 */,
                    102 /* MICROBIT_ID_IO_P2 */,
                    103 /* MICROBIT_ID_IO_P3 */,
                    121 /* MICROBIT_ID_LOGO */,
                    104 /* MICROBIT_ID_IO_P4 */,
                    105 /* MICROBIT_ID_IO_P5 */,
                    106 /* MICROBIT_ID_IO_P6 */,
                    107 /* MICROBIT_ID_IO_P7 */,
                    108 /* MICROBIT_ID_IO_P8 */,
                    109 /* MICROBIT_ID_IO_P9 */,
                    110 /* MICROBIT_ID_IO_P10 */,
                    111 /* MICROBIT_ID_IO_P11 */,
                    112 /* MICROBIT_ID_IO_P12 */,
                    113 /* MICROBIT_ID_IO_P13 */,
                    114 /* MICROBIT_ID_IO_P14 */,
                    115 /* MICROBIT_ID_IO_P15 */,
                    116 /* MICROBIT_ID_IO_A1_RX */,
                    0,
                    0,
                    119 /* MICROBIT_ID_IO_A0_SCL */,
                    120 /* MICROBIT_ID_IO_A0_SDA */
                ],
                servos: {
                    "P0": 100 /* MICROBIT_ID_IO_P0 */,
                    "P1": 101 /* MICROBIT_ID_IO_P1 */,
                    "P2": 102 /* MICROBIT_ID_IO_P2 */,
                    "P3": 103 /* MICROBIT_ID_IO_P3 */
                }
            });
            this.builtinParts["radio"] = this.radioState = new pxsim.RadioState(pxsim.runtime, this, {
                ID_RADIO: 9 /* MICROBIT_ID_RADIO */,
                RADIO_EVT_DATAGRAM: 1 /* MICROBIT_RADIO_EVT_DATAGRAM */
            });
            this.builtinParts["microphone"] = this.microphoneState = new pxsim.MicrophoneState(3001 /* DEVICE_ID_MICROPHONE */, 0, 255, 75, 180);
            this.builtinParts["recording"] = this.recordingState = new pxsim.RecordingState();
            this.builtinParts["accelerometer"] = this.accelerometerState = new pxsim.AccelerometerState(pxsim.runtime);
            this.builtinParts["serial"] = this.serialState = new pxsim.SerialState(pxsim.runtime, this);
            this.builtinParts["thermometer"] = this.thermometerState = new pxsim.ThermometerState();
            this.builtinParts["lightsensor"] = this.lightSensorState = new pxsim.LightSensorState();
            this.builtinParts["compass"] = this.compassState = new pxsim.CompassState();
            this.builtinParts["speaker"] = this.speakerState = new pxsim.SpeakerState();
            this.builtinParts["microservo"] = this.edgeConnectorState;
            this.builtinParts["logotouch"] = this.logoTouch = new pxsim.Button(121 /* MICROBIT_ID_LOGO */);
            this.builtinVisuals["buttonpair"] = () => new pxsim.visuals.ButtonPairView();
            this.builtinVisuals["ledmatrix"] = () => new pxsim.visuals.LedMatrixView();
            this.builtinVisuals["microservo"] = () => new pxsim.visuals.MicroServoView();
            this.builtinParts["neopixel"] = (pin) => { return this.neopixelState(pin.id); };
            this.builtinVisuals["neopixel"] = () => new pxsim.visuals.NeoPixelView(pxsim.parsePinString);
            this.builtinPartVisuals["neopixel"] = (xy) => pxsim.visuals.mkNeoPixelPart(xy);
            this.builtinPartVisuals["buttonpair"] = (xy) => pxsim.visuals.mkBtnSvg(xy);
            this.builtinPartVisuals["ledmatrix"] = (xy) => pxsim.visuals.mkLedMatrixSvg(xy, 8, 8);
            this.builtinPartVisuals["microservo"] = (xy) => pxsim.visuals.mkMicroServoPart(xy);
        }
        ensureHardwareVersion(version) {
            if (version > this.hardwareVersion) {
                this.hardwareVersion = version;
                this.updateView();
            }
        }
        initAsync(msg) {
            super.initAsync(msg);
            // console.log('SIM MESSAGE',msg)
            if (msg.dependencies.v3 != undefined) {
                console.log('V3 SIMULATOR');
                this.hardwareVersion = 3;
            }
            else {
                console.log('V1 SIMULATOR');
                this.hardwareVersion = 1;
            }
            const boardDef = msg.boardDefinition;
            const cmpsList = msg.parts;
            const cmpDefs = msg.partDefinitions || {};
            const fnArgs = msg.fnArgs;
            // const v2Parts: pxt.Map<boolean> = {
            //     "microphone": true,
            //     "logotouch": true,
            //     "builtinspeaker": true,
            //     "v2": true
            // };
            // if (msg.builtinParts) {
            //     const v2PartsUsed = msg.builtinParts.filter(k => v2Parts[k])
            //     if (v2PartsUsed.length) {
            //         console.log(`detected v2 feature`, v2PartsUsed);
            //         cmpsList.push(...v2PartsUsed);
            //         this.hardwareVersion = 2;
            //     }
            // }
            const opts = {
                state: this,
                boardDef: boardDef,
                partsList: cmpsList,
                partDefs: cmpDefs,
                fnArgs: fnArgs,
                maxWidth: "100%",
                maxHeight: "100%",
                highContrast: msg.highContrast
            };
            this.viewHost = new pxsim.visuals.BoardHost(pxsim.visuals.mkBoardView({
                visual: boardDef.visual,
                boardDef: boardDef,
                highContrast: msg.highContrast
            }), opts);
            document.body.innerHTML = ""; // clear children
            document.body.appendChild(this.view = this.viewHost.getView());
            if (pxsim.shouldShowMute()) {
                document.body.appendChild(pxsim.createMuteButton());
                pxsim.AudioContextManager.mute(true);
                pxsim.setParentMuteState("disabled");
            }
            // if (msg.theme === "mbcodal") {
            //     this.ensureHardwareVersion(2);
            // }
            return Promise.resolve();
        }
        tryGetNeopixelState(pinId) {
            return this.lightState[pinId];
        }
        neopixelState(pinId) {
            if (pinId === undefined) {
                pinId = 100 /* MICROBIT_ID_IO_P0 */;
            }
            let state = this.lightState[pinId];
            if (!state)
                state = this.lightState[pinId] = new pxsim.CommonNeoPixelState();
            return state;
        }
        screenshotAsync(width) {
            return this.viewHost.screenshotAsync(width);
        }
    }
    pxsim.DalBoard = DalBoard;
    function initRuntimeWithDalBoard() {
        pxsim.U.assert(!pxsim.runtime.board);
        let b = new DalBoard();
        pxsim.runtime.board = b;
        pxsim.runtime.postError = (e) => {
            pxsim.led.setBrightness(255);
            let img = board().ledMatrixState.image;
            img.clear();
            img.set(0, 4, 255);
            img.set(1, 3, 255);
            img.set(2, 3, 255);
            img.set(3, 3, 255);
            img.set(4, 4, 255);
            img.set(0, 0, 255);
            img.set(1, 0, 255);
            img.set(0, 1, 255);
            img.set(1, 1, 255);
            img.set(3, 0, 255);
            img.set(4, 0, 255);
            img.set(3, 1, 255);
            img.set(4, 1, 255);
            pxsim.runtime.updateDisplay();
        };
    }
    pxsim.initRuntimeWithDalBoard = initRuntimeWithDalBoard;
    if (!pxsim.initCurrentRuntime) {
        pxsim.initCurrentRuntime = initRuntimeWithDalBoard;
    }
    function board() {
        return pxsim.runtime.board;
    }
    pxsim.board = board;
    function parsePinString(gpioPin) {
        if (gpioPin == "*")
            return board().edgeConnectorState.getPin(100 /* MICROBIT_ID_IO_P0 */);
        const m = /^(Analog|Digital)Pin\.P(\d)+/.exec(gpioPin);
        if (!m)
            return undefined;
        const pinNum = parseInt(m[2]);
        return board().edgeConnectorState.pins[pinNum];
    }
    pxsim.parsePinString = parsePinString;
})(pxsim || (pxsim = {}));
var pxsim;
(function (pxsim) {
    var input;
    (function (input) {
        function accForGesture(gesture) {
            let b = pxsim.board().accelerometerState;
            b.accelerometer.activate();
            if (gesture == 11 && !b.useShake) { // SHAKE
                b.useShake = true;
                pxsim.runtime.queueDisplayUpdate();
            }
            return b;
        }
        function onGesture(gesture, handler) {
            const b = accForGesture(gesture);
            pxsim.pxtcore.registerWithDal(13 /* MICROBIT_ID_GESTURE */, gesture, handler);
        }
        input.onGesture = onGesture;
        function isGesture(gesture) {
            const b = accForGesture(gesture);
            b.accelerometer.activate();
            return b.accelerometer.getGesture() == gesture;
        }
        input.isGesture = isGesture;
        function acceleration(dimension) {
            let b = pxsim.board().accelerometerState;
            let acc = b.accelerometer;
            switch (dimension) {
                case 0:
                    acc.activate(pxsim.AccelerometerFlag.X);
                    return acc.getX();
                case 1:
                    acc.activate(pxsim.AccelerometerFlag.Y);
                    return acc.getY();
                case 2:
                    acc.activate(pxsim.AccelerometerFlag.Z);
                    return acc.getZ();
                default:
                    acc.activate(pxsim.AccelerometerFlag.Strength);
                    return acc.getStrength();
            }
        }
        input.acceleration = acceleration;
        function rotation(kind) {
            const b = pxsim.board().accelerometerState;
            const acc = b.accelerometer;
            switch (kind) {
                case 0: {
                    acc.activate(pxsim.AccelerometerFlag.Pitch);
                    return acc.getPitch();
                }
                case 1: {
                    acc.activate(pxsim.AccelerometerFlag.Roll);
                    return acc.getRoll();
                }
                default: return 0;
            }
        }
        input.rotation = rotation;
        function setAccelerometerRange(range) {
            let b = pxsim.board().accelerometerState;
            b.accelerometer.setSampleRange(range);
        }
        input.setAccelerometerRange = setAccelerometerRange;
    })(input = pxsim.input || (pxsim.input = {}));
})(pxsim || (pxsim = {}));
(function (pxsim) {
    /**
      * Co-ordinate systems that can be used.
      * RAW: Unaltered data. Data will be returned directly from the accelerometer.
      *
      * SIMPLE_CARTESIAN: Data will be returned based on an easy to understand alignment, consistent with the cartesian system taught in schools.
      * When held upright, facing the user:
      *
      *                            /
      *    +--------------------+ z
      *    |                    |
      *    |       .....        |
      *    | *     .....      * |
      * ^  |       .....        |
      * |  |                    |
      * y  +--------------------+  x-->
      *
      *
      * NORTH_EAST_DOWN: Data will be returned based on the industry convention of the North East Down (NED) system.
      * When held upright, facing the user:
      *
      *                            z
      *    +--------------------+ /
      *    |                    |
      *    |       .....        |
      *    | *     .....      * |
      * ^  |       .....        |
      * |  |                    |
      * x  +--------------------+  y-->
      *
      */
    let MicroBitCoordinateSystem;
    (function (MicroBitCoordinateSystem) {
        MicroBitCoordinateSystem[MicroBitCoordinateSystem["RAW"] = 0] = "RAW";
        MicroBitCoordinateSystem[MicroBitCoordinateSystem["SIMPLE_CARTESIAN"] = 1] = "SIMPLE_CARTESIAN";
        MicroBitCoordinateSystem[MicroBitCoordinateSystem["NORTH_EAST_DOWN"] = 2] = "NORTH_EAST_DOWN";
    })(MicroBitCoordinateSystem = pxsim.MicroBitCoordinateSystem || (pxsim.MicroBitCoordinateSystem = {}));
    let AccelerometerFlag;
    (function (AccelerometerFlag) {
        AccelerometerFlag[AccelerometerFlag["X"] = 1] = "X";
        AccelerometerFlag[AccelerometerFlag["Y"] = 2] = "Y";
        AccelerometerFlag[AccelerometerFlag["Z"] = 4] = "Z";
        AccelerometerFlag[AccelerometerFlag["Strength"] = 8] = "Strength";
        AccelerometerFlag[AccelerometerFlag["Pitch"] = 16] = "Pitch";
        AccelerometerFlag[AccelerometerFlag["Roll"] = 32] = "Roll";
    })(AccelerometerFlag = pxsim.AccelerometerFlag || (pxsim.AccelerometerFlag = {}));
    class Accelerometer {
        constructor(runtime) {
            this.runtime = runtime;
            this.sigma = 0; // the number of ticks that the instantaneous gesture has been stable.
            this.lastGesture = 0; // the last, stable gesture recorded.
            this.currentGesture = 0; // the instantaneous, unfiltered gesture detected.
            this.sample = { x: 0, y: 0, z: -1023 };
            this.shake = { x: false, y: false, z: false, count: 0, shaken: 0, timer: 0 }; // State information needed to detect shake events.
            this.isActive = false;
            this.sampleRange = 2;
            this.flags = 0;
            this.id = 5 /* MICROBIT_ID_ACCELEROMETER */;
        }
        setSampleRange(range) {
            this.activate();
            this.sampleRange = Math.max(1, Math.min(8, range));
        }
        activate(flags) {
            if (!this.isActive) {
                this.isActive = true;
                this.runtime.queueDisplayUpdate();
            }
            if (!!flags)
                this.flags |= flags;
        }
        /**
         * Reads the acceleration data from the accelerometer, and stores it in our buffer.
         * This is called by the tick() member function, if the interrupt is set!
         */
        update(x, y, z) {
            // read MSB values...
            this.sample.x = Math.floor(x);
            this.sample.y = Math.floor(y);
            this.sample.z = Math.floor(z);
            // Update gesture tracking
            this.updateGesture();
            // Indicate that a new sample is available
            pxsim.board().bus.queue(this.id, 1 /* MICROBIT_ACCELEROMETER_EVT_DATA_UPDATE */);
        }
        getStrength() {
            return Math.floor(Math.sqrt(this.instantaneousAccelerationSquared()));
        }
        updateEnvironmentGlobals() {
            // update debugger
            if (this.isActive) {
                if (this.flags & AccelerometerFlag.X)
                    this.runtime.environmentGlobals[pxsim.localization.lf("acceleration.x")] = this.sample.x;
                if (this.flags & AccelerometerFlag.Y)
                    this.runtime.environmentGlobals[pxsim.localization.lf("acceleration.y")] = this.sample.y;
                if (this.flags & AccelerometerFlag.Z)
                    this.runtime.environmentGlobals[pxsim.localization.lf("acceleration.z")] = this.sample.z;
                if (this.flags & AccelerometerFlag.Strength)
                    this.runtime.environmentGlobals[pxsim.localization.lf("acceleration.strength")] = Math.sqrt(this.instantaneousAccelerationSquared());
                if (this.flags & AccelerometerFlag.Pitch)
                    this.runtime.environmentGlobals[pxsim.localization.lf("acceleration.pitch")] = this.getPitch();
                if (this.flags & AccelerometerFlag.Roll)
                    this.runtime.environmentGlobals[pxsim.localization.lf("acceleration.roll")] = this.getRoll();
            }
        }
        instantaneousAccelerationSquared() {
            // Use pythagoras theorem to determine the combined force acting on the device.
            return this.sample.x * this.sample.x + this.sample.y * this.sample.y + this.sample.z * this.sample.z;
        }
        /**
         * Service function. Determines the best guess posture of the device based on instantaneous data.
         * This makes no use of historic data (except for shake), and forms this input to the filter implemented in updateGesture().
         *
         * @return A best guess of the current posture of the device, based on instantaneous data.
         */
        instantaneousPosture() {
            let force = this.instantaneousAccelerationSquared();
            let shakeDetected = false;
            // Test for shake events.
            // We detect a shake by measuring zero crossings in each axis. In other words, if we see a strong acceleration to the left followed by
            // a string acceleration to the right, then we can infer a shake. Similarly, we can do this for each acxis (left/right, up/down, in/out).
            //
            // If we see enough zero crossings in succession (MICROBIT_ACCELEROMETER_SHAKE_COUNT_THRESHOLD), then we decide that the device
            // has been shaken.
            if ((this.getX() < -400 /* MICROBIT_ACCELEROMETER_SHAKE_TOLERANCE */ && this.shake.x) || (this.getX() > 400 /* MICROBIT_ACCELEROMETER_SHAKE_TOLERANCE */ && !this.shake.x)) {
                shakeDetected = true;
                this.shake.x = !this.shake.x;
            }
            if ((this.getY() < -400 /* MICROBIT_ACCELEROMETER_SHAKE_TOLERANCE */ && this.shake.y) || (this.getY() > 400 /* MICROBIT_ACCELEROMETER_SHAKE_TOLERANCE */ && !this.shake.y)) {
                shakeDetected = true;
                this.shake.y = !this.shake.y;
            }
            if ((this.getZ() < -400 /* MICROBIT_ACCELEROMETER_SHAKE_TOLERANCE */ && this.shake.z) || (this.getZ() > 400 /* MICROBIT_ACCELEROMETER_SHAKE_TOLERANCE */ && !this.shake.z)) {
                shakeDetected = true;
                this.shake.z = !this.shake.z;
            }
            if (shakeDetected && this.shake.count < 4 /* MICROBIT_ACCELEROMETER_SHAKE_COUNT_THRESHOLD */ && ++this.shake.count == 4 /* MICROBIT_ACCELEROMETER_SHAKE_COUNT_THRESHOLD */)
                this.shake.shaken = 1;
            if (++this.shake.timer >= 10 /* MICROBIT_ACCELEROMETER_SHAKE_DAMPING */) {
                this.shake.timer = 0;
                if (this.shake.count > 0) {
                    if (--this.shake.count == 0)
                        this.shake.shaken = 0;
                }
            }
            if (this.shake.shaken)
                return 11 /* MICROBIT_ACCELEROMETER_EVT_SHAKE */;
            let sq = (n) => n * n;
            if (force < sq(400 /* MICROBIT_ACCELEROMETER_FREEFALL_TOLERANCE */))
                return 7 /* MICROBIT_ACCELEROMETER_EVT_FREEFALL */;
            if (force > sq(3072 /* MICROBIT_ACCELEROMETER_3G_TOLERANCE */))
                return 8 /* MICROBIT_ACCELEROMETER_EVT_3G */;
            if (force > sq(6144 /* MICROBIT_ACCELEROMETER_6G_TOLERANCE */))
                return 9 /* MICROBIT_ACCELEROMETER_EVT_6G */;
            if (force > sq(8192 /* MICROBIT_ACCELEROMETER_8G_TOLERANCE */))
                return 10 /* MICROBIT_ACCELEROMETER_EVT_8G */;
            // Determine our posture.
            if (this.getX() < (-1000 + 200 /* MICROBIT_ACCELEROMETER_TILT_TOLERANCE */))
                return 3 /* MICROBIT_ACCELEROMETER_EVT_TILT_LEFT */;
            if (this.getX() > (1000 - 200 /* MICROBIT_ACCELEROMETER_TILT_TOLERANCE */))
                return 4 /* MICROBIT_ACCELEROMETER_EVT_TILT_RIGHT */;
            if (this.getY() < (-1000 + 200 /* MICROBIT_ACCELEROMETER_TILT_TOLERANCE */))
                return 2 /* MICROBIT_ACCELEROMETER_EVT_TILT_DOWN */;
            if (this.getY() > (1000 - 200 /* MICROBIT_ACCELEROMETER_TILT_TOLERANCE */))
                return 1 /* MICROBIT_ACCELEROMETER_EVT_TILT_UP */;
            if (this.getZ() < (-1000 + 200 /* MICROBIT_ACCELEROMETER_TILT_TOLERANCE */))
                return 5 /* MICROBIT_ACCELEROMETER_EVT_FACE_UP */;
            if (this.getZ() > (1000 - 200 /* MICROBIT_ACCELEROMETER_TILT_TOLERANCE */))
                return 6 /* MICROBIT_ACCELEROMETER_EVT_FACE_DOWN */;
            return 0;
        }
        updateGesture() {
            // Determine what it looks like we're doing based on the latest sample...
            let g = this.instantaneousPosture();
            // Perform some low pass filtering to reduce jitter from any detected effects
            if (g != this.currentGesture) {
                this.currentGesture = g;
                this.sigma = 0;
            }
            else if (this.sigma < 5 /* MICROBIT_ACCELEROMETER_GESTURE_DAMPING */) {
                ++this.sigma;
            }
            if (this.currentGesture !== this.lastGesture && this.sigma >= 5 /* MICROBIT_ACCELEROMETER_GESTURE_DAMPING */) {
                this.enqueueCurrentGesture();
            }
        }
        forceGesture(gesture) {
            this.currentGesture = gesture;
            this.enqueueCurrentGesture();
        }
        enqueueCurrentGesture() {
            this.lastGesture = this.currentGesture;
            pxsim.board().bus.queue(13 /* MICROBIT_ID_GESTURE */, this.lastGesture);
        }
        /**
          * Reads the X axis value of the latest update from the accelerometer.
          * @param system The coordinate system to use. By default, a simple cartesian system is provided.
          * @return The force measured in the X axis, in milli-g.
          *
          * Example:
          * @code
          * uBit.accelerometer.getX();
          * uBit.accelerometer.getX(RAW);
          * @endcode
          */
        getX(system = MicroBitCoordinateSystem.SIMPLE_CARTESIAN) {
            switch (system) {
                case MicroBitCoordinateSystem.SIMPLE_CARTESIAN:
                    return -this.sample.x;
                case MicroBitCoordinateSystem.NORTH_EAST_DOWN:
                    return this.sample.y;
                //case MicroBitCoordinateSystem.SIMPLE_CARTESIAN.RAW:
                default:
                    return this.sample.x;
            }
        }
        /**
          * Reads the Y axis value of the latest update from the accelerometer.
          * @param system The coordinate system to use. By default, a simple cartesian system is provided.
          * @return The force measured in the Y axis, in milli-g.
          *
          * Example:
          * @code
          * uBit.accelerometer.getY();
          * uBit.accelerometer.getY(RAW);
          * @endcode
          */
        getY(system = MicroBitCoordinateSystem.SIMPLE_CARTESIAN) {
            switch (system) {
                case MicroBitCoordinateSystem.SIMPLE_CARTESIAN:
                    return -this.sample.y;
                case MicroBitCoordinateSystem.NORTH_EAST_DOWN:
                    return -this.sample.x;
                //case RAW:
                default:
                    return this.sample.y;
            }
        }
        /**
          * Reads the Z axis value of the latest update from the accelerometer.
          * @param system The coordinate system to use. By default, a simple cartesian system is provided.
          * @return The force measured in the Z axis, in milli-g.
          *
          * Example:
          * @code
          * uBit.accelerometer.getZ();
          * uBit.accelerometer.getZ(RAW);
          * @endcode
          */
        getZ(system = MicroBitCoordinateSystem.SIMPLE_CARTESIAN) {
            switch (system) {
                case MicroBitCoordinateSystem.NORTH_EAST_DOWN:
                    return -this.sample.z;
                //case MicroBitCoordinateSystem.SIMPLE_CARTESIAN:
                //case MicroBitCoordinateSystem.RAW:
                default:
                    return this.sample.z;
            }
        }
        /**
          * Provides a rotation compensated pitch of the device, based on the latest update from the accelerometer.
          * @return The pitch of the device, in degrees.
          *
          * Example:
          * @code
          * uBit.accelerometer.getPitch();
          * @endcode
          */
        getPitch() {
            return Math.floor((360 * this.getPitchRadians()) / (2 * Math.PI));
        }
        getPitchRadians() {
            this.recalculatePitchRoll();
            return this.pitch;
        }
        /**
          * Provides a rotation compensated roll of the device, based on the latest update from the accelerometer.
          * @return The roll of the device, in degrees.
          *
          * Example:
          * @code
          * uBit.accelerometer.getRoll();
          * @endcode
          */
        getRoll() {
            return Math.floor((360 * this.getRollRadians()) / (2 * Math.PI));
        }
        getRollRadians() {
            this.recalculatePitchRoll();
            return this.roll;
        }
        getGesture() {
            return this.lastGesture;
        }
        /**
         * Recalculate roll and pitch values for the current sample.
         * We only do this at most once per sample, as the necessary trigonemteric functions are rather
         * heavyweight for a CPU without a floating point unit...
         */
        recalculatePitchRoll() {
            let x = this.getX(MicroBitCoordinateSystem.NORTH_EAST_DOWN);
            let y = this.getY(MicroBitCoordinateSystem.NORTH_EAST_DOWN);
            let z = this.getZ(MicroBitCoordinateSystem.NORTH_EAST_DOWN);
            this.roll = Math.atan2(y, z);
            this.pitch = Math.atan(-x / (y * Math.sin(this.roll) + z * Math.cos(this.roll)));
        }
    }
    pxsim.Accelerometer = Accelerometer;
    class AccelerometerState {
        constructor(runtime) {
            this.useShake = false;
            this.accelerometer = new Accelerometer(runtime);
        }
        shake() {
            this.accelerometer.forceGesture(11 /* MICROBIT_ACCELEROMETER_EVT_SHAKE */); // SHAKE == 11
        }
    }
    pxsim.AccelerometerState = AccelerometerState;
})(pxsim || (pxsim = {}));
var pxsim;
(function (pxsim) {
    var input;
    (function (input) {
        function onButtonEvent(button, buttonEvent, handler) {
            let b = pxsim.board().buttonPairState;
            if (button == b.props.ID_BUTTON_AB && !b.usesButtonAB) {
                b.usesButtonAB = true;
                pxsim.runtime.queueDisplayUpdate();
            }
            pxsim.pxtcore.registerWithDal(button, buttonEvent, handler);
        }
        input.onButtonEvent = onButtonEvent;
        function onButtonPressed(button, handler) {
            onButtonEvent(button, 3 /* MICROBIT_BUTTON_EVT_CLICK */, handler);
        }
        input.onButtonPressed = onButtonPressed;
        function buttonIsPressed(button) {
            let b = pxsim.board().buttonPairState;
            if (button == b.abBtn.id && !b.usesButtonAB) {
                b.usesButtonAB = true;
                pxsim.runtime.queueDisplayUpdate();
            }
            if (button == b.aBtn.id)
                return b.aBtn.pressed;
            if (button == b.bBtn.id)
                return b.bBtn.pressed;
            return b.abBtn.pressed || (b.aBtn.pressed && b.bBtn.pressed);
        }
        input.buttonIsPressed = buttonIsPressed;
    })(input = pxsim.input || (pxsim.input = {}));
})(pxsim || (pxsim = {}));
var pxsim;
(function (pxsim) {
    var visuals;
    (function (visuals) {
        function mkBtnSvg(xy) {
            let [innerCls, outerCls] = ["sim-button", "sim-button-outer"];
            const tabSize = visuals.PIN_DIST / 2.5;
            const pegR = visuals.PIN_DIST / 5;
            const btnR = visuals.PIN_DIST * .8;
            const pegMargin = visuals.PIN_DIST / 8;
            const plateR = visuals.PIN_DIST / 12;
            const pegOffset = pegMargin + pegR;
            let [x, y] = xy;
            const left = x - tabSize / 2;
            const top = y - tabSize / 2;
            const plateH = 3 * visuals.PIN_DIST - tabSize;
            const plateW = 2 * visuals.PIN_DIST + tabSize;
            const plateL = left;
            const plateT = top + tabSize;
            const btnCX = plateL + plateW / 2;
            const btnCY = plateT + plateH / 2;
            let btng = pxsim.svg.elt("g");
            //tabs
            const mkTab = (x, y) => {
                pxsim.svg.child(btng, "rect", { class: "sim-button-tab", x: x, y: y, width: tabSize, height: tabSize });
            };
            mkTab(left, top);
            mkTab(left + 2 * visuals.PIN_DIST, top);
            mkTab(left, top + 3 * visuals.PIN_DIST);
            mkTab(left + 2 * visuals.PIN_DIST, top + 3 * visuals.PIN_DIST);
            //plate
            pxsim.svg.child(btng, "rect", { class: outerCls, x: plateL, y: plateT, rx: plateR, ry: plateR, width: plateW, height: plateH });
            //pegs
            const mkPeg = (x, y) => {
                pxsim.svg.child(btng, "circle", { class: "sim-button-nut", cx: x, cy: y, r: pegR });
            };
            mkPeg(plateL + pegOffset, plateT + pegOffset);
            mkPeg(plateL + plateW - pegOffset, plateT + pegOffset);
            mkPeg(plateL + pegOffset, plateT + plateH - pegOffset);
            mkPeg(plateL + plateW - pegOffset, plateT + plateH - pegOffset);
            //inner btn
            let innerBtn = pxsim.svg.child(btng, "circle", { class: innerCls, cx: btnCX, cy: btnCY, r: btnR });
            //return
            return { el: btng, y: top, x: left, w: plateW, h: plateH + 2 * tabSize };
        }
        visuals.mkBtnSvg = mkBtnSvg;
        visuals.BUTTON_PAIR_STYLE = `
            .sim-button {
                pointer-events: none;
                fill: #000;
            }
            .sim-button-outer:active ~ .sim-button,
            .sim-button-virtual:active {
                fill: #FFA500;
            }
            .sim-button-outer {
                cursor: pointer;
                fill: #979797;
            }
            .sim-button-outer:hover {
                stroke:gray;
                stroke-width: ${visuals.PIN_DIST / 5}px;
            }
            .sim-button-nut {
                fill:#000;
                pointer-events:none;
            }
            .sim-button-nut:hover {
                stroke:${visuals.PIN_DIST / 15}px solid #704A4A;
            }
            .sim-button-tab {
                fill:#FFF;
                pointer-events:none;
            }
            .sim-button-virtual {
                cursor: pointer;
                fill: rgba(255, 255, 255, 0.6);
                stroke: rgba(255, 255, 255, 1);
                stroke-width: ${visuals.PIN_DIST / 5}px;
            }
            .sim-button-virtual:hover {
                stroke: rgba(128, 128, 128, 1);
            }
            .sim-text-virtual {
                fill: #000;
                pointer-events:none;
            }
            `;
        class ButtonPairView {
            constructor() {
                this.style = visuals.BUTTON_PAIR_STYLE;
            }
            init(bus, state) {
                this.state = state;
                this.bus = bus;
                this.defs = [];
                this.element = this.mkBtns();
                this.updateState();
                this.attachEvents();
            }
            moveToCoord(xy) {
                let btnWidth = visuals.PIN_DIST * 3;
                let [x, y] = xy;
                visuals.translateEl(this.aBtn, [x, y]);
                visuals.translateEl(this.bBtn, [x + btnWidth, y]);
                visuals.translateEl(this.abBtn, [x + visuals.PIN_DIST * 1.5, y + visuals.PIN_DIST * 4]);
            }
            updateState() {
                let stateBtns = [this.state.aBtn, this.state.bBtn, this.state.abBtn];
                let svgBtns = [this.aBtn, this.bBtn, this.abBtn];
                if (this.state.usesButtonAB && this.abBtn.style.visibility != "visible") {
                    this.abBtn.style.visibility = "visible";
                }
            }
            updateTheme() { }
            mkBtns() {
                this.aBtn = mkBtnSvg([0, 0]).el;
                this.bBtn = mkBtnSvg([0, 0]).el;
                const mkVirtualBtn = () => {
                    const numPins = 2;
                    const w = visuals.PIN_DIST * 2.8;
                    const offset = (w - (numPins * visuals.PIN_DIST)) / 2;
                    const corner = visuals.PIN_DIST / 2;
                    const cx = 0 - offset + w / 2;
                    const cy = cx;
                    const txtSize = visuals.PIN_DIST * 1.3;
                    const x = -offset;
                    const y = -offset;
                    const txtXOff = visuals.PIN_DIST / 7;
                    const txtYOff = visuals.PIN_DIST / 10;
                    let btng = pxsim.svg.elt("g");
                    let btn = pxsim.svg.child(btng, "rect", { class: "sim-button-virtual", x: x, y: y, rx: corner, ry: corner, width: w, height: w });
                    let btnTxt = visuals.mkTxt(cx + txtXOff, cy + txtYOff, txtSize, 0, "A+B");
                    pxsim.U.addClass(btnTxt, "sim-text");
                    pxsim.U.addClass(btnTxt, "sim-text-virtual");
                    btng.appendChild(btnTxt);
                    return btng;
                };
                this.abBtn = mkVirtualBtn();
                this.abBtn.style.visibility = "hidden";
                let el = pxsim.svg.elt("g");
                pxsim.U.addClass(el, "sim-buttonpair");
                el.appendChild(this.aBtn);
                el.appendChild(this.bBtn);
                el.appendChild(this.abBtn);
                return el;
            }
            attachEvents() {
                let btnStates = [this.state.aBtn, this.state.bBtn];
                let btnSvgs = [this.aBtn, this.bBtn];
                btnSvgs.forEach((btn, index) => {
                    pxsim.pointerEvents.down.forEach(evid => btn.addEventListener(evid, ev => {
                        btnStates[index].pressed = true;
                    }));
                    btn.addEventListener(pxsim.pointerEvents.leave, ev => {
                        btnStates[index].pressed = false;
                    });
                    btn.addEventListener(pxsim.pointerEvents.up, ev => {
                        btnStates[index].pressed = false;
                        this.bus.queue(btnStates[index].id, this.state.props.BUTTON_EVT_UP);
                        this.bus.queue(btnStates[index].id, this.state.props.BUTTON_EVT_CLICK);
                    });
                });
                let updateBtns = (s) => {
                    btnStates.forEach(b => b.pressed = s);
                };
                pxsim.pointerEvents.down.forEach(evid => this.abBtn.addEventListener(evid, ev => {
                    updateBtns(true);
                }));
                this.abBtn.addEventListener(pxsim.pointerEvents.leave, ev => {
                    updateBtns(false);
                });
                this.abBtn.addEventListener(pxsim.pointerEvents.up, ev => {
                    updateBtns(false);
                    this.bus.queue(this.state.abBtn.id, this.state.props.BUTTON_EVT_UP);
                    this.bus.queue(this.state.abBtn.id, this.state.props.BUTTON_EVT_CLICK);
                });
            }
        }
        visuals.ButtonPairView = ButtonPairView;
    })(visuals = pxsim.visuals || (pxsim.visuals = {}));
})(pxsim || (pxsim = {}));
var pxsim;
(function (pxsim) {
    var input;
    (function (input) {
        function compassHeading() {
            let b = pxsim.board().compassState;
            if (!b.usesHeading) {
                b.usesHeading = true;
                pxsim.runtime.queueDisplayUpdate();
            }
            return b.heading;
        }
        input.compassHeading = compassHeading;
        function assumeCalibrationCompass() {
        }
        input.assumeCalibrationCompass = assumeCalibrationCompass;
        function clearCalibrationCompass() {
        }
        input.clearCalibrationCompass = clearCalibrationCompass;
        function isCalibratedCompass() {
            // let b = board().compassState;
            // return b.isCalibrated;
            // TODO
            return true;
        }
        input.isCalibratedCompass = isCalibratedCompass;
        function magneticForce() {
            // TODO
            return 0;
        }
        input.magneticForce = magneticForce;
    })(input = pxsim.input || (pxsim.input = {}));
})(pxsim || (pxsim = {}));
var pxsim;
(function (pxsim) {
    var input;
    (function (input) {
        function onPinTouchEvent(pinId, pinEvent, handler) {
            let pin = pxsim.getPin(pinId);
            if (!pin)
                return;
            pin.isTouched();
            pxsim.runtime.queueDisplayUpdate();
            pxsim.pxtcore.registerWithDal(pin.id, pinEvent, handler);
        }
        input.onPinTouchEvent = onPinTouchEvent;
        function pinIsPressed(pinId) {
            let pin = pxsim.getPin(pinId);
            if (!pin)
                return false;
            return pin.isTouched();
        }
        input.pinIsPressed = pinIsPressed;
    })(input = pxsim.input || (pxsim.input = {}));
})(pxsim || (pxsim = {}));
(function (pxsim) {
    function getPin(id) {
        return pxsim.board().edgeConnectorState.getPin(id);
    }
    pxsim.getPin = getPin;
})(pxsim || (pxsim = {}));
(function (pxsim) {
    var pins;
    (function (pins_1) {
        pins_1.edgeConnectorSoundDisabled = false;
        function digitalReadPin(pinId) {
            let pin = pxsim.getPin(pinId);
            if (!pin)
                return -1;
            pin.mode = pxsim.PinFlags.Digital | pxsim.PinFlags.Input;
            console.log(pin.value);
            return pin.value >= 1 ? 1 : 0;
        }
        pins_1.digitalReadPin = digitalReadPin;
        function digitalWritePin(pinId, value) {
            let pin = pxsim.getPin(pinId);
            if (!pin)
                return;
            pin.mode = pxsim.PinFlags.Digital | pxsim.PinFlags.Output;
            pin.value = value > 0 ? 1023 : 0;
            pxsim.runtime.queueDisplayUpdate();
        }
        pins_1.digitalWritePin = digitalWritePin;
        function setPull(pinId, pull) {
            let pin = pxsim.getPin(pinId);
            if (!pin)
                return;
            pin.setPull(pull);
        }
        pins_1.setPull = setPull;
        function analogReadPin(pinId) {
            let pin = pxsim.getPin(pinId);
            if (!pin)
                return -1;
            pin.mode = pxsim.PinFlags.Analog | pxsim.PinFlags.Input;
            return pin.value || 0;
        }
        pins_1.analogReadPin = analogReadPin;
        function analogWritePin(pinId, value) {
            let pin = pxsim.getPin(pinId);
            if (!pin)
                return;
            pin.mode = pxsim.PinFlags.Analog | pxsim.PinFlags.Output;
            pin.value = value | 0;
            pxsim.runtime.queueDisplayUpdate();
        }
        pins_1.analogWritePin = analogWritePin;
        function analogSetPeriod(pinId, micros) {
            let pin = pxsim.getPin(pinId);
            if (!pin)
                return;
            pin.mode = pxsim.PinFlags.Analog | pxsim.PinFlags.Output;
            pin.period = micros;
            pxsim.runtime.queueDisplayUpdate();
        }
        pins_1.analogSetPeriod = analogSetPeriod;
        function servoWritePin(pinId, value) {
            let pin = pxsim.getPin(pinId);
            if (!pin)
                return;
            analogSetPeriod(pinId, 20000);
            pin.servoAngle = value;
        }
        pins_1.servoWritePin = servoWritePin;
        function servoSetContinuous(pinId, value) {
            let pin = pxsim.getPin(pinId);
            if (!pin)
                return;
            pin.servoSetContinuous(value);
        }
        pins_1.servoSetContinuous = servoSetContinuous;
        function servoSetPulse(pinId, micros) {
            let pin = pxsim.getPin(pinId);
            if (!pin)
                return;
            // TODO
        }
        pins_1.servoSetPulse = servoSetPulse;
        function analogSetPitchPin(pinId) {
            const b = pxsim.board();
            if (!b)
                return;
            let pin = pxsim.getPin(pinId);
            if (!pin)
                return;
            const ec = b.edgeConnectorState;
            ec.pins.filter(p => !!p).forEach(p => p.pitch = false);
            pin.pitch = true;
        }
        pins_1.analogSetPitchPin = analogSetPitchPin;
        function setSoundOutputPinEnabled(enabled) {
            const b = pxsim.board();
            if (!b)
                return;
            const ec = b.edgeConnectorState;
            ec.pitchEnabled = !enabled;
        }
        pins_1.setSoundOutputPinEnabled = setSoundOutputPinEnabled;
        function analogSetPitchVolume(volume) {
            const ec = pxsim.board().edgeConnectorState;
            ec.pitchVolume = Math.max(0, Math.min(0xff, volume | 0));
            pxsim.AudioContextManager.setCurrentToneGain((ec.pitchVolume / 0xff) / 10);
        }
        pins_1.analogSetPitchVolume = analogSetPitchVolume;
        function analogPitchVolume() {
            const ec = pxsim.board().edgeConnectorState;
            return ec.pitchVolume;
        }
        pins_1.analogPitchVolume = analogPitchVolume;
        function analogPitch(frequency, ms) {
            // update analog output
            const b = pxsim.board();
            if (!b || isNaN(frequency) || isNaN(ms))
                return;
            if (!b)
                return;
            const ec = b.edgeConnectorState;
            const pins = ec.pins;
            const pin = ec.pitchEnabled && (pins.filter(pin => !!pin && pin.pitch)[0] || pins[0]);
            const pitchVolume = ec.pitchVolume | 0;
            if (pin && !pins_1.edgeConnectorSoundDisabled) {
                pin.mode = pxsim.PinFlags.Analog | pxsim.PinFlags.Output;
                if (frequency <= 0 || pitchVolume <= 0) {
                    pin.value = 0;
                    pin.period = 0;
                }
                else {
                    const v = 1 << (pitchVolume >> 5);
                    pin.value = v;
                    pin.period = 1000000 / frequency;
                }
                pxsim.runtime.queueDisplayUpdate();
            }
            let cb = pxsim.getResume();
            if (pin) {
                const v = pitchVolume / 0xff;
                pxsim.AudioContextManager.tone(frequency, v / 10);
            }
            if (ms <= 0)
                cb();
            else {
                setTimeout(() => {
                    pxsim.AudioContextManager.stop();
                    if (pin && !pins_1.edgeConnectorSoundDisabled) {
                        pin.value = 0;
                        pin.period = 0;
                        pin.mode = pxsim.PinFlags.Unused;
                    }
                    pxsim.runtime.queueDisplayUpdate();
                    cb();
                }, ms);
            }
        }
        pins_1.analogPitch = analogPitch;
        function pushButton(pinId) {
            const b = pxsim.board();
            if (!b)
                return;
            const ec = b.edgeConnectorState;
            // TODO support buttons here
        }
        pins_1.pushButton = pushButton;
    })(pins = pxsim.pins || (pxsim.pins = {}));
})(pxsim || (pxsim = {}));
(function (pxsim) {
    var music;
    (function (music) {
        function setVolume(volume) {
            pxsim.pins.analogSetPitchVolume(volume);
        }
        music.setVolume = setVolume;
        function volume() {
            return pxsim.pins.analogPitchVolume();
        }
        music.volume = volume;
    })(music = pxsim.music || (pxsim.music = {}));
})(pxsim || (pxsim = {}));
(function (pxsim) {
    var pins;
    (function (pins) {
        function setAudioPin(pinId) {
            pxsim.pins.analogSetPitchPin(pinId);
        }
        pins.setAudioPin = setAudioPin;
        const disabledSVG = `
    <svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100">
        <clipPath id="bounds" clipPathUnits="userSpaceOnUse">
        <circle cx="50" cy="50" r="45" />
        </clipPath>
        <circle cx="50" cy="50" r="40" stroke-width="10" stroke="red" fill="none" clip-path="url(#bounds)" />
        <line x1="100" y1="0" x2="0" y2="100" stroke="red" stroke-width="10" clip-path="url(#bounds)" />
    </svg>
    `;
        function setAudioPinEnabled(enabled) {
            pins.edgeConnectorSoundDisabled = !enabled;
            const headphone = pxsim.board().viewHost.getView().querySelector("g.sim-headphone-cmp");
            if (headphone) {
                const existing = headphone.querySelector("#headphone-disabled");
                if (existing) {
                    if (enabled) {
                        existing.remove();
                    }
                    else {
                        return;
                    }
                }
                if (!enabled) {
                    const img = document.createElementNS("http://www.w3.org/2000/svg", "image");
                    img.setAttribute("href", "data:image/svg+xml;utf8," + encodeURIComponent(disabledSVG));
                    img.setAttribute("id", "headphone-disabled");
                    img.style.transform = "scale(1.5) translate(-10px, -10px)";
                    headphone.appendChild(img);
                }
            }
        }
        pins.setAudioPinEnabled = setAudioPinEnabled;
    })(pins = pxsim.pins || (pxsim.pins = {}));
})(pxsim || (pxsim = {}));
var pxsim;
(function (pxsim) {
    let PinFlags;
    (function (PinFlags) {
        PinFlags[PinFlags["Unused"] = 0] = "Unused";
        PinFlags[PinFlags["Digital"] = 1] = "Digital";
        PinFlags[PinFlags["Analog"] = 2] = "Analog";
        PinFlags[PinFlags["Input"] = 4] = "Input";
        PinFlags[PinFlags["Output"] = 8] = "Output";
        PinFlags[PinFlags["Touch"] = 16] = "Touch";
    })(PinFlags = pxsim.PinFlags || (pxsim.PinFlags = {}));
    class Pin {
        constructor(id) {
            this.id = id;
            this.touched = false;
            this.value = 0;
            this.period = 0;
            this.servoAngle = 0;
            this.mode = PinFlags.Unused;
            this.pitch = false;
            this.pull = 0; // PullDown
            this.servoContinuous = false;
        }
        digitalReadPin() {
            this.mode = PinFlags.Digital | PinFlags.Input;
            return this.value > 100 ? 1 : 0;
        }
        digitalWritePin(value) {
            this.mode = PinFlags.Digital | PinFlags.Output;
            this.value = value > 0 ? 200 : 0;
            pxsim.runtime.queueDisplayUpdate();
        }
        setPull(pull) {
            this.pull = pull;
            switch (pull) {
                case 0 /* PullDown */:
                    this.value = 0;
                    break;
                case 1 /* PullUp */:
                    this.value = 1023;
                    break;
                default:
                    this.value = pxsim.Math_.randomRange(0, 1023);
                    break;
            }
        }
        analogReadPin() {
            this.mode = PinFlags.Analog | PinFlags.Input;
            return this.value || 0;
        }
        analogWritePin(value) {
            value = value >> 0;
            this.mode = PinFlags.Analog | PinFlags.Output;
            this.value = Math.max(0, Math.min(1023, value));
            pxsim.runtime.queueDisplayUpdate();
        }
        analogSetPeriod(micros) {
            micros = micros >> 0;
            this.mode = PinFlags.Analog | PinFlags.Output;
            this.period = micros;
            pxsim.runtime.queueDisplayUpdate();
        }
        servoWritePin(value) {
            value = value >> 0;
            this.analogSetPeriod(20000);
            this.servoAngle = Math.max(0, Math.min(180, value));
            pxsim.runtime.queueDisplayUpdate();
        }
        servoSetContinuous(value) {
            this.servoContinuous = !!value;
        }
        servoSetPulse(pinId, micros) {
            // TODO
        }
        isTouched() {
            this.mode = PinFlags.Touch | PinFlags.Analog | PinFlags.Input;
            return this.touched;
        }
    }
    pxsim.Pin = Pin;
    class EdgeConnectorState {
        constructor(props) {
            this.props = props;
            this.pitchEnabled = true;
            this.pins = props.pins.map(id => id != undefined ? new Pin(id) : null);
            this.pitchVolume = 0xff;
        }
        getPin(id) {
            return this.pins.filter(p => p && p.id == id)[0] || null;
        }
    }
    pxsim.EdgeConnectorState = EdgeConnectorState;
})(pxsim || (pxsim = {}));
var pxsim;
(function (pxsim) {
    var files;
    (function (files) {
        function appendLine(filename, text) {
            const b = pxsim.board();
            b.fileSystem.append(filename, text + "\r\n");
        }
        files.appendLine = appendLine;
        function appendString(filename, text) {
            const b = pxsim.board();
            b.fileSystem.append(filename, text);
        }
        files.appendString = appendString;
        function appendNumber(filename, value) {
            const b = pxsim.board();
            b.fileSystem.append(filename, value.toString());
        }
        files.appendNumber = appendNumber;
        function remove(filename) {
            const b = pxsim.board();
            b.fileSystem.remove(filename);
        }
        files.remove = remove;
        function readToSerial(filename) {
            const b = pxsim.board();
            let f = b.fileSystem.files[filename];
            if (f)
                b.serialState.writeSerial(f);
        }
        files.readToSerial = readToSerial;
    })(files = pxsim.files || (pxsim.files = {}));
})(pxsim || (pxsim = {}));
var pxsim;
(function (pxsim) {
    var flashlog;
    (function (flashlog) {
        let FlashLogTimeStampFormat;
        (function (FlashLogTimeStampFormat) {
            FlashLogTimeStampFormat[FlashLogTimeStampFormat["None"] = 0] = "None";
            FlashLogTimeStampFormat[FlashLogTimeStampFormat["Milliseconds"] = 1] = "Milliseconds";
            FlashLogTimeStampFormat[FlashLogTimeStampFormat["Seconds"] = 10] = "Seconds";
            FlashLogTimeStampFormat[FlashLogTimeStampFormat["Minutes"] = 600] = "Minutes";
            FlashLogTimeStampFormat[FlashLogTimeStampFormat["Hours"] = 36000] = "Hours";
            FlashLogTimeStampFormat[FlashLogTimeStampFormat["Days"] = 864000] = "Days";
        })(FlashLogTimeStampFormat || (FlashLogTimeStampFormat = {}));
        // we don't store the flash log in the runtime object, since it's persistent
        let headers = [];
        let currentRow = undefined;
        let SEPARATOR = ",";
        let timestampFormat = undefined;
        let mirrorToSerial = false;
        let logSize = 0;
        let committedCols = 0;
        /** allocated flash size **/
        const logEnd = 121852;
        let lastRunId;
        function init() {
            const b = pxsim.board();
            if (!b)
                return;
            if (b.runOptions.id !== lastRunId) {
                lastRunId = b.runOptions.id;
                erase();
            }
            // b.ensureHardwareVersion(2);
        }
        function commitRow(data, type) {
            if (!pxsim.runtime)
                return;
            data += "\n";
            /** edge 18 does not support text encoder, so fall back to length **/
            logSize += typeof TextEncoder !== "undefined" ? (new TextEncoder().encode(data)).length : data.length;
            if (logSize >= logEnd) {
                pxsim.board().bus.queue(44 /* MICROBIT_ID_LOG */, 1 /* MICROBIT_LOG_EVT_LOG_FULL */);
                clear(false);
            }
            if (mirrorToSerial) {
                pxsim.board().serialState.writeSerial(data);
            }
            if (type !== "plaintext") {
                pxsim.board().serialState.writeCsv(data, type);
            }
        }
        function beginRow() {
            init();
            if (currentRow)
                return -1015 /* DEVICE_INVALID_STATE */;
            currentRow = [];
            return 0 /* DEVICE_OK */;
        }
        flashlog.beginRow = beginRow;
        function logData(key, value, prepend = false) {
            init();
            if (!currentRow)
                return -1015 /* DEVICE_INVALID_STATE */;
            // find header index
            let index = headers.indexOf(key);
            if (index < 0) {
                if (prepend) {
                    /** push timestamps up to front of uncommitted rows **/
                    headers.splice(committedCols, 0, key);
                    currentRow.splice(committedCols, 0, value);
                    index = committedCols;
                }
                else {
                    headers.push(key);
                    index = headers.length - 1;
                }
            }
            // store
            currentRow[index] = value;
            return 0 /* DEVICE_OK */;
        }
        flashlog.logData = logData;
        function endRow() {
            init();
            if (!currentRow)
                return -1015 /* DEVICE_INVALID_STATE */;
            if (!currentRow.some(el => el !== "" && el != undefined))
                return 0 /* DEVICE_OK */;
            if (timestampFormat !== FlashLogTimeStampFormat.None) {
                let unit = "";
                switch (timestampFormat) {
                    case FlashLogTimeStampFormat.Milliseconds:
                        unit = "milliseconds";
                        break;
                    case FlashLogTimeStampFormat.Minutes:
                        unit = "minutes";
                        break;
                    case FlashLogTimeStampFormat.Hours:
                        unit = "hours";
                        break;
                    case FlashLogTimeStampFormat.Days:
                        unit = "days";
                        break;
                    case FlashLogTimeStampFormat.Seconds:
                    default:
                        unit = "seconds";
                        break;
                }
                const timestamp = pxsim.runtime.runningTime();
                const timeUnit = timestampFormat > 1 ? timestampFormat * 100 : timestampFormat;
                const timeValue = timestamp / timeUnit;
                // TODO: there's a semi complicated format conversion
                // over in MicroBitLog::endRow that we might want to replicate.
                // https://github.com/lancaster-university/codal-microbit-v2/blob/master/source/MicroBitLog.cpp#L405
                logData(`time (${unit})`, "" + timeValue, true /** Prepend before new headers */);
            }
            currentRow.length = headers.length;
            const line = currentRow.join(SEPARATOR);
            if (headers.length !== committedCols) {
                commitRow(headers.join(SEPARATOR), "headers");
                committedCols = headers.length;
            }
            currentRow = undefined;
            commitRow(line, "row");
            return 0 /* DEVICE_OK */;
        }
        flashlog.endRow = endRow;
        function logString(s) {
            init();
            if (!s)
                return;
            commitRow(s, "plaintext");
        }
        flashlog.logString = logString;
        function clear(fullErase) {
            init();
            erase();
        }
        flashlog.clear = clear;
        function erase() {
            headers = [];
            logSize = 0;
            committedCols = 0;
            currentRow = undefined;
            pxsim.board().serialState.writeCsv("", "clear");
        }
        function setTimeStamp(format) {
            init();
            // this option is probably not serialized, needs to move in state
            timestampFormat = format;
        }
        flashlog.setTimeStamp = setTimeStamp;
        function setSerialMirroring(enabled) {
            init();
            mirrorToSerial = !!enabled;
        }
        flashlog.setSerialMirroring = setSerialMirroring;
    })(flashlog = pxsim.flashlog || (pxsim.flashlog = {}));
})(pxsim || (pxsim = {}));
var pxsim;
(function (pxsim) {
    let DisplayMode;
    (function (DisplayMode) {
        DisplayMode[DisplayMode["bw"] = 0] = "bw";
        DisplayMode[DisplayMode["greyscale"] = 1] = "greyscale";
    })(DisplayMode = pxsim.DisplayMode || (pxsim.DisplayMode = {}));
    class LedMatrixState {
        constructor(runtime) {
            this.image = createInternalImage(5);
            this.brigthness = 255;
            this.displayMode = DisplayMode.bw;
            this.font = createFont();
            this.animationQ = new pxsim.AnimationQueue(runtime);
        }
    }
    pxsim.LedMatrixState = LedMatrixState;
    class Image extends pxsim.RefObject {
        constructor(width, data) {
            super();
            this.width = width;
            this.data = data;
            this.height = (this.data.length / this.width) | 0;
        }
        print() {
            console.debug(`Image id:${this.id} size:${this.width}x${this.height}`);
        }
        get(x, y) {
            x = x | 0;
            y = y | 0;
            if (x < 0 || x >= this.width || y < 0 || y >= this.height)
                return 0;
            return this.data[y * this.width + x];
        }
        set(x, y, v) {
            x = x | 0;
            y = y | 0;
            if (x < 0 || x >= this.width || y < 0 || y >= this.height)
                return;
            this.data[y * this.width + x] = Math.max(0, Math.min(255, v));
        }
        copyTo(xSrcIndex, length, target, xTargetIndex) {
            xSrcIndex = xSrcIndex | 0;
            length = length | 0;
            xTargetIndex = xTargetIndex | 0;
            for (let x = 0; x < length; x++) {
                for (let y = 0; y < this.height; y++) {
                    let value = this.get(xSrcIndex + x, y);
                    target.set(xTargetIndex + x, y, value);
                }
            }
        }
        shiftLeft(cols) {
            cols = cols | 0;
            for (let x = 0; x < this.width; ++x)
                for (let y = 0; y < this.height; ++y)
                    this.set(x, y, x < this.width - cols ? this.get(x + cols, y) : 0);
        }
        shiftRight(cols) {
            cols = cols >> 0;
            for (let x = this.width - 1; x >= 0; --x)
                for (let y = 0; y < this.height; ++y)
                    this.set(x, y, x >= cols ? this.get(x - cols, y) : 0);
        }
        clear() {
            for (let i = 0; i < this.data.length; ++i)
                this.data[i] = 0;
        }
    }
    pxsim.Image = Image;
    function createInternalImage(width) {
        width = width >> 0;
        let img = createImage(width);
        return img;
    }
    pxsim.createInternalImage = createInternalImage;
    function createImage(width) {
        width = width >> 0;
        return new Image(width, new Array(width * 5));
    }
    pxsim.createImage = createImage;
    function createImageFromBuffer(data) {
        return new Image((data.length / 5) | 0, data);
    }
    pxsim.createImageFromBuffer = createImageFromBuffer;
    function createImageFromString(text) {
        let font = pxsim.board().ledMatrixState.font;
        let w = font.width;
        let sprite = createInternalImage(6 * text.length - 1);
        let k = 0;
        for (let i = 0; i < text.length; i++) {
            let charCode = text.charCodeAt(i);
            let charStart = (charCode - 32) * 5;
            if (charStart < 0 || charStart + 5 > w) {
                charCode = " ".charCodeAt(0);
                charStart = (charCode - 32) * 5;
            }
            font.copyTo(charStart, 5, sprite, k);
            k = k + 5;
            if (i < text.length - 1) {
                k = k + 1;
            }
        }
        return sprite;
    }
    pxsim.createImageFromString = createImageFromString;
    pxsim.FONT_DATA = [0x0, 0x0, 0x0, 0x0, 0x0, 0x8, 0x8, 0x8, 0x0, 0x8, 0xa, 0x4a, 0x40, 0x0, 0x0, 0xa, 0x5f, 0xea, 0x5f, 0xea, 0xe, 0xd9, 0x2e, 0xd3, 0x6e, 0x19, 0x32, 0x44, 0x89, 0x33, 0xc, 0x92, 0x4c, 0x92, 0x4d, 0x8, 0x8, 0x0, 0x0, 0x0, 0x4, 0x88, 0x8, 0x8, 0x4, 0x8, 0x4, 0x84, 0x84, 0x88, 0x0, 0xa, 0x44, 0x8a, 0x40, 0x0, 0x4, 0x8e, 0xc4, 0x80, 0x0, 0x0, 0x0, 0x4, 0x88, 0x0, 0x0, 0xe, 0xc0, 0x0, 0x0, 0x0, 0x0, 0x8, 0x0, 0x1, 0x22, 0x44, 0x88, 0x10, 0xc, 0x92, 0x52, 0x52, 0x4c, 0x4, 0x8c, 0x84, 0x84, 0x8e, 0x1c, 0x82, 0x4c, 0x90, 0x1e, 0x1e, 0xc2, 0x44, 0x92, 0x4c, 0x6, 0xca, 0x52, 0x5f, 0xe2, 0x1f, 0xf0, 0x1e, 0xc1, 0x3e, 0x2, 0x44, 0x8e, 0xd1, 0x2e, 0x1f, 0xe2, 0x44, 0x88, 0x10, 0xe, 0xd1, 0x2e, 0xd1, 0x2e, 0xe, 0xd1, 0x2e, 0xc4, 0x88, 0x0, 0x8, 0x0, 0x8, 0x0, 0x0, 0x4, 0x80, 0x4, 0x88, 0x2, 0x44, 0x88, 0x4, 0x82, 0x0, 0xe, 0xc0, 0xe, 0xc0, 0x8, 0x4, 0x82, 0x44, 0x88, 0xe, 0xd1, 0x26, 0xc0, 0x4, 0xe, 0xd1, 0x35, 0xb3, 0x6c, 0xc, 0x92, 0x5e, 0xd2, 0x52, 0x1c, 0x92, 0x5c, 0x92, 0x5c, 0xe, 0xd0, 0x10, 0x10, 0xe, 0x1c, 0x92, 0x52, 0x52, 0x5c, 0x1e, 0xd0, 0x1c, 0x90, 0x1e, 0x1e, 0xd0, 0x1c, 0x90, 0x10, 0xe, 0xd0, 0x13, 0x71, 0x2e, 0x12, 0x52, 0x5e, 0xd2, 0x52, 0x1c, 0x88, 0x8, 0x8, 0x1c, 0x1f, 0xe2, 0x42, 0x52, 0x4c, 0x12, 0x54, 0x98, 0x14, 0x92, 0x10, 0x10, 0x10, 0x10, 0x1e, 0x11, 0x3b, 0x75, 0xb1, 0x31, 0x11, 0x39, 0x35, 0xb3, 0x71, 0xc, 0x92, 0x52, 0x52, 0x4c, 0x1c, 0x92, 0x5c, 0x90, 0x10, 0xc, 0x92, 0x52, 0x4c, 0x86, 0x1c, 0x92, 0x5c, 0x92, 0x51, 0xe, 0xd0, 0xc, 0x82, 0x5c, 0x1f, 0xe4, 0x84, 0x84, 0x84, 0x12, 0x52, 0x52, 0x52, 0x4c, 0x11, 0x31, 0x31, 0x2a, 0x44, 0x11, 0x31, 0x35, 0xbb, 0x71, 0x12, 0x52, 0x4c, 0x92, 0x52, 0x11, 0x2a, 0x44, 0x84, 0x84, 0x1e, 0xc4, 0x88, 0x10, 0x1e, 0xe, 0xc8, 0x8, 0x8, 0xe, 0x10, 0x8, 0x4, 0x82, 0x41, 0xe, 0xc2, 0x42, 0x42, 0x4e, 0x4, 0x8a, 0x40, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0, 0x1f, 0x8, 0x4, 0x80, 0x0, 0x0, 0x0, 0xe, 0xd2, 0x52, 0x4f, 0x10, 0x10, 0x1c, 0x92, 0x5c, 0x0, 0xe, 0xd0, 0x10, 0xe, 0x2, 0x42, 0x4e, 0xd2, 0x4e, 0xc, 0x92, 0x5c, 0x90, 0xe, 0x6, 0xc8, 0x1c, 0x88, 0x8, 0xe, 0xd2, 0x4e, 0xc2, 0x4c, 0x10, 0x10, 0x1c, 0x92, 0x52, 0x8, 0x0, 0x8, 0x8, 0x8, 0x2, 0x40, 0x2, 0x42, 0x4c, 0x10, 0x14, 0x98, 0x14, 0x92, 0x8, 0x8, 0x8, 0x8, 0x6, 0x0, 0x1b, 0x75, 0xb1, 0x31, 0x0, 0x1c, 0x92, 0x52, 0x52, 0x0, 0xc, 0x92, 0x52, 0x4c, 0x0, 0x1c, 0x92, 0x5c, 0x90, 0x0, 0xe, 0xd2, 0x4e, 0xc2, 0x0, 0xe, 0xd0, 0x10, 0x10, 0x0, 0x6, 0xc8, 0x4, 0x98, 0x8, 0x8, 0xe, 0xc8, 0x7, 0x0, 0x12, 0x52, 0x52, 0x4f, 0x0, 0x11, 0x31, 0x2a, 0x44, 0x0, 0x11, 0x31, 0x35, 0xbb, 0x0, 0x12, 0x4c, 0x8c, 0x92, 0x0, 0x11, 0x2a, 0x44, 0x98, 0x0, 0x1e, 0xc4, 0x88, 0x1e, 0x6, 0xc4, 0x8c, 0x84, 0x86, 0x8, 0x8, 0x8, 0x8, 0x8, 0x18, 0x8, 0xc, 0x88, 0x18, 0x0, 0x0, 0xc, 0x83, 0x60];
    function createFont() {
        let nb = pxsim.FONT_DATA.length;
        let n = nb / 5;
        let font = createInternalImage(nb);
        for (let c = 0; c < n; c++) {
            for (let row = 0; row < 5; row++) {
                let char = pxsim.FONT_DATA[c * 5 + row];
                for (let col = 0; col < 5; col++) {
                    if ((char & (1 << col)) != 0)
                        font.set((c * 5 + 4) - col, row, 255);
                }
            }
        }
        return font;
    }
    pxsim.createFont = createFont;
})(pxsim || (pxsim = {}));
(function (pxsim) {
    var fonts;
    (function (fonts) {
        function charCodeBuffer(charCode) {
            if (charCode < 32 /* MICROBIT_FONT_ASCII_START */ || charCode > 126 /* MICROBIT_FONT_ASCII_END */)
                return undefined;
            const b = pxsim.board();
            const led = b.ledMatrixState;
            const font = led.font;
            const h = font.height;
            const w = font.width;
            const buf = pxsim.control.createBuffer(h);
            const offset = (charCode - 32 /* MICROBIT_FONT_ASCII_START */) * h;
            for (let row = 0; row < h; ++row)
                buf.data[row] = pxsim.FONT_DATA[offset + row];
            return buf;
        }
        fonts.charCodeBuffer = charCodeBuffer;
    })(fonts = pxsim.fonts || (pxsim.fonts = {}));
})(pxsim || (pxsim = {}));
(function (pxsim) {
    var images;
    (function (images) {
        function createImage(img) {
            return img;
        }
        images.createImage = createImage;
        function createBigImage(img) {
            return img;
        }
        images.createBigImage = createBigImage;
    })(images = pxsim.images || (pxsim.images = {}));
})(pxsim || (pxsim = {}));
(function (pxsim) {
    var ImageMethods;
    (function (ImageMethods) {
        function showImage(leds, offset, interval) {
            pxsim.pxtrt.nullCheck(leds);
            offset = offset >> 0;
            interval = interval >> 0;
            let cb = pxsim.getResume();
            let first = true;
            leds = clampPixelBrightness(leds);
            pxsim.board().ledMatrixState.animationQ.enqueue({
                interval,
                frame: () => {
                    if (first) {
                        leds.copyTo(offset, 5, pxsim.board().ledMatrixState.image, 0);
                        first = false;
                        return true;
                    }
                    return false;
                },
                whenDone: cb
            });
        }
        ImageMethods.showImage = showImage;
        function plotImage(leds, offset) {
            pxsim.pxtrt.nullCheck(leds);
            offset = offset >> 0;
            leds = clampPixelBrightness(leds);
            pxsim.board().ledMatrixState.animationQ.enqueue({
                interval: 0,
                frame: () => {
                    leds.copyTo(offset, 5, pxsim.board().ledMatrixState.image, 0);
                    return false;
                }
            });
        }
        ImageMethods.plotImage = plotImage;
        function height(leds) {
            pxsim.pxtrt.nullCheck(leds);
            return leds.height;
        }
        ImageMethods.height = height;
        function width(leds) {
            pxsim.pxtrt.nullCheck(leds);
            return leds.width;
        }
        ImageMethods.width = width;
        function plotFrame(leds, frame) {
            ImageMethods.plotImage(leds, frame * leds.height);
        }
        ImageMethods.plotFrame = plotFrame;
        function showFrame(leds, frame, interval) {
            ImageMethods.showImage(leds, frame * leds.height, interval);
        }
        ImageMethods.showFrame = showFrame;
        function pixel(leds, x, y) {
            pxsim.pxtrt.nullCheck(leds);
            return leds.get(x, y);
        }
        ImageMethods.pixel = pixel;
        function setPixel(leds, x, y, v) {
            pxsim.pxtrt.nullCheck(leds);
            leds.set(x, y, v);
        }
        ImageMethods.setPixel = setPixel;
        function clear(leds) {
            pxsim.pxtrt.nullCheck(leds);
            leds.clear();
        }
        ImageMethods.clear = clear;
        function setPixelBrightness(i, x, y, b) {
            pxsim.pxtrt.nullCheck(i);
            i.set(x, y, b);
        }
        ImageMethods.setPixelBrightness = setPixelBrightness;
        function pixelBrightness(i, x, y) {
            pxsim.pxtrt.nullCheck(i);
            return i.get(x, y);
        }
        ImageMethods.pixelBrightness = pixelBrightness;
        function scrollImage(leds, stride, interval) {
            pxsim.pxtrt.nullCheck(leds);
            stride = stride >> 0;
            interval = interval >> 0;
            if (stride == 0)
                stride = 1;
            let cb = pxsim.getResume();
            let off = stride > 0 ? 0 : leds.width - 1;
            let display = pxsim.board().ledMatrixState.image;
            leds = clampPixelBrightness(leds);
            pxsim.board().ledMatrixState.animationQ.enqueue({
                interval: interval,
                frame: () => {
                    if (off >= leds.width || off < 0)
                        return false;
                    if (stride > 0) {
                        display.shiftLeft(stride);
                        const c = Math.min(stride, leds.width - off);
                        leds.copyTo(off, c, display, 5 - stride);
                    }
                    else {
                        display.shiftRight(-stride);
                        const c = Math.min(-stride, leds.width - off);
                        leds.copyTo(off, c, display, 0);
                    }
                    off += stride;
                    return true;
                },
                whenDone: cb
            });
        }
        ImageMethods.scrollImage = scrollImage;
        function clampPixelBrightness(img) {
            let res = img;
            if (pxsim.led.displayMode() === pxsim.DisplayMode.greyscale && pxsim.led.brightness() < 0xff) {
                res = new pxsim.Image(img.width, img.data);
                const b = pxsim.led.brightness();
                for (let x = 0; x < res.width; ++x) {
                    for (let y = 0; y < 5; ++y) {
                        if (pixelBrightness(res, x, y) > b) {
                            setPixelBrightness(res, x, y, b);
                        }
                    }
                }
            }
            return res;
        }
    })(ImageMethods = pxsim.ImageMethods || (pxsim.ImageMethods = {}));
})(pxsim || (pxsim = {}));
(function (pxsim) {
    var basic;
    (function (basic) {
        function showNumber(x, interval) {
            interval |= 0;
            if (interval <= 0)
                interval = 1;
            let leds = pxsim.createImageFromString(x.toString());
            if (x < 0 || x >= 10)
                pxsim.ImageMethods.scrollImage(leds, 1, interval);
            else
                showLeds(leds, interval * 5);
        }
        basic.showNumber = showNumber;
        function showString(s, interval) {
            interval |= 0;
            if (interval <= 0)
                interval = 1;
            if (s.length == 0) {
                clearScreen();
                basic.pause(interval * 5);
            }
            else if (s.length > 1) {
                pxsim.ImageMethods.scrollImage(pxsim.createImageFromString(s + " "), 1, interval);
            }
            else {
                showLeds(pxsim.createImageFromString(s), interval * 5);
            }
        }
        basic.showString = showString;
        function showLeds(leds, interval) {
            interval |= 0;
            showAnimation(leds, interval);
        }
        basic.showLeds = showLeds;
        function clearScreen() {
            pxsim.board().ledMatrixState.image.clear();
            pxsim.runtime.queueDisplayUpdate();
        }
        basic.clearScreen = clearScreen;
        function showAnimation(leds, interval) {
            interval |= 0;
            pxsim.ImageMethods.scrollImage(leds, 5, interval);
        }
        basic.showAnimation = showAnimation;
        function plotLeds(leds) {
            pxsim.ImageMethods.plotImage(leds, 0);
        }
        basic.plotLeds = plotLeds;
    })(basic = pxsim.basic || (pxsim.basic = {}));
})(pxsim || (pxsim = {}));
(function (pxsim) {
    var led;
    (function (led) {
        function plot(x, y) {
            x |= 0;
            y |= 0;
            pxsim.board().ledMatrixState.image.set(x, y, 0xff);
            pxsim.runtime.queueDisplayUpdate();
        }
        led.plot = plot;
        function plotBrightness(x, y, brightness) {
            x |= 0;
            y |= 0;
            const state = pxsim.board().ledMatrixState;
            brightness |= 0;
            brightness = Math.max(0, Math.min(led.brightness(), brightness));
            if (brightness != 0 && brightness != 0xff && state.displayMode != pxsim.DisplayMode.greyscale)
                state.displayMode = pxsim.DisplayMode.greyscale;
            state.image.set(x, y, brightness);
            pxsim.runtime.queueDisplayUpdate();
        }
        led.plotBrightness = plotBrightness;
        function unplot(x, y) {
            x |= 0;
            y |= 0;
            pxsim.board().ledMatrixState.image.set(x, y, 0);
            pxsim.runtime.queueDisplayUpdate();
        }
        led.unplot = unplot;
        function pointBrightness(x, y) {
            x |= 0;
            y |= 0;
            return pxsim.board().ledMatrixState.image.get(x, y);
        }
        led.pointBrightness = pointBrightness;
        function brightness() {
            return pxsim.board().ledMatrixState.brigthness;
        }
        led.brightness = brightness;
        function setBrightness(value) {
            value |= 0;
            pxsim.board().ledMatrixState.brigthness = Math.max(0, Math.min(255, value));
            pxsim.runtime.queueDisplayUpdate();
        }
        led.setBrightness = setBrightness;
        function stopAnimation() {
            pxsim.board().ledMatrixState.animationQ.cancelAll();
            pxsim.board().ledMatrixState.image.clear();
        }
        led.stopAnimation = stopAnimation;
        function setDisplayMode(mode) {
            pxsim.board().ledMatrixState.displayMode = mode;
            pxsim.runtime.queueDisplayUpdate();
        }
        led.setDisplayMode = setDisplayMode;
        function displayMode() {
            return pxsim.board().ledMatrixState.displayMode;
        }
        led.displayMode = displayMode;
        function screenshot() {
            let img = pxsim.createImage(5);
            pxsim.board().ledMatrixState.image.copyTo(0, 5, img, 0);
            return img;
        }
        led.screenshot = screenshot;
        function enable(on) {
            pxsim.board().ledMatrixState.disabled = !on;
            pxsim.runtime.queueDisplayUpdate();
        }
        led.enable = enable;
    })(led = pxsim.led || (pxsim.led = {}));
})(pxsim || (pxsim = {}));
var pxsim;
(function (pxsim) {
    var input;
    (function (input) {
        function lightLevel() {
            let b = pxsim.board().lightSensorState;
            if (!b.usesLightLevel) {
                b.usesLightLevel = true;
                pxsim.runtime.queueDisplayUpdate();
            }
            return b.lightLevel;
        }
        input.lightLevel = lightLevel;
    })(input = pxsim.input || (pxsim.input = {}));
})(pxsim || (pxsim = {}));
var pxsim;
(function (pxsim) {
    var input;
    (function (input) {
        function onLogoEvent(action, handler) {
            // const b = board();
            // if (!b) return;
            // update rendering
            pxsim.runtime.queueDisplayUpdate();
            // // minimum v2
            // b.ensureHardwareVersion(2);
            // register handle
            pxsim.pxtcore.registerWithDal(121 /* MICROBIT_ID_LOGO */, action, handler);
        }
        input.onLogoEvent = onLogoEvent;
        function logoIsPressed() {
            const b = pxsim.board();
            if (!b)
                return false;
            // minimum v2
            // b.ensureHardwareVersion(2);
            return b.logoTouch.pressed;
        }
        input.logoIsPressed = logoIsPressed;
    })(input = pxsim.input || (pxsim.input = {}));
})(pxsim || (pxsim = {}));
(function (pxsim) {
    var pins;
    (function (pins) {
        function touchSetMode(name, mode) {
            // const b = board();
            // if (b)
            // b.ensureHardwareVersion(2);
            // not simulated
        }
        pins.touchSetMode = touchSetMode;
    })(pins = pxsim.pins || (pxsim.pins = {}));
})(pxsim || (pxsim = {}));
// move to common packages eventually
var pxsim;
(function (pxsim) {
    var input;
    (function (input) {
        function soundLevel() {
            const b = pxsim.microphoneState();
            if (!b)
                return 0;
            b.setUsed();
            b.pingSoundLevel();
            return b.getLevel();
        }
        input.soundLevel = soundLevel;
        function onSound(sound /* SoundThreshold */, body) {
            const b = pxsim.microphoneState();
            if (!b)
                return;
            b.setUsed();
            b.onSoundRegistered = true;
            pxsim.pxtcore.registerWithDal(b.id, sound, body);
        }
        input.onSound = onSound;
        function setSoundThreshold(sound, threshold) {
            const b = pxsim.microphoneState();
            if (!b)
                return;
            if (sound === 2 /* SoundThreshold.Loud */)
                b.setHighThreshold(threshold);
            else
                b.setLowThreshold(threshold);
        }
        input.setSoundThreshold = setSoundThreshold;
    })(input = pxsim.input || (pxsim.input = {}));
})(pxsim || (pxsim = {}));
var pxsim;
(function (pxsim) {
    var visuals;
    (function (visuals) {
        function createMicroServoElement() {
            return pxsim.svg.parseString(`
        <svg xmlns="http://www.w3.org/2000/svg" id="svg2" width="112.188" height="299.674">
          <g id="layer1" stroke-linecap="round" stroke-linejoin="round" transform="scale(0.8)">
            <path id="path8212" fill="#0061ff" stroke-width="6.6" d="M.378 44.61v255.064h112.188V44.61H.378z"/>
            <path id="crankbase" fill="#00f" stroke-width="6.6" d="M56.57 88.047C25.328 88.047 0 113.373 0 144.615c.02 22.352 11.807 42.596 32.238 51.66.03 3.318.095 5.24.088 7.938 0 13.947 11.307 25.254 25.254 25.254 13.947 0 25.254-11.307 25.254-25.254-.006-2.986-.415-5.442-.32-8.746 19.487-9.45 30.606-29.195 30.625-50.852 0-31.24-25.33-56.568-56.57-56.568z"/>
            <path id="lowertip" fill="#00a2ff" stroke-width="2" d="M.476 260.78v38.894h53.82v-10.486a6.82 6.566 0 0 1-4.545-6.182 6.82 6.566 0 0 1 6.82-6.566 6.82 6.566 0 0 1 6.82 6.566 6.82 6.566 0 0 1-4.545 6.182v10.486h53.82V260.78H.475z"/>
            <path id="uppertip" fill="#00a2ff" stroke-width="2" d="M112.566 83.503V44.61h-53.82v10.487a6.82 6.566 0 0 1 4.544 6.18 6.82 6.566 0 0 1-6.818 6.568 6.82 6.566 0 0 1-6.82-6.567 6.82 6.566 0 0 1 4.546-6.18V44.61H.378v38.893h112.188z"/>
            <path id="VCC" fill="red" stroke-width="2" d="M53.72 21.93h5.504v22.627H53.72z"/>
            <path id="LOGIC" fill="#fc0" stroke-width="2" d="M47.3 21.93h5.503v22.627H47.3z"/>
            <path id="GND" fill="#a02c2c" stroke-width="2" d="M60.14 21.93h5.505v22.627H60.14z"/>
            <path id="connector" stroke-width="2" d="M45.064 0a1.488 1.488 0 0 0-1.488 1.488v24.5a1.488 1.488 0 0 0 1.488 1.487h22.71a1.488 1.488 0 0 0 1.49-1.488v-24.5A1.488 1.488 0 0 0 67.774 0h-22.71z"/>
            <g id="crank" transform="translate(0 -752.688)">
              <path id="arm" fill="#ececec" stroke="#000" stroke-width="1.372" d="M47.767 880.88c-4.447 1.162-8.412 8.278-8.412 18.492s3.77 18.312 8.412 18.494c8.024.314 78.496 5.06 78.51-16.952.012-22.013-74.377-21.117-78.51-20.035z"/>
              <circle id="path8216" cx="56.661" cy="899.475" r="8.972" fill="gray" stroke-width="2"/>
            </g>
          </g>
        </svg>
                    `).firstElementChild;
        }
        function mkMicroServoPart(xy = [0, 0]) {
            return { el: createMicroServoElement(), x: xy[0], y: xy[1], w: 112.188, h: 299.674 };
        }
        visuals.mkMicroServoPart = mkMicroServoPart;
        const SPEED = 300; // 0.1s/60 degree
        class MicroServoView {
            constructor() {
                this.style = "";
                this.overElement = undefined;
                this.defs = [];
                this.currentAngle = 0;
                this.targetAngle = 0;
                this.lastAngleTime = 0;
            }
            init(bus, state, svgEl, otherParams) {
                this.state = state;
                this.pin = this.state.props.servos[pxsim.readPin(otherParams["name"] || otherParams["pin"])];
                this.bus = bus;
                this.defs = [];
                this.initDom();
                this.updateState();
            }
            initDom() {
                this.element = createMicroServoElement();
                this.crankEl = this.element.querySelector("#crank");
                this.crankTransform = this.crankEl.getAttribute("transform");
            }
            moveToCoord(xy) {
                let [x, y] = xy;
                visuals.translateEl(this.element, [x, y]);
            }
            updateState() {
                const p = this.state.getPin(this.pin);
                const continuous = !!p.servoContinuous;
                const servoAngle = p.servoAngle;
                if (continuous) {
                    // for a continuous servo, the angle is interpreted as a rotation speed
                    // 0 -> -100%, 90 - 0%, 180 - 100%
                    const now = pxsim.U.now();
                    const dt = Math.min(now - this.lastAngleTime, 50) / 1000;
                    this.currentAngle = this.targetAngle;
                    this.targetAngle += ((servoAngle - 90) / 90) * SPEED * dt;
                }
                else {
                    this.targetAngle = 180.0 - servoAngle;
                }
                if (this.targetAngle != this.currentAngle)
                    this.renderAngle();
            }
            renderAngle() {
                const now = pxsim.U.now();
                const cx = 56.661;
                const cy = 899.475;
                const dt = Math.min(now - this.lastAngleTime, 50) / 1000;
                const delta = this.targetAngle - this.currentAngle;
                this.currentAngle += Math.min(Math.abs(delta), SPEED * dt) * (delta > 0 ? 1 : -1);
                this.crankEl.setAttribute("transform", this.crankTransform
                    + ` rotate(${this.currentAngle}, ${cx}, ${cy})`);
                this.lastAngleTime = now;
                setTimeout(() => pxsim.runtime.updateDisplay(), 20);
            }
            updateTheme() {
            }
        }
        visuals.MicroServoView = MicroServoView;
    })(visuals = pxsim.visuals || (pxsim.visuals = {}));
})(pxsim || (pxsim = {}));
var pxsim;
(function (pxsim) {
    var control;
    (function (control) {
        function __midiSend(data) {
            const b = pxsim.board();
            pxsim.AudioContextManager.sendMidiMessage(data);
        }
        control.__midiSend = __midiSend;
    })(control = pxsim.control || (pxsim.control = {}));
})(pxsim || (pxsim = {}));
var pxsim;
(function (pxsim) {
    /**
     * Error codes used in the micro:bit runtime.
    */
    let PanicCode;
    (function (PanicCode) {
        // PANIC Codes. These are not return codes, but are terminal conditions.
        // These induce a panic operation, where all code stops executing, and a panic state is
        // entered where the panic code is diplayed.
        // Out out memory error. Heap storage was requested, but is not available.
        PanicCode[PanicCode["MICROBIT_OOM"] = 20] = "MICROBIT_OOM";
        // Corruption detected in the micro:bit heap space
        PanicCode[PanicCode["MICROBIT_HEAP_ERROR"] = 30] = "MICROBIT_HEAP_ERROR";
        // Dereference of a NULL pointer through the ManagedType class,
        PanicCode[PanicCode["MICROBIT_NULL_DEREFERENCE"] = 40] = "MICROBIT_NULL_DEREFERENCE";
    })(PanicCode = pxsim.PanicCode || (pxsim.PanicCode = {}));
    ;
    function panic(code) {
        console.log("PANIC:", code);
        throw new Error("PANIC " + code);
    }
    pxsim.panic = panic;
})(pxsim || (pxsim = {}));
(function (pxsim) {
    var basic;
    (function (basic) {
        basic.pause = pxsim.thread.pause;
        basic.forever = pxsim.thread.forever;
    })(basic = pxsim.basic || (pxsim.basic = {}));
})(pxsim || (pxsim = {}));
(function (pxsim) {
    var control;
    (function (control) {
        control.inBackground = pxsim.thread.runInBackground;
        function onEvent(id, evid, handler) {
            if (id == 3 /* MICROBIT_ID_BUTTON_AB */) {
                const b = pxsim.board().buttonPairState;
                if (!b.usesButtonAB) {
                    b.usesButtonAB = true;
                    pxsim.runtime.queueDisplayUpdate();
                }
            }
            pxsim.pxtcore.registerWithDal(id, evid, handler);
        }
        control.onEvent = onEvent;
        function eventTimestamp() {
            return pxsim.board().bus.getLastEventTime();
        }
        control.eventTimestamp = eventTimestamp;
        function eventValue() {
            return pxsim.board().bus.getLastEventValue();
        }
        control.eventValue = eventValue;
    })(control = pxsim.control || (pxsim.control = {}));
})(pxsim || (pxsim = {}));
(function (pxsim) {
    var input;
    (function (input) {
        function calibrateCompass() {
            // device calibrates...
        }
        input.calibrateCompass = calibrateCompass;
    })(input = pxsim.input || (pxsim.input = {}));
})(pxsim || (pxsim = {}));
(function (pxsim) {
    var pins;
    (function (pins) {
        function onPulsed(name, pulse, body) {
        }
        pins.onPulsed = onPulsed;
        function pulseDuration() {
            return 0;
        }
        pins.pulseDuration = pulseDuration;
        function createBuffer(sz) {
            return pxsim.BufferMethods.createBuffer(sz);
        }
        pins.createBuffer = createBuffer;
        function pulseIn(name, value, maxDuration) {
            let pin = pxsim.getPin(name);
            if (!pin)
                return 0;
            return 5000;
        }
        pins.pulseIn = pulseIn;
        function spiWrite(value) {
            // TODO
            return 0;
        }
        pins.spiWrite = spiWrite;
        function spiTransfer(cmd, resp) {
            // TODO
        }
        pins.spiTransfer = spiTransfer;
        function spiFrequency(f) {
            // TODO
        }
        pins.spiFrequency = spiFrequency;
        function spiFormat(bits, mode) {
            // TODO
        }
        pins.spiFormat = spiFormat;
        function spiPins(mosi, miso, sck) {
            // TODO
        }
        pins.spiPins = spiPins;
        function i2cReadBuffer(address, size, repeat) {
            // fake reading zeros
            return createBuffer(size);
        }
        pins.i2cReadBuffer = i2cReadBuffer;
        function i2cWriteBuffer(address, buf, repeat) {
            // fake - noop
        }
        pins.i2cWriteBuffer = i2cWriteBuffer;
        // this likely shouldn't be called
        function getPinAddress(name) {
            return pxsim.getPin(name);
        }
        pins.getPinAddress = getPinAddress;
        function setEvents(name, event) {
        }
        pins.setEvents = setEvents;
        function setMatrixWidth(pin, width) {
            const lp = pxsim.neopixelState(pin);
            if (!lp)
                return;
            lp.width = width;
        }
        pins.setMatrixWidth = setMatrixWidth;
    })(pins = pxsim.pins || (pxsim.pins = {}));
})(pxsim || (pxsim = {}));
(function (pxsim) {
    var devices;
    (function (devices) {
        function tellCameraTo(action) {
            // TODO
        }
        devices.tellCameraTo = tellCameraTo;
        function tellRemoteControlTo(action) {
            // TODO
        }
        devices.tellRemoteControlTo = tellRemoteControlTo;
        function raiseAlertTo(action) {
            // TODO
        }
        devices.raiseAlertTo = raiseAlertTo;
        function onSignalStrengthChanged(action) {
            // TODO
        }
        devices.onSignalStrengthChanged = onSignalStrengthChanged;
        function signalStrength() {
            // TODO
            return 0;
        }
        devices.signalStrength = signalStrength;
        function onGamepadButton(button, body) {
            // TODO
        }
        devices.onGamepadButton = onGamepadButton;
    })(devices = pxsim.devices || (pxsim.devices = {}));
})(pxsim || (pxsim = {}));
(function (pxsim) {
    var bluetooth;
    (function (bluetooth) {
        function startIOPinService() {
            // TODO
        }
        bluetooth.startIOPinService = startIOPinService;
        function startLEDService() {
            // TODO
        }
        bluetooth.startLEDService = startLEDService;
        function startTemperatureService() {
            // TODO
        }
        bluetooth.startTemperatureService = startTemperatureService;
        function startMagnetometerService() {
            // TODO
        }
        bluetooth.startMagnetometerService = startMagnetometerService;
        function startAccelerometerService() {
            // TODO
        }
        bluetooth.startAccelerometerService = startAccelerometerService;
        function startButtonService() {
            // TODO
        }
        bluetooth.startButtonService = startButtonService;
        function startUartService() {
            // TODO
        }
        bluetooth.startUartService = startUartService;
        function uartWriteString(s) {
            pxsim.serial.writeString(s);
        }
        bluetooth.uartWriteString = uartWriteString;
        function uartWriteBuffer(b) {
            pxsim.serial.writeBuffer(b);
        }
        bluetooth.uartWriteBuffer = uartWriteBuffer;
        function uartReadBuffer() {
            return pxsim.pins.createBuffer(0);
        }
        bluetooth.uartReadBuffer = uartReadBuffer;
        function uartReadUntil(del) {
            return pxsim.serial.readUntil(del);
        }
        bluetooth.uartReadUntil = uartReadUntil;
        function onUartDataReceived(delimiters, handler) {
            let b = pxsim.board();
            b.bus.listen(1200 /* MICROBIT_ID_BLE_UART */, 1 /* MICROBIT_UART_S_EVT_DELIM_MATCH */, handler);
        }
        bluetooth.onUartDataReceived = onUartDataReceived;
        function onBluetoothConnected(a) {
            // TODO
        }
        bluetooth.onBluetoothConnected = onBluetoothConnected;
        function onBluetoothDisconnected(a) {
            // TODO
        }
        bluetooth.onBluetoothDisconnected = onBluetoothDisconnected;
        function advertiseUrl(url, power, connectable) { }
        bluetooth.advertiseUrl = advertiseUrl;
        function advertiseUidBuffer(nsAndInstance, power, connectable) { }
        bluetooth.advertiseUidBuffer = advertiseUidBuffer;
        function stopAdvertising() { }
        bluetooth.stopAdvertising = stopAdvertising;
        function setTransmitPower(power) { }
        bluetooth.setTransmitPower = setTransmitPower;
    })(bluetooth = pxsim.bluetooth || (pxsim.bluetooth = {}));
})(pxsim || (pxsim = {}));
(function (pxsim) {
    var light;
    (function (light) {
        function sendWS2812Buffer(buffer, pin) {
            pxsim.sendBufferAsm(buffer, pin);
        }
        light.sendWS2812Buffer = sendWS2812Buffer;
        function sendWS2812BufferWithBrightness(buffer, pin, brightness) {
            const clone = new pxsim.RefBuffer(new Uint8Array(buffer.data));
            const data = clone.data;
            for (let i = 0; i < data.length; ++i) {
                data[i] = (data[i] * brightness) >> 8;
            }
            pxsim.sendBufferAsm(clone, pin);
        }
        light.sendWS2812BufferWithBrightness = sendWS2812BufferWithBrightness;
        function setMode(pin, mode) {
            const lp = pxsim.neopixelState(pin);
            if (!lp)
                return;
            lp.mode = mode & 0xff;
        }
        light.setMode = setMode;
    })(light = pxsim.light || (pxsim.light = {}));
})(pxsim || (pxsim = {}));
var pxsim;
(function (pxsim) {
    class SpeakerState {
    }
    pxsim.SpeakerState = SpeakerState;
})(pxsim || (pxsim = {}));
(function (pxsim) {
    var music;
    (function (music) {
        function setBuiltInSpeakerEnabled(enabled) {
            const b = pxsim.board();
            if (!b)
                return;
            // TODO some rendering about this
            // b.ensureHardwareVersion(2);
            b.speakerEnabled = !!enabled;
        }
        music.setBuiltInSpeakerEnabled = setBuiltInSpeakerEnabled;
        function speakerPlayTone(frequency, ms) {
            const b = pxsim.board();
            b.speakerState.frequency = frequency;
            b.speakerState.ms = ms;
            pxsim.runtime.queueDisplayUpdate();
            let cb = pxsim.getResume();
            pxsim.AudioContextManager.tone(frequency, 1);
            if (ms <= 0)
                cb();
            else {
                setTimeout(() => {
                    pxsim.AudioContextManager.stop();
                    b.speakerState.frequency = 0;
                    b.speakerState.ms = 0;
                    pxsim.runtime.queueDisplayUpdate();
                    cb();
                }, ms);
            }
        }
        music.speakerPlayTone = speakerPlayTone;
        function setSilenceLevel(level) {
            // ignore in v1,v2
        }
        music.setSilenceLevel = setSilenceLevel;
        function isSoundPlaying() {
            const audioActive = pxsim.AudioContextManager.isAudioElementActive();
            const soundExpressionPlaying = pxsim.codal.music.isSoundExpPlaying();
            return audioActive || soundExpressionPlaying || pxsim.record.audioIsPlaying();
        }
        music.isSoundPlaying = isSoundPlaying;
    })(music = pxsim.music || (pxsim.music = {}));
})(pxsim || (pxsim = {}));
var pxsim;
(function (pxsim) {
    var music;
    (function (music) {
        var MusicalIntervals;
        (function (MusicalIntervals) {
            // #if CONFIG_ENABLED(JUST_SCALE)
            // const float MusicalIntervals.chromaticInterval[] = [1.000000, 1.059463, 1.122462, 1.189207, 1.259921, 1.334840, 1.414214, 1.498307, 1.587401, 1.681793, 1.781797, 1.887749];
            // #else
            // const float MusicalIntervals.chromaticInterval[] = [1.000000, 1.0417, 1.1250, 1.2000, 1.2500, 1.3333, 1.4063, 1.5000, 1.6000, 1.6667, 1.8000, 1.8750];
            // #endif
            MusicalIntervals.chromaticInterval = [1.000000, 1.0417, 1.1250, 1.2000, 1.2500, 1.3333, 1.4063, 1.5000, 1.6000, 1.6667, 1.8000, 1.8750];
            MusicalIntervals.majorScaleInterval = [MusicalIntervals.chromaticInterval[0], MusicalIntervals.chromaticInterval[2], MusicalIntervals.chromaticInterval[4], MusicalIntervals.chromaticInterval[5], MusicalIntervals.chromaticInterval[7], MusicalIntervals.chromaticInterval[9], MusicalIntervals.chromaticInterval[11]];
            MusicalIntervals.minorScaleInterval = [MusicalIntervals.chromaticInterval[0], MusicalIntervals.chromaticInterval[2], MusicalIntervals.chromaticInterval[3], MusicalIntervals.chromaticInterval[5], MusicalIntervals.chromaticInterval[7], MusicalIntervals.chromaticInterval[8], MusicalIntervals.chromaticInterval[10]];
            MusicalIntervals.pentatonicScaleInterval = [MusicalIntervals.chromaticInterval[0], MusicalIntervals.chromaticInterval[2], MusicalIntervals.chromaticInterval[4], MusicalIntervals.chromaticInterval[7], MusicalIntervals.chromaticInterval[9]];
            MusicalIntervals.majorTriadInterval = [MusicalIntervals.chromaticInterval[0], MusicalIntervals.chromaticInterval[4], MusicalIntervals.chromaticInterval[7]];
            MusicalIntervals.minorTriadInterval = [MusicalIntervals.chromaticInterval[0], MusicalIntervals.chromaticInterval[3], MusicalIntervals.chromaticInterval[7]];
            MusicalIntervals.diminishedInterval = [MusicalIntervals.chromaticInterval[0], MusicalIntervals.chromaticInterval[3], MusicalIntervals.chromaticInterval[6], MusicalIntervals.chromaticInterval[9]];
            MusicalIntervals.wholeToneInterval = [MusicalIntervals.chromaticInterval[0], MusicalIntervals.chromaticInterval[2], MusicalIntervals.chromaticInterval[4], MusicalIntervals.chromaticInterval[6], MusicalIntervals.chromaticInterval[8], MusicalIntervals.chromaticInterval[10]];
        })(MusicalIntervals = music.MusicalIntervals || (music.MusicalIntervals = {}));
    })(music = pxsim.music || (pxsim.music = {}));
})(pxsim || (pxsim = {}));
(function (pxsim) {
    var music;
    (function (music) {
        var MusicalProgressions;
        (function (MusicalProgressions) {
            MusicalProgressions.chromatic = { interval: music.MusicalIntervals.chromaticInterval, length: 12 };
            MusicalProgressions.majorScale = { interval: music.MusicalIntervals.majorScaleInterval, length: 7 };
            MusicalProgressions.minorScale = { interval: music.MusicalIntervals.minorScaleInterval, length: 7 };
            MusicalProgressions.pentatonicScale = { interval: music.MusicalIntervals.pentatonicScaleInterval, length: 5 };
            MusicalProgressions.majorTriad = { interval: music.MusicalIntervals.majorTriadInterval, length: 3 };
            MusicalProgressions.minorTriad = { interval: music.MusicalIntervals.minorTriadInterval, length: 3 };
            MusicalProgressions.diminished = { interval: music.MusicalIntervals.diminishedInterval, length: 4 };
            MusicalProgressions.wholeTone = { interval: music.MusicalIntervals.wholeToneInterval, length: 6 };
            /**
             * Determine the frequency of a given note in a given progressions
             *
             * @param root The root frequency of the progression
             * @param progression The Progression to use
             * @param offset The offset (interval) of the note to generate
             * @return The frequency of the note requested in Hz.
             */
            function calculateFrequencyFromProgression(root, progression, offset) {
                let octave = Math.floor(offset / progression.length);
                let index = offset % progression.length;
                return root * Math.pow(2, octave) * progression.interval[index];
            }
            MusicalProgressions.calculateFrequencyFromProgression = calculateFrequencyFromProgression;
        })(MusicalProgressions = music.MusicalProgressions || (music.MusicalProgressions = {}));
    })(music = pxsim.music || (pxsim.music = {}));
})(pxsim || (pxsim = {}));
var pxsim;
(function (pxsim) {
    class RecordingState {
        constructor() {
            this.currentlyRecording = false;
            this.audioPlaying = false;
            this.handleAudioPlaying = () => {
                this.audioPlaying = true;
            };
            this.handleAudioStopped = () => {
                this.audioPlaying = false;
            };
            this.initListeners = () => {
                if (this.recording) {
                    this.recording.addEventListener("play", this.handleAudioPlaying, false);
                    this.recording.addEventListener("ended", this.handleAudioStopped, false);
                }
            };
        }
    }
    pxsim.RecordingState = RecordingState;
})(pxsim || (pxsim = {}));
(function (pxsim) {
    var record;
    (function (record_1) {
        let _initialized = false;
        function init() {
            if (!_initialized) {
                registerSimStop();
                _initialized = true;
            }
        }
        function stopRecorder(b) {
            b.recordingState.recorder.stop();
            b.recordingState.currentlyRecording = false;
            pxsim.runtime.queueDisplayUpdate();
            if (b.recordingState.stream.active) {
                b.recordingState.stream.getAudioTracks().forEach(track => {
                    track.stop();
                    track.enabled = false;
                });
            }
        }
        async function populateRecording(b) {
            if (b.recordingState.currentlyErasing) {
                await erasingAsync(b);
            }
            if (b.recordingState.chunks[0].size > 0) {
                b.recordingState.audioURL = null;
                const recordingType = pxsim.isSafari() ? "audio/mp4" : "audio/ogg; codecs=opus";
                const blob = new Blob(b.recordingState.chunks, { type: recordingType });
                b.recordingState.audioURL = window.URL.createObjectURL(blob);
                b.recordingState.recording = new Audio(b.recordingState.audioURL);
                b.recordingState.initListeners();
            }
            b.recordingState.currentlyRecording = false;
            b.recordingState.recorder = null;
            b.recordingState.chunks = [];
        }
        async function record() {
            let b = pxsim.board();
            init();
            if (b.recordingState.recorder) {
                b.recordingState.recorder.stop();
                clearTimeout(b.recordingState.recordTimeoutID);
            }
            if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
                try {
                    b.recordingState.stream = await navigator.mediaDevices.getUserMedia({ video: false, audio: true });
                    b.recordingState.recorder = new MediaRecorder(b.recordingState.stream);
                    b.recordingState.recorder.start();
                    b.recordingState.currentlyRecording = true;
                    pxsim.runtime.queueDisplayUpdate();
                    b.recordingState.recordTimeoutID = setTimeout(() => {
                        stopRecorder(b);
                    }, 5000);
                    b.recordingState.recorder.ondataavailable = (e) => {
                        b.recordingState.chunks.push(e.data);
                    };
                    b.recordingState.recorder.onstop = async () => {
                        await populateRecording(b);
                    };
                }
                catch (error) {
                    console.log("An error occurred, could not get microphone access");
                    if (b.recordingState.recorder) {
                        b.recordingState.recorder.stop();
                    }
                    b.recordingState.currentlyRecording = false;
                }
            }
            else {
                console.log("getUserMedia not supported on your browser!");
                b.recordingState.currentlyRecording = false;
            }
        }
        record_1.record = record;
        function stopAudio() {
            const b = pxsim.board();
            if (!b)
                return;
            if (b.recordingState.currentlyRecording && b.recordingState.recordTimeoutID) {
                clearTimeout(b.recordingState.recordTimeoutID);
                if (b.recordingState.recorder) {
                    stopRecorder(b);
                }
            }
            else if (b.recordingState.recording && b.recordingState.audioPlaying) {
                b.recordingState.handleAudioStopped();
                stopPlayback();
            }
        }
        function registerSimStop() {
            pxsim.AudioContextManager.onStopAll(() => {
                const b = pxsim.board();
                if (b && b.recordingState && b.recordingState.recording) {
                    stopAudio();
                    b.recordingState.recording.removeEventListener("play", b.recordingState.handleAudioPlaying);
                    b.recordingState.recording.removeEventListener("ended", b.recordingState.handleAudioStopped);
                }
            });
        }
        function play() {
            const b = pxsim.board();
            if (!b)
                return;
            init();
            stopAudio();
            b.recordingState.audioPlaying = true;
            setTimeout(async () => {
                if (!b.recordingState.currentlyErasing && b.recordingState.recording) {
                    try {
                        const volume = pxsim.AudioContextManager.isMuted() ? 0 : 1;
                        b.recordingState.recording.volume = volume;
                        await b.recordingState.recording.play();
                    }
                    catch (e) {
                        if (!(e instanceof DOMException)) {
                            throw e;
                        }
                    }
                }
                else {
                    b.recordingState.audioPlaying = false;
                }
            }, 10);
        }
        record_1.play = play;
        function stop() {
            stopAudio();
        }
        record_1.stop = stop;
        function stopPlayback() {
            const b = pxsim.board();
            if (!b)
                return;
            b.recordingState.recording.pause();
            b.recordingState.recording.currentTime = 0;
            b.recordingState.recording.removeEventListener("play", b.recordingState.handleAudioPlaying);
            b.recordingState.recording.removeEventListener("ended", b.recordingState.handleAudioStopped);
        }
        function erasingAsync(b) {
            return new Promise((resolve, reject) => {
                if (b.recordingState.recording && b.recordingState.audioPlaying) {
                    stopPlayback();
                }
                if (b.recordingState.audioURL) {
                    window.URL.revokeObjectURL(b.recordingState.audioURL);
                    b.recordingState.recording = null;
                }
                b.recordingState.audioPlaying = false;
                resolve(null);
                b.recordingState.currentlyErasing = false;
            });
        }
        function erase() {
            const b = pxsim.board();
            if (!b)
                return;
            b.recordingState.chunks = [];
            b.recordingState.currentlyErasing = true;
        }
        record_1.erase = erase;
        function setMicrophoneGain(gain) {
        }
        record_1.setMicrophoneGain = setMicrophoneGain;
        function audioDuration(sampleRate) {
            return 0;
        }
        record_1.audioDuration = audioDuration;
        function audioIsPlaying() {
            const b = pxsim.board();
            if (!b)
                return false;
            return b.recordingState.audioPlaying;
        }
        record_1.audioIsPlaying = audioIsPlaying;
        function audioIsRecording() {
            const b = pxsim.board();
            if (!b)
                return false;
            return b.recordingState.recorder ? b.recordingState.recorder.state === "recording" : false;
        }
        record_1.audioIsRecording = audioIsRecording;
        function audioIsStopped() {
            const b = pxsim.board();
            if (!b)
                return true;
            const isNotPlaying = !audioIsPlaying();
            const isNotRecording = !audioIsRecording();
            return b.recordingState.recording ? isNotPlaying && isNotRecording : false;
        }
        record_1.audioIsStopped = audioIsStopped;
        function setInputSampleRate(sampleRate) {
        }
        record_1.setInputSampleRate = setInputSampleRate;
        function setOutputSampleRate(sampleRate) {
        }
        record_1.setOutputSampleRate = setOutputSampleRate;
        function setBothSamples(sampleRate) {
        }
        record_1.setBothSamples = setBothSamples;
    })(record = pxsim.record || (pxsim.record = {}));
})(pxsim || (pxsim = {}));
var pxsim;
(function (pxsim) {
    var basic;
    (function (basic) {
        function setLedColor(c) {
            pxsim.board().rgbLedLeftState = c;
            pxsim.board().rgbLedState = c;
            pxsim.board().rgbLedRightState = c;
            pxsim.runtime.queueDisplayUpdate();
        }
        basic.setLedColor = setLedColor;
        function setLedColors(c1, c2, c3) {
        }
        basic.setLedColors = setLedColors;
        function setLedColorDal(c) {
            pxsim.board().rgbLedState = c;
            pxsim.runtime.queueDisplayUpdate();
        }
        basic.setLedColorDal = setLedColorDal;
        function setLedColorsCodal(c1, c2, c3) {
            pxsim.board().rgbLedLeftState = c1;
            pxsim.board().rgbLedState = c2;
            pxsim.board().rgbLedRightState = c3;
            pxsim.runtime.queueDisplayUpdate();
        }
        basic.setLedColorsCodal = setLedColorsCodal;
        function turnRgbLedOff() {
            pxsim.board().rgbLedLeftState = 0;
            pxsim.board().rgbLedState = 0;
            pxsim.board().rgbLedRightState = 0;
            pxsim.runtime.queueDisplayUpdate();
        }
        basic.turnRgbLedOff = turnRgbLedOff;
    })(basic = pxsim.basic || (pxsim.basic = {}));
})(pxsim || (pxsim = {}));
var pxsim;
(function (pxsim) {
    const SERIAL_BUFFER_LENGTH = 16;
    class SerialState {
        constructor(runtime, board) {
            this.runtime = runtime;
            this.board = board;
            this.serialIn = [];
            this.serialOutBuffer = "";
            this.board.addMessageListener(this.handleMessage.bind(this));
        }
        handleMessage(msg) {
            if (msg.type === "serial") {
                const data = msg.data || "";
                this.receiveData(data);
            }
        }
        receiveData(data) {
            this.serialIn.push();
        }
        readSerial() {
            let v = this.serialIn.shift() || "";
            return v;
        }
        writeSerial(s) {
            this.serialOutBuffer += s;
            if (/\n/.test(this.serialOutBuffer) || this.serialOutBuffer.length > SERIAL_BUFFER_LENGTH) {
                pxsim.Runtime.postMessage({
                    type: 'serial',
                    data: this.serialOutBuffer,
                    id: pxsim.runtime.id,
                    sim: true
                });
                this.serialOutBuffer = '';
            }
        }
        writeCsv(s, type) {
            pxsim.Runtime.postMessage({
                type: 'serial',
                data: s,
                id: pxsim.runtime.id,
                csvType: type,
                sim: true
            });
        }
    }
    pxsim.SerialState = SerialState;
})(pxsim || (pxsim = {}));
(function (pxsim) {
    var serial;
    (function (serial) {
        function writeString(s) {
            pxsim.board().writeSerial(s);
        }
        serial.writeString = writeString;
        function writeBuffer(buf) {
            // TODO
        }
        serial.writeBuffer = writeBuffer;
        function readUntil(del) {
            return readString();
        }
        serial.readUntil = readUntil;
        function readString() {
            return pxsim.board().serialState.readSerial();
        }
        serial.readString = readString;
        function onDataReceived(delimiters, handler) {
            let b = pxsim.board();
            b.bus.listen(12 /* MICROBIT_ID_SERIAL */, 1 /* MICROBIT_SERIAL_EVT_DELIM_MATCH */, handler);
        }
        serial.onDataReceived = onDataReceived;
        function redirect(tx, rx, rate) {
            // TODO?
        }
        serial.redirect = redirect;
        function redirectToUSB() {
            // TODO
        }
        serial.redirectToUSB = redirectToUSB;
        function setRxBufferSize(size) {
            // TODO
        }
        serial.setRxBufferSize = setRxBufferSize;
        function setTxBufferSize(size) {
            // TODO
        }
        serial.setTxBufferSize = setTxBufferSize;
        function readBuffer(length) {
            length |= 0;
            if (length <= 0)
                length = 64;
            return pxsim.pins.createBuffer(length);
        }
        serial.readBuffer = readBuffer;
        function setBaudRate(rate) {
            // TODO
        }
        serial.setBaudRate = setBaudRate;
        function writeDmesg() {
            // TODO
        }
        serial.writeDmesg = writeDmesg;
    })(serial = pxsim.serial || (pxsim.serial = {}));
})(pxsim || (pxsim = {}));
var pxsim;
(function (pxsim) {
    var music;
    (function (music) {
        //%
        function __playSoundExpression(notes, waitTillDone) {
            notes = lookupBuiltIn(notes);
            pxsim.codal.music.__playSoundExpression(notes, waitTillDone);
        }
        music.__playSoundExpression = __playSoundExpression;
        function __stopSoundExpressions() {
            pxsim.codal.music.__stopSoundExpressions();
        }
        music.__stopSoundExpressions = __stopSoundExpressions;
        const giggle = "giggle";
        const giggleData = "010230988019008440044008881023001601003300240000000000000000000000000000,110232570087411440044008880352005901003300010000000000000000010000000000,310232729021105440288908880091006300000000240700020000000000003000000000,310232729010205440288908880091006300000000240700020000000000003000000000,310232729011405440288908880091006300000000240700020000000000003000000000";
        const happy = "happy";
        const happyData = "010231992066911440044008880262002800001800020500000000000000010000000000,002322129029508440240408880000000400022400110000000000000000007500000000,000002129029509440240408880145000400022400110000000000000000007500000000";
        const hello = "hello";
        const helloData = "310230673019702440118708881023012800000000240000000000000000000000000000,300001064001602440098108880000012800000100040000000000000000000000000000,310231064029302440098108881023012800000100040000000000000000000000000000";
        const mysterious = "mysterious";
        const mysteriousData = "400002390033100440240408880477000400022400110400000000000000008000000000,405512845385000440044008880000012803010500160000000000000000085000500015";
        const sad = "sad";
        const sadData = "310232226070801440162408881023012800000100240000000000000000000000000000,310231623093602440093908880000012800000100240000000000000000000000000000";
        const slide = "slide";
        const slideData = "105202325022302440240408881023012801020000110400000000000000010000000000,010232520091002440044008881023012801022400110400000000000000010000000000";
        const soaring = "soaring";
        const soaringData = "210234009530905440599908881023002202000400020250000000000000020000000000,402233727273014440044008880000003101024400030000000000000000000000000000";
        const spring = "spring";
        const springData = "306590037116312440058708880807003400000000240000000000000000050000000000,010230037116313440058708881023003100000000240000000000000000050000000000";
        const twinkle = "twinkle";
        const twinkleData = "010180007672209440075608880855012800000000240000000000000000000000000000";
        const yawn = "yawn";
        const yawnData = "200002281133202440150008881023012801024100240400030000000000010000000000,005312520091002440044008880636012801022400110300000000000000010000000000,008220784019008440044008880681001600005500240000000000000000005000000000,004790784019008440044008880298001600000000240000000000000000005000000000,003210784019008440044008880108001600003300080000000000000000005000000000";
        function lookupBuiltIn(sound) {
            if (sound == giggle)
                return giggleData;
            if (sound == happy)
                return happyData;
            if (sound == hello)
                return helloData;
            if (sound == mysterious)
                return mysteriousData;
            if (sound == sad)
                return sadData;
            if (sound == slide)
                return slideData;
            if (sound == soaring)
                return soaringData;
            if (sound == spring)
                return springData;
            if (sound == twinkle)
                return twinkleData;
            if (sound == yawn)
                return yawnData;
            return sound;
        }
    })(music = pxsim.music || (pxsim.music = {}));
})(pxsim || (pxsim = {}));
var pxsim;
(function (pxsim) {
    var motors;
    (function (motors) {
        function motorPower(power) {
            // TODO
        }
        motors.motorPower = motorPower;
        function motorCommand(command) {
        }
        motors.motorCommand = motorCommand;
        function dualMotorPower(motor, percent) {
        }
        motors.dualMotorPower = dualMotorPower;
        function motorPowerDal(power) {
            // TODO
        }
        motors.motorPowerDal = motorPowerDal;
        function motorCommandDal(command) {
        }
        motors.motorCommandDal = motorCommandDal;
        function dualMotorPowerDal(motor, percent) {
        }
        motors.dualMotorPowerDal = dualMotorPowerDal;
    })(motors = pxsim.motors || (pxsim.motors = {}));
})(pxsim || (pxsim = {}));
var pxsim;
(function (pxsim) {
    var storage;
    (function (storage) {
        function putValueInt(key, value) {
            sessionStorage.setItem('simulatorValue_' + key, value + "");
        }
        storage.putValueInt = putValueInt;
        function getValueInt(key) {
            if (sessionStorage.getItem('simulatorValue_' + key)) {
                return parseFloat(sessionStorage.getItem('simulatorValue_' + key));
            }
            else {
                return 0;
            }
        }
        storage.getValueInt = getValueInt;
        function remove(key) {
            sessionStorage.removeItem('simulatorValue_' + key);
        }
        storage.remove = remove;
    })(storage = pxsim.storage || (pxsim.storage = {}));
})(pxsim || (pxsim = {}));
var pxsim;
(function (pxsim) {
    class ThermometerState {
        constructor() {
            this.usesTemperature = false;
            this.temperature = 21;
        }
    }
    pxsim.ThermometerState = ThermometerState;
})(pxsim || (pxsim = {}));
(function (pxsim) {
    var input;
    (function (input) {
        function temperature() {
            let b = pxsim.board();
            if (!b.thermometerState.usesTemperature) {
                b.thermometerState.usesTemperature = true;
                pxsim.runtime.queueDisplayUpdate();
            }
            return b.thermometerState.temperature;
        }
        input.temperature = temperature;
    })(input = pxsim.input || (pxsim.input = {}));
})(pxsim || (pxsim = {}));
var pxsim;
(function (pxsim) {
    var visuals;
    (function (visuals) {
        visuals.mkBoardView = (opts) => {
            return new visuals.MicrobitBoardSvg({
                runtime: pxsim.runtime,
                theme: visuals.randomTheme(),
                wireframe: opts.wireframe
            });
        };
    })(visuals = pxsim.visuals || (pxsim.visuals = {}));
})(pxsim || (pxsim = {}));
/// <reference path="../../node_modules/pxt-core/built/pxtsim.d.ts"/>
var pxsim;
(function (pxsim) {
    var visuals;
    (function (visuals) {
        function mkLedMatrixSvg(xy, rows, cols) {
            let result = { el: null, y: 0, x: 0, w: 0, h: 0, leds: [], ledsOuter: [], background: null };
            result.el = pxsim.svg.elt("g");
            let width = cols * visuals.PIN_DIST;
            let height = rows * visuals.PIN_DIST;
            let ledRad = Math.round(visuals.PIN_DIST * .35);
            let spacing = visuals.PIN_DIST;
            let padding = (spacing - 2 * ledRad) / 2.0;
            let [x, y] = xy;
            let left = x - (ledRad + padding);
            let top = y - (ledRad + padding);
            result.x = left;
            result.y = top;
            result.w = width;
            result.h = height;
            result.background = pxsim.svg.child(result.el, "rect", { class: "sim-display", x: left, y: top, width: width, height: height });
            // ledsOuter
            result.leds = [];
            result.ledsOuter = [];
            let hoverRad = ledRad * 1.2;
            for (let i = 0; i < rows; ++i) {
                let y = top + ledRad + i * spacing + padding;
                for (let j = 0; j < cols; ++j) {
                    let x = left + ledRad + j * spacing + padding;
                    result.ledsOuter.push(pxsim.svg.child(result.el, "circle", { class: "sim-led-back", cx: x, cy: y, r: ledRad }));
                    result.leds.push(pxsim.svg.child(result.el, "circle", { class: "sim-led", cx: x, cy: y, r: hoverRad, title: `(${j},${i})` }));
                }
            }
            //default theme
            pxsim.svg.fill(result.background, visuals.defaultLedMatrixTheme.background);
            pxsim.svg.fills(result.leds, visuals.defaultLedMatrixTheme.ledOn);
            pxsim.svg.fills(result.ledsOuter, visuals.defaultLedMatrixTheme.ledOff);
            //turn off LEDs
            result.leds.forEach(l => l.style.opacity = 0 + "");
            return result;
        }
        visuals.mkLedMatrixSvg = mkLedMatrixSvg;
        visuals.defaultLedMatrixTheme = {
            background: "#000",
            ledOn: "#ff5f5f",
            ledOff: "#DDD",
        };
        visuals.LED_MATRIX_STYLE = `
            .sim-led-back:hover {
                stroke:#a0a0a0;
                stroke-width:3px;
            }
            .sim-led:hover {
                stroke:#ff7f7f;
                stroke-width:3px;
            }
            `;
        class LedMatrixView {
            constructor() {
                this.DRAW_SIZE = 8;
                this.ACTIVE_SIZE = 5;
                this.style = visuals.LED_MATRIX_STYLE;
            }
            init(bus, state) {
                this.bus = bus;
                this.state = state;
                this.theme = visuals.defaultLedMatrixTheme;
                this.defs = [];
                this.element = this.buildDom();
            }
            moveToCoord(xy) {
                visuals.translateEl(this.element, xy);
            }
            updateTheme() {
                pxsim.svg.fill(this.background, this.theme.background);
                pxsim.svg.fills(this.leds, this.theme.ledOn);
                pxsim.svg.fills(this.ledsOuter, this.theme.ledOff);
            }
            updateState() {
                if (this.state.disabled) {
                    this.leds.forEach((led, i) => {
                        let sel = led;
                        sel.style.opacity = 0 + "";
                    });
                    return;
                }
                const bw = this.state.displayMode == pxsim.DisplayMode.bw;
                const img = this.state.image;
                this.leds.forEach((led, i) => {
                    let sel = led;
                    let dx = i % this.DRAW_SIZE;
                    let dy = (i - dx) / this.DRAW_SIZE;
                    if (dx < this.ACTIVE_SIZE && dy < this.ACTIVE_SIZE) {
                        let j = dx + dy * this.ACTIVE_SIZE;
                        sel.style.opacity = ((bw ? img.data[j] > 0 ? 255 : 0 : img.data[j]) / 255.0) + "";
                    }
                    else {
                        sel.style.opacity = 0 + "";
                    }
                });
            }
            buildDom() {
                let res = mkLedMatrixSvg([0, 0], this.DRAW_SIZE, this.DRAW_SIZE);
                let display = res.el;
                this.background = res.background;
                this.leds = res.leds;
                this.ledsOuter = res.ledsOuter;
                return display;
            }
        }
        visuals.LedMatrixView = LedMatrixView;
    })(visuals = pxsim.visuals || (pxsim.visuals = {}));
})(pxsim || (pxsim = {}));
var pxsim;
(function (pxsim) {
    var visuals;
    (function (visuals) {
        const MB_STYLE = `
        .simEventBtn {
            font-size: 1.4rem;
            font-weight: 900;
            padding: 1.25rem 1.75rem;
            border-radius: 3.5rem / 100%;
            border: 0;
            cursor: pointer;
            text-transform: uppercase;
            letter-spacing: 0.07em;
            color: white;
            background: #42c9c9;
            font-family: 'Roboto Mono', monospace;
        }
        button:hover {
            opacity: .7;
        }
        button:active {
            background: #e6007d;
        }

        svg.sim {
            margin-bottom:1em;
        }
        svg.sim.grayscale {
            -moz-filter: grayscale(1);
            -webkit-filter: grayscale(1);
            filter: grayscale(1);
        }
        .sim-button-group {
            cursor: pointer;
        }
        .sim-head .sim-button {
            pointer-events: unset;
        }
        .sim-button {
            pointer-events: none;
        }
        .sim-board, .sim-display, sim-button {
            fill: #111;
        }
        .sim-button-outer:hover {
            stroke:grey;
            stroke-width: 3px;
        }
        .sim-button-nut {
            fill:#704A4A;
            pointer-events:none;
        }
        .sim-button-nut:hover {
            stroke:1px solid #704A4A;
        }
        .sim-pin {
            cursor: pointer;
        }
        .sim-pin:hover {
            stroke:#D4AF37;
            stroke-width:2px;
        }
        .sim-pin-touch.touched:hover {
            stroke:darkorange;
        }
        .sim-led-back:hover {
            stroke:#fff;
            stroke-width:3px;
        }
        .sim-led:hover {
            stroke:#ff7f7f;
            stroke-width:3px;
        }

        .sim-systemled {
            fill:#333;
            stroke:#555;
            stroke-width: 1px;
        }

        .sim-light-level-button {
            stroke:#ccc;
            stroke-width: 2px;
        }

        .sim-antenna {
            fill-opacity:0.0;
            stroke:#555;
            stroke-width: 4px;
        }

        .sim-text {
            font-family: 'Roboto Mono', monospace;
            font-size:14px;
            fill:#fff;
            pointer-events: none; user-select: none;
        }

        .sim-text-pin {
            font-family: 'Roboto Mono', monospace;
            pointer-events: none; user-select: none;
            fill:#000;
            font-size:24px;
            stroke:#fff;
            stroke-alignment: outside;
            paint-order: stroke;
            stroke-width: 3px;
        }

        .sim-thermometer {
            stroke:#aaa;
            stroke-width: 2px;
        }

        .inverted {
            fill:#000;
            stroke:#fff;
            stroke-alignment: outside;
            paint-order: stroke;
            stroke-width: 3px;
        }
        .big {
            font-size:24px;
            font-weight: bold;
        }
        .centered {
            transform: translateX(-1.5ch);
            text-align: center;
        }

        /* animations */
        .sim-theme-glow {
            animation-name: sim-theme-glow-animation;
            animation-timing-function: ease-in-out;
            animation-direction: alternate;
            animation-iteration-count: infinite;
            animation-duration: 1.25s;
        }
        @keyframes sim-theme-glow-animation {
            from { opacity: 1; }
            to   { opacity: 0.75; }
        }

        .sim-flash {
            animation-name: sim-flash-animation;
            animation-duration: 0.1s;
        }

        @keyframes sim-flash-animation {
            from { fill: yellow; }
            to   { fill: default; }
        }

        .sim-flash-stroke {
            animation-name: sim-flash-stroke-animation;
            animation-duration: 0.4s;
            animation-timing-function: ease-in;
        }

        @keyframes sim-flash-stroke-animation {
            from { stroke: yellow; }
            to   { stroke: default; }
        }

        /* wireframe */
        .sim-wireframe * {
            fill: none;
            stroke: black;
        }
        .sim-wireframe .sim-display,
        .sim-wireframe .sim-led,
        .sim-wireframe .sim-led-back,
        .sim-wireframe .sim-head,
        .sim-wireframe .sim-theme,
        .sim-wireframe .sim-button-group,
        .sim-wireframe .sim-button-label,
        .sim-wireframe .sim-button,
        .sim-wireframe .sim-text-pin
        {
            visibility: hidden;
        }
        .sim-wireframe .sim-label
        {
            stroke: none;
            fill: #777;
        }
        .sim-label, .sim-button-label {
            fill: #000;
        }
        .sim-wireframe .sim-board {
            stroke-width: 2px;
        }
        *:focus {
            outline: none;
        }
        *:focus .sim-button-outer,
        .sim-pin:focus,
        .sim-thermometer:focus,
        .sim-shake:focus,
        .sim-light-level-button:focus {
            stroke: #4D90FE;
            stroke-width: 5px !important;
        }
        .no-drag, .sim-text, .sim-text-pin {
            user-drag: none;
            user-select: none;
            -moz-user-select: none;
            -webkit-user-drag: none;
            -webkit-user-select: none;
            -ms-user-select: none;
        }

        .shake_animation {
            animation: shake 0.42s cubic-bezier(.36,.07,.19,.97) both;
            transform: translate3d(0, 0, 0);
            backface-visibility: hidden;
        }

        @keyframes shake {
            10%, 90% {
              transform: translate3d(-1px, 0, 0);
            }
            
            20%, 80% {
              transform: translate3d(2px, 0, 0);
            }
          
            30%, 50%, 70% {
              transform: translate3d(-4px, 0, 0);
            }
          
            40%, 60% {
              transform: translate3d(4px, 0, 0);
            }
          }
    `;
        // const BOARD_SVG = pxsim.svg;
        const BOARD_SVG_HEAD = `<?xml version="1.0" encoding="utf-8"?>
    <svg version="1.1" id="calliopemini" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px"
         y="0px" viewBox="0 0 530 630" style="enable-background:new 0 0 530 630;" xml:space="preserve">
    <style type="text/css">
        .st0{fill:#F6C426;}
        .st1{opacity:0.19;fill:#FFFFFF;enable-background:new;}
        .st2{fill:#044854;}
        .st3{fill:none;stroke:#FFFFFF;stroke-width:1.2;stroke-miterlimit:10;}
        .st4{fill:#FFFFFF;}
        .st5{fill:#29292E;}
        .st6{opacity:0.9;}
        .st7{fill-rule:evenodd;clip-rule:evenodd;fill:#FFFFFF;}
        .st8{fill:#C77C11;}
        .st9{fill:#FFD700;}
        .st10{fill-rule:evenodd;clip-rule:evenodd;fill:#4D4E51;}
        .st11{fill:#010101;}
        .st12{fill:#B4B5B5;}
        .st13{opacity:1.000000e-02;fill:#231F20;enable-background:new;}
        .st14{fill:#C1C5C6;}
        .st15{fill:#D3CCA5;}
        .st16{fill:#E6E2C2;}
        .st17{fill:#B6B083;}
        .st18{fill:#C8CCCF;}
        .st19{fill:#585959;}
        .st20{display:none;}
        .st21{opacity:1.000000e-02;fill:#FFFFFF;enable-background:new;}
        .st22{fill:#D2CAA4;}
        .st23{fill:#E5E0C0;}
        .st24{fill:#C43B3A;}
        .st25{fill:#3AA5C6;}
        .st26{opacity:0.7;fill:#48525F;enable-background:new;}
        .st27{fill:none;}
</style><g id="calliope_mini">`;
        const BOARD_SVG_BOTTOM = `<g id="all">
	<g id="Batterie">
		<polygon class="st14" points="427.2,316.3 425.1,319 424.7,318.7 424,318.2 423.6,317.8 422.8,317.3 422.4,316.9 422.4,316.9 
			422,316.6 421.9,316.5 413.4,309.9 413.4,309.9 413.4,309.9 413.3,309.8 413.3,309.8 411.7,307.7 411.7,307.6 412.9,306.1 
			412.9,306.1 415.4,307.2 415.5,307.2 415.5,307.3 423.2,313.3 424,313.9 424.1,314 424.3,314.1 424.4,314.2 424.5,314.3 
			424.9,314.6 425.7,315.2 426.1,315.5 426.8,316 		"/>
		<polygon class="st14" points="418.8,327 416.7,329.7 416.3,329.4 415.7,328.9 415.2,328.5 414.5,328 414.1,327.6 413.7,327.3 
			413.6,327.2 405.1,320.6 405.1,320.6 405,320.6 405,320.5 403.4,318.3 403.3,318.3 404.5,316.8 404.6,316.8 407,317.9 
			407.2,317.9 415.6,324.5 415.8,324.6 415.9,324.8 416.1,324.9 416.2,325 416.6,325.3 417.3,325.8 417.8,326.2 418.4,326.7 		"/>
		<polygon class="st15" points="425.9,337.3 425.9,337.3 423.7,340.1 420.5,337.6 418.5,340.1 412.4,335.3 414.4,332.8 416.5,330 
			422.7,334.8 		"/>
		<polygon class="st15" points="438.9,320.6 436.7,323.4 433.5,320.9 427.4,316.1 429.6,313.3 431.6,310.8 437.7,315.6 435.7,318.1 
					"/>
		<polygon class="st15" points="408.8,339.8 405.5,344.1 396.9,337.5 400.3,333.2 		"/>
		<polygon class="st15" points="438.4,301.9 435.1,306.2 426.5,299.5 429.9,295.3 		"/>
		<polygon class="st16" points="468.4,329.6 466.7,331.8 464.2,335 463.6,335.8 461.6,338.3 455.3,346.5 452.7,349.7 446.4,357.8 
			444.4,360.3 443.8,361.1 441.3,364.3 439.6,366.5 439.2,366.1 438.5,365.6 435.3,363.1 435.3,363.1 433.2,365.8 421.5,356.6 
			408.6,346.6 405.5,344.1 408.8,339.8 412.4,335.3 418.5,340.1 421.7,342.6 433.7,352 435.7,349.5 437.9,346.7 432.7,342.6 
			425.9,337.3 422.7,334.8 416.5,330 416.7,329.7 418.8,327 425.1,319 427.2,316.3 427.4,316.1 433.5,320.9 436.7,323.4 
			448.7,332.8 450.9,330 452.9,327.4 440.9,318 437.7,315.6 431.6,310.8 435.1,306.2 438.4,301.9 441.6,304.4 454.5,314.5 
			466.2,323.6 464.1,326.3 464.1,326.3 467.3,328.8 468,329.3 		"/>
		<polygon class="st17" points="452.9,327.4 450.9,330 448.7,332.8 436.7,323.4 436.7,323.4 438.9,320.6 435.7,318.1 437.7,315.6 
			440.9,318 		"/>
		<polygon class="st17" points="437.9,346.7 435.7,349.5 433.7,352 421.7,342.6 418.5,340.1 420.5,337.6 423.7,340.1 425.9,337.3 
			432.7,342.6 		"/>
	</g>
	<g id="USB-C_Vorne">
		<g id="Loetpads">
			<rect x="284.9" y="99" class="st18" width="1.4" height="4.8"/>
			<rect x="281.2" y="99" class="st18" width="1.4" height="4.8"/>
			<rect x="279.5" y="99" class="st18" width="1.3" height="4.8"/>
			<rect x="275.9" y="99" class="st18" width="1.3" height="4.8"/>
			<rect x="286.6" y="99" class="st18" width="1.4" height="4.8"/>
			<rect x="272.5" y="99" class="st18" width="1.4" height="4.8"/>
			<rect x="269.1" y="99" class="st18" width="1.4" height="4.8"/>
			<rect x="265.8" y="99" class="st18" width="1.3" height="4.8"/>
			<rect x="262.4" y="99" class="st18" width="1.4" height="4.8"/>
			<rect x="259" y="99" class="st18" width="1.4" height="4.8"/>
			<rect x="255.6" y="99" class="st18" width="1.4" height="4.8"/>
			<rect x="252.2" y="99" class="st18" width="1.3" height="4.8"/>
			<rect x="248.7" y="99" class="st18" width="1.4" height="4.8"/>
			<rect x="247" y="99" class="st18" width="1.4" height="4.8"/>
			<rect x="243.2" y="99" class="st18" width="1.4" height="4.8"/>
			<rect x="241.5" y="99" class="st18" width="1.4" height="4.8"/>
		</g>
		<rect id="Bruecke_unten_links" x="225.7" y="93.6" class="st12" width="8.8" height="5.4"/>
		<rect id="Bruecke_unten_rechts" x="295" y="93.6" class="st12" width="8.8" height="5.4"/>
		<path id="USB" class="st14" d="M295,55v10.1l0,0V99h-10.9c-0.1,0-0.3,0-0.4,0s-0.2,0-0.4-0.1c-0.1,0-0.3-0.1-0.4-0.2
			s-0.2-0.1-0.3-0.2c-0.1-0.1-0.2-0.2-0.2-0.3c-0.2-0.3-0.4-0.7-0.4-1.1v-3.7c0-0.6-0.5-1-1-1h-8.1c-0.5,0-1,0.5-1,1v0.5
			c0,0.3,0.1,0.5,0.3,0.7l0,0h0.1l0.2,0.1l0.4,0.1h1.7V99h-19.7v-4.2h1.7c0.3,0,0.5-0.1,0.7-0.2c0,0,0.1-0.1,0.1-0.2
			c0.1-0.1,0.1-0.2,0.1-0.3c0-0.1,0.1-0.2,0.1-0.3v-0.5c0-0.6-0.5-1-1-1h-8.1c-0.6,0-1,0.5-1,1V97c0,0.4-0.1,0.8-0.4,1.1
			c0,0.1-0.1,0.2-0.2,0.3c-0.1,0.1-0.2,0.2-0.3,0.2c-0.1,0.1-0.2,0.1-0.4,0.2c-0.1,0-0.2,0.1-0.4,0.1c-0.1,0-0.3,0-0.4,0h-10.9V65.1
			l0,0V55h51.9c4.2,0,7.7,0,7.7,0H295z"/>
		<path class="st12" d="M303.9,65.1v2.4h-1.7c-0.6,0-1,0.5-1,1v1.3c0,0.6,0.5,1,1,1h1.7v2.4H295v-8.1
			C295,65.1,303.9,65.1,303.9,65.1z"/>
		<path class="st12" d="M234.5,65.1v8.1h-8.8v-2.4h1.7c0.5,0,1-0.5,1-1v-1.3c0-0.6-0.5-1-1-1h-1.7v-2.4
			C225.7,65.1,234.5,65.1,234.5,65.1z"/>
		<path class="st12" d="M256.8,86.8v2c0,0.4-0.3,0.7-0.7,0.7h-6.9c-0.4,0-0.7-0.3-0.7-0.7v-2c0-0.4,0.3-0.7,0.7-0.7h6.9
			C256.5,86.1,256.8,86.4,256.8,86.8z"/>
		<path class="st12" d="M280.9,86.8v2c0,0.4-0.3,0.7-0.7,0.7h-6.9c-0.4,0-0.7-0.3-0.7-0.7v-2c0-0.4,0.3-0.7,0.7-0.7h6.9
			C280.6,86.1,280.9,86.4,280.9,86.8z"/>
		<path class="st19" d="M284.1,99h-9.5v-4.2h-1.7l-0.4-0.1l-0.2-0.1h-0.1l0,0c-0.2-0.2-0.3-0.5-0.3-0.7v-0.5c0-0.6,0.5-1,1-1h8.1
			c0.6,0,1,0.5,1,1V97c0,0.4,0.1,0.8,0.4,1.1c0,0.1,0.1,0.2,0.2,0.3c0.1,0.1,0.2,0.2,0.3,0.2c0.1,0.1,0.2,0.1,0.4,0.2
			c0.1,0.1,0.2,0.1,0.4,0.1C283.8,99,284,99,284.1,99z"/>
		<path class="st19" d="M257.6,93.2v0.5c0,0.1,0,0.2-0.1,0.3c0,0.1-0.1,0.2-0.1,0.3c0,0.1-0.1,0.1-0.1,0.2c-0.2,0.1-0.4,0.2-0.7,0.2
			h-1.7V99h-9.5c0.1,0,0.3,0,0.4,0c0.1,0,0.2-0.1,0.4-0.1c0.1,0,0.2-0.1,0.4-0.2c0.1-0.1,0.2-0.1,0.3-0.2s0.2-0.2,0.2-0.3
			c0.2-0.3,0.4-0.7,0.4-1.1v-3.7c0-0.6,0.5-1,1-1h8.1C257.1,92.2,257.6,92.7,257.6,93.2z"/>
	</g>
	<g id="Reset-Taste">
		<path class="st19" d="M322.1,59.9L322.1,59.9l-0.2,0.2l-7.6,7.6l-0.2,0.2L314,68l0,0v-6.8c0-0.8,0.6-1.4,1.3-1.4h6.8L322.1,59.9
			L322.1,59.9z"/>
		<path class="st19" d="M335.6,80.3v6.8c0,0.7-0.6,1.3-1.4,1.3h-6.8l0,0l0,0l0.1-0.1L335.6,80.3z"/>
		<path class="st19" d="M335.6,61.3v6.8l-8.1-8.1h6.8C335,59.9,335.6,60.5,335.6,61.3z"/>
		<path class="st19" d="M322.1,88.4h-6.8c-0.7,0-1.3-0.6-1.3-1.3v-6.8l0,0l0.1,0.1l0.2,0.2l7.6,7.6L322.1,88.4L322.1,88.4
			L322.1,88.4z"/>
		<path id="RESET_Box" class="st14" d="M327.5,59.9h-5.4l0,0L322,60l-7.6,7.6l-0.2,0.2L314,68l0,0v12.2l0,0l0.1,0.1l0.2,0.2l7.6,7.6
			l0.1,0.1l0,0l0,0h5.4l0,0l0,0l0.1-0.1l8-8v-12L327.5,59.9z M332.9,76.9c0,4.5-3.6,8.1-8.1,8.1s-8.1-3.7-8.1-8.1v-5.4
			c0-4.5,3.6-8.1,8.1-8.1s8.1,3.6,8.1,8.1V76.9z"/>
		<path id="RESET_BUTTON" class="st4" d="M332.9,71.5v5.4c0,4.5-3.6,8.1-8.1,8.1s-8.1-3.7-8.1-8.1v-5.4c0-4.5,3.6-8.1,8.1-8.1
			S332.9,67,332.9,71.5z"/>
	</g>
	<g id="TOUCH_PINS">
		<path id="TOUCH_VCC" class="st9" d="M394,9.7c-5.9,0-11.4,1.6-16.1,4.5c-0.4,0.2-0.9,0.5-1.3,0.8l-0.1,0.1
			c-0.5,0.4-1.1,0.7-1.6,1.1l0,0c-0.5,0.4-1,0.8-1.5,1.2c-0.2,0.2-0.5,0.4-0.7,0.7c-0.2,0.2-0.5,0.5-0.7,0.7c-0.5,0.5-0.9,1-1.3,1.4
			c-1.3,1.5-2.5,3.1-3.5,4.9c-0.3,0.6-0.6,1.1-1,1.7c-0.3,0.6-0.6,1.2-0.8,1.8c-0.1,0.3-0.3,0.6-0.4,0.9c-0.1,0.2-0.2,0.5-0.3,0.7
			c-0.3,0.8-0.5,1.5-0.7,2.3c-0.2,0.6-0.3,1.2-0.5,1.8c0,0.3-0.1,0.7-0.2,1c0,0.3-0.1,0.6-0.1,1c-0.1,0.5-0.1,1.1-0.2,1.6
			c0,0.3,0,0.6-0.1,0.9c0,0.6,0,1.1,0,1.7c0,17.2,13.9,31.1,31.1,31.1c1,0,2,0,3-0.1c3-0.3,5.8-1,8.4-2c0.3-0.1,0.5-0.2,0.8-0.3
			c0.7-0.3,1.3-0.6,2-0.9c0.6-0.3,1.3-0.7,1.9-1.1c0.5-0.3,1-0.6,1.5-0.9s0.9-0.7,1.4-1s0.9-0.7,1.3-1.1c0.5-0.4,0.9-0.8,1.3-1.1
			c0.4-0.4,0.8-0.8,1.2-1.2c0.4-0.4,0.8-0.9,1.1-1.3c0.4-0.5,0.8-0.9,1.1-1.4c0.3-0.4,0.6-0.9,0.9-1.3c0.4-0.5,0.7-1.1,1.1-1.7
			c0.3-0.5,0.5-0.9,0.8-1.4s0.5-1.1,0.8-1.6c0.6-1.5,1.2-3,1.6-4.6c0.2-0.7,0.3-1.5,0.5-2.2v-0.1c0.3-1.8,0.5-3.6,0.5-5.5
			C425.2,23.6,411.2,9.7,394,9.7z M394,54.3c-7.5,0-13.6-6.1-13.6-13.6s6.1-13.6,13.6-13.6s13.6,6.1,13.6,13.6
			C407.6,48.3,401.5,54.3,394,54.3z"/>
		<path id="TOUCH_GND" class="st9" d="M166.8,38.6L166.8,38.6C166.8,38.5,166.8,38.5,166.8,38.6c0-0.5,0-0.9-0.1-1.3
			c0-0.6-0.1-1.1-0.2-1.7c0-0.3-0.1-0.7-0.2-1c-0.5-3-1.6-5.8-2.9-8.4c-0.2-0.5-0.5-0.9-0.7-1.3s-0.5-0.9-0.8-1.3
			c-0.2-0.4-0.4-0.7-0.7-1c-0.5-0.6-0.9-1.2-1.4-1.8c0,0,0-0.1-0.1-0.1c-0.5-0.6-1-1.1-1.5-1.6c-5.7-6-13.7-9.8-22.7-9.8
			c-17.3,0-31.3,14-31.3,31.2c0,1.5,0.1,3,0.3,4.4V45c0,0.1,0,0.1,0,0.2c0,0.3,0.1,0.6,0.1,0.9c0.1,0.7,0.2,1.4,0.4,2
			c0.1,0.5,0.2,0.9,0.4,1.4c0.1,0.3,0.2,0.7,0.3,1c0.3,1.1,0.7,2.1,1.2,3c0.2,0.5,0.4,0.9,0.6,1.3c0.2,0.4,0.4,0.8,0.6,1.1
			c0.2,0.4,0.5,0.8,0.7,1.2c0.2,0.3,0.4,0.6,0.6,0.9c1.1,1.7,2.4,3.2,3.8,4.6c0.5,0.5,0.9,0.9,1.4,1.3c0.5,0.4,1,0.8,1.4,1.2
			c0.7,0.5,1.3,1,2.1,1.5c0.6,0.4,1.3,0.8,2,1.2c0.1,0.1,0.2,0.2,0.4,0.2c0.7,0.4,1.4,0.7,2.2,1.1c0.8,0.4,1.6,0.7,2.4,1
			c0.9,0.3,1.8,0.6,2.8,0.8c0.7,0.2,1.5,0.4,2.2,0.5c1.2,0.2,2.5,0.4,3.7,0.4c0.5,0,1.1,0,1.6,0c17.3,0,31.2-14,31.2-31.3
			C166.8,39.9,166.8,39.2,166.8,38.6z M135.6,54c-7.5,0-13.6-6-13.6-13.6c0-7.5,6.1-13.6,13.6-13.6s13.6,6.1,13.6,13.6
			C149.2,48,143.1,54,135.6,54z"/>
		<path id="TOUCH_P3" d="M533.2,235.2c-1.5-0.5-3.2-0.9-4.8-1.2c-0.3,0-0.6-0.1-0.9-0.1c-1.4-0.2-2.8-0.3-4.2-0.3
			c-0.4,0-0.8,0-1.2,0c-0.3,0-0.6,0-0.9,0c-0.9,0-1.8,0.1-2.7,0.3c-0.8,0.1-1.5,0.3-2.3,0.5c-0.4,0.1-0.8,0.2-1.1,0.3
			c-1,0.2-2,0.5-2.9,0.9c-0.6,0.2-1.2,0.5-1.7,0.7s-1.1,0.5-1.7,0.8c-0.5,0.3-1.1,0.6-1.6,0.9c-0.6,0.4-1.2,0.7-1.7,1.1
			c-0.6,0.4-1.1,0.8-1.6,1.2c-0.3,0.2-0.6,0.5-0.9,0.7c-0.4,0.3-0.7,0.6-1.1,1c-0.2,0.2-0.4,0.3-0.5,0.5c-5.6,5.6-9.1,13.4-9.1,22
			c0,17.2,13.9,31.1,31.1,31.1c0.7,0,1.4,0,2.1-0.1c0.2,0,0.5,0,0.7-0.1c0.7,0,1.4-0.1,2-0.2c0.7-0.1,1.4-0.2,2-0.4
			c0.2,0,0.4-0.1,0.6-0.1c0.6-0.1,1.2-0.3,1.9-0.5c0.5-0.1,1-0.3,1.4-0.5c11.9-4.4,20.4-15.8,20.4-29.2
			C554.4,250.9,545.5,239.3,533.2,235.2z M523.3,278.2c-7.5,0-13.6-6.1-13.6-13.6s6-13.6,13.6-13.6c7.5,0,13.5,6.1,13.5,13.6
			C536.9,272.1,530.8,278.2,523.3,278.2z"/>
		<path id="TOUCH_P2" d="M424.4,481.4c-0.1-0.4-0.2-0.8-0.3-1.2c-0.3-1.3-0.8-2.6-1.3-3.8c-0.1-0.3-0.2-0.6-0.4-0.8
			c-0.6-1.5-1.4-2.9-2.3-4.3c-0.1-0.2-0.3-0.5-0.5-0.7c-1.4-2-3-3.9-4.8-5.5c-0.3-0.3-0.6-0.5-1-0.8c-0.5-0.4-0.9-0.8-1.4-1.1
			c-0.4-0.3-0.8-0.5-1.1-0.8c-0.7-0.5-1.5-1-2.3-1.4c-0.4-0.2-0.8-0.4-1.1-0.6c-0.8-0.4-1.6-0.8-2.4-1.1c-0.4-0.2-0.8-0.3-1.2-0.5
			c-1-0.4-2-0.7-3.1-0.9c-0.4-0.1-0.8-0.2-1.2-0.3c-0.6-0.1-1.2-0.2-1.9-0.3c-0.4-0.1-0.9-0.1-1.3-0.2c-0.5,0-1.1-0.1-1.6-0.1
			s-1.1,0-1.6,0s-1.1,0-1.6,0c-0.8,0-1.6,0.1-2.4,0.2c-0.4,0-0.9,0.1-1.3,0.2c-1.4,0.2-2.8,0.5-4.1,1c-0.5,0.1-1,0.3-1.5,0.5
			s-1,0.4-1.4,0.6c-0.5,0.2-0.9,0.4-1.4,0.6c-4.6,2.2-8.7,5.6-11.7,9.7c-0.5,0.7-1,1.4-1.4,2.1c-0.7,1.1-1.4,2.4-2,3.6
			c-0.5,1.1-0.9,2.2-1.3,3.3c-0.1,0.4-0.3,0.8-0.4,1.2c-0.8,2.8-1.2,5.7-1.2,8.7c0,17.5,14.2,31.7,31.7,31.7s31.7-14.2,31.7-31.7
			C425.2,486,424.9,483.7,424.4,481.4z M393.6,502c-7.5,0-13.6-6-13.6-13.5s6.1-13.6,13.6-13.6s13.6,6,13.6,13.6
			C407.1,496,401,502,393.6,502z"/>
		<path id="TOUCH_P1" d="M166.6,480.8c-0.2-0.8-0.4-1.5-0.7-2.2c0-0.1,0-0.2-0.1-0.2c-0.2-0.6-0.5-1.3-0.7-1.9
			c-0.1-0.2-0.1-0.3-0.2-0.5c-0.3-0.6-0.6-1.3-0.9-1.9c-0.4-0.8-0.9-1.6-1.3-2.3c-0.4-0.6-0.8-1.2-1.2-1.7c-0.4-0.6-0.8-1.1-1.3-1.6
			c-0.2-0.2-0.4-0.4-0.6-0.6c-0.4-0.5-0.8-0.9-1.3-1.4c0,0,0,0-0.1-0.1c-0.5-0.5-1-0.9-1.5-1.4c-0.7-0.6-1.4-1.2-2.1-1.7
			c-0.6-0.5-1.3-0.9-2-1.4c-0.7-0.4-1.4-0.8-2.1-1.2c-0.7-0.4-1.4-0.7-2.2-1.1c-1.9-0.8-3.8-1.5-5.8-1.9c-0.4-0.1-0.8-0.2-1.2-0.2
			c-0.4-0.1-0.8-0.1-1.2-0.2c-0.4,0-0.8-0.1-1.2-0.1c-1-0.1-2.1-0.2-3.1-0.2c-1.1,0-2.2,0-3.3,0.2c-0.5,0-1.1,0.1-1.6,0.2
			c-1.6,0.2-3.1,0.6-4.6,1.1c-3,0.9-5.8,2.3-8.3,4c-0.4,0.3-0.8,0.6-1.2,0.9c-0.4,0.3-0.8,0.6-1.2,0.9c-0.4,0.3-0.8,0.7-1.1,1
			c-0.4,0.3-0.7,0.7-1.1,1.1s-0.7,0.7-1.1,1.1c-1,1.1-2,2.3-2.8,3.6c-0.6,0.9-1.1,1.7-1.6,2.6c-0.3,0.5-0.5,0.9-0.7,1.4
			c-0.4,0.9-0.8,1.9-1.2,2.9c-1.2,3.4-1.9,7.1-1.9,10.9c0,17.6,14.2,31.8,31.8,31.8s31.8-14.2,31.8-31.8
			C167.6,486,167.2,483.4,166.6,480.8z M135.7,502.4c-7.5,0-13.6-6.1-13.6-13.6s6.1-13.6,13.6-13.6s13.6,6.1,13.6,13.6
			C149.4,496.3,143.3,502.4,135.7,502.4z"/>
		<path id="TOUCH_P0" d="M6.4,233.4c-0.5,0-1.1,0-1.6,0s-1,0-1.5,0.1c-2,0.2-3.9,0.5-5.7,1.1c-13,3.8-22.4,15.8-22.4,30
			c0,13,7.9,24.1,19.1,28.8c0.9,0.4,1.9,0.7,2.9,1.1c1,0.3,2,0.6,3,0.8c0.5,0.1,1,0.2,1.6,0.3c0.5,0.1,1,0.1,1.6,0.2
			c1.1,0.1,2.1,0.2,3.2,0.2c17.3,0,31.3-14,31.3-31.3C37.6,247.4,23.6,233.4,6.4,233.4z M6.4,278.2c-7.5,0-13.6-6.1-13.6-13.6
			S-1.1,251,6.4,251S20,257.1,20,264.6C19.9,272.1,13.8,278.2,6.4,278.2z"/>
            <path id="TOUCH_LOGO" d="M282,13.3h-0.1l-6.8-0.1H275h-0.1h-0.1h-0.1h-0.1h-0.1h-0.1l-0.1,0.1l-0.1,0.1l-0.1,0.1l-0.1,0.1
			l-0.1,0.1l-0.1,0.1l-0.1,0.1l-0.1,0.1l-0.1,0.1l-0.1,0.1l-0.1,0.1l-0.1,0.1l-0.1,0.1l-0.1,0.1l-0.1,0.1l-0.1,0.1l-0.1,0.1
			l-0.1,0.1l-0.1,0.1l-0.1,0.1l-0.1,0.1l-0.1,0.1l-0.1,0.1v0.1v0.1l-0.1,3.6l0,0l0.1,0.4l-0.1,0.7v0.4v-1.5v-0.4l-0.1-0.3l-0.1-0.3
			l-0.1-0.3l-0.1-0.3l-0.1-0.3l-0.1-0.3l-0.2-0.3l-0.2-0.3l-0.3-0.3l-0.3-0.3l-0.3-0.3l-0.3-0.3l-0.3-0.2l-0.3-0.2l-0.3-0.2
			l-0.3-0.2l-0.3-0.2l-0.3-0.2l-0.4-0.2l-0.4-0.2l-0.4-0.2l-0.4-0.2l-0.4-0.2l-0.4-0.1h-0.4h-0.4h-0.4H264h-0.4l-0.4,0.1l-0.4,0.1
			l-0.4,0.1l-0.3,0.1l-0.3,0.1l-0.3,0.1l-0.3,0.1l-0.3,0.1l-0.3,0.1l-0.3,0.2l-0.3,0.2l-0.3,0.3l-0.3,0.3l-0.3,0.3l-0.3,0.3
			l-0.2,0.3l-0.2,0.3l-0.2,0.3l-0.2,0.3l-0.2,0.3l-0.2,0.3l-0.2,0.4l-0.2,0.4l-0.2,0.4l-0.2,0.4l-0.2,0.4l-0.1,0.4v0.4v0.4v0.4v0.4
			v2l-0.2,6.5l-9.3,6.7l-0.6,0.4l-0.5,0.5l-0.4,0.5l-0.4,0.5l-0.3,0.5l-0.3,0.5l-0.2,0.6l-0.2,0.6l-0.2,0.6l-0.1,0.6L244,41
			l18.2-17.5l-0.1-0.1l-0.1-0.1l-0.1-0.1l-0.1-0.1l-0.1-0.1l-0.1-0.1v-0.1v-0.1v-0.1v-0.1v-0.1v-0.1v-0.1v-0.1V22v-0.1l0.1-4.3
			l6.4,0.2l-0.1,4.3v0.1v0.1v0.1v0.1v0.1l-0.1,0.1l-0.1,0.1l-0.1,0.1l-0.1,0.1l-0.1,0.1l-0.1,0.1l-0.1,0.1l-0.1,0.1l-0.1,0.1
			l-0.1,0.1l-0.1,0.1l-0.1,0.1l-0.1,0.1l-0.1,0.1l-0.1,0.1l-0.1,0.1L267,24h-0.1h-0.1h-0.1h-0.1h-0.1h-0.1h-0.1h-0.1h-0.1H266
			l-1.4-0.1h-0.1h-0.1h-0.1h-0.1h-0.1l-0.1-0.1l-0.1-0.1l-0.1-0.1l-0.1-0.1l-0.1-0.1l-0.1-0.1l-0.1-0.1l-0.1-0.1l-0.1-0.1l-0.1-0.1
			l-0.1-0.1L244.4,41v0.1v0.6v0.6l0.1,0.6l0.1,0.6l0.1,0.6l0.1,0.3l15.4-14.7l3-5.4l1.6,5.6l-4.6-0.1l-15.4,14.7l0.1,0.2l0.2,0.5
			l0.3,0.5l0.3,0.5l0.3,0.5l0.4,0.4l0.4,0.4l0.5,0.4l0.5,0.4l0.5,0.3l0.5,0.3l0.6,0.2l0.6,0.2l0.7,0.1l0.7,0.1l0.7,0.1l1.9,0.1
			l0.5-2.2l0.2-1.1l0.3-1.2l0.3-1.2l0.3-1.2l0.4-1.1l0.4-1.1l0.4-1.1l0.4-1l0.4-1l0.5-1l0.5-1l0.6-0.9L260,34l0.7-0.9l1.4-0.5h0.8
			l3.3-3.2l1.9-5.5l2.6,5.3l0.1,0.3l-4.6-0.1l-3.3,3.2l7.4,0.2l0.6,0.9l0.6,0.9l0.5,0.9l0.5,1l0.5,1l0.4,1.1l0.4,1.1l0.4,1.2
			l0.3,1.1l0.3,1.1l0.2,1.2l0.2,1.2l0.3,2.3l0.3,2.2h2.6h0.3h0.3h0.3h0.3h0.3h0.3l0.2-0.1l0.2-0.1l0.2-0.1l0.2-0.1l0.2-0.1l0.2-0.1
			l0.2-0.1l0.2-0.1l0.2-0.1l0.1-0.2l0.1-0.2l0.1-0.2l0.2-0.2l0.2-0.2l0.2-0.2l0.2-0.2l0.1-0.2v-0.2v-0.2v-0.2v-0.2v-0.2v-0.2v-0.2
			v-0.2v-0.3l0.5-19.7l0.2-10v-0.1v-0.1v-0.1v-0.1v-0.1v-0.1v-0.1l-0.1-0.1l-0.1-0.1l-0.1-0.1l-0.1-0.1l-0.1-0.1l-0.1-0.1l-0.1-0.1
			l-0.1-0.1l-0.1-0.1l-0.1-0.1l-0.1-0.1l-0.1-0.1l-0.1-0.1l-0.1-0.1l-0.1-0.1l-0.1-0.1l-0.1-0.1L282,13.3L282,13.3l-0.1-0.1
			l-0.1-0.1l-0.1-0.1l-0.1-0.1L282,13.3z M282.8,25l-7.6-0.2l0.2-9.5l7.6,0.2L282.8,25z"/>
	</g>
	<g id="Grove_BG">
		<path class="st10" d="M386.1,153.1l-2.9-6.1l27.7-12.9l2.9,6.1L386.1,153.1z"/>
		<path class="st10" d="M391.8,165.4l-2.9-6.1l27.7-12.9l2.9,6.1L391.8,165.4z"/>
		<path class="st10" d="M397.6,177.7l-2.9-6.1l27.7-12.9l2.9,6.1L397.6,177.7z"/>
		<path class="st10" d="M403.3,190l-2.9-6.1l27.7-12.9l2.9,6.1L403.3,190z"/>
		<path class="st10" d="M130.8,184l-2.9,6.1l-27.7-12.9l2.9-6.1L130.8,184z"/>
		<path class="st10" d="M136.6,171.7l-2.9,6.1L106,164.9l2.9-6.1L136.6,171.7z"/>
		<path class="st10" d="M142.3,159.4l-2.9,6.1l-27.7-12.9l2.9-6.1L142.3,159.4z"/>
		<path class="st10" d="M148,147.1l-2.9,6.1l-27.7-12.9l2.9-6.1L148,147.1z"/>
	</g>
	<g id="Grove_rechts">
		<polygon class="st15" points="421.9,117.8 418.2,119.6 417.1,117.1 414,118.5 412.3,114.9 419,111.7 		"/>
		<polygon class="st15" points="453.1,184.8 446.3,187.9 444.6,184.2 447.7,182.8 446.5,180.4 450.2,178.6 		"/>
		<path class="st16" d="M450.2,178.6c-9.8,4.6-22.1,10.4-31.9,14.9l-5.2-11l5.6-2.6l-1.5-3.1l3.7-1.7l1.4,3.1l0,0l1.8,3.7l-3.7,1.7
			l-1.2,0.5l1.7,3.7l0,0l1.2-0.5l22.7-10.6c-1.4-2.9-3.5-7.6-4.8-10.5l0,0c-1-2.2-4.7-9.9-5.6-11.9l0,0c-4.6-9.9-10-21.2-14.5-31.1
			l-22.7,10.6l-1.2,0.6l1.7,3.7c0.8-0.4,4-1.9,4.9-2.3c0.8,1.7,2.4,5.1,3.2,6.8c-0.1,0-3.7,1.8-3.8,1.7l-1.4-3.1l-5.5,2.6l-5.1-11.1
			l5.5-2.5v-0.1c7.4-3.3,19.1-8.9,26.4-12.3C431.1,137.8,440.9,158.6,450.2,178.6z"/>
		<path class="st15" d="M398,126l1.2,2.5l-3.7,1.6v0.1l-5.5,2.5l-2.9-6.1c2.7-1.3,8.3-3.9,11-5.2l1.7,3.7L398,126z"/>
		<path class="st15" d="M432.2,194.5c-2.8,1.3-8.3,3.9-11.1,5.2l-2.8-6.2c2.2-1,7-3.2,9.2-4.3l1.1,2.5l1.9-0.9L432.2,194.5z"/>
		<path class="st17" d="M442.2,171.1c-0.6-1.1-1.8-3.8-2.3-4.9l0,0c-1.1-2.2-4.7-9.9-5.6-12l0,0c-4.6-9.8-9.8-21.2-14.5-31
			l-22.7,10.6l-1.2,0.6l1.7,3.7c0.8-0.4,4-1.9,4.9-2.3c0.8,1.7,2.3,5.1,3.1,6.8l0,0c0.6,1.1,3.6,7.6,4.2,8.9l0,0l1.4,3.1l0,0l4,8.6
			l0,0l1.4,3l0,0c0.6,1.3,3.6,7.7,4.1,8.9l0,0l1.4,3.1l0,0l1.7,3.7c-0.9,0.4-4.1,1.9-4.9,2.3l1.7,3.7l1.2-0.6l22.7-10.6L442.2,171.1
			z"/>
		<path class="st14" d="M402.1,144.3c-2.1,0.7-13,6.5-15.1,6.2l-0.8-1.8c3.4-3.1,10.4-5.3,14.4-7.5l1.4,3.1H402.1z"/>
		<path class="st15" d="M420.9,175.1l-3.7,1.7c-3.4-7.4-7.5-16.2-11-23.6l0,0c-1.1-2.6-3-6.3-4.1-8.9l0,0l3.7-1.7l0.8,1.8l0,0
			c3.1,6.6,7,15.3,10.2,21.8l0,0C417.4,167.6,420.2,173.9,420.9,175.1z"/>
		<path class="st14" d="M402.7,158.5c-1.9,0.9-8,4.1-10.1,4l-0.8-1.8c1.1-1.7,7.7-4.4,9.5-5.2L402.7,158.5z"/>
		<path class="st17" d="M414.7,171.4l-4.9,2.3c-3.1-6.7-7.1-15-10.1-21.7l4.9-2.3l1.6,3.5l0,0C408.7,158.5,412.3,166.1,414.7,171.4z
			"/>
		<path class="st14" d="M408.2,170.2c-1.8,0.8-8.1,4.1-10.1,4l-0.9-1.9c1.3-1.5,7.7-4.3,9.5-5.2L408.2,170.2z"/>
		<path class="st14" d="M418.7,179.9c-4.3,1.7-10.5,5.5-15.1,6.3l-0.8-1.9c1-1.7,12.6-6.6,14.4-7.5L418.7,179.9z"/>
		<polygon class="st12" points="412.3,114.9 414,118.5 417.1,117.1 418.2,119.6 399.2,128.5 398,126 399.8,125.1 398.1,121.4 		"/>
		<path class="st12" d="M446.5,180.4l1.2,2.4l-3.1,1.4l1.7,3.7l-14.1,6.6l-1.7-3.7l-1.9,0.9l-1.1-2.5
			C431.6,187.4,442.5,182.3,446.5,180.4"/>
		<g id="G_A1_RX">
			<path class="st9" d="M416.8,137.4l-3.1,1.4l-1.4-3c0.8-0.4,2.3-1.2,3.1-1.5L416.8,137.4z"/>
			<path class="st21" d="M422,139.4l-10.3,4.7l-4.7-10c2.6-1.3,7.6-3.9,10.3-5L422,139.4z"/>
		</g>
		<g id="G_A1_TX">
			<path class="st9" d="M422.4,149.4c-0.4,0.2-2.1,0.9-2.5,1.1l-0.6,0.3l-1.4-3.1l3.1-1.4L422.4,149.4z"/>
			<path class="st21" d="M427.6,151.4c-1.3,0.8-6.8,3-8.3,3.7l-2,1l-4.7-10.3l10.3-4.7L427.6,151.4z"/>
		</g>
		<g id="G_A1_VCC">
			<path class="st9" d="M427.8,161.1l-3,1.4l-1.5-3.1l0,0l0,0c0.4-0.2,2.1-0.9,2.5-1.1l0.6-0.3L427.8,161.1z"/>
			<path class="st21" d="M433,163.1l-10,4.7l-5-10.3l0,0l0,0c1.3-0.8,6.9-3,8.3-3.7l2-1L433,163.1z"/>
		</g>
		<g id="G_A1_GND">
			<path class="st9" d="M433.4,173c-0.8,0.4-2.3,1.1-3.1,1.5l-1.4-3.1l3.1-1.5L433.4,173z"/>
			<path class="st21" d="M438.6,174.9c-2.5,1.3-7.8,3.7-10.3,5l-4.7-10.3l10.3-5L438.6,174.9z"/>
		</g>
	</g>
	<g id="Grove_links">
		<polygon class="st15" points="109.3,118.6 113,120.3 114.1,117.9 117.2,119.3 118.9,115.6 112.2,112.5 		"/>
		<polygon class="st22" points="78.1,185.5 84.8,188.7 86.6,185 83.5,183.6 84.6,181.1 80.9,179.4 		"/>
		<path class="st23" d="M80.9,179.4c9.9,4.5,22.2,10.3,32,14.9l5.1-11.1l-5.5-2.5l1.4-3.1l-3.6-1.7c-0.9,1.6-2.4,5-3.2,6.7l3.7,1.7
			l1.2,0.6l-1.7,3.7L109,188l-22.7-10.6c1.3-2.9,3.6-7.5,4.9-10.4l0,0c1.1-2.2,4.7-9.9,5.6-12l0,0c4.6-9.8,9.9-21.2,14.5-31
			l22.7,10.6l1.2,0.6l-1.7,3.7c-0.8-0.4-4-1.9-4.9-2.3c-0.7,1.7-2.4,5.1-3.2,6.7l3.7,1.7l1.4-3l5.6,2.6l5.1-11.1l-6-2.9
			c-7.2-3.3-18.6-8.6-25.9-12.1C100,138.5,90.3,159.5,80.9,179.4z"/>
		<polygon class="st15" points="133.2,126.8 132,129.2 135.7,130.9 135.7,130.9 141.2,133.5 144.1,127.4 138.6,124.8 133,122.2 
			131.3,125.9 		"/>
		<polygon class="st15" points="99,195.3 104.5,197.8 110,200.4 112.9,194.3 107.3,191.7 103.7,190 102.5,192.5 100.7,191.6 		"/>
		<path class="st17" d="M86.3,177.4L109,188l1.3,0.6l1.7-3.7c-0.8-0.4-4-1.9-4.9-2.3c6.9-15.2,14.5-30.9,21.5-46
			c0.9,0.4,4.1,1.9,4.9,2.3l1.7-3.7l-1.5-0.7L111.3,124C103,141.4,94.6,160,86.3,177.4z"/>
		<polygon class="st14" points="129.1,145 129.1,145.1 129.1,145.1 141.4,150.8 144.1,151.3 145,149.5 142.8,147.7 136.1,144.6 
			130.5,142 		"/>
		<polygon class="st15" points="110.3,175.9 113.9,177.6 114.8,175.8 116.5,172.1 118.1,168.7 119.5,165.6 123.5,157 125,154 
			125,153.9 126.6,150.5 128.3,146.9 129.1,145.1 129.1,145 125.4,143.3 124.6,145.2 124.6,145.2 121.3,152.2 119.8,155.3 
			119.8,155.3 115.8,163.9 115.8,163.9 114.4,167 114.4,167 111.1,174 		"/>
		<polygon class="st14" points="128.4,159.3 135.8,162.8 138.6,163.3 139.4,161.4 137.2,159.7 129.9,156.2 		"/>
		<polygon class="st17" points="116.5,172.1 121.4,174.4 123,171 124.4,167.9 128.4,159.3 129.9,156.2 131.5,152.8 126.6,150.5 
			125,153.9 125,154 123.5,157 119.5,165.6 118.1,168.7 		"/>
		<polygon class="st14" points="123,171 130.4,174.4 133.1,174.9 134,173.1 131.8,171.4 124.4,167.9 		"/>
		<polygon class="st14" points="112.5,180.7 118,183.2 124.8,186.4 127.5,186.9 128.4,185.1 126.2,183.3 113.9,177.6 		"/>
		<polygon class="st12" points="118.9,115.6 117.2,119.3 114.1,117.9 113,120.3 132,129.2 133.2,126.8 131.3,125.9 133,122.2 		"/>
		<polyline class="st12" points="84.6,181.1 83.5,183.6 86.6,185 84.8,188.7 99,195.3 100.7,191.6 102.5,192.5 103.7,190 
			101.8,189.1 100.8,188.6 87.7,182.5 84.6,181.1 		"/>
		<g id="G_A0_GND">
			<polygon class="st9" points="114.4,138.2 117.4,139.6 118.9,136.5 118.3,136.2 116.4,135.4 115.8,135.1 			"/>
			<polygon class="st21" points="109.2,140.2 119.2,144.9 124.2,134.5 122.2,133.5 115.8,130.8 113.8,129.9 			"/>
		</g>
		<g id="G_A0_VCC">
			<polygon class="st9" points="108.8,150.2 109.1,150.3 109.4,150.4 111.2,151.3 111.2,151.3 111.9,151.6 113.3,148.5 110.2,147.1 
							"/>
			<polygon class="st21" points="103.6,152.2 104.5,152.5 105.5,152.8 111.5,155.8 111.5,155.8 113.9,156.9 118.6,146.5 
				108.2,141.9 			"/>
		</g>
		<g id="G_A0_SDA">
			<polygon class="st9" points="103.4,161.8 106.4,163.3 107.8,160.2 107.8,160.2 107.8,160.2 107.2,159.9 105.4,159.1 105.4,159 
				104.8,158.8 			"/>
			<polygon class="st21" points="98.1,163.6 108.3,168.7 113.1,158.2 113.1,158.2 113.1,158.2 111.1,157.1 104.9,154.4 104.9,154.1 
				102.9,153.4 			"/>
		</g>
		<g id="G_A0_SCL">
			<polygon class="st9" points="97.8,173.8 98.4,174.1 100.2,174.9 100.8,175.2 102.3,172.1 99.2,170.7 			"/>
			<polygon class="st21" points="92.6,175.8 94.5,176.8 100.5,179.4 102.6,180.4 107.6,170.1 97.2,165.4 			"/>
		</g>
	</g>
	<g id="Button_B">
		<path class="st10" d="M419.5,241.3l-6.2-6.2l7.4-7.4l6.2,6.2L419.5,241.3z"/>
		<path class="st10" d="M457.6,203.1l-6.2-6.2l7.4-7.4l6.2,6.2L457.6,203.1z"/>
		<path class="st10" d="M441.1,262.9l-6.2-6.2l7.4-7.4l6.2,6.2L441.1,262.9z"/>
		<path class="st10" d="M479.2,224.7l-6.2-6.2l7.4-7.4l6.2,6.2L479.2,224.7z"/>
		<polygon class="st12" points="437.4,256.9 440.7,260.2 443.2,257.8 443.2,257.8 443.3,257.6 443.7,257.3 444.2,256.7 444.5,256.4 
			444.7,256.2 445.1,255.8 445.7,255.2 447.9,253 444.5,249.7 441.8,252.4 441.3,252.9 441.2,253 440.9,253.4 440.3,253.9 
			439.8,254.4 439.4,254.8 		"/>
		<polygon class="st12" points="473.3,220.9 476.6,224.3 478.8,222.1 479.4,221.5 479.8,221.1 480,220.9 480.3,220.6 480.9,220.1 
			481.2,219.7 483.8,217.1 480.5,213.8 478.4,215.8 478,216.2 477.5,216.7 477,217.3 476.6,217.6 476.5,217.7 476,218.2 		"/>
		<polygon class="st12" points="451.7,199.4 455.1,202.7 457.2,200.6 457.8,200 458.3,199.5 458.4,199.4 458.7,199.1 459.8,198 
			459.8,198 460.2,197.6 462.3,195.5 458.9,192.2 456.3,194.8 455.9,195.2 455.4,195.7 455.1,196 454.9,196.2 454.5,196.6 
			453.9,197.2 		"/>
		<polygon class="st12" points="415.8,235.3 419.1,238.7 421.6,236.2 421.6,236.2 421.8,236 423.1,234.7 423.6,234.2 424.2,233.6 
			426.3,231.5 423,228.1 420.2,230.9 419.8,231.3 419.6,231.5 419.3,231.8 418.8,232.4 418.4,232.7 		"/>
		<path d="M426.7,228.6c1.3,1.3,3.5,1.3,4.8,0s1.3-3.5,0-4.8s-3.5-1.3-4.8,0C425.3,225.1,425.3,227.3,426.7,228.6z"/>
		<path d="M447.4,207.9c1.3,1.3,3.5,1.3,4.8,0s1.3-3.5,0-4.8s-3.5-1.3-4.8,0S446.1,206.5,447.4,207.9z"/>
		<path d="M468.2,228.6c1.3,1.3,3.5,1.3,4.8,0s1.3-3.5,0-4.8s-3.5-1.3-4.8,0C466.8,225.1,466.8,227.3,468.2,228.6z"/>
		<path d="M447.4,249.3c1.3,1.3,3.5,1.3,4.8,0s1.3-3.5,0-4.8s-3.5-1.3-4.8,0C446.1,245.9,446.1,248,447.4,249.3z"/>
		<path id="BTN_B_BOX" class="st14" d="M422.2,227.4l0.7,0.7l3.4,3.3l18.2,18.2l3.4,3.3l0.7,0.7c0.6,0.7,1.7,0.7,2.4,0l26.3-26.3
			c0.7-0.7,0.7-1.7,0-2.4l-0.7-0.7l-3.3-3.4l-18.2-18.2l-3.3-3.3l-0.7-0.7c-0.7-0.6-1.7-0.6-2.4,0L422.2,225
			C421.6,225.7,421.6,226.7,422.2,227.4z M452.2,207.9c-1.3,1.3-3.5,1.3-4.8,0s-1.3-3.5,0-4.8s3.5-1.3,4.8,0
			S453.5,206.5,452.2,207.9z M468.2,223.8c1.3-1.3,3.5-1.3,4.8,0s1.3,3.5,0,4.8s-3.5,1.3-4.8,0C466.8,227.3,466.8,225.1,468.2,223.8
			z M447.4,244.6c1.3-1.3,3.5-1.3,4.8,0s1.3,3.5,0,4.8s-3.5,1.3-4.8,0C446.1,248,446.1,245.9,447.4,244.6z M426.7,223.8
			c1.3-1.3,3.5-1.3,4.8,0s1.3,3.5,0,4.8s-3.5,1.3-4.8,0C425.3,227.3,425.3,225.1,426.7,223.8z"/>
		<path id="BTN_B" class="st24" d="M441.4,234.6c4.6,4.6,12.1,4.6,16.8,0c4.6-4.6,4.6-12.1,0-16.8c-4.6-4.6-12.1-4.6-16.8,0
			C436.8,222.5,436.8,230,441.4,234.6z"/>
	</g>
	<g id="Button_A">
		<path class="st10" d="M92.3,256.6l-6.2,6.2l-7.4-7.4l6.2-6.2L92.3,256.6z"/>
		<path class="st10" d="M54.2,218.5l-6.2,6.2l-7.4-7.4l6.2-6.2L54.2,218.5z"/>
		<path class="st10" d="M113.9,235l-6.2,6.2l-7.4-7.4l6.2-6.2L113.9,235z"/>
		<path class="st10" d="M75.7,196.9l-6.2,6.2l-7.4-7.4l6.2-6.2L75.7,196.9z"/>
		<polygon class="st12" points="90,256.9 86.6,260.2 84.1,257.8 84.1,257.8 84,257.6 83.6,257.3 83.1,256.7 82.8,256.4 82.6,256.2 
			82.2,255.8 81.6,255.2 79.4,253 82.8,249.7 85.5,252.4 86,252.9 86.1,253 86.4,253.4 87,253.9 87.5,254.4 87.9,254.8 		"/>
		<polygon class="st12" points="54,220.9 50.7,224.3 48.5,222.1 47.9,221.6 47.5,221.1 47.3,220.9 47,220.6 46.4,220.1 46.1,219.7 
			43.5,217.1 46.8,213.8 48.9,215.8 49.3,216.2 49.8,216.7 50.3,217.3 50.7,217.6 50.8,217.8 51.3,218.2 		"/>
		<polygon class="st12" points="75.6,199.4 72.2,202.7 70.1,200.6 69.5,200 69,199.5 68.9,199.4 68.6,199.1 67.5,198 67.5,198 
			67.1,197.6 65,195.5 68.4,192.2 71,194.8 71.4,195.2 71.9,195.7 72.2,196 72.4,196.2 72.8,196.6 73.4,197.2 		"/>
		<polygon class="st12" points="111.5,235.3 108.2,238.7 105.7,236.2 105.7,236.2 105.5,236 104.2,234.7 103.7,234.2 103.1,233.6 
			101,231.5 104.3,228.1 107.1,230.9 107.5,231.3 107.7,231.5 108,231.8 108.5,232.4 108.9,232.7 		"/>
		<path d="M100.6,228.6c-1.3,1.3-3.5,1.3-4.8,0s-1.3-3.5,0-4.8s3.5-1.3,4.8,0C102,225.1,102,227.3,100.6,228.6z"/>
		<path d="M79.9,207.9c-1.3,1.3-3.5,1.3-4.8,0s-1.3-3.5,0-4.8s3.5-1.3,4.8,0C81.2,204.4,81.2,206.5,79.9,207.9z"/>
		<path d="M59.1,228.6c-1.3,1.3-3.5,1.3-4.8,0s-1.3-3.5,0-4.8s3.5-1.3,4.8,0C60.5,225.1,60.5,227.3,59.1,228.6z"/>
		<path d="M79.9,249.3c-1.3,1.3-3.5,1.3-4.8,0s-1.3-3.5,0-4.8s3.5-1.3,4.8,0C81.2,245.9,81.2,248,79.9,249.3z"/>
		<path id="BTN_A_BOX" class="st14" d="M105.1,225l-26.4-26.4c-0.6-0.6-1.7-0.6-2.4,0l-0.7,0.7l-3.3,3.3L54,220.9l-3.3,3.4L50,225
			c-0.7,0.7-0.7,1.7,0,2.4l26.3,26.3c0.7,0.7,1.7,0.7,2.4,0l0.7-0.7l3.4-3.3l18.2-18.2l3.4-3.3l0.7-0.7
			C105.7,226.7,105.7,225.7,105.1,225z M75.1,203.1c1.3-1.3,3.5-1.3,4.8,0s1.3,3.5,0,4.8s-3.5,1.3-4.8,0
			C73.8,206.5,73.8,204.4,75.1,203.1z M59.1,228.6c-1.3,1.3-3.5,1.3-4.8,0s-1.3-3.5,0-4.8s3.5-1.3,4.8,0
			C60.5,225.1,60.5,227.3,59.1,228.6z M79.9,249.3c-1.3,1.3-3.5,1.3-4.8,0s-1.3-3.5,0-4.8s3.5-1.3,4.8,0
			C81.2,245.9,81.2,248,79.9,249.3z M100.6,228.6c-1.3,1.3-3.5,1.3-4.8,0s-1.3-3.5,0-4.8s3.5-1.3,4.8,0
			C102,225.1,102,227.3,100.6,228.6z"/>
		<path id="BTN_A" class="st25" d="M85.9,234.6c-4.6,4.6-12.1,4.6-16.8,0c-4.6-4.6-4.6-12.1,0-16.8c4.6-4.6,12.1-4.6,16.8,0
			C90.5,222.5,90.5,230,85.9,234.6z"/>
	</g>
	<g id="RGB_LED">
		<path id="rgbled" class="st4" d="M265.7,300.9L265.7,300.9c7.1,0,12.8,5.7,12.8,12.8l0,0c0,7.1-5.7,12.8-12.8,12.8l0,0
			c-7.1,0-12.8-5.7-12.8-12.8l0,0C252.9,306.6,258.6,300.9,265.7,300.9z"/>
		<circle id="rgbledcircle" class="st26" cx="265.7" cy="313.7" r="9.9"/>
	</g>
	<g id="v3only">
		<g id="RGB_LED_RIGHT">
			<path id="rgbledright" class="st4" d="M297.7,300.9L297.7,300.9c7.1,0,12.8,5.7,12.8,12.8l0,0c0,7.1-5.7,12.8-12.8,12.8l0,0
				c-7.1,0-12.8-5.7-12.8-12.8l0,0C284.9,306.6,290.6,300.9,297.7,300.9z"/>
			<circle id="rgbledrightcircle" class="st26" cx="297.7" cy="313.7" r="9.9"/>
		</g>
		<g id="RGB_LED_LEFT">
			<path id="rgbledleft" class="st4" d="M233.7,300.9L233.7,300.9c7.1,0,12.8,5.7,12.8,12.8l0,0c0,7.1-5.7,12.8-12.8,12.8l0,0
				c-7.1,0-12.8-5.7-12.8-12.8l0,0C220.9,306.6,226.6,300.9,233.7,300.9z"/>
			<circle id="rgbledleftcircle" class="st26" cx="233.7" cy="313.7" r="9.9"/>
		</g>
	</g>
	<g id="led">
		<rect id="LED_0_0" x="210.7" y="146.2" class="st27" width="5.1" height="12.9"/>
		<rect id="LED_1_0" x="236.8" y="146.2" class="st27" width="5.1" height="12.9"/>
		<rect id="LED_2_0" x="262.7" y="146.2" class="st27" width="5.1" height="12.9"/>
		<rect id="LED_3_0" x="288.7" y="146.2" class="st27" width="5.1" height="12.9"/>
		<rect id="LED_4_0" x="314.6" y="146.2" class="st27" width="5.1" height="12.9"/>
		<rect id="LED_0_1" x="210.7" y="171.7" class="st27" width="5.1" height="12.9"/>
		<rect id="LED_1_1" x="236.8" y="171.7" class="st27" width="5.1" height="12.9"/>
		<rect id="LED_2_1" x="262.7" y="171.7" class="st27" width="5.1" height="12.9"/>
		<rect id="LED_3_1" x="288.7" y="171.7" class="st27" width="5.1" height="12.9"/>
		<rect id="LED_4_1" x="314.6" y="171.7" class="st27" width="5.1" height="12.9"/>
		<rect id="LED_0_2" x="210.7" y="197" class="st27" width="5.1" height="12.9"/>
		<rect id="LED_1_2" x="236.8" y="197" class="st27" width="5.1" height="12.9"/>
		<rect id="LED_2_2" x="262.7" y="197" class="st27" width="5.1" height="12.9"/>
		<rect id="LED_3_2" x="288.7" y="197" class="st27" width="5.1" height="12.9"/>
		<rect id="LED_4_2" x="314.6" y="197" class="st27" width="5.1" height="12.9"/>
		<rect id="LED_0_3" x="210.7" y="222.5" class="st27" width="5.1" height="12.9"/>
		<rect id="LED_1_3" x="236.8" y="222.5" class="st27" width="5.1" height="12.9"/>
		<rect id="LED_2_3" x="262.7" y="222.5" class="st27" width="5.1" height="12.9"/>
		<rect id="LED_3_3" x="288.7" y="222.5" class="st27" width="5.1" height="12.9"/>
		<rect id="LED_4_3" x="314.6" y="222.5" class="st27" width="5.1" height="12.9"/>
		<rect id="LED_0_4" x="210.7" y="247.8" class="st27" width="5.1" height="12.9"/>
		<rect id="LED_1_4" x="236.8" y="247.8" class="st27" width="5.1" height="12.9"/>
		<rect id="LED_2_4" x="262.7" y="247.8" class="st27" width="5.1" height="12.9"/>
		<rect id="LED_3_4" x="288.7" y="247.8" class="st27" width="5.1" height="12.9"/>
		<rect id="LED_4_4" x="314.6" y="247.8" class="st27" width="5.1" height="12.9"/>
	</g>
</g>
</g>
</svg>`;
        const BOARD_MINI2_BODY = `<style>#v3only,#hidden_v2,#TOUCH_LOGO{display:none;}</style><g id="v2">
	<g id="hidden_v2">
		<g id="C_P20">
			<circle class="st0" cx="393.3" cy="422" r="5.2"/>
			<circle cx="393.3" cy="422" r="2.2"/>
		</g>
		<rect id="M1minus" x="361.9" y="374.2" class="st1" width="15" height="15"/>
		<rect id="M0minus" x="361.9" y="391.4" class="st1" width="15" height="15"/>
	</g>
	<path class="st2" d="M531.6,282.9c-0.6-0.6-1.2-1.2-1.8-1.8c-4.7,1.3-9.6,3-14.4,1.7c-5.1-1.3-8.4-5.9-10.5-10.5
		c-3.3-7.3-2.1-16.3,3.6-21.5c0.4-4.1,1.9-7.7,6.4-9.9c4.4-2.1,9.4-2.9,14.4-3.3c0-0.6,0.1-1.2,0.3-1.8c-3.4-1.3-6.8-2.7-10-4.3
		c-4.6-2.3-9.1-4.9-13.4-7.7c-16.3-10.7-35.1-27.7-55.4-54.2c-29.5-38.6-28.6-86.6-25.7-117v-0.1c0-7.1,0.2-14-4.1-20
		c-1.8-2.5-3.7-4.3-5.8-5.6c-0.4-0.2-0.8-0.4-1.1-0.7c-2.2-1.2-4.7-2-7.6-2.5c-3.8-0.7-4.3-4.4-2.8-7.1c-2.1-0.3-4.3-0.2-6.1,0.1
		c-2.9,0.5-4.9-1.1-5.8-3.3c-4,0.2-7.9,0.7-11.6,1.7c-5.3,1.5-9.9,5-14.2,8.4c0,0.1-0.1,0.1-0.1,0.2c-0.2,0.2-0.5,0.3-0.7,0.5
		s-0.4,0.3-0.7,0.5c-0.4,0.3-0.7,0.5-1.1,0.6c-22,14.7-44.7,24.9-68.4,29.5c-1.9,0.4-3.7,0.8-5.6,1.2c-7.9,1.6-16,2.4-24.1,2.4
		c-7.8-0.1-15.6-0.9-23.2-2.4c-4.5-0.9-9-2-13.4-3.2h-0.4c-24.6-7.2-47.6-19.8-64.4-30.5c-0.3-0.1-0.7-0.3-1.1-0.5
		c-3.5-1.9-6.3-5-10-6.7c-2.8-1.3-6.2-1.4-9.4-0.9c-0.2,0.8-0.6,1.5-1.1,2.1c1.1,4.2,1.7,8.7,1.2,12.9c5.5,2.5,9.2,7.9,9.2,14.3
		c0,8.6-7,15.6-15.7,15.7c-7.9,0-14.3-5.7-15.5-13.2c-4.5-1.1-8.9-2.7-13-4.8c-0.7-0.4-1.2-0.8-1.6-1.3c-0.9,0.2-1.8,0.1-2.5-0.2
		c0.1,3.4-0.1,6.9-0.1,10.3c0,0.1,0,0.3,0,0.4c5,47.1-3.1,84.5-21.1,114.5l-2,2.9c-21.2,31-53.8,51.9-77.5,64c-0.1,0-0.2,0-0.3,0
		c-3.5,1.6-6.5,3.4-9.1,5.6c3.8,2.1,7.5,5.1,10.3,7.8c0.5,0.5,0.9,1,1.1,1.6c8.1-1.1,14.6,4.1,18.3,11.9c2,4.1,3.3,8.9,0.5,13
		c-2.6,3.8-5.1,8.3-9.1,10.8c-5,3.2-11.4,3.1-16.8,5.4c-1.6,0.7-3.2,1.5-4.9,2.1c1.1,0.7,2.3,1.4,3.4,2c1.9,1.1,3.8,2.4,5.7,3.7
		c0.8,0.5,1.6,1,2.4,1.5c0.3,0.2,0.6,0.4,1,0.5s0.8,0.3,1.2,0.6c0.1,0,0.2,0.1,0.3,0.1H8l2.7,1.4c10.9,5.8,21.2,12.5,31.1,19.9
		c11.7,10.2,22.5,21.4,32.4,33.4c2.9,3.4,5.6,6.9,8.1,10.6c0,0.1,0,0.1,0,0.2c18.3,29.8,26.7,67.1,21.9,114
		c-0.2,2.4-0.5,4.8-0.8,7.4c0,3.5,0.6,6.9,1.6,10.2c0.1-0.2,0.3-0.3,0.4-0.5c4.9-6,9.4-10.7,16.4-13.8c1.8-6.7,7.9-11.5,15.1-11.5
		c8.7,0,15.7,7,15.7,15.7c0,1.9-0.3,3.7-0.9,5.3c-0.1,1.3-0.4,2.7-0.7,4.1c-0.2,0.7-0.4,1.4-0.5,2.2c1,2.2,0.6,5.2-1.7,6.8
		c-0.6,2.5-1.1,5-1.5,7.6c-0.3,1.7-0.5,3.7-0.9,5.7c2.2-0.6,4.4-1.4,6.4-2.4h0.1c1.8-1,3.5-2.1,5.1-3.4
		c10.6-8.1,21.9-15.3,33.8-21.5c2-1,4.1-2,6.1-3c9.8-4.5,20.1-8,30.6-10.4c3-0.7,6-1.1,9.1-1.4c2.3-0.1,4.5-0.7,6.6-1.6
		c2.3-1,4.1-3,4.9-5.4c1.9-5.9,6.2-12.8,15.9-12.8c9.6,0,13.8,6.4,16,12.1c0.9,2.5,2.7,4.6,4.9,6.1c1.6,1,3.3,1.6,5.1,1.7
		c6.4,0.6,17.7,3,37.4,10.4h0.3c13.4,5.9,26.3,13.1,38.3,21.5c0.1,0.1,0.2,0.1,0.3,0.2c1.9,1.3,4.3,1.9,6.4,3
		c2.5,1.3,4.9,2.1,7.7,2.7c0,0,0,0,0.1,0c-2.2-5.5-4-11.1-4-17.2c0-0.5,0.1-0.9,0.2-1.3c-1.6-2.6-1.4-6.5-0.7-10.2
		c0.1-1.8,0.5-3.5,1.2-5c0.1-0.4,0.2-0.7,0.3-1c1.8-6.3,7.1-10.4,13.4-11.4c7.1-1.2,12.2,1.4,16.3,7c4,5.6,7.8,10.6,9.6,17.3
		c0,0.1,0,0.2,0.1,0.2c0.6,0.5,1.3,1.1,2,1.6c0.6,0.4,1.1,0.9,1.6,1.3c0.2-0.2,0.5-0.5,0.8-0.7c-1.3,0.9,0.9-2,1.1-2.6
		c0.8-1.7,1.3-3.5,1.5-5.4c0.2-3.7-0.4-7.6-0.9-11.2c0-0.1,0-0.2,0-0.2s0,0,0-0.1c-2-20.2-1-40.6,2.9-60.5v-0.4
		c3.9-16.5,10.3-32.4,18.8-47c21.9-37.4,55.3-56.7,78.5-68l4.3-2c3.4-1.6,6.7-3.5,9.6-5.7C536,288,534,285.3,531.6,282.9z
		 M408.2,45.7c-1,7.6-7.6,13.5-15.5,13.6c-8.7,0-15.7-7-15.7-15.7c0-4.2,1.6-7.9,4.2-10.7c-0.8-1.3-0.8-2.9,0.3-4.6
		c3.8-5.5,11-5.6,17-3.8c7,2,12,8.3,13.7,15.2C413,42.9,410.8,45.2,408.2,45.7z"/>
	<g id="Beschriftungen">
		<line class="st3" x1="174.1" y1="49.3" x2="184" y2="49.3"/>
		<g>
			<line class="st3" x1="343.7" y1="49.3" x2="353.6" y2="49.3"/>
			<line class="st3" x1="348.7" y1="44.3" x2="348.7" y2="54.2"/>
		</g>
		<path class="st4" d="M144.2,174.1h-2.7l-0.6,2h-1.5l2.8-8.8h1.3l2.8,8.8h-1.5L144.2,174.1z M141.8,172.9h2l-1-3.4L141.8,172.9z"/>
		<path class="st4" d="M153.1,172.8c0,0.5-0.1,1-0.2,1.5c-0.1,0.4-0.3,0.8-0.6,1.1c-0.2,0.3-0.5,0.5-0.9,0.7
			c-0.4,0.1-0.8,0.2-1.2,0.2s-0.8-0.1-1.2-0.2c-0.4-0.1-0.7-0.4-0.9-0.7c-0.3-0.3-0.4-0.7-0.6-1.1c-0.2-0.5-0.2-1-0.2-1.5v-2.1
			c0-0.5,0.1-1,0.2-1.5c0.1-0.4,0.3-0.8,0.6-1.1c0.2-0.3,0.5-0.5,0.9-0.7c0.4-0.1,0.8-0.2,1.2-0.2s0.8,0.1,1.2,0.2
			c0.4,0.1,0.7,0.4,0.9,0.7c0.3,0.3,0.4,0.7,0.6,1.1c0.1,0.5,0.2,1,0.2,1.5V172.8z M148.8,172.2l2.8-2.1c0-0.5-0.1-0.9-0.4-1.3
			c-0.3-0.3-0.6-0.5-1-0.4c-0.4,0-0.8,0.2-1.1,0.5c-0.3,0.5-0.4,1-0.3,1.5V172.2z M151.7,171.2l-2.8,2.1c0,1.2,0.5,1.7,1.4,1.7
			s1.4-0.7,1.4-2L151.7,171.2L151.7,171.2z"/>
		<path class="st4" d="M35.8,299.2c0,0.5-0.1,1-0.2,1.5c-0.1,0.4-0.3,0.8-0.6,1.1c-0.2,0.3-0.5,0.5-0.9,0.7s-0.8,0.2-1.2,0.2
			s-0.8-0.1-1.2-0.2c-0.3-0.1-0.7-0.4-0.9-0.7c-0.3-0.3-0.5-0.7-0.6-1.1c-0.1-0.5-0.2-1-0.2-1.5v-2.1c0-0.5,0.1-1,0.2-1.5
			c0.1-0.4,0.3-0.7,0.6-1.1c0.3-0.3,0.6-0.5,0.9-0.7c0.4-0.2,0.8-0.2,1.2-0.2s0.8,0.1,1.2,0.2c0.3,0.2,0.6,0.4,0.9,0.7
			c0.3,0.3,0.4,0.7,0.6,1.1c0.1,0.5,0.2,1,0.2,1.5V299.2z M31.6,298.7l2.8-2.1c0-0.5-0.1-0.9-0.4-1.3c-0.2-0.3-0.6-0.5-1-0.4
			c-0.4,0-0.8,0.2-1.1,0.5c-0.3,0.5-0.4,1-0.3,1.5V298.7z M34.4,297.8l-2.8,2.1c0,1.2,0.5,1.7,1.4,1.7s1.4-0.7,1.4-2
			C34.4,299.6,34.4,297.8,34.4,297.8z"/>
		<path class="st4" d="M180,482h-1.4v-7l-2.2,0.8v-1.3l3.6-1.3l0,0L180,482z"/>
		<path class="st4" d="M352,482h-5.9v-1l2.8-3.1c0.2-0.2,0.4-0.5,0.6-0.7c0.1-0.2,0.3-0.4,0.4-0.6s0.2-0.3,0.2-0.5s0-0.3,0-0.5
			s0-0.4,0-0.6c-0.1-0.2-0.2-0.3-0.3-0.4c-0.1-0.1-0.3-0.2-0.4-0.3c-0.2,0-0.4,0-0.5,0c-0.4,0-0.8,0.1-1.2,0.4
			c-0.3,0.3-0.4,0.8-0.4,1.2h-1.4c0-0.4,0.1-0.7,0.2-1.1c0.1-0.3,0.3-0.6,0.6-0.9c0.3-0.3,0.6-0.5,0.9-0.6c0.4-0.1,0.8-0.2,1.3-0.2
			c0.4,0,0.8,0.1,1.2,0.2c0.3,0.1,0.6,0.3,0.8,0.5c0.2,0.2,0.4,0.5,0.5,0.8s0.2,0.6,0.2,1c0,0.3,0,0.5-0.1,0.8s-0.2,0.5-0.4,0.8
			c-0.2,0.3-0.4,0.5-0.6,0.7c-0.2,0.3-0.5,0.5-0.7,0.8l-2,2.1h4.1L352,482z"/>
		<path class="st4" d="M493.7,297.5h0.8c0.2,0,0.5,0,0.7,0c0.2-0.1,0.3-0.2,0.5-0.3c0.1-0.1,0.2-0.3,0.3-0.4c0-0.2,0-0.4,0-0.5
			c0-0.4-0.1-0.7-0.3-1c-0.3-0.3-0.6-0.4-1-0.4c-0.2,0-0.4,0-0.5,0c-0.2,0.1-0.3,0.1-0.4,0.2s-0.2,0.3-0.3,0.4c0,0.2,0,0.3,0,0.5
			h-1.4c0-0.3,0.1-0.7,0.2-1s0.3-0.6,0.6-0.7c0.3-0.2,0.5-0.4,0.9-0.5s0.7-0.2,1.1-0.2s0.8,0.1,1.2,0.2c0.3,0.1,0.6,0.3,0.9,0.5
			s0.4,0.5,0.6,0.8c0.1,0.3,0.2,0.7,0.2,1.1c0,0.2,0,0.3,0,0.5c-0.1,0.2-0.1,0.4-0.2,0.5c-0.1,0.2-0.2,0.3-0.4,0.5
			c-0.2,0.2-0.3,0.3-0.6,0.4c0.2,0.1,0.5,0.2,0.7,0.4c0.2,0.1,0.3,0.3,0.4,0.5s0.2,0.4,0.2,0.6s0,0.4,0,0.6c0,0.4-0.1,0.8-0.2,1.1
			c-0.1,0.3-0.3,0.6-0.6,0.8c-0.3,0.2-0.6,0.4-0.9,0.5c-0.4,0.1-0.8,0.2-1.2,0.2c-0.4,0-0.7,0-1.1-0.1c-0.3-0.1-0.6-0.3-0.9-0.5
			s-0.5-0.5-0.6-0.8c-0.2-0.3-0.3-0.7-0.2-1.1h1.4c0,0.2,0,0.4,0.1,0.5c0,0.2,0.1,0.3,0.3,0.4c0.1,0.1,0.3,0.2,0.4,0.3
			c0.2,0,0.4,0,0.6,0c0.4,0,0.8-0.1,1.1-0.4c0.4-0.5,0.5-1.1,0.3-1.7c-0.1-0.2-0.2-0.3-0.3-0.5c-0.1-0.1-0.3-0.2-0.5-0.3
			c-0.2,0-0.5,0-0.7,0h-0.8L493.7,297.5z"/>
		<path class="st4" d="M382.6,175h-2.7l-0.6,2h-1.5l2.8-8.8h1.3l2.8,8.8h-1.4L382.6,175z M380.2,173.8h2l-1-3.4L380.2,173.8z"/>
		<path class="st4" d="M390,177.1h-1.4v-7l-2.2,0.8v-1.3l3.6-1.3l0,0V177.1z"/>
		<path id="Silk_btn_a" class="st4" d="M87.7,243.4l37.4-7.9c15.2-4.4,5.9-35.7-9.2-31.2l-27.2,4.8L87.7,243.4z"/>
		<path id="silk_btn_b" class="st4" d="M439.1,243.9l-37.2-8.8c-15-4.8-5-35.9,10-30.9l27,5.5L439.1,243.9z"/>
		<path class="st2" d="M108.9,226l1.2-0.2l5.2-14.9h3.5l5.2,14.9l1.2,0.2v2.1h-5.8V226l1.2-0.2l-0.7-2.4h-5.6l-0.7,2.4l1.2,0.2v2.1
			H109L108.9,226L108.9,226z M115.1,221h3.9l-1.9-6.1l0,0L115.1,221z"/>
		<path class="st2" d="M410,210c1.7-0.1,3.4,0.3,4.8,1.2c1.1,0.8,1.8,2.1,1.7,3.5c0,0.8-0.2,1.5-0.6,2.1c-0.5,0.6-1.1,1.1-1.8,1.4
			c1,0.1,1.8,0.7,2.4,1.4c0.5,0.7,0.8,1.5,0.8,2.4c0.1,1.4-0.5,2.8-1.6,3.7c-1.3,0.9-3,1.4-4.6,1.3h-8.4v-2.1l1.8-0.4v-12.3
			l-1.8-0.3v-2.1h7.6L410,210z M407.6,217.2h2.4c0.7,0.1,1.5-0.1,2.1-0.6c0.5-0.4,0.8-1,0.7-1.6c0.1-0.7-0.2-1.3-0.7-1.8
			c-0.7-0.4-1.4-0.6-2.2-0.6h-2.4L407.6,217.2z M407.6,219.6v4.8h3.2c0.7,0,1.5-0.2,2.1-0.6c0.5-0.4,0.8-1.1,0.7-1.8
			c0-0.7-0.2-1.4-0.6-1.9c-0.5-0.5-1.2-0.7-1.9-0.7L407.6,219.6z"/>
	</g>
	<g id="Calliope_mini_Logo">
		<path class="st4" d="M126.3,352.3l-0.7-1.2l1-0.7c0-0.3,0-0.5,0-0.8c-0.1-0.3-0.2-0.6-0.3-0.9c-0.3-0.6-0.9-1.1-1.7-1.2
			c-0.8-0.1-1.6,0.1-2.3,0.6l-0.3,0.1c-0.7,0.4-1.3,1-1.6,1.7c-0.3,0.6-0.3,1.4,0.1,2c0.2,0.3,0.4,0.6,0.6,0.8
			c0.2,0.2,0.5,0.3,0.7,0.4l1.1-0.4l0.7,1.2l-1.6,0.9c-0.6-0.1-1.1-0.3-1.6-0.7c-0.5-0.4-0.9-0.9-1.3-1.5c-0.6-1-0.8-2.2-0.4-3.2
			c0.4-1.1,1.2-2.1,2.3-2.7l0.3-0.1c1-0.6,2.2-0.8,3.4-0.6c1.1,0.2,2.1,1,2.6,2c0.3,0.6,0.5,1.2,0.6,1.9c0.1,0.6,0,1.2-0.2,1.7
			L126.3,352.3z"/>
		<path class="st4" d="M122.8,356.1l0.4,0.5l8.3-1.5l0.9,1.6l-5.5,6.3l0.2,0.6l-1,0.5l-1.5-2.7l1-0.5l0.4,0.5l0.9-1l-1.5-2.6
			l-1.3,0.3l0.2,0.6l-1,0.5l-1.5-2.7L122.8,356.1z M126.8,357.6l1,1.8l2.3-2.4l0,0L126.8,357.6z"/>
		<path class="st4" d="M126.8,365.4l1-0.6l0.7,0.8l5.7-3.3l-0.3-0.9l0.9-0.5l0.5,0.8l0.9,1.6l0.5,0.8l-1,0.6l-0.7-0.8l-5.6,3.2
			l1.3,2.2l1-0.5l0.7,1.2l-2.2,1.3L126.8,365.4z"/>
		<path class="st4" d="M130.8,372.6l1-0.6l0.7,0.8l5.7-3.3l-0.3-0.9l0.9-0.5l0.5,0.8l0.9,1.6l0.5,0.8l-1,0.6l-0.7-0.8l-5.6,3.2
			l1.3,2.2l1-0.5l0.7,1.2l-2.2,1.3L130.8,372.6z"/>
		<path class="st4" d="M142,375.9l1-0.5l1.9,3.3l-1,0.6l-0.7-0.8l-5.7,3.2l0.3,1l-0.9,0.5l-1.9-3.3l1-0.6l0.7,0.8l5.7-3.3L142,375.9
			z"/>
		<path class="st4" d="M145.6,389.4c-1,0.6-2.3,0.9-3.4,0.6c-2.2-0.5-3.6-2.7-3.1-4.9c0-0.1,0.1-0.2,0.1-0.3
			c0.5-1.1,1.3-2.1,2.4-2.6l0,0c1-0.6,2.3-0.9,3.4-0.6c1.1,0.2,2.1,0.9,2.6,1.9c0.6,1,0.7,2.2,0.4,3.3
			C147.6,387.9,146.7,388.9,145.6,389.4z M144.9,387.7c0.7-0.4,1.3-1,1.7-1.7c0.5-1.1,0-2.4-1.1-2.8c-0.2-0.1-0.4-0.2-0.6-0.2
			c-0.8,0-1.7,0.2-2.4,0.7l0,0c-0.7,0.4-1.3,0.9-1.7,1.7c-0.3,0.6-0.3,1.3,0,1.9s0.9,1,1.6,1.1C143.2,388.4,144,388.2,144.9,387.7
			L144.9,387.7z"/>
		<path class="st4" d="M152.5,392.2c0.4,0.7,0.6,1.6,0.5,2.4c-0.4,1.6-2,2.5-3.5,2.1h-0.1c-0.8-0.3-1.5-1-1.9-1.8l-0.8-1.4l-1.8,1
			l0.3,0.9l-1,0.5l-1.9-3.3l0.9-0.5l0.7,0.7l5.7-3.3l-0.3-0.9l1-0.6l0.5,0.8L152.5,392.2z M147.9,393l0.8,1.4
			c0.2,0.4,0.5,0.7,0.9,0.8c0.4,0.1,0.8,0,1.1-0.2c0.4-0.2,0.6-0.5,0.7-0.9c0.1-0.4,0-0.8-0.2-1.2l-0.8-1.4L147.9,393z"/>
		<path class="st4" d="M153.3,404l-1.5-2.7l-2.3,1.3l1.4,2.6l1-0.5l0.7,1.2l-2.2,1.2l-3.6-6.3l0.9-0.5l0.7,0.7l5.7-3.2l-0.3-0.9
			l1-0.6l0.5,0.8l3.1,5.4l-2.2,1.3l-0.7-1.2l0.9-0.6l-1.4-2.6l-2,1.1l1.5,2.7L153.3,404z"/>
		<path class="st4" d="M111.5,355.6l-1.4,0.9c0.6,0,1.3,0.1,1.9,0.4s1.1,0.8,1.4,1.4c0.3,0.5,0.5,1.1,0.5,1.6s-0.2,1.1-0.6,1.4
			c0.6,0,1.1,0.2,1.6,0.5s1,0.8,1.3,1.3c0.2,0.4,0.4,0.9,0.5,1.4c0.1,0.4,0,0.9-0.2,1.3c-0.2,0.5-0.5,0.9-0.9,1.3
			c-0.5,0.5-1,0.9-1.6,1.2l-10,5.7l-1.6-2.8l9.9-5.6c0.4-0.2,0.8-0.5,0.9-1c0.1-0.4,0-0.7-0.2-1.1c-0.1-0.3-0.4-0.5-0.7-0.7
			c-0.3-0.1-0.6-0.1-0.9,0l-10.5,5.8l-1.5-2.7l9.9-5.6c0.4-0.2,0.8-0.5,0.9-1c0.1-0.4,0-0.7-0.2-1s-0.4-0.5-0.7-0.7
			c-0.3-0.1-0.6-0.1-0.9,0l-10.5,6l-1.6-2.8l13.6-7.7L111.5,355.6z"/>
		<path class="st4" d="M119.6,370l4.1,7.2l-11.1,6.3l2.4,4l-2.4,1.4l-6.4-11.3l2.4-1.4l2.4,4.2l8.6-4.8l-2.4-4.2L119.6,370z
			 M125.4,371.9c0.4-0.3,0.9-0.3,1.4-0.2c1,0.4,1.6,1.5,1.5,2.6c-0.3,1-1.4,1.6-2.4,1.3c-0.5-0.2-0.9-0.5-1.2-1
			c-0.3-0.4-0.4-1-0.3-1.5C124.6,372.6,124.9,372.2,125.4,371.9L125.4,371.9z"/>
		<path class="st4" d="M129.6,387.6l-1.8,1.3c0.9,0.1,1.8,0.4,2.6,0.9s1.4,1.2,1.9,2c0.4,0.6,0.6,1.3,0.8,2.1c0.2,0.7,0.2,1.4,0,2
			c-0.2,0.7-0.6,1.4-1.1,1.9c-0.7,0.7-1.4,1.3-2.2,1.7l-8.5,4.8l-1.7-3l8.4-4.8c0.5-0.3,0.9-0.6,1.3-1c0.3-0.3,0.5-0.7,0.6-1.1
			s0.1-0.8,0-1.1c-0.1-0.4-0.3-0.9-0.5-1.3c-0.3-0.6-0.8-1.1-1.4-1.5c-0.6-0.3-1.2-0.5-1.9-0.5l-9.6,5.5l-1.7-3l13.6-7.7
			L129.6,387.6z"/>
		<path class="st4" d="M136.6,400l4.1,7.2l-11.1,6.3l2.4,4l-2.4,1.4l-6.4-11.3l2.4-1.4l2.4,4.2l8.6-4.8l-2.4-4.2L136.6,400z
			 M142.3,402c0.4-0.3,0.9-0.3,1.4-0.2c0.5,0.2,0.9,0.5,1.2,1s0.4,1,0.3,1.5c-0.1,0.5-0.5,0.9-0.9,1.1c-0.4,0.3-0.9,0.3-1.4,0.2
			c-0.5-0.2-0.9-0.5-1.2-1c-0.3-0.4-0.4-1-0.3-1.5C141.6,402.6,141.9,402.2,142.3,402L142.3,402z"/>
		<path class="st4" d="M124.8,330.7l-4-7.1c-0.6-1.1-2-1.4-3-0.8l-5.4,3c4.4-2.6,5.9-8.3,3.3-12.7c-2.5-4.3-8-5.8-12.4-3.4l-8.8,5
			l-12.6-5.5c-4.8-2.2-10.6-0.2-12.8,4.7c-1.4,2.9-1.2,6.4,0.5,9.1l1.1,1.9c6.4-2.6,14.8-4.8,21.4-3.7v0.2l4.8,8.5
			c-2.4,6.4-8.7,12.1-14.2,16.3l1.5,2.7c1.7,3,5.5,4.1,8.5,2.4l0,0l20.7-11.8l10.5-6c1.1-0.5,1.6-1.8,1.1-2.9
			C124.9,330.9,124.9,330.8,124.8,330.7z M109.1,313.2l3.8,6.7l-4.5,2.6c-1.5,0.8-3.3,0.3-4.1-1.1l-0.8-1.4
			c-0.8-1.4-0.4-3.3,1.1-4.1c0,0,0,0,0.1,0L109.1,313.2z M95.2,319l7.5-0.3l-4.8,5.1L95.2,319z M98,323.9l6.8-1.5l-4.1,6.3L98,323.9
			z M108.3,330.3l9.9-5.6l4.6,8l-9.9,5.6L108.3,330.3z"/>
		<path class="st4" d="M80.4,342.3c0.6-6,6.7-14.1,11.7-20.7l-17.7,10.1L80.4,342.3z"/>
	</g>
	<g id="interaktiv-mini2">
		<g id="PINS">
			<g id="C_P19">
				<circle class="st0" cx="353.3" cy="422" r="5.2"/>
				<circle cx="353.3" cy="422" r="2.2"/>
			</g>
			<g id="C_P18">
				<circle class="st0" cx="353.3" cy="439.6" r="5.2"/>
				<circle cx="353.3" cy="439.6" r="2.2"/>
			</g>
			<g id="C_P17">
				<circle class="st0" cx="335.7" cy="422" r="5.2"/>
				<circle cx="335.7" cy="422" r="2.2"/>
			</g>
			<g id="C_P16">
				<circle class="st0" cx="335.7" cy="439.6" r="5.2"/>
				<circle cx="335.7" cy="439.6" r="2.2"/>
			</g>
			<g id="C_P15">
				<circle class="st0" cx="318.2" cy="422" r="5.2"/>
				<circle cx="318.2" cy="422" r="2.2"/>
			</g>
			<g id="C_P14">
				<circle class="st0" cx="318.2" cy="439.6" r="5.2"/>
				<circle cx="318.2" cy="439.6" r="2.2"/>
			</g>
			<g id="C_P13">
				<circle class="st0" cx="300.7" cy="422" r="5.2"/>
				<circle cx="300.7" cy="422" r="2.2"/>
			</g>
			<g id="C_P12">
				<circle class="st0" cx="300.7" cy="439.6" r="5.2"/>
				<circle cx="300.7" cy="439.6" r="2.2"/>
			</g>
			<g id="C_P11">
				<circle class="st0" cx="283.2" cy="422" r="5.2"/>
				<circle cx="283.2" cy="422" r="2.2"/>
			</g>
			<g id="C_P10">
				<circle class="st0" cx="283.2" cy="439.6" r="5.2"/>
				<circle cx="283.2" cy="439.6" r="2.2"/>
			</g>
			<g id="GND2">
				<g>
					<circle class="st0" cx="265.7" cy="422" r="5.2"/>
					<circle cx="265.7" cy="422" r="2.2"/>
				</g>
				<g>
					<circle class="st0" cx="265.7" cy="439.6" r="5.2"/>
					<circle cx="265.7" cy="439.6" r="2.2"/>
				</g>
			</g>
			<g id="C_P9">
				<circle class="st0" cx="248.2" cy="422" r="5.2"/>
				<circle cx="248.2" cy="422" r="2.2"/>
			</g>
			<g id="C_P8">
				<circle class="st0" cx="248.2" cy="439.6" r="5.2"/>
				<circle cx="248.2" cy="439.6" r="2.2"/>
			</g>
			<g id="C_P7">
				<circle class="st0" cx="230.7" cy="422" r="5.2"/>
				<circle cx="230.7" cy="422" r="2.2"/>
			</g>
			<g id="C_P6">
				<circle class="st0" cx="230.7" cy="439.6" r="5.2"/>
				<circle cx="230.7" cy="439.6" r="2.2"/>
			</g>
			<g id="C_P5">
				<circle class="st0" cx="213.2" cy="422" r="5.2"/>
				<circle cx="213.2" cy="422" r="2.2"/>
			</g>
			<g id="C_P4">
				<circle class="st0" cx="213.2" cy="439.6" r="5.2"/>
				<circle cx="213.2" cy="439.6" r="2.2"/>
			</g>
			<g id="C_P3">
				<circle class="st0" cx="195.7" cy="422" r="5.2"/>
				<circle cx="195.7" cy="422" r="2.2"/>
			</g>
			<g id="C_P2">
				<circle class="st0" cx="195.7" cy="439.6" r="5.2"/>
				<circle cx="195.7" cy="439.6" r="2.2"/>
			</g>
			<g id="C_P1">
				<circle class="st0" cx="178.2" cy="422" r="5.2"/>
				<circle cx="178.2" cy="422" r="2.2"/>
			</g>
			<g id="C_P0">
				<circle class="st0" cx="178.2" cy="439.6" r="5.2"/>
				<circle cx="178.2" cy="439.6" r="2.2"/>
			</g>
			<g id="VCC">
				<g>
					<circle class="st0" cx="370.8" cy="439.6" r="5.2"/>
					<circle cx="370.8" cy="439.6" r="2.2"/>
				</g>
				<g>
					<circle class="st0" cx="160.7" cy="422" r="5.2"/>
					<circle cx="160.7" cy="422" r="2.2"/>
				</g>
			</g>
			<g id="GND1">
				<g>
					<circle class="st0" cx="370.8" cy="422" r="5.2"/>
					<circle cx="370.8" cy="422" r="2.2"/>
				</g>
				<g>
					<circle class="st0" cx="160.7" cy="439.6" r="5.2"/>
					<circle cx="160.7" cy="439.6" r="2.2"/>
				</g>
			</g>
		</g>
		<g id="Motor_Pins">
			<g id="VMplus">
				<circle class="st0" cx="288.4" cy="391.7" r="5.2"/>
				<circle cx="288.4" cy="391.7" r="2.2"/>
			</g>
			<g id="M1plus">
				<circle class="st0" cx="255.8" cy="391.7" r="5.2"/>
				<circle cx="255.8" cy="391.7" r="2.2"/>
			</g>
			<g id="M0plus">
				<circle class="st0" cx="239.4" cy="389.3" r="5.2"/>
				<circle cx="239.4" cy="389.3" r="2.2"/>
			</g>
			<g id="GND3">
				<g>
					<circle class="st0" cx="304.8" cy="389.3" r="5.2"/>
					<circle cx="304.8" cy="389.3" r="2.2"/>
				</g>
				<g>
					<circle class="st0" cx="272.1" cy="389.3" r="5.2"/>
					<circle cx="272.1" cy="389.3" r="2.2"/>
				</g>
				<g>
					<circle class="st0" cx="223.1" cy="391.7" r="5.2"/>
					<circle cx="223.1" cy="391.7" r="2.2"/>
				</g>
			</g>
		</g>
	</g>
</g>`;
        const BOARD_MINI3_BODY = `<g id="v3">
	<path id="Platine_mini3" class="st5" d="M534.9,293.4c-25.7,10.3-51.9-19-38.5-43.2c6.6-13.4,23.4-19.8,37.4-14.9
		C458.4,205,413,126.3,424.7,45.8c-3.3,21.2-29.8,33.1-47.2,20.8c-17.6-10.8-18.8-38-2.1-50.4c0.9-0.8-0.7,0,0.3-0.6
		c-24.1,18.7-48.7,32.3-78.9,39.3v45.4c0,2-2.8,2.7-3.8,1c-0.4-0.6-1-1-1.8-1h-51.5c-1.6-0.1-2,2.1-3.5,2c-1.1,0-2.1-0.9-2.1-2V54.9
		c-27.3-6.7-56.2-21.1-78.5-38.2c0.5,0.5,3.7,3.8,4.2,4.3c4.3,5,6.6,11.2,6.9,17.8l-0.3,1.2c0.5,23.8-56,44.4-62,5.5
		c12.1,80.5-30.9,158.1-106.1,189c19.6-5.9,38.8,15.9,37.7,29.3c-1,12.1-21.3,39.1-41.3,29.9C70,322.9,115.3,400,105.4,479.8
		c1-2.9,3.4-6.7,5.2-9.1c0.9-1.3,1.6-2.3,2.8-3.4c0-0.1,0.3-0.4,0.3-0.5c0.3-0.3,0.5-0.4,0.8-0.7l-0.7-0.1
		c12.1-11.8,32.1-11.5,43.9,0.3c4.1,4,7.4,9.6,8.9,15l-3.9-25.6c-0.5-3.1,1.1-6.2,3.9-7.4c4.8-1.3,11.5-1.6,12.5,4.7l4.8,27.4
		c0.5,2.9,3.3,4.9,6.3,4.4c43.9-9.7,40.3,3.9,33.1-38.1c-1.1-4,1-8.4,5.3-9.1c4.6-1.4,10-0.8,11.1,4.8l4.8,27.1
		c0.6,3.4,3.7,5.9,7.2,5.6c9-0.7,18.1-0.7,27.2,0c3.5,0.3,6.6-2.1,7.2-5.6l4.8-27.1c0.5-3.1,3.2-5.4,6.3-5.6
		c5.1,0.4,11.2,2.2,10.2,8.6l-4.8,27.4c-0.5,2.9,1.4,5.7,4.4,6.3l32,5.7c3.3,1,7-0.7,7.6-4.2l4.6-26l0.2-1.3
		c1.1-6.1,7.5-6.1,12.2-4.7c3,1.1,4.8,4.3,4.3,7.5l-5.2,25.2c9.2-31.2,54.1-30.8,61.8,0.9C413.8,402.2,459.6,323.4,534.9,293.4z
		 M319.3,444.8c0-3.1,4.8-2.9,4.8,0.1C324.1,448.1,319.2,447.8,319.3,444.8z M192.5,450.2c-3.1,0-3.1-4.8,0-4.8
		C195.6,445.4,195.6,450.2,192.5,450.2z M201,448.6c-3.1,0-3.1-4.8,0-4.8C204.1,443.8,204.1,448.6,201,448.6z M209.4,447.2
		c-3.1,0-3.1-4.8,0-4.8C212.5,442.4,212.5,447.2,209.4,447.2z M330.1,443.9c3.1,0,3.1,4.8,0,4.8C327,448.7,327,443.9,330.1,443.9z
		 M338.6,445.4c3.1,0,3.1,4.8,0,4.8C335.5,450.2,335.5,445.4,338.6,445.4z M187.6,469.3c-1.3,0.1-2.5-0.6-2.7-2
		c-0.1-2.1-2.6-7.5,0.9-8.1c3.5-0.7,3,5.4,3.7,7.3C189.8,467.8,188.9,469.1,187.6,469.3z M221.3,463.3c-1.3,0.2-2.5-0.6-2.7-1.9
		c-0.1-2-2.6-7.6,0.9-8.1c3.5-0.7,3,5.4,3.6,7.3C223.5,461.9,222.6,463.1,221.3,463.3z M312.5,461.4c-0.5,3.1-5.3,2.1-4.6-0.8
		l0.9-5.4c0.5-3.1,5.3-2.1,4.6,0.8L312.5,461.4z M346.2,467.4c-0.5,3.1-5.1,2.1-4.7-0.8c0.7-1.9,0.3-8.1,3.7-7.3
		C348.7,459.8,346.2,465.4,346.2,467.4z"/>
	<g id="parts">
		<g id="Silk-Screen_mini3" class="st6">
			<g id="Calliope_mini_Logo_00000078003646586823282540000018212500217595504788_">
				<path class="st4" d="M99.6,317l-0.7-1.2l1-0.7c0-0.3,0-0.5,0-0.8c-0.1-0.3-0.2-0.6-0.3-0.9c-0.3-0.6-0.9-1.1-1.7-1.2
					c-0.8-0.1-1.6,0.1-2.3,0.6l-0.3,0.1c-0.7,0.4-1.3,1-1.6,1.7c-0.3,0.6-0.3,1.4,0.1,2c0.2,0.3,0.4,0.6,0.6,0.8
					c0.2,0.2,0.5,0.3,0.7,0.4l1.1-0.4l0.7,1.2l-1.6,0.9c-0.6-0.1-1.1-0.3-1.6-0.7c-0.5-0.4-0.9-0.9-1.3-1.5c-0.6-1-0.8-2.2-0.4-3.2
					c0.4-1.1,1.2-2.1,2.3-2.7l0.3-0.1c1-0.6,2.2-0.8,3.4-0.6c1.1,0.2,2.1,1,2.6,2c0.3,0.6,0.5,1.2,0.6,1.9c0.1,0.6,0,1.2-0.2,1.7
					L99.6,317z"/>
				<path class="st4" d="M96.1,320.8l0.4,0.5l8.3-1.5l0.9,1.6l-5.5,6.3l0.2,0.6l-1,0.5l-1.5-2.7l1-0.5l0.4,0.5l0.9-1l-1.5-2.6
					l-1.3,0.3l0.2,0.6l-1,0.5l-1.5-2.7L96.1,320.8z M100.1,322.3l1,1.8l2.3-2.4l0,0L100.1,322.3z"/>
				<path class="st4" d="M100.1,330.1l1-0.6l0.7,0.8l5.7-3.3l-0.3-0.9l0.9-0.5l0.5,0.8l0.9,1.6l0.5,0.8l-1,0.6l-0.7-0.8l-5.6,3.2
					l1.3,2.2l1-0.5l0.7,1.2l-2.2,1.3L100.1,330.1z"/>
				<path class="st4" d="M104.1,337.3l1-0.6l0.7,0.8l5.7-3.3l-0.3-0.9l0.9-0.5l0.5,0.8l0.9,1.6l0.5,0.8l-1,0.6l-0.7-0.8l-5.6,3.2
					l1.3,2.2l1-0.5l0.7,1.2l-2.2,1.3L104.1,337.3z"/>
				<path class="st4" d="M115.3,340.6l1-0.5l1.9,3.3l-1,0.6l-0.7-0.8l-5.7,3.2l0.3,1l-0.9,0.5l-1.9-3.3l1-0.6l0.7,0.8l5.7-3.3
					L115.3,340.6z"/>
				<path class="st4" d="M118.9,354.1c-1,0.6-2.3,0.9-3.4,0.6c-2.2-0.5-3.6-2.7-3.1-4.9c0-0.1,0.1-0.2,0.1-0.3
					c0.5-1.1,1.3-2.1,2.4-2.6l0,0c1-0.6,2.3-0.9,3.4-0.6c1.1,0.2,2.1,0.9,2.6,1.9c0.6,1,0.7,2.2,0.4,3.3
					C120.9,352.6,120,353.6,118.9,354.1z M118.2,352.4c0.7-0.4,1.3-1,1.7-1.7c0.5-1.1,0-2.4-1.1-2.8c-0.2-0.1-0.4-0.2-0.6-0.2
					c-0.8,0-1.7,0.2-2.4,0.7l0,0c-0.7,0.4-1.3,0.9-1.7,1.7c-0.3,0.6-0.3,1.3,0,1.9s0.9,1,1.6,1.1
					C116.5,353.1,117.3,352.9,118.2,352.4L118.2,352.4z"/>
				<path class="st4" d="M125.8,356.9c0.4,0.7,0.6,1.6,0.5,2.4c-0.4,1.6-2,2.5-3.5,2.1h-0.1c-0.8-0.3-1.5-1-1.9-1.8l-0.8-1.4l-1.8,1
					l0.3,0.9l-1,0.5l-1.9-3.3l0.9-0.5l0.7,0.7l5.7-3.3l-0.3-0.9l1-0.6l0.5,0.8L125.8,356.9z M121.2,357.7l0.8,1.4
					c0.2,0.4,0.5,0.7,0.9,0.8c0.4,0.1,0.8,0,1.1-0.2c0.4-0.2,0.6-0.5,0.7-0.9s0-0.8-0.2-1.2l-0.8-1.4L121.2,357.7z"/>
				<path class="st4" d="M126.6,368.7l-1.5-2.7l-2.3,1.3l1.4,2.6l1-0.5l0.7,1.2l-2.2,1.2l-3.6-6.3l0.9-0.5l0.7,0.7l5.7-3.2l-0.3-0.9
					l1-0.6l0.5,0.8l3.1,5.4l-2.2,1.3l-0.7-1.2l0.9-0.6l-1.4-2.6l-2,1.1l1.5,2.7L126.6,368.7z"/>
				<path class="st4" d="M84.8,320.3l-1.4,0.9c0.6,0,1.3,0.1,1.9,0.4s1.1,0.8,1.4,1.4c0.3,0.5,0.5,1.1,0.5,1.6s-0.2,1.1-0.6,1.4
					c0.6,0,1.1,0.2,1.6,0.5s1,0.8,1.3,1.3c0.2,0.4,0.4,0.9,0.5,1.4c0.1,0.4,0,0.9-0.2,1.3c-0.2,0.5-0.5,0.9-0.9,1.3
					c-0.5,0.5-1,0.9-1.6,1.2l-10,5.7l-1.6-2.8l9.9-5.6c0.4-0.2,0.8-0.5,0.9-1c0.1-0.4,0-0.7-0.2-1.1c-0.1-0.3-0.4-0.5-0.7-0.7
					c-0.3-0.1-0.6-0.1-0.9,0l-10.5,5.8l-1.5-2.7l9.9-5.6c0.4-0.2,0.8-0.5,0.9-1c0.1-0.4,0-0.7-0.2-1s-0.4-0.5-0.7-0.7
					c-0.3-0.1-0.6-0.1-0.9,0l-10.5,6l-1.6-2.8l13.6-7.7L84.8,320.3z"/>
				<path class="st4" d="M92.9,334.7l4.1,7.2l-11.1,6.3l2.4,4l-2.4,1.4l-6.4-11.3l2.4-1.4l2.4,4.2l8.6-4.8l-2.4-4.2L92.9,334.7z
					 M98.7,336.6c0.4-0.3,0.9-0.3,1.4-0.2c1,0.4,1.6,1.5,1.5,2.6c-0.3,1-1.4,1.6-2.4,1.3c-0.5-0.2-0.9-0.5-1.2-1
					c-0.3-0.4-0.4-1-0.3-1.5C97.9,337.3,98.2,336.9,98.7,336.6L98.7,336.6z"/>
				<path class="st4" d="M102.9,352.3l-1.8,1.3c0.9,0.1,1.8,0.4,2.6,0.9s1.4,1.2,1.9,2c0.4,0.6,0.6,1.3,0.8,2.1c0.2,0.7,0.2,1.4,0,2
					c-0.2,0.7-0.6,1.4-1.1,1.9c-0.7,0.7-1.4,1.3-2.2,1.7l-8.5,4.8l-1.7-3l8.4-4.8c0.5-0.3,0.9-0.6,1.3-1c0.3-0.3,0.5-0.7,0.6-1.1
					s0.1-0.8,0-1.1c-0.1-0.4-0.3-0.9-0.5-1.3c-0.3-0.6-0.8-1.1-1.4-1.5c-0.6-0.3-1.2-0.5-1.9-0.5l-9.6,5.5l-1.7-3l13.6-7.7
					L102.9,352.3z"/>
				<path class="st4" d="M109.9,364.7l4.1,7.2l-11.1,6.3l2.4,4l-2.4,1.4l-6.4-11.3l2.4-1.4l2.4,4.2l8.6-4.8l-2.4-4.2L109.9,364.7z
					 M115.6,366.7c0.4-0.3,0.9-0.3,1.4-0.2c0.5,0.2,0.9,0.5,1.2,1s0.4,1,0.3,1.5s-0.5,0.9-0.9,1.1c-0.4,0.3-0.9,0.3-1.4,0.2
					c-0.5-0.2-0.9-0.5-1.2-1c-0.3-0.4-0.4-1-0.3-1.5C114.9,367.3,115.2,366.9,115.6,366.7L115.6,366.7z"/>
				<path class="st4" d="M98,294.8l-3.9-6.5c-0.6-1.1-2-1.4-3-0.8l-5.4,3c4.4-2.6,5.9-8.3,3.3-12.7c-2.5-4.3-8-5.8-12.4-3.4l-8.8,5
					l-12.6-5.5c-4.8-2.2-10.6-0.2-12.8,4.7c-1.4,2.9-1.2,6.4,0.5,9.1l1.1,1.9c6.4-2.6,14.8-4.8,21.4-3.7v0.2l4.8,8.5
					c-2.4,6.4-8.7,12.1-14.2,16.3l1.5,2.7c1.7,3,5.5,4.1,8.5,2.4l0,0l20.7-11.8l10.5-6c1.1-0.5,1.6-1.8,1.1-2.9
					C98.2,295.1,98.1,294.9,98,294.8z M82.4,277.9l3.8,6.7l-4.5,2.6c-1.5,0.8-3.3,0.3-4.1-1.1l-0.8-1.4c-0.8-1.4-0.4-3.3,1.1-4.1
					c0,0,0,0,0.1,0L82.4,277.9z M68.5,283.7l7.5-0.3l-4.8,5.1L68.5,283.7z M71.3,288.6l6.8-1.5l-4.1,6.3L71.3,288.6z M81.6,295
					l9.9-5.6l4.6,8l-9.9,5.6L81.6,295z"/>
				<path class="st4" d="M53.7,307c0.6-6,6.7-14.1,11.7-20.7l-17.7,10.1L53.7,307z"/>
			</g>
			<path id="Motoren-Pinleiste_1" class="st7" d="M343.8,420.2h35.7v-15.9h-35.7"/>
			<path id="Motoren-Pinleiste_2" class="st7" d="M343.8,377.4h35.7v-19.9h-35.7V377.4z"/>
			<g id="Taste_B">
				<path class="st7" d="M373.2,222.8l0.1-1.3l0.2-1.3l0.2-1.3l0.3-1.3l0.4-1.2l0.4-1.2l0.5-1.2l0.5-1.2l0.6-1.1l0.6-1.1l0.7-1.1
					l0.7-1l0.8-1l0.8-0.9l0.9-0.9l0.9-0.9l0.9-0.8l1-0.8l1-0.7l1.1-0.7l1.1-0.6l1.1-0.6l1.2-0.5l1.2-0.5l1.2-0.4l1.2-0.4l1.3-0.3
					l1.3-0.2l1.3-0.2l1.3-0.1h1.3h1.3l1.3,0.1l1.3,0.2l1.3,0.2l1.3,0.3l1.2,0.4l1.2,0.4l1.2,0.5l1.2,0.5l1.1,0.6l1.1,0.6l1.1,0.7
					l1,0.7l1,0.8l0.9,0.8l0.9,0.9l0.9,0.9l0.8,0.9l0.8,1l0.7,1l0.7,1.1l0.6,1.1l0.6,1.1l0.5,1.2l0.5,1.2l0.4,1.2l0.4,1.2l0.3,1.3
					l0.2,1.3l0.2,1.3l0.1,1.3v1.3v1.3l-0.1,1.3l-0.2,1.3l-0.2,1.3l-0.3,1.3l-0.4,1.2l-0.4,1.2l-0.5,1.2l-0.5,1.2l-0.6,1.1l-0.6,1.1
					l-0.7,1.1l-0.7,1l-0.8,1l-0.8,0.9l-0.9,0.9l-0.9,0.9l-0.9,0.8l-1,0.8l-1,0.7l-1.1,0.7l-1.1,0.6l-1.1,0.6l-1.2,0.5l-1.2,0.5
					L407,249l-1.2,0.4l-1.3,0.3l-1.3,0.2l-1.3,0.2l-1.3,0.1h-1.3H398l-1.3-0.1l-1.3-0.2l-1.3-0.2l-1.3-0.3l-1.2-0.4l-1.2-0.4
					l-1.2-0.5l-1.2-0.5l-1.1-0.6l-1.1-0.6l-1.1-0.7l-1-0.7l-1-0.8l-0.9-0.8l-0.9-0.9l-0.9-0.9l-0.8-0.9l-0.8-1l-0.7-1l-0.7-1.1
					l-0.6-1.1l-0.6-1.1l-0.5-1.2l-0.5-1.2l-0.4-1.2l-0.4-1.2l-0.3-1.3l-0.2-1.3l-0.2-1.3l-0.1-1.3v-1.3h4.6v1.1l0.1,1.1l0.1,1.1
					l0.2,1.1l0.2,1l0.3,1l0.3,1l0.4,1l0.4,1l0.5,0.9l0.5,0.9l0.6,0.9l0.6,0.8l0.6,0.8l0.7,0.8l0.7,0.7l0.7,0.7l0.8,0.7l0.8,0.6
					l0.8,0.6l0.9,0.6l0.9,0.5l0.9,0.5l1,0.4l1,0.4l1,0.3l1,0.3l1,0.2l1.1,0.2l1.1,0.1l1.1,0.1h1.1h1.1l1.1-0.1l1.1-0.1l1.1-0.2
					l1-0.2l1-0.3l1-0.3l1-0.4l1-0.4l0.9-0.5l0.9-0.5l0.9-0.6l0.8-0.6l0.8-0.6l0.8-0.7l0.7-0.7l0.7-0.7l0.7-0.8l0.6-0.8l0.6-0.8
					l0.6-0.9l0.5-0.9l0.5-0.9l0.4-1l0.4-1l0.3-1l0.3-1l0.2-1l0.2-1.1l0.1-1.1l0.1-1.1v-1.1V223l-0.1-1.1l-0.1-1.1l-0.2-1.1l-0.2-1
					l-0.3-1l-0.3-1l-0.4-1l-0.4-1l-0.5-0.9l-0.5-0.9L417,212l-0.6-0.8l-0.6-0.8l-0.7-0.8l-0.7-0.7l-0.7-0.7l-0.8-0.7l-0.8-0.6
					l-0.8-0.6l-0.9-0.6l-0.9-0.5l-0.9-0.5l-1-0.4l-1-0.4l-1-0.3l-1-0.3l-1-0.2l-1.1-0.2l-1.1-0.1l-1.1-0.1h-1.1h-1.1l-1.1,0.1
					l-1.1,0.1l-1.1,0.2l-1,0.2l-1,0.3l-1,0.3l-1,0.4l-1,0.4l-0.9,0.5l-0.9,0.5l-0.9,0.6l-0.8,0.6l-0.8,0.6l-0.8,0.7l-0.7,0.7
					l-0.7,0.7l-0.7,0.8l-0.6,0.8l-0.6,0.8l-0.6,0.9l-0.5,0.9l-0.5,0.9l-0.4,1l-0.4,1l-0.3,1l-0.3,1l-0.2,1l-0.2,1.1l-0.1,1.1
					l-0.1,1.1v1.1h-4.6l0,0L373.2,222.8L373.2,222.8z"/>
				<path class="st7" d="M399.1,216.1h0.3h0.3h0.3h0.3h0.3h0.3l0.3,0.1l0.2,0.1l0.2,0.1l0.2,0.1l0.2,0.1l0.2,0.1l0.2,0.1l0.2,0.1
					l0.2,0.1l0.2,0.1l0.2,0.1l0.1,0.2l0.1,0.2l0.1,0.2l0.1,0.2l0.1,0.2l0.1,0.2l0.1,0.2l0.1,0.2l0.1,0.2l0.1,0.2v0.2v0.2v0.2v0.3
					v0.3v0.2v0.1v0.1v0.1v0.1v0.1v0.1v0.1v0.1v0.1v0.1v0.1l-0.1,0.1l-0.1,0.1l-0.1,0.1l-0.1,0.1l-0.1,0.1l-0.1,0.1l-0.1,0.1
					l-0.1,0.1l-0.1,0.1l-0.1,0.1l-0.1,0.1l-0.1,0.1l-0.1,0.1l-0.1,0.1l-0.1,0.1l-0.1,0.1l-0.1,0.1l-0.1,0.1l-0.1,0.1l-0.1,0.1h0.1
					h0.1l0.1,0.1l0.1,0.1l0.1,0.1l0.1,0.1l0.1,0.1l0.1,0.1l0.1,0.1l0.1,0.1l0.1,0.1l0.1,0.1l0.1,0.1l0.1,0.1l0.1,0.1l0.1,0.1
					l0.1,0.1l0.1,0.1l0.1,0.1l0.1,0.1l0.1,0.1v0.1v0.1v0.1v0.1v0.1v0.2v0.2v0.2v0.2v0.2v0.2v0.3v0.3v0.3v0.3v0.3l-0.1,0.2l-0.1,0.2
					l-0.1,0.2l-0.1,0.2l-0.1,0.2l-0.1,0.2l-0.1,0.2l-0.1,0.2l-0.1,0.2l-0.1,0.2l-0.2,0.2l-0.2,0.1l-0.2,0.1l-0.2,0.1l-0.2,0.1
					l-0.2,0.1l-0.2,0.1l-0.2,0.1l-0.2,0.1l-0.2,0.1l-0.2,0.1l-0.3,0.1h-0.3h-0.3h-0.3h-0.3h-0.3H394v-2.7h3.2h2.1h0.1h0.1h0.1h0.1
					h0.1h0.1h0.1h0.1h0.1h0.1h0.1h0.1l0.1-0.1l0.1-0.1l0.1-0.1l0.1-0.1l0.1-0.1l0.1-0.1v-0.1v-0.1v-0.1v-0.1v-0.1v-0.1v-0.1V228
					v-0.1v-0.1v-0.1v-0.1v-0.1v-0.1v-0.3v-0.2v-0.2v-0.2l-0.1-0.2l-0.1-0.2V226v-0.1v-0.1v-0.1l-0.1-0.1l-0.1-0.1l-0.1-0.1l-0.1-0.1
					l-0.1-0.1h-0.1h-0.1h-0.1H400h-0.1h-0.1h-0.1h-0.1h-0.1h-0.1h-0.1H397l0,0v4.2h-3v-6.5h3h1.7h0.1h0.1h0.1h0.1h0.1h0.1h0.1h0.1
					h0.1h0.1h0.1h0.1h0.1l0.1-0.1l0.1-0.1l0.1-0.1l0.1-0.1l0.1-0.1v-0.1v-0.1v-0.1V222v-0.1v-0.1v-0.1v-0.1v-0.1v-0.1v-0.1v-0.1
					v-0.1V221v-0.1v-0.1v-0.1v-0.1v-0.1v-0.1v-0.1v-0.1v-0.1V220v-0.1v-0.1v-0.1v-0.1v-0.1l-0.1-0.1l-0.1-0.1l-0.1-0.1l-0.1-0.1H400
					h-0.1h-0.1h-0.1h-0.1h-0.1h-0.1h-0.1h-0.1h-0.1H399h-0.1h-0.1h-1.7v3.8H394v-6.8L399.1,216.1L399.1,216.1L399.1,216.1z"/>
			</g>
			<g id="Taste_A">
				<path class="st7" d="M126.9,224.8l5,16h-3.4l-0.9-3.3l0,0h-4.4l-0.9,3.3H119l1.9-6h3.1h3l-1.5-5.7l-1.5,5.7h-3.1l3.1-10H126.9z"
					/>
				<path class="st7" d="M125.5,197.8l-34.9,34.9l34.9,34.9l34.9-34.9L125.5,197.8z M96.9,232.8l28.6-28.6l28.6,28.6l-28.6,28.6
					L96.9,232.8z"/>
			</g>
		</g>
		<g id="Mikrofon">
			<path class="st8" d="M460.8,273.6v17.2c0,0.7-0.6,1.4-1.4,1.4h-22.1c-0.7,0-1.4-0.6-1.4-1.4v-17.2c0-0.7,0.6-1.4,1.4-1.4h22.1
				C460.2,272.2,460.8,272.8,460.8,273.6z"/>
			<path class="st9" d="M460.2,274v16.3c0,0.7-0.6,1.3-1.3,1.3H438c-0.7,0-1.3-0.6-1.3-1.3V274c0-0.7,0.6-1.3,1.3-1.3h20.9
				C459.6,272.7,460.2,273.3,460.2,274z"/>
		</g>
		<circle cx="441.9" cy="282.2" r="1.4"/>
		<path class="st10" d="M405.3,314.3l18.7,14.6l-4.2,5.3l-18.7-14.6L405.3,314.3z"/>
		<path class="st10" d="M427.5,349.7l18.2,14.2l-6.3,8l-18.2-14.2L427.5,349.7z"/>
		<path class="st10" d="M455.5,313.9l18.2,14.2l-6.3,8l-18.2-14.2L455.5,313.9z"/>
		<path class="st10" d="M413.6,303.6l18.7,14.6l-4.2,5.3l-18.7-14.6L413.6,303.6z"/>
		<path class="st10" d="M354.3,301.2l-0.1,0.6l-0.3,0.7l-0.6,0.6l-0.7,0.3l-0.6,0.1h-11l-0.6-0.1l-0.7-0.3l-0.6-0.6l-0.3-0.7
			l-0.1-0.6v-10.9l0.1-0.6l0.3-0.7l0.6-0.6l0.7-0.3l0.6-0.1h10.9l0.6,0.1l0.7,0.3l0.6,0.6l0.3,0.7l0.1,0.6L354.3,301.2L354.3,301.2z
			"/>
		<path class="st10" d="M402.5,301.2l-0.1,0.6l-0.3,0.7l-0.6,0.6l-0.7,0.3l-0.6,0.1h-10.9l-0.6-0.1l-0.7-0.3l-0.6-0.6l-0.3-0.7
			l-0.1-0.6v-10.9l0.1-0.6l0.3-0.7l0.6-0.6l0.7-0.3l0.6-0.1h10.9l0.6,0.1l0.7,0.3l0.6,0.6l0.3,0.7l0.1,0.6V301.2z"/>
		<path class="st10" d="M402.5,253.1l-0.1,0.6l-0.3,0.7l-0.6,0.6l-0.7,0.3l-0.6,0.1h-10.9l-0.6-0.1L388,255l-0.6-0.6l-0.3-0.7
			l-0.1-0.6v-10.9l0.1-0.6l0.3-0.7l0.6-0.6l0.7-0.3l0.6-0.1h10.9l0.6,0.1l0.7,0.3l0.6,0.6l0.3,0.7l0.1,0.6L402.5,253.1L402.5,253.1z
			"/>
		<path class="st10" d="M354.3,253.1l-0.1,0.6l-0.3,0.7l-0.6,0.6l-0.7,0.3l-0.6,0.1h-11l-0.6-0.1l-0.7-0.3l-0.6-0.6l-0.3-0.7
			l-0.1-0.6v-10.9l0.1-0.6l0.3-0.7l0.6-0.6l0.7-0.3l0.6-0.1h10.9l0.6,0.1l0.7,0.3l0.6,0.6l0.3,0.7l0.1,0.6L354.3,253.1L354.3,253.1z
			"/>
		<path class="st10" d="M149.1,373.5h-6v-12.4h6V373.5z"/>
		<path class="st10" d="M149.1,416.7h-6v-12.4h6V416.7z"/>
		<path class="st10" d="M166.3,373.5h-6v-12.4h6V373.5z"/>
		<path class="st10" d="M166.3,416.7h-6v-12.4h6V416.7z"/>
		<path class="st10" d="M183.5,373.5h-6v-12.4h6V373.5z"/>
		<path class="st10" d="M183.5,416.7h-6v-12.4h6V416.7z"/>
		<path class="st10" d="M200.7,373.5h-6v-12.4h6V373.5z"/>
		<path class="st10" d="M200.7,416.7h-6v-12.4h6V416.7z"/>
		<path class="st10" d="M218,373.5h-6v-12.4h6V373.5z"/>
		<path class="st10" d="M218,416.7h-6v-12.4h6V416.7z"/>
		<path class="st10" d="M235.2,373.5h-6v-12.4h6V373.5z"/>
		<path class="st10" d="M235.2,416.7h-6v-12.4h6V416.7z"/>
		<path class="st10" d="M252.4,373.5h-6v-12.4h6V373.5z"/>
		<path class="st10" d="M252.4,416.7h-6v-12.4h6V416.7z"/>
		<path class="st10" d="M269.7,373.5h-6v-12.4h6V373.5z"/>
		<path class="st10" d="M269.7,416.7h-6v-12.4h6V416.7z"/>
		<path class="st10" d="M286.9,373.5h-6v-12.4h6V373.5z"/>
		<path class="st10" d="M286.9,416.7h-6v-12.4h6V416.7z"/>
		<path class="st10" d="M304.1,373.5h-6v-12.4h6V373.5z"/>
		<path class="st10" d="M304.1,416.7h-6v-12.4h6V416.7z"/>
		<path class="st10" d="M321.4,373.5h-6v-12.4h6V373.5z"/>
		<path class="st10" d="M321.4,416.7h-6v-12.4h6V416.7z"/>
		<path class="st10" d="M338.6,373.5h-6v-12.4h6V373.5z"/>
		<path class="st10" d="M338.6,416.7h-6v-12.4h6V416.7z"/>
		<path class="st10" d="M355.8,373.5h-6v-12.4h6V373.5z"/>
		<path class="st10" d="M355.8,416.7h-6v-12.4h6V416.7z"/>
		<path class="st10" d="M373,373.5h-6v-12.4h6V373.5z"/>
		<path class="st10" d="M373,416.7h-6v-12.4h6V416.7z"/>
		<path class="st10" d="M390.3,373.5h-6v-12.4h6V373.5z"/>
		<path class="st10" d="M390.3,416.7h-6v-12.4h6V416.7z"/>
		<path class="st10" d="M116.5,80.4h8.1v9.5h-8.1V80.4z"/>
		<path class="st10" d="M116.5,95.3h8.1v9.5h-8.1V95.3z"/>
		<path class="st10" d="M128.1,95.3h8.1v9.5h-8.1V95.3z"/>
		<path class="st10" d="M128.1,80.4h8.1v9.5h-8.1V80.4z"/>
		<path id="Lautsprecher" class="st11" d="M352.5,300.5h36.1c0.4,0,0.7-0.1,1-0.4l9.4-9.4c0.3-0.3,0.4-0.6,0.4-1v-36.1
			c0-0.4-0.1-0.7-0.4-1l-9.4-9.4c-0.3-0.3-0.6-0.4-1-0.4h-36.1c-0.4,0-0.7,0.1-1,0.4l-9.4,9.4c-0.3,0.3-0.4,0.6-0.4,1v36.1
			c0,0.4,0.1,0.7,0.4,1l9.4,9.4C351.8,300.3,352.1,300.5,352.5,300.5z"/>
		<path id="Anwendungs-Prozessor" class="st11" d="M183.6,289.2L152,320.8c-0.5,0.5-1.4,0.5-1.9,0l-31.6-31.6
			c-0.5-0.5-0.5-1.4,0-1.9l31.6-31.6c0.5-0.5,1.4-0.5,1.9,0l31.6,31.6C184.1,287.8,184.1,288.7,183.6,289.2z"/>
		<path class="st10" d="M166.6,132.6h-0.2l-0.1-0.1l-0.1-0.1v-0.2v-4.7v-0.2l0.1-0.1l0.1-0.1h0.2h0.8h0.2l0.1,0.1l0.1,0.1v0.2v4.7
			v0.2l-0.1,0.1l-0.1,0.1h-0.2H166.6z"/>
		<path class="st10" d="M169.4,132.6h-0.2l-0.1-0.1l-0.1-0.1v-0.2v-4.7v-0.2l0.1-0.1l0.1-0.1h0.2h0.8h0.2l0.1,0.1l0.1,0.1v0.2v4.7
			v0.2l-0.1,0.1l-0.1,0.1h-0.2H169.4z"/>
		<path class="st10" d="M172.1,132.6h-0.2l-0.1-0.1l-0.1-0.1v-0.2v-4.7v-0.2l0.1-0.1l0.1-0.1h0.2h0.8h0.2l0.1,0.1l0.1,0.1v0.2v4.7
			v0.2l-0.1,0.1l-0.1,0.1h-0.2H172.1z"/>
		<path class="st10" d="M174.8,132.6h-0.2l-0.1-0.1l-0.1-0.1v-0.2v-4.7v-0.2l0.1-0.1l0.1-0.1h0.2h0.8h0.2l0.1,0.1l0.1,0.1v0.2v4.7
			v0.2l-0.1,0.1l-0.1,0.1h-0.2H174.8z"/>
		<path class="st10" d="M177.5,132.6h-0.2l-0.1-0.1l-0.1-0.1v-0.2v-4.7v-0.2l0.1-0.1l0.1-0.1h0.2h0.8h0.2l0.1,0.1l0.1,0.1v0.2v4.7
			v0.2l-0.1,0.1l-0.1,0.1h-0.2H177.5z"/>
		<path class="st10" d="M180.2,132.6H180l-0.1-0.1l-0.1-0.1v-0.2v-4.7v-0.2l0.1-0.1l0.1-0.1h0.2h0.8h0.2l0.1,0.1l0.1,0.1v0.2v4.7
			v0.2l-0.1,0.1l-0.1,0.1H181H180.2z"/>
		<path class="st10" d="M182.9,132.6h-0.2l-0.1-0.1l-0.1-0.1v-0.2v-4.7v-0.2l0.1-0.1l0.1-0.1h0.2h0.8h0.2l0.1,0.1l0.1,0.1v0.2v4.7
			v0.2l-0.1,0.1l-0.1,0.1h-0.2H182.9z"/>
		<path class="st10" d="M185.6,132.6h-0.2l-0.1-0.1l-0.1-0.1v-0.2v-4.7v-0.2l0.1-0.1l0.1-0.1h0.2h0.8h0.2l0.1,0.1l0.1,0.1v0.2v4.7
			v0.2l-0.1,0.1l-0.1,0.1h-0.2H185.6z"/>
		<path class="st10" d="M188.3,132.6h-0.2l-0.1-0.1l-0.1-0.1v-0.2v-4.7v-0.2l0.1-0.1l0.1-0.1h0.2h0.8h0.2l0.1,0.1l0.1,0.1v0.2v4.7
			v0.2l-0.1,0.1l-0.1,0.1h-0.2H188.3z"/>
		<path class="st10" d="M191.1,132.6h-0.2l-0.1-0.1l-0.1-0.1v-0.2v-4.7v-0.2l0.1-0.1l0.1-0.1h0.2h0.8h0.2l0.1,0.1l0.1,0.1v0.2v4.7
			v0.2l-0.1,0.1l-0.1,0.1h-0.2H191.1z"/>
		<path class="st10" d="M193.4,126.3h-0.2l-0.1-0.1l-0.1-0.1v-0.2v-0.8v-0.2l0.1-0.1l0.1-0.1h0.2h4.7h0.2l0.1,0.1l0.1,0.1v0.2v0.8
			v0.2l-0.1,0.1l-0.1,0.1h-0.2H193.4z"/>
		<path class="st10" d="M193.4,123.6h-0.2l-0.1-0.1l-0.1-0.1v-0.2v-0.8v-0.2l0.1-0.1l0.1-0.1h0.2h4.7h0.2l0.1,0.1l0.1,0.1v0.2v0.8
			v0.2l-0.1,0.1l-0.1,0.1h-0.2H193.4z"/>
		<path class="st10" d="M193.4,120.9h-0.2l-0.1-0.1l-0.1-0.1v-0.2v-0.8v-0.2l0.1-0.1l0.1-0.1h0.2h4.7h0.2l0.1,0.1l0.1,0.1v0.2v0.8
			v0.2l-0.1,0.1l-0.1,0.1h-0.2H193.4z"/>
		<path class="st10" d="M193.4,118.2h-0.2l-0.1-0.1L193,118v-0.2V117v-0.2l0.1-0.1l0.1-0.1h0.2h4.7h0.2l0.1,0.1l0.1,0.1v0.2v0.8v0.2
			l-0.1,0.1l-0.1,0.1h-0.2H193.4z"/>
		<path class="st10" d="M193.4,115.5h-0.2l-0.1-0.1l-0.1-0.1v-0.2v-0.8v-0.2l0.1-0.1l0.1-0.1h0.2h4.7h0.2l0.1,0.1l0.1,0.1v0.2v0.8
			v0.2l-0.1,0.1l-0.1,0.1h-0.2H193.4z"/>
		<path class="st10" d="M193.4,112.8h-0.2l-0.1-0.1l-0.1-0.1v-0.2v-0.8v-0.2l0.1-0.1l0.1-0.1h0.2h4.7h0.2l0.1,0.1l0.1,0.1v0.2v0.8
			v0.2l-0.1,0.1l-0.1,0.1h-0.2H193.4z"/>
		<path class="st10" d="M193.4,110.1h-0.2l-0.1-0.1l-0.1-0.1v-0.2v-0.8v-0.2l0.1-0.1l0.1-0.1h0.2h4.7h0.2l0.1,0.1l0.1,0.1v0.2v0.8
			v0.2l-0.1,0.1l-0.1,0.1h-0.2H193.4z"/>
		<path class="st10" d="M193.4,107.4h-0.2l-0.1-0.1l-0.1-0.1V107v-0.8V106l0.1-0.1l0.1-0.1h0.2h4.7h0.2l0.1,0.1l0.1,0.1v0.2v0.8v0.2
			l-0.1,0.1l-0.1,0.1h-0.2C198.1,107.4,193.4,107.4,193.4,107.4z"/>
		<path class="st10" d="M193.4,104.6h-0.2l-0.1-0.1l-0.1-0.1v-0.2v-0.8v-0.2l0.1-0.1l0.1-0.1h0.2h4.7h0.2l0.1,0.1l0.1,0.1v0.2v0.8
			v0.2l-0.1,0.1l-0.1,0.1h-0.2H193.4z"/>
		<path class="st10" d="M193.4,101.9h-0.2l-0.1-0.1l-0.1-0.1v-0.2v-0.8v-0.2l0.1-0.1l0.1-0.1h0.2h4.7h0.2l0.1,0.1l0.1,0.1v0.2v0.8
			v0.2l-0.1,0.1l-0.1,0.1h-0.2H193.4z"/>
		<path class="st10" d="M191.1,99.5h-0.2l-0.1-0.1l-0.1-0.1v-0.2v-4.7v-0.2l0.1-0.1l0.1-0.1h0.2h0.8h0.2l0.1,0.1l0.1,0.1v0.2v4.7
			v0.2l-0.1,0.1l-0.1,0.1h-0.2H191.1z"/>
		<path class="st10" d="M188.3,99.5h-0.2l-0.1-0.1l-0.1-0.1v-0.2v-4.7v-0.2l0.1-0.1l0.1-0.1h0.2h0.8h0.2l0.1,0.1l0.1,0.1v0.2v4.7
			v0.2l-0.1,0.1l-0.1,0.1h-0.2H188.3z"/>
		<path class="st10" d="M185.6,99.5h-0.2l-0.1-0.1l-0.1-0.1v-0.2v-4.7v-0.2l0.1-0.1l0.1-0.1h0.2h0.8h0.2l0.1,0.1l0.1,0.1v0.2v4.7
			v0.2l-0.1,0.1l-0.1,0.1h-0.2H185.6z"/>
		<path class="st10" d="M182.9,99.5h-0.2l-0.1-0.1l-0.1-0.1v-0.2v-4.7v-0.2l0.1-0.1l0.1-0.1h0.2h0.8h0.2l0.1,0.1l0.1,0.1v0.2v4.7
			v0.2l-0.1,0.1l-0.1,0.1h-0.2H182.9z"/>
		<path class="st10" d="M180.2,99.5H180l-0.1-0.1l-0.1-0.1v-0.2v-4.7v-0.2l0.1-0.1L180,94h0.2h0.8h0.2l0.1,0.1l0.1,0.1v0.2v4.7v0.2
			l-0.1,0.1l-0.1,0.1H181L180.2,99.5L180.2,99.5z"/>
		<path class="st10" d="M177.5,99.5h-0.2l-0.1-0.1l-0.1-0.1v-0.2v-4.7v-0.2l0.1-0.1l0.1-0.1h0.2h0.8h0.2l0.1,0.1l0.1,0.1v0.2v4.7
			v0.2l-0.1,0.1l-0.1,0.1h-0.2H177.5z"/>
		<path class="st10" d="M174.8,99.5h-0.2l-0.1-0.1l-0.1-0.1v-0.2v-4.7v-0.2l0.1-0.1l0.1-0.1h0.2h0.8h0.2l0.1,0.1l0.1,0.1v0.2v4.7
			v0.2l-0.1,0.1l-0.1,0.1h-0.2H174.8z"/>
		<path class="st10" d="M172.1,99.5h-0.2l-0.1-0.1l-0.1-0.1v-0.2v-4.7v-0.2l0.1-0.1l0.1-0.1h0.2h0.8h0.2l0.1,0.1l0.1,0.1v0.2v4.7
			v0.2l-0.1,0.1l-0.1,0.1h-0.2H172.1z"/>
		<path class="st10" d="M169.4,99.5h-0.2l-0.1-0.1l-0.1-0.1v-0.2v-4.7v-0.2l0.1-0.1l0.1-0.1h0.2h0.8h0.2l0.1,0.1l0.1,0.1v0.2v4.7
			v0.2l-0.1,0.1l-0.1,0.1h-0.2H169.4z"/>
		<path class="st10" d="M166.6,99.5h-0.2l-0.1-0.1l-0.1-0.1v-0.2v-4.7v-0.2l0.1-0.1l0.1-0.1h0.2h0.8h0.2l0.1,0.1l0.1,0.1v0.2v4.7
			v0.2l-0.1,0.1l-0.1,0.1h-0.2H166.6z"/>
		<path class="st10" d="M160.4,101.9h-0.2l-0.1-0.1l-0.1-0.1v-0.2v-0.8v-0.2l0.1-0.1l0.1-0.1h0.2h4.7h0.2l0.1,0.1l0.1,0.1v0.2v0.8
			v0.2l-0.1,0.1l-0.1,0.1h-0.2H160.4z"/>
		<path class="st10" d="M160.4,104.6h-0.2l-0.1-0.1l-0.1-0.1v-0.2v-0.8v-0.2l0.1-0.1l0.1-0.1h0.2h4.7h0.2l0.1,0.1l0.1,0.1v0.2v0.8
			v0.2l-0.1,0.1l-0.1,0.1h-0.2H160.4z"/>
		<path class="st10" d="M160.4,107.4h-0.2l-0.1-0.1l-0.1-0.1V107v-0.8V106l0.1-0.1l0.1-0.1h0.2h4.7h0.2l0.1,0.1l0.1,0.1v0.2v0.8v0.2
			l-0.1,0.1l-0.1,0.1h-0.2C165.1,107.4,160.4,107.4,160.4,107.4z"/>
		<path class="st10" d="M160.4,110.1h-0.2l-0.1-0.1l-0.1-0.1v-0.2v-0.8v-0.2l0.1-0.1l0.1-0.1h0.2h4.7h0.2l0.1,0.1l0.1,0.1v0.2v0.8
			v0.2l-0.1,0.1l-0.1,0.1h-0.2H160.4z"/>
		<path class="st10" d="M160.4,112.8h-0.2l-0.1-0.1l-0.1-0.1v-0.2v-0.8v-0.2l0.1-0.1l0.1-0.1h0.2h4.7h0.2l0.1,0.1l0.1,0.1v0.2v0.8
			v0.2l-0.1,0.1l-0.1,0.1h-0.2H160.4z"/>
		<path class="st10" d="M160.4,115.5h-0.2l-0.1-0.1l-0.1-0.1v-0.2v-0.8v-0.2l0.1-0.1l0.1-0.1h0.2h4.7h0.2l0.1,0.1l0.1,0.1v0.2v0.8
			v0.2l-0.1,0.1l-0.1,0.1h-0.2H160.4z"/>
		<path class="st10" d="M160.4,118.2h-0.2l-0.1-0.1L160,118v-0.2V117v-0.2l0.1-0.1l0.1-0.1h0.2h4.7h0.2l0.1,0.1l0.1,0.1v0.2v0.8v0.2
			l-0.1,0.1l-0.1,0.1h-0.2H160.4z"/>
		<path class="st10" d="M160.4,120.9h-0.2l-0.1-0.1l-0.1-0.1v-0.2v-0.8v-0.2l0.1-0.1l0.1-0.1h0.2h4.7h0.2l0.1,0.1l0.1,0.1v0.2v0.8
			v0.2l-0.1,0.1l-0.1,0.1h-0.2H160.4z"/>
		<path class="st10" d="M160.4,123.6h-0.2l-0.1-0.1l-0.1-0.1v-0.2v-0.8v-0.2l0.1-0.1l0.1-0.1h0.2h4.7h0.2l0.1,0.1l0.1,0.1v0.2v0.8
			v0.2l-0.1,0.1l-0.1,0.1h-0.2H160.4z"/>
		<path class="st10" d="M160.4,126.3h-0.2l-0.1-0.1l-0.1-0.1v-0.2v-0.8v-0.2l0.1-0.1l0.1-0.1h0.2h4.7h0.2l0.1,0.1l0.1,0.1v0.2v0.8
			v0.2l-0.1,0.1l-0.1,0.1h-0.2H160.4z"/>
		<g>
			<path class="st9" d="M134.6,82.9V102c0,0.9-0.7,1.6-1.6,1.6h-13.7c-0.9,0-1.6-0.7-1.6-1.6V82.9c0-0.9,0.7-1.6,1.6-1.6H133
				C133.9,81.3,134.6,82,134.6,82.9z"/>
			<path class="st12" d="M134.4,83.1v18.7c0,0.9-0.7,1.6-1.6,1.6h-13.4c-0.9,0-1.6-0.7-1.6-1.6V83.1c0-0.9,0.7-1.6,1.6-1.6h13.4
				C133.7,81.6,134.4,82.3,134.4,83.1z"/>
		</g>
		<path class="st10" d="M169.6,328.3v8.1h-9.5v-8.1H169.6z"/>
		<path class="st10" d="M154.7,328.3v8.1h-9.5v-8.1H154.7z"/>
		<path class="st10" d="M154.7,339.8v8.1h-9.5v-8.1H154.7z"/>
		<path class="st10" d="M169.6,339.8v8.1h-9.5v-8.1H169.6z"/>
		<g>
			<path class="st9" d="M167.1,346.4H148c-0.9,0-1.6-0.7-1.6-1.6v-13.7c0-0.9,0.7-1.6,1.6-1.6h19.1c0.9,0,1.6,0.7,1.6,1.6v13.7
				C168.7,345.7,168,346.4,167.1,346.4z"/>
			<path class="st12" d="M166.9,346.2h-18.7c-0.9,0-1.6-0.7-1.6-1.6v-13.4c0-0.9,0.7-1.6,1.6-1.6h18.7c0.9,0,1.6,0.7,1.6,1.6v13.4
				C168.4,345.5,167.7,346.2,166.9,346.2z"/>
		</g>
		<path id="Interface-Prozessor" class="st11" d="M196.3,97.9v31c0,0.7-0.6,1.4-1.4,1.4h-31c-0.7,0-1.4-0.6-1.4-1.4v-31
			c0-0.7,0.6-1.4,1.4-1.4h31C195.7,96.6,196.3,97.2,196.3,97.9z"/>
	</g>
	<g id="interaktiv">
		<g id="JacDac">
			<path class="st9" d="M195,449.4c0.3-0.7,0.5-1.4,0.3-2.2c-0.3-1.9-2-3.2-3.8-3.1c-0.2,0-0.3,0-0.5,0c-2,0.4-3.4,2.3-3,4.3
				c0.1,0.8,0.5,1.5,1,2l4,22.7c0.3,1.5,1.7,2.5,3.2,2.2l0.7-0.1c1.5-0.3,2.5-1.7,2.2-3.2L195,449.4z M191.7,450.3
				c-1.3,0-2.4-1.1-2.4-2.4s1.1-2.4,2.4-2.4c1.3,0,2.4,1.1,2.4,2.4C194.1,449.2,193,450.3,191.7,450.3z"/>
			<path class="st9" d="M203.5,447.9L203.5,447.9c0.3-0.7,0.5-1.4,0.3-2.2c-0.4-2-2.3-3.4-4.3-3s-3.4,2.3-3,4.3c0.1,0.8,0.5,1.5,1,2
				l4.6,26c0.3,1.5,1.7,2.5,3.2,2.2l0.7-0.1c1.5-0.3,2.5-1.7,2.2-3.2L203.5,447.9z M200.2,448.7c-1.3,0-2.4-1.1-2.4-2.4
				s1.1-2.4,2.4-2.4c1.3,0,2.4,1.1,2.4,2.4S201.5,448.7,200.2,448.7z"/>
			<path class="st9" d="M212,446.4c0.3-0.7,0.5-1.4,0.3-2.2c-0.1-0.8-0.5-1.5-1.1-2c-0.8-0.8-2-1.2-3.3-1c-2,0.4-3.4,2.3-3,4.3
				c0.1,0.8,0.5,1.5,1,2l4.6,26c0.3,1.5,1.7,2.5,3.2,2.2l0.7-0.1c1.5-0.3,2.5-1.7,2.2-3.1L212,446.4z M208.6,447.3
				c-1.3,0-2.4-1.1-2.4-2.4s1.1-2.4,2.4-2.4s2.4,1.1,2.4,2.4C211,446.2,209.9,447.3,208.6,447.3z"/>
			<path class="st9" d="M330,442.7c-2-0.4-4,1-4.3,3c-0.1,0.8,0,1.5,0.3,2.2l0,0l-4.6,26c-0.3,1.5,0.7,2.9,2.2,3.2l0.7,0.1
				c1.5,0.3,2.9-0.7,3.2-2.2l4.6-26c0.5-0.5,0.9-1.2,1-2C333.4,445,332,443.1,330,442.7z M329.3,448.7c-1.3,0-2.4-1.1-2.4-2.4
				s1.1-2.4,2.4-2.4s2.4,1.1,2.4,2.4S330.6,448.7,329.3,448.7z"/>
			<path class="st9" d="M321.5,441.2c-1.3-0.2-2.6,0.2-3.4,1.2c-0.5,0.5-0.8,1.1-0.9,1.9s0,1.5,0.3,2.2l-4,22.7
				c-0.3,1.5,0.7,2.9,2.2,3.2l0.7,0.1c1.5,0.2,2.9-0.7,3.2-2.2l4-22.7c0.5-0.5,0.9-1.2,1-2C324.9,443.5,323.5,441.5,321.5,441.2z
				 M320.8,447.2c-1.3,0-2.4-1.1-2.4-2.4c0-0.6,0.2-1.1,0.6-1.5c0.4-0.5,1-0.8,1.8-0.8c1.3,0,2.4,1.1,2.4,2.4
				S322.2,447.2,320.8,447.2z"/>
			<path class="st9" d="M338.5,444.2c-0.2,0-0.4,0-0.6,0c-1.8,0-3.4,1.3-3.7,3.1c-0.1,0.8,0,1.5,0.3,2.2l-4.6,26
				c-0.3,1.5,0.7,2.9,2.2,3.1l0.7,0.1c1.5,0.3,2.9-0.7,3.1-2.2l4.6-26c0.5-0.5,0.9-1.2,1-2C341.9,446.5,340.5,444.5,338.5,444.2z
				 M337.8,450.3c-1.3,0-2.4-1.1-2.4-2.4s1.1-2.4,2.4-2.4s2.4,1.1,2.4,2.4C340.2,449.2,339.1,450.3,337.8,450.3z"/>
		</g>
		<g id="Steckleiste">
			<g id="Aussen">
				<g id="VMplus">
					<path class="st9" d="M382.9,394.6v8.6h8.6v-8.6H382.9z M390.1,401.8h-5.9V396h5.9V401.8z"/>
					<rect x="379.1" y="391.4" class="st13" width="15" height="15"/>
				</g>
				<g id="GND3">
					<path class="st9" d="M382.9,377.4v8.6h8.6v-8.6H382.9z M390.1,384.6h-5.9v-5.9h5.9V384.6z"/>
					<rect x="379.1" y="374.2" class="st13" width="15" height="15"/>
				</g>
				<g id="M0minus">
					<path class="st9" d="M365.6,394.6v8.6h8.6v-8.6H365.6z M372.9,401.8H367V396h5.9V401.8z"/>
					<rect x="361.9" y="391.4" class="st13" width="15" height="15"/>
				</g>
				<g id="M1minus">
					<path class="st9" d="M365.6,377.4v8.6h8.6v-8.6H365.6z M372.9,384.6H367v-5.9h5.9V384.6z"/>
					<rect x="361.9" y="374.2" class="st13" width="15" height="15"/>
				</g>
				<g id="M0plus">
					<path class="st9" d="M348.4,394.6v8.6h8.6v-8.6H348.4z M355.7,401.8h-5.9V396h5.9V401.8z"/>
					<rect x="345.1" y="391.4" class="st13" width="15" height="15"/>
				</g>
				<g id="M1plus">
					<path class="st9" d="M348.4,377.4v8.6h8.6v-8.6H348.4z M355.7,384.6h-5.9v-5.9h5.9V384.6z"/>
					<rect x="345.1" y="374.2" class="st13" width="15" height="15"/>
				</g>
				<g id="C_P20">
					<path class="st9" d="M331.2,394.6v8.6h8.6v-8.6H331.2z M338.4,401.8h-5.9V396h5.9V401.8z"/>
					<rect x="327.9" y="391.4" class="st13" width="15" height="15"/>
				</g>
				<g id="GND2">
					<path class="st9" d="M331.2,377.4v8.6h8.6v-8.6H331.2z M338.4,384.6h-5.9v-5.9h5.9V384.6z"/>
					<rect x="327.9" y="374.2" class="st13" width="15" height="15"/>
				</g>
				<g id="C_P19">
					<path class="st9" d="M314,377.4v8.6h8.6v-8.6H314z M321.2,384.6h-5.9v-5.9h5.9V384.6z"/>
					<rect x="310.9" y="374.2" class="st13" width="15" height="15"/>
				</g>
				<g id="C_P18">
					<path class="st9" d="M314,394.6v8.6h8.6v-8.6H314z M321.2,401.8h-5.9V396h5.9V401.8z"/>
					<rect x="310.9" y="391.4" class="st13" width="15" height="15"/>
				</g>
				<g id="C_P17">
					<path class="st9" d="M296.8,377.4v8.6h8.6v-8.6H296.8z M304,384.6h-5.9v-5.9h5.9V384.6z"/>
					<rect x="293.7" y="374.2" class="st13" width="15" height="15"/>
				</g>
				<g id="C_P16">
					<path class="st9" d="M296.8,394.6v8.6h8.6v-8.6H296.8z M304,401.8h-5.9V396h5.9V401.8z"/>
					<rect x="293.7" y="391.4" class="st13" width="15" height="15"/>
				</g>
				<g id="C_P15">
					<path class="st9" d="M279.6,377.4v8.6h8.6v-8.6H279.6z M286.8,384.6H281v-5.9h5.9v5.9H286.8z"/>
					<rect x="276.2" y="374.2" class="st13" width="15" height="15"/>
				</g>
				<g id="C_P14">
					<path class="st9" d="M279.6,394.6v8.6h8.6v-8.6H279.6z M286.8,401.8H281V396h5.9v5.8H286.8z"/>
					<rect x="276.2" y="391.4" class="st13" width="15" height="15"/>
				</g>
				<g id="C_P13">
					<path class="st9" d="M262.4,377.4v8.6h8.6v-8.6H262.4z M269.6,384.6h-5.9v-5.9h5.9V384.6z"/>
					<rect x="259" y="374.2" class="st13" width="15" height="15"/>
				</g>
				<g id="C_P12">
					<path class="st9" d="M262.4,394.6v8.6h8.6v-8.6H262.4z M269.6,401.8h-5.9V396h5.9V401.8z"/>
					<rect x="259" y="391.4" class="st13" width="15" height="15"/>
				</g>
				<g id="C_P11">
					<path class="st9" d="M245.2,377.4v8.6h8.6v-8.6H245.2z M252.4,384.6h-5.9v-5.9h5.9V384.6z"/>
					<rect x="241.9" y="374.2" class="st13" width="15" height="15"/>
				</g>
				<g id="C_P10">
					<path class="st9" d="M245.2,394.6v8.6h8.6v-8.6H245.2z M252.4,401.8h-5.9V396h5.9V401.8z"/>
					<rect x="241.9" y="391.4" class="st13" width="15" height="15"/>
				</g>
				<g id="C_P9">
					<path class="st9" d="M228,377.4v8.6h8.6v-8.6H228z M235.2,384.6h-5.9v-5.9h5.9V384.6z"/>
					<rect x="224.8" y="374.2" class="st13" width="15" height="15"/>
				</g>
				<g id="C_P8">
					<path class="st9" d="M228,394.6v8.6h8.6v-8.6H228z M235.2,401.8h-5.9V396h5.9V401.8z"/>
					<rect x="224.8" y="391.4" class="st13" width="15" height="15"/>
				</g>
				<g id="C_P7">
					<path class="st9" d="M210.8,377.4v8.6h8.6v-8.6H210.8z M218,384.6h-5.9v-5.9h5.9V384.6z"/>
					<rect x="207.6" y="374.2" class="st13" width="15" height="15"/>
				</g>
				<g id="C_P6">
					<path class="st9" d="M210.8,394.6v8.6h8.6v-8.6H210.8z M218,401.8h-5.9V396h5.9V401.8z"/>
					<rect x="207.6" y="391.4" class="st13" width="15" height="15"/>
				</g>
				<g id="C_P5">
					<path class="st9" d="M193.5,377.4v8.6h8.6v-8.6H193.5z M200.8,384.6h-5.9v-5.9h5.9V384.6z"/>
					<rect x="190.1" y="374.2" class="st13" width="15" height="15"/>
				</g>
				<g id="C_P4">
					<path class="st9" d="M193.5,394.6v8.6h8.6v-8.6H193.5z M200.8,401.8h-5.9V396h5.9V401.8z"/>
					<rect x="190.1" y="391.4" class="st13" width="15" height="15"/>
				</g>
				<g id="C_P3">
					<path class="st9" d="M176.3,377.4v8.6h8.6v-8.6H176.3z M183.6,384.6h-5.9v-5.9h5.9V384.6z"/>
					<rect x="172.9" y="374.2" class="st13" width="15" height="15"/>
				</g>
				<g id="C_P2">
					<path class="st9" d="M176.3,394.6v8.6h8.6v-8.6H176.3z M183.6,401.8h-5.9V396h5.9V401.8z"/>
					<rect x="172.9" y="391.4" class="st13" width="15" height="15"/>
				</g>
				<g id="C_P1">
					<path class="st9" d="M159.1,377.4v8.6h8.6v-8.6H159.1z M166.3,384.6h-5.9v-5.9h5.9V384.6z"/>
					<rect x="155.8" y="374.2" class="st13" width="15" height="15"/>
				</g>
				<g id="C_P0">
					<path class="st9" d="M159.1,394.6v8.6h8.6v-8.6H159.1z M166.3,401.8h-5.9V396h5.9V401.8z"/>
					<rect x="155.8" y="391.4" class="st13" width="15" height="15"/>
				</g>
				<g id="VCC">
					<path class="st9" d="M141.9,377.4v8.6h8.6v-8.6H141.9z M149.1,384.6h-5.9v-5.9h5.9V384.6z"/>
					<rect x="138.7" y="374.2" class="st13" width="15" height="15"/>
				</g>
				<g id="GND1">
					<path class="st9" d="M141.9,394.6v8.6h8.6v-8.6H141.9z M149.1,401.8h-5.9V396h5.9V401.8z"/>
					<rect x="138.7" y="391.4" class="st13" width="15" height="15"/>
				</g>
			</g>
			<path class="st11" d="M136.3,374.7v31.2c0,0.7,0.6,1.4,1.4,1.4h258.1c0.7,0,1.4-0.6,1.4-1.4v-31.2c0-0.7-0.6-1.4-1.4-1.4H137.6
				C136.9,373.4,136.3,374,136.3,374.7z M270.9,377.4v8.6h-8.6v-8.6H270.9z M150.5,403.2h-8.6v-8.6h8.6V403.2z M150.5,386h-8.6v-8.6
				h8.6V386z M167.7,403.2h-8.6v-8.6h8.6V403.2z M167.7,386h-8.6v-8.6h8.6V386z M184.9,403.2h-8.6v-8.6h8.6V403.2z M184.9,386h-8.6
				v-8.6h8.6V386z M202.1,403.2h-8.6v-8.6h8.6V403.2z M202.1,386h-8.6v-8.6h8.6V386z M219.3,403.2h-8.6v-8.6h8.6V403.2z M219.3,386
				h-8.6v-8.6h8.6V386z M236.5,403.2H228v-8.6h8.6v8.6H236.5z M236.5,386H228v-8.6h8.6v8.6H236.5z M253.7,403.2h-8.6v-8.6h8.6V403.2
				z M253.7,386h-8.6v-8.6h8.6V386z M270.9,403.2h-8.6v-8.6h8.6V403.2z M288.2,403.2h-8.6v-8.6h8.6V403.2z M288.2,386h-8.6v-8.6h8.6
				V386z M305.4,403.2h-8.6v-8.6h8.6V403.2z M305.4,386h-8.6v-8.6h8.6V386z M322.6,403.2H314v-8.6h8.6V403.2z M322.6,386H314v-8.6
				h8.6V386z M339.8,403.2h-8.6v-8.6h8.6V403.2z M339.8,386h-8.6v-8.6h8.6V386z M357,403.2h-8.6v-8.6h8.6V403.2z M357,386h-8.6v-8.6
				h8.6V386z M374.2,403.2h-8.6v-8.6h8.6V403.2z M374.2,386h-8.6v-8.6h8.6V386z M391.4,403.2h-8.6v-8.6h8.6V403.2z M391.4,386h-8.6
				v-8.6h8.6V386z"/>
		</g>
	</g>
</g>`;
        const pinNames = [
            "TOUCH_P0", "TOUCH_P1", "TOUCH_P2", "TOUCH_P3", "TOUCH_LOGO", "TOUCH_GND", "TOUCH_VCC",
            "BTN_A", "BTN_B",
            "GND1", "GND2", "GND3", "VCC",
            "C_P0", "C_P2", "C_P4", "C_P6", "C_P8", "C_P10", "C_P12", "C_P14", "C_P16", "C_P18", "C_P20",
            "C_P1", "C_P3", "C_P5", "C_P7", "C_P9", "C_P11", "C_P13", "C_P15", "C_P17", "C_P19",
            "M0minus", "M1minus", "M0plus", "M1plus", "VMplus",
            "G_A0_GND", "G_A0_VCC", "G_A0_SDA", "G_A0_SCL",
            "G_A1_RX", "G_A1_TX", "G_A1_VCC", "G_A1_GND"
        ];
        const pinTitles_v3 = [
            "P0", "P1", "P2", "P3", "Logo", "GND", "+3v3",
            "Button A", "Button B",
            "GND", "GND", "GND", "+3v3",
            "P0", "P2", "C4", "C6", "C8", "C10", "C12", "C14", "C16 (A1 RX)", "C18", "C20 (A0 SDA)",
            "P1", "P3", "C5", "C7", "C9", "C11", "C13", "C15", "C17 (A1 TX)", "C19 (A0 SCL)",
            "Motor 0 -", "Motor 1 -", "MOTOR 0 +", "MOTOR 1 +", "MOTOR VM+",
            "GND", "+3v3", "C20 (A0 SDA)", "C19 (A0 SCL)",
            "C16 (A1 RX)", "C17 (A1 TX)", "+3v3", "GND"
        ];
        const pinTitles_v2 = [
            "P0", "P1", "P2", "P3", "Logo", "GND", "+3v3",
            "Button A", "Button B",
            "GND", "GND", "GND", "+3v3",
            "P0", "P2", "C4", "C6", "C8", "C10", "C12", "C14", "C16 (A1 RX)", "C18 (A0 SDA)", "",
            "P1", "P3", "C5", "C7", "C9", "C11", "C13", "C15", "C17 (A1 TX)", "C19 (A0 SCL)",
            "", "", "MOTOR 0 +", "MOTOR 1 +", "MOTOR VM",
            "GND", "+3v3", "C18 (A0 SDA)", "C19 (A0 SCL)",
            "C16 (A1 RX)", "C17 (A1 TX)", "+3v3", "GND"
        ];
        let pinTitles = pinTitles_v2;
        const MB_WIDTH = 530;
        const MB_HEIGHT = 630;
        visuals.themes = ["#3ADCFE"].map(accent => {
            return {
                accent: accent,
                pin: "#F6C426",
                pinTouched: "#FFA500",
                pinActive: "#E6007D",
                ledOn: "#ff5555",
                ledOff: "#e0e1e2",
                buttonOuter: "#979797",
                buttonUps: ["#186A8C", "#D82E50"],
                buttonDown: "#FFA500",
                virtualButtonDown: "#FFA500",
                virtualButtonOuter: "#333",
                virtualButtonUp: "#fff",
                lightLevelOn: "#555",
                lightLevelOff: "yellow",
                soundLevelOn: "#3ADCFE",
                soundLevelOff: "#555"
            };
        });
        function randomTheme() {
            return visuals.themes[Math.floor(Math.random() * visuals.themes.length)];
        }
        visuals.randomTheme = randomTheme;
        class MiniBoard extends pxsim.BaseBoard {
            constructor() {
                super(...arguments);
                this.hardwareVersion = 3;
            }
        }
        class MiniRuntime extends pxsim.Runtime {
        }
        class MicrobitBoardSvg {
            constructor(props) {
                this.props = props;
                this.headInitialized = false;
                this.domHardwareVersion = 1;
                this.pinNmToCoord = {
                    "EXT_PWR": [
                        92.30997467041016,
                        -42.92474937438965
                    ],
                    "SPKR": [
                        106.44635391235352,
                        -16.370698928833008
                    ],
                    "BTN_A": [
                        93.8138427734375,
                        56.631452560424805
                    ],
                    "BTN_B": [
                        204.92835235595703,
                        56.631452560424805
                    ],
                    // rings
                    "TOUCH_P0": [
                        56.002254486083984,
                        95.43130111694336
                    ],
                    "TOUCH_P1": [
                        103.00893783569336,
                        175.82388305664062
                    ],
                    "TOUCH_P2": [
                        195.90512084960938,
                        175.3082733154297
                    ],
                    "TOUCH_P3": [
                        241.79466247558594,
                        95.3883285522461
                    ],
                    "TOUCH_GND": [
                        103.00893783569336,
                        14.86682915687561
                    ],
                    "TOUCH_VCC": [
                        195.64733123779297,
                        14.86682915687561
                    ],
                    "C_GND1": [
                        113.1493148803711,
                        159.83989715576172
                    ],
                    "C_GND2": [
                        150.27342987060547,
                        159.83989715576172
                    ],
                    "C_GND3": [
                        150.27342987060547,
                        153.5666275024414
                    ],
                    "C_GND4": [
                        187.39752960205078,
                        153.5666275024414
                    ],
                    "C_VCC1": [
                        187.39752960205078,
                        159.83989715576172
                    ],
                    "C_VCC2": [
                        113.1922836303711,
                        153.5666275024414
                    ],
                    "C_P0": [
                        119.33667373657227,
                        159.83989715576172
                    ],
                    "C_P2": [
                        125.52401733398438,
                        159.83989715576172
                    ],
                    "C_P4": [
                        131.71136474609375,
                        159.83989715576172
                    ],
                    "C_P6": [
                        137.89871978759766,
                        159.83989715576172
                    ],
                    "C_P8": [
                        144.08607482910156,
                        159.83989715576172
                    ],
                    "C_P10": [
                        156.46077728271484,
                        159.83989715576172
                    ],
                    "C_P12": [
                        162.64812469482422,
                        159.83989715576172
                    ],
                    "C_P14": [
                        168.83545684814453,
                        159.83989715576172
                    ],
                    "C_P16": [
                        175.02281951904297,
                        159.83989715576172
                    ],
                    "C_P20": [
                        181.2101821899414,
                        159.83989715576172
                    ],
                    "C_P1": [
                        119.379638671875,
                        153.5666275024414
                    ],
                    "C_P3": [
                        125.56698226928711,
                        153.5666275024414
                    ],
                    "C_P5": [
                        131.71136474609375,
                        153.5666275024414
                    ],
                    "C_P7": [
                        137.89871978759766,
                        153.5666275024414
                    ],
                    "C_P9": [
                        144.08607482910156,
                        153.5666275024414
                    ],
                    "C_P11": [
                        156.46077728271484,
                        153.5666275024414
                    ],
                    "C_P13": [
                        162.64812469482422,
                        153.5666275024414
                    ],
                    "C_P15": [
                        168.83545684814453,
                        153.5666275024414
                    ],
                    "C_P21": [
                        175.02281951904297,
                        153.5666275024414
                    ],
                    "C_P19": [
                        181.2101821899414,
                        153.5666275024414
                    ],
                    "M0_GND": [
                        137.89871978759766,
                        141.70752716064453
                    ],
                    "M1_GND": [
                        156.46077728271484,
                        141.70752716064453
                    ],
                    "M_GND": [
                        168.83547210693360,
                        141.70752716064453
                    ],
                    "M0_OUT": [
                        144.08607482910156,
                        141.70752716064453
                    ],
                    "M1_OUT": [
                        150.27342987060547,
                        141.70752716064453
                    ],
                    "M_VM": [
                        162.64812469482422,
                        141.70752716064453
                    ],
                    "G_A0_GND": [
                        82.47036743164062,
                        72.35763549804688
                    ],
                    "G_A0_VCC": [
                        78.34546279907227,
                        76.3106689453125
                    ],
                    "G_A0_SDA": [
                        74.65023803710938,
                        80.00588989257812
                    ],
                    "G_A0_SCL": [
                        70.43940734863281,
                        84.21672821044922
                    ],
                    "G_A1_RX": [
                        216.52963256835938,
                        71.4982795715332
                    ],
                    "G_A1_TX": [
                        220.65453338623047,
                        75.53724670410156
                    ],
                    "G_A1_VCC": [
                        224.34976959228516,
                        79.23247528076172
                    ],
                    "G_A1_GND": [
                        228.56060028076172,
                        83.44330978393555
                    ]
                };
                this.lastFlashTime = 0;
                this.lastAntennaFlash = 0;
                this.buildDom();
                if (props && props.wireframe)
                    pxsim.U.addClass(this.element, "sim-wireframe");
                if (props && props.theme)
                    this.updateTheme();
                if (props && props.runtime) {
                    this.board = this.props.runtime.board;
                    this.board.updateSubscribers.push(() => this.updateState());
                    this.updateState();
                    this.attachEvents();
                }
            }
            getView() {
                return {
                    el: this.element,
                    y: 0,
                    x: 0,
                    w: MB_WIDTH,
                    h: MB_HEIGHT
                };
            }
            getCoord(pinNm) {
                return this.pinNmToCoord[pinNm];
            }
            highlightPin(pinNm) {
                //TODO: for instructions
            }
            getPinDist() {
                return 10;
            }
            recordPinCoords() {
                pinNames.forEach((nm, i) => {
                    const p = this.pins[i];
                    const r = p.getBoundingClientRect();
                    this.pinNmToCoord[nm] = [r.left + r.width / 2, r.top + r.height / 2];
                });
            }
            updateTheme() {
                let theme = this.props.theme;
                pxsim.svg.fills(this.leds, theme.ledOn);
                pxsim.svg.fills(this.ledsOuter, theme.ledOff);
                pxsim.svg.fills(this.buttonsOuter.slice(6, 8), theme.buttonOuter);
                pxsim.svg.fill(this.buttons[0], theme.buttonUps[0]);
                pxsim.svg.fill(this.buttons[1], theme.buttonUps[1]);
                pxsim.svg.fill(this.buttonsOuter[2], theme.virtualButtonOuter);
                pxsim.svg.fill(this.buttons[2], theme.virtualButtonUp);
                if (this.shakeButton)
                    pxsim.svg.fill(this.shakeButton, theme.virtualButtonUp);
                this.pinGradients.forEach(lg => pxsim.svg.setGradientColors(lg, theme.pin, theme.pinActive));
                pxsim.svg.setGradientColors(this.lightLevelGradient, theme.lightLevelOn, theme.lightLevelOff);
                pxsim.svg.setGradientColors(this.soundLevelGradient, theme.soundLevelOff, theme.soundLevelOn);
                pxsim.svg.setGradientColors(this.thermometerGradient, theme.ledOff, theme.ledOn);
            }
            updateState() {
                let state = this.board;
                if (!state)
                    return;
                let theme = this.props.theme;
                this.updateMicrophone();
                this.updateRecordingActive();
                this.updateButtonPairs();
                this.updateLEDMatrix();
                this.updatePins();
                this.updateTilt();
                this.updateHeading();
                this.updateLightLevel();
                this.updateTemperature();
                this.updateButtonAB();
                this.updateGestures();
                this.updateRgbLed();
                this.updateSpeaker();
                this.updateRSSI();
                if (!pxsim.runtime || pxsim.runtime.dead)
                    pxsim.U.addClass(this.element, "grayscale");
                else
                    pxsim.U.removeClass(this.element, "grayscale");
            }
            updateButtonPairs() {
                const state = this.board;
                const theme = this.props.theme;
                const bpState = state.buttonPairState;
                const buttons = [bpState.aBtn, bpState.bBtn, bpState.abBtn];
                buttons.forEach((btn, index) => {
                    pxsim.svg.fill(this.buttons[index], btn.pressed ? (btn.virtual ? theme.virtualButtonDown : theme.buttonDown) : (btn.virtual ? theme.virtualButtonUp : theme.buttonUps[index]));
                });
            }
            updateLEDMatrix() {
                const state = this.board;
                if (state.ledMatrixState.disabled) {
                    this.leds.forEach((led, i) => {
                        const sel = led;
                        sel.style.opacity = "0";
                    });
                }
                else {
                    const bw = state.ledMatrixState.displayMode == pxsim.DisplayMode.bw;
                    const img = state.ledMatrixState.image;
                    const br = state.ledMatrixState.brigthness != undefined ? state.ledMatrixState.brigthness : 255;
                    this.leds.forEach((led, i) => {
                        const sel = led;
                        let imgbr = bw ? (img.data[i] > 0 ? br : 0) : img.data[i];
                        // correct brightness
                        const opacity = imgbr > 0 ? imgbr / 255 * 155 + 100 : 0;
                        const transfrom = imgbr > 0 ? imgbr / 255 * 0.4 + 0.6 : 0;
                        sel.style.opacity = (opacity / 255) + "";
                        if (transfrom > 0) {
                            sel.style.transformBox = 'fill-box';
                            sel.style.transformOrigin = '50% 50%';
                            sel.style.transform = `scale(${transfrom})`;
                        }
                    });
                }
            }
            updateRgbLed() {
                function updateRgbLedVisual(c, el) {
                    const b = c & 0xFF;
                    const g = (c >> 8) & 0xFF;
                    const r = (c >> 16) & 0xFF;
                    const w = (c >> 24) & 0xFF;
                    const ch = `rgba(${r}, ${g}, ${b}, 1)`;
                    pxsim.svg.fill(el, ch);
                }
                let state = this.board;
                if (state.rgbLedState) {
                    if (!this.rgbLed)
                        this.rgbLed = this.element.getElementById("rgbledcircle");
                    updateRgbLedVisual(state.rgbLedState, this.rgbLed);
                }
                else if (this.rgbLed) {
                    pxsim.svg.fill(this.rgbLed, 'white');
                }
                if (this.domHardwareVersion == 3) {
                    if (state.rgbLedLeftState) {
                        if (!this.rgbLedLeft)
                            this.rgbLedLeft = this.element.getElementById("rgbledleftcircle");
                        updateRgbLedVisual(state.rgbLedLeftState, this.rgbLedLeft);
                    }
                    else if (this.rgbLedLeft) {
                        pxsim.svg.fill(this.rgbLedLeft, 'white');
                    }
                    if (state.rgbLedRightState) {
                        if (!this.rgbLedRight)
                            this.rgbLedRight = this.element.getElementById("rgbledrightcircle");
                        updateRgbLedVisual(state.rgbLedRightState, this.rgbLedRight);
                    }
                    else if (this.rgbLedRight) {
                        pxsim.svg.fill(this.rgbLedRight, 'white');
                    }
                }
            }
            updateSpeaker() {
                let state = this.board;
                if (state.speakerState.frequency) {
                }
                else {
                }
            }
            updateGestures() {
                let state = this.board;
                if (state.accelerometerState.useShake && !this.shakeButton) {
                    let shake = this.mkBtn(240, MB_HEIGHT - 75, 'Schütteln');
                    this.shakeButton = shake.inner;
                    let board = this.element.getElementById("calliope_mini");
                    // console.log(board)
                    // svg.fill(this.shakeButton, this.props.theme.virtualButtonUp)
                    pxsim.svg.buttonEvents(shake.outer, ev => { }, (ev) => {
                        // svg.fill(this.shakeButton, this.props.theme.virtualButtonDown);
                        board.classList.remove("shake_animation");
                        setTimeout(() => {
                            board.classList.add("shake_animation");
                        }, 1);
                        this.board.bus.queue(13 /* MICROBIT_ID_GESTURE */, 11); // GESTURE_SHAKE
                    }, (ev) => {
                        // svg.fill(this.shakeButton, this.props.theme.virtualButtonUp);
                    });
                    // let shakeText = svg.child(shake.outer, "text", { x: 280, y: MB_HEIGHT - 5, class: "sim-text big inverted centered" }) as SVGTextElement;
                    // shakeText.textContent = "SHAKE"
                }
            }
            updateMicrophone() {
                const b = pxsim.board();
                if (!b || !b.microphoneState.sensorUsed)
                    return;
                this.updateSoundLevel();
            }
            updateRecordingActive() {
                const b = pxsim.board();
                if (!b)
                    return;
                let theme = this.props.theme;
                if (this.microphoneLed) {
                    if (b.recordingState.currentlyRecording || b.microphoneState.soundLevelRequested) {
                        pxsim.svg.fills([this.microphoneLed], theme.ledOn);
                        pxsim.svg.filter(this.microphoneLed, `url(#ledglow)`);
                    }
                    else if (!(b.microphoneState.onSoundRegistered || b.microphoneState.soundLevelRequested)) {
                        pxsim.svg.fills([this.microphoneLed], theme.ledOff);
                        pxsim.svg.filter(this.microphoneLed, `url(#none)`);
                    }
                }
            }
            updateButtonAB() {
                let state = this.board;
                if (state.buttonPairState.usesButtonAB && this.buttons[2].style.visibility != "visible") {
                    this.buttonsOuter[2].style.visibility = "visible";
                    this.buttons[2].style.visibility = "visible";
                    this.updateTheme();
                }
            }
            updateRSSI() {
                let state = this.board;
                if (!state)
                    return;
                const v = state.radioState.datagram.rssi;
                if (v === undefined)
                    return;
                if (!this.rssi) {
                    let ax = 380;
                    let dax = 18;
                    let ayt = 10;
                    let ayb = 40;
                    const wh = dax * 5;
                    for (let i = 0; i < 4; ++i)
                        pxsim.svg.child(this.g, "rect", { x: ax - 90 + i * 6, y: ayt + 28 - i * 4, width: 4, height: 2 + i * 4, fill: "#fff" });
                    this.rssi = pxsim.svg.child(this.g, "text", { x: ax - 64, y: ayb, class: "sim-text" });
                    this.rssi.textContent = "";
                }
                const vt = v.toString();
                if (vt !== this.rssi.textContent) {
                    this.rssi.textContent = v.toString();
                    this.antenna.setAttribute("aria-valuenow", this.rssi.textContent);
                    pxsim.accessibility.setLiveContent(this.rssi.textContent);
                }
            }
            updatePin(pin, index) {
                if (!pin)
                    return;
                let text = this.pinTexts[pin.id];
                let v = "";
                if (pin.mode & pxsim.PinFlags.Analog) {
                    v = Math.floor(100 - (pin.value || 0) / 1023 * 100) + "%";
                    if (text)
                        text.textContent = (pin.period ? "~" : "") + (pin.value || 0) + "";
                }
                else if (pin.mode & pxsim.PinFlags.Digital) {
                    v = pin.value > 0 ? "0%" : "100%";
                    if (text)
                        text.textContent = pin.value > 0 ? "1" : "0";
                }
                else if (pin.mode & pxsim.PinFlags.Touch) {
                    v = pin.touched ? "0%" : "100%";
                    if (text)
                        text.textContent = v;
                }
                else {
                    v = "100%";
                    if (text)
                        text.textContent = "";
                }
                if (v)
                    pxsim.svg.setGradientValue(this.pinGradients[index], v);
                if (pin.mode !== pxsim.PinFlags.Unused) {
                    pxsim.accessibility.makeFocusable(this.pins[index]);
                    pxsim.accessibility.setAria(this.pins[index], "slider", this.pins[index].firstChild.textContent);
                    this.pins[index].setAttribute("aria-valuemin", "0");
                    this.pins[index].setAttribute("aria-valuemax", pin.mode & pxsim.PinFlags.Analog ? "1023" : "100");
                    this.pins[index].setAttribute("aria-orientation", "vertical");
                    this.pins[index].setAttribute("aria-valuenow", text ? text.textContent : v);
                    pxsim.accessibility.setLiveContent(text ? text.textContent : v);
                }
            }
            updateTemperature() {
                let state = this.board;
                if (!state || !state.thermometerState.usesTemperature)
                    return;
                let tmin = -5;
                let tmax = 50;
                if (!this.thermometer) {
                    let gid = "gradient-thermometer";
                    this.thermometerGradient = pxsim.svg.linearGradient(this.defs, gid);
                    const ty = MB_HEIGHT - 270;
                    this.thermometer = pxsim.svg.child(this.g, "rect", {
                        class: "sim-thermometer",
                        x: 0,
                        y: ty,
                        width: 30,
                        height: 160,
                        rx: 5,
                        ry: 5,
                        fill: `url(#${gid})`
                    });
                    this.thermometerText = pxsim.svg.child(this.g, "text", {
                        class: 'sim-text big inverted centered',
                        x: 15,
                        y: ty + 190
                    });
                    this.updateTheme();
                    let pt = this.element.createSVGPoint();
                    pxsim.svg.buttonEvents(this.thermometer, 
                    // move
                    (ev) => {
                        let cur = pxsim.svg.cursorPoint(pt, this.element, ev);
                        let t = Math.max(0, Math.min(1, (cur.y - ty) / 160));
                        state.thermometerState.temperature = Math.floor(tmax - t * (tmax - tmin));
                        this.updateTemperature();
                    }, 
                    // start
                    ev => { }, 
                    // stop
                    ev => { }, 
                    // keydown
                    (ev) => {
                        let charCode = (typeof ev.which == "number") ? ev.which : ev.keyCode;
                        if (charCode === 40 || charCode === 37) { // Down/Left arrow
                            state.thermometerState.temperature--;
                            if (state.thermometerState.temperature < tmin)
                                state.thermometerState.temperature = tmin;
                            this.updateTemperature();
                        }
                        else if (charCode === 38 || charCode === 39) { // Up/Right arrow
                            state.thermometerState.temperature++;
                            if (state.thermometerState.temperature > tmax)
                                state.thermometerState.temperature = tmax;
                            this.updateTemperature();
                        }
                    });
                }
                pxsim.accessibility.makeFocusable(this.thermometer);
                pxsim.accessibility.setAria(this.thermometer, "slider", pxsim.localization.lf("Temperature Level"));
                this.thermometer.setAttribute("aria-valuemin", tmin + "");
                this.thermometer.setAttribute("aria-valuemax", tmax + "");
                this.thermometer.setAttribute("aria-orientation", "vertical");
                this.thermometer.setAttribute("aria-valuenow", state.thermometerState.temperature + "");
                this.thermometer.setAttribute("aria-valuetext", state.thermometerState.temperature + "");
                let t = Math.max(tmin, Math.min(tmax, state.thermometerState.temperature));
                let per = Math.floor((state.thermometerState.temperature - tmin) / (tmax - tmin) * 100);
                pxsim.svg.setGradientValue(this.thermometerGradient, 100 - per + "%");
                this.thermometerText.textContent = t + "°C";
                this.thermometer.setAttribute("aria-valuenow", t.toString());
                this.thermometer.setAttribute("aria-valuetext", t + "°C");
                pxsim.accessibility.setLiveContent(t + "°C");
            }
            updateSoundLevel() {
                let state = this.board;
                if (!state || !state.microphoneState.sensorUsed)
                    return;
                const tmin = 0; // state.microphoneState.min;
                const tmax = 255; //state.microphoneState.max;
                if (!this.soundLevel) {
                    const level = state.microphoneState.getLevel();
                    let gid = "gradient-soundlevel";
                    this.soundLevelGradient = pxsim.svg.linearGradient(this.defs, gid);
                    const ty = MB_HEIGHT - 270;
                    this.soundLevel = pxsim.svg.child(this.g, "rect", {
                        class: "sim-thermometer",
                        x: 490,
                        y: ty,
                        width: 30,
                        height: 160,
                        rx: 5,
                        ry: 5,
                        fill: `url(#${gid})`
                    });
                    this.soundLevelText = pxsim.svg.child(this.g, "text", {
                        class: 'sim-text big inverted centered',
                        x: 505,
                        y: ty + 190
                    });
                    this.soundLevelIcon = pxsim.svg.child(this.g, "svg", {
                        x: 495,
                        y: 425,
                        viewbox: "0 0 20 29",
                        role: "img",
                    });
                    this.soundLevelIcon.setAttribute("aria-hidden", "true");
                    this.soundLevelIcon.setAttribute("focusable", "false");
                    this.soundLevelIcon.setAttribute("style", "pointer-events: none; opacity: 0.8; width: 20px;");
                    pxsim.svg.child(this.soundLevelIcon, "path", {
                        fill: "white",
                        d: "M 10 19.9375 C 13.011719 19.9375 15.453125 17.503906 15.453125 14.5 L 15.453125 5.4375 C 15.453125 2.433594 13.011719 0 10 0 C 6.988281 0 4.546875 2.433594 4.546875 5.4375 L 4.546875 14.5 C 4.546875 17.503906 6.988281 19.9375 10 19.9375 Z M 19.089844 10.875 L 18.183594 10.875 C 17.679688 10.875 17.273438 11.28125 17.273438 11.78125 L 17.273438 14.5 C 17.273438 18.738281 13.609375 22.136719 9.273438 21.714844 C 5.496094 21.347656 2.726562 17.960938 2.726562 14.175781 L 2.726562 11.78125 C 2.726562 11.28125 2.320312 10.875 1.816406 10.875 L 0.910156 10.875 C 0.40625 10.875 0 11.28125 0 11.78125 L 0 14.054688 C 0 19.132812 3.632812 23.660156 8.636719 24.347656 L 8.636719 26.28125 L 5.453125 26.28125 C 4.953125 26.28125 4.546875 26.6875 4.546875 27.1875 L 4.546875 28.09375 C 4.546875 28.59375 4.953125 29 5.453125 29 L 14.546875 29 C 15.046875 29 15.453125 28.59375 15.453125 28.09375 L 15.453125 27.1875 C 15.453125 26.6875 15.046875 26.28125 14.546875 26.28125 L 11.363281 26.28125 L 11.363281 24.367188 C 16.234375 23.703125 20 19.535156 20 14.5 L 20 11.78125 C 20 11.28125 19.59375 10.875 19.089844 10.875 Z M 19.089844 10.875 "
                    });
                    if (this.props.runtime)
                        this.props.runtime.environmentGlobals[pxsim.localization.lf("sound level")] = state.microphoneState.getLevel();
                    this.updateTheme();
                    let pt = this.element.createSVGPoint();
                    pxsim.svg.buttonEvents(this.soundLevel, 
                    // move
                    (ev) => {
                        let cur = pxsim.svg.cursorPoint(pt, this.element, ev);
                        let t = Math.max(0, Math.min(1, (cur.y - ty) / 160)) * tmax;
                        console.log(tmax - t);
                        state.microphoneState.setLevel(Math.floor(tmax - t));
                        // state.microphoneState.setLevel(Math.floor(tmin + t * (tmax - tmin)));
                        this.updateMicrophone();
                    }, 
                    // start
                    ev => { }, 
                    // stop
                    ev => { }, 
                    // keydown
                    (ev) => {
                        let charCode = (typeof ev.which == "number") ? ev.which : ev.keyCode;
                        if (charCode === 40 || charCode === 37) { // Down/Left arrow
                            state.microphoneState.setLevel(state.microphoneState.getLevel() - 1);
                            if (state.microphoneState.getLevel() < tmin)
                                state.microphoneState.setLevel(tmin);
                            this.updateMicrophone();
                        }
                        else if (charCode === 38 || charCode === 39) { // Up/Right arrow
                            state.microphoneState.setLevel(state.microphoneState.getLevel() + 1);
                            if (state.microphoneState.getLevel() > tmax)
                                state.microphoneState.setLevel(tmax);
                            this.updateMicrophone();
                        }
                    });
                    pxsim.accessibility.makeFocusable(this.soundLevel);
                    pxsim.accessibility.setAria(this.soundLevel, "slider", pxsim.localization.lf("Sound Level"));
                    this.soundLevel.setAttribute("aria-valuemin", tmin + "");
                    this.soundLevel.setAttribute("aria-valuemax", tmax + "");
                    this.soundLevel.setAttribute("aria-orientation", "vertical");
                    this.soundLevel.setAttribute("aria-valuenow", level + "");
                    this.soundLevel.setAttribute("aria-valuetext", level + "");
                }
                let t = Math.max(tmin, Math.min(tmax, state.microphoneState.getLevel()));
                let per = Math.floor((state.microphoneState.getLevel() - tmin) / (tmax - tmin) * 100);
                pxsim.svg.setGradientValue(this.soundLevelGradient, (100 - per) + "%");
                this.soundLevelText.textContent = t + "";
                this.soundLevel.setAttribute("aria-valuenow", t.toString());
                this.soundLevel.setAttribute("aria-valuetext", t + "");
                pxsim.accessibility.setLiveContent(t + "");
            }
            updateHeading() {
                const valMin = 0;
                const valMax = 360;
                let xc = 501.2;
                let yc = 75;
                let state = this.board;
                if (!state || !state.compassState.usesHeading)
                    return;
                // /*
                if (!this.headInitialized) {
                    let p = this.heads[1];
                    pxsim.svg.child(p, "circle", { style: "fill:#DDDDDD55;stroke:#3A3A3A;", cx: "501.2", cy: "75", r: "55" });
                    pxsim.svg.child(p, "polyline", { style: "fill:#008EEF;stroke:#3A3A3A;", points: "517.7,75 501.1,140.2 484.6,75" });
                    pxsim.svg.child(p, "polyline", { style: "fill:#FF3951;stroke:#3A3A3A;", points: "484.6,75 501.1,9.5 517.7,75" });
                    pxsim.svg.child(p, "circle", { style: "fill:#748476;stroke:#3A3A3A;", cx: "501.1", cy: "75", r: "16.5" });
                    pxsim.svg.child(p, "circle", { style: "fill:#CCDBCE;", cx: "501.1", cy: "75", r: "10" });
                    // p.setAttribute("d", "m269.9,50.134647l0,0l-39.5,0l0,0c-14.1,0.1 -24.6,10.7 -24.6,24.8c0,13.9 10.4,24.4 24.3,24.7l0,0l39.6,0c14.2,0 40.36034,-22.97069 40.36034,-24.85394c0,-1.88326 -26.06034,-24.54606 -40.16034,-24.64606m-0.2,39l0,0l-39.3,0c-7.7,-0.1 -14,-6.4 -14,-14.2c0,-7.8 6.4,-14.2 14.2,-14.2l39.1,0c7.8,0 14.2,6.4 14.2,14.2c0,7.9 -6.4,14.2 -14.2,14.2l0,0l0,0z");
                    this.updateTheme();
                    let pt = this.element.createSVGPoint();
                    pxsim.svg.buttonEvents(this.head, 
                    // move
                    (ev) => {
                        let cur = pxsim.svg.cursorPoint(pt, this.element, ev);
                        state.compassState.heading = valMax - (Math.floor(Math.atan2(cur.y - yc, cur.x - xc) * 180 / Math.PI) + 90) - valMax;
                        if (state.compassState.heading < valMin)
                            state.compassState.heading += valMax;
                        this.updateHeading();
                    }, 
                    // start
                    ev => { }, 
                    // stop
                    ev => { }, 
                    // keydown
                    ev => {
                        let charCode = (typeof ev.which == "number") ? ev.which : ev.keyCode;
                        if (charCode === 40 || charCode === 37) { // Down/Left arrow
                            state.compassState.heading--;
                            if (state.compassState.heading < valMin)
                                state.compassState.heading += valMax;
                            this.updateHeading();
                        }
                        else if (charCode === 38 || charCode === 39) { // Up/Right arrow
                            state.compassState.heading++;
                            if (state.compassState.heading >= valMax)
                                state.compassState.heading -= valMax;
                            ;
                            this.updateHeading();
                        }
                    });
                    this.headInitialized = true;
                }
                pxsim.accessibility.makeFocusable(this.head);
                pxsim.accessibility.setAria(this.head, "slider", pxsim.localization.lf("Heading"));
                this.head.setAttribute("aria-valuemin", valMin + "");
                this.head.setAttribute("aria-valuemax", valMax + "");
                this.head.setAttribute("aria-orientation", "vertical");
                this.head.setAttribute("aria-valuenow", state.compassState.heading + "");
                this.head.setAttribute("aria-valuetext", state.compassState.heading + "");
                let txt = state.compassState.heading.toString() + "°";
                if (txt != this.headText.textContent) {
                    pxsim.svg.rotateElement(this.head, xc, yc, valMax - state.compassState.heading - 90);
                    this.headText.textContent = txt;
                }
            }
            flashSystemLed() {
                if (!this.systemLed)
                    this.systemLed = pxsim.svg.child(this.g, "circle", { class: "sim-systemled", cx: 160.8, cy: 150.9, r: 4 });
                let now = Date.now();
                if (now - this.lastFlashTime > 150) {
                    this.lastFlashTime = now;
                    pxsim.svg.animate(this.systemLed, "sim-flash");
                }
            }
            flashAntenna() {
                if (!this.antenna) {
                    let ax = 480;
                    let dax = 18;
                    let ayt = 10;
                    let ayb = 40;
                    this.antenna = pxsim.svg.child(this.g, "polyline", { class: "sim-antenna", points: `${ax},${ayb} ${ax},${ayt} ${ax += dax},${ayt} ${ax},${ayb} ${ax += dax},${ayb} ${ax},${ayt} ${ax += dax},${ayt} ${ax},${ayb} ${ax += dax},${ayb} ${ax},${ayt} ${ax += dax},${ayt}` });
                }
                let now = Date.now();
                if (now - this.lastAntennaFlash > 200) {
                    this.lastAntennaFlash = now;
                    pxsim.svg.animate(this.antenna, 'sim-flash-stroke');
                }
            }
            updatePins() {
                let state = this.board;
                if (!state)
                    return;
                state.edgeConnectorState.pins.forEach((pin, i) => this.updatePin(pin, i));
            }
            updateLightLevel() {
                let state = this.board;
                const valMin = 0;
                const valMax = 255;
                if (!state || !state.lightSensorState.usesLightLevel)
                    return;
                if (!this.lightLevelButton) {
                    let gid = "gradient-light-level";
                    this.lightLevelGradient = pxsim.svg.linearGradient(this.defs, gid);
                    const cx = 25;
                    const cy = 75;
                    const r = 55;
                    this.lightLevelButton = pxsim.svg.child(this.g, "circle", {
                        cx: `${cx}px`, cy: `${cy}px`, r: `${r}px`,
                        class: 'sim-light-level-button',
                        fill: `url(#${gid})`
                    });
                    let pt = this.element.createSVGPoint();
                    pxsim.svg.buttonEvents(this.lightLevelButton, 
                    // move
                    (ev) => {
                        let pos = pxsim.svg.cursorPoint(pt, this.element, ev);
                        let rs = r / 2;
                        let level = valMax - Math.max(valMin, Math.min(valMax, Math.floor((pos.y - (cy - r)) / (2 * r) * valMax)));
                        if (level != state.lightSensorState.lightLevel) {
                            state.lightSensorState.lightLevel = level;
                            this.applyLightLevel();
                        }
                    }, 
                    // start
                    ev => { }, 
                    // stop
                    ev => { }, 
                    // keydown
                    ev => {
                        let charCode = (typeof ev.which == "number") ? ev.which : ev.keyCode;
                        if (charCode === 40 || charCode === 37) { // Down/Left arrow
                            state.lightSensorState.lightLevel--;
                            if (state.lightSensorState.lightLevel < valMin)
                                state.lightSensorState.lightLevel = valMin;
                            this.applyLightLevel();
                        }
                        else if (charCode === 38 || charCode === 39) { // Up/Right arrow
                            state.lightSensorState.lightLevel++;
                            if (state.lightSensorState.lightLevel > valMax)
                                state.lightSensorState.lightLevel = valMax;
                            this.applyLightLevel();
                        }
                    });
                    this.lightLevelText = pxsim.svg.child(this.g, "text", { x: cx, y: cy + r + 35, text: '', class: 'sim-text inverted big centered' });
                    this.updateTheme();
                }
                pxsim.accessibility.makeFocusable(this.lightLevelButton);
                pxsim.accessibility.setAria(this.lightLevelButton, "slider", pxsim.localization.lf("Light Level"));
                this.lightLevelButton.setAttribute("aria-valuemin", valMin + "");
                this.lightLevelButton.setAttribute("aria-valuemax", valMax + "");
                this.lightLevelButton.setAttribute("aria-orientation", "vertical");
                this.lightLevelButton.setAttribute("aria-valuenow", state.lightSensorState.lightLevel + "");
                this.lightLevelButton.setAttribute("aria-valuetext", state.lightSensorState.lightLevel + "");
                pxsim.svg.setGradientValue(this.lightLevelGradient, Math.min(100, Math.max(0, Math.floor((255 - state.lightSensorState.lightLevel) * 100 / 255))) + '%');
                this.lightLevelText.textContent = state.lightSensorState.lightLevel.toString();
            }
            applyLightLevel() {
                let lv = this.board.lightSensorState.lightLevel;
                pxsim.svg.setGradientValue(this.lightLevelGradient, Math.min(100, Math.max(0, Math.floor((255 - lv) * 100 / 255))) + '%');
                this.lightLevelText.textContent = lv.toString();
            }
            updateTilt() {
                return;
                if (this.props.disableTilt)
                    return;
                let state = this.board;
                if (!state || !state.accelerometerState.accelerometer.isActive)
                    return;
                const x = state.accelerometerState.accelerometer.getX();
                const y = -state.accelerometerState.accelerometer.getY();
                const af = 8 / 1023;
                const s = 1 - Math.min(0.1, Math.pow(Math.max(Math.abs(x), Math.abs(y)) / 1023, 2) / 35);
                this.element.style.transform = `perspective(30em) rotateX(${y * af}deg) rotateY(${x * af}deg) scale(${s}, ${s})`;
                this.element.style.perspectiveOrigin = "50% 50% 50%";
                this.element.style.perspective = "30em";
            }
            buildDom() {
                let SVG_CODE = BOARD_SVG_HEAD + BOARD_MINI2_BODY + BOARD_SVG_BOTTOM;
                pinTitles = pinTitles_v2;
                if (this.props.runtime.board && this.props.runtime.board.hasOwnProperty("hardwareVersion") && this.props.runtime.board.hardwareVersion == 3) {
                    this.domHardwareVersion = 3;
                    SVG_CODE = BOARD_SVG_HEAD + BOARD_MINI3_BODY + BOARD_SVG_BOTTOM;
                    pinTitles = pinTitles_v3;
                }
                this.element = new DOMParser().parseFromString(SVG_CODE, "image/svg+xml").querySelector("svg");
                pxsim.svg.hydrate(this.element, {
                    "version": "1.0",
                    "viewBox": `0 0 ${MB_WIDTH} ${MB_HEIGHT}`,
                    "class": "sim",
                    "x": "0px",
                    "y": "0px",
                    "width": MB_WIDTH + "px",
                    "height": MB_HEIGHT + "px",
                    "fill": "rgba(0,0,0,0)"
                });
                this.style = pxsim.svg.child(this.element, "style", {});
                this.style.textContent = MB_STYLE;
                this.defs = pxsim.svg.child(this.element, "defs", {});
                this.g = pxsim.svg.elt("g");
                this.element.appendChild(this.g);
                // filters
                let ledglow = pxsim.svg.child(this.defs, "filter", { id: "ledglow", x: "-75%", y: "-75%", width: "300%", height: "300%" });
                pxsim.svg.child(ledglow, "feMorphology", { operator: "dilate", radius: "1", in: "SourceAlpha", result: "thicken" });
                pxsim.svg.child(ledglow, "feGaussianBlur", { stdDeviation: "5", in: "thicken", result: "blurred" });
                pxsim.svg.child(ledglow, "feFlood", { "flood-color": "rgb(255, 17, 77)", result: "glowColor" });
                pxsim.svg.child(ledglow, "feComposite", { in: "glowColor", in2: "blurred", operator: "in", result: "ledglow_colored" });
                let ledglowMerge = pxsim.svg.child(ledglow, "feMerge", {});
                pxsim.svg.child(ledglowMerge, "feMergeNode", { in: "ledglow_colored" });
                pxsim.svg.child(ledglowMerge, "feMergeNode", { in: "SourceGraphic" });
                let glow = pxsim.svg.child(this.defs, "filter", { id: "filterglow", x: "-5%", y: "-5%", width: "120%", height: "120%" });
                pxsim.svg.child(glow, "feGaussianBlur", { stdDeviation: "5", result: "glow" });
                let merge = pxsim.svg.child(glow, "feMerge", {});
                for (let i = 0; i < 3; ++i)
                    pxsim.svg.child(merge, "feMergeNode", { in: "glow" });
                // leds
                this.leds = [];
                this.ledsOuter = [];
                const left = Number(this.element.getElementById("LED_0_0").getAttribute("x"));
                const top = Number(this.element.getElementById("LED_0_0").getAttribute("y"));
                const ledoffw = Number(this.element.getElementById("LED_1_0").getAttribute("x")) - left;
                const ledoffh = Number(this.element.getElementById("LED_0_1").getAttribute("y")) - top;
                // const ledw = 5.1;
                // const ledh = 12.9;
                for (let i = 0; i < 5; ++i) {
                    let ledtop = i * ledoffh + top;
                    for (let j = 0; j < 5; ++j) {
                        let ledleft = j * ledoffw + left;
                        let k = i * 5 + j;
                        this.ledsOuter.push(pxsim.svg.child(this.g, "rect", { class: "sim-led-back", x: ledleft, y: ledtop, width: 10, height: 20, rx: 2, ry: 2 }));
                        let led = pxsim.svg.child(this.g, "rect", { class: "sim-led", x: ledleft - 2, y: ledtop - 2, width: 14, height: 24, rx: 3, ry: 3, title: `(${j},${i})` });
                        pxsim.svg.filter(led, `url(#ledglow)`);
                        this.leds.push(led);
                    }
                }
                // head
                //  this.headg = <SVGGElement>svg.child(this.g, "g", { style: "transform: translate(100px, 0px);" });
                this.head = pxsim.svg.child(this.g, "g", { class: "sim-head" });
                pxsim.svg.child(this.head, "circle", { cx: 501.2, cy: 75, r: 100, fill: "transparent" });
                this.headParts = pxsim.svg.child(this.head, "g", { class: "sim-button-outer sim-button-group" });
                this.heads = [];
                //  background
                this.heads.push(pxsim.svg.path(this.headParts, "sim-button", ""));
                //  shapes
                this.heads.push(pxsim.svg.child(this.headParts, "g", { class: "sim-theme" }));
                //  this.heads.push(svg.path(this.headParts, "sim-theme", "M230.6,69.7c-2.9,0-5.3,2.4-5.3,5.3c0,2.9,2.4,5.3,5.3,5.3c2.9,0,5.3-2.4,5.3-5.3C235.9,72.1,233.5,69.7,230.6,69.7"));
                //  this.heads.push(svg.path(this.headParts, "sim-theme", "M269.7,80.3c2.9,0,5.3-2.4,5.3-5.3c0-2.9-2.4-5.3-5.3-5.3c-2.9,0-5.3,2.4-5.3,5.3C264.4,77.9,266.8,80.3,269.7,80.3"));
                this.headText = pxsim.svg.child(this.g, "text", { x: 500, y: 165, class: "sim-text inverted big centered" });
                // https://www.microbit.co.uk/device/pins
                // P0, P1, P2
                this.pins = pinNames.map(n => {
                    let p = this.element.getElementById(n);
                    if (!p)
                        console.log("missing " + n);
                    pxsim.U.addClass(p, "sim-pin");
                    // console.log(p);
                    return p;
                });
                this.pins.forEach((p, i) => pxsim.svg.hydrate(p, { title: pinTitles[i] }));
                this.pinGradients = this.pins.map((pin, i) => {
                    let gid = "gradient-pin-" + i;
                    let lg = pxsim.svg.linearGradient(this.defs, gid);
                    pin.setAttribute("fill", `url(#${gid})`);
                    return lg;
                });
                // this.pinTexts = [
                //         [-20,   340],
                //         [50,    495],
                //         [450,   495],
                //         [500,   340]
                //     ].map(p => <SVGTextElement>svg.child(this.g, "text", { class: "sim-text-pin", x: p[0], y: p[1] }));
                this.pinTexts = {
                    [100 /* P0 */]: pxsim.svg.child(this.g, "text", { class: "sim-text-pin big centered", x: 20, y: 325 }),
                    [101 /* P1 */]: pxsim.svg.child(this.g, "text", { class: "sim-text-pin big centered", x: 135, y: 540 }),
                    [102 /* P2 */]: pxsim.svg.child(this.g, "text", { class: "sim-text-pin big centered", x: 395, y: 540 }),
                    [103 /* P3 */]: pxsim.svg.child(this.g, "text", { class: "sim-text-pin big centered", x: 540, y: 325 })
                };
                // BTN A, B
                const btnids = ["BTN_A", "BTN_B"];
                this.buttonsOuter = btnids.map(n => this.element.getElementById(n + "_BOX"));
                this.buttonsOuter.forEach(b => pxsim.U.addClass(b, "sim-button-outer"));
                this.buttons = btnids.map(n => this.element.getElementById(n));
                this.buttons.forEach(b => pxsim.U.addClass(b, "sim-button"));
                // BTN A+B
                const outerBtn = (left, top) => {
                    const button = this.mkBtn(left, top, 'A + B');
                    this.buttonsOuter.push(button.outer);
                    this.buttons.push(button.inner);
                    return button;
                };
                let ab = outerBtn(100, MB_HEIGHT - 75);
                // let abtext = svg.child(ab.outer, "text", { x: 210, y: MB_HEIGHT - 5, class: "sim-text big inverted centered" }) as SVGTextElement;
                // abtext.textContent = "A+B";
                this.buttonsOuter[2].style.visibility = "hidden";
                this.buttons[2].style.visibility = "hidden";
            }
            mkBtn(left, top, text) {
                const btnr = 2;
                const btnw = 20;
                const btnn = 1.6;
                const btnnm = 2;
                const btnb = 5;
                let btng = pxsim.svg.child(this.g, "g", { class: "sim-button-group" });
                // var fo = document.createElementNS("http://www.w3.org/2000/svg", "foreignObject");
                var fo = pxsim.svg.child(btng, "foreignObject");
                fo.setAttribute("id", "y");
                fo.setAttribute("x", left + '');
                fo.setAttribute("y", top + '');
                fo.setAttribute("width", "300");
                fo.setAttribute("height", "100");
                fo.innerHTML = `<body xmlns="http://www.w3.org/1999/xhtml">
             <button class="simEventBtn">${text}</button>
          </body>`;
                // var ta = document.createElement("button");
                // ta.innerText = text;
                // fo.appendChild(ta);
                // svg.child(btng, "rect", { class: "sim-button-outer", x: left, y: top, rx: btnr, ry: btnr, width: btnw, height: btnw });
                // svg.child(btng, "circle", { class: "sim-button-nut", cx: left + btnnm, cy: top + btnnm, r: btnn });
                // svg.child(btng, "circle", { class: "sim-button-nut", cx: left + btnnm, cy: top + btnw - btnnm, r: btnn });
                // svg.child(btng, "circle", { class: "sim-button-nut", cx: left + btnw - btnnm, cy: top + btnw - btnnm, r: btnn });
                // svg.child(btng, "circle", { class: "sim-button-nut", cx: left + btnw - btnnm, cy: top + btnnm, r: btnn });
                const outer = btng;
                const inner = pxsim.svg.child(btng, "circle", {
                    class: "sim-button",
                    cx: left + btnw / 2,
                    cy: top + btnw / 2,
                    r: 0
                });
                return { outer, inner };
            }
            attachEvents() {
                this.attachIFrameEvents();
                this.attachAccelerometerEvents();
                this.attachPinsIOEvents();
                this.attachPinsTouchEvents();
                this.attachABEvents();
                this.attachAPlusBEvents();
            }
            attachIFrameEvents() {
                pxsim.Runtime.messagePosted = (msg) => {
                    switch (msg.type || "") {
                        case "serial":
                            this.flashSystemLed();
                            break;
                        case "radiopacket":
                            this.flashAntenna();
                            break;
                        case "eventbus":
                            if (msg.id == 2000 /* MES_BROADCAST_GENERAL_ID */)
                                this.flashAntenna();
                            break;
                    }
                };
            }
            attachAccelerometerEvents() {
                let tiltDecayer = undefined;
                this.element.addEventListener(pxsim.pointerEvents.move, (ev) => {
                    const state = this.board;
                    if (!state.accelerometerState.accelerometer.isActive)
                        return;
                    if (tiltDecayer) {
                        clearInterval(tiltDecayer);
                        tiltDecayer = 0;
                    }
                    const bbox = this.element.getBoundingClientRect();
                    // ev.clientX and ev.clientY are not defined on mobile iOS
                    const xPos = ev.clientX != null ? ev.clientX : ev.pageX;
                    const yPos = ev.clientY != null ? ev.clientY : ev.pageY;
                    const ax = (xPos - bbox.width / 2) / (bbox.width / 3);
                    const ay = (yPos - bbox.height / 2) / (bbox.height / 3);
                    const x = -Math.max(-1023, Math.min(1023, Math.floor(ax * 1023)));
                    const y = -Math.max(-1023, Math.min(1023, Math.floor(ay * 1023)));
                    const z2 = 1023 * 1023 - x * x - y * y;
                    const z = Math.floor((z2 > 0 ? -1 : 1) * Math.sqrt(Math.abs(z2)));
                    state.accelerometerState.accelerometer.update(x, y, z);
                    this.updateTilt();
                }, false);
                this.element.addEventListener(pxsim.pointerEvents.leave, (ev) => {
                    let state = this.board;
                    if (!state.accelerometerState.accelerometer.isActive)
                        return;
                    if (!tiltDecayer) {
                        tiltDecayer = setInterval(() => {
                            let accx = state.accelerometerState.accelerometer.getX(pxsim.MicroBitCoordinateSystem.RAW);
                            accx = Math.floor(Math.abs(accx) * 0.85) * (accx > 0 ? 1 : -1);
                            let accy = state.accelerometerState.accelerometer.getY(pxsim.MicroBitCoordinateSystem.RAW);
                            accy = Math.floor(Math.abs(accy) * 0.85) * (accy > 0 ? 1 : -1);
                            let accz = -Math.sqrt(Math.max(0, 1023 * 1023 - accx * accx - accy * accy));
                            if (Math.abs(accx) <= 24 && Math.abs(accy) <= 24) {
                                clearInterval(tiltDecayer);
                                tiltDecayer = 0;
                                accx = 0;
                                accy = 0;
                                accz = -1023;
                            }
                            state.accelerometerState.accelerometer.update(accx, accy, accz);
                            this.updateTilt();
                        }, 50);
                    }
                }, false);
            }
            attachPinsIOEvents() {
                this.pins.slice(0, 4).forEach((pin, index) => {
                    // var index = i + 2;
                    if (!this.board.edgeConnectorState.pins[index])
                        return;
                    let pt = this.element.createSVGPoint();
                    let xpos = (index === 0 || index === 3) ? 300 : 520;
                    let vMax = (index === 0 || index === 3) ? 1 : 1023;
                    pxsim.svg.buttonEvents(pin, 
                    // move
                    ev => {
                        let state = this.board;
                        let pin = state.edgeConnectorState.pins[index];
                        let svgpin = this.pins[index];
                        if (pin.mode & pxsim.PinFlags.Input) {
                            let cursor = pxsim.svg.cursorPoint(pt, this.element, ev);
                            let v = (xpos - cursor.y) / 70 * (vMax + 1);
                            pin.value = Math.max(0, Math.min(vMax, Math.floor(v)));
                        }
                        this.updatePin(pin, index);
                    }, 
                    // start
                    ev => {
                        let state = this.board;
                        let pin = state.edgeConnectorState.pins[index];
                        let svgpin = this.pins[index];
                        pxsim.U.addClass(svgpin, "touched");
                        if (pin.mode & pxsim.PinFlags.Input) {
                            let cursor = pxsim.svg.cursorPoint(pt, this.element, ev);
                            let v = (xpos - cursor.y) / 70 * (vMax + 1);
                            pin.value = Math.max(0, Math.min(vMax, Math.floor(v)));
                        }
                        this.updatePin(pin, index);
                    }, 
                    // stop
                    (ev) => {
                        let state = this.board;
                        let pin = state.edgeConnectorState.pins[index];
                        let svgpin = this.pins[index];
                        pxsim.U.removeClass(svgpin, "touched");
                        this.updatePin(pin, index);
                        return false;
                    }, 
                    // keydown
                    (ev) => {
                        let charCode = (typeof ev.which == "number") ? ev.which : ev.keyCode;
                        let state = this.board;
                        let pin = state.edgeConnectorState.pins[index];
                        if (charCode === 40 || charCode === 37) { // Down/Left arrow
                            pin.value -= 10;
                            if (pin.value < 0) {
                                pin.value = 1023;
                            }
                            this.updatePin(pin, index);
                        }
                        else if (charCode === 38 || charCode === 39) { // Up/Right arrow
                            pin.value += 10;
                            if (pin.value > 1023) {
                                pin.value = 0;
                            }
                            this.updatePin(pin, index);
                        }
                    });
                });
            }
            attachPinsTouchEvents() {
                this.pins.slice(0, 5).forEach((btn, i) => {
                    var index = i;
                    let state = this.board;
                    let pressedTime;
                    pxsim.pointerEvents.down.forEach(evid => btn.addEventListener(evid, ev => {
                        let state = this.board;
                        // console.log(`down ${state.edgeConnectorState.pins[i].id}`)
                        state.edgeConnectorState.pins[i].touched = true;
                        this.updatePin(state.edgeConnectorState.pins[i], index);
                        this.board.bus.queue(state.edgeConnectorState.pins[i].id, 1 /* MICROBIT_BUTTON_EVT_DOWN */);
                        pressedTime = pxsim.runtime.runningTime();
                    }));
                    // btn.addEventListener(pointerEvents.leave, ev => {
                    //     let state = this.board;
                    //     state.edgeConnectorState.pins[i].touched = false;
                    //     this.updatePin(state.edgeConnectorState.pins[i], index);
                    // })
                    btn.addEventListener(pxsim.pointerEvents.up, ev => {
                        let state = this.board;
                        // console.log(`up ${state.edgeConnectorState.pins[i].id}, index ${index}`)
                        state.edgeConnectorState.pins[i].touched = false;
                        this.updatePin(state.edgeConnectorState.pins[i], index);
                        this.board.bus.queue(state.edgeConnectorState.pins[i].id, 2 /* MICROBIT_BUTTON_EVT_UP */);
                        const currentTime = pxsim.runtime.runningTime();
                        if (currentTime - pressedTime > 1000 /* DEVICE_BUTTON_LONG_CLICK_TIME */) {
                            this.board.bus.queue(state.edgeConnectorState.pins[i].id, 4 /* MICROBIT_BUTTON_EVT_LONG_CLICK */);
                            // console.log(`& long click`)
                        }
                        else {
                            this.board.bus.queue(state.edgeConnectorState.pins[i].id, 3 /* MICROBIT_BUTTON_EVT_CLICK */);
                            // console.log(`& click`)
                        }
                        pressedTime = undefined;
                    });
                    pxsim.accessibility.enableKeyboardInteraction(btn, undefined, () => {
                        let state = this.board;
                        this.board.bus.queue(state.edgeConnectorState.pins[i].id, 1 /* MICROBIT_BUTTON_EVT_DOWN */);
                        this.board.bus.queue(state.edgeConnectorState.pins[i].id, 2 /* MICROBIT_BUTTON_EVT_UP */);
                        this.board.bus.queue(state.edgeConnectorState.pins[i].id, 3 /* MICROBIT_BUTTON_EVT_CLICK */);
                    });
                });
            }
            attachABEvents() {
                const bpState = this.board.buttonPairState;
                const stateButtons = [bpState.aBtn, bpState.bBtn];
                const elButtonOuters = this.buttonsOuter.slice(0, 2);
                const elButtons = this.buttons.slice(0, 2);
                elButtonOuters.forEach((btn, index) => {
                    let pressedTime;
                    pxsim.pointerEvents.down.forEach(evid => btn.addEventListener(evid, ev => {
                        // console.log(`down ${stateButtons[index].id}`)
                        stateButtons[index].pressed = true;
                        pxsim.svg.fill(elButtons[index], this.props.theme.buttonDown);
                        this.board.bus.queue(stateButtons[index].id, 1 /* MICROBIT_BUTTON_EVT_DOWN */);
                        pressedTime = pxsim.runtime.runningTime();
                    }));
                    btn.addEventListener(pxsim.pointerEvents.leave, ev => {
                        stateButtons[index].pressed = false;
                        pxsim.svg.fill(elButtons[index], this.props.theme.buttonUps[index]);
                    });
                    btn.addEventListener(pxsim.pointerEvents.up, ev => {
                        stateButtons[index].pressed = false;
                        pxsim.svg.fill(elButtons[index], this.props.theme.buttonUps[index]);
                        this.board.bus.queue(stateButtons[index].id, 2 /* MICROBIT_BUTTON_EVT_UP */);
                        const currentTime = pxsim.runtime.runningTime();
                        if (currentTime - pressedTime > 1000 /* DEVICE_BUTTON_LONG_CLICK_TIME */)
                            this.board.bus.queue(stateButtons[index].id, 4 /* MICROBIT_BUTTON_EVT_LONG_CLICK */);
                        else
                            this.board.bus.queue(stateButtons[index].id, 3 /* MICROBIT_BUTTON_EVT_CLICK */);
                        pressedTime = undefined;
                    });
                    pxsim.accessibility.enableKeyboardInteraction(btn, undefined, () => {
                        this.board.bus.queue(stateButtons[index].id, 1 /* MICROBIT_BUTTON_EVT_DOWN */);
                        this.board.bus.queue(stateButtons[index].id, 2 /* MICROBIT_BUTTON_EVT_UP */);
                        this.board.bus.queue(stateButtons[index].id, 3 /* MICROBIT_BUTTON_EVT_CLICK */);
                    });
                });
            }
            attachAPlusBEvents() {
                const bpState = this.board.buttonPairState;
                const stateButtons = [bpState.aBtn, bpState.bBtn];
                let pressedTime;
                // A+B
                pxsim.pointerEvents.down.forEach(evid => this.buttonsOuter[2].addEventListener(evid, ev => {
                    bpState.aBtn.pressed = true;
                    bpState.bBtn.pressed = true;
                    bpState.abBtn.pressed = true;
                    pxsim.svg.fill(this.buttons[0], this.props.theme.buttonDown);
                    pxsim.svg.fill(this.buttons[1], this.props.theme.buttonDown);
                    pxsim.svg.fill(this.buttons[2], this.props.theme.buttonDown);
                    this.board.bus.queue(stateButtons[0].id, 1 /* MICROBIT_BUTTON_EVT_DOWN */);
                    this.board.bus.queue(stateButtons[1].id, 1 /* MICROBIT_BUTTON_EVT_DOWN */);
                    this.board.bus.queue(bpState.abBtn.id, 1 /* MICROBIT_BUTTON_EVT_DOWN */);
                    pressedTime = pxsim.runtime.runningTime();
                }));
                this.buttonsOuter[2].addEventListener(pxsim.pointerEvents.leave, ev => {
                    bpState.aBtn.pressed = false;
                    bpState.bBtn.pressed = false;
                    bpState.abBtn.pressed = false;
                    pxsim.svg.fill(this.buttons[0], this.props.theme.buttonUps[0]);
                    pxsim.svg.fill(this.buttons[1], this.props.theme.buttonUps[1]);
                    pxsim.svg.fill(this.buttons[2], this.props.theme.virtualButtonUp);
                });
                this.buttonsOuter[2].addEventListener(pxsim.pointerEvents.up, ev => {
                    bpState.aBtn.pressed = false;
                    bpState.bBtn.pressed = false;
                    bpState.abBtn.pressed = false;
                    pxsim.svg.fill(this.buttons[0], this.props.theme.buttonUps[0]);
                    pxsim.svg.fill(this.buttons[1], this.props.theme.buttonUps[1]);
                    pxsim.svg.fill(this.buttons[2], this.props.theme.virtualButtonUp);
                    this.board.bus.queue(stateButtons[0].id, 2 /* MICROBIT_BUTTON_EVT_UP */);
                    this.board.bus.queue(stateButtons[1].id, 2 /* MICROBIT_BUTTON_EVT_UP */);
                    this.board.bus.queue(bpState.abBtn.id, 2 /* MICROBIT_BUTTON_EVT_UP */);
                    const currentTime = pxsim.runtime.runningTime();
                    if (currentTime - pressedTime > 1000 /* DEVICE_BUTTON_LONG_CLICK_TIME */)
                        this.board.bus.queue(bpState.abBtn.id, 4 /* MICROBIT_BUTTON_EVT_LONG_CLICK */);
                    else
                        this.board.bus.queue(bpState.abBtn.id, 3 /* MICROBIT_BUTTON_EVT_CLICK */);
                    pressedTime = undefined;
                });
                pxsim.accessibility.enableKeyboardInteraction(this.buttonsOuter[2], undefined, () => {
                    this.board.bus.queue(bpState.abBtn.id, 1 /* MICROBIT_BUTTON_EVT_DOWN */);
                    this.board.bus.queue(bpState.abBtn.id, 2 /* MICROBIT_BUTTON_EVT_UP */);
                    this.board.bus.queue(bpState.abBtn.id, 3 /* MICROBIT_BUTTON_EVT_CLICK */);
                });
            }
        }
        visuals.MicrobitBoardSvg = MicrobitBoardSvg;
    })(visuals = pxsim.visuals || (pxsim.visuals = {}));
})(pxsim || (pxsim = {}));
var pxsim;
(function (pxsim) {
    const icon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><!-- Font Awesome Pro 5.15.4 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) --><path d="M215.03 71.05L126.06 160H24c-13.26 0-24 10.74-24 24v144c0 13.25 10.74 24 24 24h102.06l88.97 88.95c15.03 15.03 40.97 4.47 40.97-16.97V88.02c0-21.46-25.96-31.98-40.97-16.97zM461.64 256l45.64-45.64c6.3-6.3 6.3-16.52 0-22.82l-22.82-22.82c-6.3-6.3-16.52-6.3-22.82 0L416 210.36l-45.64-45.64c-6.3-6.3-16.52-6.3-22.82 0l-22.82 22.82c-6.3 6.3-6.3 16.52 0 22.82L370.36 256l-45.63 45.63c-6.3 6.3-6.3 16.52 0 22.82l22.82 22.82c6.3 6.3 16.52 6.3 22.82 0L416 301.64l45.64 45.64c6.3 6.3 16.52 6.3 22.82 0l22.82-22.82c6.3-6.3 6.3-16.52 0-22.82L461.64 256z"/></svg>`;
    // We only need to unmute from within the iframe once
    let hasUnmuted = false;
    function createMuteButton() {
        const el = document.createElement("div");
        el.setAttribute("id", "safari-mute-button-outer");
        el.innerHTML = `
            <button class="safari-mute-button">
                ${icon}
            </button>
        `;
        const button = el.firstElementChild;
        button.setAttribute("title", pxsim.localization.lf("Unmute simulator"));
        button.addEventListener("click", () => {
            pxsim.AudioContextManager.mute(false);
            pxsim.setParentMuteState("unmuted");
            button.remove();
            hasUnmuted = true;
        });
        return el;
    }
    pxsim.createMuteButton = createMuteButton;
    function shouldShowMute() {
        return isSafari() && !hasUnmuted;
    }
    pxsim.shouldShowMute = shouldShowMute;
    // Everything below is taken from browserutils in pxt
    function hasNavigator() {
        return typeof navigator !== "undefined";
    }
    pxsim.hasNavigator = hasNavigator;
    //Microsoft Edge lies about its user agent and claims to be Chrome, but Microsoft Edge/Version
    //is always at the end
    function isEdge() {
        return hasNavigator() && /Edge/i.test(navigator.userAgent);
    }
    pxsim.isEdge = isEdge;
    //IE11 also lies about its user agent, but has Trident appear somewhere in
    //the user agent. Detecting the different between IE11 and Microsoft Edge isn't
    //super-important because the UI is similar enough
    function isIE() {
        return hasNavigator() && /Trident/i.test(navigator.userAgent);
    }
    pxsim.isIE = isIE;
    //Microsoft Edge and IE11 lie about being Chrome. Chromium-based Edge ("Edgeium") will be detected as Chrome, that is ok. If you're looking for Edgeium, use `isChromiumEdge()`.
    function isChrome() {
        return !isEdge() && !isIE() && !!navigator && (/Chrome/i.test(navigator.userAgent) || /Chromium/i.test(navigator.userAgent));
    }
    pxsim.isChrome = isChrome;
    //Chrome and Microsoft Edge lie about being Safari
    function isSafari() {
        //Could also check isMac but I don't want to risk excluding iOS
        //Checking for iPhone, iPod or iPad as well as Safari in order to detect home screen browsers on iOS
        return !isChrome() && !isEdge() && !!navigator && /(Macintosh|Safari|iPod|iPhone|iPad)/i.test(navigator.userAgent);
    }
    pxsim.isSafari = isSafari;
})(pxsim || (pxsim = {}));
var pxsim;
(function (pxsim) {
    var pxtcore;
    (function (pxtcore) {
        // TODO: add in support for mode, as in CODAL
        function registerWithDal(id, evid, handler, mode = 0) {
            pxsim.board().bus.listen(id, evid, handler);
        }
        pxtcore.registerWithDal = registerWithDal;
        function deepSleep() {
            // TODO?
            console.log("deep sleep requested");
        }
        pxtcore.deepSleep = deepSleep;
    })(pxtcore = pxsim.pxtcore || (pxsim.pxtcore = {}));
})(pxsim || (pxsim = {}));
(function (pxsim) {
    var BufferMethods;
    (function (BufferMethods) {
        function fnv1(data) {
            let h = 0x811c9dc5;
            for (let i = 0; i < data.length; ++i) {
                h = Math.imul(h, 0x1000193) ^ data[i];
            }
            return h;
        }
        function hash(buf, bits) {
            bits |= 0;
            if (bits < 1)
                return 0;
            const h = fnv1(buf.data);
            if (bits >= 32)
                return h >>> 0;
            else
                return ((h ^ (h >>> bits)) & ((1 << bits) - 1)) >>> 0;
        }
        BufferMethods.hash = hash;
    })(BufferMethods = pxsim.BufferMethods || (pxsim.BufferMethods = {}));
})(pxsim || (pxsim = {}));
(function (pxsim) {
    var control;
    (function (control) {
        control.runInParallel = pxsim.thread.runInBackground;
        control.delay = pxsim.thread.pause;
        function reset() {
            pxsim.Runtime.postMessage({
                type: "simulator",
                command: "restart",
                controlReset: true
            });
            const cb = pxsim.getResume();
        }
        control.reset = reset;
        function waitMicros(micros) {
            pxsim.thread.pause(micros / 1000); // it prempts not much we can do here.
        }
        control.waitMicros = waitMicros;
        function deviceName() {
            let b = pxsim.board();
            return b && b.id
                ? b.id.slice(0, 4)
                : "abcd";
        }
        control.deviceName = deviceName;
        function _ramSize() {
            return 32 * 1024 * 1024;
        }
        control._ramSize = _ramSize;
        function deviceSerialNumber() {
            let b = pxsim.board();
            if (!b)
                return 42;
            let n = 0;
            if (b.id) {
                n = parseInt(b.id.slice(1));
                if (isNaN(n)) {
                    n = 0;
                    for (let i = 0; i < b.id.length; ++i) {
                        n = ((n << 5) - n) + b.id.charCodeAt(i);
                        n |= 0;
                    }
                    n = Math.abs(n);
                }
            }
            if (!n)
                n = 42;
            return n;
        }
        control.deviceSerialNumber = deviceSerialNumber;
        function deviceLongSerialNumber() {
            let b = control.createBuffer(8);
            pxsim.BufferMethods.setNumber(b, pxsim.BufferMethods.NumberFormat.UInt32LE, 0, deviceSerialNumber());
            return b;
        }
        control.deviceLongSerialNumber = deviceLongSerialNumber;
        function deviceDalVersion() {
            return "sim";
        }
        control.deviceDalVersion = deviceDalVersion;
        function internalOnEvent(id, evid, handler) {
            pxsim.pxtcore.registerWithDal(id, evid, handler);
        }
        control.internalOnEvent = internalOnEvent;
        function waitForEvent(id, evid) {
            const cb = pxsim.getResume();
            pxsim.board().bus.wait(id, evid, cb);
        }
        control.waitForEvent = waitForEvent;
        function allocateNotifyEvent() {
            let b = pxsim.board();
            return b.bus.nextNotifyEvent++;
        }
        control.allocateNotifyEvent = allocateNotifyEvent;
        function raiseEvent(id, evid, mode) {
            // TODO mode?
            pxsim.board().bus.queue(id, evid);
        }
        control.raiseEvent = raiseEvent;
        function millis() {
            return pxsim.runtime.runningTime();
        }
        control.millis = millis;
        function micros() {
            return pxsim.runtime.runningTimeUs() & 0x3fffffff;
        }
        control.micros = micros;
        function delayMicroseconds(us) {
            control.delay(us / 0.001);
        }
        control.delayMicroseconds = delayMicroseconds;
        function createBuffer(size) {
            return pxsim.BufferMethods.createBuffer(size);
        }
        control.createBuffer = createBuffer;
        function dmesg(msg) {
            console.log(`DMESG: ${msg}`);
        }
        control.dmesg = dmesg;
        function setDebugFlags(flags) {
            console.log(`debug flags: ${flags}`);
        }
        control.setDebugFlags = setDebugFlags;
        function heapSnapshot() {
            console.log(pxsim.runtime.traceObjects());
        }
        control.heapSnapshot = heapSnapshot;
        function toStr(v) {
            if (v instanceof pxsim.RefRecord) {
                return `${v.vtable.name}@${v.id}`;
            }
            if (v instanceof pxsim.RefCollection) {
                let r = "[";
                for (let e of v.toArray()) {
                    if (r.length > 200) {
                        r += "...";
                        break;
                    }
                    r += toStr(e) + ", ";
                }
                r += "]";
                return r;
            }
            if (typeof v == "function") {
                return (v + "").slice(0, 60) + "...";
            }
            return v + "";
        }
        function dmesgPtr(msg, ptr) {
            console.log(`DMESG: ${msg} ${toStr(ptr)}`);
        }
        control.dmesgPtr = dmesgPtr;
        function dmesgValue(ptr) {
            console.log(`DMESG: ${toStr(ptr)}`);
        }
        control.dmesgValue = dmesgValue;
        function gc() { }
        control.gc = gc;
        function profilingEnabled() {
            return !!pxsim.runtime.perfCounters;
        }
        control.profilingEnabled = profilingEnabled;
        function __log(priority, str) {
            switch (priority) {
                case 0:
                    console.debug("d>" + str);
                    break;
                case 1:
                    console.log("l>" + str);
                    break;
                case 2:
                    console.warn("w>" + str);
                    break;
                case 3:
                    console.error("e>" + str);
                    break;
            }
            pxsim.runtime.board.writeSerial(str);
        }
        control.__log = __log;
        function heapDump() {
            // TODO something better
        }
        control.heapDump = heapDump;
        function isUSBInitialized() {
            return false;
        }
        control.isUSBInitialized = isUSBInitialized;
    })(control = pxsim.control || (pxsim.control = {}));
})(pxsim || (pxsim = {}));
var pxsim;
(function (pxsim) {
    var pxtcore;
    (function (pxtcore) {
        // general purpose message sending mechanism
        function sendMessage(channel, message, parentOnly) {
            if (!channel)
                return;
            pxsim.Runtime.postMessage({
                type: "messagepacket",
                broadcast: !parentOnly,
                channel: channel,
                data: message && message.data
            });
        }
        pxtcore.sendMessage = sendMessage;
        function peekMessageChannel() {
            const state = pxsim.getControlMessageState();
            const msg = state && state.peek();
            return msg && msg.channel;
        }
        pxtcore.peekMessageChannel = peekMessageChannel;
        function readMessageData() {
            const state = pxsim.getControlMessageState();
            const msg = state && state.read();
            return msg && new pxsim.RefBuffer(msg.data);
        }
        pxtcore.readMessageData = readMessageData;
    })(pxtcore = pxsim.pxtcore || (pxsim.pxtcore = {}));
})(pxsim || (pxsim = {}));
(function (pxsim) {
    // keep in sync with ts
    pxsim.CONTROL_MESSAGE_EVT_ID = 2999;
    pxsim.CONTROL_MESSAGE_RECEIVED = 1;
    class ControlMessageState {
        constructor(board) {
            this.board = board;
            this.messages = [];
            this.enabled = false;
            this.board.addMessageListener(msg => this.messageHandler(msg));
        }
        messageHandler(msg) {
            if (msg.type == "messagepacket") {
                let packet = msg;
                this.enqueue(packet);
            }
        }
        enqueue(message) {
            this.messages.push(message);
            this.board.bus.queue(pxsim.CONTROL_MESSAGE_EVT_ID, pxsim.CONTROL_MESSAGE_RECEIVED);
        }
        peek() {
            return this.messages[0];
        }
        read() {
            return this.messages.shift();
        }
    }
    pxsim.ControlMessageState = ControlMessageState;
    function getControlMessageState() {
        return pxsim.board().controlMessageState;
    }
    pxsim.getControlMessageState = getControlMessageState;
})(pxsim || (pxsim = {}));
var pxsim;
(function (pxsim) {
    let ThresholdState;
    (function (ThresholdState) {
        ThresholdState[ThresholdState["High"] = 0] = "High";
        ThresholdState[ThresholdState["Low"] = 1] = "Low";
        ThresholdState[ThresholdState["Normal"] = 2] = "Normal";
    })(ThresholdState || (ThresholdState = {}));
    class AnalogSensorState {
        constructor(id, min = 0, max = 255, lowThreshold = 64, highThreshold = 192) {
            this.id = id;
            this.min = min;
            this.max = max;
            this.lowThreshold = lowThreshold;
            this.highThreshold = highThreshold;
            this.sensorUsed = false;
            this.state = ThresholdState.Normal;
            this.level = Math.ceil((max - min) / 2);
        }
        setUsed() {
            if (!this.sensorUsed) {
                this.sensorUsed = true;
                pxsim.runtime.queueDisplayUpdate();
            }
        }
        setLevel(level) {
            this.level = this.clampValue(level);
            if (this.level >= this.highThreshold) {
                this.setState(ThresholdState.High);
            }
            else if (this.level <= this.lowThreshold) {
                this.setState(ThresholdState.Low);
            }
            else {
                this.setState(ThresholdState.Normal);
            }
        }
        getLevel() {
            return this.level;
        }
        setLowThreshold(value) {
            this.lowThreshold = this.clampValue(value);
            this.highThreshold = Math.max(this.lowThreshold + 1, this.highThreshold);
        }
        setHighThreshold(value) {
            this.highThreshold = this.clampValue(value);
            this.lowThreshold = Math.min(this.highThreshold - 1, this.lowThreshold);
        }
        clampValue(value) {
            if (value < this.min) {
                return this.min;
            }
            else if (value > this.max) {
                return this.max;
            }
            return value;
        }
        setState(state) {
            if (this.state === state) {
                return;
            }
            this.state = state;
            switch (state) {
                case ThresholdState.High:
                    pxsim.board().bus.queue(this.id, 2 /* SENSOR_THRESHOLD_HIGH */);
                    break;
                case ThresholdState.Low:
                    pxsim.board().bus.queue(this.id, 1 /* SENSOR_THRESHOLD_LOW */);
                    break;
                case ThresholdState.Normal:
                    break;
            }
        }
    }
    pxsim.AnalogSensorState = AnalogSensorState;
})(pxsim || (pxsim = {}));
var pxsim;
(function (pxsim) {
    class MicrophoneState extends pxsim.AnalogSensorState {
        constructor() {
            super(...arguments);
            this.onSoundRegistered = false;
            this.soundLevelRequested = false;
            this.pingSoundLevel = () => {
                if (this.onSoundRegistered) {
                    return;
                }
                this.soundLevelRequested = true;
                pxsim.runtime.queueDisplayUpdate();
                clearTimeout(this.pingUsed);
                this.pingUsed = setTimeout(() => {
                    this.soundLevelRequested = false;
                    pxsim.runtime.queueDisplayUpdate();
                    this.pingUsed = undefined;
                }, 100);
            };
        }
    }
    pxsim.MicrophoneState = MicrophoneState;
    function microphoneState() {
        return pxsim.board().microphoneState;
    }
    pxsim.microphoneState = microphoneState;
})(pxsim || (pxsim = {}));
var pxsim;
(function (pxsim) {
    let NeoPixelMode;
    (function (NeoPixelMode) {
        NeoPixelMode[NeoPixelMode["RGB"] = 1] = "RGB";
        NeoPixelMode[NeoPixelMode["RGBW"] = 2] = "RGBW";
        NeoPixelMode[NeoPixelMode["RGB_RGB"] = 3] = "RGB_RGB";
        NeoPixelMode[NeoPixelMode["DotStar"] = 4] = "DotStar";
    })(NeoPixelMode = pxsim.NeoPixelMode || (pxsim.NeoPixelMode = {}));
    class CommonNeoPixelState {
        constructor() {
            this.mode = NeoPixelMode.RGB; // GRB
            this.width = 1;
        }
        get length() {
            return this.buffer ? (this.buffer.length / this.stride) | 0 : 0;
        }
        get stride() {
            return this.mode == NeoPixelMode.RGBW || this.mode == NeoPixelMode.DotStar ? 4 : 3;
        }
        pixelColor(pixel) {
            const offset = pixel * this.stride;
            // RBG
            switch (this.mode) {
                case NeoPixelMode.RGBW:
                    return [this.buffer[offset + 1], this.buffer[offset], this.buffer[offset + 2], this.buffer[offset + 3]];
                case NeoPixelMode.RGB_RGB:
                    return [this.buffer[offset], this.buffer[offset + 1], this.buffer[offset + 2]];
                case NeoPixelMode.DotStar:
                    return [this.buffer[offset + 3], this.buffer[offset + 2], this.buffer[offset + 1]];
                default:
                    return [this.buffer[offset + 1], this.buffer[offset + 0], this.buffer[offset + 2]];
            }
        }
    }
    pxsim.CommonNeoPixelState = CommonNeoPixelState;
    function neopixelState(pinId) {
        return pxsim.board().neopixelState(pinId);
    }
    pxsim.neopixelState = neopixelState;
    function sendBufferAsm(buffer, pin) {
        const b = pxsim.board();
        if (!b)
            return;
        const p = b.edgeConnectorState.getPin(pin);
        if (!p)
            return;
        const lp = neopixelState(p.id);
        if (!lp)
            return;
        const mode = lp.mode;
        pxsim.light.sendBuffer(p, undefined, mode, buffer);
    }
    pxsim.sendBufferAsm = sendBufferAsm;
})(pxsim || (pxsim = {}));
(function (pxsim) {
    var light;
    (function (light) {
        // Currently only modifies the builtin pixels
        function sendBuffer(pin, clk, mode, b) {
            const state = pxsim.neopixelState(pin.id);
            if (!state)
                return;
            state.mode = mode & 0xff;
            state.buffer = b.data;
            pxsim.runtime.queueDisplayUpdate();
        }
        light.sendBuffer = sendBuffer;
    })(light = pxsim.light || (pxsim.light = {}));
})(pxsim || (pxsim = {}));
(function (pxsim) {
    var visuals;
    (function (visuals) {
        const PIXEL_SPACING = visuals.PIN_DIST * 2.5; // 3
        const PIXEL_RADIUS = visuals.PIN_DIST;
        const CANVAS_WIDTH = 1.2 * visuals.PIN_DIST;
        const CANVAS_HEIGHT = 12 * visuals.PIN_DIST;
        const CANVAS_VIEW_PADDING = visuals.PIN_DIST * 4;
        const CANVAS_LEFT = 1.4 * visuals.PIN_DIST;
        const CANVAS_TOP = visuals.PIN_DIST;
        // For the instructions parts list
        function mkNeoPixelPart(xy = [0, 0]) {
            const NP_PART_XOFF = -13.5;
            const NP_PART_YOFF = -11;
            const NP_PART_WIDTH = 87.5;
            const NP_PART_HEIGHT = 190;
            const NEOPIXEL_PART_IMG = `<svg viewBox="-5 -1 53 112" xmlns="http://www.w3.org/2000/svg" xmlns:bx="https://boxy-svg.com">
  <rect x="2.5" width="38" height="100" style="fill: rgb(68, 68, 68);"/>
  <rect x="11.748" y="3.2" width="1.391" height="2.553" style="fill: none; stroke-linejoin: round; stroke-width: 3; stroke: rgb(165, 103, 52);"/>
  <rect x="20.75" y="3.2" width="1.391" height="2.553" style="fill: none; stroke-linejoin: round; stroke-width: 3; stroke: rgb(165, 103, 52);"/>
  <rect x="29.75" y="3.2" width="1.391" height="2.553" style="fill: none; stroke-linejoin: round; stroke-width: 3; stroke: rgb(165, 103, 52);"/>
  <g>
    <rect x="9" y="16.562" width="25" height="3.238" style="fill: rgb(216, 216, 216);"/>
    <rect x="9" y="22.562" width="25" height="3.238" style="fill: rgb(216, 216, 216);"/>
    <rect x="9" y="28.563" width="25" height="3.238" style="fill: rgb(216, 216, 216);"/>
    <rect x="11.607" y="14.833" width="19.787" height="18.697" style="fill: rgb(0, 0, 0);"/>
    <ellipse style="fill: rgb(216, 216, 216);" cx="21.5" cy="24.181" rx="7" ry="7"/>
  </g>
  <path d="M -7.25 -103.2 L -2.5 -100.003 L -12 -100.003 L -7.25 -103.2 Z" style="fill: rgb(68, 68, 68);" transform="matrix(-1, 0, 0, -1, 0, 0)" bx:shape="triangle -12 -103.2 9.5 3.197 0.5 0 1@ad6f5cac"/>
  <path d="M -16.75 -103.197 L -12 -100 L -21.5 -100 L -16.75 -103.197 Z" style="fill: rgb(68, 68, 68);" transform="matrix(-1, 0, 0, -1, 0, 0)" bx:shape="triangle -21.5 -103.197 9.5 3.197 0.5 0 1@07d73149"/>
  <path d="M -26.25 -103.2 L -21.5 -100.003 L -31 -100.003 L -26.25 -103.2 Z" style="fill: rgb(68, 68, 68);" transform="matrix(-1, 0, 0, -1, 0, 0)" bx:shape="triangle -31 -103.2 9.5 3.197 0.5 0 1@54403e2d"/>
  <path d="M -35.75 -103.197 L -31 -100 L -40.5 -100 L -35.75 -103.197 Z" style="fill: rgb(68, 68, 68);" transform="matrix(-1, 0, 0, -1, 0, 0)" bx:shape="triangle -40.5 -103.197 9.5 3.197 0.5 0 1@21c9b772"/>
  <g transform="matrix(1, 0, 0, 1, 0.000002, 29.999994)">
    <rect x="9" y="16.562" width="25" height="3.238" style="fill: rgb(216, 216, 216);"/>
    <rect x="9" y="22.562" width="25" height="3.238" style="fill: rgb(216, 216, 216);"/>
    <rect x="9" y="28.563" width="25" height="3.238" style="fill: rgb(216, 216, 216);"/>
    <rect x="11.607" y="14.833" width="19.787" height="18.697" style="fill: rgb(0, 0, 0);"/>
    <ellipse style="fill: rgb(216, 216, 216);" cx="21.5" cy="24.181" rx="7" ry="7"/>
  </g>
  <g transform="matrix(1, 0, 0, 1, 0.000005, 59.999992)">
    <rect x="9" y="16.562" width="25" height="3.238" style="fill: rgb(216, 216, 216);"/>
    <rect x="9" y="22.562" width="25" height="3.238" style="fill: rgb(216, 216, 216);"/>
    <rect x="9" y="28.563" width="25" height="3.238" style="fill: rgb(216, 216, 216);"/>
    <rect x="11.607" y="14.833" width="19.787" height="18.697" style="fill: rgb(0, 0, 0);"/>
    <ellipse style="fill: rgb(216, 216, 216);" cx="21.5" cy="24.181" rx="7" ry="7"/>
  </g>
</svg>`;
            let [x, y] = xy;
            let l = x + NP_PART_XOFF;
            let t = y + NP_PART_YOFF;
            let w = NP_PART_WIDTH;
            let h = NP_PART_HEIGHT;
            let img = pxsim.svg.elt("image");
            pxsim.svg.hydrate(img, {
                class: "sim-neopixel-strip", x: l, y: t, width: w, height: h,
                href: pxsim.svg.toDataUri(NEOPIXEL_PART_IMG)
            });
            return { el: img, x: l, y: t, w: w, h: h };
        }
        visuals.mkNeoPixelPart = mkNeoPixelPart;
        class NeoPixel {
            constructor(xy = [0, 0], width = 1) {
                let el = pxsim.svg.elt("rect");
                let r = PIXEL_RADIUS;
                let [cx, cy] = xy;
                let y = cy - r;
                if (width <= 1)
                    pxsim.svg.hydrate(el, { x: "-50%", y: y, width: "100%", height: r * 2, class: "sim-neopixel" });
                else {
                    let x = cx - r;
                    pxsim.svg.hydrate(el, { x: x, y: y, width: r * 2, height: r * 2, class: "sim-neopixel" });
                }
                this.el = el;
                this.cy = cy;
            }
            setRgb(rgb) {
                let hsl = visuals.rgbToHsl(rgb);
                let [h, s, l] = hsl;
                // at least 70% luminosity
                l = Math.max(l, 60);
                let fill = `hsl(${h}, ${s}%, ${l}%)`;
                this.el.setAttribute("fill", fill);
            }
        }
        visuals.NeoPixel = NeoPixel;
        class NeoPixelCanvas {
            constructor(pin, cols = 1) {
                this.cols = cols;
                this.pixels = [];
                let el = pxsim.svg.elt("svg");
                pxsim.svg.hydrate(el, {
                    "class": `sim-neopixel-canvas`,
                    "x": "0px",
                    "y": "0px",
                    "width": `${CANVAS_WIDTH}px`,
                    "height": `${CANVAS_HEIGHT}px`,
                });
                this.canvas = el;
                this.background = pxsim.svg.child(el, "rect", { class: "sim-neopixel-background hidden" });
                this.updateViewBox(-CANVAS_WIDTH / 2, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
            }
            updateViewBox(x, y, w, h) {
                this.viewBox = [x, y, w, h];
                pxsim.svg.hydrate(this.canvas, { "viewBox": `${x} ${y} ${w} ${h}` });
                pxsim.svg.hydrate(this.background, { "x": x, "y": y, "width": w, "height": h });
            }
            update(colors) {
                if (!colors || colors.length <= 0)
                    return;
                if (this.pixels.length == 0 && this.cols > 1) {
                    // first time, so redo width of canvas
                    let rows = Math.ceil(colors.length / this.cols);
                    let rt = CANVAS_HEIGHT / rows;
                    let width = this.cols * rt;
                    this.canvas.setAttributeNS(null, "width", `${width}px`);
                    this.updateViewBox(0, 0, width, CANVAS_HEIGHT);
                }
                for (let i = 0; i < colors.length; i++) {
                    let pixel = this.pixels[i];
                    if (!pixel) {
                        let cxy = [0, CANVAS_VIEW_PADDING + i * PIXEL_SPACING];
                        if (this.cols > 1) {
                            const row = Math.floor(i / this.cols);
                            const col = i - row * this.cols;
                            cxy = [(col + 1) * PIXEL_SPACING, (row + 1) * PIXEL_SPACING];
                        }
                        pixel = this.pixels[i] = new NeoPixel(cxy, this.cols);
                        pxsim.svg.hydrate(pixel.el, { title: `offset: ${i}` });
                        this.canvas.appendChild(pixel.el);
                    }
                    pixel.setRgb(colors[i]);
                }
                //show the canvas if it's hidden
                pxsim.U.removeClass(this.background, "hidden");
                // resize
                let [first, last] = [this.pixels[0], this.pixels[this.pixels.length - 1]];
                let yDiff = last.cy - first.cy;
                let newH = yDiff + CANVAS_VIEW_PADDING * 2;
                let [oldX, oldY, oldW, oldH] = this.viewBox;
                if (newH > oldH) {
                    let scalar = newH / oldH;
                    let newW = oldW * scalar;
                    if (this.cols > 1) {
                        // different computation for matrix
                        let rows = Math.ceil(colors.length / this.cols);
                        newH = PIXEL_SPACING * (rows + 1);
                        newW = PIXEL_SPACING * (this.cols + 1);
                        this.updateViewBox(0, oldY, newW, newH);
                    }
                    else
                        this.updateViewBox(-newW / 2, oldY, newW, newH);
                }
            }
            setLoc(xy) {
                let [x, y] = xy;
                pxsim.svg.hydrate(this.canvas, { x: x, y: y });
            }
        }
        visuals.NeoPixelCanvas = NeoPixelCanvas;
        ;
        class NeoPixelView {
            constructor(parsePinString) {
                this.parsePinString = parsePinString;
                this.style = `
            .sim-neopixel-canvas {
            }
            .sim-neopixel-canvas-parent:hover {
                transform-origin: center;
                transform: scale(4) translateY(-220px);
                -moz-transform: scale(4) translateY(-220px);
            }
            .sim-neopixel-canvas .hidden {
                visibility:hidden;
            }
            .sim-neopixel-background {
                fill: rgba(255,255,255,0.9);
            }
            .sim-neopixel-strip {
            }
        `;
            }
            init(bus, state, svgEl, otherParams) {
                this.stripGroup = pxsim.svg.elt("g");
                this.element = this.stripGroup;
                this.pin = this.parsePinString(otherParams["dataPin"] || otherParams["pin"])
                    || this.parsePinString("pins.NEOPIXEL")
                    || this.parsePinString("pins.MOSI");
                this.lastLocation = [0, 0];
                this.state = state(this.pin);
                let part = mkNeoPixelPart();
                this.part = part;
                this.stripGroup.appendChild(part.el);
                this.overElement = null;
                this.makeCanvas();
            }
            makeCanvas() {
                let canvas = new NeoPixelCanvas(this.pin.id, this.state.width);
                if (this.overElement) {
                    this.overElement.removeChild(this.canvas.canvas);
                    this.overElement.appendChild(canvas.canvas);
                }
                else {
                    let canvasG = pxsim.svg.elt("g", { class: "sim-neopixel-canvas-parent" });
                    canvasG.appendChild(canvas.canvas);
                    this.overElement = canvasG;
                }
                this.canvas = canvas;
                this.updateStripLoc();
            }
            moveToCoord(xy) {
                let [x, y] = xy;
                let loc = [x, y];
                this.lastLocation = loc;
                this.updateStripLoc();
            }
            updateStripLoc() {
                let [x, y] = this.lastLocation;
                pxsim.U.assert(typeof x === "number" && typeof y === "number", "invalid x,y for NeoPixel strip");
                this.canvas.setLoc([x + CANVAS_LEFT, y + CANVAS_TOP]);
                pxsim.svg.hydrate(this.part.el, { transform: `translate(${x} ${y})` }); //TODO: update part's l,h, etc.
            }
            updateState() {
                if (this.state.width != this.canvas.cols) {
                    this.makeCanvas();
                }
                let colors = [];
                for (let i = 0; i < this.state.length; i++) {
                    colors.push(this.state.pixelColor(i));
                }
                this.canvas.update(colors);
            }
            updateTheme() { }
        }
        visuals.NeoPixelView = NeoPixelView;
    })(visuals = pxsim.visuals || (pxsim.visuals = {}));
})(pxsim || (pxsim = {}));
var pxsim;
(function (pxsim) {
    var radio;
    (function (radio) {
        function raiseEvent(id, eventid) {
            const state = pxsim.getRadioState();
            state.raiseEvent(id, eventid);
        }
        radio.raiseEvent = raiseEvent;
        function setGroup(id) {
            const state = pxsim.getRadioState();
            state.setGroup(id);
        }
        radio.setGroup = setGroup;
        function setTransmitPower(power) {
            const state = pxsim.getRadioState();
            state.setTransmitPower(power);
        }
        radio.setTransmitPower = setTransmitPower;
        function setFrequencyBand(band) {
            const state = pxsim.getRadioState();
            state.setFrequencyBand(band);
        }
        radio.setFrequencyBand = setFrequencyBand;
        function sendRawPacket(buf) {
            let cb = pxsim.getResume();
            const state = pxsim.getRadioState();
            if (state.enable) {
                state.datagram.send({
                    type: 0,
                    groupId: state.groupId,
                    bufferData: buf.data
                });
            }
            setTimeout(cb, 1);
        }
        radio.sendRawPacket = sendRawPacket;
        function readRawPacket() {
            const state = pxsim.getRadioState();
            const packet = state.datagram.recv();
            const buf = packet.payload.bufferData;
            const n = buf.length;
            if (!n)
                return undefined;
            const rbuf = pxsim.BufferMethods.createBuffer(n + 4);
            for (let i = 0; i < buf.length; ++i)
                rbuf.data[i] = buf[i];
            // append RSSI
            pxsim.BufferMethods.setNumber(rbuf, pxsim.BufferMethods.NumberFormat.Int32LE, n, packet.rssi);
            return rbuf;
        }
        radio.readRawPacket = readRawPacket;
        function onDataReceived(handler) {
            const state = pxsim.getRadioState();
            state.datagram.onReceived(handler);
        }
        radio.onDataReceived = onDataReceived;
        function off() {
            const state = pxsim.getRadioState();
            state.off();
        }
        radio.off = off;
        function on() {
            const state = pxsim.getRadioState();
            state.on();
        }
        radio.on = on;
    })(radio = pxsim.radio || (pxsim.radio = {}));
})(pxsim || (pxsim = {}));
var pxsim;
(function (pxsim) {
    function getRadioState() {
        return pxsim.board().radioState;
    }
    pxsim.getRadioState = getRadioState;
    class RadioDatagram {
        constructor(runtime, dal) {
            this.runtime = runtime;
            this.dal = dal;
            this.datagram = [];
            this.lastReceived = RadioDatagram.defaultPacket();
            this._rssi = undefined; // not set yet
        }
        get rssi() {
            return this._rssi;
        }
        set rssi(value) {
            this._rssi = value | 0;
        }
        queue(packet) {
            if (this.datagram.length < 4)
                this.datagram.push(packet);
            pxsim.runtime.board.bus.queue(this.dal.ID_RADIO, this.dal.RADIO_EVT_DATAGRAM);
        }
        send(payload) {
            const state = getRadioState();
            pxsim.Runtime.postMessage({
                type: "radiopacket",
                broadcast: true,
                rssi: this._rssi || -75,
                serial: state.transmitSerialNumber ? pxsim.control.deviceSerialNumber() : 0,
                time: new Date().getTime(),
                payload
            });
        }
        recv() {
            let r = this.datagram.shift();
            if (!r)
                r = RadioDatagram.defaultPacket();
            return this.lastReceived = r;
        }
        onReceived(handler) {
            pxsim.pxtcore.registerWithDal(this.dal.ID_RADIO, this.dal.RADIO_EVT_DATAGRAM, handler);
            this.recv();
        }
        static defaultPacket() {
            return {
                rssi: -1,
                serial: 0,
                time: 0,
                payload: { type: -1, groupId: 0, bufferData: new Uint8Array(0) }
            };
        }
    }
    pxsim.RadioDatagram = RadioDatagram;
    class RadioState {
        constructor(runtime, board, dal) {
            this.runtime = runtime;
            this.board = board;
            this.power = 0;
            this.transmitSerialNumber = false;
            this.datagram = new RadioDatagram(runtime, dal);
            this.power = 6; // default value
            this.groupId = 0;
            this.band = 7; // https://github.com/lancaster-university/microbit-dal/blob/master/inc/core/MicroBitConfig.h#L320
            this.enable = true;
            this.board.addMessageListener(this.handleMessage.bind(this));
        }
        handleMessage(msg) {
            if (msg.type == "radiopacket") {
                let packet = msg;
                this.receivePacket(packet);
            }
        }
        setGroup(id) {
            if (this.enable) {
                this.groupId = id & 0xff; // byte only
            }
        }
        setTransmitPower(power) {
            if (this.enable) {
                power = power | 0;
                this.power = Math.max(0, Math.min(7, power));
            }
        }
        setTransmitSerialNumber(sn) {
            this.transmitSerialNumber = !!sn;
        }
        setFrequencyBand(band) {
            if (this.enable) {
                band = band | 0;
                if (band < 0 || band > 83)
                    return;
                this.band = band;
            }
        }
        off() {
            this.enable = false;
        }
        on() {
            this.enable = true;
        }
        raiseEvent(id, eventid) {
            if (this.enable) {
                pxsim.Runtime.postMessage({
                    type: "eventbus",
                    broadcast: true,
                    id,
                    eventid,
                    power: this.power,
                    group: this.groupId
                });
            }
        }
        receivePacket(packet) {
            if (this.enable) {
                if (this.groupId == packet.payload.groupId) {
                    this.datagram.queue(packet);
                }
            }
        }
    }
    pxsim.RadioState = RadioState;
})(pxsim || (pxsim = {}));
var pxsim;
(function (pxsim) {
    var settings;
    (function (settings) {
        let currSize = 0;
        const MAX_SIZE = 16 * 1024;
        function encodeKey(key) {
            return "S/" + key;
        }
        function allKeys() {
            const pref = encodeKey("");
            const st = pxsim.board().storedState;
            return Object.keys(st).filter(k => k.slice(0, pref.length) == pref);
        }
        function userKeys() {
            return allKeys().filter(s => s[2] != "#");
        }
        function computeSize() {
            let sz = 0;
            const storage = pxsim.board().storedState;
            for (let k of allKeys()) {
                sz += k.length + storage[k].length;
            }
            currSize = sz;
        }
        function _set(key, buf) {
            key = encodeKey(key);
            const storage = pxsim.board().storedState;
            const prev = storage[key];
            const val = btoa(pxsim.U.uint8ArrayToString(buf.data));
            const newSize = prev == null
                ? currSize + key.length + val.length
                : currSize + val.length - prev.length;
            if (newSize > MAX_SIZE)
                return -1;
            pxsim.board().setStoredState(key, val);
            currSize = newSize;
            return 0;
        }
        settings._set = _set;
        function _remove(key) {
            key = encodeKey(key);
            const storage = pxsim.board().storedState;
            if (storage[key] == null)
                return -1;
            currSize -= key.length + storage[key].length;
            pxsim.board().setStoredState(key, null);
            return 0;
        }
        settings._remove = _remove;
        function _exists(key) {
            return _get(key) != undefined;
        }
        settings._exists = _exists;
        function _get(key) {
            key = encodeKey(key);
            const storage = pxsim.board().storedState;
            const val = storage[key];
            if (val == null)
                return undefined;
            return new pxsim.RefBuffer(pxsim.U.stringToUint8Array(atob(val)));
        }
        settings._get = _get;
        function _userClean() {
            for (let k of userKeys())
                pxsim.board().setStoredState(k, null);
            computeSize();
            // if system keys take more than 25% of space, delete everything
            if (currSize > MAX_SIZE / 4) {
                for (let k of allKeys())
                    pxsim.board().setStoredState(k, null);
                computeSize();
            }
        }
        settings._userClean = _userClean;
        function _list(prefix) {
            const r = new pxsim.RefCollection();
            const emptyPref = encodeKey("");
            for (let k of prefix[0] == "#" ? allKeys() : userKeys()) {
                const n = k.slice(emptyPref.length);
                if (n.slice(0, prefix.length) != prefix)
                    continue;
                r.push(n);
            }
            return r;
        }
        settings._list = _list;
    })(settings = pxsim.settings || (pxsim.settings = {}));
})(pxsim || (pxsim = {}));
