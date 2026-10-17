package kr.co.kfs.asseterp.biz.icam.service;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.icam.dto.IcamTestBatchReq;
import kr.co.kfs.asseterp.common.error.BusinessException;
import kr.co.kfs.asseterp.common.error.ErrorCode;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Set;

/**
 * AS-IS Icam99_Tab_Test.batch() L343-479: 화면의 작업 버튼이 BatchMain 서블릿을 부른다.
 * 툴바에 올라온 버튼의 actionCode만 받는다(icamData·infoData·sch04Insert는 원본이 툴바에서 뺀 버튼).
 */
@Service
@RequiredArgsConstructor
public class IcamTestService {

    private static final Set<String> ACTIONS = Set.of(
            "icamItem", "icamBook", "icamPrice", "icamFundBook", "icamIpo", "crawlingIpo", "alarm", "ipoMismatch",
            "scrapingIpo", "changedItemName", "icamTodayListItem", "icamAdvice", "filemissing", "extrFundHoldItem",
            "sendExpenseRequest");

    private final IcamBatchRunner batchRunner;

    public void runBatch(UserPrincipal user, IcamTestBatchReq req) {
        if (req.actionCode() == null || !ACTIONS.contains(req.actionCode())) {
            throw new BusinessException(ErrorCode.INVALID_INPUT);
        }
        // 공통 회사(0)면 "ALL" (L346-349)
        String companyId = user.getCompanyId() == 0 ? "ALL" : String.valueOf(user.getCompanyId());
        batchRunner.runTest(req.actionCode(), companyId, user.getName(), req);
    }
}
