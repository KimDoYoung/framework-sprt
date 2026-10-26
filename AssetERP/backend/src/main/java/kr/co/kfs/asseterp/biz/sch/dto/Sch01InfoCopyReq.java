package kr.co.kfs.asseterp.biz.sch.dto;

import java.util.List;

/** 담당자 변경 처리 (AS-IS Sch01_Lookup_ManagerModiRun.update → Sch01_Info.copySchedule). procType은 MOVE(이동)·COPY(복사) */
public record Sch01InfoCopyReq(Long managerId, String procType, List<Long> infoIds) {
}
