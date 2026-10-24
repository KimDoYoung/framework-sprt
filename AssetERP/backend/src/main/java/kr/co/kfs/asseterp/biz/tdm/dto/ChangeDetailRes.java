package kr.co.kfs.asseterp.biz.tdm.dto;

/** 변경/삭제 이력 상세 한 행 (AS-IS tdm96_change_detail.selectByChangeHistoryId → Tdm96_ChangeDetailModel) */
public record ChangeDetailRes(
        Long changeDetailId,
        String windowItemName,
        String beforeData,
        String afterData
) {
}
