package br.gov.siscom.models;

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
