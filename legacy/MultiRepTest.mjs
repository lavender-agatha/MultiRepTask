import "./extlib/lab.js";
import { Revision, Handlers } from "./Handlers.js";
import { ConceptualModel, NamuBonho } from "./ConceptualModel.js";
import { ScreenObjects, Screens } from "./ScreenObjects.js";


Revision.MultiRepTest = {
    major: 0,
    minor: 0,
    rev: 1,
    timestamp: '2021-07-13 11:25PM',
};
Revision.SandBox = {
    major: 0,
    minor: 2,
    rev: 43,
    timestamp: '2021-08-18 4:37PM',
};
Revision.General.major = 0;
Revision.General.minor = 4;
Revision.General.rev = 142;
Revision.General.timestamp = '2021-08-14 9:01PM';

/**
 * 
 * @TODO
 *      ASAP:
 *      - Implement the extension for the Loop class making it break on n 
 *        consecutive right answers
 *      - Implement an tagging method for data
 *      - Implement a better GetData() interface and a 'LoadFromData' interface
 *      - Implement a JSON export for the data
 *      - Implement a JSON loader for the data
 *      - Implement the trials
 * 
 *      AFTER:
 *      - Restructure the files into MoveLab and MultiRepTest with an one class per
 *        file approach and default exports, making it more granular
 *      - Produce tests for your classes that might run both as EMS and CJS modules
 *        on both browser and Node
 *  
 *    
 * 
 * 
 * 
 * Test Roadmap:
 *      1) Load the screen objects containing:
 *          (+) Session 1:
 *              - The namu x bonho screen
 *              - The wug x tug screen
 *              - The zilnar x olbar screen
 *          (+) Session 2:
 *              
 * 
 */

var condition = "control"; //TODO: Make it random if not specified in URL
                           // OBS: URL specification must be obscure
var url = new URLSearchParams(window.location.search);
const genderlang = (male, female, neutral)=>{
    return {
        male: male,
        female: female,
        neutral: neutral,
    };
};

var lang = {
    gender: url.get('gender'),
    vinde: genderlang('vindo', 'vinda', 'vinde'),
};
console.log('genderlang(a, b, c)=', genderlang('a', 'b', 'c'));
console.log("lang=",lang);

var config = {
    mode: 'dev',
    base_url: {
        dev: 'https://devlab.bruno.today/MultiRepTest/legacy/',
        demo: 'https://demolab.bruno.today/MultiRepTest/legacy/',
        public: 'https://lab.bruno.today/MultiRepTest/legacy/'
    },
    data_url: {
        control: "./data/control.trialdata.json",
        experimental: "./data/experimental.trialdata.json",
    },
    loop_log: false,
    learning_trials: {
        n: 15,
        n_streaks: 3,
    },
    condition,
};



/**
 * 
 * @param {*} _data 
 */

function runExperiment(_data, config={}) {
    var trialdata = Handlers.utils.prepareData(
        _data.trialdata,
        ConceptualModel
    );
    console.log("_data=", _data);

    var loop_namubonho_learning = ScreenObjects.templates.generic.flow.loop(
        Screens.sequence.namubonho_learning(config.learning_trials.n_streaks),
        trialdata.learning.namubonho,
        true,
        config.learning_trials.n,
        'namubonho_loop',
        [
            new Handlers.classes.EventMgr({
                title: 'namubonho_loop',
                log: config.loop_log,
            }),
        ]
    );

    var loop_wugtug_learning = ScreenObjects.templates.generic.flow.loop(
        Screens.sequence.wugtug_learning(config.learning_trials.n_streaks),
        trialdata.learning.wugtug,
        true,
        config.learning_trials.n,
        'wugtug_loop',
        [
            new Handlers.classes.EventMgr({
                title: 'wugtug_loop',
                log: config.loop_log,
            }),
        ]
    );
    
    var loop_zilnarolbar_learning = ScreenObjects.templates.generic.flow.loop(
        Screens.sequence.zilnarolbar_learning(config.learning_trials.n_streaks),
        trialdata.learning.zilnarolbar,
        true,
        config.learning_trials.n,
        'zilnarolbar_loop',
        [
            new Handlers.classes.EventMgr({
                title: 'zilnarolbar_loop',
                log: config.loop_log,
            }),
        ]
    );

    var loop_association = ScreenObjects.templates.generic.flow.loop(
        Screens.sequence.association(),
        trialdata.association.association,
        true,
	10,
        //trialdata.association.association.length,
        'association_loop',
        [
            new Handlers.classes.EventMgr({
                title: 'association_loop',
                log: config.loop_log,
            }),
        ]
    );

    var loop_trial = ScreenObjects.templates.generic.flow.loop(
        Screens.sequence.trial(),
        trialdata.trial.trial,
        10, //trialdata.trial.trial.length,
        'trial_loop',
        [
            new Handlers.classes.EventMgr({
                title: 'trial_loop',
                log: config.loop_log,
            }),
        ]
    );
    
    loop_namubonho_learning.on('after:prepare', Handlers.handlers.generic.setup_streaks);
    loop_wugtug_learning.on('after:prepare', Handlers.handlers.generic.setup_streaks);
    loop_zilnarolbar_learning.on('after:prepare', Handlers.handlers.generic.setup_streaks);

    var experiment = new lab.flow.Sequence({
        title: 'MultiRepTest',
        datastore: new lab.data.Store(),
        viewport: [800, 600],
        plugins: [
            new Handlers.classes.EventMgr({
                title: 'root',
                log: config.loop_log,
            }),
        ],
        content: [
            Screens.presentation.welcome("Pages/welcome.html", config, lang),
            Screens.instruction.generic("Pages/instructions-1.html", config, lang),
            Screens.instruction.generic("Pages/kbdinstructions.html", config, lang),
            //loop_namubonho_,
            /**/
            loop_namubonho_learning,
            loop_wugtug_learning,
            loop_zilnarolbar_learning,
            loop_association,
            loop_trial,
        ],
        messageHandlers: {
            'after:end': function() {
                this.options.datastore.download();
            }
        },
    });
    
    console.log("experiment=", experiment);
    
    experiment.prepare();
    experiment.run();

}

var url = new URL(
    config.data_url[condition],
    config.base_url[config.mode],
);

Handlers.utils.loadUrlData(
    url.toString(), 
    runExperiment, 
    config
);
