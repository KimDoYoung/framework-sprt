package kr.co.kfs.asseterp.biz.dcr.mapper;

import kr.co.kfs.asseterp.biz.dcr.dto.DcrRelateIcsRes;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

/** AS-IS server/dcr/mapper/dcr20_relate_ics.xml + UpdateDataModel(dcr20_relate_ics) — 문서구분에 연결된 법규 */
@Mapper
public interface DcrRelateIcsMapper {
    /** AS-IS selectByDcrClassTreeId (법규 열 + 기한 요약). 순서가 없는 SQL이라 ID 순으로 고정 */
    List<DcrRelateIcsRes> selectByDcrClassTreeId(@Param("dcrClassTreeId") Long dcrClassTreeId);

    DcrRelateIcsRes selectById(@Param("relateIcsId") Long relateIcsId);

    Long selectNextId();

    /** 새 연결 한 건: AS-IS UpdateDataModel INSERT, AS-IS insertAll(다른 회사 복사)도 같은 문장 */
    int insert(@Param("relateIcsId") Long relateIcsId, @Param("dcrClassTreeId") Long dcrClassTreeId,
               @Param("icsClassTreeId") Long icsClassTreeId, @Param("companyId") Long companyId, @Param("note") String note);

    /** AS-IS deleteAll: 다른 회사의 같은 연결 */
    int deleteAll(@Param("dcrClassTreeId") Long dcrClassTreeId, @Param("icsClassTreeId") Long icsClassTreeId, @Param("companyId") Long companyId);

    /** UpdateDataModel.deleteModel (ID로) */
    int deleteByIds(@Param("companyId") Long companyId, @Param("ids") List<Long> ids);

    /** 지울 연결의 문서분류·법규 (deleteAll 전파에 쓴다) */
    List<DcrRelateIcsRes> selectByIds(@Param("companyId") Long companyId, @Param("ids") List<Long> ids);
}
