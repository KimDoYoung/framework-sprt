package kr.co.kfs.asseterp.biz.sch.service;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.sch.dto.Sch02ShareRes;
import kr.co.kfs.asseterp.biz.sch.dto.Sch02ShareSaveReq;
import kr.co.kfs.asseterp.biz.sch.dto.Sch10IpoExcelRow;
import kr.co.kfs.asseterp.biz.sch.dto.Sch10IpoInterestReq;
import kr.co.kfs.asseterp.biz.sch.dto.Sch10IpoPrintReq;
import kr.co.kfs.asseterp.biz.sch.dto.Sch10IpoUserCond;
import kr.co.kfs.asseterp.biz.sch.dto.Sch10IpoUserRes;
import kr.co.kfs.asseterp.biz.sch.dto.Sch11IpoCompanyRes;
import kr.co.kfs.asseterp.biz.sch.dto.Sch11IpoCompanySaveReq;
import kr.co.kfs.asseterp.biz.sch.dto.Sch10IpoRes;
import kr.co.kfs.asseterp.biz.sch.dto.Sch10IpoSaveReq;
import kr.co.kfs.asseterp.biz.sch.dto.Sch10IpoSearchParam;
import kr.co.kfs.asseterp.biz.sch.mapper.SchIpoMapper;
import kr.co.kfs.asseterp.biz.sch.mapper.SchWriteGroupMapper;
import kr.co.kfs.asseterp.common.error.BusinessException;
import kr.co.kfs.asseterp.common.error.ErrorCode;
import lombok.RequiredArgsConstructor;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.CellType;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.ss.usermodel.WorkbookFactory;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.InputStream;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.time.LocalDate;
import java.time.ZoneId;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

/**
 * AS-IS server/sch/Sch10_Ipo.java (selectBySearchTextAdmin L31 / update L36 / delete L61) + server/utils/file/ExcelUpload.ipoUpload L2124 — 공모주 일정.
 * 쓰기(저장·삭제·엑셀업로드)는 관리자 회사(기초자료 메뉴)만 한다 — 조회 SQL이 관리자 회사(0)의 일정만 보여 주기 때문이다
 */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class SchIpoService {

    /** 화면이 보여 주는 일정은 관리자 회사(0)의 것이다(selectBySearchTextAdmin) — 관리자가 회사를 골라 로그인했어도 이 회사에 쓴다 */
    private static final long ADMIN_COMPANY_ID = 0L;
    private static final String TEMPLATE = "excelTemplete/Template_공모주 일정등록.xlsx";

    private final SchIpoMapper mapper;
    /** 일정공유(sch02_share) 저장·삭제는 일정(`SchInfoService`)·작성그룹과 같은 매퍼를 쓴다 */
    private final SchWriteGroupMapper shareMapper;

    /** AS-IS retrieve() L292-328: 검색어는 "%검색어%"(없으면 %), 시장구분이 없으면 % */
    public List<Sch10IpoRes> search(String dateType, String startDate, String closeDate, String searchText, String marketCode) {
        if (isBlank(dateType) || isBlank(startDate) || isBlank(closeDate)) {
            throw new BusinessException(ErrorCode.INVALID_INPUT, "조회일자를 입력하세요.");
        }
        return mapper.selectBySearchTextAdmin(new Sch10IpoSearchParam(dateType, startDate, closeDate,
                "%" + (searchText == null ? "" : searchText) + "%", isBlank(marketCode) ? "%" : marketCode));
    }

    /** AS-IS sch.Sch10_Ipo.selectById — 기간별 업무일정(O02)에서 공모주 행의 상세 창 */
    public Sch10IpoRes get(Long ipoId) {
        Sch10IpoRes row = mapper.selectById(ipoId);
        if (row == null) throw new BusinessException(ErrorCode.DATA_NOT_FOUND);
        return row;
    }

    /** AS-IS update(UpdateDataModel): 신규(화면 임시 ID 0 이하)면 INSERT, 아니면 UPDATE 하고 selectById로 다시 읽어 요청 순서대로 */
    @Transactional
    public List<Sch10IpoRes> update(UserPrincipal user, List<Sch10IpoSaveReq> rows) {
        requireAdminCompany(user);
        List<Sch10IpoRes> saved = new ArrayList<>();
        for (Sch10IpoSaveReq req : rows) {
            if (isBlank(req.itemName())) {
                throw new BusinessException(ErrorCode.INVALID_INPUT, "종목을 입력하세요.");
            }
            boolean isNew = req.ipoId() == null || req.ipoId() <= 0;
            Long id = isNew ? mapper.selectNextId() : req.ipoId();
            if (isNew) {
                mapper.insertIpo(id, ADMIN_COMPANY_ID, req);
            } else if (mapper.updateIpo(ADMIN_COMPANY_ID, req) == 0) {
                throw new BusinessException(ErrorCode.DATA_NOT_FOUND);
            }
            saved.add(mapper.selectById(id));
        }
        return saved;
    }

    /** AS-IS delete(UpdateDataModel.deleteModel) → 지운 건수. 회사 조건을 더했다(05 §6) */
    @Transactional
    public int delete(UserPrincipal user, List<Long> ids) {
        requireAdminCompany(user);
        return ids == null || ids.isEmpty() ? 0 : mapper.deleteIpos(ADMIN_COMPANY_ID, ids);
    }

    // ===== 공모주 일정조회 (Q04 Sch10_Tab_Ipo) =====

    private static final String PRINT_WINDOW = "Sch10_Tab_Ipo";

    /** AS-IS Sch10_Tab_Ipo.retrieve() L403-439: 검색어는 "%검색어%"(없으면 %), 시장구분이 없으면 %, 관심종목만 보기, ManagerYn=false */
    public List<Sch10IpoUserRes> searchUser(UserPrincipal user, String dateType, LocalDate startDate, LocalDate closeDate,
                                            String searchText, String marketCode, boolean interestYn) {
        return mapper.selectBySearchText(new Sch10IpoUserCond(user.getCompanyId(), dateType, startDate, closeDate,
                "%" + (searchText == null ? "" : searchText) + "%", isBlank(marketCode) ? "%" : marketCode, interestYn));
    }

    /** AS-IS Sch10_Tab_Ipo.interest() L453-477 → sch.Sch11_IpoCompany.insertInterest (고른 공모주마다) → 처리 건수 */
    @Transactional
    public int interest(UserPrincipal user, Sch10IpoInterestReq req) {
        if (req.ipoIds() == null || req.ipoIds().isEmpty()) {
            throw new BusinessException(ErrorCode.INVALID_INPUT, "대상을 먼저 선택해주세요");
        }
        boolean interestYn = Boolean.TRUE.equals(req.interestYn());
        for (Long ipoId : req.ipoIds()) {
            mapper.insertInterest(user.getCompanyId(), ipoId, interestYn);
        }
        return req.ipoIds().size();
    }

    /**
     * AS-IS Sys99_Print.insertRdIpo L2631 — ① 내 출력 자료를 지우고 ② 같은 조건의 조회 결과를 새 그룹 ID로 담는다.
     * 돌려주는 값 = 그룹 ID(RD 리포트 Sch10_Rd_IpoList의 rdGroupId)
     */
    @Transactional
    public String insertRd(UserPrincipal user, Sch10IpoPrintReq req) {
        Long companyId = user.getCompanyId();
        Long personId = user.getUserId();
        long groupId = mapper.selectNextId();
        mapper.deletePrint(companyId, personId, PRINT_WINDOW);
        for (Sch10IpoUserRes row : searchUser(user, req.dateType(), req.startDate(), req.closeDate(), req.searchText(), req.marketCode(),
                Boolean.TRUE.equals(req.interestYn()))) {
            mapper.insertPrint(mapper.selectNextId(), companyId, personId, PRINT_WINDOW, groupId, row);
        }
        return String.valueOf(groupId);
    }

    // ===== 일정알림 공유자 (Sch02_Lookup_Share) =====

    /** AS-IS Sch02_Share.selectByInfoId3 */
    public List<Sch02ShareRes> searchShares(UserPrincipal user, Long ipoId) {
        requireIpo(ipoId);
        return mapper.selectSharesByIpoId(user.getCompanyId(), ipoId);
    }

    /** AS-IS Sch02_Share.selectShareInto — 저장 뒤 일정공유 칸에 넣는 문구(없으면 null) */
    public String shareInfo(UserPrincipal user, Long ipoId) {
        requireIpo(ipoId);
        return mapper.selectShareInfo(user.getCompanyId(), ipoId);
    }

    /** AS-IS Sch02_Share.update(UpdateDataModel): 이 창은 새 행만 만든다(고칠 수 있는 열이 없다) → 저장한 행(요청 순서) */
    @Transactional
    public List<Sch02ShareRes> saveShares(UserPrincipal user, Long ipoId, List<Sch02ShareSaveReq> rows) {
        requireIpo(ipoId);
        Long companyId = user.getCompanyId();
        List<Sch02ShareRes> saved = new ArrayList<>();
        for (Sch02ShareSaveReq req : rows) {
            boolean person = "1".equals(req.shareCode());
            if (!person && !"2".equals(req.shareCode()) || (person ? req.personId() == null : req.orgId() == null)) {
                throw new BusinessException(ErrorCode.INVALID_INPUT, "공유자를 선택하세요.");
            }
            if (req.shareId() != null && req.shareId() > 0) {
                saved.add(shareMapper.selectShareById(companyId, req.shareId()));
                continue;
            }
            Long shareId = shareMapper.selectNextId();
            shareMapper.insertShare(companyId, ipoId, shareId, req);
            saved.add(shareMapper.selectShareById(companyId, shareId));
        }
        return saved;
    }

    /** AS-IS Sch02_Share.delete(UpdateDataModel.deleteModel) → 지운 건수 */
    @Transactional
    public int deleteShares(UserPrincipal user, Long ipoId, List<Long> shareIds) {
        if (shareIds == null || shareIds.isEmpty()) {
            return 0;
        }
        requireIpo(ipoId);
        return shareMapper.deleteShares(user.getCompanyId(), ipoId, shareIds);
    }

    // ===== 공모주 알람설정 (Sch11_Edit_IpoAlarmSetup) =====

    /** AS-IS Sch11_IpoCompany.selectByIpoId — 내 회사 행이 없으면 null(화면이 빈 행을 만든다) */
    public Sch11IpoCompanyRes getCompany(UserPrincipal user, Long ipoId) {
        requireIpo(ipoId);
        return mapper.selectCompanyByIpoId(user.getCompanyId(), ipoId);
    }

    /** AS-IS Sch11_IpoCompany.update(UpdateDataModel): 행이 없으면(id 0 이하) INSERT, 있으면 알람 6칸 UPDATE → 저장한 행 */
    @Transactional
    public Sch11IpoCompanyRes saveCompany(UserPrincipal user, Long ipoId, Sch11IpoCompanySaveReq req) {
        requireIpo(ipoId);
        Long companyId = user.getCompanyId();
        Long id = req.ipoCompanyId();
        if (id == null || id <= 0) {
            id = mapper.selectNextId();
            mapper.insertCompany(id, companyId, ipoId, req);
        } else if (mapper.updateCompany(companyId, ipoId, req) == 0) {
            throw new BusinessException(ErrorCode.DATA_NOT_FOUND);
        }
        return mapper.selectCompanyById(companyId, id);
    }

    private void requireIpo(Long ipoId) {
        if (ipoId == null || mapper.selectById(ipoId) == null) {
            throw new BusinessException(ErrorCode.DATA_NOT_FOUND);
        }
    }

    /** 엑셀 템플릿 (AS-IS downloadForm → ./excelTemplete/Template_공모주 일정등록.xlsx) */
    public byte[] template() {
        try (InputStream in = new ClassPathResource(TEMPLATE).getInputStream()) {
            return in.readAllBytes();
        } catch (IOException e) {
            throw new BusinessException(ErrorCode.INTERNAL_ERROR, "엑셀 템플릿을 읽을 수 없습니다.");
        }
    }

    /**
     * AS-IS ExcelUpload.ipoUpload L2124-2211 — 첫 시트 2번째 행부터 시장구분·종목명·발행기관코드·수요예측(시작·종료)·청약(시작·종료)·납입일·상장예정일·
     * 희망공모가·공모가·주간사·철회여부(Y/N). 시장구분+종목명이 같으면 갱신, 없으면 등록. 한 행이라도 오류면 전체 롤백 → 등록·갱신한 건수.
     * (원본의 `sch10_ipo.excelDelete`는 방금 받은 새 ID로 지우므로 항상 0건이라 부르지 않는다)
     */
    @Transactional
    public int upload(UserPrincipal user, MultipartFile file) {
        requireAdminCompany(user);
        if (file == null || file.isEmpty()) {
            throw new BusinessException(ErrorCode.INVALID_INPUT, "등록할 파일이 전달되지 않았습니다.");
        }
        try (InputStream in = file.getInputStream(); Workbook wb = WorkbookFactory.create(in)) {
            Sheet sheet = wb.getSheetAt(0);
            int count = 0;
            for (int i = 1; i < sheet.getPhysicalNumberOfRows(); i++) {
                Row row = sheet.getRow(i);
                if (row == null) {
                    throw new BusinessException(ErrorCode.INVALID_INPUT, i + "행의 자료을 읽을 수 없습니다. ");
                }
                if (row.getCell(0) == null) {
                    throw new BusinessException(ErrorCode.INVALID_INPUT, "엑셀파일이 비어있거나 데이터를 읽을 수 없습니다.");
                }
                Long market = cellLong(row.getCell(0));
                String itemName = cellString(row.getCell(1));
                String issCorpCode = cellString(row.getCell(2));
                if (market == null || itemName == null || issCorpCode == null) {
                    throw new BusinessException(ErrorCode.INVALID_INPUT, (i + 1) + "행의 시장구분·종목명·발행기관코드를 읽을 수 없습니다.");
                }
                String cancelYn = cellString(row.getCell(12));
                mapper.excelInsert(new Sch10IpoExcelRow(mapper.selectNextId(), ADMIN_COMPANY_ID, Long.toString(market), itemName, issCorpCode,
                        cellDate(row.getCell(3)), cellDate(row.getCell(4)), cellDate(row.getCell(5)), cellDate(row.getCell(6)),
                        cellDate(row.getCell(7)), cellDate(row.getCell(8)), cellString(row.getCell(9)), cellLong(row.getCell(10)),
                        cellString(row.getCell(11)), "Y".equals(cancelYn) ? "true" : "false"));
                count++;
            }
            return count;
        } catch (BusinessException e) {
            throw e;
        } catch (Exception e) {
            throw new BusinessException(ErrorCode.INVALID_INPUT, e.getMessage() == null ? "엑셀 파일을 읽을 수 없습니다." : e.getMessage());
        }
    }

    /** ExcelUpload.getStringCellData — 숫자는 정수면 정수 글자, 아니면 소수 글자 / 없는 칸은 null */
    private static String cellString(Cell cell) {
        if (cell == null) {
            return null;
        }
        if (cell.getCellType() == CellType.NUMERIC) {
            double value = cell.getNumericCellValue();
            return (value == Math.rint(value) ? String.valueOf((long) value) : String.valueOf(value)).trim();
        }
        return cell.getStringCellValue().trim();
    }

    /** ExcelUpload.getLongCellData — 숫자·수식 숫자는 정수로, 글자는 쉼표를 빼고 숫자면 변환 / 그 밖은 null */
    private static Long cellLong(Cell cell) {
        if (cell == null) {
            return null;
        }
        if (cell.getCellType() == CellType.FORMULA) {
            return cell.getCachedFormulaResultType() == CellType.NUMERIC ? (long) cell.getNumericCellValue() : null;
        }
        if (cell.getCellType() == CellType.NUMERIC) {
            return (long) cell.getNumericCellValue();
        }
        if (cell.getCellType() == CellType.STRING) {
            String s = cell.getStringCellValue().replace(",", "");
            return s.matches("-?\\d+") ? Long.valueOf(s) : null;
        }
        return null;
    }

    /** ExcelUpload.getCellDate — 글자는 [.-]를 빼고 yyyyMMdd로 읽고(못 읽으면 null), 그 밖은 날짜 값 */
    private static LocalDate cellDate(Cell cell) {
        if (cell == null) {
            return null;
        }
        Date date;
        if (cell.getCellType() == CellType.STRING) {
            try {
                date = new SimpleDateFormat("yyyyMMdd").parse(cell.getStringCellValue().replaceAll("[.-]", "").trim());
            } catch (ParseException e) {
                return null;
            }
        } else {
            date = cell.getDateCellValue();
        }
        return date == null ? null : date.toInstant().atZone(ZoneId.systemDefault()).toLocalDate();
    }

    private static void requireAdminCompany(UserPrincipal user) {
        if (!user.isSysAdmin()) {
            throw new BusinessException(ErrorCode.ACCESS_DENIED);
        }
    }

    private static boolean isBlank(String s) {
        return s == null || s.isBlank();
    }
}
