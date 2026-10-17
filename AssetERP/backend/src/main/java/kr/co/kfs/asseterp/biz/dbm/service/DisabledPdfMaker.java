package kr.co.kfs.asseterp.biz.dbm.service;

import kr.co.kfs.asseterp.common.error.BusinessException;
import kr.co.kfs.asseterp.common.error.ErrorCode;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

/** PDF를 만들지 않는 기본 구현 — 파일·DB에 아무것도 쓰지 않고, 만들지 않았다고 알린다 */
@Slf4j
@Component
public class DisabledPdfMaker implements PdfMaker {

    @Override
    public void make(Long companyId, Long apprId) {
        log.warn("PDF 생성 연동이 없어 만들지 않음: companyId={}, apprId={}", companyId, apprId);
        throw new BusinessException(ErrorCode.INVALID_INPUT, "PDF 생성 연동(전자결재 인장 PDF)이 아직 없어 PDF를 만들지 않았습니다");
    }
}
