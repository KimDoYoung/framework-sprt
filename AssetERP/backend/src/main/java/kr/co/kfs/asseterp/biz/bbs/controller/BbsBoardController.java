package kr.co.kfs.asseterp.biz.bbs.controller;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.bbs.dto.BbsBoardRes;
import kr.co.kfs.asseterp.biz.bbs.dto.BbsBoardSaveReq;
import kr.co.kfs.asseterp.biz.bbs.service.BbsBoardService;
import kr.co.kfs.asseterp.common.dto.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/** 게시판 등록·수정 창 (AS-IS Bbs01_Lookup_BoardInsert·BoardUpdate → server/bbs/Bbs01_Board) */
@RestController
@RequestMapping("/api/v1/bbs/boards")
@RequiredArgsConstructor
public class BbsBoardController {

    private final BbsBoardService service;

    /** AS-IS bbs.Bbs01_Board.selectByCompanyId — 자유게시판 목록 (Bbs01_Tab_Board·Bbs01_Tab_BoardManager) */
    @GetMapping
    public ApiResponse<List<BbsBoardRes>> search(@AuthenticationPrincipal UserPrincipal principal,
                                                 @RequestParam(required = false) String typeCode,
                                                 @RequestParam(required = false) String title) {
        return ApiResponse.ok(service.search(principal, typeCode, title));
    }

    /** 수정 창이 열 때 읽는 글 한 건 */
    @GetMapping("/{boardId}")
    public ApiResponse<BbsBoardRes> get(@AuthenticationPrincipal UserPrincipal principal, @PathVariable Long boardId) {
        return ApiResponse.ok(service.get(principal, boardId));
    }

    /** AS-IS DBUtil.setSeq — 새 글 번호 */
    @PostMapping("/next-id")
    public ApiResponse<Long> nextId() {
        return ApiResponse.ok(service.nextId());
    }

    /** AS-IS bbs.Bbs01_Board.update */
    @PutMapping
    public ApiResponse<Void> save(@AuthenticationPrincipal UserPrincipal principal, @RequestBody BbsBoardSaveReq req) {
        service.save(principal, req);
        return ApiResponse.ok(null);
    }

    /** AS-IS bbs.Bbs01_Board.delete */
    @DeleteMapping
    public ApiResponse<Integer> delete(@AuthenticationPrincipal UserPrincipal principal, @RequestBody List<Long> ids) {
        return ApiResponse.ok(service.delete(principal, ids));
    }
}
