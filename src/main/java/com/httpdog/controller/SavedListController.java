package com.httpdog.controller;

import com.httpdog.model.SavedList;
import com.httpdog.model.ListItem;
import com.httpdog.model.User;
import com.httpdog.service.SavedListService;
import com.httpdog.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;


@RestController
@RequestMapping("/api/lists")
@CrossOrigin(origins = "*")
public class SavedListController {
    @Autowired
    private SavedListService savedListService;

    @Autowired
    private UserService userService;

    @GetMapping
    public ResponseEntity<?> getUserLists(Authentication authentication) {
        User user = userService.findByEmail(authentication.getName());
        List<SavedList> lists = savedListService.getUserLists(user.getId());
        return ResponseEntity.ok(lists);
    }

    @PostMapping
    public ResponseEntity<?> createList(@RequestBody Map<String, Object> payload, Authentication authentication) {
        User user = userService.findByEmail(authentication.getName());
        String name = (String) payload.get("name");
        List<Map<String, String>> itemsData = (List<Map<String, String>>) payload.get("items");

        List<ListItem> items = itemsData.stream()
            .map(item -> {
                ListItem listItem = new ListItem();
                listItem.setCode(item.get("code"));
                listItem.setDescription(item.get("description"));
                return listItem;
            })
            .collect(Collectors.toList());

        SavedList list = savedListService.createList(name, user, items);
        return ResponseEntity.ok(list);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getList(@PathVariable Long id) {
        SavedList list = savedListService.getList(id);
        return ResponseEntity.ok(list);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteList(@PathVariable Long id) {
        savedListService.deleteList(id);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateList(@PathVariable Long id, @RequestBody Map<String, Object> payload) {
        String name = (String) payload.get("name");
        List<Map<String, String>> itemsData = (List<Map<String, String>>) payload.get("items");

        List<ListItem> items = itemsData.stream()
            .map(item -> {
                ListItem listItem = new ListItem();
                listItem.setCode(item.get("code"));
                listItem.setDescription(item.get("description"));
                return listItem;
            })
            .collect(Collectors.toList());

        SavedList list = savedListService.updateList(id, name, items);
        return ResponseEntity.ok(list);
    }
} 