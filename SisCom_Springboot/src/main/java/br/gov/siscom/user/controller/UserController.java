package br.gov.siscom.user.controller;


import br.gov.siscom.user.model.User;
import br.gov.siscom.user.service.UserService;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/users")
public class UserController {
    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping
    public List<User> findAllUsers() {
        return userService.getAllUsers();
    }

    @GetMapping("/{id}")
    public User findUserById(@PathVariable UUID id) {
        return userService.getUserById(id);
    }


    @PostMapping
    public User createUser(@RequestBody User user) {
        return userService.addUser(user);
    }

    @PutMapping("/{id}")
    public User updateUser(@PathVariable UUID id, @RequestBody User user) {
        return userService.updateUser(id, user);
    }
}
