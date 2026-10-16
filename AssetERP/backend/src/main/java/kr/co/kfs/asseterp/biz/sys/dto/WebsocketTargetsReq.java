package kr.co.kfs.asseterp.biz.sys.dto;

import java.util.List;

/** 강제 로그아웃 대상 사원 ID */
public record WebsocketTargetsReq(List<Long> personIds) {
}
