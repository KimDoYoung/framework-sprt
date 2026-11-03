package kr.co.kfs.asseterp.biz.scm.dto;

import java.util.List;

/** Scm11_Lookup_DevStep.update — 삭제할 줄 + 그리드 전체 줄(순서 번호 포함). 원본은 두 호출이지만 한 트랜잭션으로 */
public record DevStepListReq(List<Long> deleteIds, List<DevStepSaveReq> steps) {
}
