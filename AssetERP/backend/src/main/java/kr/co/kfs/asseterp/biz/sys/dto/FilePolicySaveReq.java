package kr.co.kfs.asseterp.biz.sys.dto;

/** 파일보안정책 저장 열 (AS-IS update). filePolicyId ≤ 0이면 신규 */
public record FilePolicySaveReq(
        Long filePolicyId,
        String ext,
        String mimeType,
        String note
) {
}
