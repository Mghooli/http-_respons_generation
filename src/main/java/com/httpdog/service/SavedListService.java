package com.httpdog.service;

import com.httpdog.model.SavedList;
import com.httpdog.model.ListItem;
import com.httpdog.model.User;
import com.httpdog.repository.SavedListRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class SavedListService {
    @Autowired
    private SavedListRepository savedListRepository;

    public SavedList createList(String name, User user, List<ListItem> items) {
        SavedList list = new SavedList();
        list.setName(name);
        list.setUser(user);
        list.setItems(items);
        items.forEach(item -> item.setSavedList(list));
        return savedListRepository.save(list);
    }

    public List<SavedList> getUserLists(Long userId) {
        return savedListRepository.findByUserId(userId);
    }

    public SavedList getList(Long listId) {
        return savedListRepository.findById(listId)
                .orElseThrow(() -> new RuntimeException("List not found"));
    }

    public void deleteList(Long listId) {
        savedListRepository.deleteById(listId);
    }

    public SavedList updateList(Long listId, String name, List<ListItem> items) {
        SavedList list = getList(listId);
        list.setName(name);
        list.getItems().clear();
        list.getItems().addAll(items);
        items.forEach(item -> item.setSavedList(list));
        return savedListRepository.save(list);
    }
} 