package kr.co.kfs.asseterp.biz.org.dto;

import java.time.LocalDateTime;

/** 조직 (AS-IS Org00_OrgInfoModel — 조직 조회창이 쓰는 값만) */
public record OrgInfoRes(
        Long orgCodeId,
        String orgCd,
        String korNm,
        String parentFullNm,
        String levelCd,
        String levelNm,
        LocalDateTime modDate
) {
}
