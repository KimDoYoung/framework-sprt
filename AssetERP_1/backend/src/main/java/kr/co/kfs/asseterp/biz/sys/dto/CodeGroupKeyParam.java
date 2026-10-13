package kr.co.kfs.asseterp.biz.sys.dto;

/** 그룹 이름 바꾸기·전체 삭제의 기준 (코드구분 + 그룹코드 + 그룹설명) */
public record CodeGroupKeyParam(Long codeKindId, String kindGroupCd, String kindGroupNm) {
}
