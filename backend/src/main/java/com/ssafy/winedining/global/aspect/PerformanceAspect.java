package com.ssafy.winedining.global.aspect;

import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.reflect.MethodSignature;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;
import org.springframework.util.StopWatch;

import java.util.Arrays;

@Aspect
@Component
public class PerformanceAspect {

    private static final Logger logger = LoggerFactory.getLogger(PerformanceAspect.class);

    // OpenAI 서비스 메소드에 대한 성능 측정
    @Around("execution(* com.ssafy.winedining.domain.recommend.service.OpenAIService.*(..))")
    public Object measureOpenAiServiceTime(ProceedingJoinPoint joinPoint) throws Throwable {
        StopWatch stopWatch = new StopWatch();

        // 메소드 시그니처 및 파라미터 정보 로깅
        String methodName = joinPoint.getSignature().getName();
        String className = joinPoint.getTarget().getClass().getSimpleName();
        Object[] args = joinPoint.getArgs();

        String params = "";
        if (args != null && args.length > 0) {
            params = Arrays.toString(args);
            // 너무 긴 파라미터는 축약
            if (params.length() > 100) {
                params = params.substring(0, 100) + "...";
            }
        }

        logger.info("[Performance] Starting {} ({}) with params: {}", methodName, className, params);

        try {
            stopWatch.start();
            return joinPoint.proceed();
        } finally {
            stopWatch.stop();
            logger.info("[Performance] {}.{} execution time: {} ms",
                    className, methodName, stopWatch.getTotalTimeMillis());
        }
    }

    // 추천 서비스 메소드에 대한 성능 측정
    @Around("execution(* com.ssafy.winedining.domain.recommend.service.RecommendService.*(..))")
    public Object measureRecommendServiceTime(ProceedingJoinPoint joinPoint) throws Throwable {
        StopWatch stopWatch = new StopWatch();
        String methodName = joinPoint.getSignature().getName();
        String className = joinPoint.getTarget().getClass().getSimpleName();

        logger.info("[Performance] Starting recommendation process: {}.{}", className, methodName);

        try {
            stopWatch.start();
            return joinPoint.proceed();
        } finally {
            stopWatch.stop();
            logger.info("[Performance] {}.{} total execution time: {} ms",
                    className, methodName, stopWatch.getTotalTimeMillis());
        }
    }

    // 음식 유사성 검색 메소드에 대한 성능 측정
    @Around("execution(* com.ssafy.winedining.domain.recommend.service.moduleService.FoodSimilarityService.*(..))")
    public Object measureFoodSimilarityTime(ProceedingJoinPoint joinPoint) throws Throwable {
        StopWatch stopWatch = new StopWatch();
        String methodName = joinPoint.getSignature().getName();
        String className = joinPoint.getTarget().getClass().getSimpleName();

        Object[] args = joinPoint.getArgs();
        logger.info("[Performance] Starting food similarity search for: {}", Arrays.toString(args));

        try {
            stopWatch.start();
            return joinPoint.proceed();
        } finally {
            stopWatch.stop();
            logger.info("[Performance] {}.{} execution time: {} ms",
                    className, methodName, stopWatch.getTotalTimeMillis());
        }
    }
}
