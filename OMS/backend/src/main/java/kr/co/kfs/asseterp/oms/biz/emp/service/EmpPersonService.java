package kr.co.kfs.asseterp.oms.biz.emp.service;

import kr.co.kfs.asseterp.oms.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.oms.biz.emp.dto.PersonKey;
import kr.co.kfs.asseterp.oms.biz.emp.dto.PersonRes;
import kr.co.kfs.asseterp.oms.biz.emp.dto.PersonRow;
import kr.co.kfs.asseterp.oms.biz.emp.dto.PersonSaveReq;
import kr.co.kfs.asseterp.oms.biz.emp.dto.UserInfoRes;
import kr.co.kfs.asseterp.oms.biz.emp.dto.UserInfoSearchParam;
import kr.co.kfs.asseterp.oms.common.dto.PageRes;
import kr.co.kfs.asseterp.oms.biz.emp.mapper.EmpAddTitleMapper;
import kr.co.kfs.asseterp.oms.biz.emp.mapper.EmpPersonMapper;
import kr.co.kfs.asseterp.oms.common.error.BusinessException;
import kr.co.kfs.asseterp.oms.common.error.ErrorCode;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/** 사원 기본정보 (AS-IS server/emp/Emp01_Person) */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class EmpPersonService {

    private final EmpPersonMapper empPersonMapper;
    private final EmpAddTitleMapper empAddTitleMapper;

    /** 로그인 회사의 사원 (없으면 DATA_NOT_FOUND) */
    public PersonRes getPerson(UserPrincipal user, Long personId) {
        PersonRes person = empPersonMapper.selectById(new PersonKey(user.getCompanyId(), personId));
        if (person == null) {
            throw new BusinessException(ErrorCode.DATA_NOT_FOUND, "사원을 찾을 수 없습니다. 다시 조회해 주세요.");
        }
        return person;
    }

    /** AS-IS update (기본정보 탭) */
    @Transactional
    public PersonRes updatePerson(UserPrincipal user, Long personId, PersonSaveReq req) {
        PersonRes person = getPerson(user, personId);
        if (req.korNm() == null || req.korNm().isBlank()) {
            throw new BusinessException(ErrorCode.INVALID_INPUT, "성명은 필수입력 항목입니다");
        }
        empPersonMapper.update(new PersonRow(personId, user.getCompanyId(), person.empNo(), req.korNm().trim(), req.hireDate(),
                req.orderSeq(), req.emailAddr(), req.officeTelno(), req.officeDetail(), req.mobileTelno(), req.note()));
        return getPerson(user, personId);
    }

    /** AS-IS deleteConfirm + deleteTarget: 겸직발령이 있으면 거절, 아니면 사원 행을 지운다 */
    @Transactional
    public void deletePerson(UserPrincipal user, Long personId) {
        getPerson(user, personId);
        if (!empAddTitleMapper.searchByPersonId(personId).isEmpty()) {
            throw new BusinessException(ErrorCode.INVALID_INPUT, "겸직발령내역이 존재합니다. 삭제 후 처리해주세요");
        }
        empPersonMapper.delete(new PersonKey(user.getCompanyId(), personId));
    }

    /** AS-IS selectBySearchTextPaging (사용자정보 조회, 전 고객사). page는 0부터 */
    public PageRes<UserInfoRes> searchUserInfos(Long companyId, String searchText, boolean useOnly, boolean excludeRetired, int page, int size) {
        UserInfoSearchParam param = new UserInfoSearchParam(companyId, "%" + (searchText == null ? "" : searchText.trim()) + "%",
                String.valueOf(useOnly), String.valueOf(excludeRetired), Math.max(page, 0) * size, size);
        return new PageRes<>(empPersonMapper.countUserInfos(param), empPersonMapper.searchUserInfos(param));
    }
}
