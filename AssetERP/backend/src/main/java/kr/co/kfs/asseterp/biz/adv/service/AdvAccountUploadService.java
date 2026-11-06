package kr.co.kfs.asseterp.biz.adv.service;

import kr.co.kfs.asseterp.biz.adv.dto.AccountExcelRow;
import kr.co.kfs.asseterp.biz.adv.mapper.AdvAccountMapper;
import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.common.error.BusinessException;
import kr.co.kfs.asseterp.common.error.ErrorCode;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;
import java.util.List;
import kr.co.kfs.asseterp.common.excel.ExcelCells;

/** AS-IS server/utils/file/ExcelUpload.adv02Upload L1575-1665 (Q01 [엑셀업로드]) + ./excelTemplete/Template_일임계좌정보.xlsx ([템플릿]) */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class AdvAccountUploadService {

    private static final String TEMPLATE = "excelTemplete/Template_일임계좌정보.xlsx";

    private final AdvAccountMapper mapper;

    public byte[] template() {
        return ExcelCells.template(TEMPLATE);
    }

    /**
     * 첫 시트 2번째 행부터 한 행이 한 계좌: 관리코드(0)·계좌명(1)·계좌번호(2)·증권사명(3)·최초설정일(4)·해지일(5).
     * 증권사명은 사용 중인 증권회사(거래처구분 3)의 이름과 같아야 하고(코드는 그 거래처 것), 같은 관리코드가 이미 있으면 막는다(원본은 갱신 코드를 주석 처리).
     * 한 행이라도 오류면 전체 롤백. 등록한 건수를 돌려준다.
     */
    @Transactional
    public int upload(UserPrincipal user, MultipartFile file) {
        Long companyId = user.getCompanyId();
        return ExcelCells.forEachRow(file, (wb, row, i) -> {
            if (row.getCell(0) == null) {
                throw new BusinessException(ErrorCode.INVALID_INPUT, "엑셀파일이 비어있거나 데이터를 읽을 수 없습니다.");
            }
            String manageCode = ExcelCells.string(row.getCell(0));
            String trCorpName = ExcelCells.string(row.getCell(3));
            List<String> corpCodes = mapper.selectTrCorpCodesByName(companyId, trCorpName);
            if (corpCodes.isEmpty()) {
                throw new BusinessException(ErrorCode.INVALID_INPUT, "등록되지않은 증권사명(" + trCorpName + ")이 포함되어있습니다");
            }
            if (mapper.countByManageCode(companyId, manageCode) > 0) {
                throw new BusinessException(ErrorCode.INVALID_INPUT, "중복되는 관리코드(" + manageCode + ")가 포함되어있습니다");
            }
            mapper.excelInsert(new AccountExcelRow(mapper.selectNextId(), companyId, manageCode, ExcelCells.string(row.getCell(1)),
                    corpCodes.get(0), trCorpName, ExcelCells.string(row.getCell(2)), ExcelCells.date(row.getCell(4)), ExcelCells.date(row.getCell(5)),
                    LocalDateTime.now(), user.getName()));
        });
    }
}
