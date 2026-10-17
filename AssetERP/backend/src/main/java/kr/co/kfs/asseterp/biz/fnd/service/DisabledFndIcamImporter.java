package kr.co.kfs.asseterp.biz.fnd.service;

import kr.co.kfs.asseterp.common.error.BusinessException;
import kr.co.kfs.asseterp.common.error.ErrorCode;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

/** 외부 ICAM DB를 읽지 않는 기본 구현 — 아무것도 쓰지 않고, 가져오지 않았다고 알린다 */
@Slf4j
@Component
public class DisabledFndIcamImporter implements FndIcamImporter {

    @Override
    public void importConsignments(String companyId) {
        log.warn("ICAM 연동이 없어 수탁사를 가져오지 않음: companyId={}", companyId);
        throw new BusinessException(ErrorCode.INVALID_INPUT, "ICAM 연동(외부 ICAM DB)이 아직 없어 수탁사를 가져오지 않았습니다");
    }

    @Override
    public void importOfficeWorks(Long companyId) {
        log.warn("ICAM 연동이 없어 사무수탁사를 가져오지 않음: companyId={}", companyId);
        throw new BusinessException(ErrorCode.INVALID_INPUT, "ICAM 연동(외부 ICAM DB)이 아직 없어 사무수탁사를 가져오지 않았습니다");
    }

    @Override
    public void importTrustBanks(String companyId) {
        log.warn("ICAM 연동이 없어 수탁은행을 가져오지 않음: companyId={}", companyId);
        throw new BusinessException(ErrorCode.INVALID_INPUT, "ICAM 연동(외부 ICAM DB)이 아직 없어 수탁은행을 가져오지 않았습니다");
    }
}
