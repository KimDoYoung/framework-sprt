package kr.co.kfs.asseterp.biz.sys.dto;

/** 매뉴얼 저장 열 (AS-IS update — A34 그리드가 바꾸는 분류·공개·비고). 매뉴얼은 파일 업로드로만 만들어지므로 신규 행은 없다 */
public record ManualSaveReq(
        Long manualId,
        String manualType,
        String publicYn,
        String note
) {
}
