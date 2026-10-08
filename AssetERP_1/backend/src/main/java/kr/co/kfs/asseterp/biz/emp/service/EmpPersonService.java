package kr.co.kfs.asseterp.biz.emp.service;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.emp.dto.PersonDeleteParam;
import kr.co.kfs.asseterp.biz.emp.dto.PersonRow;
import kr.co.kfs.asseterp.biz.emp.dto.PersonSaveReq;
import kr.co.kfs.asseterp.biz.emp.mapper.EmpPersonMapper;
import kr.co.kfs.asseterp.common.error.BusinessException;
import kr.co.kfs.asseterp.common.error.ErrorCode;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/** AS-IS server/emp/Emp01_Person.java (update / deleteTarget) + Emp04_AddTitle.selectByPersonId */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class EmpPersonService {

    private final EmpPersonMapper empPersonMapper;

    /** AS-IS update(UpdateDataModel): 기본정보 탭 1건 UPDATE. 화면은 목록 행을 다시 읽어 바꾼다 */
    @Transactional
    public void updatePerson(UserPrincipal user, Long personId, PersonSaveReq req) {
        if (req.empNo() != null && empPersonMapper.countEmpNo(user.getCompanyId(), req.empNo(), personId) > 0) {
            throw new BusinessException(ErrorCode.DUPLICATE_DATA, "이미 사용 중인 사원번호입니다.");
        }
        PersonRow row = new PersonRow(personId, user.getCompanyId(), req.empNo(), req.korNm(), req.hireDate(), req.hireCd(),
                req.applyCd(), req.orderSeq(), req.emailAddr(), req.officeTelNo(), req.officeDetail(), req.mobileTelNo(), req.note());
        if (empPersonMapper.updatePerson(row) == 0) {
            throw new BusinessException(ErrorCode.DATA_NOT_FOUND);
        }
    }

    /** AS-IS Emp04_AddTitle.selectByPersonId: 그 사람을 원사원으로 둔 겸직발령 건수 */
    public int countAddTitles(Long personId) {
        return empPersonMapper.countAddTitles(personId);
    }

    /** AS-IS deleteTarget: emp99_person_del 백업 후 emp01_person 삭제(empId = 지운 사람 = 로그인 사용자) */
    @Transactional
    public void deletePerson(UserPrincipal user, Long personId) {
        PersonDeleteParam param = new PersonDeleteParam(user.getCompanyId(), personId, user.getUserId());
        empPersonMapper.insertEmpDel(param);
        if (empPersonMapper.deletePerson(param) == 0) {
            throw new BusinessException(ErrorCode.DATA_NOT_FOUND);
        }
    }
}
