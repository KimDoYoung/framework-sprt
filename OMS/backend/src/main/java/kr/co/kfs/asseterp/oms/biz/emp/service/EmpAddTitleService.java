package kr.co.kfs.asseterp.oms.biz.emp.service;

import kr.co.kfs.asseterp.oms.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.oms.biz.emp.dto.AddTitleRes;
import kr.co.kfs.asseterp.oms.biz.emp.dto.AddTitleRow;
import kr.co.kfs.asseterp.oms.biz.emp.dto.AddTitleSaveReq;
import kr.co.kfs.asseterp.oms.biz.emp.dto.EmpTransRow;
import kr.co.kfs.asseterp.oms.biz.emp.dto.PersonRes;
import kr.co.kfs.asseterp.oms.biz.emp.dto.PersonRow;
import kr.co.kfs.asseterp.oms.biz.emp.mapper.EmpAddTitleMapper;
import kr.co.kfs.asseterp.oms.biz.emp.mapper.EmpPersonMapper;
import kr.co.kfs.asseterp.oms.biz.emp.mapper.EmpTransMapper;
import kr.co.kfs.asseterp.oms.common.error.BusinessException;
import kr.co.kfs.asseterp.oms.common.error.ErrorCode;
import lombok.RequiredArgsConstructor;
import org.springframework.dao.DuplicateKeyException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * 겸직발령 (AS-IS server/emp/Emp04_AddTitle). 겸직마다 파생 사원(사번-PTn)을 만들고 그 사원에 겸직 발령(800)을 둔다.
 */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class EmpAddTitleService {

    private static final String ADD_TITLE_TRANS_CD = "800";
    /** AS-IS Emp04_Edit_AddTitle: 사원구분 정규직 */
    private static final String REGULAR_KIND_CD = "10";

    private final EmpAddTitleMapper empAddTitleMapper;
    private final EmpPersonMapper empPersonMapper;
    private final EmpTransMapper empTransMapper;
    private final EmpPersonService empPersonService;

    public List<AddTitleRes> searchAddTitles(UserPrincipal user, Long personId) {
        empPersonService.getPerson(user, personId);
        return empAddTitleMapper.searchByPersonId(personId);
    }

    /** AS-IS updateList (신규): 파생 사원 + 겸직 발령 + 겸직 */
    @Transactional
    public AddTitleRes createAddTitle(UserPrincipal user, Long personId, AddTitleSaveReq req) {
        validate(req);
        PersonRes person = empPersonService.getPerson(user, personId);
        Long addPersonId = empPersonMapper.selectNextId();
        String empNo = person.empNo() + "-PT" + (maxSuffix(empAddTitleMapper.searchByPersonId(personId)) + 1);
        empPersonMapper.insert(new PersonRow(addPersonId, user.getCompanyId(), empNo, person.korNm(), person.hireDate(),
                null, person.emailAddr(), null, null, person.mobileTelno(), null));
        empTransMapper.insert(transRow(empTransMapper.selectNextId(), addPersonId, req));
        Long addTitleId = empAddTitleMapper.selectNextId();
        save(() -> empAddTitleMapper.insert(new AddTitleRow(addTitleId, personId, addPersonId, req.startDate(), req.closeDate(),
                req.orgCodeId(), req.titleCd(), req.transReason())));
        return empAddTitleMapper.selectById(addTitleId);
    }

    /** AS-IS updateList (수정): 파생 사원의 발령과 겸직을 고친다 */
    @Transactional
    public AddTitleRes updateAddTitle(UserPrincipal user, Long addTitleId, AddTitleSaveReq req) {
        validate(req);
        AddTitleRes cur = require(user, addTitleId);
        empTransMapper.updateAddTitleTrans(transRow(null, cur.addPersonId(), req));
        save(() -> empAddTitleMapper.update(new AddTitleRow(addTitleId, cur.personId(), cur.addPersonId(), req.startDate(),
                req.closeDate(), req.orgCodeId(), req.titleCd(), req.transReason())));
        return empAddTitleMapper.selectById(addTitleId);
    }

    /** AS-IS delete: 겸직 행만 지운다 */
    @Transactional
    public void deleteAddTitle(UserPrincipal user, Long addTitleId) {
        require(user, addTitleId);
        empAddTitleMapper.delete(addTitleId);
    }

    private AddTitleRes require(UserPrincipal user, Long addTitleId) {
        AddTitleRes cur = empAddTitleMapper.selectById(addTitleId);
        if (cur == null) {
            throw new BusinessException(ErrorCode.DATA_NOT_FOUND);
        }
        empPersonService.getPerson(user, cur.personId());
        return cur;
    }

    /** 파생 사번 '…-PTn'의 가장 큰 n (없으면 0) — AS-IS updateList 로직 */
    static int maxSuffix(List<AddTitleRes> list) {
        int max = 0;
        for (AddTitleRes a : list) {
            String no = a.empNo() == null ? "" : a.empNo();
            int i = no.length();
            while (i > 0 && Character.isDigit(no.charAt(i - 1))) {
                i--;
            }
            if (i < no.length()) {
                max = Math.max(max, Integer.parseInt(no.substring(i)));
            }
        }
        return max;
    }

    private static EmpTransRow transRow(Long transId, Long addPersonId, AddTitleSaveReq r) {
        return new EmpTransRow(transId, addPersonId, r.startDate(), ADD_TITLE_TRANS_CD, REGULAR_KIND_CD, r.orgCodeId(),
                r.titleCd(), r.posCd(), r.transReason(), String.valueOf(r.orgHeadYn()));
    }

    /** AS-IS Emp04_Edit_AddTitle.update 필수값 */
    private static void validate(AddTitleSaveReq r) {
        if (r.startDate() == null) {
            throw new BusinessException(ErrorCode.INVALID_INPUT, "겸직시작일은 필수입력 항목입니다");
        }
        if (r.titleCd() == null || r.titleCd().isBlank()) {
            throw new BusinessException(ErrorCode.INVALID_INPUT, "직책은 필수입력 항목입니다");
        }
        if (r.posCd() == null || r.posCd().isBlank()) {
            throw new BusinessException(ErrorCode.INVALID_INPUT, "직위는 필수입력 항목입니다");
        }
        if (r.orgCodeId() == null) {
            throw new BusinessException(ErrorCode.INVALID_INPUT, "조직은 필수입력 항목입니다");
        }
    }

    private static void save(Runnable save) {
        try {
            save.run();
        } catch (DuplicateKeyException e) {
            throw new BusinessException(ErrorCode.DUPLICATE_DATA, "같은 조직·시작일의 겸직이 이미 있습니다");
        }
    }
}
