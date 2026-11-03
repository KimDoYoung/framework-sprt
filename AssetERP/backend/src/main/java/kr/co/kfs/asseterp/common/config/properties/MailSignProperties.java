package kr.co.kfs.asseterp.common.config.properties;

import org.springframework.boot.context.properties.ConfigurationProperties;

import java.util.Map;

/**
 * 발송 메일 서명 설정 (asseterp.mail.sign.{회사위치}.*). AS-IS IdmsConfig의 {위치}.tel / .fax / .address / .mailSignImage 값.
 *
 * @param sign 회사 위치(sys01_loc_nm) → 서명 값. 로고 파일은 {asseterp.upload.dir}/{위치}/{image}
 */
@ConfigurationProperties(prefix = "asseterp.mail")
public record MailSignProperties(Map<String, Sign> sign) {

    public record Sign(String tel, String fax, String address, String image) {
    }

    public Sign of(String location) {
        Sign s = sign == null || location == null ? null : sign.get(location);
        return s != null ? s : new Sign("", "", "", "");
    }
}
