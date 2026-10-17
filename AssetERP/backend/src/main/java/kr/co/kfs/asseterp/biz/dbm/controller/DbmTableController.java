package kr.co.kfs.asseterp.biz.dbm.controller;

import kr.co.kfs.asseterp.biz.dbm.dto.ColumnCommentSaveReq;
import kr.co.kfs.asseterp.biz.dbm.dto.DbColumnRes;
import kr.co.kfs.asseterp.biz.dbm.dto.DbTableRes;
import kr.co.kfs.asseterp.biz.dbm.dto.TableCommentSaveReq;
import kr.co.kfs.asseterp.biz.dbm.service.DbmTableService;
import kr.co.kfs.asseterp.common.dto.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/** Table Spec,(Model)Properties (AS-IS Dbm01_Tab_TabComments) — 메뉴 #1081 */
@RestController
@RequestMapping("/api/v1/dbm/tables")
@RequiredArgsConstructor
public class DbmTableController {

    private final DbmTableService service;

    /** AS-IS dbm.Dbm01_TabComments.selectByTableName (이름 일부, 대소문자 무시) */
    @GetMapping
    public ApiResponse<List<DbTableRes>> search(@RequestParam(required = false) String searchText) {
        return ApiResponse.ok(service.searchTables(searchText));
    }

    /** AS-IS dbm.Dbm02_ColComments.selectByTableName */
    @GetMapping("/{tableName}/columns")
    public ApiResponse<List<DbColumnRes>> searchColumns(@PathVariable String tableName) {
        return ApiResponse.ok(service.searchColumns(tableName));
    }

    /** AS-IS dbm.Dbm01_TabComments.update — DB 프로시저가 없어 거절 */
    @PutMapping("/comments")
    public ApiResponse<Void> updateTableComments(@RequestBody List<TableCommentSaveReq> rows) {
        service.updateTableComments(rows);
        return ApiResponse.ok(null);
    }

    /** AS-IS dbm.Dbm02_ColComments.update — DB 프로시저가 없어 거절 */
    @PutMapping("/columns/comments")
    public ApiResponse<Void> updateColumnComments(@RequestBody List<ColumnCommentSaveReq> rows) {
        service.updateColumnComments(rows);
        return ApiResponse.ok(null);
    }

    /** AS-IS dbm.Dbm03_TabColumns.selectByXML|Model|Properties|GridBuilder — kind = xml·model·properties·grid-builder, DB 프로시저가 없어 거절 */
    @GetMapping("/{tableName}/sources/{kind}")
    public ApiResponse<String> generateSource(@PathVariable String tableName, @PathVariable String kind) {
        return ApiResponse.ok(service.generateSource(tableName, kind));
    }
}
