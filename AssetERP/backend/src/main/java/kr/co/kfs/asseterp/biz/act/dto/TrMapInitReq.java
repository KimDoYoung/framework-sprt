package kr.co.kfs.asseterp.biz.act.dto;

import java.util.List;

/** 기초데이터생성: 고른 고객사마다 고른 (거래코드, 분개그룹)을 관리자 회사(0)에서 복사 */
public record TrMapInitReq(List<Long> companyIds, List<Item> items) {
    public record Item(String trCode, String journalGroup) {
    }
}
