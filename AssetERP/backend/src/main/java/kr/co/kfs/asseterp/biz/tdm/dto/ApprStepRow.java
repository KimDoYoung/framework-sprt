package kr.co.kfs.asseterp.biz.tdm.dto;

/** 승인선 행의 키 정보 (회사 확인·승인자 추가의 직책·부서 값) */
public record ApprStepRow(
        Long apprStepId,
        Long companyId,
        Long roleId,
        Long orgId,
        String typeCode) {
}
