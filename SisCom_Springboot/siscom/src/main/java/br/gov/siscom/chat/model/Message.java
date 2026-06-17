package br.gov.siscom.chat.model;

import java.util.Date;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class Message {
    private String id;
    private String content;
    private String senderID;
    private Date timestamp;
    private boolean isRead;
}
