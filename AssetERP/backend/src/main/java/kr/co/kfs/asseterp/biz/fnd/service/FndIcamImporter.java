package kr.co.kfs.asseterp.biz.fnd.service;

/**
 * AS-IS Fnd03_Consignment.selectIcamConsignment가 하는 일 — 외부 ICAM DB(szx0st)에서 수탁사를 읽어 fnd03_consignment에 넣는다.
 * 외부 DB 연동은 이 프로젝트에 없어(03 원칙 1: asseterpdb만) 기본 구현은 거절한다. 연동이 생기면 이 인터페이스를 구현한다.
 */
public interface FndIcamImporter {

    /** @param companyId 회사 ID 문자열, 공통 회사(0)이면 "%"(모든 회사) */
    void importConsignments(String companyId);

    /** AS-IS Fnd06_OfficeWork.selectIcamOfficeWork — 외부 ICAM DB(szx0gr, gr_cd='C1')에서 사무수탁사를 읽어 fnd06_office_work에 넣는다 */
    void importOfficeWorks(Long companyId);

    /** AS-IS Fnd09_TrustBank.selectIcamTrustBank — 회사별 ICAM 회사코드로 외부 ICAM DB에서 수탁은행을 읽어 fnd09_trust_bank에 넣는다 */
    void importTrustBanks(String companyId);
}
