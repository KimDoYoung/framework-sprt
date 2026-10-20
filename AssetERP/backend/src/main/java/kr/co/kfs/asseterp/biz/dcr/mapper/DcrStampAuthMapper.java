package kr.co.kfs.asseterp.biz.dcr.mapper;

import kr.co.kfs.asseterp.biz.dcr.dto.DcrStampAuthTreeRes;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

/** AS-IS server/dcr/mapper/dcr40_stamp_auth.xml, dcr01_class_tree.selectByAllWithStampAuth */
@Mapper
public interface DcrStampAuthMapper {
    /** AS-IS dcr01_class_tree.selectByAllWithStampAuth (G07) — 루트(상위 0)부터 문서구분(T)·문서분류(C) 전체 */
    List<DcrStampAuthTreeRes> selectTree(@Param("companyId") Long companyId, @Param("stampId") Long stampId);

    /** 인감이 로그인 회사 것인가 (보안 보강) */
    int countStamp(@Param("companyId") Long companyId, @Param("stampId") Long stampId);

    /** AS-IS dbConfig.getSeq */
    long selectNextId();

    /** AS-IS Dcr40_StampAuth.updateList → UpdateDataModel UPDATE (이미 행이 있을 때) */
    int updateExcept(@Param("stampId") Long stampId, @Param("classTreeId") Long classTreeId, @Param("exceptYn") String exceptYn);

    /** AS-IS Dcr40_StampAuth.updateList → UpdateDataModel INSERT (행이 없을 때) */
    int insertExcept(@Param("stampAuthId") Long stampAuthId, @Param("stampId") Long stampId, @Param("classTreeId") Long classTreeId, @Param("exceptYn") String exceptYn);
}
