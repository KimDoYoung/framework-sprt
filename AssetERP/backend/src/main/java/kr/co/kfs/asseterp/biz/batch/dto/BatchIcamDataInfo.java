package kr.co.kfs.asseterp.biz.batch.dto;

/** icam01_data_info 한 건 (AS-IS Icam01_DataInfoModel) — ICAM 연계 정보코드 */
public record BatchIcamDataInfo(
        String infoCode,
        String infoName,
        String trCode,
        String trName,
        Long icsClassTreeId,
        String note
) {
}
