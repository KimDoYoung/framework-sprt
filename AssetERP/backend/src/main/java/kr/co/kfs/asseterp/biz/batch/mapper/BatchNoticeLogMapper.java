package kr.co.kfs.asseterp.biz.batch.mapper;

import kr.co.kfs.asseterp.biz.batch.dto.BatchNoticeLogParam;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

/** 배치 오류 알림 로그 (AS-IS 테이블: sys97_notice_log) */
@Mapper
public interface BatchNoticeLogMapper {
    int insert(@Param("p") BatchNoticeLogParam param);
}
