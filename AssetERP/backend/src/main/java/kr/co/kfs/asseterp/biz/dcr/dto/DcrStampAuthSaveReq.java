package kr.co.kfs.asseterp.biz.dcr.dto;

/** 인감별 미사용 문서분류 저장 한 행 (AS-IS Dcr40_StampAuth.updateList, G07). stampExceptYn은 'true'/'false' */
public record DcrStampAuthSaveReq(Long classTreeId, String stampExceptYn) {
}
