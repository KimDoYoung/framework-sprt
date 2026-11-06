package kr.co.kfs.asseterp.common.util;

/**
 * 서버에서 HTML 을 문자열로 만들 때(결재 링크 본문 등) DB 값을 끼워 넣기 전에 쓰는 escape.
 * <p>
 * 글자 값만 escape 한다. 편집기(HtmlEditor)로 쓴 본문처럼 원래 HTML 인 값에는 쓰지 않는다.
 * Spring HtmlUtils 는 U+00A0 같은 글자도 &amp;nbsp; 같은 이름 엔티티로 바꾸는데, PDF 변환(XHTML)이
 * 이름 엔티티를 못 읽을 수 있어 꼭 필요한 다섯 글자만 바꾼다.
 */
public final class Html {

    private Html() {
    }

    /** {@code & < > " '} 를 엔티티로. null 은 null 그대로(호출부의 null 처리를 바꾸지 않는다) */
    public static String esc(String s) {
        if (s == null) {
            return null;
        }
        StringBuilder b = null;
        for (int i = 0; i < s.length(); i++) {
            char c = s.charAt(i);
            String r = switch (c) {
                case '&' -> "&amp;";
                case '<' -> "&lt;";
                case '>' -> "&gt;";
                case '"' -> "&quot;";
                case '\'' -> "&#39;";
                default -> null;
            };
            if (r != null) {
                if (b == null) {
                    b = new StringBuilder(s.length() + 16).append(s, 0, i);
                }
                b.append(r);
            } else if (b != null) {
                b.append(c);
            }
        }
        return b == null ? s : b.toString();
    }
}
