package kr.co.kfs.asseterp.biz.dcr.mapper;

import kr.co.kfs.asseterp.biz.dcr.dto.DcrRelateIcrRes;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

/** AS-IS server/dcr/mapper/dcr21_relate_icr.xml + UpdateDataModel(dcr21_relate_icr) — 문서구분에 연결된 내규 */
@Mapper
public interface DcrRelateIcrMapper {
    /** AS-IS selectByDcrClassTreeId (내규 열 + 기한 요약). 순서가 없는 SQL이라 ID 순으로 고정 */
    List<DcrRelateIcrRes> selectByDcrClassTreeId(@Param("dcrClassTreeId") Long dcrClassTreeId);

    DcrRelateIcrRes selectById(@Param("relateIcrId") Long relateIcrId);

    Long selectNextId();

    int insert(@Param("relateIcrId") Long relateIcrId, @Param("dcrClassTreeId") Long dcrClassTreeId,
               @Param("icrClassTreeId") Long icrClassTreeId, @Param("companyId") Long companyId, @Param("note") String note);

    /** AS-IS deleteAll: 다른 회사의 같은 연결 */
    int deleteAll(@Param("dcrClassTreeId") Long dcrClassTreeId, @Param("icrClassTreeId") Long icrClassTreeId, @Param("companyId") Long companyId);

    int deleteByIds(@Param("companyId") Long companyId, @Param("ids") List<Long> ids);

    List<DcrRelateIcrRes> selectByIds(@Param("companyId") Long companyId, @Param("ids") List<Long> ids);
}
