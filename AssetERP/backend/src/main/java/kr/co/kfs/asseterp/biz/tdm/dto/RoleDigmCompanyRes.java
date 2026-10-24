package kr.co.kfs.asseterp.biz.tdm.dto;

/**
 * 책무체계도 작성 한 행 (AS-IS Tdm32_RoleDigmModel 중 Tdm32_Tab_RoleDigm 그리드·저장·보기에 쓰는 속성, N13). 날짜는 yyyy-MM-dd.
 * fileTypeName02 = 사용자가 올린 파일 이름(없으면 null → 올리기 아이콘, 있으면 삭제 아이콘)
 */
public record RoleDigmCompanyRes(Long roleDigmId, Long companyId, String regDate, String allcStdDate, String reasonCode, String reasonName,
                                 String useFileType, Long apprId, String apprStatusCode, String apprStatusName,
                                 Long roleDigmFileId, String fileTypeName02) {
}
