package kr.co.kfs.asseterp.biz.ics.mapper;

import kr.co.kfs.asseterp.biz.ics.dto.IcsRevisionHistoryRes;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface IcsRevisionHistoryMapper {

    /** AS-IS ics20_revision_history.selectByClassTreeId */
    List<IcsRevisionHistoryRes> selectByClassTreeId(@Param("classTreeId") Long classTreeId);

    /** AS-IS ics20_revision_history.updateContent */
    int updateContent(@Param("revisionHistoryId") Long revisionHistoryId, @Param("content") String content);
}
