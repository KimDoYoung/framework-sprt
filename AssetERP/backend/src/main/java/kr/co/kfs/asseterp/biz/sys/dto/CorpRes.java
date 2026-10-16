package kr.co.kfs.asseterp.biz.sys.dto;

/** Sys15_CorpModel (sys15_corp + corpTypeName·corpAccountCnt 계산 컬럼). 사용 여부(useYn)는 DB 그대로 'true'/'false' */
public record CorpRes(Long corpId, Long companyId, String corpType, String corpTypeName, String corpName, String bizNo,
                      String corpCode, Long seq, String useYn, String note, String tel, String addr, String issCorpCode,
                      String corpAccountCnt) {
}
