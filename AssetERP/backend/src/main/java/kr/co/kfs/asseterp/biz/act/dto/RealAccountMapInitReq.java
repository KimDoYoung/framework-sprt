package kr.co.kfs.asseterp.biz.act.dto;

import java.util.List;

/** 기초데이터생성: 고른 고객사들 × 고른 (대표계정코드, 계정맵핑ID) */
public record RealAccountMapInitReq(List<Long> companyIds, List<Item> items) {

    public record Item(String reprAccountCode, String accountMap) {
    }
}
