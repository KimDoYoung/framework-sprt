package kr.co.kfs.asseterp.biz.ast.dto;

import java.util.List;

/** 화면에 쓸 거래코드 저장: 왼쪽 그리드에 남은 거래코드(순서대로)와 비고 */
public record TrCodeWindowSaveReq(Long companyId, String className, List<Item> items) {
    public record Item(String trCode, String note) {
    }
}
