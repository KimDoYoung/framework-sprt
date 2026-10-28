package kr.co.kfs.asseterp.biz.emp.mapper;

import kr.co.kfs.asseterp.biz.emp.dto.EtcLeavePersonRes;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface EmpEtcLeavePersonMapper {

    List<EtcLeavePersonRes> selectByEtcLeaveId(@Param("companyId") Long companyId, @Param("etcLeaveId") Long etcLeaveId);

    EtcLeavePersonRes selectById(@Param("companyId") Long companyId, @Param("etcLeavePersonId") Long etcLeavePersonId);

    /** 상신 ID 확인용 — 포상휴가가 로그인 회사 것이 아니면 null (AS-IS emp22_etc_leave.selectById 의 emp22_appr_id) */
    Long selectApprId(@Param("companyId") Long companyId, @Param("etcLeaveId") Long etcLeaveId);

    int countEtcLeave(@Param("companyId") Long companyId, @Param("etcLeaveId") Long etcLeaveId);

    /** 이 대상 직원 행이 속한 포상휴가 ID 목록 */
    List<Long> selectEtcLeaveIds(@Param("companyId") Long companyId, @Param("etcLeavePersonIds") List<Long> etcLeavePersonIds);

    Long selectNextId();

    /** 포상휴가와 사원이 모두 로그인 회사 것일 때만 넣는다(0이면 회사 불일치) */
    int insertEtcLeavePerson(@Param("companyId") Long companyId, @Param("etcLeavePersonId") Long etcLeavePersonId,
                             @Param("etcLeaveId") Long etcLeaveId, @Param("personId") Long personId);

    int deleteEtcLeavePersons(@Param("companyId") Long companyId, @Param("etcLeavePersonIds") List<Long> etcLeavePersonIds);
}
