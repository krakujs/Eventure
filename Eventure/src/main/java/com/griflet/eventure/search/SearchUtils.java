package com.griflet.eventure.search;

import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;

import java.util.List;

public class SearchUtils {

    public static Query createQuery(List<SearchCriteria> searchCriteria) {
        Query query = new Query();

        for (SearchCriteria criteria : searchCriteria) {
            String key = criteria.getKey();
            SearchOperation operation = criteria.getOperation();
            Object value = criteria.getValue();

            switch (operation) {
                case GREATER_THAN:
                    query.addCriteria(Criteria.where(key).gt(value));
                    break;
                case LESS_THAN:
                    query.addCriteria(Criteria.where(key).lt(value));
                    break;
                case GREATER_THAN_EQUAL:
                    query.addCriteria(Criteria.where(key).gte(value));
                    break;
                case LESS_THAN_EQUAL:
                    query.addCriteria(Criteria.where(key).lte(value));
                    break;
                case EQUAL:
                    query.addCriteria(Criteria.where(key).is(value));
                    break;
                case CONTAINS:
                    query.addCriteria(Criteria.where(key).regex(value.toString(), "i"));
                    break;
            }
        }

        return query;
    }
}