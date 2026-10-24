package kr.co.kfs.asseterp.biz.tdm.dto;

import java.util.List;

/** 삭제 요청: 대상 ID와 삭제사유 (AS-IS historyMap.reason) */
public record TaskDeleteReq(
        List<Long> ids,
        String reason
) {
}
