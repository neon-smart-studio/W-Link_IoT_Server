
var debug = require('debug')(require('path').basename(__filename));

const fs = require('fs');
var path = require('path');

const appDir = path.dirname(require.main.filename);

const objectAssignDeep = require('object-assign-deep');
const events = require('events');

const ZNP_State_Store_Path = appDir+'/ZNP_State';

const saveInterval = 1000 * 60 * 5; // 5 minutes

const dontCacheProperties = [
    'action', 'button', 'button_left', 'button_right', 'click', 'forgotten', 'keyerror',
    'step_size', 'transition_time', 'action_color_temperature', 'action_color',
    'action_group', 'group_list', 'group_capacity', 'no_occupancy_since',
    'step_mode', 'transition_time', 'duration', 'elapsed', 'from_side', 'to_side',
];

class State extends events.EventEmitter {
    constructor() {
        super();
        this.state = {};
        this.file = ZNP_State_Store_Path;
        this.timer = null;
    }

    start() {
        this._load();

        // Save the state on every interval
        this.clearTimer();
        this.timer = setInterval(() => this.save(), saveInterval);
    }

    clearTimer() {
        if (this.timer) {
            clearTimeout(this.timer);
            this.timer = null;
        }
    }

    stop() {
        this.clearTimer();
        this.save();
    }

    _load() {
        if (fs.existsSync(this.file)) {
            try {
                this.state = JSON.parse(fs.readFileSync(this.file, 'utf8'));
                debug(`Loaded state from file ${this.file}`);
            } catch (e) {
                debug(`Failed to load state from file ${this.file} (corrupt file?)`);
            }
        } else {
            debug(`Can't load state from file ${this.file} (doesn't exist)`);
        }
    }

    save() {
        debug(`Saving state to file ${this.file}`);
        const json = JSON.stringify(this.state, null, 4);
        fs.writeFileSync(this.file, json, 'utf8');
    }

    exists(ID) {
        return this.state.hasOwnProperty(ID);
    }

    get(ID) {
        return this.state[ID];
    }

    set(ID, state, reason=null) {
        const toState = objectAssignDeep.noMutate(state);
        dontCacheProperties.forEach((property) => {
            if (toState.hasOwnProperty(property)) {
                delete toState[property];
            }
        });

        const fromState = this.state[ID];

        this.state[ID] = toState;

        this.emit('stateChange', {ID, from: fromState, to: toState, reason});
    }

    remove(ID) {
        if (this.exists(ID)) {
            delete this.state[ID];
        }
    }
}

module.exports = State;
