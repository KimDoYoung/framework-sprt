package kr.co.kfs.asseterp.biz.emp.dto;

import java.util.List;

/** [임원 선임/해임 보고] 출력 조건. personIds는 선임/해임 보고 대상(그리드에서 체크한 사원) — 전체 현황(Director02)은 쓰지 않는다 */
public record DirectorPrintReq(String searchText, List<Long> personIds) {
}
