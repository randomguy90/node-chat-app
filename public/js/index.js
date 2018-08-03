var socket = io();

socket.on("connect", () => {
    console.log("Connected to server");
    
});

socket.on("newMessage", (message) => {
    var formattedTime = moment(message.createdAt).format("h:mm a");
    var template = jQuery("#message-template").html();
    var html = Mustache.render(template, {
        text: message.text,
        from: message.from,
        createdAt: formattedTime
    });

    jQuery("#messages").append(html);
    
    // var li = jQuery("<li></li>");
    // li.text(`${message.from} ${formattedTime} : ${message.text}`);

    // jQuery("#messages").append(li);
});
socket.on("newLocationMessage", (message) => {
    var formattedTime = moment(message.createdAt).format("h:mm a");
    var template = jQuery("#location-message-template").html();
    var html = Mustache.render(template, {
        url: message.url,
        from: message.from,
        createdAt: formattedTime
    });

    jQuery("#messages").append(html);
});

socket.on("disconnect", () => {
    console.log("Disconected from server");
});

jQuery("#message-form").on("submit", function (e){
    e.preventDefault();

    var messageTextBox = jQuery("[name=message");

    socket.emit("createMessage", {
        from: "User",
        text: messageTextBox.val()
    }, function () {
        messageTextBox.val("");
    });

});

var locationButton = jQuery("#send-location");

locationButton.on("click", function() {
    if(!navigator.geolocation){
        return alert("Geolocation not supported by your browser");
    }

    locationButton.attr("disabled", "disabled").text("Sending location...")
    navigator.geolocation.getCurrentPosition(function (position) {
        locationButton.removeAttr("disabled").text("Send location");
        socket.emit("createLocationMessage", {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
        });
    },
    function () {
        alert("Unable to fetch location");
        locationButton.removeAttr("disabled").text("Send location");
    });
});
