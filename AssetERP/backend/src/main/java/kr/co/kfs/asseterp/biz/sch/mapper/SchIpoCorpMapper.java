package kr.co.kfs.asseterp.biz.sch.mapper;

import kr.co.kfs.asseterp.biz.sch.dto.Sch12IpoCorpRes;
import kr.co.kfs.asseterp.biz.sch.dto.Sch12IpoCorpSaveReq;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

/** AS-IS server/sch/mapper/sch12_ipo_corp.xml + UpdateDataModel(sch12_ipo_corp) — 주간사 */
@Mapper
public interface SchIpoCorpMapper {
    List<Sch12IpoCorpRes> selectBySearchText(@Param("searchText") String searchText);

    Sch12IpoCorpRes selectById(@Param("ipoCorpId") Long ipoCorpId);

    Long selectNextId();

    int insertIpoCorp(@Param("ipoCorpId") Long ipoCorpId, @Param("req") Sch12IpoCorpSaveReq req);

    int updateIpoCorp(@Param("req") Sch12IpoCorpSaveReq req);

    int deleteIpoCorps(@Param("ids") List<Long> ids);

    /** AS-IS sch12_ipo_corp.selectByCorpName (주간사명이 같은 것) */
    List<Sch12IpoCorpRes> selectByCorpName(@Param("corpName") String corpName);

    /** AS-IS sch12_ipo_corp.selectByCorpNameList (쉼표로 이은 주간사명, 공백 뺀 것) */
    List<Sch12IpoCorpRes> selectByCorpNameList(@Param("corpName") String corpName);
}
