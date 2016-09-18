function notify() {
    // Let's check if the browser supports notifications
    if (!("Notification" in window)) {
        alert("This browser does not support desktop notification");
    }

    // Let's check whether notification permissions have already been granted
    else if (Notification.permission === "granted") {
        // If it's okay let's create a notification
        var options = {
            title: 'Successfully Registered your property',
            body: 'Please check your inbox to confirm the accuracy of your property details',
            lang: 'en-US',
            icon: 'images/home.png',
            sound: 'hangout.mp3',
            vibrate: [200, 100, 200]
        }
        var n = new Notification('Registered', options);
        setTimeout(n.close.bind(n), 5000);
    }

    // Otherwise, we need to ask the user for permission
    else if (Notification.permission !== 'denied') {
        Notification.requestPermission(function (permission) {
            // If the user accepts, let's create a notification
            if (permission === "granted") {
                var options = {
                    title: 'Successfully Registered your property',
                    body: 'Please check your inbox to confirm the accuracy of your property details',
                    lang: 'en-US',
                    icon: 'images/home.png',
                    sound: 'hangout.mp3',
                    vibrate: [200, 100, 200]
                }
                var n = new Notification('Registered', options);
                setTimeout(n.close.bind(n), 5000);
            }
        });
    }

}