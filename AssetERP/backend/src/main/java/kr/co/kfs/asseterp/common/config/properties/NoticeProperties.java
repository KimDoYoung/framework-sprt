package kr.co.kfs.asseterp.common.config.properties;

import java.util.List;

import org.springframework.boot.context.properties.ConfigurationProperties;

/**
 * 알림 발송 설정 (asseterp.notice.*) — AS-IS는 SendTalkAPI·SendSMSAPI·SendMailMaster에 주소·키가 하드코딩, 회사별 발송 여부는 idms-*.properties의 {회사위치}.SMSok·Mailok
 *
 * @param mode           disabled(기본, 아무것도 보내지 않고 기록만) | sim(tools/notice-simulator로 보낸다). 실제 발송(real)은 아직 없다
 * @param talkUrl        앱알림 주소 (AS-IS https://talk.k-fs.co.kr:50443/talk/api/sendmsg)
 * @param talkApiKey     앱알림 x-api-key
 * @param smsUrl         SMS 주소 (AS-IS DirectSend https://directsend.co.kr/index.php/api_v2/sms_change_word)
 * @param smsUsername    DirectSend 아이디 (AS-IS LoginUser.getSmsId)
 * @param smsKey         DirectSend API 키 (AS-IS LoginUser.getSmsAPIKey)
 * @param smsSender      SMS 발신번호 (AS-IS 027858100)
 * @param mailHost       메일 서버 (AS-IS는 회사별 메일서버 설정 파일, 개발은 시뮬레이터 SMTP)
 * @param mailPort       메일 서버 포트
 * @param mailUsername   메일 계정 (AS-IS erp.sender@k-fs.co.kr)
 * @param mailPassword   메일 비밀번호 — 소스에 두지 않는다(AS-IS는 SendMailMaster에 하드코딩)
 * @param mailFrom       보내는 사람 주소
 * @param smsCompanies   SMS를 보내는 회사 위치(sys01_loc_nm) 목록 (AS-IS {위치}.SMSok=true)
 * @param mailCompanies  메일을 보내는 회사 위치 목록 (AS-IS {위치}.Mailok=true)
 */
@ConfigurationProperties(prefix = "asseterp.notice")
public record NoticeProperties(
        String mode,
        String talkUrl,
        String talkApiKey,
        String smsUrl,
        String smsUsername,
        String smsKey,
        String smsSender,
        String mailHost,
        Integer mailPort,
        String mailUsername,
        String mailPassword,
        String mailFrom,
        List<String> smsCompanies,
        List<String> mailCompanies
) {
    public boolean smsEnabled(String companyLoc) {
        return smsCompanies != null && companyLoc != null && smsCompanies.contains(companyLoc);
    }

    public boolean mailEnabled(String companyLoc) {
        return mailCompanies != null && companyLoc != null && mailCompanies.contains(companyLoc);
    }
}
