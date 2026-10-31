package kr.co.kfs.asseterp.biz.apr.service.link;

import java.util.Map;
import java.util.Set;

import org.springframework.stereotype.Component;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.common.error.BusinessException;
import kr.co.kfs.asseterp.common.error.ErrorCode;

/**
 * A35 법인카드 현황 · A36 법인카드 접대비 현황 (Apr01_Edit_ApprDoc.insertLinkApproval L635-651, 호출 Biz01_Tab_CardReport·Biz01_Tab_EntertmExpenseReport).
 * 본문은 없다 — AS-IS도 `checkContent(linkHtmlContent)`에 null을 넘겨 문서분류의 대표 양식을 쓴다(RD 출력물은 첨부하지 않는다).
 * 제목은 고칠 수 있다(`title.setReadOnly(false)`): A35 `{yyyy}.{월 코드} 법인카드 현황`, A36 `{yyyy}년도 법인카드 접대비 현황`.
 * args.yyyy = 호출 화면의 기준년도 입력칸(printModel.string01), args.mm = A35의 월/분기 콤보 코드(printModel.string02).
 */
@Component
public class CardReportLinkSeedProvider implements AprLinkSeedProvider {

    @Override
    public Set<String> linkCodes() {
        return Set.of("A35", "A36");
    }

    @Override
    public Seed seed(UserPrincipal user, String linkCode, Long refId) {
        throw new BusinessException(ErrorCode.INVALID_INPUT, "기준년도 정보가 없습니다: yyyy");
    }

    @Override
    public Seed seed(UserPrincipal user, String linkCode, Long refId, Map<String, String> args) {
        String yyyy = args.get("yyyy");
        if (yyyy == null || yyyy.isBlank()) {
            throw new BusinessException(ErrorCode.INVALID_INPUT, "기준년도 정보가 없습니다: yyyy");
        }
        if ("A35".equals(linkCode)) {
            String mm = args.get("mm");
            if (mm == null || mm.isBlank()) {
                throw new BusinessException(ErrorCode.INVALID_INPUT, "기준월 정보가 없습니다: mm");
            }
            return new Seed(yyyy + "." + mm + " 법인카드 현황", null, null, false, false);
        }
        return new Seed(yyyy + "년도 법인카드 접대비 현황", null, null, false, false);
    }
}
