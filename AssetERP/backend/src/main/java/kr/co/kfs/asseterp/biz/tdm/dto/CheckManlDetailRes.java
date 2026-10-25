package kr.co.kfs.asseterp.biz.tdm.dto;

/** 점검항목 한 건 — 이행점검 목록·점검상세 창 (AS-IS tdm52_chck_manl.selectByPersonId·selectById, Tdm52_ChckManlModel) */
public record CheckManlDetailRes(Long chckManlId, Long chckOrgId, Long chckJobId, Long companyId, Long manlId, Long manlOrgId,
                                 Long roleId, Long orgId, String checkYm, String roleName, String commonTypeName, String taskName,
                                 String checkItem, String checkCycleInfo, String checkHow, String checkEvidDocName, String refBasis,
                                 Long checkerId, String checkerName, String checkDate, String checkResultCode, String checkResultName,
                                 String checkCmnt, String checkStatusCode, String checkStatusName, String fileCountStr) {
}
