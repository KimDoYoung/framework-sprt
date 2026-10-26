package kr.co.kfs.asseterp.biz.fnd.dto;

import java.time.LocalDate;

/**
 * 공모주 참여계좌 한 행 — AS-IS Fnd32_AccountModel (fnd32_account.selectByText). 계좌번호·은행연계계좌는 복호화한 값(decAccountNo·decBankLinkNo),
 * 이름(증권사·운용대상·구분·연계은행·상태·상장일출고)은 SQL 계산 열
 */
public record IpoAccountRes(Long accountId, LocalDate setupDate, Long corpId, String corpName, String branch, String accountCode1,
                            String accountName1, String accountCode2, String accountName2, String accountName, String decAccountNo,
                            Long bankCorpId, String bankCorpName, String decBankLinkNo, String accountStateCode, String accountStateName,
                            String ipoOutCode, String ipoOutName, String managerTel, String note) {
}
