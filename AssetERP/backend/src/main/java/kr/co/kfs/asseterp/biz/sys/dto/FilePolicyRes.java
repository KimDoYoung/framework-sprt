package kr.co.kfs.asseterp.biz.sys.dto;

/** 파일보안정책 한 행 (A36, AS-IS Sys60_FilePolicyModel) */
public record FilePolicyRes(
        Long filePolicyId,
        String ext,
        String mimeType,
        String note
) {
}
