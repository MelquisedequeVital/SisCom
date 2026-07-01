package br.gov.siscom.user.model;

import java.time.LocalDateTime;
import java.util.Collection;
import java.util.List;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

import br.gov.siscom.chat.model.Chat;
import br.gov.siscom.department.model.Department;
import br.gov.siscom.user.model.enums.RoleName;
import jakarta.persistence.CascadeType;
import jakarta.persistence.CollectionTable;
import jakarta.persistence.Column;
import jakarta.persistence.ElementCollection;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToOne;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

@Entity
@Table(name = "servidor_publico")
public class User implements UserDetails {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    private String password;

    @ManyToOne
    @JoinColumn(name = "department_id", nullable = false)
    @NotNull(message = "O departamento é obrigatório")
    private Department department;

    @NotNull(message = "O status ativo é obrigatório")
    @Column(nullable = false)
    private Boolean active;

    @Column
    private String phone;


    @NotNull(message = "A data de criação é obrigatória")
    @Column(nullable = false)
    private LocalDateTime createdAt;

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "user_roles", joinColumns = @JoinColumn(name = "user_id"))
    @Enumerated(EnumType.STRING)
    @Column(name = "role_name")
    private Set<RoleName> roles;

    @OneToOne
    @JoinColumn(name = "managed_department_id", nullable = true)
    private Department managedDepartment;

    @ManyToMany(mappedBy = "participants", cascade = CascadeType.REMOVE)
    private List<Chat> chats;

 
public User(UUID id, String name, String email, String password, Department department, Boolean active, Set<RoleName> roles, Department managedDepartment, List<Chat> chats, String phone) {
    this.id = id;
    this.name = name;
    this.email = email;
    this.password = password;
    this.department = department;
    this.active = active;
    this.roles = roles;
    this.managedDepartment = managedDepartment;
    this.chats = chats;
    this.phone = phone; // <-- adicione aqui
}

    public User() {
    }

    public Set<RoleName> getRoles() {
        return roles;
    }

    public void setRoles(Set<RoleName> roles) {
        this.roles = roles;
    }

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return this.roles.stream()
                .map(role -> new SimpleGrantedAuthority(role.name()))
                .collect(Collectors.toList());
    }

    @Override
    public String getPassword() {
        return password;
    }

    @Override
    public String getUsername() {
        return this.email;
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return this.active;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public Department getDepartment() {
        return department;
    }

    public void setDepartment(Department department) {
        this.department = department;
    }

    public Boolean getActive() {
        return active;
    }

    public void setActive(Boolean active) {
        this.active = active;
    }


    public List<Chat> getChats() {
        return chats;
    }

    public void setChats(List<Chat> chats) {
        this.chats = chats;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
    }

    public Department getManagedDepartment() {
        return managedDepartment;
    }

    public void setManagedDepartment(Department managedDepartment) {
        this.managedDepartment = managedDepartment;
    }

    

    public String getEmail() {
        return email;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public void addChat(Chat chat) {
        this.chats.add(chat);
    }

    public void removeChat(String id) {
        this.chats.removeIf(chat -> chat.getId().equals(id));
    }
}

// package br.gov.siscom.user.model;

// import java.time.LocalDateTime;
// import java.util.Collection;
// import java.util.HashSet; // 🌟 Importado
// import java.util.List;
// import java.util.Set;
// import java.util.UUID;
// import java.util.stream.Collectors;

// import com.fasterxml.jackson.annotation.JsonIgnore; // 🌟 Importado
// import com.fasterxml.jackson.annotation.JsonIgnoreProperties; // 🌟 Importado
// import br.gov.siscom.chat.model.Chat;
// import br.gov.siscom.department.model.Department;
// import br.gov.siscom.user.model.enums.RoleName;
// import jakarta.persistence.CascadeType;
// import jakarta.persistence.CollectionTable;
// import jakarta.persistence.Column;
// import jakarta.persistence.ElementCollection;
// import jakarta.persistence.Entity;
// import jakarta.persistence.EnumType;
// import jakarta.persistence.Enumerated;
// import jakarta.persistence.FetchType;
// import jakarta.persistence.GeneratedValue;
// import jakarta.persistence.GenerationType;
// import jakarta.persistence.Id;
// import jakarta.persistence.JoinColumn;
// import jakarta.persistence.ManyToMany;
// import jakarta.persistence.ManyToOne;
// import jakarta.persistence.OneToOne;
// import jakarta.persistence.PrePersist;
// import jakarta.persistence.Table;
// import jakarta.validation.constraints.NotNull;
// import org.springframework.security.core.GrantedAuthority;
// import org.springframework.security.core.authority.SimpleGrantedAuthority;
// import org.springframework.security.core.userdetails.UserDetails;

// @Entity
// @Table(name = "servidor_publico")
// public class User implements UserDetails {
//     @Id
//     @GeneratedValue(strategy = GenerationType.UUID)
//     private UUID id;

//     @Column(nullable = false)
//     private String name;

//     @Column(nullable = false, unique = true)
//     private String email;

//     @Column(nullable = false)
//     @JsonIgnore // 🌟 Segurança: Nunca devolve o hash da senha no JSON para o Angular
//     private String password;

//     @ManyToOne
//     @JoinColumn(name = "department_id", nullable = false)
//     @NotNull(message = "O departamento é obrigatório")
//     private Department department;

//     @NotNull(message = "O status ativo é obrigatório")
//     @Column(nullable = false)
//     private Boolean active;

//     @Column
//     private String phone;

//     @NotNull(message = "A data de criação é obrigatória")
//     @Column(nullable = false)
//     private LocalDateTime createdAt;

//     @ElementCollection(fetch = FetchType.EAGER)
//     @CollectionTable(name = "user_roles", joinColumns = @JoinColumn(name = "user_id"))
//     @Enumerated(EnumType.STRING)
//     @Column(name = "role_name")
//     private Set<RoleName> roles = new HashSet<>(); // 🌟 CORREÇÃO 1: Inicializado para evitar NullPointerException no stream()

//     @OneToOne
//     @JoinColumn(name = "managed_department_id", nullable = true)
//     private Department managedDepartment;

//     @ManyToMany(mappedBy = "participants", cascade = CascadeType.REMOVE)
//     @JsonIgnoreProperties("participants") // 🌟 CORREÇÃO 2: Evita o loop infinito (Nesting depth 501) com a lista de chats
//     private List<Chat> chats;

//     public User(UUID id, String name, String email, String password, Department department, Boolean active, Set<RoleName> roles, Department managedDepartment, List<Chat> chats, String phone) {
//         this.id = id;
//         this.name = name;
//         this.email = email;
//         this.password = password;
//         this.department = department;
//         this.active = active;
//         this.roles = roles != null ? roles : new HashSet<>(); // 🌟 Proteção no construtor
//         this.managedDepartment = managedDepartment;
//         this.chats = chats;
//         this.phone = phone;
//     }

//     public User() {
//     }

//     public Set<RoleName> getRoles() {
//         return roles;
//     }

//     public void setRoles(Set<RoleName> roles) {
//         this.roles = roles != null ? roles : new HashSet<>();
//     }

//     public UUID getId() {
//         return id;
//     }

//     public void setId(UUID id) {
//         this.id = id;
//     }

//     public String getName() {
//         return name;
//     }

//     public void setName(String name) {
//         this.name = name;
//     }

//     public void setEmail(String email) {
//         this.email = email;
//     }

//     @Override
//     public Collection<? extends GrantedAuthority> getAuthorities() {
//         // 🌟 Proteção redundante para garantir que não quebre caso passe um nulo por reflexão externa
//         if (this.roles == null) {
//             return List.of();
//         }
//         return this.roles.stream()
//                 .map(role -> new SimpleGrantedAuthority(role.name()))
//                 .collect(Collectors.toList());
//     }

//     @Override
//     public String getPassword() {
//         return password;
//     }

//     @Override
//     public String getUsername() {
//         return this.email;
//     }

//     @Override
//     public boolean isAccountNonExpired() {
//         return true;
//     }

//     @Override
//     public boolean isAccountNonLocked() {
//         return true;
//     }

//     @Override
//     public boolean isCredentialsNonExpired() {
//         return true;
//     }

//     @Override
//     public boolean isEnabled() {
//         return this.active;
//     }

//     public void setPassword(String password) {
//         this.password = password;
//     }

//     public Department getDepartment() {
//         return department;
//     }

//     public void setDepartment(Department department) {
//         this.department = department;
//     }

//     public Boolean getActive() {
//         return active;
//     }

//     public void setActive(Boolean active) {
//         this.active = active;
//     }

//     public List<Chat> getChats() {
//         return chats;
//     }

//     public void setChats(List<Chat> chats) {
//         this.chats = chats;
//     }

//     public LocalDateTime getCreatedAt() {
//         return createdAt;
//     }

//     @PrePersist
//     protected void onCreate() {
//         this.createdAt = LocalDateTime.now();
//     }

//     public Department getManagedDepartment() {
//         return managedDepartment;
//     }

//     public void setManagedDepartment(Department managedDepartment) {
//         this.managedDepartment = managedDepartment;
//     }

//     public String getEmail() {
//         return email;
//     }

//     public String getPhone() {
//         return phone;
//     }

//     public void setPhone(String phone) {
//         this.phone = phone;
//     }

//     public void setCreatedAt(LocalDateTime createdAt) {
//         this.createdAt = createdAt;
//     }

//     public void addChat(Chat chat) {
//         this.chats.add(chat);
//     }

//     public void removeChat(String id) {
//         if (this.chats != null) {
//             this.chats.removeIf(chat -> chat.getId().equals(id));
//         }
//     }
// }