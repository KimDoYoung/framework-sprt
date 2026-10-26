package kr.co.kfs.asseterp.biz.fnd.dto;

import java.time.LocalDate;

/** 공모주 참여계좌 저장·복사 한 행 (AS-IS fnd.Fnd32_Account.updateList·copyUpdate). accountId가 없거나 0 이하(임시 행)이면 새 행. 계좌번호는 평문으로 받아 서버가 암호화한다 */
public record IpoAccountSaveReq(Long accountId, LocalDate setupDate, Long corpId, String branch, String accountCode1, String accountCode2,
                                String accountName, String decAccountNo, Long bankCorpId, String decBankLinkNo, String accountStateCode,
                                String ipoOutCode, String managerTel, String note) {
}
