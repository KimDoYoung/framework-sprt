package kr.co.kfs.asseterp.biz.bbs.dto;

import jakarta.validation.constraints.NotBlank;

public record CommentSaveReq(@NotBlank String comment) {
}
