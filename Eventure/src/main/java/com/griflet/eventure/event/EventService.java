package com.griflet.eventure.event;

import com.griflet.eventure.base.BaseService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface EventService extends BaseService<Event, EventDTO> {

    Page<Event> findUpcomingEvents(String userId, Pageable pageable);

}