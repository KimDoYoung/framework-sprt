package kr.co.kfs.asseterp.biz.tdm.dto;

/** 복사 원본 관리의무의 점검항목 한 행 (AS-IS tdm43_manl.selectByTaskRelateDutyId — 코드·점검항목) */
public record ManlCopyItemRes(Long manlId, String manlCode, String checkItem) {
}
