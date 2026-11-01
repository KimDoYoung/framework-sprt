package kr.co.kfs.asseterp.biz.emp.service;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.emp.dto.BizTripRes;
import kr.co.kfs.asseterp.biz.emp.dto.BizTripSaveReq;
import kr.co.kfs.asseterp.biz.emp.dto.MyBizTripRes;
import kr.co.kfs.asseterp.biz.emp.dto.MyBizTripSaveReq;
import kr.co.kfs.asseterp.biz.emp.mapper.EmpBizTripMapper;
import kr.co.kfs.asseterp.common.error.BusinessException;
import kr.co.kfs.asseterp.common.error.ErrorCode;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

/** 출장관리 (AS-IS Emp53_Tab_BizTripManager) — 1단계: 상세보기(Apr01_Edit_ApprDoc.retrieveApproval)는 다음 단계 */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class EmpBizTripService {

    private final EmpBizTripMapper mapper;

    /** AS-IS emp.Emp53_BizTrip.selectByCompanyId — 검색어는 조직+출장자+출장지+출장목적에 대한 `%검색어%` */
    public List<BizTripRes> search(UserPrincipal user, LocalDate startDate, LocalDate closeDate, boolean resultSkipYn, String searchText) {
        return mapper.selectByCompanyId(user.getCompanyId(), startDate, closeDate, resultSkipYn,
                "%" + (searchText == null ? "" : searchText) + "%");
    }

    /**
     * AS-IS emp.Emp53_BizTrip.update(UpdateDataModel) — 그리드에서 고치는 열(결과보고서 면제 여부·사유)만 저장하고
     * 저장한 행을 요청 순서대로 돌려준다. AS-IS 는 출장이 로그인 회사 것인지 보지 않지만 TOBE 는 확인한다(다른 회사 ID는 404).
     */
    @Transactional
    public List<BizTripRes> save(UserPrincipal user, List<BizTripSaveReq> rows) {
        List<BizTripRes> saved = new ArrayList<>();
        for (BizTripSaveReq row : rows) {
            if (row.bizTripId() == null
                    || mapper.updateSkip(user.getCompanyId(), row.bizTripId(), row.resultSkipYn(), row.skipReason()) == 0) {
                throw new BusinessException(ErrorCode.DATA_NOT_FOUND);
            }
            saved.add(mapper.selectById(user.getCompanyId(), row.bizTripId()));
        }
        return saved;
    }

    // ===== Y05 출장품의 및 결과보고 (Emp53_Tab_BizTrip) =====

    /** AS-IS emp.Emp53_BizTrip.selectByPersonId — 검색어 `%글자%`(비면 `%`) */
    public List<MyBizTripRes> searchMine(UserPrincipal user, LocalDate startDate, LocalDate closeDate, String searchText) {
        return mapper.selectByPersonId(user.getCompanyId(), user.getUserId(), startDate, closeDate,
                searchText == null || searchText.isEmpty() ? "%" : "%" + searchText + "%");
    }

    /** AS-IS Emp53_BizTrip.modelUpdate (새 출장 — Emp53_Lookup_BizTrip.update) → 저장한 행 */
    @Transactional
    public MyBizTripRes create(UserPrincipal user, MyBizTripSaveReq req) {
        validate(req);
        long id = mapper.selectNextId();
        mapper.insertBizTrip(user.getCompanyId(), user.getUserId(), id, req);
        return mapper.selectMineById(user.getCompanyId(), user.getUserId(), id);
    }

    /** AS-IS Emp53_BizTrip.modelUpdate (고침) — 진행·완료 문서(10·20·30)가 있으면 수정 불가 */
    @Transactional
    public MyBizTripRes update(UserPrincipal user, Long bizTripId, MyBizTripSaveReq req) {
        MyBizTripRes row = requireMine(user, bizTripId);
        String st = row.apprStatusCode();
        if ("10".equals(st) || "20".equals(st) || "30".equals(st)) {
            throw new BusinessException(ErrorCode.INVALID_INPUT, "진행 및 완료된 문서가 있습니다. 수정이 불가합니다.");
        }
        validate(req);
        mapper.updateBizTrip(user.getCompanyId(), user.getUserId(), bizTripId, req);
        return mapper.selectMineById(user.getCompanyId(), user.getUserId(), bizTripId);
    }

    /** AS-IS Emp53_Tab_BizTrip.updateApprId → emp.Emp53_BizTrip.update (result면 결과보고서 ID) */
    @Transactional
    public void updateApprId(UserPrincipal user, Long bizTripId, Long apprId, boolean result) {
        if (apprId == null) throw new BusinessException(ErrorCode.INVALID_INPUT);
        requireMine(user, bizTripId);
        if (result) mapper.updateResultApprId(user.getCompanyId(), user.getUserId(), bizTripId, apprId);
        else mapper.updateApprId(user.getCompanyId(), user.getUserId(), bizTripId, apprId);
    }

    /** AS-IS emp.Emp53_BizTrip.updateShareInfo → 바뀐 행 */
    @Transactional
    public MyBizTripRes updateShare(UserPrincipal user, Long bizTripId, Boolean publicYn) {
        requireMine(user, bizTripId);
        mapper.updatePublicYn(user.getCompanyId(), user.getUserId(), bizTripId, Boolean.TRUE.equals(publicYn));
        return mapper.selectMineById(user.getCompanyId(), user.getUserId(), bizTripId);
    }

    /** AS-IS Emp53_Tab_BizTrip.delete → emp.Emp53_BizTrip.delete — 결재상태가 있는 행이 하나라도 있으면 거절 */
    @Transactional
    public void delete(UserPrincipal user, List<Long> bizTripIds) {
        if (bizTripIds == null || bizTripIds.isEmpty()) throw new BusinessException(ErrorCode.INVALID_INPUT);
        for (Long id : bizTripIds) {
            if (requireMine(user, id).apprStatusCode() != null) {
                throw new BusinessException(ErrorCode.INVALID_INPUT, "진행 및 완료된 문서가 포함 되어있습니다. 삭제 불가합니다.");
            }
        }
        for (Long id : bizTripIds) mapper.deleteBizTrip(user.getCompanyId(), user.getUserId(), id);
    }

    private MyBizTripRes requireMine(UserPrincipal user, Long bizTripId) {
        MyBizTripRes row = bizTripId == null ? null : mapper.selectMineById(user.getCompanyId(), user.getUserId(), bizTripId);
        if (row == null) throw new BusinessException(ErrorCode.DATA_NOT_FOUND);
        return row;
    }

    /** Emp53_Lookup_BizTrip.update 의 입력 검사(메시지 그대로) */
    private static void validate(MyBizTripSaveReq req) {
        if (req.startDate() == null || req.closeDate() == null) throw new BusinessException(ErrorCode.INVALID_INPUT, "출장기간은 필수작성 항목입니다");
        if (req.bizTripCode() == null || req.bizTripCode().isEmpty()) throw new BusinessException(ErrorCode.INVALID_INPUT, "출장구분은 필수선택 항목입니다");
        if (req.destination() == null || req.destination().isEmpty()) throw new BusinessException(ErrorCode.INVALID_INPUT, "출장지는 필수작성 항목입니다");
        if (req.purpose() == null || req.purpose().isEmpty()) throw new BusinessException(ErrorCode.INVALID_INPUT, "출장목적은 필수작성 항목입니다");
    }
}
