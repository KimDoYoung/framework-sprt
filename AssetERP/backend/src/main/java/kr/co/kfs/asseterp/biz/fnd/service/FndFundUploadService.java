package kr.co.kfs.asseterp.biz.fnd.service;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.fnd.dto.FundExcelRow;
import kr.co.kfs.asseterp.biz.fnd.mapper.FndFundUploadMapper;
import kr.co.kfs.asseterp.common.error.BusinessException;
import kr.co.kfs.asseterp.common.error.ErrorCode;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDate;
import kr.co.kfs.asseterp.common.excel.ExcelCells;

/** AS-IS server/utils/file/ExcelUpload.fundUpload L1402-1573 (P05 [엑셀업로드]) + ./excelTemplete/Template_펀드정보.xlsx ([템플릿]) */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class FndFundUploadService {

    private static final String TEMPLATE = "excelTemplete/Template_펀드정보.xlsx";

    private final FndFundUploadMapper mapper;

    public byte[] template() {
        return ExcelCells.template(TEMPLATE);
    }

    /**
     * 첫 시트 2번째 행부터 한 행이 한 펀드: 펀드코드(0)·협회펀드코드(1)·예탁원펀드코드(2)·예탁원종목코드(3)·펀드명(4)·펀드약명(5)·설정일(9)·해지일(13)·
     * 해지구분 Y/N(14)·운용부서(15)·주운용역(16)·부운용역(17)·사무수탁사 협회코드(18)·수탁사 코드(19)·신탁구분(20)·펀드유형(21)·공모/사모(22).
     * 같은 회사에 같은 코드가 있으면 펀드는 그대로 두고 오늘 작업일의 펀드정보만 다시 넣는다. 한 행이라도 오류면 전체 롤백.
     * 원본이 읽지만 SQL이 넣지 않는 칸(기준통화·설정액·순자산·결산일·보수율·클래스구분 등)은 읽지 않는다. 등록·갱신한 건수를 돌려준다.
     */
    @Transactional
    public int upload(UserPrincipal user, MultipartFile file) {
        Long companyId = user.getCompanyId();
        LocalDate toDay = LocalDate.now();
        return ExcelCells.forEachRow(file, (wb, row, i) -> {
            if (row.getCell(0) == null) {
                throw new BusinessException(ErrorCode.INVALID_INPUT, "엑셀파일이 비어있거나 데이터를 읽을 수 없습니다.");
            }
            String fundCode = ExcelCells.string(row.getCell(0));
            String closeCell = ExcelCells.string(row.getCell(14));
            String closeYn = "Y".equalsIgnoreCase(closeCell) ? "true" : "false";

            String officeWorkCode = ExcelCells.string(row.getCell(18));
            if (officeWorkCode != null) {
                String found = mapper.selectOfficeWorkCodeByKofia(companyId, officeWorkCode);
                if (found == null) {
                    throw new BusinessException(ErrorCode.INVALID_INPUT, (i + 1) + "행의 사무수탁사 협회코드(" + officeWorkCode + ")를 찾을 수 없습니다.");
                }
                officeWorkCode = found;
            }
            String consignmentCode = mapper.selectCorpCode("1", ExcelCells.string(row.getCell(19)), "1", officeWorkCode);

            Long fundCodeId = mapper.selectFundCodeId(companyId, fundCode);
            LocalDate startDate = ExcelCells.date(row.getCell(9));
            LocalDate endDate = ExcelCells.date(row.getCell(13));
            if (fundCodeId == null) {
                fundCodeId = mapper.selectNextId();
                mapper.excelInsertFund(new FundExcelRow(fundCodeId, null, companyId, fundCode, startDate, endDate, closeYn,
                        null, null, null, null, null, null, null, null, null, null, null, null, null, null));
            }
            FundExcelRow info = new FundExcelRow(fundCodeId, mapper.selectNextId(), companyId, fundCode, startDate, endDate, closeYn,
                    toDay, ExcelCells.string(row.getCell(5)), ExcelCells.string(row.getCell(4)), ExcelCells.string(row.getCell(1)),
                    ExcelCells.string(row.getCell(21)), ExcelCells.string(row.getCell(20)), ExcelCells.string(row.getCell(22)), consignmentCode,
                    officeWorkCode, ExcelCells.string(row.getCell(15)), ExcelCells.string(row.getCell(16)), ExcelCells.string(row.getCell(17)),
                    ExcelCells.string(row.getCell(2)), ExcelCells.string(row.getCell(3)));
            mapper.excelDeleteInfo(fundCodeId, toDay);
            mapper.excelInsertInfo(info);
        });
    }
}
