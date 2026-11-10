package kr.co.kfs.asseterp.biz.apr.dto;

/** PDF 시뮬레이터가 저장된 문서에서 읽는 칸 (apr01_appr + apr10_stamp 인장명) */
public record AprPdfDocRow(
        Long apprId,
        Long classTreeId,
        String statusCode,
        String inOutTypeCode,
        String formType,
        String title,
        String content,
        String effectDate,
        String regDate,
        String receiveName,
        String referenceName,
        String signCompany,
        String signCeo,
        String stampName,
        String stampPosition
) {
}
