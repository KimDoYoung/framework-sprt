package kr.co.kfs.asseterp.biz.apr.service.link;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import org.springframework.stereotype.Component;

import java.util.Map;
import java.util.Set;

/**
 * A10·A11·A12 이익제공(수령) 신청서 (Apr01_Edit_ApprDoc.insertLinkApproval L1917-1924 · Apr01_Tab_BizPriorApproval.insertLinkApproval L362-382).
 * 제목 = 신청서 구분 콤보 이름 + "_" + 로그인 사원 이름(원본은 화면이 만든 문서 모델의 제목), 본문은 `checkContent(null)` — 문서분류의 대표 양식을 쓴다.
 * A40 임직원 대외활동 신청(Apr01_Edit_ApprDoc L2702-2709 · Apr01_Tab_ExternalBiz.insertLinkApproval L234-254)도 같다 — 제목은 고정 글자 "대외활동신고서(보고서)" + "_" + 사원 이름(args.typeName), 본문 `checkContent(null)`.
 * 호출 화면의 행이 없어 refId는 쓰지 않는다. 제목 읽기전용, [저장] 숨김(기본).
 */
@Component
public class PriorApprovalLinkSeedProvider implements AprLinkSeedProvider {

    @Override
    public Set<String> linkCodes() {
        return Set.of("A10", "A11", "A12", "A40");
    }

    @Override
    public Seed seed(UserPrincipal user, String linkCode, Long refId) {
        return seed(user, linkCode, refId, Map.of());
    }

    @Override
    public Seed seed(UserPrincipal user, String linkCode, Long refId, Map<String, String> args) {
        // apprComboBox.getText() — 콤보에 보이는 이름. 안 넘어오면 자바 문자열 이어 붙이기처럼 "null"
        String typeName = args.get("typeName");
        return new Seed(typeName + "_" + user.getName(), null, null, true, false);
    }
}
