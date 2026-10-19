package kr.co.kfs.asseterp.biz.ast.dto;

import java.util.List;

/** 기초데이터생성: 고른 고객사들에 관리자 회사(0)의 고른 거래코드를 복사 */
public record TrCodeInitReq(List<Long> companyIds, List<String> trCodes) {
}
