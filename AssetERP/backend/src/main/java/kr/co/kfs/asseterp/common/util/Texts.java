package kr.co.kfs.asseterp.common.util;

/**
 * 서비스마다 복사돼 있던 글자 도우미 중 본문이 같은 것만 모았다(2026-11-06 정적분석 C).
 * 빈 글자를 다르게 다루는 변형(예: 빈 글자면 "%" 하나, 또는 null)은 화면마다 동작이 달라 옮기지 않았다.
 */
public final class Texts {

    private Texts() {
    }

    /** LIKE '%…%' 검색어: null 은 "" 로 보아 "%%"(전체) */
    public static String like(String text) {
        return "%" + (text == null ? "" : text) + "%";
    }

    /** null 이면 "" */
    public static String nvl(String s) {
        return s == null ? "" : s;
    }
}
