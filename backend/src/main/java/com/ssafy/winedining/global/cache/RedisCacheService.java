package com.ssafy.winedining.global.cache;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Slf4j
public class RedisCacheService {

    private final RedisTemplate<String, Object> redisTemplate;

    /**
     * 키에 해당하는 값을 캐시에서 조회
     *
     * @param key 캐시 키
     * @param <T> 반환 타입
     * @return 캐시된 값 (Optional로 래핑)
     */
    @SuppressWarnings("unchecked")
    public <T> Optional<T> get(String key) {
        try {
            Object value = redisTemplate.opsForValue().get(key);
            if (value == null) {
                return Optional.empty();
            }
            return Optional.of((T) value);
        } catch (Exception e) {
            log.error("Redis 캐시 조회 중 오류 발생: {}", e.getMessage());
            return Optional.empty();
        }
    }

    /**
     * 키와 값을 캐시에 저장 (만료 시간 설정)
     *
     * @param key 캐시 키
     * @param value 저장할 값
     * @param timeout 만료 시간(초)
     */
    public void set(String key, Object value, long timeout) {
        try {
            redisTemplate.opsForValue().set(key, value, Duration.ofSeconds(timeout));
            log.debug("Redis 캐시에 저장 완료: key={}, timeout={}초", key, timeout);
        } catch (Exception e) {
            log.error("Redis 캐시 저장 중 오류 발생: key={}, error={}", key, e.getMessage());
        }
    }

    /**
     * 키와 값을 캐시에 저장 (영구 저장)
     *
     * @param key 캐시 키
     * @param value 저장할 값
     */
    public void setWithoutExpiration(String key, Object value) {
        try {
            redisTemplate.opsForValue().set(key, value);
            log.debug("Redis 캐시에 영구 저장 완료: key={}", key);
        } catch (Exception e) {
            log.error("Redis 캐시 영구 저장 중 오류 발생: key={}, error={}", key, e.getMessage());
        }
    }

    /**
     * 키에 해당하는 캐시 삭제
     *
     * @param key 캐시 키
     */
    public void delete(String key) {
        try {
            redisTemplate.delete(key);
            log.debug("Redis 캐시에서 삭제 완료: key={}", key);
        } catch (Exception e) {
            log.error("Redis 캐시 삭제 중 오류 발생: key={}, error={}", key, e.getMessage());
        }
    }

    /**
     * 키 존재 여부 확인
     *
     * @param key 캐시 키
     * @return 존재 여부
     */
    public boolean hasKey(String key) {
        try {
            Boolean hasKey = redisTemplate.hasKey(key);
            return hasKey != null && hasKey;
        } catch (Exception e) {
            log.error("Redis 캐시 키 확인 중 오류 발생: key={}, error={}", key, e.getMessage());
            return false;
        }
    }
}