package kr.co.kfs.asseterp.biz.tdm.dto;

import java.time.LocalDate;

/** 회의체 한 행 (AS-IS Tdm05_CnclModel, 목록 tdm05_cncl.selectByDate) */
public record CouncilRes(
        Long cnclId,
        String cnclName,
        String openCycleCode,
        String openCycleName,
        String mainDecision,
        LocalDate startDate,
        LocalDate endDate,
        String relateRoleCnt,
        String updName,
        String updDateStr) {
}
