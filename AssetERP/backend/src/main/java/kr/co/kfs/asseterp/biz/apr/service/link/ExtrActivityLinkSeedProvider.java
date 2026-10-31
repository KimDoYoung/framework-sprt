package kr.co.kfs.asseterp.biz.apr.service.link;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.ics.dto.IcsExtrActivityRes;
import kr.co.kfs.asseterp.biz.ics.mapper.IcsExtrActivityMapper;
import kr.co.kfs.asseterp.common.error.BusinessException;
import kr.co.kfs.asseterp.common.error.ErrorCode;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.Map;
import java.util.Set;

/**
 * B15 대외활동신청_활동신청 · B16 대외활동신청_결과보고 (Apr01_Edit_ApprDoc.insertLinkApproval L2552-2613 ·
 * Ics35_Tab_ExtrActivity.createMapping/createResultMapping L383-416). refId = 대외활동 ID(ics35_extr_activity_id).
 * 제목 읽기전용, [저장] 숨김(기본). 본문은 `Com10_FormMapping.selectByLinkCode` 양식의 `#{키}` 치환.
 */
@Component
@RequiredArgsConstructor
public class ExtrActivityLinkSeedProvider implements AprLinkSeedProvider {

    private final IcsExtrActivityMapper mapper;
    private final FormMappingLinkSeedSupport support;

    @Override
    public Set<String> linkCodes() {
        return Set.of("B15", "B16");
    }

    @Override
    public Seed seed(UserPrincipal user, String linkCode, Long refId) {
        IcsExtrActivityRes a = refId == null ? null : mapper.selectById(refId);
        if (a == null || !user.getCompanyId().equals(a.companyId())) {
            throw new BusinessException(ErrorCode.DATA_NOT_FOUND, "대외활동 정보를 찾을 수 없습니다.");
        }
        boolean apply = "B15".equals(linkCode);
        // 제목설정 L2556·L2587 (자바 문자열 이어 붙이기처럼 비면 "null")
        String title = (apply ? "임직원 대외활동 승인 신청 - " : "임직원 대외활동 결과보고서 - ")
                + a.personNm() + "(" + a.activityCorp() + ")";

        Map<String, String> mapping = new HashMap<>();
        mapping.put("성명", s(a.personNm()));
        mapping.put("사번", s(a.personNo()));
        mapping.put("부서명", s(a.orgNm()));
        mapping.put("직책", s(a.titleNm()));
        mapping.put("신청일자", d(a.regDate()));
        mapping.put("활동처", s(a.activityCorp()));
        mapping.put("활동대상", s(a.activityTgtNm2()));
        mapping.put("활동기간", s(a.activityPeriod()));
        mapping.put("활동내용", h(a.activityDesc()));
        mapping.put("활동보수", s(a.activityPay()));
        if (apply) {
            mapping.put("첨부자료", s(a.fileStr()));  // 결과보고(createResultMapping)에는 없다
        }
        return new Seed(title, support.fill(user.getCompanyId(), linkCode, mapping), null, true, false);
    }

    /** checkStringNull — 비었으면 공백 한 칸(다른 화면의 "- "와 다르다) */
    private static String s(String text) {
        return text == null ? " " : text;
    }

    /** checkStringHtml — 줄바꿈을 br로 */
    private static String h(String text) {
        return text == null ? " " : text.replace("\n", "<br>");
    }

    /** checkDateNull — yyyy-MM-dd, 없으면 "- " */
    private static String d(LocalDate date) {
        return date == null ? "- " : date.toString();
    }
}
