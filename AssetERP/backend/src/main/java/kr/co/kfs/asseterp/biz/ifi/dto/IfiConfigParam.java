package kr.co.kfs.asseterp.biz.ifi.dto;

/** selectByIfType 조건. ifType은 LIKE 값('%'면 전체), searchText는 '%'를 붙인 값 */
public record IfiConfigParam(String ifType, String searchText) {
}
