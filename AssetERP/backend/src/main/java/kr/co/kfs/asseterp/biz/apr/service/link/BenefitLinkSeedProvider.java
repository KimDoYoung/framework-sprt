package kr.co.kfs.asseterp.biz.apr.service.link;

import kr.co.kfs.asseterp.common.util.Html;

import static kr.co.kfs.asseterp.biz.apr.service.link.FormMappingLinkSeedSupport.str;

import java.text.DecimalFormat;
import java.time.LocalDate;
import java.util.HashMap;
import java.util.Map;
import java.util.Set;

import org.springframework.stereotype.Component;

import kr.co.kfs.asseterp.biz.apr.dto.BenefitSenderRow;
import kr.co.kfs.asseterp.biz.apr.mapper.AprBenefitLinkSeedMapper;
import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.emp.dto.BenefitRes;
import kr.co.kfs.asseterp.biz.emp.mapper.EmpBenefitMapper;
import kr.co.kfs.asseterp.common.error.BusinessException;
import kr.co.kfs.asseterp.common.error.ErrorCode;
import lombok.RequiredArgsConstructor;

/**
 * A21~A23·A37·A49 복리후생비 신청서 (Apr01_Edit_ApprDoc.insertLinkApproval L2651-2675, 값은 Emp17_Lookup_Benefit.update L258-298·createMapping L386-402).
 * refId = 방금 만든 신청 행(emp17_benefit_id). args: yyyy(사용 년)·mm(사용 월 코드, 발생년월·제목에 들어감).
 * 제목 `신청구분 지원신청서 (yyyy년 mm월분)_사원명`(코드 끝에서 둘째 글자가 B) / `… (발생일자)_사원명`(A), 고칠 수 있고 [저장]은 숨김. 본문 = 링크코드 양식의 `#{키}` 치환(V22).
 */
@Component
@RequiredArgsConstructor
public class BenefitLinkSeedProvider implements AprLinkSeedProvider {

    private final EmpBenefitMapper benefitMapper;
    private final AprBenefitLinkSeedMapper mapper;
    private final FormMappingLinkSeedSupport support;

    @Override
    public Set<String> linkCodes() {
        return Set.of("A21", "A22", "A23", "A37", "A49");
    }

    @Override
    public Seed seed(UserPrincipal user, String linkCode, Long refId) {
        return seed(user, linkCode, refId, Map.of());
    }

    @Override
    public Seed seed(UserPrincipal user, String linkCode, Long refId, Map<String, String> args) {
        BenefitRes b = refId == null ? null : benefitMapper.selectById(user.getCompanyId(), refId);
        if (b == null) {
            throw new BusinessException(ErrorCode.DATA_NOT_FOUND, "복리후생비 신청 정보를 찾을 수 없습니다.");
        }
        String year = args.get("yyyy");
        String month = args.get("mm");
        String code = b.benefitCode();
        String dateCode = code.length() >= 2 ? code.substring(code.length() - 2, code.length() - 1) : "";
        String title = null;
        if ("B".equals(dateCode)) {
            title = b.benefitName() + " 지원신청서 (" + year + "년 " + month + "월분)_" + user.getName();
        } else if ("A".equals(dateCode)) {
            title = b.benefitName() + " 지원신청서 (" + b.occDate() + ")_" + user.getName();
        }
        BenefitSenderRow s = mapper.selectSender(user.getUserId());

        // createMapping L386-402
        Map<String, String> mapping = new HashMap<>();
        mapping.put("부서", str(s == null ? null : Html.esc(s.orgName())));
        mapping.put("성명", str(Html.esc(user.getName())));
        mapping.put("직위", str(s == null ? null : Html.esc(s.posName())));
        mapping.put("직책", str(s == null ? null : Html.esc(s.titleName())));
        LocalDate today = LocalDate.now();
        mapping.put("상신일", today.getYear() + "년 " + String.format("%02d", today.getMonthValue()) + "월 " + String.format("%02d", today.getDayOfMonth()) + "일");
        mapping.put("내용", str(Html.esc(b.benefitDetail())));
        mapping.put("신청금액", b.issueAmt() == null ? "- " : new DecimalFormat("###,###,###").format(b.issueAmt()));
        mapping.put("신청금액_한글", str(toKorean(b.issueAmt())));
        mapping.put("전화번호", str(s == null ? null : Html.esc(s.mobileTelNo())));
        mapping.put("발생일자", b.occDate() == null ? "- " : b.occDate().toString());
        mapping.put("발생년월", year + "년 " + month + "월");

        return new Seed(title, support.fill(user.getCompanyId(), linkCode, mapping), null, false, false);
    }

    /** NumberToKorean L450-477 */
    public static String toKorean(Long amt) {
        String numStr = String.valueOf(amt);
        String[] han1 = {"", "일", "이", "삼", "사", "오", "육", "칠", "팔", "구"};
        String[] han2 = {"", "십", "백", "천"};
        String[] han3 = {"", "만", "억", "조", "경"};
        StringBuilder result = new StringBuilder();
        int len = numStr.length();
        boolean hasHan3 = false;
        for (int i = len; i > 0; i--) {
            int nowInt = Integer.parseInt(numStr.substring(len - i, len - i + 1));
            int han2Pick = (i - 1) % 4;
            if (nowInt > 0) {
                result.append(han1[nowInt]).append(han2[han2Pick]);
                if (han2Pick > 0) {
                    hasHan3 = false;
                }
            }
            if (!hasHan3 && han2Pick == 0) {
                result.append(han3[(i - 1) / 4]);
                hasHan3 = true;
            }
        }
        return result.toString();
    }
}
