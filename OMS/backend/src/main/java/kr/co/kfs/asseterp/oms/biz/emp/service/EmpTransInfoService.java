package kr.co.kfs.asseterp.oms.biz.emp.service;

import kr.co.kfs.asseterp.oms.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.oms.biz.emp.dto.EmpTransRow;
import kr.co.kfs.asseterp.oms.biz.emp.dto.OrgPersonRes;
import kr.co.kfs.asseterp.oms.biz.emp.dto.OrgPersonSearchParam;
import kr.co.kfs.asseterp.oms.biz.emp.dto.PersonRow;
import kr.co.kfs.asseterp.oms.biz.emp.dto.TransInfoCreateReq;
import kr.co.kfs.asseterp.oms.biz.emp.dto.TransInfoRes;
import kr.co.kfs.asseterp.oms.biz.emp.dto.TransInfoSearchParam;
import kr.co.kfs.asseterp.oms.biz.emp.mapper.EmpPersonMapper;
import kr.co.kfs.asseterp.oms.biz.emp.mapper.EmpTransInfoMapper;
import kr.co.kfs.asseterp.oms.biz.emp.mapper.EmpTransMapper;
import kr.co.kfs.asseterp.oms.common.error.BusinessException;
import kr.co.kfs.asseterp.oms.common.error.ErrorCode;
import lombok.RequiredArgsConstructor;
import org.springframework.dao.DuplicateKeyException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

/** 사원 현재 정보 (AS-IS server/emp/Emp00_TransInfo) */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class EmpTransInfoService {

    /** 채용발령 (EmpTransCode) */
    private static final String HIRE_TRANS_CD = "100";

    private final EmpTransInfoMapper empTransInfoMapper;
    private final EmpPersonMapper empPersonMapper;
    private final EmpTransMapper empTransMapper;

    /** AS-IS selectByText. transCode 없으면 전체(000), 기준일 없으면 오늘. isSeparateAddTitle: 재직에서 겸직 제외 */
    public List<TransInfoRes> searchTransInfos(UserPrincipal user, String searchText, String transCode,
                                               LocalDate transDate, Long orgCodeId, boolean isSeparateAddTitle) {
        return empTransInfoMapper.searchByText(new TransInfoSearchParam(
                user.getCompanyId(),
                "%" + (searchText == null ? "" : searchText.trim()) + "%",
                transCode == null || transCode.isBlank() ? "000" : transCode,
                (transDate == null ? LocalDate.now() : transDate).toString(),
                isSeparateAddTitle,
                orgCodeId,
                null));
    }

    /** AS-IS selectByAllOrgCodeId (조직별 사원조회): 조직과 하위 조직의 기준일 사원 */
    public List<OrgPersonRes> searchByOrg(UserPrincipal user, Long orgCodeId, LocalDate baseDate) {
        return empTransInfoMapper.searchByOrg(new OrgPersonSearchParam(user.getCompanyId(), orgCodeId, baseDate == null ? LocalDate.now() : baseDate));
    }

    /** AS-IS selectOneByPersonId (transCode '%': 겸직 제외 최근 발령) */
    public TransInfoRes getTransInfo(UserPrincipal user, Long personId) {
        return empTransInfoMapper.selectOneByPersonId(new TransInfoSearchParam(user.getCompanyId(), null, "%", null, false, null, personId));
    }

    /**
     * AS-IS update (신규사원 등록): 사원 + 채용발령(100)을 넣는다.
     * - AS-IS는 발령일을 넣지 않았는데 asseterpdb는 emp03_trans_date NOT NULL → 입사일로 넣는다
     * - AS-IS의 공제(emp35_deduct, emp36_add_deduct) INSERT는 asseterpdb에 테이블이 없어 뺐다
     */
    @Transactional
    public TransInfoRes createTransInfo(UserPrincipal user, TransInfoCreateReq req) {
        validate(req);
        Long personId = empPersonMapper.selectNextId();
        try {
            empPersonMapper.insert(new PersonRow(personId, user.getCompanyId(), req.empNo().trim(), req.korNm().trim(), req.hireDate(),
                    null, req.emailAddr().trim(), req.officeTelno(), req.officeDetail(), req.mobileTelno().trim(), req.note()));
        } catch (DuplicateKeyException e) {
            throw new BusinessException(ErrorCode.DUPLICATE_DATA, "이미 사용 중인 사원번호입니다.");
        }
        empTransMapper.insert(new EmpTransRow(empTransMapper.selectNextId(), personId, req.hireDate(), HIRE_TRANS_CD, req.kindCd(),
                req.orgCodeId(), req.titleCd(), req.posCd(), null, "false"));
        return getTransInfo(user, personId);
    }

    /** AS-IS Emp03_Edit_Person.update 필수값 */
    private static void validate(TransInfoCreateReq r) {
        require(r.empNo(), "사원번호는 필수입력 항목입니다");
        require(r.korNm(), "성명은 필수입력 항목입니다");
        if (r.hireDate() == null) {
            throw new BusinessException(ErrorCode.INVALID_INPUT, "입사일은 필수입력 항목입니다");
        }
        require(r.emailAddr(), "이메일은 필수입력 항목입니다");
        require(r.kindCd(), "사원구분은 필수선택 항목입니다");
        require(r.mobileTelno(), "휴대폰번호는 필수입력 항목입니다");
        require(r.titleCd(), "직책은 필수입력 항목입니다");
        require(r.posCd(), "직위는 필수입력 항목입니다");
        if (r.orgCodeId() == null) {
            throw new BusinessException(ErrorCode.INVALID_INPUT, "조직은 필수입력 항목입니다");
        }
    }

    private static void require(String v, String message) {
        if (v == null || v.isBlank()) {
            throw new BusinessException(ErrorCode.INVALID_INPUT, message);
        }
    }
}
