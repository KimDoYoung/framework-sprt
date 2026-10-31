package kr.co.kfs.asseterp.biz.apr.service.link;

import java.util.Set;

import org.springframework.stereotype.Component;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;

/**
 * A04 판촉물 구매 (Apr01_Edit_ApprDoc.insertLinkApproval L1858-1860, 호출 Bmt01_Tab_Buy).
 * 제목 "판촉물 구매"(고칠 수 있음)만 정하고 본문은 없다 — AS-IS도 checkContent(null)로 문서분류의 대표 양식을 쓴다.
 */
@Component
public class PromoBuyLinkSeedProvider implements AprLinkSeedProvider {

    @Override
    public Set<String> linkCodes() {
        return Set.of("A04");
    }

    @Override
    public Seed seed(UserPrincipal user, String linkCode, Long refId) {
        return new Seed("판촉물 구매", null, null, false, false);
    }
}
