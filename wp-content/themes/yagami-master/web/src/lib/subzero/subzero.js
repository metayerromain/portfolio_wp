/**
|-------------------------------------
| 			SUBZERO v.1.0.0
|-------------------------------------
|
| Copyright (C) Kaitani Riku 2017
| Description: A library to handle Greensock Timelines & ScrollMagic Scenes without coding any line of javascript
|
*/
class SubZero
{
	/**
	|
	| Constructor
	|---------------
	|
	*/
	constructor(params){
		this.params 					= this.initParams(params);
		this.availableFeatures 			= [];
		this.selectors 					= this.initSelectors();
		this.tweenEasings 				= this.initTweenEasings();
		this.effectsConstraints 		= this.initEffectsConstraints();
		this.tweenDefaultsDatas 		= this.initTweenDefaultsDatas();
		this.sceneDefaultOptions 		= this.initSceneDefaultsOptions();
		this.scrollToDefaultOptions 	= this.initScrollToDefaultsOptions();
		this.pinDefaultOptions 			= this.initPinDefaultsOptions();
		this.shortcutsDefaultAmplitudes = this.initShortcutsDefaultAmplitudes();
		this.shortcutsDefaultDurations 	= this.initShortcutsDefaultDurations();
		this.shortcuts 					= {};
		this.timelines 					= {};
		this.scenes 					= {};
		this.splitTextInstances 		= {};
		this.scrollMagicController 		= null;

		this.customShortcutsEnabled() && this.initCustomShortcuts();
	}

	
	/**
	|
	| initParams
	|---------------
	|
	*/
	initParams(params){
		return {
			'shortcuts' : this.isDefined(params.shortcuts) ? params.shortcuts : false,
			'optimize'  : this.isDefined(params.optimize)  ? params.optimize  : false,
			'features' 	: this.isDefined(params.features)  ? params.features  : this.initDefaultFeaturesParams(),
			'plugins'   : this.isDefined(params.plugins)   ? params.plugins   : {},
			'defaults'  : this.isDefined(params.defaults)  ? params.defaults  : {}
		};
	}

	
	/**
	|
	| initDefaultFeatures
	|----------------------
	|
	*/
	initDefaultFeaturesParams(){
		return {
			'onLoadAnimations'   	: false,
			'onScrollAnimations' 	: false,
			'triggerableAnimations' : false,
			'scrollToAnimations' 	: false,
			'pinAnimations' 		: false,
		};
	}

	
	/**
	|
	| initSelectors
	|----------------
	|
	*/
	initSelectors(){
		return {
			'onLoadAnimations'	 	: $('[data-gsap-on="load"]'),
			'onScrollAnimations' 	: $('[data-gsap-on="scroll"]'),
			'pinAnimations' 		: $('[data-gsap-pin]'),
			'triggerableAnimations' : $('[data-gsap-on="trigger"]'),
			'scrollToAnimations' 	: $('[data-gsap-scroll-to]'),
			'timelineItem'		 	: '[data-gsap-item]',
			'staggerItem'		 	: '[data-gsap-stagger-item]',
			'fadeInItems' 		 	: $('[data-gsap-effect^="fadeIn"], [data-gsap-shortcut^="fadeIn"]')
		};
	}

	
	/**
	|
	| initTweenEasings
	|--------------------
	|
	*/
	initTweenEasings(){
		return {
			'power0' : Power0,
			'power1' : Power1,
			'power2' : Power2,
			'power3' : Power3,
			'power4' : Power4,
			'back' 	 : Back,
			'elastic': Elastic,
			'bounce' : Bounce,
			'circ' 	 : Circ,
			'expo' 	 : Expo,
			'sine' 	 : Sine
		};
	}

	
	/**
	|
	| initEffectsConstraints
	|-------------------------
	|
	*/
	initEffectsConstraints(){
		return {
			'custom': [],
			'fadeIn': [],
			'fadeOut': [],
			'fadeInUp': ['amplitude'],
			'fadeInDown': ['amplitude'],
			'fadeInLeft': ['amplitude'],
			'fadeInRight': ['amplitude'],
			'fadeOutUp': ['amplitude'],
			'fadeOutDown': ['amplitude'],
			'fadeOutLeft': ['amplitude'],
			'fadeOutRight': ['amplitude'],
			'slideInUp': ['amplitude'],
			'slideInDown': ['amplitude'],
			'slideInLeft': ['amplitude'],
			'slideInRight': ['amplitude'],
			'slideOutUp': ['amplitude'],
			'slideOutDown': ['amplitude'],
			'slideOutLeft': ['amplitude'],
			'slideOutRight': ['amplitude'],
			'scaleInUp': [],
			'scaleInDown': [],
			'scaleInLeft': [],
			'scaleInRight': [],
			'scaleOutUp': [],
			'scaleOutDown': [],
			'scaleOutLeft': [],
			'scaleOutRight': []
		}
	}

	
	/**
	|
	| initShortcutsDefaultAmplitudes
	|---------------------------------
	|
	*/
	initShortcutsDefaultAmplitudes(){
		return {
			'small'  : { lv1: 5,   lv2: 10,  lv3: 15,  lv4: 20  },
			'medium' : { lv1: 30,  lv2: 40,  lv3: 50,  lv4: 60  },
			'large'  : { lv1: 80,  lv2: 100, lv3: 120, lv4: 140 },
			'wide'   : { lv1: 200, lv2: 300, lv3: 400, lv4: 500 }
		};
	}

	
	/**
	|
	| initShortcutsDefaultDurations
	|--------------------------------
	|
	*/
	initShortcutsDefaultDurations(){
		return {
			'power1' : {
				'easeOut' 	: {
					'with_amplitude' : {
						'small'  : { lv1: 0.2, lv2: 0.4, lv3: 0.6, lv4: 0.8 },
						'medium' : { lv1: 1,   lv2: 1.2, lv3: 1.4, lv4: 1.6 },
						'large'  : { lv1: 1.8, lv2: 2,   lv3: 2.2, lv4: 2.4 },
						'wide'   : { lv1: 3,   lv2: 4,   lv3: 5,   lv4: 6 }
					},
					'no_amplitude' : {
						'fast' 		: { lv1: 0.2, lv2: 0.4, lv3: 0.6, lv4: 0.8 },
						'normal' 	: { lv1: 1,   lv2: 1.2, lv3: 1.4, lv4: 1.6 },
						'slow' 		: { lv1: 1.8, lv2: 2,   lv3: 2.2, lv4: 2.4 },
						'very_slow' : { lv1: 3,   lv2: 4,   lv3: 5,   lv4: 6 }
					}
				},
			},
			'power2' : {
				'easeOut' 	: {
					'with_amplitude' : {
						'small'  : { lv1: 0.2, lv2: 0.4, lv3: 0.6, lv4: 0.8 },
						'medium' : { lv1: 1,   lv2: 1.2, lv3: 1.4, lv4: 1.6 },
						'large'  : { lv1: 1.8, lv2: 2,   lv3: 2.2, lv4: 2.4 },
						'wide'   : { lv1: 3,   lv2: 4,   lv3: 5,   lv4: 6 }
					},
					'no_amplitude' : {
						'fast' 		: { lv1: 0.2, lv2: 0.4, lv3: 0.6, lv4: 0.8 },
						'normal' 	: { lv1: 1,   lv2: 1.2, lv3: 1.4, lv4: 1.6 },
						'slow' 		: { lv1: 1.8, lv2: 2,   lv3: 2.2, lv4: 2.4 },
						'very_slow' : { lv1: 3,   lv2: 4,   lv3: 5,   lv4: 6 }
					}
				},
			},
			'power3' : {
				'easeOut' 	: {
					'with_amplitude' : {
						'small'  : { lv1: 0.2, lv2: 0.4, lv3: 0.6, lv4: 0.8 },
						'medium' : { lv1: 1,   lv2: 1.2, lv3: 1.4, lv4: 1.6 },
						'large'  : { lv1: 1.8, lv2: 2,   lv3: 2.2, lv4: 2.4 },
						'wide'   : { lv1: 3,   lv2: 4,   lv3: 5,   lv4: 6 }
					},
					'no_amplitude' : {
						'fast' 		: { lv1: 0.2, lv2: 0.4, lv3: 0.6, lv4: 0.8 },
						'normal' 	: { lv1: 1,   lv2: 1.2, lv3: 1.4, lv4: 1.6 },
						'slow' 		: { lv1: 1.8, lv2: 2,   lv3: 2.2, lv4: 2.4 },
						'very_slow' : { lv1: 3,   lv2: 4,   lv3: 5,   lv4: 6 }
					}
				},
			},
			'power4' : {
				'easeOut' 	: {
					'with_amplitude' : {
						'small'  : { lv1: 0.2, lv2: 0.4, lv3: 0.6, lv4: 0.8 },
						'medium' : { lv1: 1,   lv2: 1.2, lv3: 1.4, lv4: 1.6 },
						'large'  : { lv1: 1.8, lv2: 2,   lv3: 2.2, lv4: 2.4 },
						'wide'   : { lv1: 3,   lv2: 4,   lv3: 5,   lv4: 6 }
					},
					'no_amplitude' : {
						'fast' 		: { lv1: 0.2, lv2: 0.4, lv3: 0.6, lv4: 0.8 },
						'normal' 	: { lv1: 1,   lv2: 1.2, lv3: 1.4, lv4: 1.6 },
						'slow' 		: { lv1: 1.8, lv2: 2,   lv3: 2.2, lv4: 2.4 },
						'very_slow' : { lv1: 3,   lv2: 4,   lv3: 5,   lv4: 6 }
					}
				},
			},
			'back' : {
				'easeOut' 	: {
					'with_amplitude' : {
						'small'  : { lv1: 0.2, lv2: 0.4, lv3: 0.6, lv4: 0.8 },
						'medium' : { lv1: 1,   lv2: 1.2, lv3: 1.4, lv4: 1.6 },
						'large'  : { lv1: 1.8, lv2: 2,   lv3: 2.2, lv4: 2.4 },
						'wide'   : { lv1: 3,   lv2: 4,   lv3: 5,   lv4: 6 }
					},
					'no_amplitude' : {
						'fast' 		: { lv1: 0.2, lv2: 0.4, lv3: 0.6, lv4: 0.8 },
						'normal' 	: { lv1: 1,   lv2: 1.2, lv3: 1.4, lv4: 1.6 },
						'slow' 		: { lv1: 1.8, lv2: 2,   lv3: 2.2, lv4: 2.4 },
						'very_slow' : { lv1: 3,   lv2: 4,   lv3: 5,   lv4: 6 }
					}
				},
			},
			'elastic' : {
				'easeOut' 	: {
					'with_amplitude' : {
						'small'  : { lv1: 0.2, lv2: 0.4, lv3: 0.6, lv4: 0.8 },
						'medium' : { lv1: 1,   lv2: 1.2, lv3: 1.4, lv4: 1.6 },
						'large'  : { lv1: 1.8, lv2: 2,   lv3: 2.2, lv4: 2.4 },
						'wide'   : { lv1: 3,   lv2: 4,   lv3: 5,   lv4: 6 }
					},
					'no_amplitude' : {
						'fast' 		: { lv1: 0.2, lv2: 0.4, lv3: 0.6, lv4: 0.8 },
						'normal' 	: { lv1: 1,   lv2: 1.2, lv3: 1.4, lv4: 1.6 },
						'slow' 		: { lv1: 1.8, lv2: 2,   lv3: 2.2, lv4: 2.4 },
						'very_slow' : { lv1: 3,   lv2: 4,   lv3: 5,   lv4: 6 }
					}
				},
			},
			'bounce' : {
				'easeOut' 	: {
					'with_amplitude' : {
						'small'  : { lv1: 0.2, lv2: 0.4, lv3: 0.6, lv4: 0.8 },
						'medium' : { lv1: 1,   lv2: 1.2, lv3: 1.4, lv4: 1.6 },
						'large'  : { lv1: 1.8, lv2: 2,   lv3: 2.2, lv4: 2.4 },
						'wide'   : { lv1: 3,   lv2: 4,   lv3: 5,   lv4: 6 }
					},
					'no_amplitude' : {
						'fast' 		: { lv1: 0.2, lv2: 0.4, lv3: 0.6, lv4: 0.8 },
						'normal' 	: { lv1: 1,   lv2: 1.2, lv3: 1.4, lv4: 1.6 },
						'slow' 		: { lv1: 1.8, lv2: 2,   lv3: 2.2, lv4: 2.4 },
						'very_slow' : { lv1: 3,   lv2: 4,   lv3: 5,   lv4: 6 }
					}
				},
			},
			'slowmo' : {
				'easeOut' 	: {
					'with_amplitude' : {
						'small'  : { lv1: 0.2, lv2: 0.4, lv3: 0.6, lv4: 0.8 },
						'medium' : { lv1: 1,   lv2: 1.2, lv3: 1.4, lv4: 1.6 },
						'large'  : { lv1: 1.8, lv2: 2,   lv3: 2.2, lv4: 2.4 },
						'wide'   : { lv1: 3,   lv2: 4,   lv3: 5,   lv4: 6 }
					},
					'no_amplitude' : {
						'fast' 		: { lv1: 0.2, lv2: 0.4, lv3: 0.6, lv4: 0.8 },
						'normal' 	: { lv1: 1,   lv2: 1.2, lv3: 1.4, lv4: 1.6 },
						'slow' 		: { lv1: 1.8, lv2: 2,   lv3: 2.2, lv4: 2.4 },
						'very_slow' : { lv1: 3,   lv2: 4,   lv3: 5,   lv4: 6 }
					}
				},
			},
			'circ' : {
				'easeOut' 	: {
					'with_amplitude' : {
						'small'  : { lv1: 0.2, lv2: 0.4, lv3: 0.6, lv4: 0.8 },
						'medium' : { lv1: 1,   lv2: 1.2, lv3: 1.4, lv4: 1.6 },
						'large'  : { lv1: 1.8, lv2: 2,   lv3: 2.2, lv4: 2.4 },
						'wide'   : { lv1: 3,   lv2: 4,   lv3: 5,   lv4: 6 }
					},
					'no_amplitude' : {
						'fast' 		: { lv1: 0.2, lv2: 0.4, lv3: 0.6, lv4: 0.8 },
						'normal' 	: { lv1: 1,   lv2: 1.2, lv3: 1.4, lv4: 1.6 },
						'slow' 		: { lv1: 1.8, lv2: 2,   lv3: 2.2, lv4: 2.4 },
						'very_slow' : { lv1: 3,   lv2: 4,   lv3: 5,   lv4: 6 }
					}
				},
			},
			'expo' : {
				'easeInOut' : {
					'with_amplitude' : {
						'small'  : { lv1: 0.2, lv2: 0.4, lv3: 0.6, lv4: 0.8 },
						'medium' : { lv1: 1,   lv2: 1.2, lv3: 1.4, lv4: 1.6 },
						'large'  : { lv1: 1.8, lv2: 2,   lv3: 2.2, lv4: 2.4 },
						'wide'   : { lv1: 3,   lv2: 4,   lv3: 5,   lv4: 6 }
					},
					'no_amplitude' : {
						'fast' 		: { lv1: 0.2, lv2: 0.4, lv3: 0.6, lv4: 0.8 },
						'normal' 	: { lv1: 1,   lv2: 1.2, lv3: 1.4, lv4: 1.6 },
						'slow' 		: { lv1: 1.8, lv2: 2,   lv3: 2.2, lv4: 2.4 },
						'very_slow' : { lv1: 3,   lv2: 4,   lv3: 5,   lv4: 6 }
					}
				},
			},
			'sine' : {
				'easeOut' 	: {
					'with_amplitude' : {
						'small'  : { lv1: 0.2, lv2: 0.4, lv3: 0.6, lv4: 0.8 },
						'medium' : { lv1: 1,   lv2: 1.2, lv3: 1.4, lv4: 1.6 },
						'large'  : { lv1: 1.8, lv2: 2,   lv3: 2.2, lv4: 2.4 },
						'wide'   : { lv1: 3,   lv2: 4,   lv3: 5,   lv4: 6 }
					},
					'no_amplitude' : {
						'fast' 		: { lv1: 0.2, lv2: 0.4, lv3: 0.6, lv4: 0.8 },
						'normal' 	: { lv1: 1,   lv2: 1.2, lv3: 1.4, lv4: 1.6 },
						'slow' 		: { lv1: 1.8, lv2: 2,   lv3: 2.2, lv4: 2.4 },
						'very_slow' : { lv1: 3,   lv2: 4,   lv3: 5,   lv4: 6 }
					}
				},
			}
		};
	}

	
	/**
	|
	| initTweenDefaultsDatas
	|--------------------------
	|
	*/
	initTweenDefaultsDatas(){
		return this.getFilteredDefaultsParams(this.params.defaults.tweenParams, {
			'tween-type' 	   : 'fromTo',
			'start' 		   : '-=0.6',
			'duration' 		   : 0.8,
			'amplitude' 	   : 100,
			'easing' 	   	   : 'power1.easeOut',
			'stagger-delay'    : 0.15,
			'split-text-delay' : { 'chars': 0.02, 'words': 0.25 },
			'split-text' 	   : 'chars'
		});
	}

	
	/**
	|
	| initSceneDefaultsOptions
	|---------------------------
	|
	*/
	initSceneDefaultsOptions(){
		return this.getFilteredDefaultsParams(this.params.defaults.sceneParams, {
			'trigger-hook' : 'onEnter',
			'reverse' 	  : true
		});
	}

	
	/**
	|
	| initSceneDefaultsOptions
	|---------------------------
	|
	*/
	initScrollToDefaultsOptions(){
		return this.getFilteredDefaultsParams(this.params.defaults.scrollToParams, {
			'container' : window,
			'duration'  : 1,
			'easing' 	: 'power1.easeOut',
			'minus' 	: 0,
			'plus' 		: 0
		});
	}


	/**
	|
	| pinDefaultsOptions
	|---------------------------
	|
	*/
	initPinDefaultsOptions() {
		return this.getFilteredDefaultsParams(this.params.defaults.pinParams, {
			'trigger-hook': 'onLeave',
			'offset': false,
			'end': false
		});
	}

	
	/**
	|
	| getFilteredDefaultsParams
	|----------------------------
	|
	*/
	getFilteredDefaultsParams(paramsDefaults, defaults){
		var _this = this;
		var fiteredDefautlsParams = {};

		if(this.isDefined(paramsDefaults) && !this.isEmptyObject(paramsDefaults)){
			$.each(defaults, function(param, value){
				var paramValue = _this.isDefined(paramsDefaults[param]) ? paramsDefaults[param] : value;
				fiteredDefautlsParams[param] = paramValue;
			});
		} else {
			fiteredDefautlsParams = defaults
		}

		return fiteredDefautlsParams;
	}

	
	/**
	|
	| init
	|-------
	|
	*/
	init(){
		this.initFeatures();
	}

	
	/**
	|
	| initFeatures
	|---------------
	|
	*/
	initFeatures(){
		if(this.isAvailableFeature('onLoadAnimations')){
			this.initFeature('onLoadAnimations', 'runOnLoadAnimations');
		}
		if(this.isAvailableFeature('onScrollAnimations')){
			this.initFeature('onScrollAnimations', 'runOnScrollAnimations', ['scrollmagic']);
		}
		if (this.isAvailableFeature('pinAnimations')) {
			this.initFeature('pinAnimations', 'runPinAnimations', ['scrollmagic']);
		}
		if(this.isAvailableFeature('triggerableAnimations')){
			this.initFeature('triggerableAnimations', 'runTriggerableAnimations');
		}
		if(this.isAvailableFeature('scrollToAnimations')){
			this.initFeature('scrollToAnimations', 'runScrollToAnimations');
		}

		this.control(this.availableFeatures.length > 0, this.getMessage('noFeatureActivated'));
	}

	
	/**
	|
	| initFeature
	|--------------
	|
	*/
	initFeature(feature, callback, dependencies = null){
		var params 	  = this.params;
		var $selector = this.selectors[feature]
		var params    = this.isDefined($selector) ? [$selector] : [];

		if(dependencies === null){
			this[callback].apply(this, params);
		} else {
			if(this.dependenciesAvailable(feature, dependencies)){
				this[callback].apply(this, this.getFeatureParams(feature, dependencies));
			}
		}

		this.availableFeatures.push(feature);
	}

	
	/**
	|
	| getFeatureParams
	|-------------------
	|
	*/
	getFeatureParams(feature, dependencies){
		var _this 		  = this;
		var featureParams = [this.selectors[feature]];

		dependencies.map(function(dependency){
			featureParams.push(_this.params.plugins[dependency]);
		});

		return featureParams;
	}

	
	/**
	|
	| initCustomShortcuts
	|----------------------
	|
	*/
	initCustomShortcuts(){
		var _this 	   = this;
		var object 	   = {};
		var durations  = this.shortcutsDefaultDurations;
		
		$.each(this.effectsConstraints, function(effect, constraint){
			if(effect !== "custom"){
				$.each(durations, function(easeKey, config){
					var easeType 	  = easeKey != 'expo' ? 'easeOut' : 'easeInOut';
					var easing   	  = easeKey + '.' + easeType;
					var withAmplitude = _this.inArray('amplitude', constraint);

					_this.addCustomShortcut(object, durations, effect, easeKey, withAmplitude);
				});
			}
		});

		this.shortcuts = object;
	}

	
	/**
	|
	| addCustomShortcut
	|--------------------
	|
	*/
	addCustomShortcut(object, durations, effect, easeKey, withAmplitude = true){
		var _this 		  = this;
		var amplitudes 	  = this.shortcutsDefaultAmplitudes;
		var easeType 	  = easeKey != 'expo' ? 'easeOut' : 'easeInOut';
		var objectToParse = withAmplitude ? amplitudes : durations[easeKey][easeType]['no_amplitude'];

		$.each(objectToParse, function(key, value){
			$.each(value, function(k, v){
				var shortcutName = effect + '.' + easeKey + '.' + key + '.' + k;
				var duration 	 = withAmplitude ? durations[easeKey][easeType]['with_amplitude'][key][k] : v;

				object[shortcutName] = {
					'effect'     : effect,
					'duration' 	 : duration,
					'easing' 	 : easeKey + '.' + easeType,
					'tween-type' : 'fromTo',
					'start' 	 : '-=0.8'
				};

				if(withAmplitude){
					object[shortcutName]['amplitude'] = v;
				}				
			});
		});
	}

	
	/**
	|
	| addShortcut
	|--------------
	|
	*/
	addShortcut(shortcutName, datas = {}){
		var splittedShortcutName = shortcutName.split('.');

		if(this.isValidShortcutName(shortcutName)){
			if(this.shortcutHasRequiredDatas(datas, splittedShortcutName[0], shortcutName)){
				this.addDefaultRequiredDatas(datas, splittedShortcutName[0]);
				this.shortcuts[shortcutName] = datas;
			}			
		}
	}

	
	/**
	|
	| addShortcutFrom
	|------------------
	|
	*/
	addShortcutFrom(baseShortcut, shortcutName, datas = {}){
		var base = this.shortcuts[baseShortcut];

		if(this.isValidShortcutName(shortcutName)){
			if(this.baseShortcutExist(baseShortcut, shortcutName)){
				this.shortcuts[shortcutName] = Object.assign(base, datas);
			}
		}
	}


	
	/**
	|
	| addDefaultRequiredDatas
	|--------------------------
	|
	*/
	addDefaultRequiredDatas(datas, effect){
		var _this = this;
		var defaultsRequiredDatas = ['start', 'tween-type'];

		defaultsRequiredDatas.map(function(data){
			!_this.isDefined(datas[data]) && (datas[data] = _this.tweenDefaultsDatas[data]);
		});

		datas['effect'] = effect;
	}


	/**
	|
	| initTimelines
	|----------------
	|
	*/
	initTimelines($selector, timelineParams = {}, autoplay = true){
		var _this = this;

		$.each($selector, function(){
			var $selector = $(this);

			if(_this.canInitTimeline($selector)){
				var timelineName = _this.getTimelineName($selector);
				var timeline 	 = _this.setTimeline(timelineName, timelineParams, $selector);

				_this.callTimelineGenerator({ 'selector': $selector, 'timeline': timeline, 'timelineName': timelineName });

				autoplay && timeline.play();
			}
		});
	}

	
	/**
	|
	| runOnLoadAnimations
	|----------------------
	|
	*/
	runOnLoadAnimations($selector){
		this.initTimelines($selector);
	}

	
	/**
	|
	| runOnScrollAnimations
	|------------------------
	|
	*/
	//TODO: Pour les timeline en pause par défaut, prévoir une method subZero.TriggerOnScroll(timeline, {triggerHook, ...}) pour lancer une timeline specifique au scroll depuis l'extérieure de la lib 
	runOnScrollAnimations($selector, ScrollMagic){
		var _this 	    = this;
		var controller  = this.getScrollMagicController(ScrollMagic);
		var scenes 	    = [];

		$.each($selector, function(){
			scenes.push(_this.createScene($(this), ScrollMagic));
		});

		controller.addScene(scenes);
	}

	
	/**
	|
	| getScrollMagicController
	|---------------------------
	|
	*/
	getScrollMagicController(ScrollMagic){
		if(this.scrollMagicController === null){
			this.scrollMagicController = new ScrollMagic.Controller();
		}

		return this.scrollMagicController;
	}

	
	/**
	|
	| createScene
	|--------------
	|
	*/
	createScene($selector, ScrollMagic){
		var scene = null;

		if(this.canInitTimeline($selector)){
			var timelineName = this.getTimelineName($selector);
			var timeline 	 = this.setTimeline(timelineName, { paused: false, revert: false }, $selector);
			var options 	 = this.getSceneOptions($selector);

			this.callTimelineGenerator({ 'selector': $selector, 'timeline': timeline, 'timelineName': timelineName });
			scene = new ScrollMagic.Scene(options).setTween(timeline);
			this.registerScene(timelineName, scene);
		}

		return scene;
	}

	
	/**
	|
	| registerScene
	|-------------------
	|
	*/
	registerScene(timelineName, scene){
		this.scenes[timelineName] = scene;
	}

	
	/**
	|
	| getSceneOptions
	|------------------
	|
	*/
	getSceneOptions($selector){
		var _this 		 = this;
		var returnObject = {};
		var params 		 = ['trigger-hook', 'reverse'];
		
		params.map(function(param){
			returnObject[param] = _this.getFilteredSceneOption(param, $selector.data('gsap-scene-' + param))
		});

		returnObject.triggerElement = $selector;
		returnObject.triggerHook = returnObject['trigger-hook'];

		delete returnObject['trigger-hook'];

		return returnObject;
	}

	
	/**
	|
	| getFilteredSceneOption
	|-------------------------
	|
	*/
	getFilteredSceneOption(optionName, option){
		return this.isDefined(option) ? option : this.sceneDefaultOptions[optionName];
	}

	/**
	|
	| runPinAnimations
	|-------------------
	|
	*/
	runPinAnimations($selector, ScrollMagic) {
		var _this = this;
		var controller = this.getScrollMagicController(ScrollMagic);
		var scenes = [];

		$.each($selector, function () {
			scenes.push(_this.createPinScene($(this), ScrollMagic));
		});

		controller.addScene(scenes);
	}


	/**
	|
	| createPinScene
	|-------------------
	|
	*/
	createPinScene($selector, ScrollMagic) {
		var options = this.getPinOptions($selector);

		return new ScrollMagic.Scene(options).setClassToggle($selector, 'pinned').setPin($selector, { pushFollowers: false });
	}

	/**
	|
	| getPinOptions
	|----------------
	|
	*/
	getPinOptions($selector){
		var _this      = this
		var options    = {};
		var gsapPinEnd = $selector.data('gsap-pin-end');
		var params 	   = [
			{
				data: 'trigger-hook', 
				name: 'triggerHook'
			},
			{
				data: 'offset', 
				name: 'offset'
			}
		];

		params.map(function (option) {
			var data = $selector.data('gsap-pin-' + option.data);

			options[option.name] = _this.getFilteredPinOption(option.data, data);
		});


		if (this.isDefined(gsapPinEnd)){
			if (this.pinEndExist(gsapPinEnd)) {
				var start    = $selector.offset().top;
				var end      = $(gsapPinEnd).offset().top;
				var duration = parseInt(end - start - $selector.height());

				options.duration = duration;
			}
		}

		options.triggerElement = $selector

		return options;
	}


	/**
	|
	| getFilteredPinOption
	|-----------------------
	|
	*/
	getFilteredPinOption(dataName, data) {
		return this.isDefined(data) ? data : this.pinDefaultOptions[dataName];
	}


	/**
	|
	| runTriggerableAnimations
	|---------------------------
	|
	*/
	runTriggerableAnimations($selector){
		this.initTimelines($selector, { paused: true, revert: false }, false);
	}

	
	/**
	|
	| runScrollToAnimations
	|------------------------
	|
	*/
	runScrollToAnimations($selector){
		var _this = this;

		$selector.on('click', function(e){
			e.preventDefault();
			var $btn   = $(this);
			var target = $btn.data('gsap-scroll-to');
	
			if(_this.scrollToTargetExist(target, $btn)){
				var $target = $(target);
				var options = _this.getScrollToOptions($btn);
				var minus   = options.minus;
				var plus    = options.plus;

				if(minus !== 0 || plus !== 0){
					target = $target.offset().top - minus + plus;
				}
			}

			TweenMax.to(options.container, options.duration, {scrollTo: target, ease: options.easing});
		});
	}

	
	/**
	|
	| getScrollToOptions
	|---------------------
	|
	*/
	getScrollToOptions($selector){
		var _this 		 = this;
		var returnObject = {};
		var params 		 = [
			'container',
			'duration',
			'easing',
			'minus',
			'plus'
		];

		params.map(function(param){
			var data = $selector.data('gsap-scroll-to-' + param);

			if(param != 'easing'){
				returnObject[param] = _this.getFilteredScrollToParam(param, data);
			} else {
				returnObject[param] = _this.getFilteredEasing(data, $selector, _this.scrollToDefaultOptions);
			}
		});

		return returnObject;
	}

	
	/**
	|
	| getFilteredScrollToParam
	|---------------------------
	|
	*/
	getFilteredScrollToParam(dataName, data){
		return this.isDefined(data) ? data : this.scrollToDefaultOptions[dataName];
	}

	
	/**
	|
	| getTimelineName
	|------------------
	|
	*/
	getTimelineName($selector){
		return String($selector.data('gsap-timeline'));
	}

	
	/**
	|
	| setTimeline
	|--------------
	|
	*/
	setTimeline(timelineName, params = {}, $selector) {
		//TODO: set data-gsap-paused
		var _this  = this;
		var paused = params.paused === false ? false : true;
		var revert = params.revert === false ? false : false;
		var timeline;

		this.splitTextInstances[timelineName] = [];

		timeline = new TimelineMax({
			paused: paused,
			onComplete: function(){ revert && _this.revertTimelineSplitTextInstances(timelineName) },
			onUpdate: function(e) {
				_this.dispachEvent($selector, 'subzero:timelineUpdate', _this.setEventUpdateParams(this));
			}
		});

		_this.registerTimeline(timelineName, timeline);

		return timeline;
	}

	
	/**
	|
	| revertTimelineSplitTextInstances
	|-----------------------------------
	|
	*/
	revertTimelineSplitTextInstances(timelineName){
		this.splitTextInstances[timelineName].map(function(splitTextInstances){
			splitTextInstances.revert();
		});
	}

	
	/**
	|
	| registerTimeline
	|-------------------
	|
	*/
	registerTimeline(timelineName, timeline){
		this.timelines[timelineName] = timeline;
	}

	
	/**
	|
	| callTimelineGenerator
	|------------------------
	|
	*/
	callTimelineGenerator(params){
		var _this 		 = this;
		var $selector  	 = params.selector;
		var timeline 	 = params.timeline;
		var timelineName = params.timelineName
		var firstTween 	 = true;

		TweenMax.set(this.selectors.fadeInItems, {autoAlpha: 1});
		
		if(this.isAnimatedSelector($selector)){
			this.setTimelineTween($selector, timelineName, this.setTweenOptions(timeline, $selector, firstTween));
			firstTween = false;
		}

		$.each($selector.find(this.selectors.timelineItem), function(){
			_this.setTimelineTween($selector, timelineName, _this.setTweenOptions(timeline, $(this), firstTween));
			firstTween = false;
		});

		this.triggerEventComplete(timeline, $selector);
	}

	
	/**
	|
	| setTweenOptions
	|------------------
	|
	*/
	setTweenOptions(timeline, $selector, firstTween){
		return {
			'timeline'	 : timeline,
			'item'		 : $selector,
			'firstTween' : firstTween
		};
	}

	
	/**
	|
	| setTimelineTween
	|-------------------
	|
	*/
	setTimelineTween($selector, timelineName, options){
		var 
			timeline   	= options.timeline,
			$item 	   	= options.item,
			firstTween 	= options.firstTween,
			hasStart 	= this.isDefined($item.data('gsap-start')),
			datas 		= this.setTweenDatas($item),
			tweenDatas  = datas.tweenDatas,
			isStagger 	= datas.isStagger,
			isSplitText = datas.isSplitText,
			$tweenItem 	= this.setTweenItem($item, isStagger, isSplitText, tweenDatas['split-text'], timelineName),
			objects 	= this.setTweenObjects(tweenDatas, $item),
			start 		= firstTween && !hasStart ? 'start' : tweenDatas.start,
			tweenParams = this.getTweenParams($tweenItem, tweenDatas, objects, start),
			tweenFunc   = this.getTweenFunc(tweenDatas['tween-type'], isStagger, isSplitText)
		;

		if(firstTween){
			this.triggerEventStart(timeline, $selector, start);
		}

		timeline[tweenFunc].apply(timeline, tweenParams);
	}

	
	/**
	|
	| setTweenItem
	|---------------
	|
	*/
	setTweenItem($item, isStagger, isSplitText, splitTextType, timelineName){
		var $tweenItem = $item;

		if(isStagger){
			$tweenItem = $item.find(this.selectors.staggerItem);
		} else if (isSplitText){
			var splitTweenItem = new SplitText($item, {type: 'lines, words, chars'});
			$tweenItem = splitTweenItem[splitTextType];

			this.registerSplitTextInstance(timelineName, splitTweenItem)
		}

		return $tweenItem;
	}

	
	/**
	|
	| registerSplitTextInstance
	|----------------------------
	|
	*/
	registerSplitTextInstance(timelineName, splitTweenItem){
		this.splitTextInstances[timelineName].push(splitTweenItem);
	}

	
	/**
	|
	| setTweenDatas
	|----------------
	|
	*/
	setTweenDatas($item){
		var _this 		 = this;
		var datas 	   	 = $item.data();
		var effect     	 = datas.gsapEffect;
		var shortcut   	 = datas.gsapShortcut;
		var extrasFrom   = datas.gsapExtrasFrom;
		var extrasTo     = datas.gsapExtrasTo;
		var extras 		 = {};
		var returnObject = {};

		if(this.haveEffect(effect, shortcut, $item)){
			if(this.isShortcut($item)){
				if(this.shortcutExist(shortcut, $item)){
					returnObject = this.getShortcutDatas($item, shortcut);
				}
			} else {
				if(this.effectExist(effect, $item)){
					var deletableDatas = this.getDeletableTweenDatas($item, effect);
					returnObject = this.getTweenDatas($item, deletableDatas);
				}
			}

			extras = extrasFrom || extrasTo ? this.getExtrasDatas(extrasFrom, extrasTo) : {};
		}

		var tweenDatas = this.isNotEmptyObject(extras) ? Object.assign(returnObject, extras) : returnObject;

		return {
			'tweenDatas'  : tweenDatas,
			'isStagger'	  : this.isDefined(returnObject['stagger-delay']),
			'isSplitText' : this.isDefined(returnObject['split-text'])
		};
	}

	
	/**
	|
	| getShortcutDatas
	|-------------------
	|
	*/
	getShortcutDatas($item, shortcut){
		var _this   	 = this;
		var shortcut 	 = this.shortcuts[shortcut];
		var returnObject = {};
		var params   	 = [
			'start',
			'tween-type',
			'duration',
			'stagger-delay',
			'split-text',
			'split-text-delay',
			'amplitude'
		];

		Object.assign(returnObject, shortcut);

		params.map(function(param){
			var data = $item.data('gsap-' + param);

			if(_this.isDefined(data) ){
				returnObject[param] = data;
			}
		});

		returnObject['easing'] = this.getEasing(returnObject['easing']);

		return returnObject;
	}

	
	/**
	|
	| getTweenDatas
	|----------------
	|
	*/
	getTweenDatas($item, deletableDatas){
		var _this   	 	   = this;
		var returnObject 	   = {};
		var dataSplitTextDelay = $item.data('gsap-split-text-delay');
		var params  	 	   = [
			'start',
			'tween-type',
			'duration',
			'stagger-delay',
			'split-text',
			'amplitude'
		];

		params.map(function(param){
			returnObject[param] = _this.getFilteredTweenData(param, $item.data('gsap-' + param));
		});

		returnObject['effect'] = $item.data('gsap-effect');
		returnObject['easing'] = this.getFilteredEasing($item.data('gsap-easing'), $item);
		returnObject['split-text-delay'] = this.getFilteredSplitTextDelay('split-text-delay', dataSplitTextDelay, returnObject['split-text']);

		this.deleteUselessDatas(deletableDatas, returnObject);

		return returnObject;
	}


	/**
	|
	| getExtrasDatas
	|-----------------
	|
	*/
	getExtrasDatas(extrasFrom, extrasTo){
		var extras = { 'extras': {} };

		if(this.isDefined(extrasFrom)){
			extras.extras.from = this.castToJson(extrasFrom);
		}
		if(this.isDefined(extrasTo)){
			extras.extras.to = this.castToJson(extrasTo);
		}
		
		return extras;
	}

	
	/**
	|
	| getFilteredTweenData
	|-----------------------
	|
	*/
	getFilteredTweenData(dataName, data){
		var filteredData = this.isDefined(data) ? data : this.tweenDefaultsDatas[dataName];

		return filteredData;
	}

	
	/**
	|
	| getFilteredEasing
	|--------------------
	|
	*/
	getFilteredEasing(data, $item, paramsArray = null){
		if(this.isDefined(data)){
			if(this.isValidEasing(data, $item)){
				var easingArray = data.split('.');
			}
		} else {
			var parametersArray = paramsArray === null ? this.tweenDefaultsDatas : paramsArray;
			var easingArray 	= parametersArray.easing.split('.');
		}
		
		return this.tweenEasings[easingArray[0]][easingArray[1]];
	}

	
	/**
	|
	| getEasing
	|------------
	|
	*/
	getEasing(easing){
		var splittedEasing = easing.split('.');
		
		return this.tweenEasings[splittedEasing[0]][splittedEasing[1]];
	}

	
	/**
	|
	| getFilteredSplitTextDelay
	|----------------------------
	|
	*/
	getFilteredSplitTextDelay(dataName, data, dataSplitText){
		var filteredData = this.isDefined(data) ? data : this.tweenDefaultsDatas[dataName][dataSplitText];

		return filteredData;
	}

	
	/**
	|
	| getDeletableTweenDatas
	|-------------------------
	|
	*/
	getDeletableTweenDatas($item, effect){
		return {
			'stagger'	: this.isStagger($item),
			'splitText' : this.isSplitText($item),
			'amplitude' : this.effectHasData('amplitude', effect)
		}
	}

	
	/**
	|
	| deleteUselessDatas
	|-------------------------
	|
	*/
	deleteUselessDatas(deletableDatas, returnObject){
		!deletableDatas.amplitude && delete returnObject['amplitude'];
		!deletableDatas.stagger   && delete returnObject['stagger-delay'];
		!deletableDatas.splitText && delete returnObject['split-text'];
		!deletableDatas.splitText && delete returnObject['split-text-delay'];
	}

	
	/**
	|
	| triggerEventStart
	|--------------------
	|
	*/
	triggerEventStart(timeline, $selector, start){
		timeline.addCallback(this.dispachEvent, start, [$selector, 'subzero:timelineStart', this.setEventStartParams(timeline)]);
	}

	
	/**
	|
	| triggerEventComplete
	|-----------------------
	|
	*/
	triggerEventComplete(timeline, $selector){
		timeline.addCallback(this.dispachEvent, 'end', [$selector, 'subzero:timelineComplete', this.setEventCompleteParams(timeline)]);
	}

	
	/**
	|
	| setEventStartParams
	|----------------------
	|
	*/
	setEventStartParams(timeline){
		return {
			subzero: {
				'totalDuration': timeline.totalDuration()
			}
		}
	}


	/**
	|
	| setEventUpdateParams
	|----------------------
	|
	*/
	setEventUpdateParams(timeline) {
		return {
			subzero: {
				'progress': timeline.totalProgress()
			}
		}
	}

	
	/**
	|
	| setEventCompleteParams
	|-------------------------
	|
	*/
	setEventCompleteParams(timeline){
		return {
			subzero: {
				'totalDuration': timeline.totalDuration()
			}
		}
	}

	
	/**
	|
	| setTweenObjects
	|------------------
	|
	*/
	setTweenObjects(datas, $item){
		var effect 		 = datas.effect;
		var tweenType 	 = datas['tween-type'];
		var amplitude 	 = datas.amplitude;
		var easing 		 = datas.easing;
		var origin       = null;
		
		switch(effect) {
			case 'custom':
				var from = {};
				var to 	 = { ease: easing };
				break;

			case 'fadeIn':
				var from = { autoAlpha: 0 };
				var to 	 = { autoAlpha: 1, ease: easing };
				break;

			case 'fadeOut':
				var from = { autoAlpha: 1 };
				var to 	 = { autoAlpha: 0, ease: easing };
				break;

			case 'fadeInUp':
				var from = { y: amplitude, autoAlpha: 0 };
				var to 	 = { y: 0, autoAlpha: 1, ease: easing };
				break;

			case 'fadeInDown':
				var from = { y: -amplitude, autoAlpha: 0 };
				var to 	 = { y: 0, autoAlpha: 1, ease: easing };
				break;

			case 'fadeInLeft':
				var from = { x: amplitude, autoAlpha: 0 };
				var to 	 = { x: 0, autoAlpha: 1, ease: easing };
				break;

			case 'fadeInRight':
				var from = { x: -amplitude, autoAlpha: 0 };
				var to 	 = { x: 0, autoAlpha: 1, ease: easing };
				break;

			case 'fadeOutUp':
				var from = { y: 0, autoAlpha: 1 };
				var to 	 = { y: -amplitude, autoAlpha: 0, ease: easing };
				break;

			case 'fadeOutDown':
				var from = { y: 0, autoAlpha: 1 };
				var to 	 = { y: amplitude, autoAlpha: 0, ease: easing };
				break;

			case 'fadeOutLeft':
				var from = { x: 0, autoAlpha: 1 };
				var to 	 = { x: -amplitude, autoAlpha: 0, ease: easing };
				break;

			case 'fadeOutRight':
				var from = { x: 0, autoAlpha: 1 };
				var to 	 = { x: amplitude, autoAlpha: 0, ease: easing };
				break;

			case 'slideInUp':
				var from = { y: amplitude };
				var to 	 = { y: 0, ease: easing };
				break;

			case 'slideInDown':
				var from = { y: -amplitude };
				var to 	 = { y: 0, ease: easing };
				break;

			case 'slideInLeft':
				var from = { x: amplitude };
				var to 	 = { x: 0, ease: easing };
				break;

			case 'slideInRight':
				var from = { x: -amplitude };
				var to 	 = { x: 0, ease: easing };
				break;

			case 'slideOutUp':
				var from = { y: 0 };
				var to 	 = { y: -amplitude, ease: easing };
				break;

			case 'slideOutDown':
				var from = { y: 0 };
				var to 	 = { y: amplitude, ease: easing };
				break;

			case 'slideOutLeft':
				var from = { x: 0 };
				var to 	 = { x: -amplitude, ease: easing };
				break;

			case 'slideOutRight':
				var from = { x: 0 };
				var to 	 = { x: amplitude, ease: easing };
				break;

			case 'scaleInUp':
				var from   = { scaleY: 0 };
				var to 	   = { scaleY: 1, ease: easing };
				var origin = '0% bottom';

				break;

			case 'scaleInDown':
				var from   = { scaleY: 0 };
				var to 	   = { scaleY: 1, ease: easing };
				var origin = '0% top';
				break;

			case 'scaleInLeft':
				var from   = { scaleX: 0 };
				var to 	   = { scaleX: 1, ease: easing };
				var origin = 'right';
				break;

			case 'scaleInRight':
				var from   = { scaleX: 0 };
				var to 	   = { scaleX: 1, ease: easing };
				var origin = 'left top';
				break;

			case 'scaleOutUp':
				var from   = { scaleY: 1 };
				var to 	   = { scaleY: 0, ease: easing };
				var origin = '0% top';
				break;

			case 'scaleOutDown':
				var from   = { scaleY: 1 };
				var to 	   = { scaleY: 0, ease: easing };
				var origin = '0% bottom';
				break;

			case 'scaleOutLeft':
				var from   = { scaleX: 1 };
				var to 	   = { scaleX: 0, ease: easing };
				var origin = 'left';
				break;

			case 'scaleOutRight':
				var from   = { scaleX: 1 };
				var to 	   = { scaleX: 0, ease: easing };
				var origin = 'right';
				break;
		}

		return this.getFinalTweenObject(from, to, origin, tweenType, datas);
	}

	
	/**
	|
	| getFinalTweenObject
	|----------------------
	|
	*/
	getFinalTweenObject(from, to, origin, tweenType, datas){
		if(tweenType === 'from'){
			from.ease = datas.easing;
			from.transformOrigin = origin;
			this.forceOptimization(from);
		}

		if(tweenType === 'to' || tweenType === 'fromTo'){
			to.transformOrigin = origin;
			this.forceOptimization(to);
		}

		if(this.isDefined(datas.extras)){
			this.mergeExtrasTweenProperties(from, to, datas)
		}
		
		return { 'from': from, 'to': to };
	}

	/**
	|
	| mergeExtrasTweenProperties
	|-----------------------------
	|
	*/
	mergeExtrasTweenProperties(from, to, datas){
		var extraFrom = datas.extras.from;
		var extraTo   = datas.extras.to;

		if(this.isDefined(extraFrom)){
			Object.assign(from, extraFrom);
		}

		if(this.isDefined(extraTo)){
			Object.assign(to, extraTo);
		}
	}

	
	/**
	|
	| forceOptimization
	|--------------------
	|
	*/
	forceOptimization(tweenFunc){
		if(this.params.optimize){
			tweenFunc.transformPerspective = 1000;
			tweenFunc.transformStyle 	   = "preserve-3d";
			tweenFunc.backfaceVisibility   = "hidden";
		}
	}

	
	/**
	|
	| getTweenParams
	|-----------------
	|
	*/
	getTweenParams($tweenItem, datas, objects, start){
		var tweenType 	= datas['tween-type'];
		var tweenParams = [$tweenItem, datas.duration];

		tweenType === 'from'   	  && tweenParams.push(objects.from);
		tweenType === 'to' 	   	  && tweenParams.push(objects.to);
		tweenType === 'fromTo' 	  && tweenParams.push(objects.from);
		tweenType === 'fromTo' 	  && tweenParams.push(objects.to);
		datas['stagger-delay']	  && tweenParams.push(datas['stagger-delay']);
		datas['split-text-delay'] && tweenParams.push(datas['split-text-delay']);
		tweenParams.push(start);

		return tweenParams;
	}

	
	/**
	|
	| getTweenFunc
	|---------------
	|
	*/
	getTweenFunc(tweenType, isStagger, isSplitText){
		var tweenFunc = '';

		if(isStagger || isSplitText){
			tweenFunc += 'stagger'; 
		}
		if(tweenType === 'from' || tweenType === 'fromTo'){
			tweenFunc += tweenFunc === '' ? 'from' : 'From';
		}
		if(tweenType === 'to' || tweenType === 'fromTo') {
			tweenFunc += tweenFunc === '' ? 'to' : 'To';
		}

		return tweenFunc;
	}

	
	/**
	|
	| Helper: customShortcutsEnabled
	|---------------------------------
	|
	*/
	customShortcutsEnabled(){
		return this.params.shortcuts === true;
	}

	
	/**
	|
	| Helper: isAvailableFeature
	|-----------------------------
	|
	*/
	isAvailableFeature(featureName){
		var isAvailable = false;
		var feature 	= this.params.features[featureName];

		if(this.isDefined(feature)){
			isAvailable = feature === true;
		}

		return isAvailable;
	}

	
	/**
	|
	| Helper: dependenciesAvailable
	|--------------------------------
	|
	*/
	dependenciesAvailable(feature, dependencies){
		var _this   = this;
		var missing = '';

		dependencies.map(function(dependency){
			if(!_this.isDefined(_this.params.plugins[dependency])){
				missing += (dependency + ' ');
			}
		});

		return this.control(missing === '', this.getMessage('dependenciesAvailable', feature + ': ' + missing));
	}

	
	/**
	|
	| Helper: canInitTimeline
	|--------------------------
	|
	*/
	canInitTimeline($selector){
		var canInit = false;

		if(this.exist($selector)){
			if(this.isTimeline($selector)){
				if(this.isValidTimeline($selector)){
					canInit = true;
				}
			}
		}

		return canInit;
	}

	
	/**
	|
	| Helper: isTimeline
	|---------------------
	|
	*/
	isTimeline($selector){
		return this.control(this.isDefined($selector.data('gsap-timeline')), this.getMessage('isTimeline'), $selector);
	}

	
	/**
	|
	| Helper: isValidTimeline
	|--------------------------
	|
	*/
	isValidTimeline($selector){
		var dataTimeline = $selector.data('gsap-timeline');
		var isValid = true;
		var message;

		if(dataTimeline !== ''){
			if(this.isDefined(this.timelines[dataTimeline])){
				isValid = false;
				message = this.getMessage('isValidTimelineDuplicate', dataTimeline);
			}
		} else {
			isValid = false;
			message = this.getMessage('isValidTimelineNoName');
		}

		return this.control(isValid, message, $selector);
	}

	
	/**
	|
	| Helper: isShortcut
	|--------------------
	|
	*/
	isShortcut($item){
		return this.isDefined($item.data('gsap-shortcut'));
	}

	
	/**
	|
	| Helper: isStagger
	|--------------------
	|
	*/
	isStagger($item){
		return this.isDefined($item.data('gsap-stagger'));
	}

	
	/**
	|
	| Helper: isSplitText
	|----------------------
	|
	*/
	isSplitText($item){
		return this.isDefined($item.data('gsap-split-text'));
	}

	
	/**
	|
	| Helper: hasData
	|------------------
	|
	*/
	hasData(dataName, $item){
		return this.isDefined($item.data('gsap-' + dataName));
	}

	
	/**
	|
	| Helper: effectHasData
	|------------------------
	|
	*/
	effectHasData(index, effect){
		return this.inArray(index, this.effectsConstraints[effect]);
	}

	
	/**
	|
	| Helper: scrollToTargetExist
	|-----------------------------
	|
	*/
	scrollToTargetExist(target, $selector){
		return this.control(this.exist($(target)), this.getMessage('scrollToTargetExist', target), $selector);
	}


	/**
	|
	| Helper: pinEndExist
	|----------------------
	|
	*/
	pinEndExist(pinEnd){
		return this.control(this.exist($(pinEnd)), this.getMessage('pinEndExist', pinEnd));
	}

	
	/**
	|
	| Helper: invalidEffectAlert
	|-----------------------------
	|
	*/
	invalidEffectAlert(effect, $item){
		this.control(false, this.getMessage('effectExist', effect), $item);
	}

	
	/**
	|
	| Helper: shortcutExist
	|------------------------
	|
	*/
	shortcutExist(shortcut, $item){
		return this.control(this.isDefined(this.shortcuts[shortcut]), this.getMessage('shortcutExist', shortcut), $item);
	}

	
	/**
	|
	| Helper: baseShortcutExist
	|----------------------------
	|
	*/
	baseShortcutExist(baseShortcut, shortcutName){
		return this.control(this.isDefined(this.shortcuts[baseShortcut]), this.getMessage('baseShortcutExist', baseShortcut, shortcutName));
	}

	
	/**
	|
	| Helper: isValidShortcutName
	|------------------------------
	|
	*/
	isValidShortcutName(shortcutName){
		var splitShortcutName = shortcutName.split('.');
		var returns 		  = false;
		var message 		  = ''

		if(splitShortcutName.length > 1){
			var effect = splitShortcutName[0];
			
			if(this.isDefined(this.effectsConstraints[effect])){
				if(!this.isDefined(this.shortcuts[shortcutName])){
					returns = true
				} else {
					message = this.getMessage('shortcutNameAlreadyExist', shortcutName);
				}
			} else {
				message = this.getMessage('shortcutEffectNoExist', effect, shortcutName);
			}
		} else {
			message = this.getMessage('shortcutNameInvalid', shortcutName);
		}

		return this.control(returns, message);
	}

	
	/**
	|
	| Helper: shortcutHasRequiredDatas
	|-----------------------------------
	|
	*/
	shortcutHasRequiredDatas(datas, effect, shortcutName){
		var _this 		  = this;
		var requiredDatas = ['duration', 'easing'];
		var constraints   = this.effectsConstraints[effect];
		var missingDatas  = '';
		
		constraints.map(function(data){
			requiredDatas.push(data);
		});

		requiredDatas.map(function(requiredData){
			if(!_this.isDefined(datas[requiredData])){
				missingDatas += missingDatas === '' ? requiredData : ', ' + requiredData;
			}
		});

		return this.control(missingDatas === '', this.getMessage('shortcutHasRequiredDatas', missingDatas, shortcutName));
	}

	
	/**
	|
	| Helper: effectExist
	|----------------------
	|
	*/
	effectExist(effect, $item){
		return this.control(this.isDefined(this.effectsConstraints[effect]), this.getMessage('effectExist', effect), $item);
	}

	
	/**
	|
	| Helper: isValidEasing
	|------------------------
	|
	*/
	isValidEasing(data, $item){
		return this.control(data.split('.').length === 2, this.getMessage('isValidEasing'), $item);
	}

	
	/**
	|
	| Helper: haveEffect
	|---------------------
	|
	*/
	haveEffect(effect, shortcut, $item){
		return this.control(this.isDefined(effect) || this.isDefined(shortcut), this.getMessage('haveEffect'), $item);
	}

	
	/**
	|
	| Helper: isAnimatedSelector
	|-----------------------------
	|
	*/
	isAnimatedSelector($selector){
		return this.isDefined($selector.data('gsap-effect')) || this.isDefined($selector.data('gsap-shortcut'));
	}


	/**
	|
	| Helper: castToJson
	|---------------------
	|
	*/
	castToJson(fakeObject){
		return JSON.parse(String(fakeObject).replace(/(['"])?([a-z0-9A-Z_]+)(['"])?:/g, '"$2": '));
	}

	
	/**
	|
	| Helper: inArray
	|------------------
	|
	*/
	inArray(needle, haystack){
		return haystack.indexOf(needle) > -1;
	}

	
	/**
	|
	| Helper: isNumber
	|-------------------
	|
	*/
	isNumber(value){
		return parseFloat(value) == value;
	}

	
	/**
	|
	| Helper: isDefined
	|--------------------
	|
	*/
	isDefined(item){
		return typeof item !== 'undefined';
	}

	/**
	|
	| Helper: isNotEmptyObject
	|---------------------------
	|
	*/
	isNotEmptyObject(object){
		return Object.keys(object).length;
	}

	
	/**
	|
	| Helper: isEmptyObject
	|------------------------
	|
	*/
	isEmptyObject(object){
		return Object.keys(object).length === 0;
	}
	

	
	/**
	|
	| Helper: exist
	|----------------
	|
	*/
	exist($item){
		return $item.length;
	}

	
	/**
	|
	| Helper: control
	|------------------
	|
	*/
	control(condition, message, selector = null){
		if(!condition){
			if(selector === null){
				console.error(message);
			} else {
				console.error(message, selector);
			}
		}

		return condition;
	}

	
	/**
	|
	| Helper: dispachEvent
	|-----------------------
	|
	*/
	dispachEvent($element, eventName, datas = null) {
		var event = $.Event(eventName);

		if(datas !== null){
			$.each(datas, function(key, value){
				event[key] = value
			});
		}

		$element.trigger(event);
	}

	
	/**
	|
	| Helper: getMessage
	|---------------------
	|
	*/
	getMessage(messageKey, var1 = '', var2 = ''){
		var messages = {
			'noFeatureActivated' 		 : 'No feature activated, you may have to check if features you have assigned are existing',
			'haveEffect' 				 : 'No effect, nor shortcut assigned to tween item: ',
			'isValidEasing' 			 : 'Invalid easing data has been applied to item: ',
			'effectExist' 		 		 : 'The effect "' + var1 + '" does not exist',
			'shortcutExist' 		     : 'The shortcut "' + var1 + '" does not exist at: ',
			'baseShortcutExist' 		 : 'The base shortcut "' + var1 + '" on top of which you try to create the shortcut "'+ var2 +'" does not exist',
			'shortcutNameAlreadyExist' 	 : 'The shortcut "' + var1 + '" already exist',
			'shortcutEffectNoExist' 	 : 'The effect "' + var1 + '" mentionned in your shortcut "' + var2 + '" does not exist',
			'shortcutNameInvalid' 		 : 'Your shortcut structure "' + var1 + '" is invalid: it have to fit this format: "effect.whatever"',
			'shortcutHasRequiredDatas' 	 : 'To register the shortcut "' + var2 + '", it seems that you forgot to specify the following datas: [' + var1 + ']',
			'scrollToTargetExist' 		 : 'The scrollTo target you specified does not exist: ' + var1 + ' at: ',
			'pinEndExist' 				 : 'The pinEnd element "' + var1 + '" does not exist',
			'isValidTimelineDuplicate' 	 : 'You already have a timeline called ' + var1 + ', rename it at: ',
			'isValidTimelineNoName' 	 : 'It seems that you forgot to give a name to your timeline at: ',
			'isTimeline'				 : 'No [data-gsap-timeline] applied to: ',
			'dependenciesAvailable' 	 : 'Missing plugins to activate feature ' + var1
		};

		return 'Subzero: ' + messages[messageKey];
	}
}

export default SubZero;
