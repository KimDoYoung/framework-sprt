package kr.co.kfs.asseterp.biz.apr.service.link;

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

    /** effectDate가 null이면 오늘, titleReadOnly 기본은 true */
    record Seed(String title, String content, java.time.LocalDate effectDate, boolean titleReadOnly, boolean saveVisible) {
        public static Seed of(String title, String content) {
            return new Seed(title, content, null, true, false);
        }
    }
}
