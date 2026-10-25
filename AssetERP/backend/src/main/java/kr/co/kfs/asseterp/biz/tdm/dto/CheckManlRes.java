package kr.co.kfs.asseterp.biz.tdm.dto;

/** 부서 점검항목 그리드 한 행 (AS-IS Tdm52_ChckManlModel — tdm52_chck_manl.selectByChckOrgId, N21이 쓰는 열) */
public record CheckManlRes(Long chckManlId, String title, String checkItem, Long checkerId, String checkerName,
                           String checkResultName, String checkStatusCode, String checkStatusName) {
}
