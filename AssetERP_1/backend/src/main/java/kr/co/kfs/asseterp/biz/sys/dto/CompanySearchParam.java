package kr.co.kfs.asseterp.biz.sys.dto;

/** AS-IS selectByName 파라미터: companyName은 '%입력값%'(없으면 '%'), useYn은 'true'(사용고객만) / 'false'(전체) */
public record CompanySearchParam(String companyName, String useYn) {
}
