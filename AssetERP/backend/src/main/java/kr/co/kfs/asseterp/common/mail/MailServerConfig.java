package kr.co.kfs.asseterp.common.mail;

import org.springframework.core.io.ClassPathResource;

import java.io.IOException;
import java.io.InputStream;
import java.util.Properties;

/** 회사별 메일서버 설정 읽기 (AS-IS utils.config.MailConfig — WEB-INF/classes/config/mail/{메일서버정보}). 같은 파일을 resources/config/mail/에 둔다 */
public final class MailServerConfig {

    private MailServerConfig() {
    }

    /** 설정 파일이 없으면 null. 메일서버정보는 파일 이름이라 경로 문자를 막는다 */
    public static Properties load(String mailInfo) {
        if (mailInfo == null || mailInfo.isBlank() || mailInfo.contains("/") || mailInfo.contains("\\") || mailInfo.contains("..")) {
            return null;
        }
        ClassPathResource resource = new ClassPathResource("config/mail/" + mailInfo);
        if (!resource.exists()) {
            return null;
        }
        Properties properties = new Properties();
        try (InputStream in = resource.getInputStream()) {
            properties.load(in);
        } catch (IOException e) {
            return null;
        }
        return properties;
    }
}
