package kr.co.kfs.asseterp.oms.biz.sys.service;

import kr.co.kfs.asseterp.oms.biz.auth.service.LoginLockService;
import kr.co.kfs.asseterp.oms.biz.sys.dto.PasswordParam;
import kr.co.kfs.asseterp.oms.biz.sys.dto.PasswordPersonRes;
import kr.co.kfs.asseterp.oms.biz.sys.mapper.SysPasswordMapper;
import kr.co.kfs.asseterp.oms.common.error.BusinessException;
import kr.co.kfs.asseterp.oms.common.error.ErrorCode;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * 비밀번호 초기화 (AS-IS server/sys/Sys25_Password.insert + emp.Emp01_Person.updateLockYn).
 * 초기화는 AS-IS처럼 비밀번호를 NULL(TO_ENCRYPTS(null))로 만든다 → TOBE 로그인은 PASSWORD_CHANGE_REQUIRED로 변경을 요구한다.
 */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class SysPasswordService {

    private final SysPasswordMapper sysPasswordMapper;
    private final LoginLockService loginLockService;

    /**
     * AS-IS selectByPasswordPersonId. 사원을 고르지 않은 경우 AS-IS는 서버가 없는 selectByGrade를 불러 동작하지 않았다
     * → 같은 SQL에서 사원 조건만 빼고 회사 전체를 보여준다 (성명 칸의 '전체' 의도)
     */
    public List<PasswordPersonRes> searchPersons(Long companyId, Long personId) {
        return sysPasswordMapper.searchPersons(new PasswordParam(companyId, personId, null, null));
    }

    /** AS-IS updateLockYn(false) → TOBE 잠금 해제 (Redis 실패 횟수도 초기화) */
    @Transactional
    public void unlock(Long companyId, Long personId) {
        requirePerson(companyId, personId);
        loginLockService.unlock(personId);
    }

    /** AS-IS Sys25_Password.insert(password=null): 최근 비밀번호 행이 있으면 UPDATE, 없으면 INSERT */
    @Transactional
    public void resetPassword(Long companyId, Long personId) {
        requirePerson(companyId, personId);
        Long seq = sysPasswordMapper.selectLastSeq(new PasswordParam(companyId, personId, null, null));
        if (seq != null) {
            sysPasswordMapper.updatePassword(new PasswordParam(companyId, personId, seq, null));
        } else {
            sysPasswordMapper.insert(new PasswordParam(companyId, personId, null, null));
        }
    }

    private void requirePerson(Long companyId, Long personId) {
        if (personId == null || !companyId.equals(sysPasswordMapper.selectPersonCompanyId(personId))) {
            throw new BusinessException(ErrorCode.DATA_NOT_FOUND, "사원을 찾을 수 없습니다. 다시 조회해 주세요.");
        }
    }
}
