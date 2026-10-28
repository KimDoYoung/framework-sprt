package kr.co.kfs.asseterp.biz.emp.service;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.emp.dto.AddDeductRes;
import kr.co.kfs.asseterp.biz.emp.dto.AddDeductSaveReq;
import kr.co.kfs.asseterp.biz.emp.dto.DeductCreateReq;
import kr.co.kfs.asseterp.biz.emp.dto.DeductPersonRes;
import kr.co.kfs.asseterp.biz.emp.dto.DeductRes;
import kr.co.kfs.asseterp.biz.emp.dto.DeductSaveReq;
import kr.co.kfs.asseterp.biz.emp.mapper.EmpDeductMapper;
import kr.co.kfs.asseterp.common.error.BusinessException;
import kr.co.kfs.asseterp.common.error.ErrorCode;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;

/** AS-IS server/emp/Emp35_Deduct.java + Emp36_AddDeduct.java */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class EmpDeductService {

    private static final String ADD_DEDUCT_TYPE = "AddDeductType";
    private static final DateTimeFormatter YEAR_MONTH_DAY = DateTimeFormatter.ofPattern("yyyy년 MM월 dd일");

    private final EmpDeductMapper empDeductMapper;

    /** AS-IS Emp35_Deduct.selectByStdDate (S28) — 기준일은 오늘(LoginUser.getToday), transCode는 화면이 재직구분에서 정한다 */
    public List<DeductPersonRes> getDeductPersons(UserPrincipal user, Long personId, String transCode) {
        return empDeductMapper.selectByStdDate(user.getCompanyId(), personId, LocalDate.now(), transCode);
    }

    /** AS-IS Emp35_Deduct.selectByPersonId */
    public List<DeductRes> getDeducts(UserPrincipal user, Long personId) {
        return empDeductMapper.selectDeducts(user.getCompanyId(), personId);
    }

    /**
     * AS-IS Emp35_Deduct.insert — 3-way 분기:
     * 1) 기존 이력 없음: 빈 행 삽입
     * 2) 기존 있고 날짜 같음: 기존 값 복사 + 기존 삭제(교체)
     * 3) 기존 있고 날짜 다름: 기존 값 복사(이력 유지)
     */
    @Transactional
    public void createDeduct(UserPrincipal user, DeductCreateReq req) {
        if (req.startDate() == null) {
            throw new BusinessException(ErrorCode.INVALID_INPUT, "적용일은 필수입력 항목입니다");
        }
        Long companyId = user.getCompanyId();
        Long deductId = empDeductMapper.selectNextDeductId();
        DeductRes existing = empDeductMapper.selectCurrentDeduct(companyId, req.personId(), req.startDate());

        if (existing == null) {
            empDeductMapper.insertDeduct(new DeductRes(
                    deductId, companyId, req.personId(), req.startDate(),
                    null, null, null, null, null, null, null));
        } else if (YEAR_MONTH_DAY.format(existing.startDate()).equals(YEAR_MONTH_DAY.format(req.startDate()))) {
            empDeductMapper.insertDeduct(new DeductRes(
                    deductId, companyId, req.personId(), req.startDate(),
                    existing.basicDeductCnt(), existing.addDeductYn(), existing.insureYn(),
                    existing.reprYn(), existing.withHoldRate(), existing.note(), existing.childDeductCnt()));
            empDeductMapper.insertAddDeductTypes(deductId, req.personId(), req.startDate(), companyId, ADD_DEDUCT_TYPE);
            empDeductMapper.deleteAddDeducts(existing.deductId());
            empDeductMapper.deleteDeduct(existing.deductId(), companyId);
            return;
        } else {
            empDeductMapper.insertDeduct(new DeductRes(
                    deductId, companyId, req.personId(), req.startDate(),
                    existing.basicDeductCnt(), existing.addDeductYn(), existing.insureYn(),
                    existing.reprYn(), existing.withHoldRate(), existing.note(), existing.childDeductCnt()));
        }
        empDeductMapper.insertAddDeductTypes(deductId, req.personId(), req.startDate(), companyId, ADD_DEDUCT_TYPE);
    }

    /** AS-IS Emp35_Deduct.update → UpdateDataModel(emp35_deduct) → selectById */
    @Transactional
    public DeductRes updateDeduct(UserPrincipal user, Long deductId, DeductSaveReq req) {
        if (req.withHoldRate() == null) {
            throw new BusinessException(ErrorCode.INVALID_INPUT, "원천징수비율은 필수입력 항목입니다");
        }
        Long companyId = user.getCompanyId();
        int updated = empDeductMapper.updateDeduct(deductId, companyId, req);
        if (updated == 0) throw new BusinessException(ErrorCode.DATA_NOT_FOUND);
        return empDeductMapper.selectDeductById(deductId, companyId);
    }

    /** AS-IS Emp35_Deduct.deleteAll */
    @Transactional
    public int deleteDeduct(UserPrincipal user, Long deductId) {
        Long companyId = user.getCompanyId();
        empDeductMapper.deleteAddDeducts(deductId);
        int deleted = empDeductMapper.deleteDeduct(deductId, companyId);
        if (deleted == 0) throw new BusinessException(ErrorCode.DATA_NOT_FOUND);
        return deleted;
    }

    /** AS-IS Emp36_AddDeduct.selectByDeductId */
    public List<AddDeductRes> getAddDeducts(Long deductId) {
        return empDeductMapper.selectAddDeducts(deductId);
    }

    /** AS-IS Emp36_AddDeduct.updateDeductCnt — null → 0 처리 */
    @Transactional
    public List<AddDeductRes> updateAddDeducts(Long deductId, List<AddDeductSaveReq> rows) {
        for (AddDeductSaveReq row : rows) {
            empDeductMapper.updateAddDeduct(
                    new AddDeductSaveReq(row.addDeductId(), row.addDeductCnt() == null ? 0L : row.addDeductCnt()));
        }
        return empDeductMapper.selectAddDeducts(deductId);
    }
}
