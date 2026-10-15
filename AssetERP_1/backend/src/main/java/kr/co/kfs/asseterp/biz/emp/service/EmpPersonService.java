package kr.co.kfs.asseterp.biz.emp.service;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.emp.dto.CompanyPersonRes;
import kr.co.kfs.asseterp.biz.emp.dto.CompanyPersonSearchParam;
import kr.co.kfs.asseterp.biz.emp.dto.PersonDeleteParam;
import kr.co.kfs.asseterp.biz.emp.dto.PersonRow;
import kr.co.kfs.asseterp.biz.emp.dto.PersonSaveReq;
import kr.co.kfs.asseterp.biz.emp.dto.UserInfoRes;
import kr.co.kfs.asseterp.biz.emp.dto.UserInfoSearchParam;
import kr.co.kfs.asseterp.common.dto.PageRes;
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

    /**
     * C03 사용자정보 조회: AS-IS emp.Emp01_Person.selectBySearchTextPaging(목록 + selectBySearchTextTotal 건수).
     * 고객사 전체(companyId null)를 보는 관리자 화면 → sys admin만. LIKE '%검색어%'는 서버가 만든다(05 §6)
     */
    public PageRes<UserInfoRes> searchUserInfos(UserPrincipal user, Long companyId, String searchText, String useYn, String quitYn,
                                                int offset, int limit) {
        if (!user.isSysAdmin()) {
            throw new BusinessException(ErrorCode.ACCESS_DENIED);
        }
        String like = "%" + (searchText == null ? "" : searchText) + "%";
        UserInfoSearchParam param = new UserInfoSearchParam(companyId, like, useYn, quitYn, Math.max(offset, 0), limit > 0 ? limit : 100);
        return new PageRes<>(empPersonMapper.countUserInfos(param), empPersonMapper.searchUserInfos(param));
    }

    /**
     * C06 문자발송 대상 고르기: AS-IS emp.Emp01_Person.selectByPaging → selectByCompanyIdPaging + selectByCompanyIdTotal.
     * 고객사 전체('%')를 볼 수 있는 관리자 화면 → sys admin만. LIKE '%검색어%'는 서버가 만든다(05 §6).
     * companyId는 '%'(전체) 또는 회사 ID 문자열(AS-IS companyIdStr).
     */
    public PageRes<CompanyPersonRes> searchCompanyPersons(UserPrincipal user, String companyId, String searchText, String useYn, int offset, int limit) {
        if (!user.isSysAdmin()) {
            throw new BusinessException(ErrorCode.ACCESS_DENIED);
        }
        String like = "%" + (searchText == null ? "" : searchText) + "%";
        CompanyPersonSearchParam param = new CompanyPersonSearchParam(companyId == null || companyId.isEmpty() ? "%" : companyId, like,
                useYn, Math.max(offset, 0), limit > 0 ? limit : 100);
        return new PageRes<>(empPersonMapper.countCompanyPersons(param), empPersonMapper.searchCompanyPersons(param));
    }

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
