package kr.co.kfs.asseterp.biz.emp.service;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.emp.dto.AddTitleRes;
import kr.co.kfs.asseterp.biz.emp.dto.AddTitleSaveReq;
import kr.co.kfs.asseterp.biz.emp.mapper.EmpAddTitleMapper;
import kr.co.kfs.asseterp.common.error.BusinessException;
import kr.co.kfs.asseterp.common.error.ErrorCode;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/** AS-IS server/emp/Emp04_AddTitle.java */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class EmpAddTitleService {

    private final EmpAddTitleMapper empAddTitleMapper;

    /** selectByPersonId L28 */
    public List<AddTitleRes> getAddTitles(UserPrincipal user, Long personId) {
        return empAddTitleMapper.selectAddTitles(user.getCompanyId(), personId);
    }

    /**
     * updateList L46-118.
     * transPersonId 없음: 겸직사원(emp01 사번 '-PT{n}') + 겸직발령(emp03 800) + 기타정보 복사(emp02) → emp04 INSERT.
     * transPersonId 있음: 겸직사원 발령 UPDATE → emp04 UPDATE.
     */
    @Transactional
    public AddTitleRes updateList(UserPrincipal user, AddTitleSaveReq req) {
        Long companyId = user.getCompanyId();
        Long addPersonId = req.transPersonId();

        if (addPersonId == null) {
            String empNo = empAddTitleMapper.selectEmpNo(req.personId(), companyId);
            if (empNo == null) throw new BusinessException(ErrorCode.DATA_NOT_FOUND);

            addPersonId = empAddTitleMapper.selectNextId();
            empAddTitleMapper.insertAddPerson(addPersonId, req.personId(), empNo + "-PT" + nextPtNo(companyId, req.personId()), companyId);
            empAddTitleMapper.insertAddTrans(empAddTitleMapper.selectNextId(), addPersonId, req);
            empAddTitleMapper.insertOthersCopy(addPersonId, req.personId());
        } else {
            if (empAddTitleMapper.updateAddTrans(companyId, req) == 0) throw new BusinessException(ErrorCode.DATA_NOT_FOUND);
        }

        Long addTitleId = req.addTitleId();
        if (addTitleId == null || addTitleId <= 0) {
            addTitleId = empAddTitleMapper.selectNextId();
            empAddTitleMapper.insertAddTitle(addTitleId, addPersonId, req);
        } else {
            if (empAddTitleMapper.updateAddTitle(companyId, req) == 0) throw new BusinessException(ErrorCode.DATA_NOT_FOUND);
        }
        return empAddTitleMapper.selectAddTitleById(addTitleId, companyId);
    }

    /** 겸직사번 번호 L57-83: 기존 겸직이 없으면 1, 있으면 각 사번 끝 숫자의 최대 + 1 */
    private int nextPtNo(Long companyId, Long personId) {
        List<AddTitleRes> list = empAddTitleMapper.selectAddTitles(companyId, personId);
        if (list.isEmpty()) return 1;
        int max = Integer.MIN_VALUE;
        for (AddTitleRes r : list) {
            String s = r.empNo();
            int i = s.length() - 1;
            while (i >= 0 && Character.isDigit(s.charAt(i))) i--;
            max = Math.max(max, Integer.parseInt(s.substring(i + 1)));  // 끝에 숫자가 없으면 원본처럼 오류
        }
        return max + 1;
    }

    /**
     * deleteList L120-137 + delete L144: 겸직사원이 결재(apr01 기안·apr04 결재선)에 쓰였으면 삭제 불가,
     * 아니면 겸직사원 emp01·emp02·emp03 삭제 후 emp04 행 삭제. AS-IS는 두 번 호출 — TOBE는 한 트랜잭션.
     */
    @Transactional
    public int deleteAddTitle(UserPrincipal user, Long addTitleId) {
        Long companyId = user.getCompanyId();
        AddTitleRes row = empAddTitleMapper.selectAddTitleById(addTitleId, companyId);
        if (row == null) throw new BusinessException(ErrorCode.DATA_NOT_FOUND);

        if (empAddTitleMapper.countApprByPersonId(row.addPersonId()) > 0)
            throw new BusinessException(ErrorCode.INVALID_INPUT, "해당 겸직은 삭제할 수 없습니다. 관리자에게 문의해주세요");

        empAddTitleMapper.deletePerson(row.addPersonId());
        empAddTitleMapper.deleteOthers(row.addPersonId());
        empAddTitleMapper.deleteTrans(row.addPersonId());
        return empAddTitleMapper.deleteAddTitle(addTitleId, companyId);
    }
}
