package kr.co.kfs.asseterp.biz.att.dto;

import java.util.List;

/** 근로시간 일괄조정 본문 (AS-IS Att02_Tab_CommuteAdmin.updateAuto → att.Att04_CommuteHist.updateAuto) */
public record AttCommuteAutoReq(List<Long> commuteIds) {
}
