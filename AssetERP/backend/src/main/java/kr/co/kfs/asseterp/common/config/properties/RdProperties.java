package kr.co.kfs.asseterp.common.config.properties;

import org.springframework.boot.context.properties.ConfigurationProperties;

/**
 * RD(Crownix Reporting Server) 설정 (asseterp.rd.*) — AS-IS는 RDUtil.getPageName()에 하드코딩
 *
 * @param url      RD 서버 주소(브라우저가 직접 접속). 개발은 tools/rd-simulator
 * @param dbName   RD 서버가 접속할 DB 설정 이름 (post_real / post_dev-devdb / post_dev-realdb)
 * @param dns      RD 호출의 dns 파라미터 (AS-IS 전 호출처가 admin)
 * @param saveDir  서버 저장 호출에서 RD 서버가 파일을 쓰는 경로(RD 서버 기준 절대경로)
 * @param localDir 같은 파일을 ERP가 읽는 경로 (운영은 saveDir과 같은 디스크, 개발은 시뮬레이터 루트 + saveDir)
 */
@ConfigurationProperties(prefix = "asseterp.rd")
public record RdProperties(
        String url,
        String dbName,
        String dns,
        String saveDir,
        String localDir
) {
}
