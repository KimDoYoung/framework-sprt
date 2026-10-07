package kr.co.kfs.asseterp.common.tenant;

import kr.co.kfs.asseterp.biz.company.dto.CompanyRes;

/**
 * 요청 호스트로 판별한 접속 회사 (서브도메인 = sys01_loc_nm)
 *
 * @param host    판별에 사용한 호스트 (안내 메시지용)
 * @param code    서브도메인에서 떼어낸 회사 코드 (admin 별칭은 adminCode로 정규화)
 * @param company sys01_company 조회 결과 (없거나 사용 중지면 null)
 * @param admin   KFS 관리자 테넌트 여부 - 로그인 시 회사를 선택할 수 있다
 */
public record Tenant(
        String host,
        String code,
        CompanyRes company,
        boolean admin
) {
    public boolean isValid() {
        return company != null && company.isUsable();
    }
}
