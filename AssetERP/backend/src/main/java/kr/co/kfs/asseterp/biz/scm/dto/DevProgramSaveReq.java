package kr.co.kfs.asseterp.biz.scm.dto;

import java.time.LocalDateTime;

/** Scm13_Edit_DevProgram.update — insertWay "new"(변경프로그램 등록, versionCode 1) / "edit"(수정, versionCode 2) */
public record DevProgramSaveReq(Long devProgramId, Long devId, Long programId, String deployTgtYn, Long deploySeq,
                                String systemCd, String programType, String programCd, String programNm, String source,
                                String note, Long version, LocalDateTime regDate, String insertWay) {
}
