package kr.co.kfs.asseterp.biz.dbm.mapper;

import kr.co.kfs.asseterp.biz.dbm.dto.DbColumnParam;
import kr.co.kfs.asseterp.biz.dbm.dto.DbColumnRes;
import kr.co.kfs.asseterp.biz.dbm.dto.DbTableParam;
import kr.co.kfs.asseterp.biz.dbm.dto.DbTableRes;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

/** AS-IS server/dbm/mapper/dbm01_tab_comments.xml, dbm02_col_comments.xml (조회만 — 저장·소스 생성은 DB 프로시저가 없어 옮기지 않음) */
@Mapper
public interface DbmTableMapper {
    /** AS-IS dbm01_tab_comments.selectByTableName */
    List<DbTableRes> selectTables(DbTableParam param);

    /** AS-IS dbm02_col_comments.selectByTableName */
    List<DbColumnRes> selectColumns(DbColumnParam param);
}
