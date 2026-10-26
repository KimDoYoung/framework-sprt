package kr.co.kfs.asseterp.biz.fnd.service;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.fnd.dto.OprFundRes;
import kr.co.kfs.asseterp.biz.fnd.dto.OprFundSaveReq;
import kr.co.kfs.asseterp.biz.fnd.mapper.FndOprFundMapper;
import kr.co.kfs.asseterp.biz.fnd.mapper.FndOprMapper;
import kr.co.kfs.asseterp.common.error.BusinessException;
import kr.co.kfs.asseterp.common.error.ErrorCode;
import lombok.RequiredArgsConstructor;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.CellType;
import org.apache.poi.ss.usermodel.CellValue;
import org.apache.poi.ss.usermodel.FormulaEvaluator;
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
import java.util.List;

/**
 * AS-IS server/fnd/Fnd31_OprFund.java (selectByOprId L25 / modelUpdate L39 / delete L62)
 * + server/utils/file/ExcelUpload.demandOprFundUpload L2042 ([엑셀업로드]) + ./excelTemplete/Template_공모주 수요예측 신청.xlsx ([템플릿])
 */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class FndOprFundService {

    private static final String TEMPLATE = "excelTemplete/Template_공모주 수요예측 신청.xlsx";

    private final FndOprFundMapper mapper;
    private final FndOprMapper oprMapper;

    /** AS-IS selectByOprId — 로그인 회사의 수요예측만 */
    public List<OprFundRes> search(UserPrincipal user, Long oprId) {
        if (oprMapper.selectById(oprId, user.getCompanyId()) == null) {
            throw new BusinessException(ErrorCode.DATA_NOT_FOUND);
        }
        return mapper.selectByOprId(oprId);
    }

    /** AS-IS UpdateDataModel: ID가 없으면(또는 0 이하) INSERT, 있으면 UPDATE. 결재가 걸린 수요예측은 못 고친다(화면 apprCheck 검사를 서버에서도) */
    @Transactional
    public OprFundRes save(UserPrincipal user, OprFundSaveReq req) {
        checkEditable(user, req.oprId());
        if (req.oprFundId() != null && req.oprFundId() > 0) {
            if (mapper.updateOprFund(req) == 0) {
                throw new BusinessException(ErrorCode.DATA_NOT_FOUND);
            }
            return mapper.selectById(req.oprFundId());
        }
        long newId = mapper.selectNextId();
        mapper.insertOprFund(newId, req);
        return mapper.selectById(newId);
    }

    /** AS-IS deleteModel: 체크한 행을 지운다 */
    @Transactional
    public void delete(UserPrincipal user, Long oprId, List<Long> oprFundIds) {
        checkEditable(user, oprId);
        if (oprFundIds == null || oprFundIds.isEmpty()) {
            return;
        }
        mapper.deleteOprFunds(oprId, oprFundIds);
    }

    public byte[] template() {
        try (InputStream in = new ClassPathResource(TEMPLATE).getInputStream()) {
            return in.readAllBytes();
        } catch (IOException e) {
            throw new BusinessException(ErrorCode.INTERNAL_ERROR, "엑셀 템플릿을 읽을 수 없습니다.");
        }
    }

    /**
     * 첫 시트 2번째 행부터 한 행이 한 펀드: 펀드코드(0)·펀드명(1, 저장 안 함)·신청수량(2)·신청금액(3)·구분(4, 1:운용펀드/2:일임(자문)).
     * 코드로 펀드(구분 1)나 일임계좌(구분 2)의 ID를 찾아 새 행으로 넣는다. 한 행이라도 오류면 전체 롤백(원본은 commit 전에 중단). 등록한 건수를 돌려준다
     */
    @Transactional
    public int upload(UserPrincipal user, Long oprId, MultipartFile file) {
        checkEditable(user, oprId);
        if (file == null || file.isEmpty()) {
            throw new BusinessException(ErrorCode.INVALID_INPUT, "등록할 파일이 전달되지 않았습니다.");
        }
        Long companyId = user.getCompanyId();
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
                String fundCode = cellString(row.getCell(0));
                Long qty = cellLong(wb, row.getCell(2));
                Long settleAmt = cellLong(wb, row.getCell(3));
                String fundAdviceType = cellString(row.getCell(4));
                if (fundAdviceType == null) {
                    throw new BusinessException(ErrorCode.INVALID_INPUT, (i + 1) + "행의 운용펀드/일임(자문) 구분이 없습니다.");
                }
                Long fundId = null;
                if (qty != null || settleAmt != null) {
                    fundId = "1".equals(fundAdviceType)
                            ? mapper.selectFundIdByCode(companyId, fundCode)
                            : mapper.selectAccountIdByManageCode(companyId, fundCode);
                    if (fundId == null) {
                        throw new BusinessException(ErrorCode.INVALID_INPUT, (i + 1) + "행의 펀드코드 [" + fundCode + "]를 찾을 수 없습니다.");
                    }
                }
                mapper.excelInsert(mapper.selectNextId(), oprId, fundId, qty, settleAmt, fundAdviceType);
                count++;
            }
            return count;
        } catch (BusinessException e) {
            throw e;
        } catch (Exception e) {
            throw new BusinessException(ErrorCode.INVALID_INPUT, e.getMessage() == null ? "엑셀 파일을 읽을 수 없습니다." : e.getMessage());
        }
    }

    private void checkEditable(UserPrincipal user, Long oprId) {
        if (oprId == null) {
            throw new BusinessException(ErrorCode.INVALID_INPUT, "상단의 종목을 먼저 선택해주세요");
        }
        var opr = oprMapper.selectById(oprId, user.getCompanyId());
        if (opr == null) {
            throw new BusinessException(ErrorCode.DATA_NOT_FOUND);
        }
        FndOprService.checkNotInAppr(opr);
    }

    /** ExcelUpload.getStringCellData — 셀이 없으면 null, 숫자는 정수면 정수 글자, 아니면 소수 글자 */
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

    /** ExcelUpload.getFomulaCellData — 수식은 계산한 숫자, 숫자 셀은 그 값(소수점 버림), 그 밖은 null */
    private static Long cellLong(Workbook wb, Cell cell) {
        if (cell == null) {
            return null;
        }
        if (cell.getCellType() == CellType.FORMULA) {
            FormulaEvaluator evaluator = wb.getCreationHelper().createFormulaEvaluator();
            CellValue value = evaluator.evaluate(cell);
            return value != null && value.getCellType() == CellType.NUMERIC ? (long) value.getNumberValue() : null;
        }
        return cell.getCellType() == CellType.NUMERIC ? (long) cell.getNumericCellValue() : null;
    }
}
