package kr.co.kfs.asseterp.biz.sys.service;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.sys.dto.AdminUserReq;
import kr.co.kfs.asseterp.biz.sys.dto.AdminUserRes;
import kr.co.kfs.asseterp.biz.sys.dto.AdminUserRow;
import kr.co.kfs.asseterp.biz.sys.mapper.SysUserMapper;
import kr.co.kfs.asseterp.common.error.BusinessException;
import kr.co.kfs.asseterp.common.error.ErrorCode;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

/** AS-IS server/sys/Sys02_User.java (selectByName / update / delete) — 고객별 관리자, KFS 관리자만 */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class SysUserService {

    private final SysUserMapper mapper;

    /** AS-IS selectByName L354-368: 회사 + 이름 '%'(화면은 이름을 넘기지 않는다) */
    public List<AdminUserRes> searchUsers(UserPrincipal user, Long companyId) {
        requireSysAdmin(user);
        return mapper.searchUsers(companyId, "%");
    }

    /** AS-IS update L377-393: decPasswd가 있으면 to_encrypts → UpdateDataModel INSERT/UPDATE → selectById */
    @Transactional
    public List<AdminUserRes> updateUsers(UserPrincipal user, Long companyId, List<AdminUserReq> rows) {
        requireSysAdmin(user);
        List<AdminUserRes> saved = new ArrayList<>();
        for (AdminUserReq req : rows) {
            // AS-IS는 sys02_kor_nm NOT NULL 위반을 DB 오류 원문으로 보여 준다 → 같은 시점에 메시지만 바꿔 실패
            if (req.korNm() == null || req.korNm().isBlank()) {
                throw new BusinessException(ErrorCode.INVALID_INPUT, "사용자명을 입력하세요.");
            }
            boolean isNew = req.userId() == null || req.userId() <= 0;
            Long id = isNew ? mapper.selectNextId() : req.userId();
            // TOBE 추가: 로그인은 회사 + ID로 찾으므로 같은 회사 안에서 ID가 겹치면 로그인이 깨진다
            if (req.loginId() != null && mapper.countByLoginId(companyId, req.loginId(), id) > 0) {
                throw new BusinessException(ErrorCode.DUPLICATE_DATA, "이미 사용 중인 ID입니다: " + req.loginId());
            }
            String pw = req.decPasswd() == null || req.decPasswd().isEmpty() ? null : req.decPasswd();
            AdminUserRow row = new AdminUserRow(id, companyId, req.korNm(), req.loginId(), pw,
                    req.email(), req.tel1(), req.tel2(), req.note(), req.adminYn());
            if (isNew) {
                mapper.insertUser(row);
            } else if (mapper.updateUser(row) == 0) {
                throw new BusinessException(ErrorCode.DATA_NOT_FOUND);
            }
            saved.add(mapper.selectUser(id));
        }
        return saved;
    }

    /** AS-IS delete L395-398 (UpdateDataModel) → 지운 건수 */
    @Transactional
    public int deleteUsers(UserPrincipal user, Long companyId, List<Long> userIds) {
        requireSysAdmin(user);
        return userIds == null || userIds.isEmpty() ? 0 : mapper.deleteUsers(userIds, companyId);
    }

    private static void requireSysAdmin(UserPrincipal user) {
        if (!user.isSysAdmin()) {
            throw new BusinessException(ErrorCode.ACCESS_DENIED);
        }
    }
}
