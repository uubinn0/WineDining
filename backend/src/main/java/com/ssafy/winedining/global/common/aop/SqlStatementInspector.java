package com.ssafy.winedining.global.common.aop;

import org.hibernate.resource.jdbc.spi.StatementInspector;
import org.springframework.stereotype.Component;

@Component
public class SqlStatementInspector implements StatementInspector {
    @Override
    public String inspect(String sql) {
        QueryCounter.increment();
        return sql;
    }
}