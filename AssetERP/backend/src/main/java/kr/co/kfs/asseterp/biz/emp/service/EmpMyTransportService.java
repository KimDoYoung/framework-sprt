package kr.co.kfs.asseterp.biz.emp.service;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.emp.dto.MyTransportApprCreateRes;
import kr.co.kfs.asseterp.biz.emp.dto.MyTransportApprRes;
import kr.co.kfs.asseterp.biz.emp.dto.MyTransportRes;
import kr.co.kfs.asseterp.biz.emp.dto.MyTransportSaveReq;
import kr.co.kfs.asseterp.biz.emp.mapper.EmpMyTransportMapper;
import kr.co.kfs.asseterp.common.error.BusinessException;
import kr.co.kfs.asseterp.common.error.ErrorCode;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Set;
import java.util.regex.Pattern;

/** 여비교통비 신청 (AS-IS Emp50_Tab_TransportExpense → server/emp/Emp50_TransportExpense·Emp51_RelateAppr) */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class EmpMyTransportService {

    private static final Pattern YYYYMM = Pattern.compile("\\d{4}\\.\\d{2}");
    private static final Set<String> APPR_ACTIVE = Set.of("10", "20", "30");

    private final EmpMyTransportMapper mapper;

    /** AS-IS emp.Emp50_TransportExpense.selectByYearMonth (본인, 기준년월 YYYY.MM) */
    public List<MyTransportRes> search(UserPrincipal user, String yyyymm) {
        return mapper.selectByYearMonth(user.getCompanyId(), user.getUserId(), requireYyyymm(yyyymm));
    }

    /**
     * AS-IS emp.Emp50_TransportExpense.update/copyUpdate(UpdateDataModel) — transportExpenseId 0 이하는 INSERT.
     * 화면의 검사(상신·마감 뒤에는 못 고침, 필수 칸)를 서버도 한다.
     */
    @Transactional
    public List<MyTransportRes> save(UserPrincipal user, List<MyTransportSaveReq> rows) {
        List<MyTransportRes> saved = new ArrayList<>();
        for (MyTransportSaveReq row : rows) {
            validate(row);
            long id;
            if (row.transportExpenseId() == null || row.transportExpenseId() <= 0) {
                requireYyyymm(row.yyyymm());
                requireEditable(user, row.yyyymm());
                id = mapper.selectNextId();
                mapper.insertRow(user.getCompanyId(), user.getUserId(), id, row);
            } else {
                MyTransportRes old = requireMine(user, row.transportExpenseId());
                requireEditable(user, old.yyyymm());
                id = row.transportExpenseId();
                mapper.updateRow(user.getCompanyId(), user.getUserId(), row);
            }
            saved.add(mapper.selectMineById(user.getCompanyId(), user.getUserId(), id));
        }
        return saved;
    }

    /** AS-IS emp.Emp50_TransportExpense.delete */
    @Transactional
    public void delete(UserPrincipal user, List<Long> ids) {
        if (ids == null || ids.isEmpty()) throw new BusinessException(ErrorCode.INVALID_INPUT);
        for (Long id : ids) requireEditable(user, requireMine(user, id).yyyymm());
        for (Long id : ids) mapper.deleteRow(user.getCompanyId(), user.getUserId(), id);
    }

    // ===== Emp51_RelateAppr (본인 신청서) =====

    /** AS-IS emp.Emp51_RelateAppr.selectByPersonId (apprChk) — 정확히 한 건일 때만 그 문서, 아니면 null(미상신) */
    public MyTransportApprRes getAppr(UserPrincipal user, String yyyymm) {
        List<MyTransportApprRes> list = mapper.selectApprByPersonId(user.getCompanyId(), user.getUserId(), requireYyyymm(yyyymm));
        return list.size() == 1 ? list.get(0) : null;
    }

    /** AS-IS emp.Emp51_RelateAppr.selectApprId (행이 없거나 문서가 없으면 원본은 NPE) */
    public Long getApprId(UserPrincipal user, String yyyymm) {
        List<MyTransportApprRes> list = mapper.selectApprByPersonId(user.getCompanyId(), user.getUserId(), requireYyyymm(yyyymm));
        if (list.isEmpty() || list.get(0).apprId() == null) throw new BusinessException(ErrorCode.DATA_NOT_FOUND);
        return list.get(0).apprId();
    }

    /** AS-IS emp.Emp51_RelateAppr.selectByCloseYn (closeChk·checkClose) — 그 달에 마감된 신청서가 하나라도 있으면 true */
    public boolean isClosed(UserPrincipal user, String yyyymm) {
        return "true".equals(mapper.selectCloseYn(user.getCompanyId(), requireYyyymm(yyyymm)));
    }

    /** AS-IS emp.Emp51_RelateAppr.insert — 있던 신청서는 지우고 새 ID·신청번호로 다시 만든다 */
    @Transactional
    public MyTransportApprCreateRes createAppr(UserPrincipal user, String yyyymm, Long regAmt) {
        requireYyyymm(yyyymm);
        List<MyTransportApprRes> found = mapper.selectApprByPersonId(user.getCompanyId(), user.getUserId(), yyyymm);
        if (found.size() > 1) throw new BusinessException(ErrorCode.INVALID_INPUT);   // 원본 selectOne 오류
        if (!found.isEmpty()) mapper.deleteAppr(user.getCompanyId(), found.get(0).relateApprId());
        String regNo = mapper.selectRegNo(user.getCompanyId(), user.getUserId(), yyyymm);
        long id = mapper.selectNextId();
        mapper.insertAppr(user.getCompanyId(), user.getUserId(), id, yyyymm, regNo, LocalDate.now(), regAmt);
        return new MyTransportApprCreateRes(id, regNo);
    }

    /** AS-IS emp.Emp51_RelateAppr.updateApprId (회사·본인 조건 추가) */
    @Transactional
    public void updateApprId(UserPrincipal user, Long relateApprId, Long apprId) {
        if (apprId == null || mapper.updateApprId(user.getCompanyId(), user.getUserId(), relateApprId, apprId) == 0) {
            throw new BusinessException(ErrorCode.DATA_NOT_FOUND);
        }
    }

    private MyTransportRes requireMine(UserPrincipal user, Long id) {
        MyTransportRes row = id == null ? null : mapper.selectMineById(user.getCompanyId(), user.getUserId(), id);
        if (row == null) throw new BusinessException(ErrorCode.DATA_NOT_FOUND);
        return row;
    }

    private static String requireYyyymm(String yyyymm) {
        if (yyyymm == null || !YYYYMM.matcher(yyyymm).matches()) throw new BusinessException(ErrorCode.INVALID_INPUT, "기준년월을 확인해주세요.");
        return yyyymm;
    }

    /** Emp50_Tab_TransportExpense.preCheck L471-519: 상신(10·20·30) → 마감 순으로 막는다 */
    private void requireEditable(UserPrincipal user, String yyyymm) {
        MyTransportApprRes appr = getAppr(user, yyyymm);
        if (appr != null && APPR_ACTIVE.contains(appr.statusCode())) throw new BusinessException(ErrorCode.INVALID_INPUT, "이미 상신된 문서입니다.");
        if (isClosed(user, yyyymm)) throw new BusinessException(ErrorCode.INVALID_INPUT, "이미 마감된 달입니다. 다음달에 신청해주세요");
    }

    /** Emp50_Tab_TransportExpense.update L536-561 의 필수 검사(메시지 그대로) */
    private static void validate(MyTransportSaveReq r) {
        if (r.date() == null) throw new BusinessException(ErrorCode.INVALID_INPUT, "일자는 필수 입력항목입니다.");
        if (isBlank(r.startPoint())) throw new BusinessException(ErrorCode.INVALID_INPUT, "출발지는 필수 입력항목입니다.");
        if (isBlank(r.closePoint())) throw new BusinessException(ErrorCode.INVALID_INPUT, "도착지는 필수 입력항목입니다.");
        if (isBlank(r.startTime())) throw new BusinessException(ErrorCode.INVALID_INPUT, "출발시간은 필수 입력항목입니다.");
        if (isBlank(r.closeTime())) throw new BusinessException(ErrorCode.INVALID_INPUT, "도착시간은 필수 입력항목입니다.");
        if (r.amt() == null) throw new BusinessException(ErrorCode.INVALID_INPUT, "금액은 필수 입력항목입니다.");
    }

    private static boolean isBlank(String s) {
        return s == null || s.isEmpty();
    }
}
