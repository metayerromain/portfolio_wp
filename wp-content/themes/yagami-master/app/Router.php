<?php
/**
* Class name: Router()
*
* This class is a Singleton meant to associate the current page with a controller::method combination
* which will handles template rendering & datas providing
*
* Router is based on template conditions that exist into wordpress
*
* @author : Kévin Vacherot Kevin Vacherot <kevin.vacherot@adveris.fr>
*/

namespace App;

use \Timber;
use \Services\ConfigurationService;
use \Services\NotificationsService;

class Router
{
	/**
	* @var object  Unique instance of Router Class (Singleton)
	*/
	private static $instance;

	/**
	* @var array  Array that contains routes configuration
	*/
	private $routing_configuration;

	/**
	* @var array  Array that contains routes configuration
	*/
	private $routing_cpt_configuration;


	/**
	* __Constructor:
	*
	* Contructor is private, Router class can only be instanciated through the Start() method
	*
	* @return void
	*/
	private function __construct(){
		$this->routing_configuration = $this->get_routing_configuration();
		$this->routing_cpt_configuration = $this->get_routing_cpt_configuration();
	}


	/**
	* Method called by start()
	*
	* Router() class is a singleton.
	*
	* Load() method ensure that only one instance of Router is loaded
	* The instance is then stored in $instance property
	*
	* @return object  Router instance.
	*/
	private static function load(){
		if (!self::$instance instanceof self) {
		  self::$instance = new self;
		}

		return self::$instance;
	}


	/**
	* Method called from index.php
	*
	* start() method is the entry point of Router
	*
	* @param array  $ajax  array containing ajax request parameters
	*
	* @return object  Router instance.
	*/
	public static function start($ajax = array()){
		return self::load()
			->routing($ajax)
		;
	}


	/**
	* Method called by start()
	*
	* Routing() checks whether the request is AJAX or not, and call the resolveRequest() method with correct parameters
	*
	* @param array  $ajax  array containing ajax request parameters
	*
	* @return object  Router instance.
	*/
	private function routing($ajax){
		if(isset($ajax['ajax_params'])){
			$ajaxParams = $ajax['ajax_params'];
			$controller = $this->getController($ajaxParams['controller'], true);

			$this->resolveRequest($controller, null, $ajaxParams['params']);
		} else {
			$templateChecking = $this->getTemplateChecking();
			$controller = $this->getController($templateChecking['template_controller']);

			if(call_user_func_array($templateChecking['is_template'], array($templateChecking['is_template_args']))){
				$this->resolveRequest($controller, $templateChecking);
			}
		}

		return $this;
	}


	/**
	* Method called by routing()
	*
	* resolveRequest() allows to find out the "controller-method" to execute in order to resolve an http request or an xmlHttpRequest
	* by rendering a view, or emitting a json response
	*
	* @param array  $controller  	   Array containing all infos concerning the controller to instanciate
	* @param array  $templateChecking  Array with template condition to run (with args), and the corresponding controller configuration
	* @param array  $methodParams  	   Arguments for called method
	*
	* @return void
	*/
	private function resolveRequest($controller, $templateChecking = null, $methodParams = array()){
		if(is_file($controller['abs_path'])){
			$tplController = $controller['controller'];

			if(is_null($templateChecking)){
				$tplMethod = $controller['method'];
			} else {
				$tplMethod = $this->getMethod($controller['method'], $templateChecking['is_template'], $templateChecking['is_template_args']);
			}
			
			if(!is_null($tplMethod)){
				if(method_exists($tplController, $tplMethod)){
					if(defined('WP_DEBUG') && WP_DEBUG){
						$this->provideLogs($tplController, $controller, $tplMethod, $templateChecking);
					}
					call_user_func_array(array($tplController, $tplMethod), $methodParams);

					if(!$tplController->render_method_called){
						$this->callAlert('no_render_called', $tplMethod);
					}

					if($tplController->template_not_found !== false){
						$this->callAlert('no_timber_tpl', $tplController->template_not_found);
					}
				} else {
					$this->callAlert('method_not_found', $tplMethod, $controller['name']);
				}
			} else {
				$this->callAlert('no_method_called');
			}
		} else {
			$this->callAlert('no_controller_file', $controller['path']);
		}
	}


	/**
	* Method called by resolveRequest()
	*
	* provideLogs() allows to provide logs from Router to AppController
	*
	* @param array  $tplController     The current controller
	* @param array  $controller  	   Array containing all infos about the current controller
	* @param string $tplMethod  	   The current rendering method
	* @param array  $templateChecking  Array with template condition to run (with args), and the corresponding controller configuration
	*
	* @return void
	*/
	private function provideLogs($tplController, $controller, $tplMethod, $templateChecking){
		$templateChecking['entry_point'] = 'functions.php';

		$tplController->providedLogs = array(
			'controller' => $controller,
			'method' => $tplMethod,
			'template_checking' => $templateChecking
		);
	}


	/**
	* Method called by Routing()
	*
	* GetTemplateChecking() allows to return all infos concerning the template condition to execute 
	* in order to determine which template should be rendered
	*
	* @return array  Array containing -> Template condition to run (with args), and the corresponding controller configuration
	*/
	private function getTemplateChecking(){
		$templateChecking = array();

		if(is_page_template()){
			$templateChecking = $this->getPageTemplateCheckingConfig();
		}

		if(empty($templateChecking)){
			$templateChecking = $this->getCPTTemplateCheckingConfig();
		}
		
		if(empty($templateChecking)){
			$templateChecking = $this->getTemplateCheckingConfig($this->routing_configuration, 'app/config/routing.yml');
		}

		return $templateChecking;
	}

	/**
	* Method called by getTemplateChecking()
	*
	* getPageTemplateCheckingConfig() returns params to resolve a page template request
	*
	* @return array  Array containing -> Template condition to run (with args), and the corresponding controller configuration
	*/
	private function getPageTemplateCheckingConfig(){
		$pageTemplateFileSettings = require get_page_template();
		$configuration_file = 'templates/' . basename(get_page_template());

		return $this->initializeTemplateCheckingParams('is_page_template', '', $pageTemplateFileSettings['controller'], $configuration_file);
	}


	/**
	* Method called by getTemplateChecking()
	*
	* getTemplateCheckingConfig() returns params to resolve a standard request
	*
	* @param array   $config    	 Routing configuration
	* @param string  $config_url  	 Routing configuration file url
	*
	* @return array  Array containing -> Template condition to run (with args), and the corresponding controller configuration
	*/
	private function getTemplateCheckingConfig($config, $config_url){
		$templateChecking = array();

		if(is_array($config)){
			foreach ($config as $key => $value) {
				if($key()){				
					foreach ($value as $arg_config => $ctrl) {
						if($arg_config !== 'default'){
							if(call_user_func($key, $arg_config)){
								$templateChecking = $this->initializeTemplateCheckingParams($key, $arg_config, $ctrl['controller'], $config_url);
								break;
							}
						} else {
							$templateChecking = $this->initializeTemplateCheckingParams($key, '', $value['default']['controller'], $config_url);
						}
					}
					break;
				}
			}
		}
		
		return $templateChecking;
	}


	/**
	* Method called by getTemplateChecking()
	*
	* getCPTTemplateCheckingConfig() returns params to resolve a CPT request
	*
	* @return array  Array containing -> Template condition to run (with args), and the corresponding controller configuration
	*/
	private function getCPTTemplateCheckingConfig(){
		$templateChecking = array();
		$configuration_file = 'app/config/cpt-routes.yml';

		foreach ($this->routing_cpt_configuration as $cpt => $ctp_templates) {
			if(is_post_type_archive($cpt)){
				$templateChecking = $this->initializeTemplateCheckingParams('is_post_type_archive', $cpt, $ctp_templates['archive'], $configuration_file);
				break;
			}

			if(is_singular($cpt)){
				$templateChecking = $this->initializeTemplateCheckingParams('is_singular', $cpt, $ctp_templates['single'], $configuration_file);
				break;
			}

			if(isset($ctp_templates['taxs'])){
				foreach ($ctp_templates['taxs'] as $tax => $tax_templates) {
					if(is_tax($tax)){
						$templateChecking = $this->initializeTemplateCheckingParams('is_tax', $tax, $tax_templates, $configuration_file);
						break;
					}
				}
			}
		}

		return $templateChecking;
	}


	/**
	* Method called by getTemplateChecking methods
	*
	* initializeTemplateCheckingParams() returns an array filled with template checking params
	*
	* @param string $is_template 		 Template function condition
	* @param string $is_template_args 	 Template function condition arguments
	* @param string $template_controller Template controller config
	* @param string $configuration_file  Template declaration file
	*
	* @return array  Array containing -> Template condition to run (with args), and the corresponding controller configuration
	*/
	private function initializeTemplateCheckingParams($is_template, $is_template_args, $template_controller, $configuration_file){
		$templateChecking 						 = array();
		$templateChecking['is_template'] 		 = $is_template;
		$templateChecking['is_template_args']    = $is_template_args;
		$templateChecking['template_controller'] = $template_controller;
		$templateChecking['configuration_file']  = $configuration_file;
		$templateChecking['is_page_template']	 = is_page_template();

		return $templateChecking;
	}


	/**
	* Method called by Routing():
	*
	* GetController() allows to return all infos concerning the controller to instanciate
	*
	* @param string  $template_controller  string defining the controller and method to execute for the current page
	* @param bool    $is_ajax  					 It's ajax request
	*
	* @return array  Array with all infos concerning the controller to instanciate
	*/
	private function getController($template_controller, $is_ajax = false){
		$controller_parts = explode('::', $template_controller);
		$controller_name = $controller_parts[0];
		$controller = '\controllers\\' . $controller_name;
		$controller_path = str_replace('\\', '/', $controller . '.php');
		$controller_absolute_path = dirname(__DIR__) . $controller_path;
		$methodSuffix = !$is_ajax ? 'Action' : 'Ajax';
		$method = isset($controller_parts[1]) ? $controller_parts[1] . $methodSuffix : null;

		if(is_file($controller_absolute_path)){
			if(class_exists($controller)){
				$controller = new $controller();
			} else {
				$this->callAlert('no_controller_class', $controller_name, $controller_path, $controller_name);
			}
		}

		return array(
			'controller' => $controller,
			'abs_path' 	 => $controller_absolute_path,
			'path' 		 => $controller_path,
			'name' 		 => $controller_name,
			'method'	 => $method
		);
	}


	/**
	* Method called by Routing():
	*
	* GetMethod() allows to return the correct method to execute to render the current page
	*
	* @param string  $method  				  Method indicated by routing config file
	* @param string  $is_template  	  Template condition that is applied
	* @param string  $is_template_arg  Template condition argument
	*
	* @return array  Array with all infos concerning the method to to call
	*/
	private function getMethod($method, $is_template, $is_template_arg){
		if($is_template === 'is_page' && $is_template_arg === ''){
			$post = new \TimberPost();
			$method = str_replace('-', '', $post->post_name) . 'Action';
		}

		return $method;
	}


	/**
	* Method called by Router methods:
	*
	* CallAlert() allows to store all alert messages, fill each of them with additional strings, and make an alert of each
	*
	* @param string  $index  Array of columns used in admin
	* @param string  $arg1   1st string to fill the alert msg
	* @param string  $arg2   2nd string to fill the alert msg
	* @param string  $arg3   3rd string to fill the alert msg
	*
	* @return void
	*/
	private function callAlert($index, $arg1 = '', $arg2 = '', $arg3 = ''){
		$alerts = array(
			'no_render_called' 	  => 'It seems that nothing is displayed. Have you called the <b>AppController::render()</b> method in <b>%s()</b>',
			'no_timber_tpl'		  => 'Following Timber template not found: <b>%s</b>.',
			'method_not_found' 	  => 'It seems that you haven\'t created the method <b>%s()</b> in the <b>%s()</b>.',
			'no_method_called' 	  => 'It seems that no controller method is called, you may have forgotten to indicate a controller method in <b>routing.yml file</b>',
			'no_controller_file'  => 'It seems that you haven\'t created the controller file: <b>%s</b>.',
			'no_controller_class' => 'It seems that you haven\'t created the Controller Class <b>%s()</b> in <b>%s:</b>
				<ul style="margin: 15px 0 0 0;">
					<li style="margin-top:5px">Verify that your Namespace is <b>App\Controllers</b></li>
					<li style="margin-top:5px">Verify that your ClassName is <b>%s()</b></li>
				</ul>',
		);

		NotificationsService::alert(sprintf($alerts[$index], $arg1, $arg2, $arg3));
	}


	/**
	* Method called by __constructor()
	*
	* get_routing_configuration() method allows to:
	*
	* - Parse YAML file "app/config/routing.yml"
	* - It retrieves routes config parameters
	* The retrieved array is then stored in $routes_configuration property
	*
	* @return array  Array containaing routes config parameters
	*/
	private function get_routing_configuration(){
		return ConfigurationService::parseYamlFile('routing');
	}


	/**
	* Method called by __constructor()
	*
	* get_routing_cpt_configuration() method allows to:
	*
	* - Parse YAML file "app/config/routing_cpt.yml"
	* - It retrieves cpt routes config parameters
	* The retrieved array is then stored in $routes_cpt_configuration property
	*
	* @return array  Array containaing routes config parameters
	*/
	private function get_routing_cpt_configuration(){
		return ConfigurationService::parseYamlFile('cpt-routes');
	}
}