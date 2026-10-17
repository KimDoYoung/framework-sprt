package kr.co.kfs.asseterp.biz.ics.dto;

/** 내부통제 분류 등록·수정 창 (Ics01_Edit_ClassTree) — 분류코드·분류명. 조회순서는 저장 때 분류코드로 채워진다(원본 update()). parentTreeId는 등록에만 쓴다 */
public record ClassTreeSaveReq(Long parentTreeId, String classTreeCode, String classTreeName, String seq) {
}
