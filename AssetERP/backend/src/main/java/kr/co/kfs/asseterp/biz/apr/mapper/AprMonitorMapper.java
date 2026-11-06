package kr.co.kfs.asseterp.biz.apr.mapper;

import kr.co.kfs.asseterp.biz.apr.dto.AprMonitorOutstandingRes;
import kr.co.kfs.asseterp.biz.apr.dto.AprMonitorRequestRes;
import kr.co.kfs.asseterp.biz.apr.dto.AprMonitorTemporaryRes;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.time.LocalDate;
import java.util.List;

/** AS-IS server/apr/mapper/apr01_appr.xml (selectOutstanding · selectMonitorngAppr · selectTemporary) — MyPage 전자결재 박스 */
@Mapper
public interface AprMonitorMapper {

    /** AS-IS apr01_appr.selectOutstanding — 미결함 */
    List<AprMonitorOutstandingRes> selectOutstanding(@Param("companyId") Long companyId, @Param("empId") Long empId);

    /** AS-IS apr01_appr.selectMonitorngAppr — 결재요청함 (완료/반려건은 toDay 기준 7일까지) */
    List<AprMonitorRequestRes> selectMonitorngAppr(@Param("companyId") Long companyId, @Param("empId") Long empId, @Param("toDay") LocalDate toDay);

    /** AS-IS apr01_appr.selectTemporary — 임시저장함 */
    List<AprMonitorTemporaryRes> selectTemporary(@Param("companyId") Long companyId, @Param("empId") Long empId);
}
