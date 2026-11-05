package kr.co.kfs.asseterp.common.config.properties;

import org.springframework.boot.context.properties.ConfigurationProperties;

/**
 * A-View 문서 미리보기 (asseterp.aview.*) — AS-IS JsonFileView_AView·fileViewer_AView.jsp
 *
 * @param homeUrl     A-View 서버 (AS-IS viewerHomePath, 예: https://aview.k-fs.co.kr:7171/aview). 미리보기 화면 = {homeUrl}/view?url=…&onm=…
 * @param fileBaseUrl A-View 서버가 이 서버의 임시 파일을 가져갈 주소 (AS-IS Sys10_Lookup_FileViewer L65-98 admin.k-fs.co.kr:{port}).
 *                    비우면 로컬 환경으로 보고 PDF·그림만 보여 준다 (AS-IS :8888 "로컬환경에서는 미리보기를 지원하지 않습니다")
 * @param tmpDir      미리보기용 임시 복사본 폴더 (AS-IS {contextPath}/tmp/)
 */
@ConfigurationProperties(prefix = "asseterp.aview")
public record AViewProperties(String homeUrl, String fileBaseUrl, String tmpDir) {
}
