package com.asseterp.oms.biz.company.dto;

/**
 * 접속한 서브도메인의 회사 정보 (로그인 화면 분기용)
 *
 * @param host        판별에 사용한 호스트
 * @param companyCode 서브도메인에서 떼어낸 회사 코드 (sys01_loc_nm)
 * @param companyId   회사 ID (무효한 회사면 null)
 * @param companyName 회사명 (무효한 회사면 null)
 * @param valid       등록된 사용 중인 회사인지 여부 - false면 "유효하지 않은 고객정보"
 * @param admin       KFS 관리자 테넌트 여부 - true면 로그인 화면에 회사 선택을 표시
 */
public record TenantRes(
        String host,
        String companyCode,
        Long companyId,
        String companyName,
        boolean valid,
        boolean admin
) {
}
