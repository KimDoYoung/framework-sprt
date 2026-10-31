package kr.co.kfs.asseterp.biz.apr.mapper;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import kr.co.kfs.asseterp.biz.apr.dto.HrLinkErrandRow;
import kr.co.kfs.asseterp.biz.apr.dto.HrLinkLeaveRow;
import kr.co.kfs.asseterp.biz.apr.dto.HrLinkOvertimeRow;
import kr.co.kfs.asseterp.biz.apr.dto.HrLinkPmWorkRow;
import kr.co.kfs.asseterp.biz.apr.dto.HrLinkUserRow;

/** 인사·근태 치환형 링크코드(A01·A45·A73·A74)의 양식 값 조회 (V24) */
@Mapper
public interface AprHrLinkSeedMapper {

    HrLinkUserRow selectUserInfo(@Param("personId") Long personId);

    HrLinkLeaveRow selectLeaveLink(@Param("companyId") Long companyId, @Param("leaveId") Long leaveId);

    HrLinkErrandRow selectErrandLink(@Param("companyId") Long companyId, @Param("errandId") Long errandId);

    HrLinkPmWorkRow selectPmWorkLink(@Param("companyId") Long companyId, @Param("pmWorkId") Long pmWorkId);

    HrLinkOvertimeRow selectOvertimeLink(@Param("companyId") Long companyId, @Param("overtimeReqId") Long overtimeReqId);
}
