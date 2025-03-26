package com.ssafy.winedining.domain.collection.repository;

import com.ssafy.winedining.domain.collection.entity.WineNote;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface WineNoteRepository extends JpaRepository<WineNote, Long> {
    List<WineNote> findByBottleId(Long bottleId);
    void deleteByBottleId(Long bottleId);
}