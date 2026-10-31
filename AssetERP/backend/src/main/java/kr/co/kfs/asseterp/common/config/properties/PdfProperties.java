package kr.co.kfs.asseterp.common.config.properties;

import java.util.Map;

import org.springframework.boot.context.properties.ConfigurationProperties;

/**
 * PDF 생성 설정 (asseterp.pdf.*)
 *
 * @param fontFile  한글 글꼴 파일 경로(AS-IS IdmsConfig fontPath + NotoSansKR-Regular.ttf). HTML의 font-family "NotoCustom"으로 쓴다
 * @param docPrefix 회사 지역(sys01_loc_nm)별 문서 파일명 접두사 (AS-IS IdmsConfig "{지역}.docprefix", 예: kfs → KFS)
 */
@ConfigurationProperties(prefix = "asseterp.pdf")
public record PdfProperties(String fontFile, Map<String, String> docPrefix) {

    /** 접두사가 없으면 빈 글자 */
    public String prefixOf(String locName) {
        return docPrefix == null || locName == null ? "" : docPrefix.getOrDefault(locName, "");
    }
}
