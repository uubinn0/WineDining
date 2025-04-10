package com.ssafy.winedining.global.common.aop;

import lombok.extern.slf4j.Slf4j;
import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.springframework.stereotype.Component;

@Aspect
@Component
@Slf4j
public class PerformanceAspect {

    @Around("execution(* com.ssafy.winedining.domain.*.service.*.*(..))")
    public Object measureExecutionTime(ProceedingJoinPoint joinPoint) throws Throwable {
        // 시작 시간 기록
        long startTime = System.currentTimeMillis();

        // 쿼리 카운터 초기화
        QueryCounter.clear();

        // 메서드 실행
        Object result = joinPoint.proceed();

        // 종료 시간 기록
        long endTime = System.currentTimeMillis();
        long duration = endTime - startTime;

        // 로그 기록
        String className = joinPoint.getSignature().getDeclaringTypeName();
        String methodName = joinPoint.getSignature().getName();
        log.info("[Performance] {}.{} executed in {} ms with {} SQL queries",
                className, methodName, duration, QueryCounter.getCount());

        // 특정 임계값 이상일 때 경고 로그
        if (duration > 500) {
            log.warn("[Performance Warning] {}.{} took too long: {} ms",
                    className, methodName, duration);
        }

        if (QueryCounter.getCount() > 10) {
            log.warn("[Performance Warning] {}.{} executed too many queries: {}",
                    className, methodName, QueryCounter.getCount());
        }

        return result;
    }
}