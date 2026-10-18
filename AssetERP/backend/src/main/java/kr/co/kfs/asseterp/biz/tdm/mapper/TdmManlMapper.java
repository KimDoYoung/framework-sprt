package kr.co.kfs.asseterp.biz.tdm.mapper;

import kr.co.kfs.asseterp.biz.tdm.dto.ManlItemRes;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface TdmManlMapper {

    /** AS-IS tdm43_manl.selectByManlOrgId — useYn은 '%'(전체)·'true'(사용)·'false'(미사용), searchText는 LIKE 패턴 */
    List<ManlItemRes> selectByManlOrgId(@Param("manlOrgId") Long manlOrgId, @Param("useYn") String useYn, @Param("searchText") String searchText);

    /** 점검항목이 속한 부서 책무매뉴얼 (없으면 null) — 삭제 대상이 요청한 부서 것인지 확인용 */
    Long selectManlOrgIdByManlId(@Param("manlId") Long manlId);

    /** AS-IS tdm45_manl_relate_ics.deleteByManlId */
    int deleteRelateIcsByManlId(@Param("manlId") Long manlId);

    /** AS-IS tdm46_manl_relate_icr.deleteByManlId */
    int deleteRelateIcrByManlId(@Param("manlId") Long manlId);

    /** AS-IS tdm47_manl_relate_dcr.deleteByManlId */
    int deleteRelateDcrByManlId(@Param("manlId") Long manlId);

    /** AS-IS sys11_relate_file.deleteByParentId */
    int deleteRelateFileByParentId(@Param("parentId") Long parentId);

    /** AS-IS UpdateDataModel.deleteModel(tdm43_manl) */
    int deleteById(@Param("manlId") Long manlId);
}
