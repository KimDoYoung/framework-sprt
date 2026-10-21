package kr.co.kfs.asseterp.biz.flt.dto;

/** 의무보유기간 위반 체크 방식 (AS-IS Flt01_Lookup_LockUpCheckType → Flt01_CompanyStd.updateOne, J09) */
public record CompanyStdLockupReq(String lockUpCode, Long lockUpDays, String lockUpCalcStdCode,
                                  String buyOprDayYn, String buyOprMonthYn) {
}
