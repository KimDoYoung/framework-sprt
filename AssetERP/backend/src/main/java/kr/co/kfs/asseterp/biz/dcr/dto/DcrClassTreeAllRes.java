package kr.co.kfs.asseterp.biz.dcr.dto;

/** 문서분류 전체 트리 한 행 (AS-IS selectByAll — 사용여부 설정 조회창). apprCount는 문서구분(T)만 */
public record DcrClassTreeAllRes(Long classTreeId, Long parentTreeId, String classTreeName, String typeCode,
                                 String useYn, Long apprCount, Integer depth) {
}
