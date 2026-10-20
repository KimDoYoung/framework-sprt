package kr.co.kfs.asseterp.biz.dcr.dto;

/**
 * 인감별 미사용 문서분류 트리 한 행 (AS-IS selectByAllWithStampAuth — Dcr40_Lookup_StampAuth, G07). 전위 순서 평평한 목록 + depth(0부터).
 * classTreeName 끝의 "(n)"은 그 분류와 하위 분류 중 이 인감을 미사용으로 둔 수. stampExceptYn은 'true'/'false' ('false'는 행이 없을 때도)
 */
public record DcrStampAuthTreeRes(Long classTreeId, Long parentTreeId, String classTreeName, String typeCode, String stampExceptYn, Integer depth) {
}
