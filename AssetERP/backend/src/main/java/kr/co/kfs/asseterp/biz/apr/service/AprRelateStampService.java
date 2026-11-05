package kr.co.kfs.asseterp.biz.apr.service;

import kr.co.kfs.asseterp.biz.apr.dto.AprRelateStampCheckRes;
import kr.co.kfs.asseterp.biz.apr.dto.AprRelateStampConfirmReq;
import kr.co.kfs.asseterp.biz.apr.dto.AprRelateStampDateReq;
import kr.co.kfs.asseterp.biz.apr.dto.AprRelateStampListRes;
import kr.co.kfs.asseterp.biz.apr.mapper.AprRelateStampMapper;
import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.common.error.BusinessException;
import kr.co.kfs.asseterp.common.error.ErrorCode;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

/**
 * AS-IS server/apr/Apr19_RelateStamp.java (selectBySearchText · selectByOrgCodeId · selectByStampCheckList · selectById · update · modelUpdate),
 * sys/Sys99_Print.insertRdStampList L3190 · insertRdOrgStampList L3295
 */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class AprRelateStampService {

    private static final String STAMP_LIST_WINDOW = "Apr19_Tab_StampList";
    private static final String ORG_STAMP_LIST_WINDOW = "Apr19_Tab_OrgStampList";

    private final AprRelateStampMapper mapper;
    private final AprStampService stampService;

    /** 화면 retrieve(): 검색어가 없으면 "%", 있으면 "%검색어%" */
    private static String like(String searchText) {
        return (searchText == null || searchText.isEmpty()) ? "%" : "%" + searchText + "%";
    }

    public List<AprRelateStampListRes> searchStampList(UserPrincipal user, LocalDate startDate, LocalDate closeDate, Long stampId,
                                                       boolean outYn, String searchText) {
        return mapper.selectBySearchText(user.getCompanyId(), startDate, closeDate, stampId, outYn, like(searchText));
    }

    /** 부서 인감날인대장 — 로그인 사원의 부서(LoginUser.getOrgCodeId, 회사관리자는 0)가 쓸 수 있는 인감만 */
    public List<AprRelateStampListRes> searchOrgStampList(UserPrincipal user, LocalDate startDate, LocalDate closeDate, Long stampId,
                                                          boolean outYn, String searchText) {
        return mapper.selectByOrgCodeId(user.getCompanyId(), stampService.getMyOrgCodeId(user), startDate, closeDate, stampId, outYn, like(searchText));
    }

    /** ① 내 출력 자료 정리 ② 목록을 sys99_print에 삽입 ③ 새 groupId 반환 */
    @Transactional
    public String insertStampListPrint(UserPrincipal user, LocalDate startDate, LocalDate closeDate, Long stampId,
                                       boolean outYn, String searchText, boolean org) {
        String windowClassName = org ? ORG_STAMP_LIST_WINDOW : STAMP_LIST_WINDOW;
        long groupId = mapper.selectNextPrintId();
        mapper.deletePrint(user.getCompanyId(), user.getUserId(), windowClassName);
        if (org) {
            mapper.insertOrgStampListPrint(user.getCompanyId(), user.getUserId(), windowClassName, groupId,
                    stampService.getMyOrgCodeId(user), startDate, closeDate, stampId, outYn, like(searchText));
        } else {
            mapper.insertStampListPrint(user.getCompanyId(), user.getUserId(), windowClassName, groupId,
                    startDate, closeDate, stampId, outYn, like(searchText));
        }
        return String.valueOf(groupId);
    }

    /** AS-IS selectById — [수정] 창(Apr19_Edit_StampDate)이 쓰는 날인일자 */
    public LocalDate getStampDate(UserPrincipal user, Long relateStampId) {
        if (mapper.countById(user.getCompanyId(), relateStampId) == 0) {
            throw new BusinessException(ErrorCode.DATA_NOT_FOUND);
        }
        return mapper.selectStampDate(user.getCompanyId(), relateStampId);
    }

    /** AS-IS modelUpdate */
    @Transactional
    public int updateStampDate(UserPrincipal user, AprRelateStampDateReq req) {
        return mapper.updateStampDate(user.getCompanyId(), req.relateStampId(), req.stampDate());
    }

    public List<AprRelateStampCheckRes> searchStampCheck(UserPrincipal user, LocalDate startDate, LocalDate closeDate, Long stampId, boolean notStampFileYn) {
        return mapper.selectByStampCheckList(user.getCompanyId(), startDate, closeDate, stampId, notStampFileYn);
    }

    /** AS-IS update — 확인이면 확인자=로그인 사원·확인일자=오늘(화면 confirm()), 취소면 둘 다 비운다 */
    @Transactional
    public int confirm(UserPrincipal user, AprRelateStampConfirmReq req) {
        Long confirmerId = req.check() ? user.getUserId() : null;
        LocalDate confirmDate = req.check() ? LocalDate.now() : null;
        for (Long id : req.ids()) {
            mapper.updateConfirm(user.getCompanyId(), id, confirmerId, confirmDate);
        }
        return req.ids().size();
    }
}
