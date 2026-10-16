package kr.co.kfs.asseterp.biz.sys.dto;

/** Sys17_CorpAccountModel (sys17_corp_account + bankName·accountNoDec 계산 컬럼). 계좌번호는 복호화한 값만 내려준다 */
public record CorpAccountRes(Long corpAccountId, Long corpId, String bankCode, String bankName, String accountNoDec,
                             String accountName, String mainAccountYn) {
}
