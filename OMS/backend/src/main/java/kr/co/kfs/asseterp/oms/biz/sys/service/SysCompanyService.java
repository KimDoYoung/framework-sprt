package kr.co.kfs.asseterp.oms.biz.sys.service;

import kr.co.kfs.asseterp.oms.biz.org.dto.OrgCodeRow;
import kr.co.kfs.asseterp.oms.biz.org.dto.OrgInfoRow;
import kr.co.kfs.asseterp.oms.biz.org.mapper.OrgInfoMapper;
import kr.co.kfs.asseterp.oms.biz.sys.dto.CompanyDetailRes;
import kr.co.kfs.asseterp.oms.biz.sys.dto.CompanyMenuRow;
import kr.co.kfs.asseterp.oms.biz.sys.dto.CompanyNoteParam;
import kr.co.kfs.asseterp.oms.biz.sys.dto.CompanyRow;
import kr.co.kfs.asseterp.oms.biz.sys.dto.CompanySaveReq;
import kr.co.kfs.asseterp.oms.biz.sys.dto.LoginSecureRes;
import kr.co.kfs.asseterp.oms.biz.sys.dto.LoginSecureSaveReq;
import kr.co.kfs.asseterp.oms.biz.sys.dto.CompanyMenuYnRes;
import kr.co.kfs.asseterp.oms.biz.sys.dto.CompanyMenuYnSaveReq;
import kr.co.kfs.asseterp.oms.biz.sys.dto.SysCompanyRes;
import kr.co.kfs.asseterp.oms.biz.sys.dto.SysCompanySearchParam;
import kr.co.kfs.asseterp.oms.biz.sys.mapper.SysCompanyMapper;
import kr.co.kfs.asseterp.oms.biz.sys.mapper.SysCodeMapper;
import kr.co.kfs.asseterp.oms.biz.sys.mapper.SysMenuMapper;
import kr.co.kfs.asseterp.oms.common.error.BusinessException;
import kr.co.kfs.asseterp.oms.common.error.ErrorCode;
import lombok.RequiredArgsConstructor;
import org.springframework.dao.DuplicateKeyException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

/** 고객사 (AS-IS server/sys/Sys01_Company) */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class SysCompanyService {

    private final SysCompanyMapper sysCompanyMapper;
    private final SysMenuMapper sysMenuMapper;
    private final SysCodeMapper sysCodeMapper;
    private final OrgInfoMapper orgInfoMapper;

    /** 신규 고객사 최상위 조직 (AS-IS UpdateDataModel의 sys01_company INSERT 부가 처리) */
    private static final String ROOT_ORG_CD = "10000";
    private static final String ROOT_ORG_LEVEL_CD = "0010";

    /** AS-IS selectByName. useYn 'true'면 사용 고객사만 */
    public List<SysCompanyRes> searchCompanies(String companyNm, String useYn) {
        return sysCompanyMapper.searchByName(new SysCompanySearchParam(like(companyNm), useYn));
    }

    /** AS-IS selectByCopyList */
    public List<SysCompanyRes> searchCopyCompanies(String searchText) {
        return sysCompanyMapper.searchCopyList(new SysCompanySearchParam(like(searchText), null));
    }

    /** AS-IS selectByMenuId */
    public List<CompanyMenuYnRes> searchCompaniesByMenu(Long menuId) {
        return sysCompanyMapper.searchByMenuId(menuId);
    }

    /** AS-IS updateByMenuYn: 켜면 sys03 INSERT(사용), 끄면 sys03 DELETE → 다시 조회 */
    @Transactional
    public List<CompanyMenuYnRes> updateCompaniesByMenu(Long menuId, List<CompanyMenuYnSaveReq> rows) {
        List<Long> deleteIds = new ArrayList<>();
        for (CompanyMenuYnSaveReq row : rows) {
            if (row.menuYn()) {
                if (row.companyMenuId() == null) {
                    sysMenuMapper.insertCompanyMenu(new CompanyMenuRow(sysMenuMapper.selectNextId(), row.companyId(), menuId, "true"));
                }
            } else if (row.companyMenuId() != null) {
                deleteIds.add(row.companyMenuId());
            }
        }
        if (!deleteIds.isEmpty()) {
            sysMenuMapper.deleteCompanyMenus(deleteIds);
        }
        return searchCompaniesByMenu(menuId);
    }

    // ── 고객별 시스템정보 관리 (AS-IS Sys01_Tab_Company) ──

    /** AS-IS selectByName (목록). useYn 'true'면 사용 고객사만 */
    public List<CompanyDetailRes> searchCompanyDetails(String companyNm, String useYn) {
        return sysCompanyMapper.searchDetailsByName(new SysCompanySearchParam(like(companyNm), useYn));
    }

    public CompanyDetailRes getCompany(Long companyId) {
        CompanyDetailRes company = sysCompanyMapper.selectDetail(companyId);
        if (company == null) {
            throw new BusinessException(ErrorCode.DATA_NOT_FOUND);
        }
        return company;
    }

    /**
     * AS-IS Sys01_Edit_Company → update(INSERT): 회사를 넣고 AS-IS UpdateDataModel처럼
     * 최상위 조직(org01 코드 10000 + org02 정보) 과 KFS 기본 공통코드(sys09)를 함께 만든다.
     */
    @Transactional
    public CompanyDetailRes createCompany(CompanySaveReq req) {
        validate(req, true);
        Long companyId = sysCompanyMapper.selectNextId();
        CompanyRow row = CompanyRow.of(companyId, new CompanySaveReq(req.companyNm(), req.locNm(), req.bizNo(), req.emgrcyPasswd(),
                req.startDate(), req.closeDate(), true, req.loginSecureYn(), req.icamCompanyCd(), req.icamAdvisCompanyCd(),
                req.empInfo(), req.officeTelNo(), req.emailAddr(), req.note()));
        checkLocNm(row);
        save(() -> sysCompanyMapper.insert(row));

        Long orgCodeId = orgInfoMapper.selectNextId();
        orgInfoMapper.insertOrgCode(new OrgCodeRow(orgCodeId, companyId, ROOT_ORG_CD, req.startDate(), null, null, null, null));
        orgInfoMapper.insertOrgInfo(new OrgInfoRow(orgInfoMapper.selectNextId(), row.companyNm(), req.startDate(), "최초등록",
                orgCodeId, 0L, null, null, ROOT_ORG_LEVEL_CD, "0", null));
        sysCodeMapper.insertCompanyDefaults(companyId);
        return sysCompanyMapper.selectDetail(companyId);
    }

    /** AS-IS Sys01_TabPage_Info01/02 → update */
    @Transactional
    public CompanyDetailRes updateCompany(Long companyId, CompanySaveReq req) {
        validate(req, false);
        CompanyRow row = CompanyRow.of(companyId, req);
        checkLocNm(row);
        save(() -> {
            if (sysCompanyMapper.update(row) == 0) {
                throw new BusinessException(ErrorCode.DATA_NOT_FOUND);
            }
        });
        return sysCompanyMapper.selectDetail(companyId);
    }

    /** AS-IS updateNote */
    @Transactional
    public void updateNote(Long companyId, String note) {
        sysCompanyMapper.updateNote(new CompanyNoteParam(companyId, note));
    }

    /** AS-IS delete: 회사 행만 지운다 */
    @Transactional
    public int deleteCompanies(List<Long> companyIds) {
        return companyIds == null || companyIds.isEmpty() ? 0 : sysCompanyMapper.delete(companyIds);
    }

    /** AS-IS Sys01_Edit_Company.updateChk / Sys01_Company.update 필수값 검사 */
    private void validate(CompanySaveReq req, boolean create) {
        if (isBlank(req.companyNm())) {
            throw new BusinessException(ErrorCode.INVALID_INPUT, "고객사명은 필수 입력항목입니다.");
        }
        if (isBlank(req.locNm())) {
            throw new BusinessException(ErrorCode.INVALID_INPUT, "서브도메인은 필수 입력항목입니다.");
        }
        if (isBlank(req.bizNo())) {
            throw new BusinessException(ErrorCode.INVALID_INPUT, "사업자등록번호는 필수 입력항목입니다.");
        }
        if (create) {
            if (isBlank(req.emgrcyPasswd())) {
                throw new BusinessException(ErrorCode.INVALID_INPUT, "회사암호는 필수 입력항목입니다.");
            }
            if (req.startDate() == null || req.closeDate() == null) {
                throw new BusinessException(ErrorCode.INVALID_INPUT, "설립일과 계약종료일은 필수 입력항목입니다.");
            }
        }
        if (req.startDate() != null && req.closeDate() != null && req.startDate().isAfter(req.closeDate())) {
            throw new BusinessException(ErrorCode.INVALID_INPUT, "설립일은 계약종료일보다 이후 날짜로 입력할 수 없습니다.");
        }
    }

    private void checkLocNm(CompanyRow row) {
        if (sysCompanyMapper.countByLocNm(row) > 0) {
            throw new BusinessException(ErrorCode.DUPLICATE_DATA, "이미 사용 중인 서브도메인입니다.");
        }
    }

    private void save(Runnable save) {
        try {
            save.run();
        } catch (DuplicateKeyException e) {
            throw new BusinessException(ErrorCode.DUPLICATE_DATA, "이미 등록된 사업자등록번호입니다.");
        }
    }

    private static boolean isBlank(String s) {
        return s == null || s.isBlank();
    }

    // ── 공인IP (AS-IS Sys29_LoginSecure) ──

    public List<LoginSecureRes> searchLoginSecures(Long companyId) {
        return sysCompanyMapper.searchLoginSecures(companyId);
    }

    @Transactional
    public List<LoginSecureRes> updateLoginSecures(List<LoginSecureSaveReq> rows) {
        List<LoginSecureRes> saved = new ArrayList<>(rows.size());
        for (LoginSecureSaveReq req : rows) {
            if (isBlank(req.publicIp())) {
                throw new BusinessException(ErrorCode.INVALID_INPUT, "공인IP를 입력하세요.");
            }
            Long id = req.isNew() ? sysCompanyMapper.selectNextId() : req.loginSecureId();
            if (req.isNew()) {
                sysCompanyMapper.insertLoginSecure(req.withId(id));
            } else {
                sysCompanyMapper.updateLoginSecure(req.withId(id));
            }
            saved.add(sysCompanyMapper.selectLoginSecure(id));
        }
        return saved;
    }

    @Transactional
    public int deleteLoginSecures(List<Long> ids) {
        return ids == null || ids.isEmpty() ? 0 : sysCompanyMapper.deleteLoginSecures(ids);
    }

    private static String like(String text) {
        return "%" + (text == null ? "" : text.trim()) + "%";
    }
}
