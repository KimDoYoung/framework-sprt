package kr.co.kfs.asseterp.oms.biz.sys.dto;

import java.time.LocalDate;

/** 공인IP 저장 행. loginSecureId가 없거나 0 이하면 신규 */
public record LoginSecureSaveReq(Long loginSecureId, Long companyId, LocalDate startDate, LocalDate closeDate, String publicIp, String note) {

    public boolean isNew() {
        return loginSecureId == null || loginSecureId <= 0;
    }

    public LoginSecureSaveReq withId(Long id) {
        return new LoginSecureSaveReq(id, companyId, startDate, closeDate, publicIp == null ? null : publicIp.trim(), note);
    }
}
