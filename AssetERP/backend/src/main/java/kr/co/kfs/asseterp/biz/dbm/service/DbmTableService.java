package kr.co.kfs.asseterp.biz.dbm.service;

import kr.co.kfs.asseterp.biz.dbm.dto.ColumnCommentSaveReq;
import kr.co.kfs.asseterp.biz.dbm.dto.DbColumnParam;
import kr.co.kfs.asseterp.biz.dbm.dto.DbColumnRes;
import kr.co.kfs.asseterp.biz.dbm.dto.DbTableParam;
import kr.co.kfs.asseterp.biz.dbm.dto.DbTableRes;
import kr.co.kfs.asseterp.biz.dbm.dto.TableCommentSaveReq;
import kr.co.kfs.asseterp.biz.dbm.mapper.DbmTableMapper;
import kr.co.kfs.asseterp.common.error.BusinessException;
import kr.co.kfs.asseterp.common.error.ErrorCode;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * AS-IS Dbm01_Tab_TabComments (server/dbm/Dbm01_TabComments, Dbm02_ColComments, Dbm03_TabColumns, Dbm00_DDLRun).
 * 조회 2개만 옮겼다. 주석 저장(sp_DDLRun)과 소스 생성(sp_JavaXML·sp_JavaModel·sp_JavaProperties·sp_JavaGridBuilder)은
 * asseterpdb에 그 프로시저가 없고(03 원칙 1) 본문도 원본 소스에 없어 거절한다 — 사용자 결정 2026-10-17
 */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class DbmTableService {

    private final DbmTableMapper mapper;

    /** AS-IS selectByTableName: 클라이언트가 "%" + 값 + "%"로 보냈다(Lookup은 값이 없으면 "%") → 서버가 만든다 */
    public List<DbTableRes> searchTables(String searchText) {
        return mapper.selectTables(new DbTableParam("%" + (searchText == null ? "" : searchText) + "%"));
    }

    /** AS-IS Dbm02_ColComments.selectByTableName */
    public List<DbColumnRes> searchColumns(String tableName) {
        return mapper.selectColumns(new DbColumnParam(tableName));
    }

    /** AS-IS Dbm01_TabComments.update: 'comment on table …' → sp_DDLRun */
    public void updateTableComments(List<TableCommentSaveReq> rows) {
        throw missing("테이블 주석 저장", "sp_DDLRun");
    }

    /** AS-IS Dbm02_ColComments.update: 'comment on column …' → sp_DDLRun */
    public void updateColumnComments(List<ColumnCommentSaveReq> rows) {
        throw missing("컬럼 주석 저장", "sp_DDLRun");
    }

    /** AS-IS Dbm03_TabColumns.selectByXML·selectByModel·selectByProperties·selectByGridBuilder → sp_Java* */
    public String generateSource(String tableName, String kind) {
        String procedure = switch (kind) {
            case "xml" -> "sp_JavaXML";
            case "model" -> "sp_JavaModel";
            case "properties" -> "sp_JavaProperties";
            case "grid-builder" -> "sp_JavaGridBuilder";
            default -> throw new BusinessException(ErrorCode.INVALID_INPUT, "알 수 없는 소스 종류입니다: " + kind);
        };
        throw missing("소스 생성(" + kind + ")", procedure);
    }

    private BusinessException missing(String what, String procedure) {
        return new BusinessException(ErrorCode.INVALID_INPUT, what + ": DB 프로시저 " + procedure + "가 asseterpdb에 없어 실행하지 않았습니다");
    }
}
