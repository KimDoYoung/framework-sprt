package kr.co.kfs.asseterp.oms.biz.sys.dto;

/**
 * @param searchText ILIKE 패턴
 * @param menuNameYn 'true'면 화면번호+메뉴명만, 아니면 전체경로·설명·화면번호에서 찾는다
 */
public record MenuCopySearchParam(String searchText, String menuNameYn) {
}
