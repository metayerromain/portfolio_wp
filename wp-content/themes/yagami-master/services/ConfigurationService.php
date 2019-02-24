<?php
/**
* Class name: ConfigurationService()
*
* This class is allows to parse YAML config files, and then return array-formatted config parameters  
* To manage this, We use the Spyc library
*
* @author : Kevin Vacherot <kevin.vacherot@adveris.fr>
*/

namespace Services;

class ConfigurationService
{
    /**
    * ParseYamlFile method is used to parse YAML config files, and then return array-formatted config parameters  
    *
    * @param string  $file  Filename to parse
    *
    * @return array YAML file content 
    */
    public static function parseYamlFile($file)
    {
        $yaml_file = ROOT . '/app/config/'. $file .'.yml';

        return is_file($yaml_file) ? \App\Vendors\Spyc::YAMLLoad($yaml_file) : false;
    }
}
