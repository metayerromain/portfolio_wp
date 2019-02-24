<?php 
/**
* Class name: PageController()
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

class PageController extends AppController
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
  public function homeAction(){
    $paged = $this->getPagedArgument();

    $this->render('pages/page-home.twig', array(
      'post' => Timber::get_post()
    ));
  }

  public function projetsAction(){
    $paged = $this->getPagedArgument();

    $args = array(
      'post_type' => 'post',
      'posts_per_page' => 3,
      'paged' => $paged
    );

    $this->render('pages/page-projects.twig', array(
      'post' => new TimberPost(),
      'posts' => new Timber\PostQuery($args)
    ));
  }

  /**
  * Method called by Router::routing()
  *
  * PagedexempleAction() method renders <pages/page-exemple> and provide it some datas
  *
  * @return void
  */
  public function pageExempleAction(){
    $this->render('pages/page-exemple.twig', array(
      'post' => new TimberPost()
    ));
  }



  /**
  * Method called by Router::routing()
  *
  * HomeAction() method renders <pages/page-404> and provide it some datas
  *
  * @return void
  */
  public function page404Action(){
    $this->render('pages/page-404.twig');
  }
}