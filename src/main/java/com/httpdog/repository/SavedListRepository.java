package com.httpdog.repository;

import com.httpdog.model.SavedList;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface SavedListRepository extends JpaRepository<SavedList, Long> {
    List<SavedList> findByUserId(Long userId);
} 