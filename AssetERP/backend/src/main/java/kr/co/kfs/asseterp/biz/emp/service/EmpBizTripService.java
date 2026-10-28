package kr.co.kfs.asseterp.biz.emp.service;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.emp.dto.BizTripRes;
import kr.co.kfs.asseterp.biz.emp.dto.BizTripSaveReq;
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
}
