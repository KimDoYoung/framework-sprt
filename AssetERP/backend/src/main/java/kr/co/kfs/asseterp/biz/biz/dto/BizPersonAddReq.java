package kr.co.kfs.asseterp.biz.biz.dto;

import java.util.List;

/** Biz02_Grid_InternalList [등록] — 고른 직원마다 한 행 (AS-IS biz.Biz02_Person.modelUpdate) */
public record BizPersonAddReq(Long promoId, List<Long> empIds) {
}
