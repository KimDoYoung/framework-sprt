package kr.co.kfs.asseterp.biz.tdm.dto;

import java.time.LocalDate;

/**
 * 책무체계도 저장 한 행 (AS-IS Tdm32_RoleDigm.update, UpdateDataModel).
 * roleDigmId가 없거나 ≤ 0이면 INSERT(등록한 행), 아니면 UPDATE
 */
public record RoleDigmSaveReq(
        Long roleDigmId,
        LocalDate regDate,
        LocalDate allcStdDate,
        String reasonCode) {
}
