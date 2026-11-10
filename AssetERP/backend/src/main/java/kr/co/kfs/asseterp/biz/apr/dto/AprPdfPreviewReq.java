package kr.co.kfs.asseterp.biz.apr.dto;

import java.util.List;

/**
 * PDF 미리보기 요청 — AS-IS makePreviewPDF가 apr.Apr01_ApprTemp.insert로 만드는 임시 문서(editDriver.flush + 본문)와 PDFViewer 인자.
 *
 * @param apprId        원래 문서(없으면 새 문서)
 * @param classTreeId   문서분류 — 링크코드(양식) 판정에 쓴다
 * @param formType      양식 A(기본)·B(증명서)·C(계약서)·D·X. 비면 링크코드로 정한다
 * @param checkFlag     사내문서 "시스템에서 제공하는 기본 양식을 적용" [예] = true
 * @param steps         결재선(사내문서 기본 양식의 결재란) — 화면에 보이는 순서
 */
public record AprPdfPreviewReq(
        Long apprId,
        Long classTreeId,
        String formType,
        Boolean checkFlag,
        String inOutTypeCode,
        String title,
        String content,
        String effectDate,
        String regDate,
        String receiveName,
        String referenceName,
        String signCompany,
        String signCeo,
        String stampName,
        String stampPosition,
        List<Step> steps
) {
    /** 결재란 한 칸 — 구분(결재·합의 …)·성명 */
    public record Step(String stepTypeName, String empName, String titleName) {
    }
}
