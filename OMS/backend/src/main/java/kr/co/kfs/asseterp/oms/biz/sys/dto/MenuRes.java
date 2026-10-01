package kr.co.kfs.asseterp.oms.biz.sys.dto;

import java.util.List;

/**
 * 로그인 사용자의 메뉴 트리 (1차 → 2차 그룹 → 3차 화면). frontend types/index.ts의 MenuLevel_1/2/3과 같은 모양
 */
public final class MenuRes {

    private MenuRes() {
    }

    /** 1차 메뉴 (LeftMenuBar 아이콘 메뉴) */
    public record Level1(String id, String title, List<Level2> groups) {
    }

    /** 2차 메뉴 (서브메뉴 그룹) */
    public record Level2(String groupCode, String groupTitle, List<Level3> items) {
    }

    /**
     * 3차 메뉴 (화면)
     *
     * @param code    sys06_menu_id
     * @param menuNo  sys06_menu_no (화면 번호)
     * @param classNm sys06_class_nm (AS-IS 화면 클래스, MenuOpener 키)
     */
    public record Level3(String code, String title, String menuNo, String classNm) {
    }
}
