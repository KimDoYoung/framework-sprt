package kr.co.kfs.asseterp.biz.cmp.service;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.cmp.dto.CmpMailRoleRes;
import kr.co.kfs.asseterp.biz.cmp.dto.CmpMailRoleSaveReq;
import kr.co.kfs.asseterp.biz.cmp.mapper.CmpMailRoleMapper;
import kr.co.kfs.asseterp.common.error.BusinessException;
import kr.co.kfs.asseterp.common.error.ErrorCode;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/** AS-IS server/cmp/Cmp11_MailRole.java (G13 공용메일 권한자: Cmp10_Tab_MailBookList) */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class CmpMailRoleService {

    private final CmpMailRoleMapper mapper;

    /** AS-IS Cmp11_MailRole.selectByRoleId L21 */
    public List<CmpMailRoleRes> search(UserPrincipal user, Long mailBookId) {
        return mapper.selectByRoleId(user.getCompanyId(), mailBookId);
    }

    /** AS-IS Cmp11_MailRole.updateList L33-55: 사원마다 checkPerson이 0이면 새 ID로 INSERT, 이미 있으면 건너뜀. 새로 넣은 건수 */
    @Transactional
    public int saveAll(UserPrincipal user, List<CmpMailRoleSaveReq> rows) {
        int inserted = 0;
        for (CmpMailRoleSaveReq row : rows) {
            if (mapper.countMailBook(user.getCompanyId(), row.mailBookId()) == 0) {
                throw new BusinessException(ErrorCode.INVALID_INPUT, "공용메일을 찾을 수 없습니다");
            }
            if (mapper.checkPerson(row.mailBookId(), row.personId()) == 0) {
                inserted += mapper.insertRole(mapper.selectNextId(), row.mailBookId(), row.personId());
            }
        }
        return inserted;
    }

    /** AS-IS Cmp11_MailRole.delete L62 → UpdateDataModel.deleteModel. 지운 건수 */
    @Transactional
    public int delete(UserPrincipal user, List<Long> ids) {
        return ids.isEmpty() ? 0 : mapper.deleteRoles(user.getCompanyId(), ids);
    }
}
