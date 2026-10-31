package kr.co.kfs.asseterp.biz.apr.dto;

import java.util.List;

/** 결재완료후 첨부파일의 [저장] — 인감날인본 체크 (AS-IS Sys10_File.update) */
public record AprAfterFileStampReq(List<Item> items) {
    public record Item(Long fileId, boolean stampYn) {
    }
}
