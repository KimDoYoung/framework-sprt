package kr.co.kfs.asseterp.biz.ics.dto;

import java.util.List;

/** 법규 관리그룹 지정 (AS-IS ics.Ics05_RelateManager.relateUpdate): 고른 법규들을 관리그룹 하나에 연결한다 */
public record IcsRelateManagerReq(Long managerId, List<Long> classTreeIds) {
}
