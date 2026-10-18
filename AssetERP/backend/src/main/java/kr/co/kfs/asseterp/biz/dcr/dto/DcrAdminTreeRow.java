package kr.co.kfs.asseterp.biz.dcr.dto;

/** 문서분류 한 건의 기본 열 (AS-IS selectAdminDcrClassTree·selectByClassTreeCode·selectById — 복사 원본, updateCheck 비교값) */
public record DcrAdminTreeRow(Long classTreeId, Long parentTreeId, String classTreeName, String seq, String note,
                              String classTreeCode, String typeCode, String adminYn) {
}
