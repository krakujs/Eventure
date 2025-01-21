package com.griflet.eventure.event;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.Date;

@Repository
public interface EventRepository extends MongoRepository<Event, String> {

    Page<Event> findByCreatorIdAndDateAfterOrderByDateAsc(String userId, Date date, Pageable pageable);
}
