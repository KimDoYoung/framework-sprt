package kr.co.kfs.asseterp.biz.tdm.service;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;

/** 이행점검보고서 PDF 생성기 — RD 서버 연동 (AS-IS Tdm50_TabPage_CheckJob.createRd 한 건 분량) */
public interface CheckExctPdfMaker {

    /**
     * 결과는 AS-IS createRd의 분기를 따른다.
     * {@link PdfOutcome#OK} 파일 생성·등록 완료, {@link PdfOutcome#RD_FAILED} 자료·RD 호출 실패(화면이 잠금을 되돌리고 다음 건으로),
     * {@link PdfOutcome#FILE_FAILED} 파일 확인 실패·저장 폴더 이상(화면이 멈춘다).
     */
    PdfOutcome make(Long chckExctId, Long companyId, UserPrincipal user);

    enum PdfOutcome { OK, RD_FAILED, FILE_FAILED }
}
