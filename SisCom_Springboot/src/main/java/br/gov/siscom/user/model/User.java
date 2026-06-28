package br.gov.siscom.user.model;

import java.util.Collection;
import java.util.List;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

import br.gov.siscom.chat.model.Chat;
import br.gov.siscom.department.model.Department;
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
    @GeneratedValue(strategy=GenerationType.UUID)
    private UUID id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String email;

    @Column(nullable = false)
    private String password;

    @ManyToOne
    @JoinColumn(name = "department_id", nullable=false)
    @NotNull(message="O departamento é obrigatório")
    private Department department;


    @NotNull(message = "O status ativo é obrigatório")
    @Column(nullable = false)
    private Boolean active;

    @NotBlank(message = "O telefone é obrigatório") 
    @Column(nullable = false)
    private String phone;

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "user_roles", joinColumns = @JoinColumn(name = "user_id"))
    @Enumerated(EnumType.STRING)
    @Column(name = "role_name")
    private Set<RoleName> roles;

    @OneToOne
    @JoinColumn(name = "managed_department_id", nullable = true)
    private Department managedDepartment;

    @ManyToMany(mappedBy="participants")
    private List<Chat> chats;

    

    public User(UUID id, String name, String email, String password,
            @NotNull(message = "O departamento é obrigatório") Department department,
            @NotNull(message = "O status ativo é obrigatório") Boolean active,
            @NotBlank(message = "O telefone é obrigatório") String phone, Set<RoleName> roles,
            Department managedDepartment, List<Chat> chats) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.password = password;
        this.department = department;
        this.active = active;
        this.phone = phone;
        this.roles = roles;
        this.managedDepartment = managedDepartment;
        this.chats = chats;
    }

    public User(){}
    

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
    public  String getPassword() {
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

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }



    public List<Chat> getChats() {
        return chats;
    }

    public void setChats(List<Chat> chats) {
        this.chats = chats;
    }

    public Department getManagedDepartment() {
        return managedDepartment;
    }

    public void setManagedDepartment(Department managedDepartment) {
        this.managedDepartment = managedDepartment;
    }


    public void addChat(Chat chat){
        this.chats.add(chat);
    }

    public void removeChat(String id){
        this.chats.removeIf(chat -> chat.getId().equals(id));
    }
}
