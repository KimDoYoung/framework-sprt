package kr.co.kfs.asseterp.biz.sys.service;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.sys.dto.CompanyCreateReq;
import kr.co.kfs.asseterp.biz.sys.dto.CompanyManageReq;
import kr.co.kfs.asseterp.biz.sys.dto.CompanyManageRes;
import kr.co.kfs.asseterp.biz.sys.dto.CompanyOptionRes;
import kr.co.kfs.asseterp.biz.sys.dto.CompanyOrgParam;
import kr.co.kfs.asseterp.biz.sys.dto.CompanyRes;
import kr.co.kfs.asseterp.biz.sys.dto.CompanyRow;
import kr.co.kfs.asseterp.biz.sys.dto.CompanySearchParam;
import kr.co.kfs.asseterp.biz.sys.mapper.SysCompanyMapper;
import kr.co.kfs.asseterp.common.error.BusinessException;
import kr.co.kfs.asseterp.common.error.ErrorCode;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/** AS-IS server/sys/Sys01_Company.java (selectByName / update의 신규 등록) + UpdateDataModel의 회사 추가 후 초기화 */
@Slf4j
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class SysCompanyService {

    private final SysCompanyMapper sysCompanyMapper;

    /** AS-IS selectByName: 고객명 '%입력값%'(없으면 '%'), useYn */
    public List<CompanyRes> searchCompanies(UserPrincipal user, String companyNm, String useYn) {
        requireSysAdmin(user);
        String like = companyNm == null || companyNm.isEmpty() ? "%" : "%" + companyNm + "%";
        return sysCompanyMapper.searchCompanies(new CompanySearchParam(like, useYn));
    }

    /**
     * AS-IS Sys01_Edit_Company.update → Sys01_Company.update(UpdateDataModel): sys01_company INSERT 후
     * 같은 트랜잭션에서 회사 초기화(조직·코드·문서분류·자산·휴가·급여·내부통제·계정·양식)를 하고 selectById로 돌려준다.
     */
    @Transactional
    public CompanyRes createCompany(UserPrincipal user, CompanyCreateReq req) {
        requireSysAdmin(user);
        CompanyCreateReq in = trim(req);
        // AS-IS updateChk() L180-201 (클라이언트) / Sys01_Company.update L165-181 (서버) 필수 검사, 메시지는 팝업 것
        required(in.companyNm(), "고객사명은 필수 입력항목입니다.");
        required(in.locNm(), "서브도메인은 필수 입력항목입니다.");
        required(in.emgrcyPasswd(), "회사암호는 필수 입력항목입니다.");
        if (in.startDate() == null) {
            throw new BusinessException(ErrorCode.INVALID_INPUT, "설립일은 필수 입력항목입니다.");
        }
        required(in.bizNo(), "사업자 등록번호는 필수 입력항목입니다.");
        // TOBE 추가: AS-IS는 DB unique 오류 원문을 보여 주고(사업자번호), 서브도메인 중복은 막지 않는다
        if (sysCompanyMapper.countByLocNm(in.locNm()) > 0) {
            throw new BusinessException(ErrorCode.DUPLICATE_DATA, "이미 사용 중인 서브도메인입니다.");
        }
        if (sysCompanyMapper.countByBizNo(in.bizNo()) > 0) {
            throw new BusinessException(ErrorCode.DUPLICATE_DATA, "이미 등록된 사업자등록번호입니다.");
        }

        Long companyId = sysCompanyMapper.selectNextId();
        sysCompanyMapper.insertCompany(new CompanyRow(companyId, in.companyNm(), in.locNm(), in.emgrcyPasswd(), in.startDate(),
                in.mailInfo(), in.bizNo(), in.leaveMonthCd(), in.taxType(), in.accountCloseMonth()));
        initCompany(companyId, in);
        return sysCompanyMapper.selectCompany(companyId);
    }

    /**
     * 관리정보 탭 조회 (AS-IS Sys01_TabPage_Info01.retrieve → Sys01_Company.selectById L20-29).
     * AS-IS selectById는 main_image_id가 비었으면 채번해 저장한다(조회인데 쓰기 — 그대로 옮김).
     */
    @Transactional
    public CompanyManageRes getCompanyManage(UserPrincipal user, Long companyId) {
        requireSysAdmin(user);
        CompanyManageRes res = sysCompanyMapper.selectCompanyManage(companyId);
        if (res == null) {
            throw new BusinessException(ErrorCode.DATA_NOT_FOUND);
        }
        if (sysCompanyMapper.selectMainImageId(companyId) == null) {
            sysCompanyMapper.updateMainImageId(companyId, sysCompanyMapper.selectNextId());
        }
        return res;
    }

    /**
     * 로그인 회사의 문서번호 채번방식 (AS-IS Org01_Edit_OrgCode·Org02_Edit_Info.editData → Sys01_Company.selectById L20-29 중 dcrNumberingCode).
     * AS-IS selectById의 main_image_id 채번 부수효과도 그대로 둔다(getCompanyManage와 같음).
     */
    @Transactional
    public String getDcrNumberingCode(UserPrincipal user) {
        Long companyId = user.getCompanyId();
        String code = sysCompanyMapper.selectDcrNumberingCode(companyId);
        if (code == null) {
            throw new BusinessException(ErrorCode.DATA_NOT_FOUND);
        }
        if (sysCompanyMapper.selectMainImageId(companyId) == null) {
            sysCompanyMapper.updateMainImageId(companyId, sysCompanyMapper.selectNextId());
        }
        return code;
    }

    /** 관리정보 탭 저장 (AS-IS Sys01_Company.update L165-181: 고객명·접근코드 필수 → UpdateDataModel UPDATE → selectById) */
    @Transactional
    public CompanyManageRes updateCompanyManage(UserPrincipal user, CompanyManageReq req) {
        requireSysAdmin(user);
        required(req.companyNm() == null ? null : req.companyNm().trim(), "고객명은 필수 입력항목입니다.");
        required(req.locNm() == null ? null : req.locNm().trim(), "접근코드는 필수 입력항목입니다.");
        // TOBE 추가: 서브도메인은 테넌트 판정에 쓰이므로 다른 회사와 겹치지 않게 한다
        if (sysCompanyMapper.countByLocNmExcept(req.locNm(), req.companyId()) > 0) {
            throw new BusinessException(ErrorCode.DUPLICATE_DATA, "이미 사용 중인 서브도메인입니다.");
        }
        if (sysCompanyMapper.updateCompanyManage(req) == 0) {
            throw new BusinessException(ErrorCode.DATA_NOT_FOUND);
        }
        return sysCompanyMapper.selectCompanyManage(req.companyId());
    }

    /** AS-IS Sys01_Company.updateNote L109-116 (비고 팝업) */
    @Transactional
    public void updateNote(UserPrincipal user, Long companyId, String note) {
        requireSysAdmin(user);
        if (sysCompanyMapper.updateNote(companyId, note) == 0) {
            throw new BusinessException(ErrorCode.DATA_NOT_FOUND);
        }
    }

    /** AS-IS delete L189 (UpdateDataModel.deleteModel): 선택한 회사의 sys01_company 행만 지운다 → 지운 건수 */
    @Transactional
    public int deleteCompanies(UserPrincipal user, List<Long> companyIds) {
        requireSysAdmin(user);
        if (companyIds == null || companyIds.isEmpty()) {
            return 0;
        }
        if (companyIds.contains(0L)) {
            throw new BusinessException(ErrorCode.INVALID_INPUT, "관리자 회사(0)는 삭제할 수 없습니다.");
        }
        return sysCompanyMapper.deleteCompanies(companyIds);
    }

    /** AS-IS sys.Sys00_Common.selectCompanyInfo — 회사 콤보 (매뉴권한복사 출발지·도착지) */
    public List<CompanyOptionRes> searchCompanyOptions(UserPrincipal user) {
        requireSysAdmin(user);
        return sysCompanyMapper.selectCompanyOptions();
    }

    /** AS-IS UpdateDataModel L90-224 "ASP용으로 회사가 추가되면 관련된 DATA를 insert" — 번호·순서는 원본 주석 그대로(3·10은 원본에서 주석 처리) */
    private void initCompany(Long companyId, CompanyCreateReq in) {
        // 1. 조직 최상단
        CompanyOrgParam org = new CompanyOrgParam(companyId, sysCompanyMapper.selectNextId(), sysCompanyMapper.selectNextId(),
                in.companyNm(), in.startDate());
        sysCompanyMapper.insertOrgCode(org);
        sysCompanyMapper.insertOrgInfo(org);
        int codes = sysCompanyMapper.insertCodesFromAdmin(companyId);           // 2. sys09
        sysCompanyMapper.importDcrFromAdmin(companyId);                         // 4. dcr01
        int ast = sysCompanyMapper.insertAstDetailFromAdmin(companyId);         // 5. ast02
        int leave = sysCompanyMapper.insertLeaveYearFromAdmin(companyId);       // 6. sys30
        int pay = sysCompanyMapper.insertPayFormulaFromAdmin(companyId);        // 7. pay04
        sysCompanyMapper.insertIcsManager(companyId);                           // 8. ics02
        int act = sysCompanyMapper.insertAccountCodesFromAdmin(companyId);      // 9. act01
        int ics30 = sysCompanyMapper.insertCompliancesFromAdmin(companyId);     // 11. ics30
        int ics33 = sysCompanyMapper.insertComplianceAnswersFromAdmin(companyId); // 12. ics33
        int bbs = sysCompanyMapper.insertApplicationFormsFromAdmin(companyId);  // 13. bbs12
        int pay51 = sysCompanyMapper.insertExpenseFormsFromAdmin(companyId);    // 14. pay51
        int com11 = sysCompanyMapper.insertFormMappingsFromAdmin(companyId);    // 15. com11
        log.info("회사 추가 초기화 companyId={} sys09={} ast02={} sys30={} pay04={} act01={} ics30={} ics33={} bbs12={} pay51={} com11={}",
                companyId, codes, ast, leave, pay, act, ics30, ics33, bbs, pay51, com11);
    }

    /** 고객 관리는 KFS 관리자(admin 회사 관리자)만 — AS-IS는 메뉴가 admin 회사에만 있어서 막았다 */
    private static void requireSysAdmin(UserPrincipal user) {
        if (!user.isSysAdmin()) {
            throw new BusinessException(ErrorCode.ACCESS_DENIED);
        }
    }

    private static void required(String value, String message) {
        if (value == null || value.isEmpty()) {
            throw new BusinessException(ErrorCode.INVALID_INPUT, message);
        }
    }

    /** AS-IS spaceDelete() L172-178: 고객사명·서브도메인·회사암호·메일서버·사업자번호 앞뒤 공백 제거 */
    private static CompanyCreateReq trim(CompanyCreateReq r) {
        return new CompanyCreateReq(t(r.companyNm()), t(r.locNm()), t(r.emgrcyPasswd()), r.startDate(), t(r.mailInfo()),
                t(r.bizNo()), r.leaveMonthCd(), r.taxType(), r.accountCloseMonth());
    }

    private static String t(String s) {
        return s == null ? null : s.trim();
    }
}
