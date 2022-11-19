class ChatRoomChannel < ApplicationCable::Channel
  CHANNEL_NAME = self.name.underscore

  def subscribed
    stream_from(CHANNEL_NAME)
  end

  def unsubscribed
    # Any cleanup needed when channel is unsubscribed
  end

  def announce(data)
    broadcast(chat_room_name: data['name'], type: data['type'])
  end

  def is_typing(data)
    broadcast(action: data['action'], typing_status: data['type'], sent_by: data['name'])
  end

  def speak(data)
    broadcast(message: data['message'], sent_by: data['name'])
  end

  private

  def broadcast(options)
    ActionCable.server.broadcast(CHANNEL_NAME, options)
  end
end
