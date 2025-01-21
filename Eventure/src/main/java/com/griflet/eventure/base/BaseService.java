package com.griflet.eventure.base;

import com.griflet.eventure.search.SearchCriteria;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;
import java.util.Optional;

public interface BaseService<T extends BaseEntity, D extends BaseDTO> {
    T save(D dto);

    T update(String id, D dto);

    Optional<T> findById(String id);

    List<T> findAll();

    void deleteById(String id);

    Page<T> search(List<SearchCriteria> searchCriteria, Pageable pageable);

    void afterCreate(T entity);

    void afterUpdate(T entity);

    void afterDelete(T entity);
}
