package kr.co.kfs.asseterp.biz.help.dto;

/**
 * 도움말 창 설정
 *
 * @param manualBaseUrl 화면 매뉴얼 주소 ({manualBaseUrl}/{화면 클래스}.html)
 * @param amanEnabled   A-Man 매뉴얼 연결을 쓸 수 있는지 (서명 키가 설정됨)
 */
public record HelpConfigRes(String manualBaseUrl, boolean amanEnabled) {
}
