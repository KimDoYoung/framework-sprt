package kr.co.kfs.asseterp.biz.biz.dto;

/** biz.Biz50_ErpSetup.insertMailForm — erpSetupId 가 없으면 새 메일양식 행을 만든다 */
public record BizErpMailFormReq(Long erpSetupId, String mailForm) {
}
