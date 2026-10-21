package kr.co.kfs.asseterp.biz.flt.dto;

import java.util.List;

/** 미체결 처리(unfill true)·취소(false) — AS-IS Flt10_Tr.updateUnFill actionType P/C */
public record TrUnfillReq(List<Long> trIds, Boolean unfill) {
}
