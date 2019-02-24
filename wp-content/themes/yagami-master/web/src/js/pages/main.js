export default {
	init: (app) => {
		app.dump('main.js');


		//=== CURSOR ===//


		$(document).on('mousemove', function(e){
            var posx = e.clientX;
			var posy = e.clientY;
			TweenLite.to($('.second-cursor'),4, {autoAlpha:1, x:posx, y:posy, ease: Elastic.easeOut});
			TweenLite.to($('.cursor'), .1, { autoAlpha:1, x:posx, y:posy, ease: Power1.easeOut })
		})
		$(document).on('mouseout', function(e){
            TweenLite.to($('.cursor'),1.2, {autoAlpha:0});
        })
		$('.link').on('mouseover', function(){
			$('.cursor').toggleClass('linked');
		});
		$('.link').on('mouseout', function(){
			$('.cursor').toggleClass('linked');
		});


		//=== ANIMATION ===//


		$(window).on('load', function(){

			if($('.split').length > 0){
				var splitText = new TimelineMax({paused:true}), 
				mySplitText = new SplitText($('.split'), {type:"words,chars"}), 
				chars = mySplitText.chars; 
		
				splitText.to($('.split'), 0.1,{ autoAlpha:1}, 0.01, "+=0");
				splitText.staggerFromTo(chars, 0.3, {autoAlpha:0, y:20, ease:Back.easeOut},{ autoAlpha:1, y:0}, 0.01, "+=0");
		
				splitText.play();
			}
		})


		//=== HEADER ANIMATION ===//


		var triggered = false;

		var timelineMenu = new TimelineMax({paused: true});
		timelineMenu.staggerFromTo($('.menu-col'), .3, { height: "0", autoAlpha: 0 }, { height: "100vh", autoAlpha: 1 }, .3 );
		timelineMenu.staggerFromTo($('.content-menu'), .4, {autoAlpha: 0}, {autoAlpha: 1}, .3);

		$('.btn-menu').on('click', function(){
			if(!triggered){
				timelineMenu.play();
				triggered = true;
			} else {
				timelineMenu.reverse().timeScale(2);
				triggered = false;
			}
		})
	}
}