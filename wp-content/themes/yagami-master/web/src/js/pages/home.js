export default {
	init: (app) => {
		app.dump('home.js');

		var idTitle;
		$('.link').on('mouseover', function(){
			idTitle = $(this).parent().data('id');
			console.log(idTitle, $('.img-container').data('id',idTitle));
			TweenLite.to($('.img-container[data-id='+idTitle+']'), 1, {autoAlpha:1});
		})
		$('.link').on('mouseout', function(){
			TweenLite.to($('.img-container[data-id='+idTitle+']'), .5, {autoAlpha:0});
		});

		var containerWidth = $('.img-container').width();
		var containerHeight = $('.img-container').height();


		$('.img-container').each(function(){
			console.log($(this));
			var stage = new PIXI.Container();
			var renderer = PIXI.autoDetectRenderer(containerWidth, containerHeight);
			renderer.backgroundColor = 0x000;
			$(this).append(renderer.view);
		
			var container = new PIXI.Container();
			container.position.x = (renderer.width/5);
			container.position.y = renderer.height/5;
			stage.addChild(container);
		
			var originalVertices = [], mesh;
			var texture = new PIXI.Texture.fromImage($(this).data('img'));
			texture.on('update',function(){
		
				mesh = new PIXI.mesh.Plane( this, 20, 20 );
				mesh.width = this.width; //renderer.width * 0.35;
				mesh.height = this.height;//renderer.width * 0.5;
				container.addChild(mesh);//, 0);
				mesh.pivot.x = mesh.width * 0.3;
				mesh.pivot.y = mesh.height * 0.3;
				
				originalVertices = mesh.vertices.slice(0);	

				animate();

			});
		
			var count = 0;

			function animate() {
				requestAnimationFrame(animate);
		
				count += 0.15;

				if ( mesh && mesh.vertices ) { 
					
					for (let i = 0; i < mesh.vertices.length; i++) {
					mesh.vertices[i] = originalVertices[i] + (3 * Math.cos(count + i * 0.5));
					}
				}
		
				renderer.render(stage);
			}
		})
	}
}
