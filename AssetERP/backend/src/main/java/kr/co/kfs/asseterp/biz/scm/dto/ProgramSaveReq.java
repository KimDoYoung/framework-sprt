package kr.co.kfs.asseterp.biz.scm.dto;

import java.time.LocalDateTime;

/** Scm30_Edit_Program.update (EE19) — insertWay "new"(등록, versionCode 1) / "edit"(수정, versionCode 2) */
public record ProgramSaveReq(Long programId, String systemCd, String programType, String programCd, String programNm, String source,
                             String note, String useYn, Long version, LocalDateTime regDate, String insertWay) {
}
