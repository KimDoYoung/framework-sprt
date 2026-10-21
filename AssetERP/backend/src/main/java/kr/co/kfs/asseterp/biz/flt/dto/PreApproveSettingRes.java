package kr.co.kfs.asseterp.biz.flt.dto;

/** 화면 열림 때 필요한 설정 — 투자한도 열 숨김(flt01 기준), 협의승인 사용 회사 여부(sys01) */
public record PreApproveSettingRes(Boolean investLimitUnvisibleYn, Boolean addConfirmYn) {
}
