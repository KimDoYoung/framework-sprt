package kr.co.kfs.asseterp.biz.bbs.dto;

import java.time.LocalDate;

/** 게시판 한 건 (AS-IS Bbs01_BoardModel 중 등록·수정 창이 다루는 값). writeUserName은 "이름 직위" */
public record BbsBoardRes(Long boardId, String typeCode, String typeName, String title, String content, Long writeUserId, String writeUserName,
                          LocalDate writeDate) {
}
