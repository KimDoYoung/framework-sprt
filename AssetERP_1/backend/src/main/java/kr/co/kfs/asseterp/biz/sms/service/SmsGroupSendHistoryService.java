package kr.co.kfs.asseterp.biz.sms.service;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.sms.dto.GroupSendHistoryParam;
import kr.co.kfs.asseterp.biz.sms.dto.GroupSendHistoryRes;
import kr.co.kfs.asseterp.biz.sms.mapper.SmsGroupSendHistoryMapper;
import kr.co.kfs.asseterp.common.error.BusinessException;
import kr.co.kfs.asseterp.common.error.ErrorCode;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/** AS-IS server/sms/Sms04_GroupSendHistory.java (selectByText L31) — 로그인 회사의 기록만, sys admin만 */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class SmsGroupSendHistoryService {

    private final SmsGroupSendHistoryMapper mapper;

    /** AS-IS selectByText: 검색어는 클라이언트가 "%"+값+"%"로 보냈다 → 서버가 만든다 */
    public List<GroupSendHistoryRes> search(UserPrincipal user, Long groupSendId, String searchText) {
        if (!user.isSysAdmin()) {
            throw new BusinessException(ErrorCode.ACCESS_DENIED);
        }
        String like = "%" + (searchText == null ? "" : searchText) + "%";
        return mapper.selectByText(new GroupSendHistoryParam(groupSendId, user.getCompanyId(), like));
    }
}
