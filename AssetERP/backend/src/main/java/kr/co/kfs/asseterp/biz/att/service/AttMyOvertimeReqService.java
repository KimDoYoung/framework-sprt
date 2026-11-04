package kr.co.kfs.asseterp.biz.att.service;

import kr.co.kfs.asseterp.biz.att.dto.AttMyOvertimeInfoRes;
import kr.co.kfs.asseterp.biz.att.dto.AttMyOvertimePolicyRow;
import kr.co.kfs.asseterp.biz.att.dto.AttMyOvertimeReqRes;
import kr.co.kfs.asseterp.biz.att.dto.AttMyOvertimeSaveReq;
import kr.co.kfs.asseterp.biz.att.dto.AttMyOvertimeSettingsRes;
import kr.co.kfs.asseterp.biz.att.dto.AttMyOvertimeTimeConfigRow;
import kr.co.kfs.asseterp.biz.att.mapper.AttMyOvertimeReqMapper;
import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.common.error.BusinessException;
import kr.co.kfs.asseterp.common.error.ErrorCode;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.temporal.TemporalAdjusters;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

/** AS-IS client/vi/att/Att03_Lookup_OvertimeReq(연장근무신청 창) + server/att/Att03_OvertimeReq — 내 연장근무 신청만 다룬다 */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class AttMyOvertimeReqService {

    private static final long DEFAULT_WEEK_MAX_ADD_HOURS = 12L;

    private final AttMyOvertimeReqMapper mapper;

    /** retrieve() L750: att.Att03_OvertimeReq.selectByPersonId(내 ID, 근무일자) */
    public List<AttMyOvertimeReqRes> search(UserPrincipal user, LocalDate baseDate) {
        return mapper.selectByPersonId(user.getUserId(), baseDate);
    }

    /** getMarkingList() L768: att.Att03_OvertimeReq.selectByYearMonth — 신청이 있는 날짜 */
    public List<String> workDates(UserPrincipal user, String yyyyMM) {
        return mapper.selectWorkDatesByYearMonth(user.getCompanyId(), user.getUserId(), yyyyMM);
    }

    /** retrieveLabel() L797: att.Att03_OvertimeReq.getInfo */
    public AttMyOvertimeInfoRes info(UserPrincipal user, LocalDate baseDate) {
        return mapper.getInfo(user.getUserId(), baseDate);
    }

    /** defaultInfo() L182 + insertRow01() L496: 근태 정책(정확히 1건일 때만)·근로시간 기준(없으면 22:00~06:00, 12시간)·그날 오후근무 */
    public AttMyOvertimeSettingsRes settings(UserPrincipal user, LocalDate baseDate) {
        List<AttMyOvertimePolicyRow> policies = mapper.selectPolicies(user.getCompanyId(), baseDate);
        boolean found = policies.size() == 1;
        AttMyOvertimeTimeConfigRow cfg = timeConfig(user.getCompanyId());
        boolean pm = baseDate != null && mapper.countPmWorkOnDate(user.getCompanyId(), user.getUserId(), baseDate) > 0;
        return new AttMyOvertimeSettingsRes(found, found ? policies.get(0).workEndTime() : null, found ? policies.get(0).pmWorkEndTime() : null,
                cfg.ntStartTime(), cfg.ntEndTime(), cfg.weekMaxAddHours(), pm);
    }

    private AttMyOvertimeTimeConfigRow timeConfig(Long companyId) {
        AttMyOvertimeTimeConfigRow cfg = mapper.selectTimeConfig(companyId);
        if (cfg == null || cfg.weekMaxAddHours() == null) {
            return new AttMyOvertimeTimeConfigRow("22:00", "06:00", DEFAULT_WEEK_MAX_ADD_HOURS);
        }
        return cfg;
    }

    /** 결재 중·완료(10 상신·20 진행·30 완료)는 수정·삭제 불가 */
    private static boolean locked(String statusCode) {
        return "10".equals(statusCode) || "20".equals(statusCode) || "30".equals(statusCode);
    }

    private static boolean blank(String s) {
        return s == null || s.isBlank();
    }

    /**
     * updateChk01 L595 → updateChk02 L655 → update L730.
     * ① 바뀐 행: 결재 중·완료 수정 불가 / 필수값 ② 화면 밖 내 신청(화면에서 뺀 하위 행 포함)과 합쳐 같은 근무일자·같은 구분 1건만
     * ③ 근무일자가 속한 주(월~일)의 연장시간 합계가 최대를 넘지 않게 ④ 뺀 행 삭제 → 바뀐 행 저장.
     */
    @Transactional
    public void save(UserPrincipal user, AttMyOvertimeSaveReq req) {
        if (req == null || req.rows() == null) throw new BusinessException(ErrorCode.INVALID_INPUT);
        Long companyId = user.getCompanyId();
        Long personId = user.getUserId();
        List<AttMyOvertimeSaveReq.Row> rows = req.rows();

        List<Long> savedIds = rows.stream().map(AttMyOvertimeSaveReq.Row::overtimeReqId).filter(i -> i != null && i > 0).toList();
        Set<Long> lockedIds = new HashSet<>();
        if (!savedIds.isEmpty()) {
            for (AttMyOvertimeReqRes r : mapper.selectByIds(companyId, personId, savedIds)) {
                if (locked(r.statusCode())) lockedIds.add(r.overtimeReqId());
            }
        }
        for (AttMyOvertimeSaveReq.Row r : rows) {
            if (!r.changed()) continue;
            if (lockedIds.contains(r.overtimeReqId())) throw new BusinessException(ErrorCode.INVALID_INPUT, "결재진행/완료된 연장근무내역은 수정할 수 없습니다.");
            if (r.workDate() == null) throw new BusinessException(ErrorCode.INVALID_INPUT, "근무일자를 지정해주세요");
            if (r.workTypeCode() == null) throw new BusinessException(ErrorCode.INVALID_INPUT, "구분값을 지정해주세요");
            if (r.overtimeMin() == null) throw new BusinessException(ErrorCode.INVALID_INPUT, "연장시간(분)를 지정해주세요");
            if (blank(r.reason())) throw new BusinessException(ErrorCode.INVALID_INPUT, "사유를 지정해주세요");
            if (r.workRewardTypeCode() == null) throw new BusinessException(ErrorCode.INVALID_INPUT, "보상구분값을 지정해주세요");
        }

        // updateChk02: 화면의 모든 행 + 화면에 없는 내 신청(notInOvertimeReqIdList — 삭제 대기 행도 DB에 있으므로 들어온다)
        List<LocalDate> dates = new ArrayList<>();
        List<String> types = new ArrayList<>();
        List<Long> mins = new ArrayList<>();
        rows.forEach(r -> { dates.add(r.workDate()); types.add(r.workTypeCode()); mins.add(r.overtimeMin()); });
        mapper.notInOvertimeReqIdList(companyId, personId, savedIds)
                .forEach(o -> { dates.add(o.workDate()); types.add(o.workTypeCode()); mins.add(o.overtimeMin()); });
        for (int i = 0; i < dates.size(); i++) {
            for (int j = i + 1; j < dates.size(); j++) {
                if (dates.get(i) != null && dates.get(i).equals(dates.get(j)) && types.get(i) != null && types.get(i).equals(types.get(j))) {
                    throw new BusinessException(ErrorCode.INVALID_INPUT, "같은 근무일자에 동일한 연장근무 구분은 1건만 등록할 수 있습니다.");
                }
            }
        }

        // checkWeekMaxTime L164: 화면 근무일자가 속한 주(월~일)의 합계 (분 단위 비교, 메시지는 시간)
        if (req.baseDate() != null) {
            int weekMax = timeConfig(companyId).weekMaxAddHours().intValue() * 60;
            LocalDate weekStart = req.baseDate().with(TemporalAdjusters.previousOrSame(DayOfWeek.MONDAY));
            LocalDate weekEnd = weekStart.plusDays(6);
            int total = 0;
            for (int i = 0; i < dates.size(); i++) {
                LocalDate d = dates.get(i);
                if (d == null || mins.get(i) == null) continue;
                if (!d.isBefore(weekStart) && !d.isAfter(weekEnd)) total += mins.get(i).intValue();
            }
            if (total > weekMax) {
                throw new BusinessException(ErrorCode.INVALID_INPUT,
                        "주간 최대 연장근무시간인 '" + weekMax / 60 + "시간'을 초과했습니다. (현재 총 신청시간은 '" + total / 60 + "시간'입니다)");
            }
        }

        // update() L730: 뺀 행 삭제 → 바뀐 행 저장
        if (req.deleteIds() != null && !req.deleteIds().isEmpty()) {
            mapper.delete(companyId, personId, req.deleteIds());
        }
        for (AttMyOvertimeSaveReq.Row r : rows) {
            if (!r.changed()) continue;
            if (r.overtimeReqId() != null && r.overtimeReqId() > 0
                    && mapper.update(r.overtimeReqId(), companyId, personId, r.workDate(), r.overtimeMin(), r.reason(), r.workTypeCode(), r.workRewardTypeCode()) > 0) continue;
            Long id = r.overtimeReqId() != null && r.overtimeReqId() > 0 ? r.overtimeReqId() : mapper.selectNextId();
            mapper.insert(id, companyId, personId, r.workDate(), r.overtimeMin(), r.reason(), r.workTypeCode(), r.workRewardTypeCode());
        }
    }

    /** deleteRow L829: 결재 중·완료는 삭제 불가 → delete */
    @Transactional
    public int delete(UserPrincipal user, List<Long> ids) {
        if (ids == null || ids.isEmpty()) throw new BusinessException(ErrorCode.INVALID_INPUT);
        for (AttMyOvertimeReqRes r : mapper.selectByIds(user.getCompanyId(), user.getUserId(), ids)) {
            if (locked(r.statusCode())) throw new BusinessException(ErrorCode.INVALID_INPUT, "결재완료된 항목은 삭제불가능합니다");
        }
        return mapper.delete(user.getCompanyId(), user.getUserId(), ids);
    }

    /** updateApprId L348: 상신한 문서 ID를 행에 기록 */
    @Transactional
    public void updateApprId(UserPrincipal user, Long overtimeReqId, Long apprId) {
        if (mapper.updateApprId(user.getCompanyId(), user.getUserId(), overtimeReqId, apprId) == 0) {
            throw new BusinessException(ErrorCode.DATA_NOT_FOUND);
        }
    }
}
