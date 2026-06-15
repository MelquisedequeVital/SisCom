package br.gov.siscom.models;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class User {
    private String id;
    private String name;
    private Department dept;
    private String email;
    private boolean isAdmin;
    private boolean active;
    private String phone;
    private boolean isManager;
    private Department manegedDepartment;
    private List<Chat> chats;

    public void addChat(Chat chat){
        this.chats.add(chat);
    }
}
