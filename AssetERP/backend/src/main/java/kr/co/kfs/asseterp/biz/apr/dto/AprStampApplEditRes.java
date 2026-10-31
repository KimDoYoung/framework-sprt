package kr.co.kfs.asseterp.biz.apr.dto;

import java.util.List;

/**
 * 날인신청 탭 편집 (Apr16_Grid_StampDoc.retrieve L254-275 + chkYn L277-297).
 * locked는 이미 결재한 사람이 있어 [+]·[-]가 꺼지는 경우(apr04_appr_step.checkApprId)
 */
public record AprStampApplEditRes(List<AprApprStampApplRes> rows, AprStampApplMeta meta, boolean locked) {
}
