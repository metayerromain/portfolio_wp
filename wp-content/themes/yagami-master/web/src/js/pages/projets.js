export default {
	init: (app, ScrollMagic) => {
		app.dump('projet.js');


		//=== ANIMATION ===//

		$(window).on('load', function(){
			console.log('loaded')
		var controller = new ScrollMagic.Controller();

			$('.post-block').each(function(){

				var currentText = $(this).find('.project-text');
				var currentImg = $(this).find('.project-img');
				var currentBtn = $(this).find('.btn');


				var enterArticle = new TimelineMax(), 
				mySplitText = new SplitText(currentText, {type:"words,chars"}), 
				chars = mySplitText.chars; 
				
				enterArticle.to($('.project-text'), 0.1,{ autoAlpha:1}, 0.01, "start");
				enterArticle.staggerFromTo(chars, 0.3, {autoAlpha:0, y:20, ease:Back.easeOut},{ autoAlpha:1, y:0}, 0.01, "start");
				enterArticle.staggerFromTo(currentImg, 1, {autoAlpha: 0, y:20, ease:Back.easeOut}, {y:0, autoAlpha: 1}, "start");
				enterArticle.staggerFromTo(currentBtn, .5, { autoAlpha: 0 }, { autoAlpha: 1 }, "start");
				
				var sceneProjet = new ScrollMagic.Scene({
					triggerElement: $(this),
					triggerHook: .5,
				})
				.setTween(enterArticle)
				.addTo(controller);
	
				var parallax = new ScrollMagic.Scene({
					triggerElement: $(this),
					triggerHook: .5,
					duration: $(this).height()
				}).on('progress', function(e){
					TweenMax.from(currentImg, 0.4, {y: e.progress * -200})
					TweenMax.from(currentText, 0.4, {y: e.progress * -50})
				})
				.addTo(controller);
			})

		})

		
	}
}