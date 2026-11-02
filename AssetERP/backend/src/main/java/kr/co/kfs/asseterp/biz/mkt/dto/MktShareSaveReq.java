package kr.co.kfs.asseterp.biz.mkt.dto;

import java.util.List;

/** AS-IS Mkt05_Share.delete + update — 지울 행과 바뀐(새) 행을 한 번에 */
public record MktShareSaveReq(Long parentId, List<MktShareRes> rows, List<Long> deleteIds) {
}
