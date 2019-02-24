<?php
/**
* Class name: Routing()
*
* This class is a Singleton meant to Launch the router on the "template_redirect" hook
*
* @author : Kevin Vacherot <kevin.vacherot@adveris.fr>
*/

namespace Managers;

use \Services\ConfigurationService;
use \Routes;

class RoutingManager
{
	/**
    * @var object  Unique instance of Routing Class (Singleton)
    */
    private static $instance;


    /**
	* __Constructor:
	*
	* Contructor is private, Routing class can only be instanciated through the Load() method
	*
	*
	* @return void
	*/
    private function __construct(){
    	$this->routing();
    }


	/**
	* Method called by __constructor()
	*
	* Routing() class is a singleton.
	*
	* Load() method ensure that only one instance of Routing is loaded
	* The instance is then stored in $instance property
	*
	* @return object  Routing instance.
	*/
	private static function load(){
		if (!self::$instance instanceof self) {
            self::$instance = new self;
        }

        return self::$instance;
	}


	/**
	* Method called from AppKernel()
	*
	* Register() method is the entry point of Routing class
	*
	*
	* @return object  Routing instance.
	*/
	public static function register(){
		return self::load();
	}

	/**
	* Method called by __constructor():
	*
	* ajax() method launches the router
	*
	* @return void
	*/
	private function routing(){
		add_action('template_redirect', array($this, 'runRouter'));
	}


	/**
	* Method called by wordpress():
	*
	* runRouter() method associate the current page with a controller::method combination
	* which will handles template rendering & datas providing
	* 
	* @return void
	*/
	public function runRouter(){
		!$this->isAjaxRequest() && \App\Router::start();
	}


	/**
	* Method called by runRouter
	*
	* isAjaxRequest() checks if the request is an (ajax) xmlHttpRequest
	*
	* @return bool
	*/
	private function isAjaxRequest(){
		return !empty($_SERVER['HTTP_X_REQUESTED_WITH']) && strtolower($_SERVER['HTTP_X_REQUESTED_WITH']) == 'xmlhttprequest';
	}
}