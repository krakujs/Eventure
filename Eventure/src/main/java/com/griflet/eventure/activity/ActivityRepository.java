package com.griflet.eventure.activity;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ActivityRepository extends MongoRepository<Activity, String> {
    Page<Activity> findByUserIdOrderByCreatedAtDesc(String userId, Pageable pageable);
}
