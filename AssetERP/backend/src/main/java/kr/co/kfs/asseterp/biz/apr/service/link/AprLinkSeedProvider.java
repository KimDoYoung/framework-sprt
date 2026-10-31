package kr.co.kfs.asseterp.biz.apr.service.link;

import java.util.Map;
import java.util.Set;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;

/**
 * 링크코드마다 상신 제목·본문을 만드는 가지 하나 (AS-IS insertLinkApproval의 `linkCode.equals(...)` 가지).
 * refId는 호출한 원본 화면의 행(AS-IS가 넘기던 gridDataModel)을 가리키는 번호다.
 */
public interface AprLinkSeedProvider {

    Set<String> linkCodes();

    /** content가 null이면 문서분류의 대표 양식을 쓴다(AS-IS checkContent) */
    Seed seed(UserPrincipal user, String linkCode, Long refId);

    /**
     * refId 하나로 모자란 코드(AS-IS가 화면의 입력칸 값 — 기준년도·월/분기 — 을 모델에 얹어 넘기던 것)는 이 메서드를 구현한다.
     * args 키는 `stdDate`(yyyy-MM-dd)·`cycleType`·`yyyy`·`mm`·`cycleName`이고 값이 없으면 키가 없다.
     */
    default Seed seed(UserPrincipal user, String linkCode, Long refId, Map<String, String> args) {
        return seed(user, linkCode, refId);
    }

    /** effectDate가 null이면 오늘, titleReadOnly 기본은 true, receiveName·referenceName은 null이면 비워 둔다(증명서는 둘 다 "-", V22) */
    record Seed(String title, String content, java.time.LocalDate effectDate, boolean titleReadOnly, boolean saveVisible,
                String receiveName, String referenceName) {
        public Seed(String title, String content, java.time.LocalDate effectDate, boolean titleReadOnly, boolean saveVisible) {
            this(title, content, effectDate, titleReadOnly, saveVisible, null, null);
        }

        public static Seed of(String title, String content) {
            return new Seed(title, content, null, true, false);
        }
    }
}
