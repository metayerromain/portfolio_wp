/*
|--------------------------------------------------------------------------------
|                                       Tilter
|--------------------------------------------------------------------------------
|
| Tilter is a small component to handle section tilting on mousemove
|
*/

/*
|
| Class
|--------
|
*/
class Tilter {
    /*
    |
    | Constructor
    |--------------
    */
    constructor($section, params = {}) {
        this.section = $section;
        this.params = this.initParams(params);

        this.mouseX = 0;
        this.mouseY = 0;

        this.init();
    }


    /**
	|
	| initParams
	|-------------
    */
    initParams(params) {
        const { forceX, forceY, effectX, effectY, duration, ease } = params;

        return {
            'forceX'     : this.isDefined(forceX)   ? forceX   : 20,
            'forceY'     : this.isDefined(forceY)   ? forceY   : 20,
            'effectX'    : this.isDefined(effectX)  ? effectX  : 'push',
            'effectY'    : this.isDefined(effectY)  ? effectY  : 'push',
            'duration'   : this.isDefined(duration) ? duration : 0.5,
            'ease'       : this.isDefined(ease)     ? ease     : Quad.easeOut
        }
    }


    /**
	|
	| Init
	|-------
    */
    init() {
        if (this.sectionExist()) {
            window.addEventListener('mousemove', (e) => this.handleMouseMove(e), false);
        }
    }

    /**
	|
	| handleMouseMove
	|------------------
    */
    handleMouseMove(e){
        const { forceX, forceY, effectX, effectY, duration, ease } = this.params;

        this.mouseX = e.pageX;
        this.mouseY = e.pageY;

        const x = (this.mouseX / window.innerWidth) - 0.5;
        const y = (this.mouseY / window.innerHeight) - 0.5;
        const indiceX = effectX === 'push' ? 1  : -1;
        const indiceY = effectY === 'push' ? -1 : 1;
        
        TweenLite.to(this.section, duration, {
            rotationY            : (forceX * x) * indiceX,
            rotationX            : (forceY * y) * indiceY,
            ease                 : ease,
            transformPerspective : 900,
            transformOrigin      : 'center'
        });
    }


    /**
    |
    | sectionExist
    |---------------
    */
    sectionExist() {
        return this.control(this.exist(this.section), this.getMessage('sectionExist'), this.section);
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
            'sectionExist': 'The tilting section (specified as 1st parameter) does not exist:'
        };

        return 'Tilter: ' + messages[messageKey];
    }
}

export default Tilter;
