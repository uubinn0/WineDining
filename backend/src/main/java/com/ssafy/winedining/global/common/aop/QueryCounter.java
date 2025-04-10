package com.ssafy.winedining.global.common.aop;

import org.springframework.stereotype.Component;

@Component
public class QueryCounter {
    // ThreadLocal을 사용하여 스레드별로 카운터 값을 독립적으로 관리
    private static final ThreadLocal<Integer> queryCount = ThreadLocal.withInitial(() -> 0);

    public static void increment() {
        queryCount.set(queryCount.get() + 1);
    }

    public static int getCount() {
        return queryCount.get();
    }

    public static void clear() {
        queryCount.set(0);
    }
}