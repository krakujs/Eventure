package com.griflet.eventure.base;

import com.griflet.eventure.search.SearchCriteria;
import com.griflet.eventure.search.SearchUtils;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.support.PageableExecutionUtils;

import java.util.Date;
import java.util.List;
import java.util.Optional;

public abstract class BaseServiceImpl<T extends BaseEntity, D extends BaseDTO> implements BaseService<T, D> {
    @Autowired
    protected MongoRepository<T, String> repository;
    @Autowired
    protected MongoTemplate mongoTemplate;
    @Autowired
    protected ModelMapper modelMapper;


    @Override
    public T save(D dto) {
        dto.setId(null);
        dto.setCreatedAt(new Date());
        T entity = modelMapper.map(dto, getEntityClass());
        entity = repository.save(entity);
        afterCreate(entity);
        return entity;
    }

    @Override
    public T update(String id, D dto) {
        dto.setId(id);
        dto.setUpdatedAt(new Date());
        T entity = modelMapper.map(dto, getEntityClass());
        entity = repository.save(entity);
        afterUpdate(entity);
        return entity;
    }


    @Override
    public Optional<T> findById(String id) {
        return repository.findById(id);
    }

    @Override
    public List<T> findAll() {
        return repository.findAll();
    }

    @Override
    public void deleteById(String id) {
        T toDelete = findById(id).orElseThrow();
        repository.delete(toDelete);
        afterDelete(toDelete);
    }

    @Override
    public Page<T> search(List<SearchCriteria> searchCriteria, Pageable pageable) {
        Query query = SearchUtils.createQuery(searchCriteria);
        query.with(pageable);

        List<T> entities = mongoTemplate.find(query, getEntityClass());
        return PageableExecutionUtils.getPage(entities, pageable,
                () -> mongoTemplate.count(Query.of(query).limit(-1).skip(-1), getEntityClass()));
    }


    @Override
    public void afterCreate(T entity) {
        // Default implementation is empty
    }

    @Override
    public void afterUpdate(T entity) {
        // Default implementation is empty
    }

    @Override
    public void afterDelete(T entity) {
        // Default implementation is empty
    }

    protected abstract Class<T> getEntityClass();
}
