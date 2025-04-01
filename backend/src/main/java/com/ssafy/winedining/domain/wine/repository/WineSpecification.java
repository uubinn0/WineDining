// 예: WineSpecification.java
package com.ssafy.winedining.domain.wine.repository;

import com.ssafy.winedining.domain.food.entity.PairingSet;
import com.ssafy.winedining.domain.wine.entity.Wine;
import com.ssafy.winedining.domain.wine.entity.WineType;
import jakarta.persistence.criteria.*;
import org.springframework.data.jpa.domain.Specification;

import java.util.ArrayList;
import java.util.List;

public class WineSpecification {

    // 키워드 검색 (와인 이름에 키워드가 포함된 경우)
    public static Specification<Wine> keywordContains(String keyword) {
        return (root, query, criteriaBuilder) -> {
            if (keyword == null || keyword.isEmpty()) {
                return criteriaBuilder.conjunction();
            }
            return criteriaBuilder.or(
                    criteriaBuilder.like(criteriaBuilder.lower(root.get("krName")), "%" + keyword.toLowerCase() + "%"),
                    criteriaBuilder.like(criteriaBuilder.lower(root.get("enName")), "%" + keyword.toLowerCase() + "%")
            );
        };
    }

    // 가격 범위 검색
    public static Specification<Wine> priceBetween(Integer minPrice, Integer maxPrice) {
        return (root, query, criteriaBuilder) -> {
            if (minPrice == null && maxPrice == null) {
                return criteriaBuilder.conjunction();
            }

            if (minPrice == null) {
                return criteriaBuilder.lessThanOrEqualTo(root.get("price"), maxPrice);
            }

            if (maxPrice == null) {
                return criteriaBuilder.greaterThanOrEqualTo(root.get("price"), minPrice);
            }

            return criteriaBuilder.between(root.get("price"), minPrice, maxPrice);
        };
    }

    // 와인 타입 검색 (숫자 ID 기반: 1:레드, 2:화이트, 3:스파클링, 4:로제)
    public static Specification<Wine> typeIn(List<String> typeNames) {
        return (root, query, criteriaBuilder) -> {
            if (typeNames == null || typeNames.isEmpty()) {
                return criteriaBuilder.conjunction();
            }

            // 타입명을 타입 ID로 변환
            List<Long> typeIds = new ArrayList<>();
            for (String typeName : typeNames) {
                // 타입명에 따라 ID 매핑
                if ("레드".equalsIgnoreCase(typeName) || "red".equalsIgnoreCase(typeName)) {
                    typeIds.add(1L);
                } else if ("화이트".equalsIgnoreCase(typeName) || "white".equalsIgnoreCase(typeName)) {
                    typeIds.add(2L);
                } else if ("스파클링".equalsIgnoreCase(typeName) || "sparkling".equalsIgnoreCase(typeName)) {
                    typeIds.add(3L);
                } else if ("로제".equalsIgnoreCase(typeName) || "rose".equalsIgnoreCase(typeName)) {
                    typeIds.add(4L);
                } else {
                    try {
                        // 이미 숫자 ID로 전달된 경우 그대로 사용
                        typeIds.add(Long.parseLong(typeName));
                    } catch (NumberFormatException e) {
                        // 숫자로 변환할 수 없는 문자열은 무시
                        continue;
                    }
                }
            }

            if (typeIds.isEmpty()) {
                return criteriaBuilder.conjunction();
            }

            return root.get("wineType").get("id").in(typeIds);
        };
    }

    // 포도 품종 검색
    public static Specification<Wine> grapeContains(List<String> grapes) {
        return (root, query, criteriaBuilder) -> {
            if (grapes == null || grapes.isEmpty()) {
                return criteriaBuilder.conjunction();
            }

            Predicate[] predicates = new Predicate[grapes.size()];
            for (int i = 0; i < grapes.size(); i++) {
                predicates[i] = criteriaBuilder.like(
                        criteriaBuilder.lower(root.get("grape")),
                        "%" + grapes.get(i).toLowerCase() + "%"
                );
            }
            return criteriaBuilder.or(predicates);
        };
    }

    // 국가 검색
    public static Specification<Wine> countryIn(List<String> countries) {
        return (root, query, criteriaBuilder) -> {
            if (countries == null || countries.isEmpty()) {
                return criteriaBuilder.conjunction();
            }

            return root.get("country").in(countries);
        };
    }

    // 당도 범위 검색
    public static Specification<Wine> sweetnessBetween(Integer minSweetness, Integer maxSweetness) {
        return (root, query, criteriaBuilder) -> {
            if (minSweetness == null && maxSweetness == null) {
                return criteriaBuilder.conjunction();
            }

            if (minSweetness == null) {
                return criteriaBuilder.lessThanOrEqualTo(root.get("sweetness"), maxSweetness);
            }

            if (maxSweetness == null) {
                return criteriaBuilder.greaterThanOrEqualTo(root.get("sweetness"), minSweetness);
            }

            return criteriaBuilder.between(root.get("sweetness"), minSweetness, maxSweetness);
        };
    }

    // 산미 범위 검색
    public static Specification<Wine> acidityBetween(Integer minAcidity, Integer maxAcidity) {
        return (root, query, criteriaBuilder) -> {
            if (minAcidity == null && maxAcidity == null) {
                return criteriaBuilder.conjunction();
            }

            if (minAcidity == null) {
                return criteriaBuilder.lessThanOrEqualTo(root.get("acidity"), maxAcidity);
            }

            if (maxAcidity == null) {
                return criteriaBuilder.greaterThanOrEqualTo(root.get("acidity"), minAcidity);
            }

            return criteriaBuilder.between(root.get("acidity"), minAcidity, maxAcidity);
        };
    }

    // 타닌 범위 검색
    public static Specification<Wine> tanninBetween(Integer minTannin, Integer maxTannin) {
        return (root, query, criteriaBuilder) -> {
            if (minTannin == null && maxTannin == null) {
                return criteriaBuilder.conjunction();
            }

            if (minTannin == null) {
                return criteriaBuilder.lessThanOrEqualTo(root.get("tannin"), maxTannin);
            }

            if (maxTannin == null) {
                return criteriaBuilder.greaterThanOrEqualTo(root.get("tannin"), minTannin);
            }

            return criteriaBuilder.between(root.get("tannin"), minTannin, maxTannin);
        };
    }

    // 바디감 범위 검색
    public static Specification<Wine> bodyBetween(Integer minBody, Integer maxBody) {
        return (root, query, criteriaBuilder) -> {
            if (minBody == null && maxBody == null) {
                return criteriaBuilder.conjunction();
            }

            if (minBody == null) {
                return criteriaBuilder.lessThanOrEqualTo(root.get("body"), maxBody);
            }

            if (maxBody == null) {
                return criteriaBuilder.greaterThanOrEqualTo(root.get("body"), minBody);
            }

            return criteriaBuilder.between(root.get("body"), minBody, maxBody);
        };
    }

    public static Specification<Wine> hasPairing(List<String> pairingIds) {
        return (root, query, criteriaBuilder) -> {
            if (pairingIds == null || pairingIds.isEmpty()) {
                return criteriaBuilder.conjunction();
            }

            // 중복 제거를 위한 distinct 설정
            query.distinct(true);

            // 숫자 ID로 변환
            List<Long> foodIds = new ArrayList<>();
            for (String id : pairingIds) {
                try {
                    foodIds.add(Long.parseLong(id));
                } catch (NumberFormatException e) {
                    // 숫자가 아닌 경우 무시
                    continue;
                }
            }

            if (foodIds.isEmpty()) {
                return criteriaBuilder.conjunction();
            }

            // 서브쿼리 생성
            Subquery<Long> subquery = query.subquery(Long.class);
            Root<PairingSet> pairingSetRoot = subquery.from(PairingSet.class);

            // PairingSet 엔티티에서 wine_id를 선택
            subquery.select(pairingSetRoot.get("wine").get("id"));

            // food_id가 주어진 foodIds 목록에 포함되는 경우 필터링
            subquery.where(pairingSetRoot.get("food").get("id").in(foodIds));

            // 메인 쿼리에서 와인 ID가 서브쿼리 결과에 포함되는지 확인
            return root.get("id").in(subquery);
        };
    }

    // 페어링 음식 이름으로 검색 (조인 쿼리 사용)
    public static Specification<Wine> hasPairingByName(List<String> pairingFoodNames) {
        return (root, query, criteriaBuilder) -> {
            if (pairingFoodNames == null || pairingFoodNames.isEmpty()) {
                return criteriaBuilder.conjunction();
            }

            // 중복 제거를 위한 distinct 설정
            query.distinct(true);

            // 와인-페어링셋-음식 조인
            Join<Object, Object> pairingSetJoin = root.join("pairingSets", JoinType.LEFT);
            Join<Object, Object> foodJoin = pairingSetJoin.join("food", JoinType.LEFT);

            return foodJoin.get("foodName").in(pairingFoodNames);
        };
    }
}
