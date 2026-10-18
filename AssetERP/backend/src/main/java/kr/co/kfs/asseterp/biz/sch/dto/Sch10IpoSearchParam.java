package kr.co.kfs.asseterp.biz.sch.dto;

/** 공모주 일정 조회 조건 (selectBySearchTextAdmin). dateType 1~6(IpoScheduleDateType), 날짜는 yyyy-MM-dd */
public record Sch10IpoSearchParam(String dateType, String startDate, String closeDate, String searchText, String marketCode) {
}
