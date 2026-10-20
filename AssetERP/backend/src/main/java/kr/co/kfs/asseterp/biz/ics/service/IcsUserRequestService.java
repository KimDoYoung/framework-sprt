package kr.co.kfs.asseterp.biz.ics.service;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.ics.dto.UserRequestMyReq;
import kr.co.kfs.asseterp.biz.ics.dto.UserRequestRes;
import kr.co.kfs.asseterp.biz.ics.dto.UserRequestSaveReq;
import kr.co.kfs.asseterp.biz.ics.mapper.IcsUserRequestMapper;
import kr.co.kfs.asseterp.common.error.BusinessException;
import kr.co.kfs.asseterp.common.error.ErrorCode;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * AS-IS server/ics/Ics17_UserRequest.java (selectBySearchTextAdmin / update L84 / updateLawContent L73)
 * — 관리자 화면(E09): 모든 고객사의 법규등록요청. 관리자 회사만(원본은 메뉴 권한으로만 막았다)
 * — 신청자 화면(H11 Ics17_Tab_UserRequest): 로그인 회사의 신청을 조회·등록·수정·삭제
 */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class IcsUserRequestService {

    private final IcsUserRequestMapper mapper;

    /** AS-IS Ics17_Tab_UserRequestAdmin.retrieve() L185-249가 만들던 LIKE 파라미터를 서버가 만든다 */
    public List<UserRequestRes> searchAdmin(UserPrincipal user, String startDate, String closeDate, String companyText,
                                            String stateCode, boolean unconfirmedOnly, boolean incompleteOnly, String searchText) {
        requireAdmin(user);
        return mapper.selectBySearchTextAdmin(startDate, closeDate,
                "%" + (searchText == null ? "" : searchText) + "%",
                stateCode == null || stateCode.isEmpty() ? "%" : stateCode,
                unconfirmedOnly ? "false" : "%",
                incompleteOnly ? "true" : "false",
                companyText == null || companyText.isEmpty() ? "%" : companyText);
    }

    /** AS-IS update(UpdateDataModel): 화면이 바꾸는 열(확인여부·상태·완료일·처리내용·비고)만 UPDATE 하고 selectById로 다시 읽는다 */
    @Transactional
    public UserRequestRes update(UserPrincipal user, Long userRequestId, UserRequestSaveReq req) {
        requireAdmin(user);
        if (req.regDate() == null || req.regDate().isEmpty()) {
            throw new BusinessException(ErrorCode.INVALID_INPUT, "요청일자를 입력해주세요");
        }
        if (mapper.updateUserRequest(userRequestId, req) == 0) {
            throw new BusinessException(ErrorCode.DATA_NOT_FOUND);
        }
        return mapper.selectById(userRequestId);
    }

    /** AS-IS Ics17_Tab_UserRequest.retrieve() L188-237이 만들던 LIKE 파라미터를 서버가 만든다. 로그인 회사의 신청만 */
    public List<UserRequestRes> search(UserPrincipal user, String startDate, String closeDate, String stateCode,
                                       boolean unconfirmedOnly, String searchText) {
        return mapper.selectBySearchText(startDate, closeDate,
                "%" + (searchText == null ? "" : searchText) + "%",
                stateCode == null || stateCode.isEmpty() ? "%" : stateCode,
                unconfirmedOnly ? "false" : "%",
                user.getCompanyId());
    }

    /** AS-IS update(UpdateDataModel) 새 행: 회사·요청자는 로그인 정보(원본은 GridInsertRow가 화면에서 채움) */
    @Transactional
    public UserRequestRes create(UserPrincipal user, UserRequestMyReq req) {
        requireRegDate(req);
        Long id = mapper.selectNextId();
        mapper.insertUserRequest(id, user.getCompanyId(), user.getUserId(), req);
        return mapper.selectById(id);
    }

    /** AS-IS update(UpdateDataModel) 기존 행: 신청자 화면이 고치는 7열만, 로그인 회사의 행만 */
    @Transactional
    public UserRequestRes update(UserPrincipal user, Long userRequestId, UserRequestMyReq req) {
        requireRegDate(req);
        if (mapper.updateMyUserRequest(userRequestId, user.getCompanyId(), req) == 0) {
            throw new BusinessException(ErrorCode.DATA_NOT_FOUND);
        }
        return mapper.selectById(userRequestId);
    }

    /** AS-IS delete(UpdateDataModel.deleteModel), 로그인 회사의 행만 */
    @Transactional
    public int delete(UserPrincipal user, Long userRequestId) {
        return mapper.deleteMyUserRequest(userRequestId, user.getCompanyId());
    }

    private void requireRegDate(UserRequestMyReq req) {
        if (req.regDate() == null || req.regDate().isEmpty()) {
            throw new BusinessException(ErrorCode.INVALID_INPUT, "요청일자를 입력해주세요");
        }
    }

    /** AS-IS updateLawContent: 요청 회사의 사용자(요청자 화면) 또는 관리자 회사만 */
    @Transactional
    public UserRequestRes updateLawContent(UserPrincipal user, Long userRequestId, String lawContent) {
        UserRequestRes current = mapper.selectById(userRequestId);
        if (current == null) {
            throw new BusinessException(ErrorCode.DATA_NOT_FOUND);
        }
        if (!user.isSysAdmin() && !current.companyId().equals(user.getCompanyId())) {
            throw new BusinessException(ErrorCode.ACCESS_DENIED);
        }
        mapper.updateLawContent(userRequestId, lawContent);
        return mapper.selectById(userRequestId);
    }

    private void requireAdmin(UserPrincipal user) {
        if (!user.isSysAdmin()) {
            throw new BusinessException(ErrorCode.ACCESS_DENIED);
        }
    }
}
