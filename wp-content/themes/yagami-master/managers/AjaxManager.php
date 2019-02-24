<?php
/**
* Class name: AjaxManager()
*
* This class is a Singleton meant to handle Ajax mechanisms
*
* @author : Kevin Vacherot <kevin.vacherot@adveris.fr>
*/

namespace Managers;

use \Services\ConfigurationService;
use \Routes;

class AjaxManager
{
	/**
    * @var object  Unique instance of AjaxManager Class (Singleton)
    */
    private static $instance;

    /**
    * @var array  Array that contains all configurations for AjaxManager
    */
    private $configuration = array();


    /**
	* __Constructor:
	*
	* Contructor is private, AjaxManager class can only be instanciated through the Load() method
	*
	*
	* @return void
	*/
    private function __construct(){
    	$this->configuration = $this->get_configuration();
    	$this->ajax();
    }


	/**
	* Method called by __constructor()
	*
	* AjaxManager() class is a singleton.
	*
	* Load() method ensure that only one instance of AjaxManager is loaded
	* The instance is then stored in $instance property
	*
	* @return object  AjaxManager instance.
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
	* Register() method is the entry point of AjaxManager class
	*
	*
	* @return object  AjaxManager instance.
	*/
	public static function register(){
		return self::load();
	}


	/**
	* Method called by __constructor():
	*
	* ajax() method inits ajax Routes
	*
	* @return void
	*/
	private function ajax() {
		$ajaxRoutes = $this->configuration;

		foreach($ajaxRoutes as $routeName => $config){
			Routes::map($config['path'], function($params) use ($config){
				$parameters = $params;
				$params = array();
				$params['params'] = $parameters;
				$params['controller'] = $config['controller'];

				Routes::load('ajax.php', $params);
			});
		}
	}


	/**
	* Method called by __constructor()
	*
	* get_configuration() method allows to parse YAML files which contain configurations for this Manager
	* The retrieved array is then stored in $this->configuration property
	*
	* @return array  Array containaing configurations for this Manager
	*/
    private function get_configuration(){
        return ConfigurationService::parseYamlFile('ajax-routes');
    }
}