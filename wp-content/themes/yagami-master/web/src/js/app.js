/*
|
| Importing Libs & dependancies
|--------------------------------
*/
import Swiper from 'swiper/dist/js/swiper.min';
require('../lib/iziModal/js/iziModal.js')($); //désolé

/*
|
| Importing Animations libs
|----------------------------
*/
import * as PIXI 	from 'pixi.js';
import { TweenMax } from "gsap/TweenMax";
import TimelineMax from "gsap/TimelineMax";
import SplitText from "../lib/gsap-pro/SplitText";
import ScrollTo from "gsap/ScrollToPlugin";
import 'scrollmagic/scrollmagic/uncompressed/plugins/animation.gsap.js';
import 'scrollmagic/scrollmagic/uncompressed/plugins/jquery.ScrollMagic.js';
import 'scrollmagic/scrollmagic/uncompressed/plugins/debug.addIndicators.js';
import ScrollMagic from 'scrollmagic';
import SubZero from '../lib/subzero/subzero.js';
import Scrollbar from 'smooth-scrollbar';


/*
|
| Importing Utils
|----------------------------
*/
import './utils/fa';
import Router from './utils/router.js';

/*
|
| Importing App files
|----------------------
*/
import * as app from './components/global.js';
import main from './pages/main.js';
import home from './pages/home.js';
import projets from './pages/projets.js';

/*
|
| Routing
|----------
*/
const routes = new Router([
	{
		'file': main, 
		'dependencies': [app]
	},
	{
		'file': home, 
		'dependencies': [app, PIXI],
		'resolve': '#page-home'
	},
	{
		'file': projets, 
		'dependencies': [app, ScrollMagic],
		'resolve': '#page-projets'
	}
]);

/*
|
| Run
|------
*/
(($) => { routes.load() })(jQuery);
