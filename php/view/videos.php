<?php
    require_once ($_SERVER['DOCUMENT_ROOT'] . '/Trex-Topic-based-Resource-eXplorer-/php/controller/Videos.php');
    
    $v = new Videos();

   // $result = $v -> getAllCategories();
    $initialPage = $v -> getInitialVideos();

    header('Content-Type: application/json');
    http_response_code(200);
    echo json_encode($initialPage);
?>