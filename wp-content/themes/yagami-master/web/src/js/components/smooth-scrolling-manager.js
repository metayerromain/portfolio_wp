import SmoothScrollingParallax from './smooth-scrolling-parallax';
/*
|--------------------------------------------------------------------------------
|                             Smooth Scrolling Manager
|--------------------------------------------------------------------------------
|
| Smooth Scrolling Manager handles using of Smooth Scrolling lib
|
*/

/*
|
| Class
|--------
|
*/
class SmoothScrollingManager {
    /*
    |
    | Constructor
    |--------------
    */
    constructor($container, params = {}) {
        this.container = $container;
        this.defaults  = this.initDefaults();
        this.params    = this.initParams(params);

        this.instance  = null;
        this.scrollbar = null;

        this.init();
    }


    /**
	|
	| defaultSmooth
	|----------------
    */
    initDefaults(){
        return {
            smooth: {
                native: false,
                ease: 0.1,
                preload: true
            },
            vs: {
                limitInertia: false,
                mouseMultiplier: 0.4,
                touchMultiplier: 1.8,
                firefoxMultiplier: 30
            }
        };
    }


    /**
	|
	| initParams
	|-------------
    */
    initParams(params){
        const { init, smooth, vs } = params;

        return {
            'init'  : this.isDefined(init) ? init : true,
            'smooth': { ...this.defaults.smooth, ...smooth },
            'vs'    : { ...this.defaults.vs, ...vs }
        }
    }


    /**
	|
	| Init
	|-------
    */
    init() {
        if (this.containerExist()) {
            const {init, smooth, vs} = this.params;
            const finalSmooth        = { ...smooth, section: this.container };

            this.instance = new SmoothScrollingParallax({ 
                ...finalSmooth, 
                vs: vs, 
                divs: document.querySelectorAll('[data-smooth-parallax]')
            });

            this.instance.init();

            this.initProperties();
        }   
    }


    /**
	|
	| initProperties
	|-----------------
    */
    initProperties(){
        this.scrollbar = $(this.instance.dom.scrollbar.el);
    }


    /**
	|
	| on
	|-----
    */
    on() {
        this.instance.on();
        this.scrollbar.show();
    }


    /**
	|
	| off
	|------
    */
    off() {
        this.instance.off();
        this.scrollbar.hide();
    }


    /**
	|
	| destroy
	|----------
    */
    destroy(){
        this.instance.destroy();
        this.scrollbar.remove();
    }

    /**
    |
    | containerExist
    |-----------------
    */
    containerExist() {
        return this.control(this.container !== null, this.getMessage('containerExist'), this.container);
    }


    /**
	|
	| Helper: isDefined
	|--------------------
	|
	*/
    isDefined(item) {
        return typeof item !== 'undefined';
    }


    /**
	|
	| Helper: exist
	|----------------
	*/
    exist($item) {
        return $item.length;
    }


    /**
    |
    | Helper: control
    |------------------
    */
    control(condition, message, selector = null) {
        if (!condition) {
            if (selector === null) {
                console.error(message);
            } else {
                console.error(message, selector);
            }
        }

        return condition;
    }


    /**
	|
	| Helper: getMessage
	|---------------------
	*/
    getMessage(messageKey, var1 = '', var2 = '') {
        var messages = {
            'containerExist': 'The SmoothScrolling container (specified as 1st parameter) does not exist:'
        };

        return 'SmoothScrollingManager: ' + messages[messageKey];
    }
}

export default SmoothScrollingManager;