package kr.co.kfs.asseterp.biz.emp.service;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.emp.dto.EtcLeaveCheckRes;
import kr.co.kfs.asseterp.biz.emp.dto.LeaveDaysRes;
import kr.co.kfs.asseterp.biz.emp.dto.MyLeaveCodesRes;
import kr.co.kfs.asseterp.biz.emp.dto.MyLeaveRes;
import kr.co.kfs.asseterp.biz.emp.dto.MyLeaveSaveReq;
import kr.co.kfs.asseterp.biz.emp.mapper.EmpMyLeaveMapper;
import kr.co.kfs.asseterp.biz.apr.service.AlertService;
import kr.co.kfs.asseterp.common.error.BusinessException;
import kr.co.kfs.asseterp.common.error.ErrorCode;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.Map;
import java.util.List;
import java.util.Set;

/** Y01 휴가신청 (AS-IS Emp20_Tab_Leave · Emp20_Edit_Leave → server/emp/Emp20_Leave) — 본인 휴가만 */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class EmpMyLeaveService {

    /** 결재가 진행 중이거나 끝난 문서 (10:진행 20:승인 30:완료) — 화면이 [임시저장][상신하기]를 숨기는 상태 */
    private static final Set<String> LOCKED_STATUS = Set.of("10", "20", "30");
    /** 삭제할 수 있는 상태 (Emp20_Tab_Leave.deleteRow L466-469: 없음·00·40:반려·99) */
    private static final Set<String> DELETABLE_STATUS = Set.of("00", "40", "99");

    private final EmpMyLeaveMapper mapper;
    private final AlertService alert;

    /** AS-IS emp.Emp20_Leave.selectByPersonId(personId=본인, stdYear, managerYn=false) */
    public List<MyLeaveRes> search(UserPrincipal user, String stdYear) {
        return mapper.selectMyLeaves(user.getUserId(), requireYear(stdYear));
    }

    /** AS-IS Emp20_Tab_Leave.checkRemainDay — emp.Emp20_Leave.selectByDays + emp.Emp22_EtcLeave.selectByDays (apprCheckYn=false) */
    public LeaveDaysRes getDays(UserPrincipal user, String stdYear) {
        return mapper.selectDays(user.getUserId(), requireYear(stdYear));
    }

    /** AS-IS sys.Sys00_Common.selectLeaveCode · selectSpcLeaveCode (회사 기준) + 로그인 사원 휴대폰(새 행 비상망 기본값) */
    public MyLeaveCodesRes getCodes(UserPrincipal user) {
        return new MyLeaveCodesRes(mapper.selectLeaveCodes(user.getCompanyId()), mapper.selectSpcLeaveCodes(user.getCompanyId()),
                mapper.selectMobileTelNo(user.getCompanyId(), user.getUserId()));
    }

    /** AS-IS Emp20_Edit_Leave.calculate → emp.Emp20_Leave.count — calcCode "1"이면 일자기준(countByDate) */
    public Double count(UserPrincipal user, LocalDate startDate, LocalDate closeDate, String leaveCode, String calcCode) {
        if (startDate == null || closeDate == null || leaveCode == null) throw new BusinessException(ErrorCode.INVALID_INPUT);
        return "1".equals(calcCode)
                ? mapper.countLeaveByDate(user.getCompanyId(), startDate, closeDate, leaveCode)
                : mapper.countLeave(user.getCompanyId(), startDate, closeDate, leaveCode);
    }

    /** AS-IS Emp20_Edit_Leave.chkReward → emp.Emp22_EtcLeave.selectByEtcLeaveId */
    public EtcLeaveCheckRes getEtcLeaveCheck(UserPrincipal user, Long etcLeaveId, Long leaveId) {
        EtcLeaveCheckRes row = mapper.selectEtcLeaveCheck(user.getCompanyId(), user.getUserId(), etcLeaveId, leaveId == null ? Long.valueOf(0L) : leaveId);
        if (row == null) throw new BusinessException(ErrorCode.DATA_NOT_FOUND);
        return row;
    }

    /** AS-IS emp.Emp20_Leave.selectById (본인) */
    public MyLeaveRes get(UserPrincipal user, Long leaveId) {
        return requireMine(user, leaveId);
    }

    /**
     * AS-IS emp.Emp20_Leave.update(UpdateDataModel) — leaveId 0 이하는 INSERT, 그 밖은 UPDATE. 저장한 행을 다시 읽어 준다(selectById).
     * 필수 검사 문구는 Emp20_Edit_Leave.updateRow L442-460 그대로, 결재가 진행 중이거나 취소된 문서는 화면이 [저장]을 숨기므로 서버도 거절한다.
     */
    @Transactional
    public MyLeaveRes save(UserPrincipal user, MyLeaveSaveReq req) {
        validate(req);
        MyLeaveSaveReq fixed = withTelno(req);
        long id;
        if (req.leaveId() == null || req.leaveId() <= 0) {
            id = mapper.selectNextId();
            mapper.insertLeave(user.getCompanyId(), user.getUserId(), id, fixed);
        } else {
            MyLeaveRes old = requireMine(user, req.leaveId());
            if ((old.apprStatusCode() != null && LOCKED_STATUS.contains(old.apprStatusCode())) || "취소".equals(old.cancel())) {
                throw new BusinessException(ErrorCode.INVALID_INPUT, "상신문서가 존재하는 내역은 수정이 불가능합니다");
            }
            id = req.leaveId();
            mapper.updateLeave(user.getCompanyId(), user.getUserId(), id, fixed);
        }
        return mapper.selectMineById(user.getCompanyId(), user.getUserId(), id);
    }

    /** AS-IS Emp20_Edit_Leave.updateApprId → emp.Emp20_Leave.update (결재문서 ID) */
    @Transactional
    public void updateApprId(UserPrincipal user, Long leaveId, Long apprId) {
        if (apprId == null) throw new BusinessException(ErrorCode.INVALID_INPUT);
        requireMine(user, leaveId);
        mapper.updateApprId(user.getCompanyId(), user.getUserId(), leaveId, apprId);
    }

    /** AS-IS Emp20_Tab_Leave.deleteChk → apr.Apr07_AltAppr.selectByLeaveId — 대결자 지정 내역이 있는가 */
    public boolean hasAltAppr(UserPrincipal user, Long leaveId) {
        requireMine(user, leaveId);
        return mapper.countAltAppr(leaveId) > 0;
    }

    /**
     * AS-IS Emp20_Tab_Leave.deleteRow/deleteChk/deleteAltAppr/deleteSelectedRow — 상태가 없음·00·40·99 인 문서만 지운다.
     * deleteAltAppr 가 true 면 대결자 지정 내역(apr07_alt_appr.deleteByLeaveId)도 함께 지운다.
     */
    @Transactional
    public void delete(UserPrincipal user, List<Long> leaveIds, boolean deleteAltAppr) {
        if (leaveIds == null || leaveIds.isEmpty()) throw new BusinessException(ErrorCode.INVALID_INPUT, "문서를 선택해주세요");
        for (Long id : leaveIds) {
            MyLeaveRes row = requireMine(user, id);
            if (row.apprStatusCode() != null && !DELETABLE_STATUS.contains(row.apprStatusCode())) {
                throw new BusinessException(ErrorCode.INVALID_INPUT, "해당 문서는 삭제가 불가능합니다");
            }
        }
        for (Long id : leaveIds) {
            if (deleteAltAppr) mapper.deleteAltApprByLeaveId(id);
            mapper.deleteLeave(user.getCompanyId(), user.getUserId(), id);
        }
    }

    /**
     * AS-IS Emp20_Edit_Leave.lookupEmpTransInfo → sendMessage → updateOverConfirm — 고른 승인자에게 알리고 초과사용 승인상태를 10(신청)·승인자로 바꾼다.
     * 원본 98d5afdd6(CH-0257·0269): 화면이 sms.Sms02_History.sendMessage 대신 emp.Emp20_Leave.sendMessage(통합알림 M05)를 불러
     * 회사 문자발신 신청 검사(-1 "미신청한 고객사")가 없어졌다 — 늘 성공, 받을 수 있는 종류(앱알림·메일·SMS)로 간다.
     */
    @Transactional
    public MyLeaveRes requestOverConfirm(UserPrincipal user, Long leaveId, Long confirmerId) {
        if (confirmerId == null) throw new BusinessException(ErrorCode.INVALID_INPUT);
        requireMine(user, leaveId);
        String label = mapper.selectRequesterLabel(user.getCompanyId(), user.getUserId());
        alert.alert("M05", confirmerId, user.getCompanyId(), Map.of("content", "[Asset-ERP] '" + label + "'님이 연차 초과사용 승인을 요청하였습니다."));
        mapper.updateOverConfirmRequest(user.getCompanyId(), user.getUserId(), leaveId, confirmerId);
        return mapper.selectMineById(user.getCompanyId(), user.getUserId(), leaveId);
    }

    private MyLeaveRes requireMine(UserPrincipal user, Long leaveId) {
        MyLeaveRes row = leaveId == null ? null : mapper.selectMineById(user.getCompanyId(), user.getUserId(), leaveId);
        if (row == null) throw new BusinessException(ErrorCode.DATA_NOT_FOUND);
        return row;
    }

    private String requireYear(String stdYear) {
        if (stdYear == null || !stdYear.matches("\\d{4}")) throw new BusinessException(ErrorCode.INVALID_INPUT, "기준연도를 확인해주세요");
        return stdYear;
    }

    private void validate(MyLeaveSaveReq req) {
        if (req.leaveCode() == null || req.leaveCode().isEmpty()) throw new BusinessException(ErrorCode.INVALID_INPUT, "휴가구분은 필수선택 항목입니다");
        if (req.startDate() == null) throw new BusinessException(ErrorCode.INVALID_INPUT, "휴가시작일은 필수선택 항목입니다");
        if (req.closeDate() == null) throw new BusinessException(ErrorCode.INVALID_INPUT, "휴가종료일은 필수선택 항목입니다");
        if (req.managerName() == null || req.managerName().isBlank()) throw new BusinessException(ErrorCode.INVALID_INPUT, "대직자는 필수입력 항목입니다");
        if (req.emergencyTelno() == null || req.emergencyTelno().isBlank()) throw new BusinessException(ErrorCode.INVALID_INPUT, "비상망은 필수입력 항목입니다");
        if (req.leaveCount() == null) throw new BusinessException(ErrorCode.INVALID_INPUT, "기간 값이 없습니다. 계산 후 저장해주세요");
        if (req.leaveCount() < 0) throw new BusinessException(ErrorCode.INVALID_INPUT, "기간 값을 확인해주세요");
    }

    /** AS-IS Emp20_Leave.update L267-276 — 하이픈을 뺀 번호가 11자리면 000-0000-0000 모양으로 */
    private MyLeaveSaveReq withTelno(MyLeaveSaveReq r) {
        String full = r.emergencyTelno().replace("-", "");
        String telno = full.length() == 11
                ? full.substring(0, 3) + "-" + full.substring(3, full.length() - 4) + "-" + full.substring(full.length() - 4)
                : r.emergencyTelno();
        return new MyLeaveSaveReq(r.leaveId(), r.leaveCode(), r.spcLeaveCode(), r.etcLeaveId(),
                r.regDate() == null ? LocalDate.now() : r.regDate(), r.startDate(), r.closeDate(), r.leaveCount(),
                r.reason(), r.managerName(), telno, r.note(), r.apprId(), r.classTreeId());
    }
}
