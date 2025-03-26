// 예: WineSpecification.java
package com.ssafy.winedining.domain.wine.repository;

import com.ssafy.winedining.domain.wine.entity.Wine;
import org.springframework.data.jpa.domain.Specification;

public class WineSpecification {

    public static Specification<Wine> keywordContains(String keyword) {
        return (root, query, criteriaBuilder) -> {
            if(keyword == null || keyword.trim().isEmpty()){
                return criteriaBuilder.conjunction();
            }
            // 예시: krName과 enName 모두에서 검색
            return criteriaBuilder.or(
                    criteriaBuilder.like(root.get("krName"), "%" + keyword + "%"),
                    criteriaBuilder.like(root.get("enName"), "%" + keyword + "%")
            );
        };
    }

    // 필터별 동적 조건 추가 (ex: 가격 범위, 맛 특성 등)
    public static Specification<Wine> priceBetween(Integer minPrice, Integer maxPrice) {
        return (root, query, criteriaBuilder) -> {
            if(minPrice == null && maxPrice == null) {
                return criteriaBuilder.conjunction();
            } else if(minPrice != null && maxPrice != null) {
                return criteriaBuilder.between(root.get("price"), minPrice, maxPrice);
            } else if(minPrice != null) {
                return criteriaBuilder.greaterThanOrEqualTo(root.get("price"), minPrice);
            } else {
                return criteriaBuilder.lessThanOrEqualTo(root.get("price"), maxPrice);
            }
        };
    }

    // 추가로 grape, country, sweetness 등 필터 조건을 메서드로 작성할 수 있습니다.
}
