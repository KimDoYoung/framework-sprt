package kr.co.kfs.asseterp.biz.apr.service.link;

import java.util.HashMap;
import java.util.Map;
import java.util.Set;

import org.springframework.stereotype.Component;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.icam.dto.IcamUserRes;
import kr.co.kfs.asseterp.biz.icam.mapper.IcamUserMapper;
import kr.co.kfs.asseterp.common.error.BusinessException;
import kr.co.kfs.asseterp.common.error.ErrorCode;
import lombok.RequiredArgsConstructor;
import kr.co.kfs.asseterp.common.util.Texts;

/**
 * A33 ICAM 사용자ID 신청서 작성 (Apr01_Edit_ApprDoc.insertLinkApproval L2126-2155, 호출 Icam55_Tab_UserRegAppr).
 * 제목은 서버가 만들고(고칠 수 없다), 본문은 `Com10_FormMapping.selectByLinkCode` 양식의 `#{키}`를
 * 호출 화면 createMapping(L530-547) 값으로 바꾼다 — refId = 사용자ID 신청서(icam55_icam_user_id).
 */
@Component
@RequiredArgsConstructor
public class IcamUserLinkSeedProvider implements AprLinkSeedProvider {

    private final IcamUserMapper mapper;
    private final FormMappingLinkSeedSupport support;

    @Override
    public Set<String> linkCodes() {
        return Set.of("A33");
    }

    @Override
    public Seed seed(UserPrincipal user, String linkCode, Long refId) {
        IcamUserRes m = refId == null ? null : mapper.selectById(refId);
        if (m == null) {
            throw new BusinessException(ErrorCode.INVALID_INPUT, "사용자ID 신청서를 찾을 수 없습니다");
        }
        String title = "ICAM 사용자ID 발급 및 변경 신청서 - " + m.companyName() + " 사용자 " + m.procTypeName();
        // createMapping: checkStringNull(null → ""), checkBooleanNull(true → "O", 그 밖 " ")
        Map<String, String> mp = new HashMap<>();
        mp.put("소속회사", Texts.nvl(m.companyName()));
        mp.put("처리구분", Texts.nvl(m.procTypeName()));
        mp.put("신청내용", Texts.nvl(m.regContent()));
        mp.put("사용자", Texts.nvl(m.userName()));
        mp.put("신규yn", yn(m.procAddYn()));
        mp.put("변경yn", yn(m.procModiYn()));
        mp.put("삭제yn", yn(m.procdelYn()));
        return new Seed(title, support.fill(user.getCompanyId(), "A33", mp), null, true, false);
    }

    private static String yn(Boolean b) {
        return Boolean.TRUE.equals(b) ? "O" : " ";
    }
}
