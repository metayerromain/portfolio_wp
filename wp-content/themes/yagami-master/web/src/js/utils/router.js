class Router
{
	constructor(routes){
		this.routes = routes;
	}

	load(){
		const routes = this.routes;

		routes.map((route) => {
			const resolve = route.resolve;
			
			if(typeof route.resolve !== 'undefined'){
				document.querySelectorAll(resolve).length && this.runInitialization(route)
			} else {
				this.runInitialization(route)
			}
		});
	}

	runInitialization(route){
		route.file.init.apply(null, route.dependencies)
	}
}

export default Router;