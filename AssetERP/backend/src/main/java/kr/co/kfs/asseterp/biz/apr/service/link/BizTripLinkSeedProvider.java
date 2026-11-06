package kr.co.kfs.asseterp.biz.apr.service.link;

import kr.co.kfs.asseterp.common.util.Html;

import static kr.co.kfs.asseterp.biz.apr.service.link.FormMappingLinkSeedSupport.date;
import static kr.co.kfs.asseterp.biz.apr.service.link.FormMappingLinkSeedSupport.str;

import java.util.HashMap;
import java.util.Map;
import java.util.Set;

import org.springframework.stereotype.Component;

import kr.co.kfs.asseterp.biz.apr.dto.BizTripLinkRow;
import kr.co.kfs.asseterp.biz.apr.mapper.AprEmpLinkSeedMapper;
import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.common.error.BusinessException;
import kr.co.kfs.asseterp.common.error.ErrorCode;
import lombok.RequiredArgsConstructor;

/**
 * B11·B13 출장신청서 / B12·B14 출장결과보고서 (Apr01_Edit_ApprDoc.insertLinkApproval L2485-2551, 값은 Emp53_Tab_BizTrip.createMapping·createResultMapping L516-550).
 * 제목은 고칠 수 있고 [저장]이 보인다. 양식 `#{키}` 치환은 V22 FormMappingLinkSeedSupport. refId = 출장 ID(emp53_biz_trip_id).
 * 호출 화면 Emp53_Tab_BizTrip(Y05)가 TOBE에 없어 제공자만 만든다.
 */
@Component
@RequiredArgsConstructor
public class BizTripLinkSeedProvider implements AprLinkSeedProvider {

    private final AprEmpLinkSeedMapper mapper;
    private final FormMappingLinkSeedSupport support;

    @Override
    public Set<String> linkCodes() {
        return Set.of("B11", "B12", "B13", "B14");
    }

    @Override
    public Seed seed(UserPrincipal user, String linkCode, Long refId) {
        BizTripLinkRow t = refId == null ? null : mapper.selectBizTripLink(user.getCompanyId(), refId);
        if (t == null) {
            throw new BusinessException(ErrorCode.DATA_NOT_FOUND, "출장 정보를 찾을 수 없습니다.");
        }
        boolean result = "B12".equals(linkCode) || "B14".equals(linkCode);
        String title = result
                ? t.bizTripName() + " 결과 보고 - " + t.destination()
                : t.bizTripName() + " 승인 요청의 건 - " + t.destination();

        Map<String, String> mapping = new HashMap<>();
        mapping.put("소속", str(Html.esc(t.orgName())));
        mapping.put("성명", str(Html.esc(t.personName())));
        mapping.put("출장인원", str(Html.esc(t.num())));
        mapping.put("동반인", str(Html.esc(t.companion())));
        mapping.put("출장지", str(Html.esc(t.destination())));
        String start = date(t.startDate(), false);
        mapping.put("출장기간", start.equals(date(t.closeDate(), false)) ? start : start + " ~ " + date(t.closeDate(), false));
        mapping.put("출장목적", str(Html.esc(t.purpose())));

        return new Seed(title, support.fill(user.getCompanyId(), linkCode, mapping), null, false, true);
    }
}
