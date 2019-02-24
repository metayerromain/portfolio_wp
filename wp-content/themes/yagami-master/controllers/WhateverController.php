<?php 
/**
* Class name: WhateverController()
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

class WhateverController extends AppController
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
  * AuthorAction() method renders <whatever/author.twig> and provide it some datas
  *
  * @return void
  */
  public function authorAction(){
    $this->render('whatever/author.twig', array(
      'posts' => new Timber\PostQuery(),
      'title' => get_the_author()
    ));
  }


  /**
  * Method called by Router::routing()
  *
  * DateAction() method renders <whatever/date.twig> and provide it some datas
  *
  * @return void
  */
  public function dateAction(){
    $this->render('whatever/date.twig', array(
      'posts' => new Timber\PostQuery(),
      'title' => get_the_date()
    ));
  }


  /**
  * Method called by Router::routing()
  *
  * AttachmentAction() method renders <attachment/attachment.twig> and provide it some datas
  *
  * @return void
  */
  public function attachmentAction(){
    $this->render('whatever/attachment.twig', array(
      'post' => new TimberPost()
    ));
  }


  /**
  * Method called by Router::routing()
  *
  * searchAction() method renders <search/index.twig> and provide it some datas
  *
  * @return void
  */
  public function searchAction(){
    $this->render('whatever/search.twig', array(
      'posts' => new Timber\PostQuery()
    ));
  }
  
}