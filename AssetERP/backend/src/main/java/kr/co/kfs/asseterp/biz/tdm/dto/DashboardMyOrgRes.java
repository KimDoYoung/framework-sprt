package kr.co.kfs.asseterp.biz.tdm.dto;

/** 로그인 사용자의 조직 (AS-IS LoginUser.getOrgCodeId() · getOrgInfoModel().getKorName()) — 부서별 탭 초기값 */
public record DashboardMyOrgRes(
        Long orgCodeId,
        String korName
) {
}
