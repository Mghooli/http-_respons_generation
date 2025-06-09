package com.httpdog.model;

import javax.persistence.*;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "users")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String email;

    @Column(nullable = false)
    private String password;

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL)
    private List<SavedList> savedLists = new ArrayList<>();
    
    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL)
    private List<UserSearch> userSearches = new ArrayList<>();

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public List<SavedList> getSavedLists() {
        return savedLists;
    }

    public void setSavedLists(List<SavedList> savedLists) {
        this.savedLists = savedLists;
    }

    public List<UserSearch> getUserSearches() {
        return userSearches;
    }

    public void setUserSearches(List<UserSearch> userSearches) {
        this.userSearches = userSearches;
    }
} 