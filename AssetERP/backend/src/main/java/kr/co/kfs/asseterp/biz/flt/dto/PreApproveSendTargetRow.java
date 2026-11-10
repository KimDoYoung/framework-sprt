package kr.co.kfs.asseterp.biz.flt.dto;

/** 알림 발송 대상 사원 한 명과 건수 (AS-IS flt10_tr.getSendMessageList — flt10_person_id · flt10_count) */
public record PreApproveSendTargetRow(Long personId, Integer count) {
}
