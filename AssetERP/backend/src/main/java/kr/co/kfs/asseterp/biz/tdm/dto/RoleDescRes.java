package kr.co.kfs.asseterp.biz.tdm.dto;

/** 책무기술서 한 행 (AS-IS Tdm31_RoleDescModel 중 Tdm31_Tab_RoleDescAdmin 그리드·재생성에 쓰는 속성). 날짜는 yyyy-MM-dd */
public record RoleDescRes(Long roleDescId, String regDate, String reasonName, Long companyId, String companyName, Long personId,
                          String personName, String allcStdDate, String roleName, String addTitle, Long apprId,
                          String apprStatusCode, String apprStatusName) {
}
