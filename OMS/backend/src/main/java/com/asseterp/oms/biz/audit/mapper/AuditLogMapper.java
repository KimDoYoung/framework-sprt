package com.asseterp.oms.biz.audit.mapper;

import com.asseterp.oms.biz.audit.dto.AuditLogRecord;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface AuditLogMapper {
    int insert(AuditLogRecord auditLog);
    List<AuditLogRecord> findRecent(@Param("limit") int limit);
}
