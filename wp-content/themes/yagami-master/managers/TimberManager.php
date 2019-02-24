<?php
/**
* Class name: TimberManager()
*
* This class is a Singleton meant to handle Timber/Twig mechanisms
*
* @author : Kevin Vacherot <kevin.vacherot@adveris.fr>
*/

namespace Managers;

use \Timber;
use \TimberMenu;
use \Twig_Extension_StringLoader;
use \Services\ConfigurationService;

class TimberManager
{
	/**
    * @var object  Unique instance of TimberManager Class (Singleton)
    */
    private static $instance;

    /**
    * @var array  Array that contains all configurations for TimberManager
    */
    private $configuration = array();


    /**
	* __Constructor:
	*
	* Contructor is private, TimberManager class can only be instanciated through the Load() method
	*
	* @return void
	*/
    private function __construct(){
    	$this->configuration = $this->get_configuration();
    	$this->timber();
    	require_once ROOT . '/app/vendors/vendor/autoload.php';
    }


	/**
	* Method called by __constructor()
	*
	* TimberManager() class is a singleton.
	*
	* Load() method ensure that only one instance of TimberManager is loaded
	* The instance is then stored in $instance property
	*
	* @return object  TimberManager instance.
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
	* Register() method is the entry point of TimberManager class
	*
	* @return object  TimberManager instance.
	*/
	public static function register(){
		return self::load();
	}


	/**
	* Method called by __constructor():
	*
	* Timber() method runs Timber features
	* 
	* @return void
	*/
	private function timber() {
		Timber::$locations = ROOT . $this->configuration['views_location'];

		add_filter('timber_context', array($this, 'add_to_context'));
		add_filter('get_twig', array($this, 'add_to_twig'));
	}


	/**
	* Method called by timber():
	*
	* Add_to_context() method is used to provide additionnal datas used in Twig templates.
	*
	* @return $twig 
	*/
	public function add_to_context($context) {
		$mobileDetect = new \App\Vendors\Mobile_Detect();

		$baseContext = $context;
		$menuContext = $context;
		$customContext = array();
		$debugContext = array();

		foreach (get_registered_nav_menus() as $key => $value) {
			$menuContext['menu'][$key] = new TimberMenu($key);
		}
		
		$customContext['timber']       = $this;
		$customContext['services'] 	   = new \Services\TimberService;
		$customContext['lang']         = require $this->get_translation_configuration();
		$customContext['img']          = get_template_directory_uri() . '/web/src/img';
		$customContext['dist']         = get_template_directory_uri() . '/web/dist';
		$customContext['options']      = function_exists('get_fields') ? get_fields('options') : null;
		$customContext['is_device']    = $mobileDetect->isMobile() || $mobileDetect->isTablet();
		$customContext['links']        = $this->getLinks($this->configuration['context']['links']);


		if(defined('WP_DEBUG') && WP_DEBUG){
			$debugContext['debug'] 			   = true;
			$debugContext['base_context'] 	   = $baseContext;
			$debugContext['custom_context']    = array_merge($customContext, $menuContext);
			$debugContext['globals']['server'] = $_SERVER;
			$debugContext['globals']['get']    = $_GET;
			$debugContext['globals']['session']    = $_SESSION;
		}

		return array_merge($baseContext, $menuContext, $customContext, $debugContext);
	}
	

	/**
	* Method called by add_to_context():
	*
	* getLinks() method is used to return an array containing links used in the application
	*
	* @param array  $linksConfiguration  array containing links configuration
	*
	* @return array  $links  Array containing links used in the application
	*/
	public function getLinks($linksConfiguration) {
		$links = array();

		foreach($linksConfiguration as $key => $value){
			switch ($key) {
				case 'archives':
					foreach ($value as $k => $v) {
						$links[$key][$k] = get_post_type_archive_link($v);
					}
				break;

				case 'pages':
					foreach ($value as $k => $v) {
						$links[$key][$k] = get_page_link($v);
					}
				break;
			}
		}

		return $links;
	}


	/**
	* Method called by timber():
	*
	* Add_to_twig() method is used to:
	* - Activate some Twig extensions 
	* - Add our own functions to Twig
	*
	* @return $twig 
	*/
	public function add_to_twig($twig) {
		$twig->addExtension(new Twig_Extension_StringLoader());
		$twig->addFilter(new \Twig_SimpleFilter('cast_to_array', array( $this, 'cast_to_array')));

		return $twig;
	}


	/**
	* Method called by add_to_twig():
	*
	* cast_to_array() method cast an object type to array type
	*
	* @param object  $element  object to cast to array
	*
	* @return array  object cast to array
	*/
	public function cast_to_array($element) {
	    if(is_object($element)){
	    	$element = (array) $element;
	    }

	    return $element;
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
        return ConfigurationService::parseYamlFile('timber');
    }


    /**
	* Method called by __constructor()
	*
	* get_translation_configuration() method allows to:
	* - Parse YAML file "app/config/_translations.php"
	* - It retrieves an array containing all WPML traductions
	*
	* @return array  Array containing all WPML traductions
	*/
    private function get_translation_configuration(){
		return ROOT . '/app/config/_translations.php';
	}
}