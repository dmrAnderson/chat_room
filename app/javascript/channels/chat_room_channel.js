import consumer from "./consumer"

const chatRoomChannel = consumer.subscriptions.create("ChatRoomChannel", {
  connected() {
    $("#modal").css('display', 'flex');
  },

  disconnected() {

  },

  received(data) {
    if(data.chat_room_name) {
      let name = data.chat_room_name;
      let announcement_type = data.type === 'join' ? 'joined' : 'left';

      $('#messages').append(`<p class="announce"><em>${name}</em> ${announcement_type} the room</p>`)
    } else if (data.action === 'is_typing') {
      let current_name = sessionStorage.getItem('chat_room_name');
      let sent_by = data.sent_by;

      if (sent_by !== current_name) {
        let msg = data.typing_status === 'started' ? `${sent_by} started typing…` : '';

        $("#typing_indicator").html(msg)
      }
    } else if (data.message) {
      let current_name = sessionStorage.getItem('chat_room_name');
      let msg_class = data.sent_by === current_name ? "sent" : "received";

      $('#messages').append(`<p class='${msg_class}'>` + data.message + '</p>')
    }
  },

  announce(content) {
    this.perform('announce', { name: content.name, type: content.type })
  },

  is_typing(content) {
    this.perform('is_typing', { name: content.name, type: content.type })
  },

  speak(message) {
    let name = sessionStorage.getItem('chat_room_name')
    this.perform('speak', { message, name })
  }
});

export default chatRoomChannel;
