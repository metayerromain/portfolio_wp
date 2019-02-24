<?php 
/**
* Class name: ProjectsController()
*
* A controller class is composed of methods suffixed with "Action", and responsibles for the following tasks:
* - Render the correct Twig/Timber template for the current page
* - Do the business logic associated to the current page
* - Provide the datas to the Twig/Timber templates
*
* @author : Kévin Vacherot <kevinvacherot@gmail.com>
*/

namespace Controllers;

use \Timber;
use \Timber\PostQuery;
use \TimberPost;

class ProjectsController extends AppController
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
  * ArchiveAction() method renders <projects/archive.twig> and provide it some datas
  *
  * @return void
  */
  public function archiveAction(){
    $this->render('projects/archive.twig', array(
      'posts' => new Timber\PostQuery()
    ));
  }


  /**
  * Method called by Router::routing()
  *
  * SingleAction() method renders <projects/single.twig> and provide it some datas
  *
  * @return void
  */
  public function singleAction(){
    $this->render('projects/single.twig', array(
      'post' => new TimberPost()
    ));
  }


  /**
  * Method called by Router::routing()
  *
  * genreAction() method renders <projects/genres.twig> and provide it some datas
  *
  * @return void
  */
  public function genreAction(){
    $this->render('projects/genres.twig', array(
      'posts' => new Timber\PostQuery(),
      'title' => single_term_title('', false)
    ));
  }
}