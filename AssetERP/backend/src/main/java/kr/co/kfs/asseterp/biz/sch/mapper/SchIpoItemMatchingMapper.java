package kr.co.kfs.asseterp.biz.sch.mapper;

import kr.co.kfs.asseterp.biz.sch.dto.Sch15IpoItemMatchingRes;
import kr.co.kfs.asseterp.biz.sch.dto.Sch15IpoItemMatchingSaveReq;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

/** AS-IS server/sch/mapper/sch15_ipo_item_matching.xml + UpdateDataModel(sch15_ipo_item_matching) — IPO 종목코드 매칭 */
@Mapper
public interface SchIpoItemMatchingMapper {
    List<Sch15IpoItemMatchingRes> selectByText(@Param("searchText") String searchText);

    Sch15IpoItemMatchingRes selectById(@Param("id") Long id);

    Long selectNextId();

    int insertMatching(@Param("id") Long id, @Param("req") Sch15IpoItemMatchingSaveReq req);

    int updateMatching(@Param("req") Sch15IpoItemMatchingSaveReq req);

    int deleteMatchings(@Param("ids") List<Long> ids);
}
