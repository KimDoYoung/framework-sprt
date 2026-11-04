package kr.co.kfs.asseterp.biz.emp.service;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.emp.dto.NoticeRes;
import kr.co.kfs.asseterp.biz.emp.mapper.EmpNoticeMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/** AS-IS server/emp/Emp90_Notice.java (selectByPersonId L25, updateList L34, deleteList L54) — Emp90_Lookup_Notice (EE66) */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class EmpNoticeService {

    private final EmpNoticeMapper mapper;

    /** AS-IS retrieve() L123-136: 검색어는 "%" + 글자 + "%", 사원은 로그인한 사용자 */
    public List<NoticeRes> search(UserPrincipal user, String searchText) {
        return mapper.selectByPersonId(user.getUserId(), "%" + (searchText == null ? "" : searchText) + "%");
    }

    /** AS-IS updateList (차단): 이미 있는 항목은 그대로 두고 없는 것만 INSERT */
    @Transactional
    public void block(UserPrincipal user, List<String> keywords) {
        for (String keyword : keywords) {
            if (mapper.countByText(user.getUserId(), keyword) == 0) {
                mapper.insert(user.getUserId(), keyword);
            }
        }
    }

    /** AS-IS deleteList (차단해제): 글자를 trim 해서 정확히 한 건일 때만 DELETE */
    @Transactional
    public void unblock(UserPrincipal user, List<String> keywords) {
        for (String raw : keywords) {
            String keyword = raw == null ? "" : raw.trim();
            if (mapper.countByText(user.getUserId(), keyword) == 1) {
                mapper.delete(user.getUserId(), keyword);
            }
        }
    }
}
