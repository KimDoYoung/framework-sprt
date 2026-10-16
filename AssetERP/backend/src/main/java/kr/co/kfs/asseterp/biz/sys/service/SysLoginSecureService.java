package kr.co.kfs.asseterp.biz.sys.service;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.sys.dto.LoginSecureReq;
import kr.co.kfs.asseterp.biz.sys.dto.LoginSecureRes;
import kr.co.kfs.asseterp.biz.sys.dto.LoginSecureRow;
import kr.co.kfs.asseterp.biz.sys.mapper.SysLoginSecureMapper;
import kr.co.kfs.asseterp.common.error.BusinessException;
import kr.co.kfs.asseterp.common.error.ErrorCode;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

/** AS-IS server/sys/Sys29_LoginSecure.java (selectByCompanyId / update / delete) — 고객사 공인IP, KFS 관리자만 */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class SysLoginSecureService {

    private final SysLoginSecureMapper mapper;

    public List<LoginSecureRes> searchLoginSecures(UserPrincipal user, Long companyId) {
        requireSysAdmin(user);
        return mapper.searchLoginSecures(companyId);
    }

    /** AS-IS update(UpdateDataModel): ID ≤ 0이면 INSERT, 아니면 UPDATE → 다시 읽어 요청 순서로 */
    @Transactional
    public List<LoginSecureRes> updateLoginSecures(UserPrincipal user, Long companyId, List<LoginSecureReq> rows) {
        requireSysAdmin(user);
        List<LoginSecureRes> saved = new ArrayList<>();
        for (LoginSecureReq req : rows) {
            // AS-IS는 sys29_public_ip NOT NULL 위반을 DB 오류 원문으로 보여 준다 → 같은 시점에 메시지만 바꿔 실패
            if (req.publicIp() == null || req.publicIp().isBlank()) {
                throw new BusinessException(ErrorCode.INVALID_INPUT, "공인IP를 입력하세요.");
            }
            boolean isNew = req.loginSecureId() == null || req.loginSecureId() <= 0;
            Long id = isNew ? mapper.selectNextId() : req.loginSecureId();
            LoginSecureRow row = new LoginSecureRow(id, companyId, req.startDate(), req.closeDate(), req.publicIp(), req.note());
            if (isNew) {
                mapper.insertLoginSecure(row);
            } else if (mapper.updateLoginSecure(row) == 0) {
                throw new BusinessException(ErrorCode.DATA_NOT_FOUND);
            }
            saved.add(mapper.selectLoginSecure(id));
        }
        return saved;
    }

    /** AS-IS delete(UpdateDataModel) → 지운 건수 */
    @Transactional
    public int deleteLoginSecures(UserPrincipal user, Long companyId, List<Long> ids) {
        requireSysAdmin(user);
        return ids == null || ids.isEmpty() ? 0 : mapper.deleteLoginSecures(ids, companyId);
    }

    private static void requireSysAdmin(UserPrincipal user) {
        if (!user.isSysAdmin()) {
            throw new BusinessException(ErrorCode.ACCESS_DENIED);
        }
    }
}
