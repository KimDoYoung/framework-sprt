package kr.co.kfs.asseterp.biz.icam.service;

import kr.co.kfs.asseterp.biz.icam.dto.IcamTestBatchReq;
import kr.co.kfs.asseterp.common.error.BusinessException;
import kr.co.kfs.asseterp.common.error.ErrorCode;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import java.time.LocalDate;

/** 외부 ICAM DB를 읽지 않는 기본 구현 — 아무것도 쓰지 않고, 가져오지 않았다고 알린다 */
@Slf4j
@Component
public class DisabledIcamBatchRunner implements IcamBatchRunner {

    @Override
    public void run(String actionCode, String companyId, String worker) {
        log.warn("ICAM 배치 연동이 없어 실행하지 않음: actionCode={}, companyId={}, worker={}", actionCode, companyId, worker);
        throw new BusinessException(ErrorCode.INVALID_INPUT, "ICAM 연동(외부 ICAM DB)이 아직 없어 펀드정보를 가져오지 않았습니다");
    }

    @Override
    public void runFee(String actionCode, String companyId, String worker, LocalDate startDate, LocalDate closeDate) {
        log.warn("ICAM 배치 연동이 없어 실행하지 않음: actionCode={}, companyId={}, worker={}, {}~{}", actionCode, companyId, worker, startDate, closeDate);
        throw new BusinessException(ErrorCode.INVALID_INPUT, "ICAM 연동(외부 ICAM DB)이 아직 없어 발생보수를 가져오지 않았습니다");
    }

    @Override
    public void runSource(String worker) {
        log.warn("ICAM 배치 연동이 없어 실행하지 않음: DB소스 가져오기, worker={}", worker);
        throw new BusinessException(ErrorCode.INVALID_INPUT, "ICAM 연동(외부 ICAM DB)이 아직 없어 DB소스를 가져오지 않았습니다");
    }

    @Override
    public void runTest(String actionCode, String companyId, String worker, IcamTestBatchReq req) {
        log.warn("배치 연동(BatchMain)이 없어 실행하지 않음: actionCode={}, companyId={}, worker={}, req={}", actionCode, companyId, worker, req);
        throw new BusinessException(ErrorCode.INVALID_INPUT, "배치 연동(BatchMain)이 아직 없어 작업을 실행하지 않았습니다");
    }
}
