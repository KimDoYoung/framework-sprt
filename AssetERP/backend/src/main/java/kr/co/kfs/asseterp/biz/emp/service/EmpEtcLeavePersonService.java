package kr.co.kfs.asseterp.biz.emp.service;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.emp.dto.EtcLeavePersonRes;
import kr.co.kfs.asseterp.biz.emp.dto.EtcLeavePersonSaveReq;
import kr.co.kfs.asseterp.biz.emp.mapper.EmpEtcLeavePersonMapper;
import kr.co.kfs.asseterp.common.error.BusinessException;
import kr.co.kfs.asseterp.common.error.ErrorCode;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

/** 포상휴가 대상 직원 (AS-IS Emp23_EtcLeavePerson) — Emp22_Tab_EtcLeave 오른쪽 */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class EmpEtcLeavePersonService {

    private static final String LOCKED = "상신 중인 문서의 정보는 수정이 불가능합니다";

    private final EmpEtcLeavePersonMapper mapper;

    /** AS-IS emp.Emp23_EtcLeavePerson.selectByEtcLeaveId (회사 조건 추가) */
    public List<EtcLeavePersonRes> search(UserPrincipal user, Long etcLeaveId) {
        return mapper.selectByEtcLeaveId(user.getCompanyId(), etcLeaveId);
    }

    /**
     * AS-IS Emp23_Page_EtcLeavePerson.updateCheck(emp.Emp22_EtcLeave.selectById) + emp.Emp23_EtcLeavePerson.update:
     * 포상휴가에 상신 문서가 있으면 막고, 새 행(ID 0 이하)만 채번해 INSERT 한다.
     * AS-IS 는 사원이 로그인 회사 소속인지 보지 않지만 TOBE 는 확인한다(다른 회사 ID는 404).
     */
    @Transactional
    public List<EtcLeavePersonRes> save(UserPrincipal user, List<EtcLeavePersonSaveReq> rows) {
        List<EtcLeavePersonRes> saved = new ArrayList<>();
        for (EtcLeavePersonSaveReq row : rows) {
            if (mapper.countEtcLeave(user.getCompanyId(), row.etcLeaveId()) == 0) {
                throw new BusinessException(ErrorCode.DATA_NOT_FOUND);
            }
            if (mapper.selectApprId(user.getCompanyId(), row.etcLeaveId()) != null) {
                throw new BusinessException(ErrorCode.INVALID_INPUT, LOCKED);
            }
            Long id = row.etcLeavePersonId();
            if (id == null || id <= 0) {
                id = mapper.selectNextId();
                if (mapper.insertEtcLeavePerson(user.getCompanyId(), id, row.etcLeaveId(), row.personId()) == 0) {
                    throw new BusinessException(ErrorCode.DATA_NOT_FOUND);
                }
            }
            saved.add(mapper.selectById(user.getCompanyId(), id));
        }
        return saved;
    }

    /** AS-IS Emp23_Page_EtcLeavePerson.deleteCheck(상신 문서가 있으면 막음) + emp.Emp23_EtcLeavePerson.delete */
    @Transactional
    public int delete(UserPrincipal user, List<Long> ids) {
        if (ids == null || ids.isEmpty()) {
            return 0;
        }
        for (Long etcLeaveId : mapper.selectEtcLeaveIds(user.getCompanyId(), ids)) {
            if (mapper.selectApprId(user.getCompanyId(), etcLeaveId) != null) {
                throw new BusinessException(ErrorCode.INVALID_INPUT, LOCKED);
            }
        }
        return mapper.deleteEtcLeavePersons(user.getCompanyId(), ids);
    }
}
