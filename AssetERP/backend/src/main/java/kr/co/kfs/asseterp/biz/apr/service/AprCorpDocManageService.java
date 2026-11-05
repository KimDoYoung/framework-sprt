package kr.co.kfs.asseterp.biz.apr.service;

import kr.co.kfs.asseterp.biz.apr.dto.AprCorpDocRowRes;
import kr.co.kfs.asseterp.biz.apr.dto.AprCorpDocRowSaveReq;
import kr.co.kfs.asseterp.biz.apr.dto.AprCorpDocTotalRes;
import kr.co.kfs.asseterp.biz.apr.dto.AprRelateStampRes;
import kr.co.kfs.asseterp.biz.apr.dto.AprRelateStampSaveReq;
import kr.co.kfs.asseterp.biz.apr.mapper.AprCorpDocManageMapper;
import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.common.error.BusinessException;
import kr.co.kfs.asseterp.common.error.ErrorCode;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

/** 법인서류 매수관리·신청 화면 (AS-IS server/apr/Apr17_CorpDoc.java · Apr19_RelateStamp.java) — U2-02 */
@Service
@Transactional(readOnly = true)
@RequiredArgsConstructor
public class AprCorpDocManageService {

    private static final String PRINT_WINDOW = "Apr17_Tab_CorpDoc";

    private final AprCorpDocManageMapper mapper;

    /** AS-IS Apr17_CorpDoc.selectByCorpRegDate */
    public List<AprCorpDocRowRes> searchRegistered(UserPrincipal user, LocalDate startDate, LocalDate closeDate) {
        return mapper.selectRegistered(user.getCompanyId(), startDate, closeDate);
    }

    /** AS-IS Sys99_Print.insertRdCorpDoc L3087 — 내 출력 자료를 지우고 조회 구간의 등록 내역을 출력 자료로 넣는다. 돌려주는 값 = 출력 그룹 ID(RD의 rdGroupId) */
    @Transactional
    public String insertRdCorpDoc(UserPrincipal user, LocalDate startDate, LocalDate closeDate) {
        long groupId = mapper.selectNextId();
        mapper.deletePrint(user.getCompanyId(), user.getUserId(), PRINT_WINDOW);
        for (AprCorpDocRowRes row : mapper.selectRegistered(user.getCompanyId(), startDate, closeDate)) {
            mapper.insertPrint(mapper.selectNextId(), user.getCompanyId(), user.getUserId(), PRINT_WINDOW, groupId, row);
        }
        return String.valueOf(groupId);
    }

    /** AS-IS apr17_corp_doc.selectByRegDate */
    public List<AprCorpDocTotalRes> searchTotals(UserPrincipal user) {
        return mapper.selectTotals(user.getCompanyId());
    }

    /** AS-IS Apr17_CorpDoc.selectByAppDate — 검색어는 제공처+목적의 일부(대소문자 무시), 로그인 사원의 신청만 */
    public List<AprCorpDocRowRes> searchApplications(UserPrincipal user, String searchText, LocalDate startDate, LocalDate closeDate, boolean procResult) {
        String like = "%" + (searchText == null ? "" : searchText) + "%";
        return mapper.selectApplications(user.getCompanyId(), user.getUserId(), like, startDate, closeDate, procResult);
    }

    /** AS-IS Apr17_CorpDoc.selectById */
    public AprCorpDocRowRes get(UserPrincipal user, Long corpDocId) {
        AprCorpDocRowRes row = mapper.selectRowById(user.getCompanyId(), corpDocId);
        if (row == null) throw new BusinessException(ErrorCode.DATA_NOT_FOUND);
        return row;
    }

    /** AS-IS Apr17_CorpDoc.update(UpdateDataModel) — 법인서류 매수관리: 있으면 고치고(회사 것만) 없으면 만든다. 저장한 줄을 요청 순서대로 다시 읽어 돌려준다 */
    @Transactional
    public List<AprCorpDocRowRes> saveRegistered(UserPrincipal user, List<AprCorpDocRowSaveReq> reqs) {
        List<AprCorpDocRowRes> out = new ArrayList<>();
        for (AprCorpDocRowSaveReq req : requireRows(reqs)) {
            Long id = req.corpDocId();
            if (id != null && id > 0 && mapper.updateRegistered(user.getCompanyId(), req) > 0) {
                out.add(get(user, id));
                continue;
            }
            Long newId = mapper.selectNextId();
            mapper.insertRegistered(user.getCompanyId(), withId(req, newId));
            out.add(get(user, newId));
        }
        return out;
    }

    /** AS-IS Apr17_Tab_CorpDoc.delete — 신청일이 없는 줄(직접 등록)은 지우고(regDelete), 나머지는 등록일만 비운다(regDateUpdate regDate=null) */
    @Transactional
    public int deleteRegistered(UserPrincipal user, List<Long> ids) {
        requireIds(ids);
        int deleted = mapper.deleteRegistered(user.getCompanyId(), ids);
        mapper.clearRegDate(user.getCompanyId(), ids);
        return deleted;
    }

    /** AS-IS Apr17_CorpDoc.update(UpdateDataModel) — 신청 화면: 새 줄은 신청사원 = 로그인 사원 */
    @Transactional
    public List<AprCorpDocRowRes> saveApplications(UserPrincipal user, List<AprCorpDocRowSaveReq> reqs) {
        List<AprCorpDocRowRes> out = new ArrayList<>();
        for (AprCorpDocRowSaveReq req : requireRows(reqs)) {
            Long id = req.corpDocId();
            if (id != null && id > 0 && mapper.updateApplication(user.getCompanyId(), req) > 0) {
                out.add(get(user, id));
                continue;
            }
            Long newId = mapper.selectNextId();
            mapper.insertApplication(user.getCompanyId(), user.getUserId(), withId(req, newId));
            out.add(get(user, newId));
        }
        return out;
    }

    /** AS-IS Apr17_CorpDoc.copyUpdate — 고른 줄의 제공처·목적·비고·요청자·신청매수를 복사한 새 신청(신청일 = 오늘, 신청사원 = 로그인 사원) */
    @Transactional
    public AprCorpDocRowRes copyApplication(UserPrincipal user, AprCorpDocRowSaveReq source) {
        if (source == null) throw new BusinessException(ErrorCode.INVALID_INPUT);
        Long newId = mapper.selectNextId();
        AprCorpDocRowSaveReq req = new AprCorpDocRowSaveReq(newId, LocalDate.now(), null, null, source.stampCertCallCnt(), null,
                null, source.corpRegCallCnt(), null, source.provideCo(), source.purpose(), source.requester(), source.note());
        mapper.insertApplication(user.getCompanyId(), user.getUserId(), req);
        return get(user, newId);
    }

    /** AS-IS Apr17_CorpDoc.delete(UpdateDataModel.deleteModel) */
    @Transactional
    public int deleteApplications(UserPrincipal user, List<Long> ids) {
        requireIds(ids);
        return mapper.deleteApplications(user.getCompanyId(), ids);
    }

    /** AS-IS Apr19_RelateStamp.selectByCorpDocId */
    public List<AprRelateStampRes> searchStamps(UserPrincipal user, Long corpDocId) {
        return mapper.selectStamps(user.getCompanyId(), corpDocId);
    }

    /** AS-IS Apr19_RelateStamp.update(UpdateDataModel) — 법인서류(회사 것)에 붙은 줄만 */
    @Transactional
    public List<AprRelateStampRes> saveStamps(UserPrincipal user, List<AprRelateStampSaveReq> reqs) {
        if (reqs == null || reqs.isEmpty()) throw new BusinessException(ErrorCode.INVALID_INPUT);
        List<AprRelateStampRes> out = new ArrayList<>();
        for (AprRelateStampSaveReq req : reqs) {
            Long id = req.relateStampId();
            if (id != null && id > 0 && mapper.updateStamp(user.getCompanyId(), req) > 0) {
                out.add(mapper.selectStampById(user.getCompanyId(), id));
                continue;
            }
            if (req.corpDocId() == null) throw new BusinessException(ErrorCode.INVALID_INPUT);
            Long newId = mapper.selectNextId();
            AprRelateStampSaveReq withId = new AprRelateStampSaveReq(newId, req.corpDocId(), req.stampId(), req.stampCnt(), req.outYn());
            if (mapper.insertStamp(user.getCompanyId(), withId) == 0) throw new BusinessException(ErrorCode.DATA_NOT_FOUND);
            out.add(mapper.selectStampById(user.getCompanyId(), newId));
        }
        return out;
    }

    /** AS-IS Apr19_RelateStamp.delete */
    @Transactional
    public int deleteStamps(UserPrincipal user, List<Long> ids) {
        requireIds(ids);
        return mapper.deleteStamps(user.getCompanyId(), ids);
    }

    private static List<AprCorpDocRowSaveReq> requireRows(List<AprCorpDocRowSaveReq> reqs) {
        if (reqs == null || reqs.isEmpty()) throw new BusinessException(ErrorCode.INVALID_INPUT);
        return reqs;
    }

    private static void requireIds(List<Long> ids) {
        if (ids == null || ids.isEmpty()) throw new BusinessException(ErrorCode.INVALID_INPUT);
    }

    private static AprCorpDocRowSaveReq withId(AprCorpDocRowSaveReq r, Long id) {
        return new AprCorpDocRowSaveReq(id, r.callDate(), r.regDate(), r.stampCertIssueCnt(), r.stampCertCallCnt(), r.stampCertUseCnt(),
                r.corpRegIssueCnt(), r.corpRegCallCnt(), r.corpRegUseCnt(), r.provideCo(), r.purpose(), r.requester(), r.note());
    }
}
