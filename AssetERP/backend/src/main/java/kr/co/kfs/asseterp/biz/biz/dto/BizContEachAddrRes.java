package kr.co.kfs.asseterp.biz.biz.dto;

/** biz16_each_contract.selectByContCorpId — [상신] 전 계약사 주소·대표이사 확인용 */
public record BizContEachAddrRes(Long contractId, String address, String ceo, String contCorpNm) {
}
