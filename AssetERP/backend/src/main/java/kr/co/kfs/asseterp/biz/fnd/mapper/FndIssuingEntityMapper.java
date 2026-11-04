package kr.co.kfs.asseterp.biz.fnd.mapper;

import kr.co.kfs.asseterp.biz.fnd.dto.IssuingEntityRes;
import kr.co.kfs.asseterp.biz.fnd.dto.IssuingEntityRow;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface FndIssuingEntityMapper {

    /** AS-IS fnd07_issuing_entity.selectByCodeName (이름 LIKE) */
    List<IssuingEntityRes> selectByCodeName(@Param("issuingEntityName") String issuingEntityName);

    /** AS-IS dbConfig.getSeq */
    long selectNextId();

    /** AS-IS fnd07_issuing_entity.insertUpdate */
    int insertUpdate(@Param("row") IssuingEntityRow row);

    /** AS-IS UpdateDataModel DELETE (로그인 회사 행만) */
    /** AS-IS fnd07_issuing_entity.selectBysearchText (EE91 Fnd07_Lookup_IssuingEntity) — 코드+이름에 "%검색어%" */
    List<IssuingEntityRes> selectBySearchText(@Param("searchText") String searchText);

    int deleteIssuingEntities(@Param("companyId") Long companyId, @Param("ids") List<Long> ids);
}
