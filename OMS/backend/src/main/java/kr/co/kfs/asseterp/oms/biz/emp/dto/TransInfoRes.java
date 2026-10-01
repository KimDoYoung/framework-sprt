package kr.co.kfs.asseterp.oms.biz.emp.dto;

import java.time.LocalDate;

/**
 * 사원 현재 정보 (AS-IS emp00_trans_info.selectByText / selectOneByPersonId → Emp00_TransInfoModel 중 화면에 쓰는 컬럼)
 *
 * @param transId      기준일 현재 발령 (emp00_trans_id)
 * @param parentFullNm 본부(부서) 전체 이름
 * @param financeProYn 전문인력 (AS-IS도 emp08_license DROP으로 항상 false)
 */
public record TransInfoRes(
        Long transId,
        Long personId,
        String empNo,
        String korNm,
        Long orgCodeId,
        String orgKorNm,
        String parentFullNm,
        String transCd,
        String kindCd,
        String kindNm,
        String posCd,
        String posNm,
        String titleCd,
        String titleNm,
        LocalDate hireDate,
        String officeDetail,
        String mobileTelno,
        String emailAddr,
        String orderSeq,
        boolean financeProYn
) {
}
