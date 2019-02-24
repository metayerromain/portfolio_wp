<?php
/**
* Class name: ACFManager()
*
* This class is a Singleton meant to handle all ACF features
*
* @author : Kevin Vacherot <kevin.vacherot@adveris.fr>
*/

namespace Managers;

use \Services\ConfigurationService;

class ACFManager
{
	/**
    * @var object  Unique instance of ACFManager Class (Singleton)
    */
    private static $instance;

    /**
    * @var array  Array that contains all configurations for ACFManager
    */
    private $configuration = array();


    /**
	* __Constructor:
	*
	* Contructor is private, ACFManager class can only be instanciated through the Load() method
	*
	* @return void
	*/
    private function __construct(){
    	$this->configuration = $this->get_configuration();
    	$this->acf();
    }


	/**
	* Method called by __constructor()
	*
	* ACFManager() class is a singleton.
	*
	* Load() method ensure that only one instance of ACFManager is loaded
	* The instance is then stored in $instance property
	*
	* @return object  ACFManager instance.
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
	* Register() method is the entry point of ACFManager class
	*
	* @return object  ACFManager instance.
	*/
	public static function register(){
		return self::load();
	}


	/**
	* Method called by the __constructor():
	*
	* acf() method is used to manage ACF features
	*
	* @return void
	*/
	private function acf(){
		add_action('acf/init', array($this, 'acf_init'));
		$this->acf_options();
	}


	/**
	* Method called by the acf():
	*
	* acf() method is used to manage ACF Initializations
	*
	* @return void
	*/
	public function acf_init(){
		if(isset($this->configuration['google_map_api_key'])){
			acf_update_setting('google_api_key', 'AIzaSyDGF98psyVSiyiVhFovqfhMDrGJ-Ls2Uoc');
		}
		
	}


	/**
	* Method called by the __constructor():
	*
	* acf() method is used to manage ACF options
	*
	* @return void
	*/
	private function acf_options(){
		if(function_exists('acf_add_options_page')){
			if(isset($this->configuration['options'])){
				foreach ($this->configuration['options'] as $key => $value) {
					$option_page = $value['page'];
					$option_page['redirect'] = true;
					acf_add_options_page($option_page);

					if(isset($value['sub_menus'])){
						foreach($value['sub_menus'] as $k => $v){
							$v['parent_slug'] = $option_page['menu_slug'];
							acf_add_options_sub_page($v);
						}
					}
				}
			}
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
        return ConfigurationService::parseYamlFile('acf');
    }
}