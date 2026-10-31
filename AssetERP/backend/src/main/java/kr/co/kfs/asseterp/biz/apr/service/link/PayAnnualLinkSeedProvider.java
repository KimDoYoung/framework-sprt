package kr.co.kfs.asseterp.biz.apr.service.link;

import java.text.NumberFormat;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.Set;

import org.springframework.stereotype.Component;

import kr.co.kfs.asseterp.biz.apr.mapper.AprPayLinkSeedMapper;
import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.pay.dto.PayActMappingRes;
import kr.co.kfs.asseterp.biz.pay.dto.PayAnnualRes;
import kr.co.kfs.asseterp.biz.pay.mapper.PayActMappingMapper;
import kr.co.kfs.asseterp.biz.pay.mapper.PayAnnualMapper;
import kr.co.kfs.asseterp.common.error.BusinessException;
import kr.co.kfs.asseterp.common.error.ErrorCode;
import lombok.RequiredArgsConstructor;

/**
 * D01 연봉계약 (Apr01_Edit_ApprDoc.insertLinkApproval L1793-1857 · 호출 화면 Pay01_Tab_Annual.createMapping L682-727).
 * refId = 연봉계약 행(pay01_annual_id). 제목은 `연봉계약_(시작~종료)_성명`, 읽기 전용·[저장] 숨김(기본).
 * 본문은 사원의 유형 코드(`emp.Emp03_Trans.selectByDate`, 없으면 "10")로 `pay.Pay06_ActMapping.selectByLinkCode`의 계약서 양식을 찾아
 * `#{키}`를 연봉 값으로 바꾼다. 양식이 하나면 그것, 둘 이상이면 args `actMappingId`로 고른 것(AS-IS `Pay06_Lookup_LinkContent`),
 * 없거나 못 고르면 null — 서비스가 문서분류의 대표 양식을 쓴다(AS-IS는 본문을 안 채운다).
 */
@Component
@RequiredArgsConstructor
public class PayAnnualLinkSeedProvider implements AprLinkSeedProvider {

    private static final DateTimeFormatter KOR_TODAY = DateTimeFormatter.ofPattern("yyyy 년 MM 월 dd 일");

    private final PayAnnualMapper annualMapper;
    private final PayActMappingMapper actMappingMapper;
    private final AprPayLinkSeedMapper linkMapper;

    @Override
    public Set<String> linkCodes() {
        return Set.of("D01");
    }

    @Override
    public Seed seed(UserPrincipal user, String linkCode, Long refId) {
        return seed(user, linkCode, refId, Map.of());
    }

    @Override
    public Seed seed(UserPrincipal user, String linkCode, Long refId, Map<String, String> args) {
        PayAnnualRes a = refId == null ? null : annualMapper.selectById(refId, user.getCompanyId(), 2);
        if (a == null) {
            throw new BusinessException(ErrorCode.DATA_NOT_FOUND, "연봉계약 내역을 찾을 수 없습니다.");
        }
        String title = "연봉계약_(" + a.startDate() + "~" + a.closeDate() + ")_" + a.personName();

        List<PayActMappingRes> forms = forms(user.getCompanyId(), a);
        PayActMappingRes form = null;
        if (forms.size() == 1) {
            form = forms.get(0);
        } else if (forms.size() > 1 && args != null && args.get("actMappingId") != null) {
            String want = args.get("actMappingId");
            form = forms.stream().filter(f -> String.valueOf(f.actMappingId()).equals(want)).findFirst().orElse(null);
        }
        String content = form == null || form.content() == null ? null : fill(form.content(), mapping(a));
        return Seed.of(title, content);
    }

    /** 이 연봉계약의 사원 유형에 맞는 계약서 양식 후보 (Pay01_Tab_Annual의 [상신]이 여러 개면 고르는 창을 띄운다) */
    public List<PayActMappingRes> forms(Long companyId, PayAnnualRes a) {
        String kindCode = linkMapper.selectTransKindCode(a.personId(), a.startDate());
        if (kindCode == null) {
            kindCode = "10"; // Emp03_Trans.selectByDate 기본값
        }
        return actMappingMapper.selectByLinkCode(companyId, "D01", kindCode);
    }

    private static String fill(String content, Map<String, String> mapping) {
        for (Map.Entry<String, String> e : mapping.entrySet()) {
            content = content.replace("#{" + e.getKey() + "}", e.getValue());
        }
        return content;
    }

    /** Pay01_Tab_Annual.createMapping L682-727 — checkStringNull/checkDateNull/checkLongNull은 비었으면 "- " */
    private static Map<String, String> mapping(PayAnnualRes a) {
        Map<String, String> m = new LinkedHashMap<>();
        // 사원정보
        m.put("사번", str(a.personNo()));
        m.put("성명", str(a.personName()));
        m.put("직위", str(a.posName()));
        m.put("주소", str(a.personAddress()));
        m.put("생년월일", date(a.birthDay()));
        m.put("부서명", str(a.orgName()));
        m.put("입사일", date(a.hireDate()));
        // 연봉정보
        m.put("적용시작일", date(a.startDate()));
        m.put("적용종료일", date(a.closeDate()));
        m.put("시업시간", str(a.startTime()));
        m.put("종업시간", str(a.closeTime()));
        m.put("연장근로시간", lng(a.monthOtHours()));
        m.put("기본연봉", lng(a.annualPay()));
        m.put("퇴직금", lng(a.retirePay()));
        m.put("총연봉", lng(a.yearPay()));
        m.put("기타약정사항", str(a.etcAgreement()));
        // 월급정보
        m.put("기본급여", lng(a.basicPay()));
        m.put("중식대", lng(a.mealPay()));
        m.put("차량유지비", lng(a.carMt()));
        m.put("양육수당", lng(a.childcareAllowance()));
        m.put("연장근로", lng(a.overPay()));
        m.put("기타급여1", lng(a.etc01Pay()));
        m.put("기타급여2", lng(a.etc02Pay()));
        m.put("합계", lng(a.monthPay()));
        // 회사정보
        m.put("회사명", str(a.companyName()));
        m.put("회사주소", str(a.companyAddress()));
        m.put("회사대표", str(a.companyAgent()));
        m.put("년월일", LocalDate.now().format(KOR_TODAY));
        return m;
    }

    private static String str(String s) {
        return s == null ? "- " : s;
    }

    private static String date(LocalDate d) {
        return d == null ? "- " : d.toString();
    }

    private static String lng(Long n) {
        return n == null ? "- " : NumberFormat.getIntegerInstance(Locale.US).format(n);
    }
}
