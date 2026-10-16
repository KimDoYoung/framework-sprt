package kr.co.kfs.asseterp.biz.sys.dto;

/** Sys17_Grid_CorpAccount 저장 한 행 (corpAccountId ≤ 0·null이면 새 행). accountNoEnc는 서버가 암호화해 채운다 */
public record CorpAccountSaveReq(Long corpAccountId, String bankCode, String accountNoDec, String accountName,
                                 String mainAccountYn) {
}
