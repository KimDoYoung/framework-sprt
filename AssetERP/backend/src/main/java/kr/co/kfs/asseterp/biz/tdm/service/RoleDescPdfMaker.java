package kr.co.kfs.asseterp.biz.tdm.service;

/**
 * 책무기술서 PDF 생성 (AS-IS Sys99_Print.CreateTdmRoleDesc 데이터 준비 + RD 리포트 서버 `Tdm31_Rd_DescRpt` PDF 변환 +
 * Sys10_File.fileReName·copyFile로 첨부 연결). TOBE에는 RD 서버가 없어 기본 구현은 만들지 않는다 — RD 연동이나 대체 생성기가 생기면
 * 이 인터페이스를 구현해 {@link DisabledRoleDescPdfMaker}를 대신한다(docs/work/E/E11-작업방법.md "다음 단계").
 */
public interface RoleDescPdfMaker {

    /** 만들고 첨부로 연결한다. 만들 수 없으면 BusinessException — 호출하는 쪽은 그 전에 기존 첨부를 지우지 않는다 */
    void make(Long roleDescId, Long companyId);
}
