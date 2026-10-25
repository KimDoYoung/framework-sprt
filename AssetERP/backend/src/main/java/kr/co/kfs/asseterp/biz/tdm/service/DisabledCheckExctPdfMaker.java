package kr.co.kfs.asseterp.biz.tdm.service;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Component;

/**
 * RD 서버 연동이 꺼진 기본 구현(asseterp.rd.pdf-enabled가 true가 아닐 때). 이행점검보고서 PDF를 만들 수 없으므로 RD 실패로 돌려준다 —
 * AS-IS도 RD 실패 때 잠금을 되돌리고 "파일 생성실패"로 끝낸다(lockRollBack).
 */
@Slf4j
@Component
@ConditionalOnProperty(name = "asseterp.rd.pdf-enabled", havingValue = "false", matchIfMissing = true)
public class DisabledCheckExctPdfMaker implements CheckExctPdfMaker {

    @Override
    public PdfOutcome make(Long chckExctId, Long companyId, UserPrincipal user) {
        log.warn("RD PDF 생성이 꺼져 있어 이행점검보고서를 만들지 않습니다 chckExctId={}", chckExctId);
        return PdfOutcome.RD_FAILED;
    }
}
