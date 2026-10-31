package kr.co.kfs.asseterp.biz.apr.mapper;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import kr.co.kfs.asseterp.biz.apr.dto.TransportLinkRow;
import kr.co.kfs.asseterp.biz.apr.dto.UnLeaveLinkRow;

/** 인사 링크코드 A15 미사용휴가 지정통보서 · A42 여비교통비 신청서의 본문 값 조회 (V36) */
@Mapper
public interface AprEmpLinkSeedMapper {

    UnLeaveLinkRow selectUnLeaveLink(@Param("companyId") Long companyId, @Param("unLeaveId") Long unLeaveId, @Param("stdYear") String stdYear);

    TransportLinkRow selectTransportLink(@Param("companyId") Long companyId, @Param("personId") Long personId,
                                         @Param("transportExpenseId") Long transportExpenseId);

    /** A70·A71 제목에 들어가는 평가기간 이름 (AS-IS emp43_std_term_nm = f_cdnm('EmpEvalTermCode', …)) */
    String selectEvalTermName(@Param("companyId") Long companyId, @Param("stdTermCode") String stdTermCode);
}
