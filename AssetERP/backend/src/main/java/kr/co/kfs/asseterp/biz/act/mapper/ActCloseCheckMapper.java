package kr.co.kfs.asseterp.biz.act.mapper;

import kr.co.kfs.asseterp.biz.act.dto.CloseCheckRes;
import kr.co.kfs.asseterp.biz.act.dto.CloseCheckSaveReq;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

/** AS-IS server/act/mapper/act15_close_check.xml — 마감검증 체크항목 */
@Mapper
public interface ActCloseCheckMapper {
    /** AS-IS selectByText */
    List<CloseCheckRes> selectByText(@Param("searchText") String searchText);

    /** AS-IS selectById */
    CloseCheckRes selectById(@Param("closeCheckId") Long closeCheckId);

    /** AS-IS dbConfig.getSeq (f_create_seq) */
    Long selectNextId();

    /** UpdateDataModel INSERT */
    int insert(@Param("closeCheckId") Long closeCheckId, @Param("req") CloseCheckSaveReq req);

    /** UpdateDataModel UPDATE */
    int update(@Param("req") CloseCheckSaveReq req);
}
