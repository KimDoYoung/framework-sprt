package kr.co.kfs.asseterp.biz.crd.dto;

import java.time.LocalDate;

/** crd.Crd03_Trans.update (Crd03_Grid_User 저장) — transId가 없거나 0 이하면 새 행. 카드는 경로의 cardId */
public record CrdCardUserSaveReq(
        Long transId,
        Long personId,
        LocalDate frDt,
        LocalDate toDt,
        String useYn,
        String publicYn
) {
}
