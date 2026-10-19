package kr.co.kfs.asseterp.biz.act.service;

import kr.co.kfs.asseterp.biz.act.dto.AccountCodeAdminRes;
import kr.co.kfs.asseterp.biz.act.dto.AccountCodeCopyReq;
import kr.co.kfs.asseterp.biz.act.dto.AccountCodePrintSaveReq;
import kr.co.kfs.asseterp.biz.act.dto.AccountCodeRes;
import kr.co.kfs.asseterp.biz.act.dto.AccountCodeSaveReq;
import kr.co.kfs.asseterp.biz.act.dto.AccountCodeTreeRes;
import kr.co.kfs.asseterp.biz.act.dto.ActCompanyRes;
import kr.co.kfs.asseterp.biz.act.mapper.ActAccountCodeMapper;
import kr.co.kfs.asseterp.biz.act.mapper.ActLinkMapper;
import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.common.error.BusinessException;
import kr.co.kfs.asseterp.common.error.ErrorCode;
import lombok.RequiredArgsConstructor;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

/** AS-IS server/act/Act01_AccountCode.java (selectBySlipYn L40, selectByCompanyId L29, selectTreeByCompanyId L46, insertAdminCopy L53, modelUpdate L117, update L130, delete L135) */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ActAccountCodeService {

    private static final String[] EXCEL_HEADERS = {"계정코드", "계정과목", "상위계정과목", "속성", "차대", "전표", "금감원", "전표(금)",
            "계정과목(보고서용)", "계정과목(금감원용)", "계정영문명", "내용"};

    private final ActAccountCodeMapper mapper;
    private final ActLinkMapper linkMapper;

    /**
     * AS-IS Act01_Lookup_AccountCode.retrieve() L181-216: 회사 없으면 로그인 회사, 속성 없으면 "%", 검색어 "%검색어%"(없으면 "%").
     * 다른 회사는 관리자 회사만(클라이언트 값을 그냥 믿지 않는다)
     */
    public List<AccountCodeRes> searchBySlipYn(UserPrincipal user, Long companyId, String attributeCode, String searchText) {
        Long target = companyId == null ? user.getCompanyId() : companyId;
        if (!target.equals(user.getCompanyId()) && !user.isSysAdmin()) {
            throw new BusinessException(ErrorCode.ACCESS_DENIED);
        }
        String attribute = attributeCode == null || attributeCode.isEmpty() ? "%" : attributeCode;
        String search = searchText == null ? "%" : "%" + searchText + "%";
        return mapper.selectBySlipYn(target, search, attribute);
    }

    /** AS-IS Act01_Tab_AccountCode.retrieve() L210-255: 로그인 회사, 사용여부 없으면 "%", 속성 없으면 "%", 검색어 "%검색어%"(없으면 "%") */
    public List<AccountCodeAdminRes> search(UserPrincipal user, String searchText, String useYn, String attributeCode) {
        return mapper.selectByCompanyId(user.getCompanyId(), likeText(searchText), anyIfBlank(useYn), anyIfBlank(attributeCode));
    }

    /** 편집창 [저장] update() L312-342: 필수 검사 4가지는 원본이 화면에서만 했다 — 서버도 같은 문구로 막는다 */
    @Transactional
    public AccountCodeAdminRes save(UserPrincipal user, AccountCodeSaveReq req) {
        if (isBlank(req.accountCode())) {
            throw new BusinessException(ErrorCode.INVALID_INPUT, "계정코드는 필수입력 항목입니다");
        }
        if (isBlank(req.accountName())) {
            throw new BusinessException(ErrorCode.INVALID_INPUT, "계정과목은 필수입력 항목입니다");
        }
        if (isBlank(req.attributeCode())) {
            throw new BusinessException(ErrorCode.INVALID_INPUT, "계정속성은 필수선택 항목입니다");
        }
        if (isBlank(req.drcrType())) {
            throw new BusinessException(ErrorCode.INVALID_INPUT, "차대구분은 필수선택 항목입니다");
        }
        boolean isNew = req.accountCodeId() == null || req.accountCodeId() <= 0;
        Long id = isNew ? mapper.selectNextId() : req.accountCodeId();
        if (isNew) {
            mapper.insert(id, user.getCompanyId(), req);
        } else if (mapper.update(user.getCompanyId(), req) == 0) {
            throw new BusinessException(ErrorCode.DATA_NOT_FOUND);
        }
        return mapper.selectById(id);
    }

    /** AS-IS Act01_Lookup_PrintYn → act.Act01_AccountCode.update(UpdateDataModel) → 저장된 행(요청 순서) */
    @Transactional
    public List<AccountCodeAdminRes> savePrint(UserPrincipal user, List<AccountCodePrintSaveReq> rows) {
        List<AccountCodeAdminRes> saved = new ArrayList<>();
        for (AccountCodePrintSaveReq req : rows) {
            if (mapper.updatePrint(user.getCompanyId(), req) == 0) {
                throw new BusinessException(ErrorCode.DATA_NOT_FOUND);
            }
            saved.add(mapper.selectById(req.accountCodeId()));
        }
        return saved;
    }

    /** AS-IS delete(UpdateDataModel.deleteModel) → 지운 건수. 회사 조건을 더했다 */
    @Transactional
    public int delete(UserPrincipal user, List<Long> ids) {
        if (ids == null || ids.isEmpty()) {
            return 0;
        }
        return mapper.deleteByIds(user.getCompanyId(), ids);
    }

    /** AS-IS Act01_Lookup_CopyAdmin.retrieve() L210-246: 기준 고객사의 사용 계정 트리. 다른 회사는 관리자 회사만 */
    public List<AccountCodeTreeRes> tree(UserPrincipal user, Long companyId) {
        Long target = companyId == null ? user.getCompanyId() : companyId;
        if (!target.equals(user.getCompanyId()) && !user.isSysAdmin()) {
            throw new BusinessException(ErrorCode.ACCESS_DENIED);
        }
        return mapper.selectTreeByCompanyId(target);
    }

    /** AS-IS Act01_Lookup_CopyAdmin.retrieveCompany() L258-261: 사용 중인 고객사 (복사 창 — 관리자만) */
    public List<ActCompanyRes> companies(UserPrincipal user) {
        requireAdmin(user);
        return mapper.selectUseCompanies();
    }

    /**
     * AS-IS insertAdminCopy L53-115: 기준 고객사의 계정과 그 상위 계정들을 고른 고객사마다 없으면 넣고 있으면 덮어쓰고(정렬코드는 NULL),
     * 이익제공(수령) 연결정보도 없는 것만 넣는다 → 처리한 고객사 수. 관리자만(원본은 버튼만 막았다)
     */
    @Transactional
    public int copyAdmin(UserPrincipal user, AccountCodeCopyReq req) {
        requireAdmin(user);
        if (req.stdCompanyId() == null || isBlank(req.accountCode()) || req.companyIds() == null || req.companyIds().isEmpty()) {
            throw new BusinessException(ErrorCode.INVALID_INPUT, "복사할 계정과목과 고객사를 선택해주세요");
        }
        List<AccountCodeAdminRes> stdList = mapper.selectTreeByAccountCode(req.stdCompanyId(), req.accountCode());
        for (Long companyId : req.companyIds()) {
            for (AccountCodeAdminRes std : stdList) {
                if (mapper.selectByAccountCode(companyId, std.accountCode()).isEmpty()) {
                    mapper.insertAdminAccountCode(req.stdCompanyId(), companyId, std.accountCode());
                } else {
                    mapper.updateAdminAccountCode(companyId, std);
                }
                linkMapper.selectByAccountCode(req.stdCompanyId(), std.accountCode())
                        .forEach(link -> linkMapper.insertUpdate(companyId, link.accountCode(), link.provideContentCode()));
            }
        }
        return req.companyIds().size();
    }

    /** 엑셀다운로드 — AS-IS는 sys99_print에 쌓고 RD 리포트(Act01_Rd_AccountCode)로 만든다. 같은 조회 결과를 RD 출력 열 순서로 xlsx에 쓴다 */
    public byte[] download(UserPrincipal user, String searchText, String useYn, String attributeCode) {
        List<AccountCodeAdminRes> rows = search(user, searchText, useYn, attributeCode);
        try (Workbook wb = new XSSFWorkbook(); ByteArrayOutputStream out = new ByteArrayOutputStream()) {
            Sheet sheet = wb.createSheet("계정과목");
            Row header = sheet.createRow(0);
            for (int i = 0; i < EXCEL_HEADERS.length; i++) {
                header.createCell(i).setCellValue(EXCEL_HEADERS[i]);
            }
            int r = 1;
            for (AccountCodeAdminRes a : rows) {
                Row row = sheet.createRow(r++);
                row.createCell(0).setCellValue(nvl(a.accountCode()));
                row.createCell(1).setCellValue(nvl(a.accountName()));
                row.createCell(2).setCellValue(nvl(a.parentName()));
                row.createCell(3).setCellValue(nvl(a.attributeName()));
                row.createCell(4).setCellValue(nvl(a.drcrName()));
                row.createCell(5).setCellValue(yn(a.slipYn()));
                row.createCell(6).setCellValue(yn(a.fssYn()));
                row.createCell(7).setCellValue(yn(a.fssSlipYn()));
                row.createCell(8).setCellValue(nvl(a.accountName2()));
                row.createCell(9).setCellValue(nvl(a.fssAccountName()));
                row.createCell(10).setCellValue(nvl(a.accountEName()));
                row.createCell(11).setCellValue(nvl(a.content()));
            }
            wb.write(out);
            return out.toByteArray();
        } catch (IOException e) {
            throw new BusinessException(ErrorCode.INTERNAL_ERROR, "엑셀 파일을 만들 수 없습니다.");
        }
    }

    private void requireAdmin(UserPrincipal user) {
        if (!user.isSysAdmin()) {
            throw new BusinessException(ErrorCode.ACCESS_DENIED);
        }
    }

    private String likeText(String searchText) {
        return isBlank(searchText) ? "%" : "%" + searchText + "%";
    }

    private String anyIfBlank(String s) {
        return isBlank(s) ? "%" : s;
    }

    private boolean isBlank(String s) {
        return s == null || s.isEmpty();
    }

    private String nvl(String s) {
        return s == null ? "" : s;
    }

    /** checkBooleanNull(...) == true 이면 Y, 아니면 N */
    private String yn(String s) {
        return "true".equals(s) ? "Y" : "N";
    }
}
