<?php 
/*
* Init Router on "ajax mode" to resolve an AJAX call.
*/
App\Router::start(array('ajax_params' => $params));