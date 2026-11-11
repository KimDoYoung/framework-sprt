package kr.co.kfs.asseterp.biz.apr.service.link;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.common.error.BusinessException;
import kr.co.kfs.asseterp.common.error.ErrorCode;
import org.springframework.stereotype.Component;

import java.util.Map;
import java.util.Set;

/**
 * A41 이익제공(법인카드) (Apr01_Edit_ApprDoc.insertLinkApprovals A41 L3239-3249 · Biz01_Tab_Card.checkApproval·insertLinkApprovals).
 * 원본 2026-11-06(c0b1e1146): 제목은 화면이 만든 `[법인카드] yyyy년 MM월 지출결의 승인 요청의건[_계정과목 외 n]`(printModel.string02 = `title`, 고칠 수 있음),
 * 본문은 `법인카드 사용내역을 보고합니다.`. 첨부 엑셀(고른 내역)과 내역의 문서 ID는 문서 ID가 정해질 때 `POST biz/promos/cards/appr-link`가 만든다.
 */
@Component
public class CardLinkSeedProvider implements AprLinkSeedProvider {

    @Override
    public Set<String> linkCodes() {
        return Set.of("A41");
    }

    @Override
    public Seed seed(UserPrincipal user, String linkCode, Long refId) {
        throw new BusinessException(ErrorCode.INVALID_INPUT, "제목 정보가 없습니다: title");
    }

    @Override
    public Seed seed(UserPrincipal user, String linkCode, Long refId, Map<String, String> args) {
        String title = args.get("title");
        if (title == null || title.isBlank()) {
            throw new BusinessException(ErrorCode.INVALID_INPUT, "제목 정보가 없습니다: title");
        }
        return new Seed(title, "법인카드 사용내역을 보고합니다.", null, false, false);
    }
}
