package kr.co.kfs.asseterp.biz.apr.service.link;

import java.time.LocalDate;
import java.util.Map;
import java.util.Set;

import org.springframework.stereotype.Component;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.common.error.BusinessException;
import kr.co.kfs.asseterp.common.error.ErrorCode;

/**
 * A72 임직원매매 책임자보고 (Apr01_Edit_ApprDoc.insertLinkApproval L3586-3601).
 * 제목 `임직원 금융투자상품 매매명세보고(yyyy년 M월)`(고칠 수 있음), 본문은 빈 글자("" — 양식을 쓰지 않음), 시행일자 = 보고 기준일(stdDate), [저장] 숨김.
 * 첨부(RD 엑셀 `임직원 금융투자상품 매매명세 보고(…)`)는 결재창이 열린 뒤 저장 직후 처리(ceoReportSetting) — 서버 엑셀을 붙이는 API가 맡는다.
 * args: stdDate(yyyy-MM-dd), stdDateStr("yyyy년 MM월").
 */
@Component
public class CeoReportLinkSeedProvider implements AprLinkSeedProvider {

    @Override
    public Set<String> linkCodes() {
        return Set.of("A72");
    }

    @Override
    public Seed seed(UserPrincipal user, String linkCode, Long refId) {
        return seed(user, linkCode, refId, Map.of());
    }

    @Override
    public Seed seed(UserPrincipal user, String linkCode, Long refId, Map<String, String> args) {
        String std = args.get("stdDate");
        String stdStr = args.get("stdDateStr");
        if (std == null || stdStr == null) {
            throw new BusinessException(ErrorCode.INVALID_INPUT, "기준일이 없습니다.");
        }
        return new Seed("임직원 금융투자상품 매매명세보고(" + stdStr + ")", "", LocalDate.parse(std), false, false);
    }
}
