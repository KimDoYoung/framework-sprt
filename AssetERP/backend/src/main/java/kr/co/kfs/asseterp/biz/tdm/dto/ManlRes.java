package kr.co.kfs.asseterp.biz.tdm.dto;

/** Tdm43_ManlModel 중 Ics01_Lookup_SelectTdm 그리드 열 (직책·주요관리의무·점검항목·점검방법) + 점검항목 id. checkItemAddCode는 "(점검항목코드) 점검항목명" */
public record ManlRes(Long manlId, String manlCode, String roleName, String taskRelateDutyName, String checkItemAddCode, String checkHow) {
}
