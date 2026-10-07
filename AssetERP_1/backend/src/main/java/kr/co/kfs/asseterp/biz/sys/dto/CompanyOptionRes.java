package kr.co.kfs.asseterp.biz.sys.dto;

/** 회사 콤보 항목 (AS-IS sys00_common.selectCompanyInfo: code = 회사 ID 문자열, name = 서브도메인) */
public record CompanyOptionRes(String code, String name) {
}
