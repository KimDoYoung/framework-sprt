package kr.co.kfs.asseterp.biz.ics.service;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
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
 * — 관리자 화면: 모든 고객사의 법규등록요청. 관리자 회사만(원본은 메뉴 권한으로만 막았다)
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
