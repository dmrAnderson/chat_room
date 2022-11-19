// This file is automatically compiled by Webpack, along with any other files
// present in this directory. You're encouraged to place your actual application logic in
// a relevant structure within app/javascript and only use these pack files to reference
// that code so it'll be compiled.

import Rails from "@rails/ujs"
import Turbolinks from "turbolinks"
import * as ActiveStorage from "@rails/activestorage"
import "channels"

Rails.start()
Turbolinks.start()
ActiveStorage.start()

require("jquery")

import chatRoomChannel from "../channels/chat_room_channel";

$(document).on('turbolinks:load', function () {
    $("form#set_name").on('submit', function(e){
        e.preventDefault();
        let name = $('#add_name').val();
        sessionStorage.setItem('chat_room_name', name)
        console.log(chatRoomChannel)
        chatRoomChannel.announce({ name, type: 'join'})
        $("#modal").css('display', 'none');
    });

    $("form#send_message").on('submit', function(e){
        e.preventDefault();
        let message = $('#message');
        if (message.length > 0) {
            chatRoomChannel.speak(message.val());
            message.val('')
        }
    });

    $(window).on('beforeunload', function() {
        let name = sessionStorage.getItem('chat_room_name')
        chatRoomChannel.announce({ name, type: 'leave'})
    });

    $("form#send_message").on('keydown', function() {

        let name = sessionStorage.getItem('chat_room_name')
        chatRoomChannel.is_typing({ name, type: 'started'})
    });

    $("form#send_message").on('keyup', function() {
        console.log('stop')
        let name = sessionStorage.getItem('chat_room_name')
        chatRoomChannel.is_typing({ name, type: 'stopped'})
    });
})
