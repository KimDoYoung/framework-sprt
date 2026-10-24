package kr.co.kfs.asseterp.biz.tdm.service;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;

/**
 * 책무매뉴얼 PDF 생성 (AS-IS Tdm42_Tab_ManlManagerAdmin.createRd 한 건 분량).
 * 순서와 구현 방법은 docs/work/E/E13-작업방법.md "다음 단계".
 */
public interface ManlOrgPdfMaker {

    /** user = RD 보고서의 reportCompanyId·reportPersonId(AS-IS LoginUser)로 넘기는 로그인 사용자 */
    void make(Long manlOrgId, Long companyId, UserPrincipal user);
}
