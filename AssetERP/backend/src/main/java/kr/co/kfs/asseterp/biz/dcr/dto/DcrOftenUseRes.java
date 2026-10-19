package kr.co.kfs.asseterp.biz.dcr.dto;

/**
 * 최근 사용한 문서분류 (AS-IS Dcr08_OftenUseModel — Dcr08_Lookup_SelectSingle 그리드).
 * 대분류·중분류 ID는 AS-IS가 전체 경로 글자를 " > "로 쪼개 콤보 이름으로 찾던 것을 ID로 바꾼 것이다
 * (이 DB의 f_class_tree_nm_allpath는 '/'로 잇는다).
 */
public record DcrOftenUseRes(Long oftenUseId, Long lClassTreeId, Long mClassTreeId, Long classTreeId, Long classDetailId,
                             String classTreeFullName, String classDetailName, Long count) {
}
