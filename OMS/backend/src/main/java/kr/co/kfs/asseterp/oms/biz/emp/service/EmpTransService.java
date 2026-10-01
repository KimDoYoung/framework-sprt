package kr.co.kfs.asseterp.oms.biz.emp.service;

import kr.co.kfs.asseterp.oms.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.oms.biz.emp.dto.EmpTransRes;
import kr.co.kfs.asseterp.oms.biz.emp.dto.EmpTransRow;
import kr.co.kfs.asseterp.oms.biz.emp.dto.EmpTransSaveReq;
import kr.co.kfs.asseterp.oms.biz.emp.dto.PersonKey;
import kr.co.kfs.asseterp.oms.biz.emp.dto.TransHistoryRes;
import kr.co.kfs.asseterp.oms.biz.emp.dto.TransHistorySearchParam;
import kr.co.kfs.asseterp.oms.biz.emp.dto.TransRes;
import kr.co.kfs.asseterp.oms.biz.emp.dto.TransSearchParam;
import kr.co.kfs.asseterp.oms.biz.emp.mapper.EmpTransMapper;
import kr.co.kfs.asseterp.oms.common.error.BusinessException;
import kr.co.kfs.asseterp.oms.common.error.ErrorCode;
import lombok.RequiredArgsConstructor;
import org.springframework.dao.DuplicateKeyException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

/** 발령 (AS-IS server/emp/Emp03_Trans) */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class EmpTransService {

    private final EmpTransMapper empTransMapper;
    private final EmpPersonService empPersonService;

    /** AS-IS selectByText (사원 Lookup): 기준일 현재 재직 사원 중 성명·조직명·사번 LIKE */
    public List<TransRes> searchTrans(UserPrincipal user, String searchText, LocalDate transDate, Long companyId) {
        return empTransMapper.searchByText(new TransSearchParam(
                user.companyOf(companyId),
                "%" + (searchText == null ? "" : searchText.trim()) + "%",
                transDate == null ? LocalDate.now() : transDate,
                false));
    }

    // ── 사원정보 관리: 일반발령 탭 ──

    /** AS-IS selectByPersonId */
    public List<EmpTransRes> searchPersonTrans(UserPrincipal user, Long personId) {
        empPersonService.getPerson(user, personId);
        return empTransMapper.searchByPersonId(new PersonKey(user.getCompanyId(), personId));
    }

    /** AS-IS update (UpdateDataModel) → 사원의 발령 다시 조회 */
    @Transactional
    public List<EmpTransRes> updateTrans(UserPrincipal user, List<EmpTransSaveReq> rows) {
        List<Long> personIds = new ArrayList<>();
        for (EmpTransSaveReq req : rows) {
            empPersonService.getPerson(user, req.personId());
            if (!req.isNew() && !req.personId().equals(empTransMapper.selectPersonOfTrans(req.transId()))) {
                throw new BusinessException(ErrorCode.DATA_NOT_FOUND);
            }
            if (req.transDate() == null || req.transCd() == null || req.posCd() == null || req.orgCodeId() == null) {
                throw new BusinessException(ErrorCode.INVALID_INPUT, "발령일·발령구분·발령조직·발령직위는 필수입력 항목입니다");
            }
            try {
                if (req.isNew()) {
                    empTransMapper.insert(EmpTransRow.of(empTransMapper.selectNextId(), req));
                } else {
                    empTransMapper.update(EmpTransRow.of(req.transId(), req));
                }
            } catch (DuplicateKeyException e) {
                throw new BusinessException(ErrorCode.DUPLICATE_DATA, "동일한 발령일에 이미 발령내용이 존재합니다");
            }
            if (!personIds.contains(req.personId())) {
                personIds.add(req.personId());
            }
        }
        return personIds.isEmpty() ? List.of() : searchPersonTrans(user, personIds.get(0));
    }

    /** AS-IS deleteCheck + delete: 발령은 사원마다 1건 이상 남아야 한다 */
    @Transactional
    public void deleteTrans(UserPrincipal user, Long transId) {
        Long personId = empTransMapper.selectPersonOfTrans(transId);
        if (personId == null) {
            throw new BusinessException(ErrorCode.DATA_NOT_FOUND);
        }
        empPersonService.getPerson(user, personId);
        if (empTransMapper.countByPerson(personId) <= 1) {
            throw new BusinessException(ErrorCode.INVALID_INPUT, "발령정보는 1(개)이상 있어야합니다");
        }
        empTransMapper.delete(transId);
    }

    /** AS-IS selectByHistory (사원정보 변경조회 - 일반발령) */
    public List<TransHistoryRes> searchHistory(UserPrincipal user, LocalDate startDate, LocalDate closeDate, String searchText) {
        return empTransMapper.searchHistory(new TransHistorySearchParam(user.getCompanyId(),
                startDate == null ? LocalDate.now().minusMonths(12) : startDate,
                closeDate == null ? LocalDate.now() : closeDate,
                "%" + (searchText == null ? "" : searchText.trim()) + "%"));
    }
}
