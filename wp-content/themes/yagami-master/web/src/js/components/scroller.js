/*
|--------------------------------------------------------------------------------
|                                   Scroller
|--------------------------------------------------------------------------------
|
| Scroller is a lightweight library to manage "animated & looped" sliding contents
| It uses Greensock as main dependency
|
*/

/*
|
| Class
|--------
|
*/
class Scroller{
    /*
    |
    | Constructor
    |--------------
    */
    constructor($scrollerWrapper, params = {}){
        this.wrapper = $scrollerWrapper;
        this.wrapperInner;
        this.item;
        this.trueWrapperWidth = 0;
        this.params = this.initParams(params);
        this.timeline;
        this.init();
    }

    /*
    |
    | init
    |--------------
    */
    init(){
        if(this.wrapperExist()){
            if(this.wrapperDefined()){
                var $item = this.wrapper.find('[data-scroller-item]');

                if(this.itemExist($item)){
                    this.item = $item;
                    this.initScroller();
                    this.run();
                }
            }
        }   
    }

    /*
    |
    | initParams
    |-------------
    */
    initParams(params){
        return {
            'autoplay': typeof params.autoplay   !== 'undefined' ? params.autoplay  : true,
            'duration': typeof params.duration   !== 'undefined' ? params.duration  : 15,
            'direction': typeof params.direction !== 'undefined' ? params.direction : 'left'
        };
    }

    /*
    |
    | initScroller
    |--------------
    */
    initScroller(){
        var
            $wrapper        = this.wrapper,
            $item           = this.item,
            wrapperWidth    = $wrapper.outerWidth(),
            itemWidth       = $item.outerWidth(true),
            clonedItemCount = Math.ceil(wrapperWidth / itemWidth)
        ;
        
        this.setWrapperClasses();
        this.setTrueWrapperWidth(itemWidth, clonedItemCount);
        this.createWrapperInner();
        this.cloneItems(clonedItemCount);
        this.timeline = this.setAnimationTimeline();
    }

    /*
    |
    | animate
    |----------
    */
    setAnimationTimeline(){
        var timeline = new TimelineMax({ 
            paused: true, 
            onComplete: function() { this.restart(); }
        });
        var operator = this.params.direction === 'right' ? '' : '-';

        timeline.to(this.wrapperInner, this.params.duration, {x: operator + '' + this.trueWrapperWidth, ease: Linear.easeIn});

        return timeline;
    }

    /*
    |
    | run
    |------
    */
    run(){
        if(this.params.autoplay){
            this.play();
        }
    }

    /*
    |
    | Play
    |-------
    */
    play(){
        this.timeline.play();
    }

    /*
    |
    | Pause
    |--------
    */
    pause(){
        this.timeline.pause();
    }

    /*
    |
    | createWrapperInner
    |---------------------
    */
    createWrapperInner(){
        this.wrapper.append('<div class="scroller-wrapper-inner"></div>');
        this.wrapperInner = this.wrapper.find('.scroller-wrapper-inner');
    }

    /*
    |
    | setTrueWrapperWidth
    |----------------------
    */
    setTrueWrapperWidth(itemWidth, clonedItemCount){
        this.trueWrapperWidth = Math.floor(clonedItemCount * itemWidth);
    }

    /*
    |
    | setWrapperClasses
    |--------------------
    */
    setWrapperClasses(){
        if(this.params.direction === 'right'){
            this.wrapper.addClass('scroller-direction-right');
        }
    }
    
    /*
    |
    | cloneItems
    |-------------
    */
    cloneItems(clonedItemCount){
        this.wrapperInner.append(this.item);

        for (var i = 0; i < clonedItemCount * 2; i++) {
            this.item.clone(true).addClass('scroller-item-duplicated').appendTo(this.wrapperInner);
        }
    }

    /*
    |
    | wrapperDefined
    |-----------------
    */
    wrapperDefined(){
        var condition = typeof this.wrapper.data('scroller-wrapper') != 'undefined';

        return this.control(condition, 'Scroller: Missing data [data-scroller-wrapper] on wrapper');
    }

    /*
    |
    | wrapperExist
    |---------------
    */
    wrapperExist(){
        return this.control(this.wrapper.length, 'Scroller: wrapper not found');
    }

    /*
    |
    | itemExist
    |------------
    */
    itemExist($item){
        return this.control($item.length, 'Scroller: wrapper item [data-scroller-item] not found');
    }

    /*
    |
    | control
    |----------
    */
    control(condition, message){
        if(!condition){
            console.log(message)
        }
        
        return condition;
    }
}

export default Scroller;
