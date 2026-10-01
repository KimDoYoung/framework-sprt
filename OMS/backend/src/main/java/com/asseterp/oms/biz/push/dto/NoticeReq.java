package com.asseterp.oms.biz.push.dto;

import com.asseterp.oms.common.websocket.dto.WsLevel;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

/**
 * 전체 공지 발송 요청
 *
 * @param level 중요도 (없으면 INFO)
 */
public record NoticeReq(
        @NotBlank @Size(max = 100) String title,
        @NotBlank @Size(max = 1000) String message,
        WsLevel level
) {
}
