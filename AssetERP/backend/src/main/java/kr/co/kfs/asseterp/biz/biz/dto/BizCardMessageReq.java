package kr.co.kfs.asseterp.biz.biz.dto;

import java.util.List;

/** [마감문자발송] (AS-IS Biz01_Promo.sendMessage) — personIds는 목록에서 고른 사용자(코드 = 사원 ID) */
public record BizCardMessageReq(String dataYm, List<Long> personIds) {
}
