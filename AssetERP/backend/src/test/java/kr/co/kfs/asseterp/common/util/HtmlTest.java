package kr.co.kfs.asseterp.common.util;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.junit.jupiter.api.Assertions.assertSame;

import org.junit.jupiter.api.Test;

class HtmlTest {

    @Test
    void escapesFiveCharacters() {
        assertEquals("A&amp;B &lt;b&gt; &quot;x&quot; &#39;y&#39;", Html.esc("A&B <b> \"x\" 'y'"));
    }

    @Test
    void keepsNullAndPlainTextAsIs() {
        assertNull(Html.esc(null));
        String plain = "홍길동 (주)한국 펀드";
        assertSame(plain, Html.esc(plain)); // 바꿀 글자가 없으면 같은 객체, U+00A0 은 그대로
    }

    @Test
    void doesNotTouchExistingEntitiesSpecially() {
        // 이미 엔티티처럼 보이는 글자도 글자로 본다(값을 DB 에 escape 해서 저장하지 않으므로)
        assertEquals("&amp;nbsp;", Html.esc("&nbsp;"));
    }
}
