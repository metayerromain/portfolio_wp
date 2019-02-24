<?php 
/**
* Class name: TemplatesController()
*
* A controller class is composed of methods suffixed with "Action", and responsibles for the following tasks:
* - Render the correct Twig/Timber template for the current page
* - Do the business logic associated to the current page
* - Provide the datas to the Twig/Timber templates
*
* @author : Kévin Vacherot <kevinvacherot@gmail.com>
*/

namespace Controllers;

use \TimberPost;
use \Timber\PostQuery;
use \Timber;

class TemplatesController extends AppController
{
  /**
  * __Constructor:
  *
  * Call AppController::__construct to inherit AppController useful methods
  *
  * @return void
  */
  public function __construct(){
    parent::__construct();
  }


  /**
  * Method called by Router::routing()
  *
  * HomeAction() method renders <pages/page-home> and provide it some datas
  *
  * @return void
  */
  public function specialAction(){
    $this->render('templates/special.twig', array(
      'post' => new TimberPost
    ));
  }
}