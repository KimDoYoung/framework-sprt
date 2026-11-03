package kr.co.kfs.asseterp.biz.icam.service;

import java.time.LocalDate;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.icam.dto.IcamStopAuthBatchReq;
import kr.co.kfs.asseterp.biz.icam.dto.IcamStopAuthRes;
import kr.co.kfs.asseterp.biz.icam.dto.IcamStopAuthSaveReq;
import kr.co.kfs.asseterp.biz.icam.mapper.IcamUserMapper;
import kr.co.kfs.asseterp.common.error.BusinessException;
import kr.co.kfs.asseterp.common.error.ErrorCode;
import lombok.RequiredArgsConstructor;

/** 미사용ID 기록관리 (AS-IS Icam55_Tab_UserStopAuth → server/icam/Icam55_IcamUser, EE32) */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class IcamUserStopAuthService {

    /** AS-IS 화면이 보내는 처리상태코드 "1"(완료) 고정 */
    private static final String PROC_STATE_DONE = "1";

    private final IcamUserMapper mapper;

    /** AS-IS icam.Icam55_IcamUser.selectByProcStateCode — 검색어는 `%글자%`(없으면 `%`) */
    public List<IcamStopAuthRes> search(String searchText, LocalDate startDate, LocalDate closeDate, boolean delTarget) {
        String like = (searchText == null || searchText.isBlank()) ? "%" : "%" + searchText + "%";
        return mapper.selectByProcStateCode(like, startDate, closeDate, delTarget, PROC_STATE_DONE);
    }

    /** AS-IS icam.Icam55_IcamUser.updateEachAuth — 삭제일자·해제일자가 모두 비면 처리자도 비운다(Icam55_Edit_UserStopAuth.update L129-150) */
    @Transactional
    public void update(UserPrincipal user, Long icamUserId, IcamStopAuthSaveReq req) {
        mapper.updateStopAuth(icamUserId, req.delDate(), req.unstopDate(), req.note(), mngEmpId(user, req.delDate(), req.unstopDate()));
    }

    /** AS-IS icam.Icam55_IcamUser.updateMultiAuth — 선택한 행마다 같은 값(Icam55_Lookup_UserStopAuth.update L123-149) */
    @Transactional
    public void updateBatch(UserPrincipal user, IcamStopAuthBatchReq req) {
        if (req.ids() == null || req.ids().isEmpty()) {
            throw new BusinessException(ErrorCode.INVALID_INPUT, "선택된 내역이 없습니다.");
        }
        Long mng = mngEmpId(user, req.delDate(), req.unstopDate());
        for (Long id : req.ids()) {
            mapper.updateStopAuth(id, req.delDate(), req.unstopDate(), req.note(), mng);
        }
    }

    private static Long mngEmpId(UserPrincipal user, LocalDate delDate, LocalDate unstopDate) {
        return (delDate == null && unstopDate == null) ? null : user.getUserId();
    }
}
