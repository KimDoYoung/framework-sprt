package kr.co.kfs.asseterp.biz.tdm.dto;

/** Tdm45_ManlRelateIcsModel 중 Ics01_Lookup_RelateTdm 그리드 열 (직책·주요관리의무·점검항목·점검방법) + 연결 id */
public record ManlRelateIcsRes(Long manlRelateIcsId, Long manlId, Long icsClassTreeId, String roleName, String taskName, String taskDetailName,
                               String taskDutyName, String taskCheckItem, String taskCheckHow) {
}
