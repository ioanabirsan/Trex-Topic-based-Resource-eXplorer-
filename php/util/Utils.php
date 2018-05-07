<?php

class Utils {
    public static function fetchData($uri){
        // Reference: http://thisinterestsme.com/send-get-request-with-php/
        //Initialize cURL.
        $ch = curl_init();

        //Set the URL that you want to GET by using the CURLOPT_URL option.
        curl_setopt($ch, CURLOPT_URL, $uri);

        //Set CURLOPT_RETURNTRANSFER so that the content is returned as a variable.
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

        //Set CURLOPT_FOLLOWLOCATION to true to follow redirects.
        curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);

        try {
            //Execute the request.
            $data = curl_exec($ch);
        } catch (Exception $e) {
            return [];
        }

        //Close the cURL handle.
        curl_close($ch);

        return $data;
    }

    public static function truncateDescription($description, $length){
        if (strlen($description) > $length) {
            // truncate string
            $stringCut = substr($description, 0, $length);
            $endPoint = strrpos($stringCut, ' ');

            //if the string doesn't contain any space then it will cut without word basis.
            $description = $endPoint? substr($stringCut, 0, $endPoint):substr($stringCut, 0);
            $description .= '...';
        }
        return $description;
    }

}

?>