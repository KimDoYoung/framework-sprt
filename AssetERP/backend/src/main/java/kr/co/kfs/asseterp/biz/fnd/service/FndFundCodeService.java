package kr.co.kfs.asseterp.biz.fnd.service;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.emp.service.EmpTransInfoService;
import kr.co.kfs.asseterp.biz.fnd.dto.FundCodeCond;
import kr.co.kfs.asseterp.biz.fnd.dto.FundCodeRes;
import kr.co.kfs.asseterp.biz.fnd.dto.FundPlanAuthCond;
import kr.co.kfs.asseterp.biz.fnd.dto.FundPlanAuthRes;
import kr.co.kfs.asseterp.biz.fnd.dto.FundPlanDeleteReq;
import kr.co.kfs.asseterp.biz.fnd.dto.FundPlanListRes;
import kr.co.kfs.asseterp.biz.fnd.dto.FundPlanRes;
import kr.co.kfs.asseterp.biz.fnd.dto.FundPlanSaveReq;
import kr.co.kfs.asseterp.biz.fnd.dto.FundRes;
import kr.co.kfs.asseterp.biz.fnd.dto.FundSaveReq;
import kr.co.kfs.asseterp.biz.fnd.dto.FundSearchCond;
import kr.co.kfs.asseterp.biz.fnd.mapper.FndFundCodeMapper;
import kr.co.kfs.asseterp.biz.sys.service.SysMenuSearchService;
import kr.co.kfs.asseterp.common.error.BusinessException;
import kr.co.kfs.asseterp.common.error.ErrorCode;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

/** AS-IS server/fnd/Fnd01_FundCode.java */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class FndFundCodeService {

    private final FndFundCodeMapper mapper;
    private final EmpTransInfoService transInfoService;

    /**
     * AS-IS fnd.Fnd01_FundCode.selectByFundOrgAuth L56 (F06 펀드별 문서검색). 펀드명은 서버가 %…%로, planYn은 null(임시펀드 + 일반펀드).
     * admin = 회사관리자·관리자 회사면 조직 조건 없이, 아니면 내 조직(LoginUser.getOrgCodeId — 회사관리자는 0)이 권한을 가진 펀드만
     */
    public List<FundCodeRes> searchByOrgAuth(UserPrincipal user, boolean closeYn, boolean classFundExceptYn, String fundName,
                                             String fundTypeCode, String classTypeCode) {
        Long orgId = user.getUserId() < 0 ? 0L : transInfoService.getCurrentTransInfo(user, user.getUserId()).orgCodeId();
        String admin = String.valueOf(SysMenuSearchService.isManager(user));
        return mapper.selectByFundOrgAuth(new FundCodeCond(user.getCompanyId(), orgId, user.getUserId(), admin, String.valueOf(closeYn),
                String.valueOf(classFundExceptYn), "%" + (fundName == null ? "" : fundName) + "%", blankToAny(fundTypeCode), blankToAny(classTypeCode)));
    }

    /** AS-IS fnd.Fnd01_FundCode.selectByFundPlan L83 (P01). 펀드명은 서버가 %…%로, 펀드유형은 비면 % */
    public List<FundPlanRes> searchPlans(UserPrincipal user, boolean closeYn, String fundName, String fundTypeCode) {
        return mapper.selectByFundPlan(user.getCompanyId(), String.valueOf(closeYn), "%" + (fundName == null ? "" : fundName) + "%",
                blankToAny(fundTypeCode));
    }

    /**
     * AS-IS fnd.Fnd01_FundCode.selectByFundName L38 / selectByFundOrgAuth L56 (P02). 권한부서(orgId)를 안 고르면 앞, 고르면 뒤.
     * 펀드명은 서버가 %…%로, 유형·클래스구분은 '%'가 전체
     */
    public List<FundPlanAuthRes> searchPlansForAuth(UserPrincipal user, boolean closeYn, String fundName, String fundTypeCode,
                                                    String classTypeCode, Long orgId) {
        FundPlanAuthCond cond = new FundPlanAuthCond(user.getCompanyId(), String.valueOf(closeYn),
                blankToAny(fundTypeCode), blankToAny(classTypeCode), "%" + (fundName == null ? "" : fundName) + "%");
        return orgId == null ? mapper.selectByFundName(cond) : mapper.selectPlanByOrgAuth(cond);
    }

    /**
     * AS-IS fnd.Fnd01_FundCode.selectByPlan L307 (P03 상품기획일정 등록). 펀드명은 서버가 %…%로, 펀드유형은 비면 %.
     * admin = 회사관리자(LoginUser.getIsManager)면 조직 조건 없이, 아니면 내 조직(회사관리자는 0)이 권한을 가진 임시펀드만
     */
    public List<FundPlanListRes> searchPlanFunds(UserPrincipal user, boolean closeYn, String fundName, String fundTypeCode) {
        Long orgId = user.getUserId() < 0 ? 0L : transInfoService.getCurrentTransInfo(user, user.getUserId()).orgCodeId();
        String admin = String.valueOf(SysMenuSearchService.isManager(user));
        return mapper.selectByPlan(user.getCompanyId(), orgId, admin, String.valueOf(closeYn),
                "%" + (fundName == null ? "" : fundName) + "%", blankToAny(fundTypeCode));
    }

    /** AS-IS fnd.Fnd01_FundCode.selectByOverlap L277 (P01 [중복확인]) — 같은 코드가 있으면 true */
    public boolean existsOverlap(String fundCode) {
        return mapper.countByOverlap(fundCode) > 0;
    }

    /**
     * AS-IS fnd.Fnd01_FundCode.update L139 (P01). 검사 순서·문구는 원본 그대로
     * (펀드코드 → 펀드명 → 동일 펀드코드), fnd02_fund_info(없으면 새 id) → fnd01_fund_code 순으로 저장하고 저장된 행을 되돌린다.
     * 새 행의 펀드코드 ID는 서버가 새로 매기고(원본은 UpdateDataModel이), 회사는 로그인 회사, 임시펀드(planYn=true)로 고정한다.
     */
    @Transactional
    public FundPlanRes savePlan(UserPrincipal user, FundPlanSaveReq req) {
        if (req.fundCode() == null || req.fundCode().isEmpty()) {
            throw new BusinessException(ErrorCode.INVALID_INPUT, "펀드코드는 필수입력항목입니다.");
        }
        if (req.fundName() == null || req.fundName().isEmpty()) {
            throw new BusinessException(ErrorCode.INVALID_INPUT, "펀드명은 필수입력항목입니다.");
        }
        boolean isNew = req.fundCodeId() == null || req.fundCodeId() <= 0;
        if (mapper.countFundCodeCheck(isNew ? 0L : req.fundCodeId(), req.fundCode(), "true") > 0) {
            throw new BusinessException(ErrorCode.INVALID_INPUT, "동일 펀드코드가 존재합니다.");
        }
        Long fundCodeId = req.fundCodeId();
        if (isNew) {
            fundCodeId = mapper.selectNextId();
            mapper.insertFundCode(fundCodeId, user.getCompanyId(), req);
            mapper.insertFundInfo(mapper.selectNextId(), fundCodeId, req);
        } else {
            if (mapper.updateFundCode(user.getCompanyId(), req) == 0) {
                throw new BusinessException(ErrorCode.DATA_NOT_FOUND, "펀드를 찾을 수 없습니다.");
            }
            if (req.fundInfoId() == null || req.fundInfoId() <= 0) {
                mapper.insertFundInfo(mapper.selectNextId(), fundCodeId, req);
            } else {
                mapper.updateFundInfo(fundCodeId, req);
            }
        }
        return mapper.selectPlanById(fundCodeId, user.getCompanyId());
    }

    /** AS-IS fnd.Fnd01_FundCode.delete L222 (P01). ICAM관리 펀드가 하나라도 있으면 아무것도 지우지 않는다 */
    @Transactional
    public void deletePlans(UserPrincipal user, List<FundPlanDeleteReq> rows) {
        if (rows == null || rows.isEmpty()) {
            return;
        }
        List<Long> requested = rows.stream().map(FundPlanDeleteReq::fundCodeId).toList();
        List<FundPlanRes> found = mapper.selectPlanForDelete(requested, user.getCompanyId());
        if (found.stream().anyMatch(f -> "true".equals(f.icamYn()))) {
            throw new BusinessException(ErrorCode.INVALID_INPUT, "ICAM관리 펀드입니다. 수정불가합니다.");
        }
        List<Long> fundCodeIds = found.stream().map(FundPlanRes::fundCodeId).toList();
        if (fundCodeIds.isEmpty()) {
            return;
        }
        List<Long> fundInfoIds = rows.stream().map(FundPlanDeleteReq::fundInfoId).filter(id -> id != null && id > 0).toList();
        if (!fundInfoIds.isEmpty()) {
            mapper.deleteFundInfos(fundInfoIds, fundCodeIds);
        }
        mapper.deleteFundCodes(fundCodeIds, user.getCompanyId());
    }

    /**
     * AS-IS fnd.Fnd01_FundCode.selectByFundName L38 (P05, 일반 펀드). 펀드명은 서버가 %…%로, 유형·클래스구분은 비면 %,
     * icamYn은 '%'(원본 서버가 null이면 '%'로 채움 — SQL에 박았다)
     */
    public List<FundRes> searchFunds(UserPrincipal user, boolean closeYn, String fundName, String fundTypeCode, String classTypeCode) {
        return mapper.selectFunds(new FundSearchCond(user.getCompanyId(), String.valueOf(closeYn),
                "%" + (fundName == null ? "" : fundName) + "%", blankToAny(fundTypeCode), blankToAny(classTypeCode)));
    }

    /**
     * AS-IS Fnd01_Edit_FundCode.updateRow L378 → fnd.Fnd01_FundCode.update L139 / noteUpdate L125 (P05).
     * 이미 있는 펀드가 ICAM관리면(DB에서 확인 — 원본은 화면 모델을 믿음) 비고만 저장한다. 그 밖에는 검사 순서·문구를 원본 그대로
     * (펀드코드 → 펀드명 → 동일 펀드코드), fnd02_fund_info(없으면 새 id, 작업일 = 요청의 workDate 또는 오늘) → fnd01_fund_code 순.
     * 새 펀드의 ID는 서버가 매기고 회사는 로그인 회사, 일반 펀드(planYn=false)로 고정한다. 저장된 행을 되돌린다.
     */
    @Transactional
    public FundRes saveFund(UserPrincipal user, FundSaveReq req) {
        FundSearchCond company = new FundSearchCond(user.getCompanyId(), null, null, null, null);
        boolean isNew = req.fundCodeId() == null || req.fundCodeId() <= 0;
        if (!isNew) {
            FundRes current = mapper.selectFundById(company, req.fundCodeId());
            if (current == null) {
                throw new BusinessException(ErrorCode.DATA_NOT_FOUND, "펀드를 찾을 수 없습니다.");
            }
            if ("true".equals(current.icamYn())) {
                mapper.updateFundNote(req.fundCodeId(), user.getCompanyId(), req.note());
                return mapper.selectFundById(company, req.fundCodeId());
            }
        }
        if (req.fundCode() == null || req.fundCode().isEmpty()) {
            throw new BusinessException(ErrorCode.INVALID_INPUT, "펀드코드는 필수입력항목입니다.");
        }
        if (req.fundName() == null || req.fundName().isEmpty()) {
            throw new BusinessException(ErrorCode.INVALID_INPUT, "펀드명은 필수입력항목입니다.");
        }
        if (mapper.countFundCodeCheck(isNew ? 0L : req.fundCodeId(), req.fundCode(), "false") > 0) {
            throw new BusinessException(ErrorCode.INVALID_INPUT, "동일 펀드코드가 존재합니다.");
        }
        Long fundCodeId = req.fundCodeId();
        FundSaveReq r = req.workDate() == null ? withWorkDate(req, LocalDate.now()) : req;
        if (isNew) {
            fundCodeId = mapper.selectNextId();
            mapper.insertFund(fundCodeId, user.getCompanyId(), r);
            mapper.insertFundDetail(mapper.selectNextId(), fundCodeId, r);
        } else {
            mapper.updateFund(user.getCompanyId(), r);
            if (r.fundInfoId() == null || r.fundInfoId() <= 0) {
                mapper.insertFundDetail(mapper.selectNextId(), fundCodeId, r);
            } else {
                mapper.updateFundDetail(fundCodeId, r);
            }
        }
        return mapper.selectFundById(company, fundCodeId);
    }

    private static FundSaveReq withWorkDate(FundSaveReq q, LocalDate workDate) {
        return new FundSaveReq(q.fundCodeId(), q.fundInfoId(), q.fundCode(), q.kofiaFundCode(), q.ksdFundCode(), q.ksdItemCode(),
                q.fundFullName(), q.fundName(), q.cur(), q.seoljAek(), q.sunjasanAek(), q.startDate(), q.nextCloseDate(), q.nextFeeDate(),
                q.endExpectDate(), q.endDate(), q.closeYn(), q.orgCodeName(), q.operator1(), q.operator2(), q.consignmentCode(),
                q.officeWorkCode(), q.trustBankCode(), q.kofiaTrustCode(), q.kofiaFundTypeCode(), q.kofiaPublicCode(), q.kofiaParentCode(),
                q.kofiaClassTypeCode(), q.kofiaFundUnitCode(), q.kofiaCharClassCode(), q.managementRate(), q.salesRate(), q.consignmentRate(),
                q.officeWorkRate(), q.note(), workDate);
    }

    private String blankToAny(String code) {
        return code == null || code.isBlank() ? "%" : code;
    }
}
