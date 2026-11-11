package kr.co.kfs.asseterp.biz.biz.service;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.biz.mapper.BizPromoMapper;
import kr.co.kfs.asseterp.common.error.BusinessException;
import kr.co.kfs.asseterp.common.error.ErrorCode;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.IOException;
import java.util.List;

/**
 * #1131 이익제공 입력(법인카드) 상신 연결 (원본 2026-11-06 c0b1e1146, CH-0011·0085·0216).
 * 원본: 결재창 저장 때 `ExcelCreate.createCardExcel2`(고른 내역, 파일 이름 = 문서 제목)를 붙이고(Apr01_Edit_ApprDoc A41),
 * 저장 콜백에서 `biz.Biz01_Promo.updateByApprId`(고른 내역에 문서 ID). TOBE는 문서 ID가 정해지는 이 한 번에 둘 다 한다.
 * 옛 방식(그 달 Biz05_RelateAppr.insertPersonId + 기간 엑셀)은 원본에서 #1131이 더 쓰지 않는다.
 */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class BizCardApprService {

    private final BizPromoMapper mapper;
    private final BizCardExcelService cardExcelService;

    /** @return 문서 ID를 넣은 내역 수 */
    @Transactional
    public int linkAppr(UserPrincipal user, Long apprId, List<Long> promoIds, String titleName) throws IOException {
        if (apprId == null || promoIds == null || promoIds.isEmpty()) {
            throw new BusinessException(ErrorCode.INVALID_INPUT, "선택된 항목이 존재하지 않습니다.");
        }
        cardExcelService.createCardExcel(user, apprId, promoIds, titleName);
        return mapper.updateApprId(user.getCompanyId(), apprId, promoIds);
    }
}
