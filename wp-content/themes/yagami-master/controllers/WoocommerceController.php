<?php 
/**
* Class name: WoocommerceController()
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

class WoocommerceController extends AppController
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
  * archiveAction() method renders <woocommerce/shop.twig> and provide it some datas
  *
  * @return void
  */
  public function archiveAction(){
    $this->render('woocommerce/products/archive.twig', array(
      'products' => new Timber\PostQuery(array('post_type' => 'product'))
    ));
  }


  /**
  * Method called by Router::routing()
  *
  * singleAction() method renders <woocommerce/product.twig> and provide it some datas
  *
  * @return void
  */
  public function singleAction(){

    $post = new TimberPost();
    $product = wc_get_product( $post->ID );

    $this->render('woocommerce/products/single.twig', array(
      'post' => $post,
      'product' => $product

    ));
  }


  /**
  * Method called by Router::routing()
  *
  * categoryAction() method renders <woocommerce/shop.twig> and provide it some datas
  *
  * @return void
  */
  public function categoryAction(){
    $this->render('woocommerce/products/category.twig', array(
      'products' => Timber::get_posts()
    ));
  }


  /**
  * Method called by Router::routing()
  *
  * tagAction() method renders <woocommerce/shop.twig> and provide it some datas
  *
  * @return void
  */
  public function tagAction(){
    $this->render('woocommerce/products/tag.twig', array(
      'products' => Timber::get_posts()
    ));
  }


  /**
  * Method called by Router::routing()
  *
  * accountAction() method renders <woocommerce/product.twig> and provide it some datas
  *
  * @return void
  */
  public function accountAction(){

    $post = new TimberPost();

    $this->render('woocommerce/pages/account.twig', array(
      'post' => $post

    ));
  }


  /**
  * Method called by Router::routing()
  *
  * cartAction() method renders <woocommerce/product.twig> and provide it some datas
  *
  * @return void
  */
  public function cartAction(){

    $post = new TimberPost();

    $this->render('woocommerce/pages/cart.twig', array(
      'post' => $post

    ));
  }


  /**
  * Method called by Router::routing()
  *
  * checkoutAction() method renders <woocommerce/product.twig> and provide it some datas
  *
  * @return void
  */
  public function checkoutAction(){

    $post = new TimberPost();

    $this->render('woocommerce/pages/checkout.twig', array(
      'post' => $post

    ));
  }




}