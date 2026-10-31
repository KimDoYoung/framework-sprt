package kr.co.kfs.asseterp.common.pdf;

/**
 * HTML → PDF 변환 자리. 만드는 쪽은 HTML(쪽 크기·여백은 CSS {@code @page})만 넘긴다.
 * 기본 구현은 OpenPDF + Flying Saucer({@link OpenPdfHtmlRenderer}). 나중에 Gotenberg(Chromium) 같은 외부 변환기로 바꿀 때는
 * 이 인터페이스를 구현한 빈 하나로 갈아 끼운다(만드는 쪽은 그대로).
 */
public interface HtmlPdfRenderer {

    /** @param html 완전한 HTML 문서 또는 본문 조각(조각이면 구현이 {@code <html>}로 감싼다). 느슨한 HTML도 받는다 */
    byte[] render(String html);
}
