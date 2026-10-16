package kr.co.kfs.asseterp.biz.sys.service;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.sys.dto.PasswordPersonRes;
import kr.co.kfs.asseterp.biz.sys.mapper.SysPasswordMapper;
import kr.co.kfs.asseterp.common.error.BusinessException;
import kr.co.kfs.asseterp.common.error.ErrorCode;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

/**
 * AS-IS Sys25_Tab_ResetPassword → server/emp/Emp03_Trans(selectByGrade L68·selectByPasswordPersonId L93), emp/Emp01_Person.updateLockYn L243, sys/Sys25_Password.insert L79.
 * 모두 로그인 회사의 사원만(요청의 personId가 다른 회사 사원이면 거절 — TOBE 보안 보강, 05 §6). 원본처럼 메뉴 권한 외의 역할 검사는 없다.
 */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class SysPasswordService {

    private final SysPasswordMapper mapper;

    /** AS-IS retrieve() L182-204: 사원을 고르지 않으면 selectByGrade, 고르면 selectByPasswordPersonId. 기준일 = 오늘 */
    public List<PasswordPersonRes> search(UserPrincipal user, Long personId) {
        LocalDate today = LocalDate.now();
        return personId == null
                ? mapper.selectByGrade(user.getCompanyId(), today)
                : mapper.selectByPasswordPersonId(user.getCompanyId(), personId, today);
    }

    /** AS-IS resetLock() L206-219: lockYn = false */
    @Transactional
    public void unlock(UserPrincipal user, Long personId) {
        requireOwnPerson(user, personId);
        mapper.updateLockYn(user.getCompanyId(), personId, "false");
    }

    /**
     * AS-IS resetPassword() L221-235 → sys.Sys25_Password.insert(password = null) L79-116:
     * 그 사원의 비밀번호 이력(sys25_password)이 있으면 가장 최근 순번의 비밀번호를 비우고(null), 없으면 순번 1로 비운 행을 만든다
     */
    @Transactional
    public void resetPassword(UserPrincipal user, Long personId) {
        requireOwnPerson(user, personId);
        Long seq = mapper.selectLastSeq(user.getCompanyId(), personId);
        if (seq != null) {
            mapper.updatePassword(user.getCompanyId(), personId, seq, null);
        } else {
            mapper.insertPassword(user.getCompanyId(), personId, null);
        }
    }

    private void requireOwnPerson(UserPrincipal user, Long personId) {
        if (personId == null || mapper.countPerson(user.getCompanyId(), personId) == 0) {
            throw new BusinessException(ErrorCode.DATA_NOT_FOUND);
        }
    }
}
