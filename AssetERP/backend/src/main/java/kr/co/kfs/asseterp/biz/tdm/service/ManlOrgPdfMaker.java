package kr.co.kfs.asseterp.biz.tdm.service;

/**
 * 책무매뉴얼 PDF 생성 (AS-IS Tdm42_Tab_ManlManagerAdmin.createRd 한 건 분량).
 * 순서와 구현 방법은 docs/work/E/E13-작업방법.md "다음 단계".
 */
public interface ManlOrgPdfMaker {

    void make(Long manlOrgId, Long companyId);
}
