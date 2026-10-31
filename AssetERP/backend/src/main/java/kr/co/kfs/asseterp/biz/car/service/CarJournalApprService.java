package kr.co.kfs.asseterp.biz.car.service;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.car.mapper.CarJournalApprMapper;
import kr.co.kfs.asseterp.common.error.BusinessException;
import kr.co.kfs.asseterp.common.error.ErrorCode;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * 차량 운행일지 결재 상신 A16 (V35) — Car04_Tab_Journal.insertApprCheck L602-650 / updateApprId L674-687.
 * 상신 행(car05_relate_appr)을 먼저 만들고 PDF를 그 행의 첨부로 올린 뒤, 결재창을 연다. 결재문서가 정해지면 그 번호를 기록하고 PDF를 문서에 붙인다.
 */
@Slf4j
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class CarJournalApprService {

    private final CarJournalApprMapper mapper;
    private final CarJournalPdfService pdfService;

    /**
     * AS-IS car.Car05_RelateAppr.insert + utils.pdf.PDFCreate.createCarJournal. PDF를 못 만들어도 상신은 이어진다(AS-IS는 예외를 로그만 남긴다).
     * @return 상신 행 번호(결재창의 refId)
     */
    @Transactional
    public Long createRelateAppr(UserPrincipal user, Long infoId, String stdMonth) {
        if (infoId == null || stdMonth == null || stdMonth.isBlank()) {
            throw new BusinessException(ErrorCode.INVALID_INPUT, "차량과 기준년월이 필요합니다.");
        }
        Long relateApprId = mapper.selectNextId();
        mapper.insertRelateAppr(relateApprId, user.getCompanyId(), stdMonth, infoId);
        try {
            pdfService.createCarJournal(user, relateApprId, infoId, stdMonth);
        } catch (Exception e) {
            log.warn("차량 운행일지 PDF 만들기 실패 relateApprId={}", relateApprId, e);
        }
        return relateApprId;
    }

    /** AS-IS car.Car05_RelateAppr.updateApprId + 문서 저장 때의 첨부 자동등록 createFileLine(relateApprId) */
    @Transactional
    public void updateApprId(UserPrincipal user, Long relateApprId, Long apprId) {
        if (mapper.updateApprId(relateApprId, user.getCompanyId(), apprId) == 0) {
            throw new BusinessException(ErrorCode.DATA_NOT_FOUND);
        }
        for (Long fileId : mapper.selectFileIds(relateApprId)) {
            if (mapper.countApprRelateFile(fileId, apprId) == 0) {
                mapper.insertApprRelateFile(mapper.selectNextId(), fileId, apprId);
            }
        }
    }
}
