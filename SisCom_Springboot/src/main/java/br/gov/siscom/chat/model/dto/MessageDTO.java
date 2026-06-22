package br.gov.siscom.chat.model.dto;

import java.util.UUID;

public class MessageDTO {
    private String content;
    private UUID senderId;
    private UUID chatId;

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public UUID getSenderId() {
        return senderId;
    }

    public void setSenderId(UUID senderId) {
        this.senderId = senderId;
    }

    public UUID getChatId() {
        return chatId;
    }

    public void setChatId(UUID chatId) {
        this.chatId = chatId;
    }


}
