package kr.co.kfs.asseterp.biz.ast.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;

import java.util.List;

public record EvalProcessReq(@NotEmpty @Valid List<EvalItemReq> items) {
}
