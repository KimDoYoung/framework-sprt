package kr.co.kfs.asseterp.oms.biz.sys.dto;

import java.math.BigDecimal;
import java.time.LocalDate;

/** 미사용 파일 (AS-IS sys10_file.findTrashFile → DB 함수 find_orphan_sys10_files) */
public record TrashFileRes(Long fileId, Long parentId, LocalDate regDate, String fileNm, String serverPath, BigDecimal size) {
}
