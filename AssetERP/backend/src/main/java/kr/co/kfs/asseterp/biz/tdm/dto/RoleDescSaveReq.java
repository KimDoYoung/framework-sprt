package kr.co.kfs.asseterp.biz.tdm.dto;

import java.time.LocalDate;

/**
 * 책무기술서 저장 한 행 (AS-IS Tdm31_RoleDesc.update, UpdateDataModel).
 * roleDescId가 없거나 ≤ 0이면 INSERT(등록한 행), 아니면 생성일·생성사유만 UPDATE
 */
public record RoleDescSaveReq(
        Long roleDescId,
        LocalDate regDate,
        String reasonCode,
        Long personId,
        Long roleAllcId,
        LocalDate allcStdDate) {
}
