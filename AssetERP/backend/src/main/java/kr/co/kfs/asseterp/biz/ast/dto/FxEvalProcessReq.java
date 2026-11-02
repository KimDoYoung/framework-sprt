package kr.co.kfs.asseterp.biz.ast.dto;

import java.util.List;

/** AS-IS Ast06_Tr.updateFxEval request.setList — 선택한 행 */
public record FxEvalProcessReq(List<FxEvalItemReq> items) {
}
