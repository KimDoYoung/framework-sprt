package kr.co.kfs.asseterp.biz.emp.service;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.emp.dto.DeductRow;
import kr.co.kfs.asseterp.biz.emp.dto.PersonRow;
import kr.co.kfs.asseterp.biz.emp.dto.TransInfoCreateReq;
import kr.co.kfs.asseterp.biz.emp.dto.TransInfoRes;
import kr.co.kfs.asseterp.biz.emp.dto.TransInfoSearchParam;
import kr.co.kfs.asseterp.biz.emp.dto.TransRow;
import kr.co.kfs.asseterp.biz.emp.mapper.EmpTransInfoMapper;
import kr.co.kfs.asseterp.common.error.BusinessException;
import kr.co.kfs.asseterp.common.error.ErrorCode;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

/** AS-IS server/emp/Emp00_TransInfo.java (selectByText / selectOneByPersonId / update) */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class EmpTransInfoService {

    /** 채용발령 (AS-IS update L440: "채용발령(100), 공통코드 확인") */
    private static final String TRANS_HIRE = "100";

    private final EmpTransInfoMapper empTransInfoMapper;

    /**
     * AS-IS selectByText: 검색어는 '%입력값%', 기준일이 없으면 오늘.
     * transCode는 화면의 재직구분(전체 000, 재직 100, 겸직 800, 퇴직 900). isSeparateAddTitle은 화면이 늘 true로 보낸다(SQL에 반영).
     */
    public List<TransInfoRes> searchTransInfos(UserPrincipal user, LocalDate transDate, String searchText, String transCode) {
        String date = (transDate == null ? LocalDate.now() : transDate).toString();
        String like = "%" + (searchText == null ? "" : searchText) + "%";
        return empTransInfoMapper.searchTransInfos(
                new TransInfoSearchParam(user.getCompanyId(), date, like, transCode == null ? "000" : transCode, null, null));
    }

    /** AS-IS selectOneByPersonId(personId, '%') — Emp00_Current_TransInfoModel: 겸직 아닌 최신 발령 */
    public TransInfoRes getCurrentTransInfo(UserPrincipal user, Long personId) {
        TransInfoRes row = empTransInfoMapper.selectCurrentTransInfo(TransInfoSearchParam.ofPersonId(user.getCompanyId(), personId));
        if (row == null) {
            throw new BusinessException(ErrorCode.DATA_NOT_FOUND);
        }
        return row;
    }

    /**
     * AS-IS update L395 (신규사원 등록에서만 호출): 사람·기타정보·채용발령·급여공제를 한 번에 만든다.
     * AS-IS는 emp02_others INSERT 뒤에 commit()을 했지만 TOBE는 한 트랜잭션이다(중간 실패 시 반쯤 남지 않게).
     */
    @Transactional
    public TransInfoRes createTransInfo(UserPrincipal user, TransInfoCreateReq req) {
        validate(req);
        Long companyId = user.getCompanyId();
        String empNo = req.empNo().trim();
        if (empTransInfoMapper.countEmpNo(companyId, empNo) > 0) {
            // AS-IS: 유일 인덱스(idx_emp01_company_id_emp_no) DB 오류 → 미리 막는다(05 §6 DB 오류)
            throw new BusinessException(ErrorCode.DUPLICATE_DATA, "이미 사용 중인 사원번호입니다.");
        }

        Long personId = empTransInfoMapper.selectNextId();
        empTransInfoMapper.insertOthers(personId);
        empTransInfoMapper.insertPerson(new PersonRow(personId, companyId, empNo, req.korNm().trim(), req.hireDate(), req.hireCd(),
                null, null, req.emailAddr().trim(), req.officeTelNo(), req.officeDetail(), req.mobileTelNo().trim(), req.note()));

        // 1-1: 발령일 = 입사일
        Long transId = empTransInfoMapper.selectNextId();
        empTransInfoMapper.insertTrans(new TransRow(transId, companyId, personId, req.hireDate(), TRANS_HIRE, req.kindCd(),
                req.orgCodeId(), req.titleCd(), req.posCd(), null, req.expiryDate(), null));

        // emp35(급여공제 자동 생성) + 회사 0의 AddDeductType 코드마다 emp36
        Long deductId = empTransInfoMapper.selectNextId();
        empTransInfoMapper.insertDeduct(new DeductRow(deductId, companyId, personId, req.hireDate()));
        for (String type : empTransInfoMapper.selectAddDeductTypes(req.hireDate())) {
            empTransInfoMapper.insertAddDeduct(deductId, type);
        }

        return empTransInfoMapper.selectTransInfo(TransInfoSearchParam.ofTransId(companyId, transId));
    }

    /** AS-IS Emp03_Edit_Person.update() L304-339의 필수 검사(화면과 같은 순서·문구). 화면을 거치지 않는 호출도 막는다 */
    private static void validate(TransInfoCreateReq req) {
        if (isBlank(req.empNo())) throw invalid("사원번호는 필수입력 항목입니다");
        if (isBlank(req.korNm())) throw invalid("성명은 필수입력 항목입니다");
        if (req.hireDate() == null) throw invalid("입사일은 필수입력 항목입니다");
        if (isBlank(req.emailAddr())) throw invalid("이메일은 필수입력 항목입니다");
        if (isBlank(req.kindCd())) throw invalid("사원구분은 필수선택 항목입니다");
        if (isBlank(req.mobileTelNo())) throw invalid("휴대폰번호는 필수입력 항목입니다");
        if (isBlank(req.titleCd())) throw invalid("직책은 필수입력 항목입니다");
        if (isBlank(req.posCd())) throw invalid("직위는 필수입력 항목입니다");
        if (req.orgCodeId() == null) throw invalid("조직은 필수입력 항목입니다");
    }

    private static boolean isBlank(String s) {
        return s == null || s.isBlank();
    }

    private static BusinessException invalid(String message) {
        return new BusinessException(ErrorCode.INVALID_INPUT, message);
    }
}
