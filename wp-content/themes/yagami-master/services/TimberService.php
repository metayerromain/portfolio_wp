<?php
/**
* Class name: TimberService()
*
* This class contains methods provided to timber templates
*
* @author : Kevin Vacherot <kevin.vacherot@adveris.fr>
*/

namespace Services;

class TimberService
{
    /**
    * svg() allows to get code from an SVG file  
    *
    * @param bool  $url  SVG file url
    *
    * @return string  SVG code 
    */
    public static function svg($url){
        $login = "adveris";
        $password = "koala";
          
        $context = stream_context_create(array (
            'http' => array (
                'header' => 'Authorization: Basic ' . base64_encode("$login:$password")
            )
        ));

        return file_get_contents($url, false, $context);
    }
}
