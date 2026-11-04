package kr.co.kfs.asseterp.biz.bbs.dto;

import java.time.LocalDate;

/** 게시판 저장 (AS-IS bbs.Bbs01_Board.update — UpdateDataModel). boardId는 창을 열 때 받은 번호(새 글도 먼저 받는다) */
public record BbsBoardSaveReq(Long boardId, String typeCode, String title, String content, LocalDate writeDate) {
}
