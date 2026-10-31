package kr.co.kfs.asseterp.biz.apr.service.link;

import static kr.co.kfs.asseterp.biz.apr.service.link.FormMappingLinkSeedSupport.date;
import static kr.co.kfs.asseterp.biz.apr.service.link.FormMappingLinkSeedSupport.str;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.Map;
import java.util.Set;

import org.springframework.stereotype.Component;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.emp.dto.CertMappingRow;
import kr.co.kfs.asseterp.biz.emp.mapper.EmpCertMapper;
import kr.co.kfs.asseterp.common.error.BusinessException;
import kr.co.kfs.asseterp.common.error.ErrorCode;
import lombok.RequiredArgsConstructor;

/**
 * B01~B04 증명서 발급 (Apr01_Edit_ApprDoc.insertLinkApproval L2448-2484 · Emp15_Tab_Cert.createMapping L418-443 · Emp15_CertModel 계산 getter).
 * 대외문서라 수신·참조를 "-"로 채운다. 제목 읽기전용, [저장] 숨김(기본). refId = 증명서 ID(emp15_cert_id).
 */
@Component
@RequiredArgsConstructor
public class CertLinkSeedProvider implements AprLinkSeedProvider {

    private final EmpCertMapper certMapper;
    private final FormMappingLinkSeedSupport support;

    @Override
    public Set<String> linkCodes() {
        return Set.of("B01", "B02", "B03", "B04");
    }

    @Override
    public Seed seed(UserPrincipal user, String linkCode, Long refId) {
        CertMappingRow c = refId == null ? null : certMapper.selectCertMapping(user.getCompanyId(), refId);
        if (c == null) {
            throw new BusinessException(ErrorCode.DATA_NOT_FOUND, "증명서 정보를 찾을 수 없습니다.");
        }
        // 제목설정 L2456-2459: 증명서종류 + " 발급_(" + 발급일 + ")_" + 사원명 (비어 있으면 자바 문자열 이어 붙이기처럼 "null")
        String title = c.linkName() + " 발급_(" + (c.issueDate() == null ? "" : c.issueDate().toString()) + ")_" + c.personName();

        // createMapping L418-443
        Map<String, String> mapping = new HashMap<>();
        mapping.put("사번", str(c.personNo()));
        mapping.put("성명", str(c.personName()));
        mapping.put("생년월일", date(c.birthDay(), true));
        mapping.put("주민번호", str(maskedCtzNo(c.personCtzNo())));
        mapping.put("부서명", str(c.orgName()));
        mapping.put("주소", str(c.personAddress()));
        mapping.put("직책", str(c.personTitle()));
        mapping.put("직위", str(c.personPos()));
        mapping.put("입사일", date(c.hireDate(), false));
        mapping.put("퇴사일", str(c.retireDate()));
        mapping.put("근속년수", str(workYear(c.hireDate(), c.retireDate(), LocalDate.now())));
        mapping.put("발급일", date(c.issueDate(), false));
        mapping.put("용도", str(c.certUseName()));
        mapping.put("발령내역", str(c.transList()));
        mapping.put("징계내역", str(c.rewardList()));
        mapping.put("회사명", str(c.companyName()));
        mapping.put("회사주소", str(c.companyAddress()));
        mapping.put("회사대표", str(c.companyAgent()));

        String content = support.fill(user.getCompanyId(), linkCode, mapping);
        return new Seed(title, content, null, true, false, "-", "-");
    }

    /** Emp15_CertModel.getPersonCtzNo L272-278: 없으면 "미입력", 있으면 앞 8자리 + "******" (8자리보다 짧으면 GWT(자바스크립트) `substring(0, 8)`처럼 있는 만큼만 쓴다 — 주민번호가 빈 글자인 사원은 "******") */
    static String maskedCtzNo(String ctzNo) {
        if (ctzNo == null) {
            return "미입력";
        }
        return (ctzNo.length() < 8 ? ctzNo : ctzNo.substring(0, 8)) + "******";
    }

    /** Emp15_CertModel.getPersonWorkYear L280-317 — 퇴사일(yyyy-MM-dd 글자)이 있으면 그 달까지, 없으면 오늘 달까지 */
    static String workYear(LocalDate hireDate, String retireDate, LocalDate today) {
        if (hireDate == null) {
            return "입사일 미입력";
        }
        int cYear;
        int cMonth;
        if (retireDate != null) {
            cYear = Integer.parseInt(retireDate.substring(0, 4));
            cMonth = Integer.parseInt(retireDate.substring(5, 7));
        } else {
            cYear = today.getYear();
            cMonth = today.getMonthValue();
        }
        int resultYear = cYear - hireDate.getYear();
        int resultMonth;
        if (cMonth - hireDate.getMonthValue() < 0) {
            resultMonth = cMonth - hireDate.getMonthValue() + 12;
            resultYear -= 1;
        } else {
            resultMonth = cMonth - hireDate.getMonthValue();
        }
        return resultYear <= 0 ? resultMonth + "개월" : resultYear + "년 " + resultMonth + "개월";
    }
}
