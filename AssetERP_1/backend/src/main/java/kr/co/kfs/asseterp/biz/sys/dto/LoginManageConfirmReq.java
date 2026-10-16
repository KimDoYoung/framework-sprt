package kr.co.kfs.asseterp.biz.sys.dto;

/** 승인여부 저장 (AS-IS updateConfirmYn): 승인 'true' / 취소 'false' */
public record LoginManageConfirmReq(Long personId, String confirmYn) {
}
