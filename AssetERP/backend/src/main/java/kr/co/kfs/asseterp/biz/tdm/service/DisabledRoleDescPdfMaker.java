package kr.co.kfs.asseterp.biz.tdm.service;

import kr.co.kfs.asseterp.common.error.BusinessException;
import kr.co.kfs.asseterp.common.error.ErrorCode;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

/** PDF를 만들지 않는 기본 구현 — 파일·DB에 아무것도 쓰지 않고, 만들지 않았다고 알린다 */
@Slf4j
@Component
public class DisabledRoleDescPdfMaker implements RoleDescPdfMaker {

    @Override
    public void make(Long roleDescId, Long companyId) {
        log.warn("책무기술서 PDF 생성 연동이 없어 만들지 않음: roleDescId={}, companyId={}", roleDescId, companyId);
        throw new BusinessException(ErrorCode.INVALID_INPUT, "책무기술서 PDF 생성 연동(RD 리포트 Tdm31_Rd_DescRpt)이 아직 없어 파일을 만들지 않았습니다");
    }
}
