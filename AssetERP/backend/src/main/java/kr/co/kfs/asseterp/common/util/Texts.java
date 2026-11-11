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

    /**
     * "전체/예/아니오" 콤보 값 — AS-IS 화면이 'true'·'false'·null(전체)로 넘기는 것(예: 제출여부 fixYn, 확인여부 confirmYn).
     * 'true'·'false'는 그대로, 빈 값·그 밖의 값은 null(조건 없음)
     */
    public static String trueFalseOrNull(String s) {
        return "true".equals(s) || "false".equals(s) ? s : null;
    }
}
