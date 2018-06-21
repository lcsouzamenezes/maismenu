<?php

    header("Access-Control-Allow-Origin: *");

    if ( !empty( $_FILES ) ) {
        $tempPath   = $_FILES[ 'file' ][ 'tmp_name' ];
        $uploadPath = "../../uploads/" . $_FILES[ 'file' ][ 'name' ];
        move_uploaded_file( $tempPath, $uploadPath );
        $answer     = array( 'answer' => 'File upload completed' );
        $json       = json_encode( $answer );
        echo $json;
    } else {
        echo 'No files';
    }

?>
