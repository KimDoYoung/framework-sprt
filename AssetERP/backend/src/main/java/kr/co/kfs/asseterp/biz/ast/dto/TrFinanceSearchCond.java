package kr.co.kfs.asseterp.biz.ast.dto;

import java.time.LocalDate;

/** AS-IS ast06_tr.selectByPayCode 파라미터. 0·빈 값은 서비스가 null로 바꾼다(AS-IS Ast06_Tr.selectByPayCode L43-107) */
public record TrFinanceSearchCond(
        Long companyId,
        Long userId,
        Long orgId,
        LocalDate startDate,
        LocalDate closeDate,
        String payCode,
        String assetType,
        String abroType,
        Long accountId,
        Long corpId,
        Long astClassTreeId,
        Long trCodeId,
        String windowClassName,
        String searchText
) {
}
