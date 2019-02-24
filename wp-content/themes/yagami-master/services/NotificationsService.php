<?php
/**
* Class name: NotificationsServices()
*
* This class contains static methods thar can be used from anywhere in the app
*
* @author : Kevin Vacherot <kevin.vacherot@adveris.fr>
*/

namespace Services;

class NotificationsService
{
    /**
    * timber_alert method is used to display Timber alert in admin area
    *
    * @return void
    */
    public static function timber_alert()
    {
        $notification = '
            <div class="error">
                <p>
                    Timber not activated.. Make sure you activate the plugin in 
                    <a href="' . esc_url( admin_url( 'plugins.php#timber' ) ) . '">' . esc_url( admin_url( 'plugins.php') ) . '</a>
                </p>
            </div>';

        echo $notification;
    }


    /**
    * ParseYamlFile method is used to parse YAML config files, and then return array-formatted config parameters  
    *
    * @param string  $html  html DOM structure of the alert that we want to display
    * @param bool    $kill  whether we put a die() after the alert
    *
    * @return void
    */
    public static function alert($html, $kill = true)
    {
        if(!is_admin()){
            $notification = '<div style="padding: 15px 20px; background-color: #f8d7da; border: 1px solid #f5c6cb; color: #721c24; border-radius: 0px; font-family: arial; font-size: 14px;">' . $html . '</div>';

            echo $notification;

            $kill && die();
        }
    }


    /**
    * timberControl is ised to display an alert which warns that Timber is not activated
    *
    * @param bool  $timberClassExist  Whether Timber class exists
    *
    * @return void
    */
    public static function timberControl($timberClassExist)
    {
        if(!$timberClassExist){
            add_action( 'admin_notices', function(){ self::timber_alert(); });

            self::alert('<b>Timber is not activated:</b>
                <ul style="margin: 15px 0 0 0;">
                <li style="margin-top:5px">Please go to admin area and install the plugin: <b>Timber</b></li>
                <li style="margin-top:5px">Once installed, activate it!</li>
                </ul>
            ');
        }
    }
}
