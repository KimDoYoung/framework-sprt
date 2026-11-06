package kr.co.kfs.asseterp.biz.crd.service;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.crd.mapper.CrdCardMapper;
import kr.co.kfs.asseterp.common.error.BusinessException;
import kr.co.kfs.asseterp.common.error.ErrorCode;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDate;
import kr.co.kfs.asseterp.common.excel.ExcelCells;

/** AS-IS server/utils/file/ExcelUpload.cardUpload L3620-3713 (U13 [엑셀업로드]) + ./excelTemplete/Template_카드업로드.xlsx ([템플릿]) */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class CrdCardUploadService {

    private static final String TEMPLATE = "excelTemplete/Template_카드업로드.xlsx";

    private final CrdCardMapper mapper;

    public byte[] template() {
        return ExcelCells.template(TEMPLATE);
    }

    /**
     * 첫 시트 2번째 행부터 한 행이 한 카드: 시작일자(0, 필수)·카드명(1)·카드번호(2, 필수)·식별구분(3, 없으면 카드번호)·카드회사 코드(4)·비고(5).
     * 사용여부 true·카드구분 1(신용카드)로 넣는다. 한 행이라도 오류면 전체 롤백. 등록한 건수를 돌려준다
     */
    @Transactional
    public int upload(UserPrincipal user, MultipartFile file) {
        Long companyId = user.getCompanyId();
        return ExcelCells.forEachRow(file, (wb, row, i) -> {
            if (row.getCell(0) == null) {
                throw new BusinessException(ErrorCode.INVALID_INPUT, "(에러) 시작일자는 필수입력입니다.");
            }
            LocalDate startDate = ExcelCells.date(row.getCell(0));
            String cardName = row.getCell(1) == null ? "" : ExcelCells.string(row.getCell(1));
            if (row.getCell(2) == null) {
                throw new BusinessException(ErrorCode.INVALID_INPUT, "(에러) 카드번호는 필수입력입니다.");
            }
            String cardNoSlip = ExcelCells.string(row.getCell(2));
            String cardNo = row.getCell(3) == null ? ExcelCells.string(row.getCell(2)) : ExcelCells.string(row.getCell(3));
            String bankCode = row.getCell(4) == null ? "" : ExcelCells.string(row.getCell(4));
            String note = row.getCell(5) == null ? "" : ExcelCells.string(row.getCell(5));
            mapper.excelInsertCard(mapper.selectNextId(), companyId, bankCode, cardName, cardNoSlip, cardNo, startDate, note);
        });
    }
}
