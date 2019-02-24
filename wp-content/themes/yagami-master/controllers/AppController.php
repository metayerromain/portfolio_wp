<?php
/**
* Class name: AppController()
*
* App controller class is extended by all "Pages Controllers", and provides several common methods
*
* @author : Kévin Vacherot <kevinvacherot@gmail.com>
*/

namespace Controllers;

use \Timber;

class AppController
{
  /**
  * @var Boolean  Indicate whether the AppController::render() has been called at least once 
  */
  public $render_method_called = false;

  /**
  * @var Boolean  Indicate whether the called Timber template exist
  */
  public $template_not_found = false;

  /**
  * @var Array  Array containing logs provided by Router
  */
  public $providedLogs = array();

  /**
  * @var Array  Array containing all processed actions 
  */
  public $logs = array();


  /**
  * __Constructor:
  *
  * Called by all "Page Controllers" to inherit AppController methods
  *
  * @return void
  */
  protected function __construct(){ }


  /**
  * Method called by Controllers
  *
  * Render() method allows to render Twig/Timber templates, and provide to thoses templates all datas you need
  * It also warns us if: 
  * - We try to render a non-existing template
  * - This method is at least called once by a method of a Page Controller
  *
  *
  * @param string  $template  Timber template
  * @param array   $datas     Array of datas provided to Timber templates
  *
  * @return void
  */
  protected function render($template, $datas = null){
    $template_path = Timber::$locations . '/' . $template;

    if(is_file($template_path)){
      $context = Timber::get_context();

      if(!is_null($datas)){
        if(is_array($datas)){
          foreach ($datas as $key => $value) {
            $context[$key] = $value;
          }
        }
      }

      if(defined('WP_DEBUG') && WP_DEBUG){
        if(!$this->isAjaxRequest()){
          $context['logs'] = $this->registerLogs($template, $datas);
        }
      }

      Timber::render($template, $context);
    } else {
      $this->template_not_found = $template_path;
    }

    $this->render_method_called = true;
  }


  /**
  * Method called by Controllers
  *
  * ajaxRender() method allows to render a twig template encoded into JSON format to resolve an AJAX call. 
  *
  *
  * @param string  $template  Timber template
  * @param array   $datas     Array of datas provided to Timber templates
  *
  * @return void
  */
  protected function ajaxRender($template, $datas = null){
    if($this->isAjaxRequest()){
      ob_start();
      $this->render($template, $datas);
      $render = ob_get_contents();
      ob_end_clean();
      echo json_encode($render);

      exit();
    } else {
      wp_redirect(site_url());
    }
  }


  /**
  * Method called by ajaxRender
  *
  * isAjaxRequest() checks if the request is an (ajax) xmlHttpRequest
  *
  * @return bool
  */
  private function isAjaxRequest(){
    return !empty($_SERVER['HTTP_X_REQUESTED_WITH']) && strtolower($_SERVER['HTTP_X_REQUESTED_WITH']) == 'xmlhttprequest';
  }


  /**
  * Method potentially called by all "Page Controllers"
  *
  * GetPagedArgument() method returnss paged argument used in wp_query to render pagination
  *
  * @return string  paged argument used in wp_query to render pagination
  */
  protected function getPagedArgument(){
    if (get_query_var('paged')) { 
      $paged = get_query_var('paged');
    } else if ( get_query_var('page') ) {
      $paged = get_query_var('page');
    } else { 
      $paged = 1;
    }

    return $paged;
  }


  /**
  * Method called by render()
  *
  * registerLogs() method returns array containing all logs
  *
  * @param array  $template  Timber template
  * @param array  $datas Array of datas provided to Timber templates
  *
  * @return array  Array containing all datas provided to Timber templates
  */
  private function registerLogs($template, $datas){
    $logs = array();

    $logs['router'] = array(
      'resolve'    => $this->providedLogs['template_checking'],
      'controller' => $this->providedLogs['controller'],
      'method'     => $this->providedLogs['method']
    );
    $logs['view'] = 'views/' . $template;
    $logs['datas'] = $this->datasLogs($datas);
    $logs['post'] = (array) new \TimberPost();

    return $logs;
  }


  /**
  * Method called by registerLogs()
  *
  * datasLogs() method returns an array containing router informations
  *
  * @param array  $datas Array of datas provided to Timber templates
  *
  * @return array  Array containing all datas provided to Timber templates
  */
  private function datasLogs($datas){
    $datasLogs = array();

    if(!is_null($datas)){
      if(is_array($datas)){
        foreach ($datas as $key => $value) {
          $datasLogs[$key] = $value;
        }
      }
    }

    return $datasLogs;
  }
}