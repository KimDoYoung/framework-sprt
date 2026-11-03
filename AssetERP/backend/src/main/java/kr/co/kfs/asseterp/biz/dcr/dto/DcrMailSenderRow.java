package kr.co.kfs.asseterp.biz.dcr.dto;

/** 보내는 사원(본인 메일) — 발송 계정·서명에 쓰는 값 (AS-IS emp00_trans_info.getPersonInfo 마지막 행 + emp01_person) */
public record DcrMailSenderRow(
        Long personId,
        Long companyId,
        String korNm,
        String emailAddr,
        String decPassword,
        String officeTelno,
        String mobileTelno,
        String parentFullNm,
        String posNm
) {
}
