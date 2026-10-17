package kr.co.kfs.asseterp.biz.dbm.service;

/**
 * AS-IS utils.pdf.PDFCreate.createPDF7 → apr.Apr10_StampPDF7.getDocument 를 부르는 자리.
 * 결재문서 PDF를 만들고 인장·로고를 찍은 뒤 sys10_file에 올리는 전자결재(apr) 도메인 기능이라 여기서는 구현하지 않는다.
 * 연동을 만들면 이 인터페이스를 구현한 빈을 두고 기본 구현({@link DisabledPdfMaker})은 지운다.
 */
public interface PdfMaker {
    void make(Long companyId, Long apprId);
}
