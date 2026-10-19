package kr.co.kfs.asseterp.biz.apr.dto;

import java.time.LocalDateTime;

public record AprItemDocRes(Long apprId, LocalDateTime regDate, LocalDateTime effectDate, String classTreeNameAllPath, String title,
                            String note, String fileName) {
}
