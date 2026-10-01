package kr.co.kfs.asseterp.oms.biz.emp.dto;

/** 접속 중 사원 정보 (AS-IS emp01_person.selectByLoginUserPaging) */
public record OnlinePersonRes(Long personId, String companyNm, String korNm, String empNo, String posNm,
                              String officeTelNo, String mobileTelNo) {
}
