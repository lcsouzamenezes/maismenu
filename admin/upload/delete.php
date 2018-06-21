<?php

    header('Access-Control-Allow-Origin: *');


	define('ROOTPATH', dirname(__DIR__));

  	$data = file_get_contents("php://input");
  	$data = json_decode($data);

  	$imagedelete = ROOTPATH . $data->filename;

  	unlink(str_replace('admin', '', $imagedelete));


    // $filedata    = file_get_contents("php://input");
    // $objfiledata = json_decode($filedata);
    // $filename    = $objfiledata -> filename;
    //
    // if (file_exists($filename)) {
    //     unlink($filename);
    //
    //     $answer = array( 'res' => 'Imagem deletada com sucesso.' );
    //     $json   = json_encode( $answer );
    //     echo $json;
    // }
    //
    // else {
    //     $answer = array( 'res' => 'Esta imagem não existe.' );
    //     $json   = json_encode( $answer );
    //     echo $json;
    // }
    //
    // echo $filedata;
