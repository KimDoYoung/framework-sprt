package kr.co.kfs.asseterp.biz.emp.dto;

import java.util.List;

/** AS-IS Emp43_EvalTarget.update / updateList — deleteWrites가 true면 updateList(바뀐 평가자의 작성 내역 삭제) */
public record EvalTargetSaveReq(List<EvalTargetRow> rows, boolean deleteWrites) {
}
