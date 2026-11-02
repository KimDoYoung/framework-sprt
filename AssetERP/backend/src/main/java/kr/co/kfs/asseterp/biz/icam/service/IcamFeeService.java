package kr.co.kfs.asseterp.biz.icam.service;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.icam.dto.IcamFeeDetailParam;
import kr.co.kfs.asseterp.biz.icam.dto.IcamFeeDetailRes;
import kr.co.kfs.asseterp.biz.icam.dto.IcamFeeJobReq;
import kr.co.kfs.asseterp.biz.icam.dto.IcamFeeParam;
import kr.co.kfs.asseterp.biz.icam.dto.IcamFeePrintReq;
import kr.co.kfs.asseterp.biz.icam.dto.IcamFeeRes;
import kr.co.kfs.asseterp.biz.icam.dto.IcamFeeFundRes;
import kr.co.kfs.asseterp.biz.icam.mapper.IcamFeeMapper;
import kr.co.kfs.asseterp.common.dto.PageRes;
import kr.co.kfs.asseterp.common.error.BusinessException;
import kr.co.kfs.asseterp.common.error.ErrorCode;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

/**
 * AS-IS server/icam/Icam10_Fee.java (selectByFeeTypePaging L29 = 목록 + 전체 건수).
 * 관리자 회사가 아니면 자기 회사만 — 원본은 조회창이 막는 것을 서버도 막는다(보안 보강, D07과 같음)
 */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class IcamFeeService {

    /** insertRdFundMngFee 요청의 windowClassName (클라이언트가 고정값으로 보냄) */
    private static final String FUND_MNG_FEE_WINDOW = "Icam10_Tab_FundMngFee";

    private final IcamFeeMapper mapper;
    private final IcamBatchRunner batchRunner;

    public PageRes<IcamFeeRes> search(UserPrincipal user, Long companyId, String feeType, LocalDate startDate, LocalDate closeDate,
                                      String searchText, String fundCode, int offset, int limit) {
        IcamFeeParam param = new IcamFeeParam(allowedCompany(user, companyId), feeType, startDate, closeDate,
                searchText == null ? "" : searchText, blankToNull(fundCode), Math.max(offset, 0), limit > 0 ? limit : 100);
        return new PageRes<>(mapper.selectByFeeTypePagingTotal(param), mapper.selectByFeeTypePaging(param));
    }

    /** AS-IS icam.Icam10_Fee.selectFundList (Icam10_Lookup_FundCode) — 로그인 회사의 발생보수 펀드 목록. 검색어는 '%…%' */
    public List<IcamFeeFundRes> searchFunds(UserPrincipal user, LocalDate stdDate, String searchText) {
        if (stdDate == null) {
            throw new BusinessException(ErrorCode.INVALID_INPUT);
        }
        return mapper.selectFundList(user.getCompanyId(), stdDate, "%" + (searchText == null ? "" : searchText) + "%");
    }

    /**
     * AS-IS sys.Sys99_Print.insertRdFundMngFee L3798 (Icam10_Tab_FundMngFee [출력/다운로드])
     * ① 내 출력 자료 정리(화면 클래스) ② 같은 조건 조회 결과를 sys99_print에 삽입 ③ 새 groupId 반환
     */
    @Transactional
    public String insertRdFundMngFee(UserPrincipal user, IcamFeePrintReq req) {
        if (req.feeType() == null || req.startDate() == null || req.closeDate() == null) {
            throw new BusinessException(ErrorCode.INVALID_INPUT);
        }
        IcamFeeParam param = new IcamFeeParam(user.getCompanyId(), req.feeType(), req.startDate(), req.closeDate(),
                req.searchText() == null ? "" : req.searchText(), blankToNull(req.fundCode()), 0, 0);
        long groupId = mapper.selectNextId();
        mapper.deletePrint(user.getCompanyId(), user.getUserId(), FUND_MNG_FEE_WINDOW);
        mapper.insertPrintFundMngFee(param, user.getUserId(), FUND_MNG_FEE_WINDOW, groupId);
        return String.valueOf(groupId);
    }

    private static String blankToNull(String value) {
        return value == null || value.isBlank() ? null : value;
    }

    /** AS-IS icam.Icam10_Fee.selectByFundCode (Ast30_Lookup_FeeDetail) — 로그인 회사의 펀드 하루 적요별 보수 */
    public List<IcamFeeDetailRes> searchByFund(UserPrincipal user, Long corpId, String fundCode, LocalDate stdDate, String searchText) {
        if (fundCode == null || fundCode.isBlank() || stdDate == null) {
            throw new BusinessException(ErrorCode.INVALID_INPUT);
        }
        return mapper.selectByFundCode(new IcamFeeDetailParam(user.getCompanyId(), corpId, fundCode, stdDate, searchText == null ? "" : searchText));
    }

    /** AS-IS BatchMain?actionCode=icamOfficeMngFee|icamFundMngFee&companyId=…&worker=…&startDate=…&closeDate=… (연동이 없으면 거절) */
    public void runBatch(UserPrincipal user, String actionCode, String companyId, LocalDate startDate, LocalDate closeDate) {
        if (!"icamOfficeMngFee".equals(actionCode) && !"icamFundMngFee".equals(actionCode)) {
            throw new BusinessException(ErrorCode.INVALID_INPUT);
        }
        if (startDate == null || closeDate == null) {
            throw new BusinessException(ErrorCode.INVALID_INPUT);
        }
        String target = "ALL".equals(companyId) ? companyId : String.valueOf(allowedCompany(user, parseId(companyId)));
        if ("ALL".equals(target) && !user.isSysAdmin()) {
            throw new BusinessException(ErrorCode.ACCESS_DENIED);
        }
        batchRunner.runFee(actionCode, target, user.getName(), startDate, closeDate);
    }

    /** AS-IS icam.Icam10_Fee.updateFee (Icam10_Lookup_FundFee [저장]) — 발생보수만 바꾼다. TOBE는 로그인 회사의 행만 */
    @Transactional
    public void updateFee(UserPrincipal user, Long feeId, BigDecimal fee) {
        if (feeId == null) {
            throw new BusinessException(ErrorCode.INVALID_INPUT);
        }
        if (mapper.updateFee(feeId, fee, user.getCompanyId()) == 0) {
            throw new BusinessException(ErrorCode.DATA_NOT_FOUND);
        }
    }

    /** AS-IS icam.Icam10_Fee.getICAMFundFee (Icam10_Lookup_getICAM [보수발생내역 가져오기]) — 외부 ICAM DB 연동이 없으면 거절 */
    public void runFundFee(UserPrincipal user, IcamFeeJobReq req) {
        checkJob(req);
        batchRunner.runFundFee(user.getCompanyId(), req.feeType(), percent(req.corpCode()), percent(req.fundCode()), req.startDate(), req.closeDate());
    }

    /** AS-IS icam.Icam10_Fee.createFeeBook ([보수원장 재생성]) — DB 함수 f_create_fundFeeBook(2)가 'Y'를 돌려줘야 성공 */
    @Transactional
    public void createFeeBook(UserPrincipal user, IcamFeeJobReq req) {
        checkJob(req);
        Long companyId = user.getCompanyId();
        Long corpId = corpIdOf(user, req);
        String result = corpId == null
                ? mapper.createFundFeeBook(companyId, req.startDate(), null)
                : mapper.createFundFeeBook2(companyId, req.startDate(), corpId, percent(req.fundCode()));
        requireYes(result);
    }

    /**
     * AS-IS icam.Icam10_Fee.createFeeRcvTr ([보수인출거래 재생성]) — 시작일부터 어제까지 달력의 날마다 DB 함수를 부른다.
     * 운용보수(20402) 또는 운용사 "전체"는 f_create_fundFeeRcvTr, 사무관리보수의 운용사 지정은 f_create_fundFeeRcvTr_officeMng. 한 날이라도 실패하면 멈추고 전부 되돌린다
     */
    @Transactional
    public void createFeeRcvTr(UserPrincipal user, IcamFeeJobReq req) {
        checkJob(req);
        Long companyId = user.getCompanyId();
        Long corpId = corpIdOf(user, req);
        boolean allCorp = "20402".equals(req.feeType()) || "%".equals(percent(req.corpCode()));
        for (LocalDate day : mapper.selectCalendarDays(companyId, req.startDate(), LocalDate.now().minusDays(1))) {
            requireYes(allCorp ? mapper.createFundFeeRcvTr(companyId, day) : mapper.createFundFeeRcvTr2(companyId, day, corpId));
        }
    }

    private static void checkJob(IcamFeeJobReq req) {
        if (req == null || req.feeType() == null || req.startDate() == null) {
            throw new BusinessException(ErrorCode.INVALID_INPUT);
        }
    }

    /** 사무관리보수(20407)는 고른 운용사(전체면 null), 그 밖은 로그인 회사 */
    private static Long corpIdOf(UserPrincipal user, IcamFeeJobReq req) {
        return "20407".equals(req.feeType()) ? req.corpId() : user.getCompanyId();
    }

    private static String percent(String value) {
        return value == null || value.isBlank() ? "%" : value;
    }

    private static void requireYes(String result) {
        if (!"Y".equals(result)) {
            throw new BusinessException(ErrorCode.INVALID_INPUT, result == null ? ErrorCode.INVALID_INPUT.getMessage() : result);
        }
    }

    private static Long parseId(String companyId) {
        try {
            return Long.valueOf(companyId);
        } catch (NumberFormatException e) {
            throw new BusinessException(ErrorCode.INVALID_INPUT);
        }
    }

    private static Long allowedCompany(UserPrincipal user, Long companyId) {
        if (user.isSysAdmin()) {
            return companyId;
        }
        if (companyId != null && !companyId.equals(user.getCompanyId())) {
            throw new BusinessException(ErrorCode.ACCESS_DENIED);
        }
        return user.getCompanyId();
    }
}
