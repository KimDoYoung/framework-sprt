package kr.co.kfs.asseterp.biz.org.dto;

import java.time.LocalDate;

/**
 * 조직 저장 (AS-IS Org01_Code.update 요청 1건: Org01_CodeModel + orgInfoModel).
 * 등록(POST)은 codeId·infoId를 서버가 채번하고, 변경일·변경사유를 개설일·개설사유로 채운다.
 * baseDate는 저장 뒤 다시 읽을 기준일(AS-IS 파라미터 baseDate).
 */
public record OrgCodeSaveReq(
        Long codeId,
        String orgCd,
        LocalDate openDate,
        String openReason,
        LocalDate closeDate,
        String closeReason,
        Long infoId,
        String korNm,
        LocalDate modDate,
        String modReason,
        Long parentCodeId,
        String levelCd,
        String sortOrder,
        String note,
        String dcrIdWord,
        LocalDate baseDate
) {
    public OrgCodeSaveReq withIds(Long codeId, Long infoId) {
        return new OrgCodeSaveReq(codeId, orgCd, openDate, openReason, closeDate, closeReason, infoId, korNm, modDate, modReason,
                parentCodeId, levelCd, sortOrder, note, dcrIdWord, baseDate);
    }

    public OrgCodeSaveReq withMod(LocalDate modDate, String modReason) {
        return new OrgCodeSaveReq(codeId, orgCd, openDate, openReason, closeDate, closeReason, infoId, korNm, modDate, modReason,
                parentCodeId, levelCd, sortOrder, note, dcrIdWord, baseDate);
    }
}
