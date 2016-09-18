<?php
$response = file_get_contents("https://www.google.com/recaptcha/api/siteverify?secret=6LdRMg4TAAAAALx1i1zaJH6yUiaaK2KNFB3TILPZ&response=" . $captcha . "&remoteip=" . $_SERVER['REMOTE_ADDR']);
if ($response . success == true) {
    if (isset($_POST['address'])) {
        $address = $_POST['address'];
        $date = new DateTime('now');
        $ip = $_SERVER['REMOTE_ADDR'];
        $details = json_decode(file_get_contents("http://ipinfo.io/{$ip}/json"));

        $address = urlencode($address);

        // google map geocode api url
        $url = "https://maps.google.com/maps/api/geocode/json?key=AIzaSyAwUiURMDRZ1TSmN2dFAzXI4afYdwdoHNU&address={$address}";

        // get the json response
        $resp_json = file_get_contents($url);

        // decode the json
        $resp = json_decode($resp_json, true);

        // response status will be 'OK', if able to geocode given address
        if ($resp['status'] == 'OK') {

            // get the important data
            $latitude = $resp['results'][0]['geometry']['location']['lat'];
            $longtitude = $resp['results'][0]['geometry']['location']['lng'];
            $formatted_address = $resp['results'][0]['formatted_address'];


            // adds form data into an array
            $formdata = array(
                'address' => $formatted_address,
                'type' => $_POST['type'],
                'utilities' => $_POST['utilities'],
                'parking' => $_POST['parking'],
                'require' => $_POST['require'],
                'contact' => $_POST['contact'],
                'phone' => $_POST['phone'],
                'email' => trim($_POST['email']),
                'website' => trim($_POST['website']),
                'cost' => $_POST['cost'],
                'time' => $date->format('g:ia \o\n jS F Y'),
                'city' => $details->city . ", " . $details->country,
                'network' => $details->org,
                'ip' => $ip,
                'lat' => $latitude,
                'lng' => $longtitude

            );


            //Mail
            $headers = "MIME-Version: 1.0" . "\r\n";
            $headers .= "Content-type:text/html; charset=iso-8859-1" . "\r\n";
            $headers .= 'From: <contact@prabhsingh.com>' . "\r\n";

            $to = trim($_POST['email']);
            $subject = "Registration Complete on rent.prabhsingh.com";
            $msg = '<html lang="en">';
            $msg .= '<head><meta charset="UTF-8"><title>Successfully Registered on rent.prabhsingh.com</title><meta name="viewport" content="width=device-width, initial-scale=1.0"><meta name="author" content="Prabhdeep Singh"></head>';
            $msg .= '<body style = "text-align: center; font-size: 1.2em;">';
            $msg .= "<h2>" . trim($formatted_address) . "</h2>";
            $msg .= "<h3>Charge: $" . trim($_POST['cost']) . "/month</h3>";
            $msg .= '<ul style = "list-style-type: none; float: left; display: block; width: 340px; background-color: #D8D8D8; margin: 2px; border-radius: 4px"><p style="text-align: center; text-decoration: underline"> Property Details </p>';
            $msg .= "<li style='float: left; clear: left; margin: 2px 0'><b>Location Category </b>:" . $_POST['type'] . "</li>";
            $msg .= "<li style='float: left; clear: left; margin: 2px 0'><b>Utilities Included </b>:" . $_POST['utilities'] . "</li>";
            $msg .= "<li style='float: left; clear: left; margin: 2px 0'><b>Parking Available </b>:" . $_POST['parking'] . "</li>";
            $msg .= "<li style='float: left; clear: left; margin: 2px 0 4px;'><b>Tenant Required </b>:" . $_POST['require'] . "</li>";
            $msg .= '</ul>';
            $msg .= '<ul style = "list-style-type: none; float: left; display: block; width: 340px; background-color: #D8D8D8; margin: 2px; border-radius: 4px"><p style="text-align: center; text-decoration: underline">  Prospects may contact you via any of the following methods: </p>';
            $msg .= "<li style='float: left; clear: left; margin: 2px 0'><b>Phone </b>: <a href = 'tel:" . $_POST['phone'] . "'>" . $_POST['phone'] . "</a></li>";
            $msg .= "<li style='float: left; clear: left; margin: 2px 0'><b>Email </b>: <a href = 'mailto:" . trim($_POST['email']) . "'>" . trim($_POST['email']) . "</a></li>";
            $msg .= "<li style='float: left; clear: left; margin: 2px 0 4px; margin-bottom: 3px;'><b>Link </b>: <a href = '" . trim($_POST['website']) . "' target='_blank'> Website</a></li>";
            $msg .= '</ul>';
            $msg .= '<p style = "clear: both">If any of the above information is incorrect, please re - submit this <a href = "http://rent.prabhsingh.com/request" target = "_blank" rel = "external" >form</a> with correct details.</p>';
            $msg .= '<br><br><footer style = "clear:both;font-size: 0.9em; background-color: #D6F5F5"> ';
            $msg .= '<p>This email is being communicated to you since you recently registered your property for rent on rent.prabhsingh.com .If you feel you are victim of a fraud, please contact me at <a href = "mailto:contact@prabhsingh.com" >contact@prabhsingh.com</a></p>';
            $msg .= '<p>Thank You for using our product.</p></footer> ';
            $msg .= '</body></html> ';
            $msg = wordwrap($msg, 70);

            mail($to, $subject, $msg, $headers);
            //End - Mail

            //Enter Form data in JSON File
            $filetxt = 'rent.json';
            // check if the file exists
            if (file_exists($filetxt)) {
                // gets json-data from file
                $jsondata = file_get_contents($filetxt);
                // converts json string into array
                $arr_data = json_decode($jsondata, true);
            }
            // appends the array with new form data
            $arr_data[] = $formdata;
            // encodes the array into a string in JSON format (JSON_PRETTY_PRINT - uses whitespace in json-string, for human readable)
            $jsondata = json_encode($arr_data, JSON_PRETTY_PRINT);

            if (file_put_contents('rent.json', $jsondata)) {
                header('Location: http://rent.prabhsingh.com');
                die('Everything Done, Good Bye!');

            } else die('Unable to save data. Please report to contact@prabhsingh.com for immediately getting this issue resolved');
        } else die ($resp['status'] . "\r\n" . $resp['error_message']);
    } else die('Address Field has been left blank');
} else die('I just want humans to use this website');