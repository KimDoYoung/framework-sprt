package kr.co.kfs.asseterp.biz.tdm.dto;

import java.time.LocalDate;

/** 회의체 편집창 저장 (AS-IS Tdm05_Cncl.modelUpdate, cnclId가 없으면 새 회의체) */
public record CouncilSaveReq(
        Long cnclId,
        String cnclName,
        String openCycleCode,
        String mainDecision,
        LocalDate startDate,
        LocalDate endDate) {
}
