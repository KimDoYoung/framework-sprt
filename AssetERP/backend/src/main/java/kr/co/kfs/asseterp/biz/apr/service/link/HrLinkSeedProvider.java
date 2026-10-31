package kr.co.kfs.asseterp.biz.apr.service.link;

import static kr.co.kfs.asseterp.biz.apr.service.link.FormMappingLinkSeedSupport.date;
import static kr.co.kfs.asseterp.biz.apr.service.link.FormMappingLinkSeedSupport.str;

import java.text.DecimalFormat;
import java.time.LocalDate;
import java.util.HashMap;
import java.util.Map;
import java.util.Set;

import org.springframework.stereotype.Component;

import kr.co.kfs.asseterp.biz.apr.dto.HrLinkErrandRow;
import kr.co.kfs.asseterp.biz.apr.dto.HrLinkLeaveRow;
import kr.co.kfs.asseterp.biz.apr.dto.HrLinkOvertimeRow;
import kr.co.kfs.asseterp.biz.apr.dto.HrLinkPmWorkRow;
import kr.co.kfs.asseterp.biz.apr.dto.HrLinkUserRow;
import kr.co.kfs.asseterp.biz.apr.mapper.AprHrLinkSeedMapper;
import kr.co.kfs.asseterp.biz.apr.mapper.AprApprNewMapper;
import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.common.error.BusinessException;
import kr.co.kfs.asseterp.common.error.ErrorCode;
import lombok.RequiredArgsConstructor;

/**
 * 인사·근태 치환형 링크코드 (Apr01_Edit_ApprDoc.insertLinkApproval: A74 L1592-1631, A73 L1632-1671, A01 L1672-1725, A45 L2175-2204).
 * 모두 `Com10_FormMapping.selectByLinkCode` 본문의 `#{키}`를 호출 화면 createMapping 값으로 바꾼다(없으면 문서분류 대표 양식).
 * 호출 화면(휴가신청 Y01·외출등록 Y04·오후근무 창·연장근무 신청 창)이 TOBE에 없어 제공자만 있다 — refId = 휴가/외출/오후근무/연장근무 행 번호.
 */
@Component
@RequiredArgsConstructor
public class HrLinkSeedProvider implements AprLinkSeedProvider {

    private final AprHrLinkSeedMapper mapper;
    private final AprApprNewMapper newMapper;
    private final FormMappingLinkSeedSupport support;

    @Override
    public Set<String> linkCodes() {
        return Set.of("A01", "A45", "A73", "A74");
    }

    @Override
    public Seed seed(UserPrincipal user, String linkCode, Long refId) {
        Long companyId = user.getCompanyId();
        return switch (linkCode) {
            case "A01" -> leave(user, refId);
            case "A45" -> errand(companyId, refId);
            case "A73" -> pmWork(user, refId);
            default -> overtime(user, refId);
        };
    }

    private HrLinkUserRow userInfo(UserPrincipal user) {
        HrLinkUserRow u = mapper.selectUserInfo(user.getUserId());
        return u == null ? new HrLinkUserRow(null, null, null, null) : u;
    }

    private String orgName(UserPrincipal user) {
        Long orgCodeId = newMapper.selectOrgCodeId(user.getUserId());
        return orgCodeId == null ? "" : newMapper.selectOrgName(orgCodeId);
    }

    private static BusinessException notFound(String what) {
        return new BusinessException(ErrorCode.DATA_NOT_FOUND, what + " 정보를 찾을 수 없습니다.");
    }

    /** `사원명 직급` — 제목에 붙는 LoginUser.getUserName() + " " + getPosName() (직급이 없으면 자바처럼 "null") */
    private static String who(UserPrincipal user, HrLinkUserRow u) {
        return user.getName() + " " + u.posName();
    }

    // ───── A01 휴가신청 ─────
    private Seed leave(UserPrincipal user, Long refId) {
        HrLinkLeaveRow m = refId == null ? null : mapper.selectLeaveLink(user.getCompanyId(), refId);
        if (m == null) {
            throw notFound("휴가");
        }
        HrLinkUserRow u = userInfo(user);
        String title = m.leaveName() + " 신청서 / " + who(user, u) + " (" + m.startDate() + "~" + m.closeDate() + ")";
        // 특별휴가(04)는 시작일이 오늘 이후일 때만 시행일자=시작일, 아니면 오늘. 그 밖은 시작일
        LocalDate today = newMapper.selectToday();
        LocalDate effect = "04".equals(m.leaveCode()) && m.startDate().isBefore(today) ? today : m.startDate();

        Map<String, String> mp = new HashMap<>();
        mp.put("회사명", str(user.getCompanyName()));
        mp.put("부서명", str(orgName(user)));
        mp.put("성명", str(user.getName()));
        mp.put("직위", str(u.posName()));
        mp.put("휴가구분", str(m.leaveName()));
        mp.put("휴가시작일", date(m.startDate(), false));
        mp.put("휴가종료일", date(m.closeDate(), false));
        mp.put("휴가기간", m.leaveCount() == null ? "- " : new DecimalFormat("#,###.##").format(m.leaveCount()));
        if (m.spcLeaveName() != null) {
            mp.put("사유", m.reason() != null ? str(m.spcLeaveName() + "<br>" + m.reason()) : str(m.spcLeaveName()));
        } else {
            mp.put("사유", str(m.reason()));
        }
        mp.put("대결자", str(m.altPersonName()));
        mp.put("대직자", str(m.managerName()));
        mp.put("비상망", str(m.emergencyTelno()));
        mp.put("상신일", today.getYear() + "년 " + String.format("%02d월 %02d일", today.getMonthValue(), today.getDayOfMonth()));
        return new Seed(title, support.fill(user.getCompanyId(), "A01", mp), effect, true, false);
    }

    // ───── A45 외출등록 ─────
    private Seed errand(Long companyId, Long refId) {
        HrLinkErrandRow m = refId == null ? null : mapper.selectErrandLink(companyId, refId);
        if (m == null) {
            throw notFound("외출");
        }
        Map<String, String> mp = new HashMap<>();
        mp.put("소속", str(m.orgName()));
        mp.put("성명", str(m.personName()));
        mp.put("구분", str(m.errandName()));
        mp.put("일자", date(m.date(), false));
        mp.put("외출시각", str(m.departTime()));
        mp.put("복귀시각", str(m.returnTime()));
        mp.put("사유", str(m.reason()));
        mp.put("주최자", str(m.host()));
        mp.put("장소", str(m.venue()));
        mp.put("비고", str(m.note()));
        // 제목설정: linkTitle = null → 문서분류 기본 제목
        return new Seed(null, support.fill(companyId, "A45", mp), null, true, false);
    }

    /** checkLongNull02 — `N시간 MM분` */
    private static String hoursMinutes(Long num) {
        if (num == null) {
            return "- ";
        }
        return (num / 60) + "시간 " + String.format("%02d", num % 60) + "분";
    }

    private Map<String, String> userMap(UserPrincipal user, HrLinkUserRow u) {
        Map<String, String> mp = new HashMap<>();
        mp.put("소속", str(orgName(user)));
        mp.put("사번", str(u.empNo()));
        mp.put("성명", str(user.getName()));
        mp.put("직급", str(u.posName()));
        mp.put("직책", str(u.titleName()));
        mp.put("연락처", str(u.mobileTelno()));
        mp.put("신청일자", date(newMapper.selectToday(), false));
        return mp;
    }

    // ───── A73 오후근무신청 ─────
    private Seed pmWork(UserPrincipal user, Long refId) {
        HrLinkPmWorkRow m = refId == null ? null : mapper.selectPmWorkLink(user.getCompanyId(), refId);
        if (m == null) {
            throw notFound("오후근무");
        }
        HrLinkUserRow u = userInfo(user);
        String title = "오후근무 신청서 / " + who(user, u) + " (" + m.workDate() + ")";
        Map<String, String> mp = userMap(user, u);
        mp.put("근무일자", date(m.workDate(), false));
        mp.put("근무시간", str(m.timeStr()));
        mp.put("휴게시간", hoursMinutes(m.breakMinutes()));
        mp.put("실근로", str(m.workTimeStr()));
        mp.put("사유", str(m.reason()));
        return new Seed(title, support.fill(user.getCompanyId(), "A73", mp), m.workDate(), true, false);
    }

    // ───── A74 연장근무신청 ─────
    private Seed overtime(UserPrincipal user, Long refId) {
        HrLinkOvertimeRow m = refId == null ? null : mapper.selectOvertimeLink(user.getCompanyId(), refId);
        if (m == null) {
            throw notFound("연장근무");
        }
        HrLinkUserRow u = userInfo(user);
        String title = m.workTypeName() + " 신청서 / " + who(user, u) + " (" + m.workDate() + ")";
        Map<String, String> mp = userMap(user, u);
        mp.put("근무일자", date(m.workDate(), false));
        mp.put("구분", str(m.workTypeName()));
        mp.put("근무시간", str(m.overTimeStr()));
        mp.put("시간분", m.overtimeMin() == null ? "- " : new DecimalFormat("#,###").format(m.overtimeMin()));
        mp.put("사유", str(m.reason()));
        mp.put("보상방법", str(m.workRewardTypeName()));
        return new Seed(title, support.fill(user.getCompanyId(), "A74", mp), m.workDate(), true, false);
    }
}
