package kr.co.kfs.asseterp.biz.emp.dto;

import java.util.List;

/** 공유지정 저장 (AS-IS Emp56_Share.delete → update 순서) */
public record ShareSaveReq(List<Long> deleteIds, List<ShareAddReq> adds) {
}
