package kr.co.kfs.asseterp.biz.emp.dto;

import java.time.LocalDate;
import java.time.LocalDateTime;

/**
 * 사원정보 목록 행 (AS-IS Emp00_TransInfoModel — 그리드·기본정보 탭이 쓰는 값만).
 * 발령(emp03) 기준 한 행이고 사람(emp01)·기타(emp02)·조직(org00) 값이 붙는다.
 */
public record TransInfoRes(
        Long transId,
        Long personId,
        LocalDateTime transDate,
        String transCd,
        String transNm,
        String kindCd,
        String kindNm,
        String posCd,
        String posNm,
        String titleCd,
        String titleNm,
        Long orgCodeId,
        String orgKorNm,
        String parentFullNm,
        String officerYn,
        LocalDateTime expiryDate,
        String empNo,
        String korNm,
        String orderSeq,
        String hireCd,
        String hireNm,
        String applyCd,
        String applyNm,
        LocalDate hireDate,
        String retireDate,
        String emailAddr,
        String officeTelNo,
        String officeDetail,
        String mobileTelNo,
        String note,
        String financeProYn,
        LocalDateTime birthday,
        String genderNm
) {
}
