package kr.co.kfs.asseterp.biz.tdm.dto;

/** 회사 책무기술서 한 행 (AS-IS Tdm31_RoleDescModel 중 Tdm31_Tab_RoleDesc 그리드·저장에 쓰는 속성). 날짜는 yyyy-MM-dd */
public record RoleDescCompanyRes(Long roleDescId, String regDate, String reasonCode, String reasonName, Long companyId, Long personId,
                                 String personName, Long roleAllcId, String allcStdDate, String roleName, String addTitle, Long apprId,
                                 String apprStatusCode, String apprStatusName) {
}
