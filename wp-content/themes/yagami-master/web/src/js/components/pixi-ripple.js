import { Sprite } from "pixi.js";

/*
|--------------------------------------------------------------------------------
|                                  PixiRipple
|--------------------------------------------------------------------------------
|
| PixiRipple generate canvas with ripple effect on image
|
*/

/*
|
| Class
|--------
|
*/
class PixiRipple {
    /*
    |
    | Constructor
    |--------------
    */
    constructor(canvas, params = {}) {
        this.handleSetup = this.handleSetup.bind(this)

        this.canvas = canvas;
        this.params = this.initParams(params);

        this.renderer;
        this.stage;
        this.container;
        this.mainImage;
        this.displacementSprite;
        this.displacementFilter;
        this.requestAnimationFrameId;
        this.mouseX;
        this.mouseY;

        this.parent;

        this.init();
        this.handleResize();
    }

    /*
    |
    | bindMethods
    |--------------
    */
    bindMethods(){
    }


    /*
    |
    | initParams
    |-------------
    */
    initParams(params) {
        const { 
            width,
            height,
            imageBehavior,
            cover,
            fitParent,
            parent,
            mainImage,
            displacementImage,
            displacementScale,
            displacementCenter,
            autoPlay,
            autoPlaySpeed,
            events,
            dispatchPointerOver
        } = params

        return {
            'width'              : this.isDefined(width)               ? width              : 1920,
            'height'             : this.isDefined(height)              ? height             : 1080,
            'imageBehavior'      : this.isDefined(imageBehavior)       ? imageBehavior      : false,
            'cover'              : this.isDefined(cover)               ? cover              : true,
            'fitParent'          : this.isDefined(fitParent)           ? fitParent          : true,
            'parent'             : this.isDefined(parent)              ? parent             : null,
            'mainImage'          : this.isDefined(mainImage)           ? mainImage          : null,
            'displacementImage'  : this.isDefined(displacementImage)   ? displacementImage  : null,
            'displacementScale'  : this.isDefined(displacementScale)   ? displacementScale  : null,
            'displacementCenter' : this.isDefined(displacementCenter)  ? displacementCenter : false,
            'autoPlay'           : this.isDefined(autoPlay)            ? autoPlay           : true,
            'autoPlaySpeed'      : this.isDefined(autoPlaySpeed)       ? autoPlaySpeed      : [10, 3],
            'events'             : this.isDefined(events)              ? events             : ['hover', 'click'],
            'dispatchPointerOver': this.isDefined(dispatchPointerOver) ? dispatchPointerOver: false
        }
    }


    /*
    |
    | initState
    |------------
    */
    initState(params) {

    }


    /**
	|
	| Init
	|-------
    */
    init() {
        if (this.canvasExist()) {
            this.initRenderer();
            this.initContainers();
            this.initDisplacementElements();
            
            this.prepareStage();
            this.loadSprites();
        }
    }


    /**
	|
	| initRenderer
	|---------------
    */
    initRenderer(){
        const rendererSize = this.getRendererSize();

        this.renderer = new PIXI.autoDetectRenderer({
            width  : rendererSize.width,
            height : rendererSize.height,
            transparent: true,
            antialias: true,
            forceFXAA: true,
            view   : this.canvas
        });
    }


    /**
	|
	| initContainers
	|-----------------
    */
    initContainers() {
        this.stage     = new PIXI.Container();
        this.container = new PIXI.Container();

        this.stage.addChild(this.container);
        this.stage.interactive     = true;
        this.container.interactive = true;
        this.container.buttonMode  = true;
    }


    /**
	|
	| initDisplacementElements
	|---------------------------
    */
    initDisplacementElements(){
        this.displacementSprite = new PIXI.Sprite.fromImage(this.params.displacementImage);
        this.displacementFilter = new PIXI.filters.DisplacementFilter(this.displacementSprite);
    }


    /**
	|
	| prepareStage
	|---------------
    */
    prepareStage(){
        const { imageBehavior, autoPlay, displacementScale } = this.params;

        if(imageBehavior){
            this.renderer.view.style.maxWidth = '100%';
        }
        
        // Set dispalcement filter to stage and set default values for animation
        this.stage.filters = [this.displacementFilter];
        if (!autoPlay){
            this.displacementFilter.scale.set(0, 0);
        } else {
            if(displacementScale !== null){
                this.displacementFilter.scale.set(displacementScale[0], displacementScale[1]);
            }
        }
        this.displacementFilter.autoFit = false;
        
        // Set displacement sprite set default values for animation
        this.displacementSprite.texture.baseTexture.wrapMode = PIXI.WRAP_MODES.REPEAT;
        this.displacementSprite.scale.set(2, 2);

        this.stage.addChild(this.displacementSprite);
    }


    /**
	|
	| loadSprites
    |--------------
    */
    loadSprites() {
        PIXI.loader.load(this.handleSetup);
    }


    /**
	|
	| handleSetup
    |--------------
    */
    handleSetup(){
        const { width, height } = this.renderer;
        
        this.mainImage = new PIXI.Sprite(PIXI.loader.resources[this.params.mainImage].texture);

        if(this.params.cover){
            this.cover(this.mainImage, width, height);
        }
        
        this.container.addChild(this.mainImage);

        this.runLoop();
        this.initEvents();
    }


    /**
	|
	| loop
    |-------
    */
    runLoop(){
        const ticker = new PIXI.ticker.Ticker();

        ticker.autoStart = this.params.autoPlay ? this.params.autoPlay : true;
        ticker.add(delta => this.loop(delta));
    }


    /**
	|
	| loop
    |-------
    */
    loop(delta){
        if (this.params.autoPlay) {
            this.displacementSprite.x += this.params.autoPlaySpeed[0] * delta;
            this.displacementSprite.y += this.params.autoPlaySpeed[1];
        }
        
        this.renderer.render(this.stage);
    }


    /**
	|
	| initEvents
    |-------------
    */
    initEvents(){
        const { events } = this.params;

        if (this.inArray('hover', events)) {
            this.container.pointerover = e => this.handlePointerOver(e);
            this.container.pointerout  = e => this.handlePointerOut(e);
        }

        if (this.inArray('click', events)) {
            this.container.pointerdown = e => this.handlePointerDown(e);
            this.container.pointerup   = e => this.handlePointerUp(e);
        }
    }

    /**
	|
	| handlePointerOver
	|--------------------
    */
    handlePointerOver(e){
        const { x, y } = e.data.global;

        this.mouseX = x;
        this.mouseY = y;

        TweenMax.to(this.displacementFilter.scale, 1, {
            x: '+=' + Math.sin(this.mouseX) * 100 + '',
            y: '+=' + Math.cos(this.mouseY) * 100 + ''
        });
    }


    /**
	|
	| handlePointerOut
	|-------------------
    */
    handlePointerOut(e){
        let object = {
            x: 0,
            y: 0
        }

        if (this.params.dispatchPointerOver) {
            object.onComplete = () => {
                TweenMax.to(this.displacementFilter.scale, 1, {
                    x: 20,
                    y: 20
                })
            }
        }

        TweenMax.to(this.displacementFilter.scale, 1, object);
    }


    /**
	|
	| handlePointerDown
	|-------------------
    */
    handlePointerDown(e) {
        const { x, y } = e.data.global;

        this.mouseX = x;
        this.mouseY = y;

        console.log(Math.sin(this.mouseX) * 1200, Math.cos(this.mouseY) * 200)

        TweenMax.to(this.displacementFilter.scale, 1, {
            x: '+=' + Math.sin(this.mouseX) * 1200 + '',
            y: '+=' + Math.cos(this.mouseY) * 200 + ''
        })
    }


    /**
	|
	| handlePointerUp
	|-------------------
    */
    handlePointerUp(e) {
        let object = {
            x: 0,
            y: 0
        }

        if (this.params.dispatchPointerOver){
            object.onComplete = () => {
                TweenMax.to(this.displacementFilter.scale, 1, {
                    x: 20,
                    y: 20
                })
            }
        }

        TweenMax.to(this.displacementFilter.scale, 1, object);
    }


    /**
	|
	| cover
	|--------
    */
    cover(sprite, rendererWidth, rendererHeight) {
        const stageRatio = rendererWidth / rendererHeight;
        const spriteRatio = sprite.width / sprite.height;

        if (stageRatio > spriteRatio) {
            sprite.height = sprite.height / (sprite.width / rendererWidth);
            sprite.width = rendererWidth;
            sprite.x = 0;
            sprite.y = (rendererHeight - sprite.height) / 2;
        } else {
            sprite.width = sprite.width / (sprite.height / rendererHeight);
            sprite.height = rendererHeight;
            sprite.y = 0;
            sprite.x = (rendererWidth - sprite.width) / 2;
        }
    }


    /**
	|
	| getRendererSize
	|----------------
    */
    getRendererSize(){
        const { width, height, fitParent, parent } = this.params;
        const canvas = this.canvas;
        let w = width;
        let h = height;

        if (fitParent){
            this.parent = parent === null ? canvas.parentNode : canvas.closest(parent);

            w = this.parent.clientWidth;
            h = this.parent.clientHeight;
        }

        return { width: w, height: h };
    }


    /**
	|
	| handleResize
	|---------------
    */
    handleResize() {
        window.addEventListener('resize', () => {
            this.renderer.resize(this.parent.clientWidth, this.parent.clientHeight);
        })
    }


    /**
    |
    | canvasExist
    |--------------
    */
    canvasExist() {
        return this.control(this.canvas !== null, this.getMessage('canvasExist'), this.canvas);
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
	| Helper: inArray
	|------------------
	|
	*/
    inArray(needle, haystack) {
        return haystack.indexOf(needle) > -1;
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
            'canvasExist': 'The canvas (specified as 1st parameter) does not exist:'
        };

        return 'PixiRipple: ' + messages[messageKey];
    }
}

export default PixiRipple;
