package kr.co.kfs.asseterp.biz.bbs.dto;

import java.util.List;

/** AS-IS Bbs20_FloralRequest.sendMessage(companyId, content, list) — 받는 사원 ID들 */
public record FloralMessageSendReq(String content, List<Long> personIds) {
}
