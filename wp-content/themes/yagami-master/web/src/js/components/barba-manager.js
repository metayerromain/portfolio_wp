import Barba from 'barba.js/dist/barba.js';
/*
|--------------------------------------------------------------------------------
|                                   BarbaManager
|--------------------------------------------------------------------------------
|
| BarbaManager allows to manage Barba Ajax pages transitions
|
*/

/*
|
| Class
|--------
|
*/
class BarbaManager {

    /*
    |
    | Constructor
    |--------------
    */
    constructor(params = {}) {
        this.params = this.initParams(params);

        this.init();
    }

    /*
    |
    | initParams
    |--------------
    */
    initParams(params) {
        const { prefetch, xhrTimeout } = params;

        return {
            'prefetch'   : this.isDefined(prefetch)   ? prefetch   : false,
            'xhrTimeout' : this.isDefined(xhrTimeout) ? xhrTimeout : 10000
        }
    }

    /**
	|
	| Init
	|-------
    */
    init() {
        this.initBarba();
        this.initBarbaPrefetch();
        this.initBarbaUtils();
        this.initPreventRedirectionOnCurrentPage();
        this.initBarbaEventsHandling();
        this.initBarbaPageTransition();
    }

    /**
	|
	| initBarba
	|------------
	|
	*/
    initBarba(){
        Barba.Pjax.start();
    }

    /**
	|
	| initBarbaPrefetch
	|--------------------
	|
	*/
    initBarbaPrefetch() {
        this.params.prefetch && Barba.Prefetch.init();
    }

    /**
	|
	| initBarbaUtils
	|-----------------
	|
	*/
    initBarbaUtils() {
        Barba.Utils.xhrTimeout = this.params.xhrTimeout;
    }

    /**
	|
	| initPreventRedirectionOnCurrentPage
	|--------------------------------------
	|
	*/
    initPreventRedirectionOnCurrentPage(){
        $('body').on('click', 'a', function (e) {
            if (e.currentTarget.href === window.location.href) {
                e.preventDefault();
                e.stopPropagation();
            }
        });
    }

    /**
	|
	| initBarbaEventsHandling
	|--------------------------
	|
	*/
    initBarbaEventsHandling() {
        Barba.Dispatcher.on('linkClicked', this.handleLinkClicked);
        Barba.Dispatcher.on('initStateChange', this.handleInitStateChanged);
        Barba.Dispatcher.on('newPageReady', this.handleNewPageReady);
        Barba.Dispatcher.on('transitionCompleted', this.handleTransitionCompleted);
    }

    /**
	|
	| handleLinkClicked
	|----------------------------
	|
	*/
    handleLinkClicked(HTMLElement, MouseEvent) {}

    /**
	|
	| handleInitStateChanged
	|----------------------------
	|
	*/
    handleInitStateChanged(currentStatus) {}

    /**
	|
	| handleNewPageReady
	|----------------------------
	|
	*/
    handleNewPageReady(currentStatus, prevStatus, HTMLElementContainer, newPageRawHTML) {}

    /**
	|
	| handleTransitionCompleted
	|----------------------------
	|
	*/
    handleTransitionCompleted(currentStatus, prevStatus) {}

    /**
	|
	| initBarbaPageTransition
	|--------------------------
	|
	*/
    initBarbaPageTransition(){
        Barba.Pjax.getTransition = () => ( Barba.BaseTransition.extend(this.handleBarbaPageTransition()) )
    }
    
    /**
	|
	| handleBarbaPageTransition
	|----------------------------
	|
	*/
    handleBarbaPageTransition(){
        return {
            start         : this.handleTranstionStart,
            processing    : this.handleTransitionProcessing,
            complete      : this.handleTranstionComplete,
            runTimeline   : this.runTimeline,
            reloadScripts : this.reloadScripts
        }
    }

    /**
	|
	| handleTranstionStart
	|-----------------------
	|
	*/
    handleTranstionStart() {
        Promise.all([this.newContainerLoading, this.processing()]).then(this.complete.bind(this));
    }

    /**
	|
	| handleTransitionProcessing
	|-----------------------------
	|
	*/
    handleTransitionProcessing() {        
        return new Promise((resolve) => {
            let timeline = new TimelineMax({ 
                paused: true, 
                onComplete: () => resolve(true)
            });
            
            this.runTimeline(timeline, $(this.oldContainer));
        })
    }

    /**
	|
	| handleTranstionDone
	|-----------------------
	|
	*/
    handleTranstionComplete() {
        this.done();
        this.reloadScripts();
    }

    /**
	|
	| runTimeline
	|--------------
	|
	*/
    runTimeline(timeline, $oldContainer) {
        const $ajaxPageLoader = $('.ajax-page-loader');

        timeline
            .to($oldContainer, 1, { autoAlpha: 0, ease: Power1.easeOut })
            .set($ajaxPageLoader, { autoAlpha: 1 })
            .fromTo($ajaxPageLoader.find('.item-loader'), 0.6, { autoAlpha: 0 }, { autoAlpha: 1, ease: Power1.easeOut })
            .fromTo($ajaxPageLoader.find('.item-text'), 0.8, { y: 30, autoAlpha: 0 }, { y: 0, autoAlpha: 1, ease: Power1.easeOut }, '-=0.4')

        timeline.play();
    }
    
    /**
	|
	| reloadScripts
	|----------------
	|
	*/
    reloadScripts() {
        $.each($('.app-script'), function () {
            let script = document.createElement('script');
            script.classList.add('app-script');
            script.src = $(this).attr('src');
            $(this).remove();
            document.body.appendChild(script);
        });
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
}

export default BarbaManager;
