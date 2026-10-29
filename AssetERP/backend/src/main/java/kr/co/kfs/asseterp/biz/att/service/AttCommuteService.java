package kr.co.kfs.asseterp.biz.att.service;

import kr.co.kfs.asseterp.biz.att.dto.AttCommuteBatchReq;
import kr.co.kfs.asseterp.biz.att.dto.AttCommuteRes;
import kr.co.kfs.asseterp.biz.att.mapper.AttCommuteMapper;
import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.common.error.BusinessException;
import kr.co.kfs.asseterp.common.error.ErrorCode;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

/**
 * AS-IS Att02_Tab_CommuteAdmin·Att02_Lookup_InsertBatch(T06) → server/att/Att02_Commute.java
 * (selectByTextAdmin L39 / insertBatch L139 / adminCheck L173). 쓰기는 로그인 회사 행만(보안 보강)
 */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class AttCommuteService {

    private final AttCommuteMapper mapper;

    /** AS-IS selectByTextAdmin: 검색어는 `%…%`. baseDate가 있으면 그날만, 없으면 시작~종료 */
    public List<AttCommuteRes> searchAdmin(UserPrincipal user, Long personId, LocalDate baseDate, LocalDate startDate,
                                           LocalDate closeDate, String searchText) {
        if (baseDate == null && (startDate == null || closeDate == null)) {
            throw new BusinessException(ErrorCode.INVALID_INPUT, "근무일자를 선택해주세요");
        }
        return mapper.selectByTextAdmin(user.getCompanyId(), personId, baseDate, startDate, closeDate,
                "%" + (searchText == null ? "" : searchText) + "%");
    }

    /** AS-IS adminCheck: 확인필요 해제 */
    @Transactional
    public int adminCheck(UserPrincipal user, Long commuteId) {
        if (mapper.countInCompany(user.getCompanyId(), commuteId) == 0) throw new BusinessException(ErrorCode.DATA_NOT_FOUND);
        return mapper.adminCheck(commuteId);
    }

    /** AS-IS insertBatch: 사원마다 기간 출퇴근 생성(이미 있거나 휴가·휴일이면 건너뜀) → 사원 수 */
    @Transactional
    public int insertBatch(UserPrincipal user, AttCommuteBatchReq req) {
        if (req.startDate() == null) throw new BusinessException(ErrorCode.INVALID_INPUT, "시작일은 필수입력 항목입니다");
        if (req.closeDate() == null) throw new BusinessException(ErrorCode.INVALID_INPUT, "종료일은 필수입력 항목입니다");
        if (req.personIds() == null) return 0;
        for (Long personId : req.personIds()) {
            mapper.insertBatch(user.getCompanyId(), personId, req.startDate(), req.closeDate());
        }
        return req.personIds().size();
    }
}
