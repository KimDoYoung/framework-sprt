package kr.co.kfs.asseterp.biz.tdm.dto;

/** 책무체계도 한 행 (AS-IS Tdm32_RoleDigmModel 중 Tdm32_Tab_RoleDigmAdmin 그리드·재생성·보기에 쓰는 속성). 날짜는 yyyy-MM-dd */
public record RoleDigmRes(Long roleDigmId, Long companyId, String companyName, String regDate, String allcStdDate, String reasonName,
                          String useFileType, String useFileTypeName, Long apprId, String apprStatusCode, String apprStatusName,
                          Long roleDigmFileId) {
}
